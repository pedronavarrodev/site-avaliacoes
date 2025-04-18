import Link from 'next/link'
import { FaClock } from 'react-icons/fa'

export default function PendentePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-yellow-100 rounded-full p-3">
            <FaClock className="h-16 w-16 text-yellow-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pagamento em Processamento
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Seu pagamento está sendo processado. Assim que confirmado, você receberá um email com mais informações.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            O que acontece agora?
          </h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-yellow-500">•</span>
              <span className="ml-3">
                Aguarde a confirmação do pagamento (pode levar alguns minutos)
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-yellow-500">•</span>
              <span className="ml-3">
                Você receberá um email quando o pagamento for confirmado
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-yellow-500">•</span>
              <span className="ml-3">
                As avaliações começarão a aparecer em até 24 horas após a confirmação
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  )
} 