import Catalogo from './Catalogo'
import { useEffect, useState } from 'react'
import { api } from './api'
import { Package, DollarSign, Activity, TrendingUp, LayoutDashboard, Search } from 'lucide-react'



interface Stats {
  total_produtos: number
  receita_total: number
  media_geral_loja: number
}

interface Entrega {
  status_entrega: string
  quantidade: number
}

export default function App() {
  const [view, setView] = useState<'dashboard' | 'produtos'>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [entregas, setEntregas] = useState<Entrega[]>([])

  // Busca os dados do backend quando a tela carrega
  useEffect(() => {
    if (view === 'dashboard') {
      Promise.all([
        api.get('/dashboard/resumo'),
        api.get('/dashboard/performance-entregas')
      ]).then(([resStats, resEntregas]) => {
        setStats(resStats.data)
        setEntregas(resEntregas.data)
      }).catch(err => console.error("Erro ao buscar dados:", err))
    }
  }, [view])

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-10 text-indigo-600">
          <Package size={32} />
          <h1 className="text-xl font-bold text-gray-800">E-Commerce<br/><span className="text-sm text-indigo-600">Manager Pro</span></h1>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setView('produtos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'produtos' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Search size={20} /> Catálogo
          </button>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
              <p className="text-gray-500">Métricas atualizadas em tempo real.</p>
            </header>

            {!stats ? (
              <div className="text-center py-20 text-gray-500 animate-pulse">Carregando métricas do banco de dados...</div>
            ) : (
              <>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><Package size={28} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Produtos Cadastrados</p>
                      <p className="text-2xl font-bold">{stats.total_produtos}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign size={28} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Receita Total</p>
                      <p className="text-2xl font-bold">R$ {stats.receita_total.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-amber-50 rounded-xl text-amber-500"><Activity size={28} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Avaliação Média</p>
                      <p className="text-2xl font-bold">{stats.media_geral_lojas} / 5</p>
                    </div>
                  </div>
                </div>

                {/* Logística */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800">Status de Entregas</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {entregas.map((e) => (
                      <div key={e.status_entrega}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-gray-700">{e.status_entrega}</span>
                          <span className="text-gray-500 font-medium">{e.quantidade.toLocaleString('pt-BR')} pedidos</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${e.status_entrega === 'No Prazo' ? 'bg-emerald-500' : e.status_entrega === 'Atrasado' ? 'bg-red-500' : 'bg-gray-400'}`}
                            style={{ width: `${(e.quantidade / entregas.reduce((a, b) => a + b.quantidade, 0)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {view === 'produtos' && (
          <div className="max-w-5xl mx-auto">
            {view === 'produtos' && (
              <Catalogo />
            )}
          </div>
        )}
      </main>
    </div>
  )
}