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
  5: 249.90,   // Plano Iniciante
  10: 329.90,  // Plano Básico
  15: 449.90,  // Plano Profissional
  20: 519.90,  // Plano Avançado
  50: 999.90   // Plano Empresarial
};

export const maxDuration = 60; // Aumenta o timeout para 60 segundos

export async function POST(request: Request) {
  console.log('Iniciando processamento do pedido...');
  
  try {
    console.log('Conectando ao MongoDB...');
    await dbConnect();
    console.log('Conectado ao MongoDB com sucesso');
    
    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const { nome, email, whatsapp, linkGoogle, quantidade } = body;
    
    // Pega o preço baseado na quantidade
    const precoTotal = PLANOS[quantidade as keyof typeof PLANOS];
    if (!precoTotal) {
      throw new Error('Quantidade inválida');
    }
    
    console.log('Preço calculado:', precoTotal);
    
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
        default_installments: 1
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
      binary_mode: true
    };

    console.log('Criando preferência no Mercado Pago:', preferenceData);
    const result = await preference.create({ body: preferenceData });
    console.log('Resposta do Mercado Pago:', result);

    // Criar pedido no banco
    console.log('Salvando pedido no banco...');
    const pedido = await Pedido.create({
      nome,
      email,
      whatsapp,
      linkGoogle,
      quantidade,
      precoTotal,
      mercadoPagoId: result.id,
      status: 'pendente'
    });
    console.log('Pedido salvo com sucesso:', pedido._id);

    if (!result.init_point) {
      throw new Error('URL de checkout não gerada');
    }

    return NextResponse.json({ 
      pedidoId: pedido._id,
      checkoutUrl: result.init_point
    });
  } catch (error: any) {
    console.error('Erro detalhado:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "Erro ao processar pedido: " + error.message },
      { status: 500 }
    );
  }
}