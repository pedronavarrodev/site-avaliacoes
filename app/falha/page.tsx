import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function FalhaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 rounded-full p-3">
            <FaExclamationTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ops! Algo deu errado
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Não foi possível processar seu pagamento. Por favor, tente novamente.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            O que pode ter acontecido?
          </h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-red-500">•</span>
              <span className="ml-3">
                Cartão recusado ou com limite insuficiente
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-red-500">•</span>
              <span className="ml-3">
                Problemas de conexão durante o processamento
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-red-500">•</span>
              <span className="ml-3">
                Dados do cartão inseridos incorretamente
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link 
            href="/comprar"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tentar Novamente
          </Link>

          <div>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 