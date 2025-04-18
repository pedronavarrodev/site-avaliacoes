'use client'

import { useState } from 'react'
import { Suspense } from 'react'

function ComprarForm() {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async (plano: 'iniciante' | 'profissional' | 'empresarial') => {
    setLoading(true)
    try {
      const response = await fetch('/api/criar-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plano }),
      })

      const data = await response.json()
      
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        throw new Error('URL de pagamento não encontrada')
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar pagamento. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gold-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gold-600 to-gold-400">
          Escolha seu Plano
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Iniciante</h3>
              <div className="text-4xl font-bold mb-6">R$ 249,90</div>
              <p className="text-gray-600 mb-6">5 Avaliações</p>
              <button 
                onClick={() => handlePurchase('iniciante')} 
                className="w-full py-3 px-6 text-white bg-gold-500 rounded-lg hover:bg-gold-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Comprar Agora'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-gold-500 to-gold-400 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-gold-600 text-sm font-bold px-4 py-1 rounded-full shadow-md">
              Mais Popular
            </div>
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Profissional</h3>
              <div className="text-5xl font-bold mb-6">R$ 449,90</div>
              <p className="mb-6">15 Avaliações</p>
              <button 
                onClick={() => handlePurchase('profissional')} 
                className="w-full py-4 px-6 text-gold-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-bold"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Comprar Agora'}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Empresarial</h3>
              <div className="text-4xl font-bold mb-6">R$ 749,90</div>
              <p className="text-gray-600 mb-6">30 Avaliações</p>
              <button 
                onClick={() => handlePurchase('empresarial')} 
                className="w-full py-3 px-6 text-white bg-gold-500 rounded-lg hover:bg-gold-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Comprar Agora'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
                <p className="text-lg">Processando seu pedido...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ComprarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    }>
      <ComprarForm />
    </Suspense>
  )
} 