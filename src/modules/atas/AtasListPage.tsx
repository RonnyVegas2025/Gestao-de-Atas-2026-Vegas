import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export const AtasListPage: React.FC = () => {
  const {
    atas,
    categorias,
    deleteAta,
    simulateDownload,
  } = useData();

  const navigate = useNavigate();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedPeriod, setSelectedPeriod] = useState('Todos');
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'numero' | 'data' | 'downloadsCount'>('numero');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Status Classes
  const getStatusClasses = (status: string) => {
    return status === 'Rascunho'
      ? 'bg-amber-50 text-amber-700 border border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  // Color classes for category badge
  const getCatColorClasses = (corName: string) => {
    switch (corName) {
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'indigo': return 'bg-indigo-100 text-indigo-700';
      case 'emerald': return 'bg-emerald-100 text-emerald-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      case 'sky': return 'bg-sky-100 text-sky-700';
      case 'rose': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Sorting list logic
  const handleSort = (field: 'numero' | 'data' | 'downloadsCount') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Apply search and filter criteria
  const processedAtas = atas
    .filter(ata => {
      // 1. Search text match
      const titleMatch = ata.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const numMatch = ata.numero.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = ata.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      if (searchTerm && !titleMatch && !numMatch && !descMatch) return false;

      // 2. Category Match
      if (selectedCategory !== 'Todas') {
        const cat = categorias.find(c => c.id === ata.categoriaId || c.nome === selectedCategory);
        if (ata.categoriaId !== cat?.id) return false;
      }

      // 3. Status Match
      if (selectedStatus !== 'Todos' && ata.status !== selectedStatus) return false;

      // 4. Period Match
      if (selectedPeriod !== 'Todos') {
        const ataYear = new Date(ata.data).getFullYear();
        if (selectedPeriod === '2025' && ataYear !== 2025) return false;
        if (selectedPeriod === '2026' && ataYear !== 2026) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'numero') {
        comparison = a.numero.localeCompare(b.numero);
      } else if (sortField === 'data') {
        comparison = a.data.localeCompare(b.data);
      } else if (sortField === 'downloadsCount') {
        comparison = a.downloadsCount - b.downloadsCount;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Export List simulators
  const handleExportExcel = () => {
    const csvContent = [
      ["Numero da Ata", "Titulo", "Categoria", "Data", "Presidente", "Status"],
      ...processedAtas.map(a => [
        a.numero,
        `"${a.titulo.replace(/"/g, '""')}"`,
        categorias.find(c => c.id === a.categoriaId)?.nome || "Geral",
        a.data,
        a.presidente,
        a.status
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atas_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDFList = () => {
    let pdfSummary = `SISTEMA DE GESTÃO DE ATAS - EXPORT COMPILADO\n`;
    pdfSummary += `Data de Emissão: ${new Date().toLocaleString()}\n`;
    pdfSummary += `--------------------------------------------------------\n\n`;

    processedAtas.forEach((a, i) => {
      const cat = categorias.find(c => c.id === a.categoriaId)?.nome || "Geral";
      pdfSummary += `${i + 1}. [${a.status}] ${a.numero}\n`;
      pdfSummary += `   Título: ${a.titulo}\n`;
      pdfSummary += `   Categoria: ${cat} | Reunião: ${a.data} às ${a.horario}\n`;
      pdfSummary += `   Local: ${a.local}\n`;
      pdfSummary += `   Decisões: ${a.descricao.slice(0, 100)}...\n`;
      pdfSummary += `--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([pdfSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atas_list_pdf_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteModal) {
      deleteAta(showDeleteModal, "Administrador");
      setShowDeleteModal(null);
    }
  };

  return (
    <div id="atas-list-view" className="space-y-6">
      
      {/* HEADER ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-950">Portal Geral de Atas</h2>
          <p className="text-xs text-gray-400 mt-1">Consulte, exporte e edite documentos e atas registradas</p>
        </div>

        {/* TOP LEVEL EXPORTS & NEW WORKFLOW */}
        <div className="flex flex-wrap items-center gap-2">
          {/* EXPORT EXCEL */}
          <button
            id="btn-exportar-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Exportar para formato .CSV (Excel)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden md:inline">Exportar Excel</span>
          </button>

          {/* EXPORT PDF */}
          <button
            id="btn-exportar-pdf"
            onClick={handleExportPDFList}
            className="flex items-center gap-1.5 px-3 py-2 border border-red-100 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Exportar relatório consolidado"
          >
            <FileCheck className="w-4 h-4" />
            <span className="hidden md:inline">Exportar PDF</span>
          </button>

          {/* NEW RECORD */}
          <button
            id="btn-criar-ata-principal"
            onClick={() => navigate('/atas/nova')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Ata</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BOX */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        
        {/* UPPER SEARCH LINE */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="input-pesquisar-atas"
            type="text"
            placeholder="Pesquise por número da ata, título ou palavras presentes no conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all font-medium"
          />
        </div>

        {/* MULTIPLE DROPDOWN FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-left">
          
          {/* FILTER: CATEGORIA */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Filtrar Categoria
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <select
                id="select-filtro-categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todas as Categorias</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.nome}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* FILTER: STATUS */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Filtrar Status
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <select
                id="select-filtro-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Publicada">Publicada</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>
          </div>

          {/* FILTER: PERIODO */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Filtrar Período (Ano)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              <select
                id="select-filtro-periodo"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
              >
                <option value="Todos">Sempre</option>
                <option value="2026">Ano Reunião 2026</option>
                <option value="2025">Ano Reunião 2025</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* DOCUMENT DATATABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                {/* HEADERS WITH ORDERING TRIGGERS */}
                <th className="py-4.5 px-6 font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('numero')}>
                  <div className="flex items-center gap-1.5">
                    <span>Nº da Ata</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4.5 px-6 font-bold">Título do Documento</th>
                <th className="py-4.5 px-6 font-bold">Categoria</th>
                <th className="py-4.5 px-6 font-bold">Responsável Presidente</th>
                <th className="py-4.5 px-6 font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('data')}>
                  <div className="flex items-center gap-1.5">
                    <span>Data</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4.5 px-6 font-bold">Status</th>
                <th className="py-4.5 px-6 font-bold text-right pr-8">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-50 text-xs">
              {processedAtas.map((ata) => {
                const cat = categorias.find(c => c.id === ata.categoriaId);
                const isDraft = ata.status === 'Rascunho';

                return (
                  <tr key={ata.id} className="hover:bg-gray-50/50 transition-all">
                    
                    {/* Número */}
                    <td className="py-4 px-6 font-semibold text-gray-900 font-mono">
                      {ata.numero}
                    </td>

                    {/* Título */}
                    <td className="py-4 px-6 font-medium text-gray-600 max-w-[260px] break-words">
                      {ata.titulo}
                    </td>

                    {/* Badge Categoria */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase ${getCatColorClasses(cat?.cor || 'gray')}`}>
                        {cat?.nome || 'Geral'}
                      </span>
                    </td>

                    {/* Presidente da Mesa */}
                    <td className="py-4 px-6 font-medium text-gray-500">
                      {ata.presidente}
                    </td>

                    {/* Data formatada */}
                    <td className="py-4 px-6 font-medium text-gray-500">
                      {ata.data.split('-').reverse().join('/')}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusClasses(ata.status)}`}>
                        {ata.status}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => navigate(`/atas/${ata.id}`)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          title="Visualizar ata oficial"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/atas/${ata.id}/editar`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50/30 rounded-lg transition-all"
                          title="Editar ata"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => simulateDownload(ata.id, ata.titulo)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-lg transition-all"
                          title="Baixar ata oficial"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setShowDeleteModal(ata.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50/30 rounded-lg transition-all"
                          title="Excluir ata"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {processedAtas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <FileText className="w-10 h-10 opacity-30 mx-auto mb-3" />
                    <p className="text-sm font-semibold">Nenhuma ata registrada corresponde aos filtros</p>
                    <p className="text-xs text-gray-400 mt-1">Limpe sua busca para exibir os relatórios originais</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info counts */}
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium">
            Exibindo {Math.min(processedAtas.length, pageSize)} do total de {processedAtas.length} registros filtrados
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Páginas:</span>
              <select
                id="select-registros"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value={10}>10 registros</option>
                <option value={25}>25 registros</option>
                <option value={50}>50 registros</option>
                <option value={100}>100 registros</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button disabled className="p-1.5 border border-slate-200 rounded-md text-slate-350 cursor-not-allowed">&lt;</button>
              <button className="w-7 h-7 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold">1</button>
              <button disabled className="p-1.5 border border-slate-200 rounded-md text-slate-350 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION DELETION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-scale-up text-left">
            <h4 className="text-base font-bold text-gray-900">Mover para a Lixeira?</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Deseja realmente mover este documento para a lixeira? Ele continuará disponível para recuperação ou exclusão definitiva a qualquer momento.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                Mover para o Lixo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
