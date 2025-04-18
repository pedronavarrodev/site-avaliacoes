import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Pedido from '@/models/Pedido';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado');
}

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Definição dos preços dos planos
const PLANOS = {
  5: 25.00,   // Plano Iniciante
  15: 10.00,  // Plano Profissional
  20: 100.00  // Plano Empresarial
};

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { nome, email, linkGoogle, quantidade } = body;
    
    // Pega o preço baseado na quantidade ou usa o preço padrão
    const precoTotal = PLANOS[quantidade as keyof typeof PLANOS] || quantidade * 5;
    
    const preference = new Preference(client);
    const preferenceData = {
      items: [
        {
          id: "avaliacao-google",
          title: "Avaliações Google",
          description: `${quantidade} avaliações para seu negócio`,
          quantity: 1,
          unit_price: Number(precoTotal.toFixed(2)),
          currency_id: "BRL",
          category_id: "services"
        }
      ],
      payer: {
        name: nome,
        email: email
      },
      payment_methods: {
        installments: 1,
        default_installments: 1,
        excluded_payment_methods: [{ id: "ticket" }], // Exclui boleto
        excluded_payment_types: [{ id: "ticket" }]    // Exclui boleto
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/falha`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pendente`
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
      statement_descriptor: "AVALIACOES GOOGLE",
      external_reference: "PEDIDO-" + Date.now(),
      expires: false,
      binary_mode: true // Força aprovação ou rejeição imediata
    };

    console.log('Criando preferência:', preferenceData);
    const result = await preference.create({ body: preferenceData });
    console.log('Resposta do Mercado Pago:', result);

    // Criar pedido no banco
    const pedido = await Pedido.create({
      nome,
      email,
      linkGoogle,
      quantidade,
      precoTotal,
      mercadoPagoId: result.id,
      status: 'pendente'
    });

    if (!result.init_point) {
      throw new Error('URL de checkout não gerada');
    }

    return NextResponse.json({ 
      pedidoId: pedido._id,
      checkoutUrl: result.init_point
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "Erro ao processar pedido: " + error.message },
      { status: 500 }
    );
  }
}