import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Pedido from '@/models/Pedido'
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (body.type === 'payment') {
      const paymentId = body.data.id
      const payment = await mercadopago.payment.findById(paymentId)
      
      if (payment.body.status === 'approved') {
        await dbConnect()
        
        await Pedido.findOneAndUpdate(
          { mercadoPagoId: payment.body.external_reference },
          { status: 'pago' }
        )
        
        return NextResponse.json({ success: true })
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
} 