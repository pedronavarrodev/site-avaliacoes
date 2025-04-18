import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Pedido from '@/models/Pedido'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  console.log('Webhook recebido');
  
  try {
    const body = await request.json()
    console.log('Dados do webhook:', body);
    
    if (body.type === 'payment') {
      const paymentId = body.data.id
      console.log('ID do pagamento:', paymentId);
      
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });
      console.log('Dados do pagamento:', paymentData);
      
      await dbConnect()
      
      let status = 'pendente';
      if (paymentData.status === 'approved') {
        status = 'pago';
      } else if (paymentData.status === 'cancelled' || paymentData.status === 'rejected') {
        status = 'cancelado';
      }
      
      // Atualiza usando o external_reference que vem do pagamento
      const pedido = await Pedido.findOneAndUpdate(
        { mercadoPagoId: paymentData.external_reference },
        { status: status },
        { new: true }
      );
      
      console.log('Pedido atualizado:', pedido);
      
      return NextResponse.json({ success: true, status: status });
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Erro ao processar webhook: ' + error.message },
      { status: 500 }
    );
  }
} 