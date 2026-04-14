import { useState, useEffect } from 'react';
import { api } from './api';
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';


export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?:string;
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const LIMIT = 8; 

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const skip = (pagina - 1) * LIMIT; 
      const response = await api.get('/produtos', {
        params: { skip: skip, limit: LIMIT, busca: busca }
      });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar catálogo:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    buscarProdutos();
  }, [pagina]);


  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(1); 
    buscarProdutos();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Catálogo de Produtos</h2>
          <p className="text-gray-500">Gerencie e pesquise o produtos.</p>
        </div>

        {/* Barra de Busca */}
        <form onSubmit={handleBusca} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <button type="submit" className="hidden">Buscar</button>
        </form>
      </header>

      {/* Grade de Produtos */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">
          Buscando produtos no banco de dados...
        </div>
      ) : produtos.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          Nenhum produto encontrado para "{busca}".
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {produtos.map((p) => (
              <div key={p.id_produto} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-full h-32 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
                    {p.imagem_url ? (
                        <img 
                        src={p.imagem_url} 
                        alt={p.nome_produto} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300 p-2"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Sem+Foto";
                        }}
                        />
                    ) : (
                        <Package size={40} className="text-gray-300 group-hover:text-indigo-300 transition-colors" />
                    )}
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  {p.categoria_produto}
                </span>
                <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2" title={p.nome_produto}>
                  {p.nome_produto}
                </h3>
                <p className="text-sm text-gray-500 mt-2">ID: {p.id_produto.substring(0, 8)}...</p>
              </div>
            ))}
          </div>

          {/* Controles de Paginação */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            <span className="font-semibold text-gray-800">
              Página {pagina}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={produtos.length < LIMIT} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}