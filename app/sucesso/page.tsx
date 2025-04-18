import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 rounded-full p-3">
            <FaCheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pagamento Confirmado!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Seu pedido foi processado com sucesso. Em breve você receberá as avaliações no seu estabelecimento.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Passos
          </h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                Nossas avaliações começarão a aparecer em até 24 horas
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                As avaliações serão postadas gradualmente para manter a naturalidade
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                Você receberá um email com a confirmação do pedido
              </span>
            </li>
          </ul>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  )
} 