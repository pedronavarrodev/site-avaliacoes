'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaSearch, FaFilter, FaDownload, FaQuoteLeft, FaTrash, FaUserCircle } from 'react-icons/fa'
import Image from 'next/image'

interface Pedido {
  _id: string
  nome: string
  email: string
  whatsapp?: string
  linkGoogle: string
  quantidade: number
  status: string
  precoTotal: number
  dataCriacao: string
}

interface Depoimento {
  _id: string
  nome: string
  empresa: string
  texto: string
  foto: string
  ativo: boolean
  dataCriacao: string
}

interface StatusSelectProps {
  status: string;
  pedidoId: string;
  onStatusChange: (id: string, newStatus: string) => void;
}

function StatusSelect({ status, pedidoId, onStatusChange }: StatusSelectProps) {
  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(pedidoId, e.target.value)}
      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full 
        ${status === 'pago' ? 'bg-green-100 text-green-800' : 
          status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'}`}
    >
      <option value="pendente">pendente</option>
      <option value="pago">pago</option>
      <option value="cancelado">cancelado</option>
    </select>
  );
}

export default function AdminPage() {
  const [isAutenticado, setIsAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [lembrarLogin, setLembrarLogin] = useState(false)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtro, setFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([])
  const [novoDepoimento, setNovoDepoimento] = useState({
    nome: '',
    empresa: '',
    texto: '',
    foto: '',
  })
  const [atualizando, setAtualizando] = useState(false)
  const [depoimentoEmEdicao, setDepoimentoEmEdicao] = useState<Depoimento | null>(null);
  const [depoimentoExpandido, setDepoimentoExpandido] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    // Verifica se há credenciais salvas
    const senhaArmazenada = localStorage.getItem('adminSenha')
    const dataExpiracao = localStorage.getItem('adminExpiracao')
    
    if (senhaArmazenada && dataExpiracao) {
      // Verifica se ainda não expirou
      if (new Date().getTime() < Number(dataExpiracao)) {
        setSenha(senhaArmazenada)
        handleLoginAutomatico(senhaArmazenada)
      } else {
        // Remove credenciais expiradas
        localStorage.removeItem('adminSenha')
        localStorage.removeItem('adminExpiracao')
      }
    }
  }, [])

  const handleLoginAutomatico = async (senhaArmazenada: string) => {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: senhaArmazenada }),
    })

    if (res.ok) {
      setIsAutenticado(true)
      carregarPedidos()
      carregarDepoimentos()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    })

    if (res.ok) {
      setIsAutenticado(true)
      carregarPedidos()
      carregarDepoimentos()

      if (lembrarLogin) {
        // Salva a senha e a data de expiração (30 dias)
        const dataExpiracao = new Date().getTime() + (30 * 24 * 60 * 60 * 1000)
        localStorage.setItem('adminSenha', senha)
        localStorage.setItem('adminExpiracao', dataExpiracao.toString())
      }
    } else {
      alert('Senha incorreta')
    }
  }

  const carregarPedidos = async () => {
    const res = await fetch('/api/admin/pedidos')
    if (res.ok) {
      const data = await res.json()
      setPedidos(data)
    }
  }

  const carregarDepoimentos = async () => {
    const res = await fetch('/api/admin/depoimentos')
    if (res.ok) {
      const data = await res.json()
      setDepoimentos(data)
    }
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchFiltro = 
      pedido.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      pedido.email.toLowerCase().includes(filtro.toLowerCase()) ||
      pedido._id.toLowerCase().includes(filtro.toLowerCase())
    
    const matchStatus = statusFiltro === 'todos' || pedido.status === statusFiltro
    
    return matchFiltro && matchStatus
  })

  const exportarCSV = () => {
    const headers = ['ID', 'Data', 'Nome', 'Email', 'Link Google', 'Quantidade', 'Status', 'Valor']
    const data = pedidosFiltrados.map(p => [
      p._id,
      new Date(p.dataCriacao).toLocaleDateString(),
      p.nome,
      p.email,
      p.linkGoogle,
      p.quantidade,
      p.status,
      p.precoTotal.toFixed(2)
    ])

    const csv = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pedidos.csv'
    a.click()
  }

  const handleNovoDepoimento = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/depoimentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...novoDepoimento,
        senha: senha,
      }),
    })

    if (res.ok) {
      setNovoDepoimento({ nome: '', empresa: '', texto: '', foto: '' })
      carregarDepoimentos()
    } else {
      alert('Erro ao criar depoimento')
    }
  }

  const excluirDepoimento = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return

    const res = await fetch(`/api/admin/depoimentos?id=${id}&senha=${senha}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      carregarDepoimentos()
    } else {
      alert('Erro ao excluir depoimento')
    }
  }

  const handleStatusChange = async (pedidoId: string, newStatus: string) => {
    if (!confirm(`Deseja realmente alterar o status para ${newStatus}?`)) return;
    
    setAtualizando(true);
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${senha}` // Usa a senha como token
        },
        body: JSON.stringify({ 
          pedidoId, 
          status: newStatus 
        })
      });

      if (res.ok) {
        // Atualiza o pedido localmente
        setPedidos(pedidos.map(p => 
          p._id === pedidoId ? { ...p, status: newStatus } : p
        ));
      } else {
        alert('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    } finally {
      setAtualizando(false);
    }
  };

  const handleDeletePedido = async (pedidoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/pedidos?id=${pedidoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${senha}`
        }
      });

      if (res.ok) {
        setPedidos(pedidos.filter(p => p._id !== pedidoId));
      } else {
        alert('Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      alert('Erro ao excluir pedido');
    }
  };

  const handleEditarDepoimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depoimentoEmEdicao) return;

    try {
      const res = await fetch(`/api/admin/depoimentos/${depoimentoEmEdicao._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${senha}`
        },
        body: JSON.stringify(depoimentoEmEdicao),
      });

      if (res.ok) {
        setDepoimentos(depoimentos.map(d => 
          d._id === depoimentoEmEdicao._id ? depoimentoEmEdicao : d
        ));
        setDepoimentoEmEdicao(null);
      } else {
        alert('Erro ao atualizar depoimento');
      }
    } catch (error) {
      console.error('Erro ao atualizar depoimento:', error);
      alert('Erro ao atualizar depoimento');
    }
  };

  if (!isAutenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div>
            <div className="flex justify-center">
              <div className="bg-blue-100 rounded-full p-3">
                <FaLock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Acesso Administrativo
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="senha" className="sr-only">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Senha de Administrador"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="lembrar-login"
                name="lembrar-login"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={lembrarLogin}
                onChange={(e) => setLembrarLogin(e.target.checked)}
              />
              <label htmlFor="lembrar-login" className="ml-2 block text-sm text-gray-900">
                Lembrar login por 30 dias
              </label>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filtros e Ações */}
        <div className="bg-white rounded-lg shadow px-4 py-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por nome, email ou ID..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <FaFilter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={exportarCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaDownload className="h-5 w-5 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow px-4 py-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Total de Pedidos</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{pedidos.length}</dd>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Pedidos Pagos</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {pedidos.filter(p => p.status === 'pago').length}
            </dd>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Pedidos Pendentes</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">
              {pedidos.filter(p => p.status === 'pendente').length}
            </dd>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Faturamento Total</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              R$ {pedidos.reduce((acc, p) => acc + (p.status === 'pago' ? p.precoTotal : 0), 0).toFixed(2)}
            </dd>
          </div>
        </div>

        {/* Seção de Depoimentos */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Gerenciar Depoimentos</h2>
            
            {/* Formulário de Novo Depoimento */}
            <form onSubmit={handleNovoDepoimento} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={novoDepoimento.nome}
                    onChange={(e) => setNovoDepoimento({...novoDepoimento, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={novoDepoimento.empresa}
                    onChange={(e) => setNovoDepoimento({...novoDepoimento, empresa: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Foto (opcional)
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={novoDepoimento.foto}
                    onChange={(e) => setNovoDepoimento({...novoDepoimento, foto: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depoimento
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  value={novoDepoimento.texto}
                  onChange={(e) => setNovoDepoimento({...novoDepoimento, texto: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Adicionar Depoimento
              </button>
            </form>

            {/* Lista de Depoimentos */}
            <div className="grid grid-cols-1 gap-4">
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento._id}
                  className="bg-white border rounded-lg shadow-sm p-4"
                >
                  {depoimentoEmEdicao?._id === depoimento._id ? (
                    // Formulário de Edição
                    <form onSubmit={handleEditarDepoimento} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nome</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={depoimentoEmEdicao.nome}
                            onChange={(e) => setDepoimentoEmEdicao({
                              ...depoimentoEmEdicao,
                              nome: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Empresa</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={depoimentoEmEdicao.empresa}
                            onChange={(e) => setDepoimentoEmEdicao({
                              ...depoimentoEmEdicao,
                              empresa: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Foto URL</label>
                        <input
                          type="url"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={depoimentoEmEdicao.foto}
                          onChange={(e) => setDepoimentoEmEdicao({
                            ...depoimentoEmEdicao,
                            foto: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Depoimento</label>
                        <textarea
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={4}
                          value={depoimentoEmEdicao.texto}
                          onChange={(e) => setDepoimentoEmEdicao({
                            ...depoimentoEmEdicao,
                            texto: e.target.value
                          })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setDepoimentoEmEdicao(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Visualização Compacta
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-blue-100">
                            {depoimento.foto ? (
                              <Image
                                src={depoimento.foto}
                                alt={depoimento.nome}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaUserCircle className="w-full h-full text-blue-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">{depoimento.nome}</h3>
                            <p className="text-xs text-gray-500">{depoimento.empresa}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setDepoimentoExpandido(
                              depoimentoExpandido === depoimento._id ? null : depoimento._id
                            )}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {depoimentoExpandido === depoimento._id ? 'Recolher' : 'Expandir'}
                          </button>
                          <button
                            onClick={() => setDepoimentoEmEdicao(depoimento)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluirDepoimento(depoimento._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm text-gray-600 ${depoimentoExpandido !== depoimento._id && 'line-clamp-2'}`}>
                        {depoimento.texto}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(depoimento.dataCriacao).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qtd
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pedido.dataCriacao).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pedido.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{pedido.email}</div>
                    {pedido.whatsapp && (
                      <div className="text-sm text-gray-500">
                        <a href={`https://wa.me/${pedido.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                          {pedido.whatsapp}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={pedido.linkGoogle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Local
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pedido.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusSelect 
                      status={pedido.status}
                      pedidoId={pedido._id}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {pedido.precoTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeletePedido(pedido._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 