'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaGoogle, FaStar, FaCheck } from 'react-icons/fa'

const PLANOS = {
  iniciante: {
    nome: 'Iniciante',
    quantidade: 5,
    preco: 25.00
  },
  profissional: {
    nome: 'Profissional',
    quantidade: 15,
    preco: 75.00
  },
  empresarial: {
    nome: 'Empresarial',
    quantidade: 20,
    preco: 100.00
  }
}

function ComprarForm() {
  const searchParams = useSearchParams()
  const planoSelecionado = searchParams.get('plano')

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    linkGoogle: '',
    quantidade: planoSelecionado ? PLANOS[planoSelecionado as keyof typeof PLANOS].quantidade : 5
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/criar-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaGoogle className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold ml-4">Comprar Avaliações</h1>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaStar className="text-yellow-400 mr-2" />
                Benefícios Inclusos
              </h2>
              <ul className="space-y-3">
                {[
                  'Avaliações de contas reais e verificadas',
                  'Entrega gradual para maior naturalidade',
                  'Suporte prioritário',
                  'Garantia de permanência',
                ].map((beneficio, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <FaCheck className="text-green-500 mr-2" />
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email para Contato
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkGoogle">
                  Link do seu Negócio no Google
                </label>
                <input
                  type="url"
                  id="linkGoogle"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={formData.linkGoogle}
                  onChange={(e) => setFormData({...formData, linkGoogle: e.target.value})}
                  required
                  placeholder="https://www.google.com/maps/place/seu-negocio"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantidade">
                  Quantidade de Avaliações
                </label>
                <select
                  id="quantidade"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: Number(e.target.value)})}
                >
                  <option value={5}>5 avaliações - R$ 25,00</option>
                  <option value={15}>15 avaliações - R$ 75,00</option>
                  <option value={20}>20 avaliações - R$ 100,00</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Prosseguir para Pagamento
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Pagamento processado de forma segura via Mercado Pago
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComprarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ComprarForm />
    </Suspense>
  )
} 