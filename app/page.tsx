'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStar, FaChartLine, FaUsers, FaShieldAlt, FaQuoteLeft, FaUserCircle } from 'react-icons/fa'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import dbConnect from '@/lib/mongodb'
import Depoimento from '@/models/Depoimento'

interface Depoimento {
  _id: string
  nome: string
  empresa: string
  texto: string
  foto: string
  ativo: boolean
  dataCriacao: string
}

export default function Home() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarDepoimentos() {
      try {
        const response = await fetch('/api/admin/depoimentos')
        if (response.ok) {
          const data = await response.json()
          setDepoimentos(data.filter((d: Depoimento) => d.ativo))
        }
      } catch (error) {
        console.error('Erro ao carregar depoimentos:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDepoimentos()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Impulsione seu Negócio com Avaliações Positivas
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12">
              Aumente sua credibilidade e visibilidade no Google com avaliações reais e verificadas
            </p>
            <Link 
              href="/comprar" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Comprar Avaliações
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Por que escolher nosso serviço?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FaStar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Avaliações Reais</h3>
              <p className="text-gray-600">Todas as avaliações são feitas por usuários reais e verificados</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <FaChartLine className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Melhor Ranking</h3>
              <p className="text-gray-600">Melhore sua posição nos resultados de busca do Google</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mais Clientes</h3>
              <p className="text-gray-600">Atraia mais clientes com um perfil bem avaliado</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <FaShieldAlt className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Seguro</h3>
              <p className="text-gray-600">Processo seguro e garantido de avaliações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Pacotes Populares</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Iniciante</h3>
                <div className="text-4xl font-bold mb-6">R$ 249,90</div>
                <p className="text-gray-600 mb-6">5 Avaliações</p>
                <Link 
                  href="/comprar?plano=iniciante" 
                  className="inline-block w-full py-3 px-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Escolher Plano
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 text-sm font-bold px-4 py-1 rounded-full">
                Mais Popular
              </div>
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Profissional</h3>
                <div className="text-5xl font-bold mb-6">R$ 449,90</div>
                <p className="mb-6">15 Avaliações</p>
                <Link 
                  href="/comprar?plano=profissional" 
                  className="inline-block w-full py-4 px-6 text-center text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-bold"
                >
                  Escolher Plano
                </Link>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Empresarial</h3>
                <div className="text-4xl font-bold mb-6">R$ 999,90</div>
                <p className="text-gray-600 mb-6">50 Avaliações</p>
                <Link 
                  href="/comprar?plano=empresarial" 
                  className="inline-block w-full py-3 px-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Escolher Plano
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimentos Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">O que nossos clientes dizem</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : depoimentos.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {depoimentos.map((depoimento) => (
                <SwiperSlide key={depoimento._id}>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg h-full flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-blue-100">
                        {depoimento.foto ? (
                          <Image
                            src={depoimento.foto}
                            alt={depoimento.nome}
                            fill
                            sizes="(max-width: 64px) 100vw, 64px"
                            className="object-cover"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.fallback-icon');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center fallback-icon">
                            <FaUserCircle className="w-full h-full text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{depoimento.nome}</p>
                        <p className="text-sm text-gray-500">{depoimento.empresa}</p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <FaQuoteLeft className="w-8 h-8 text-blue-200 mb-4" />
                      <p className="text-gray-600 italic">"{depoimento.texto}"</p>
                    </div>
                    <div className="flex justify-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center text-gray-500">
              Ainda não há depoimentos disponíveis.
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Como funciona o processo de compra de avaliações no Google?</h3>
              <p className="text-gray-600">
                Após entrar em contato conosco, analisaremos o perfil do seu Google Meu Negócio e sugeriremos a quantidade ideal de avaliações para aumentar a visibilidade e credibilidade da sua empresa. Caso prefira, você também pode optar por um número fixo de avaliações. Após definir a quantidade, solicitamos 50% do valor do pacote para iniciar o processo. Assim que todas as avaliações forem entregues, solicitamos o pagamento do valor restante. Oferecemos suporte completo durante todo o processo para garantir a sua satisfação e o melhor resultado.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Quais métodos de pagamentos vocês aceitam?</h3>
              <p className="text-gray-600">
                Aceitamos apenas PIX para garantir a segurança e agilidade nas transações.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Quanto tempo leva para ver os resultados?</h3>
              <p className="text-gray-600">
                Os resultados podem variar, mas muitos de nossos clientes notam uma melhoria significativa na visibilidade e na reputação do seu negócio em poucos dias.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Como vocês garantem que as avaliações são autênticas?</h3>
              <p className="text-gray-600">
                Trabalhamos apenas com clientes reais que interagem genuinamente com o seu negócio, garantindo que todas as avaliações sejam válidas segundo os algoritmos do Google.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Pronto para impulsionar seu negócio?
          </h2>
          <Link 
            href="/comprar" 
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Começar Agora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
} 