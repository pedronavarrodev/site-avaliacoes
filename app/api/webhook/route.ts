import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Pedido from '@/models/Pedido'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string 
});

export const maxDuration = 60; // Máximo permitido no plano hobby da Vercel

export async function POST(request: Request) {
  console.log('Webhook recebido');
  
  try {
    const body = await request.json()
    console.log('Dados do webhook:', body);
    
    // Conecta ao MongoDB primeiro
    await dbConnect()
    
    if (body.type === 'payment') {
      const paymentId = body.data.id
      console.log('ID do pagamento:', paymentId);
      
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });
      console.log('Dados do pagamento:', paymentData);
      
      let status = 'pendente';
      if (paymentData.status === 'approved') {
        status = 'pago';
      } else if (paymentData.status === 'cancelled' || paymentData.status === 'rejected') {
        status = 'cancelado';
      }

      // Busca usando o external_reference do pagamento
      const externalReference = paymentData.external_reference;
      console.log('External reference:', externalReference);

      const pedido = await Pedido.findOneAndUpdate(
        { mercadoPagoId: externalReference },
        { 
          status: status,
          $set: { 
            "pagamento.status": paymentData.status,
            "pagamento.detalhes": paymentData,
            "pagamento.atualizadoEm": new Date()
          }
        },
        { new: true }
      );
      
      console.log('Pedido encontrado:', pedido ? pedido._id : 'Não encontrado');
      console.log('Status atualizado para:', status);
      
      if (!pedido) {
        console.error('Pedido não encontrado para external_reference:', externalReference);
        return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        status: status,
        pedidoId: pedido._id 
      });
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