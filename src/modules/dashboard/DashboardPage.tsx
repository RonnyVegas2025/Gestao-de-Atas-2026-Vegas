import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FolderTree,
  Download,
  Users,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  FileDown,
  Upload,
  Clock,
  MoreVertical,
  Plus,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'motion/react';

// Monthly data for published minutes
const MONTHLY_DATA = [
  { name: 'Jan', atas: 0 },
  { name: 'Fev', atas: 0 },
  { name: 'Mar', atas: 0 },
  { name: 'Abr', atas: 0 },
  { name: 'Mai', atas: 0 },
  { name: 'Jun', atas: 0 },
  { name: 'Jul', atas: 0 },
  { name: 'Ago', atas: 0 },
  { name: 'Set', atas: 0 },
  { name: 'Out', atas: 0 },
  { name: 'Nov', atas: 0 },
  { name: 'Dez', atas: 0 },
];

export const DashboardPage: React.FC = () => {
  const {
    atas,
    categorias,
    uploads,
    atividades,
    totalDownloads,
    usuarios,
    deleteAta,
    simulateDownload,
  } = useData();

  const navigate = useNavigate();

  const [yearFilter, setYearFilter] = useState<'Este ano' | 'Ano anterior'>('Este ano');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas as categorias');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Derive counts dynamically from real DataProvider state
  const totalAtasCount = atas.length;
  const categoriesCount = categorias.length;
  const activeUsersCount = usuarios.length;

  // Calculate stats for Pie Chart — real percentages per category
  const categoryCounts = categorias.map((cat) => {
    const value = atas.filter(a => a.categoriaId === cat.id).length;
    const percentage = atas.length > 0 ? Math.round((value / atas.length) * 100) : 0;

    return {
      name: cat.nome,
      value,
      percentage,
      color: cat.cor,
    };
  });

  // Get color hex
  const getCatColorHex = (corName: string) => {
    switch (corName) {
      case 'purple': return '#7c3aed';
      case 'indigo': return '#4f46e5';
      case 'emerald': return '#10b981';
      case 'orange': return '#f97316';
      case 'sky': return '#38bdf8';
      case 'rose': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  // Get color classes for standard category labels inside tables
  const getCatColorClasses = (corName: string) => {
    switch (corName) {
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'indigo': return 'bg-indigo-100 text-indigo-700';
      case 'emerald': return 'bg-emerald-100 text-emerald-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      case 'sky': return 'bg-sky-100 text-sky-700';
      case 'rose': return 'bg-rose-100 text-[#f43f5e]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter atas
  const filteredAtas = atas.filter(ata => {
    if (selectedCategoryFilter === 'Todas as categorias') return true;
    const cat = categorias.find(c => c.nome === selectedCategoryFilter || c.id === selectedCategoryFilter);
    return ata.categoriaId === cat?.id;
  });

  // Handle deletions cleanly
  const handleDeleteConfirm = () => {
    if (showDeleteModal) {
      deleteAta(showDeleteModal, "Administrador");
      setShowDeleteModal(null);
    }
  };

  return (
    <div id="dashboard-view" className="space-y-8">
      
      {/* Dynamic Action Banner immediately below the Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm text-left animate-fade-in">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-slate-900">Painel de Controle de Governança</h2>
          <p className="text-xs text-slate-500">Consulte atas e rascunhos cadastrados, acompanhe fluxos e faça a gestão simplificada de documentos.</p>
        </div>
        <div className="shrink-0">
          <button
            id="btn-nova-ata-banner-dashboard"
            onClick={() => navigate('/atas/nova')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer hover:shadow-blue-600/10 transform hover:-translate-y-0.1 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Ata</span>
          </button>
        </div>
      </div>

      {/* 4 INDICATORS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* INDICATOR: TOTAL DE ATAS */}
        <div id="stat-atas" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total de Atas</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalAtasCount.toLocaleString('pt-BR')}</h3>
            </div>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 este mês</span>
            </p>
          </div>
          {/* Sparkline decoration */}
          <div className="w-20 pt-8 opacity-70">
            <svg viewBox="0 0 100 30" width="100%" height="30" fill="none" strokeWidth="2.5" stroke="#2563eb" strokeLinecap="round">
              <path d="M0 25 L15 18 L30 22 L45 10 L60 15 L75 5 L90 2 L100 12" />
            </svg>
          </div>
        </div>

        {/* INDICATOR: CATEGORIAS */}
        <div id="stat-categorias" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Categorias</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{categoriesCount}</h3>
            </div>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2 este mês</span>
            </p>
          </div>
          {/* Sparkline decoration */}
          <div className="w-20 pt-8 opacity-70">
            <svg viewBox="0 0 100 30" width="100%" height="30" fill="none" strokeWidth="2.5" stroke="#475569" strokeLinecap="round">
              <path d="M0 25 L20 20 L40 26 L60 12 L80 18 L100 5" />
            </svg>
          </div>
        </div>

        {/* INDICATOR: DOWNLOADS */}
        <div id="stat-downloads" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Downloads</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalDownloads.toLocaleString('pt-BR')}</h3>
            </div>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% este mês</span>
            </p>
          </div>
          {/* Sparkline decoration */}
          <div className="w-20 pt-8 opacity-70">
            <svg viewBox="0 0 100 30" width="100%" height="30" fill="none" strokeWidth="2.5" stroke="#10b981" strokeLinecap="round">
              <path d="M0 20 L15 25 L30 18 L45 22 L60 12 L75 16 L90 2 M100 10" />
            </svg>
          </div>
        </div>

        {/* INDICATOR: USUARIOS ACTIVES */}
        <div id="stat-usuarios" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Usuários</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeUsersCount}</h3>
            </div>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4 este mês</span>
            </p>
          </div>
          {/* Sparkline decoration */}
          <div className="w-20 pt-8 opacity-70">
            <svg viewBox="0 0 100 30" width="100%" height="30" fill="none" strokeWidth="2.5" stroke="#2563eb" strokeLinecap="round">
              <path d="M0 26 L20 22 L40 24 L60 15 L80 18 L100 5" />
            </svg>
          </div>
        </div>

      </div>

      {/* CHARTS & EXTRA WIDGETS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPHIC 1: ATAS PUBLICADAS POR MÊS */}
        <div id="panel-grafico-atas" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Atas publicadas por mês</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ano em curso</p>
            </div>
            {/* Filter */}
            <select
              id="filtro-ano"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as any)}
              className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Este ano">Este ano</option>
              <option value="Ano anterior">Ano anterior</option>
            </select>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-100 p-2.5 rounded-lg shadow-md text-xs">
                          <p className="font-semibold text-slate-900">{payload[0].payload.name === 'Jun' ? 'Junho' : payload[0].payload.name}</p>
                          <p className="text-blue-600 font-bold mt-1">{payload[0].value} atas</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="atas"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  {MONTHLY_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === 'Jun' ? '#2563eb' : '#93c5fd'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPHIC 2: ATAS POR CATEGORIA (ROSCAS) */}
        <div id="panel-grafico-categorias" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 text-left">Atas por categoria</h4>
            <p className="text-xs text-slate-400 mt-0.5 text-left">Visão consolidada</p>
          </div>

          {/* Render circular donut chart */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
            <div className="w-36 h-36 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCatColorHex(entry.color)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} Atas`, 'Quantidade']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Central counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none font-semibold">Total</span>
                <span className="text-lg font-bold text-slate-900 mt-1">{totalAtasCount.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Explanatory legend list to match exact look on the right */}
            <div className="space-y-2 flex-1 w-full text-xs">
              {categoryCounts.map((cat, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-left">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: getCatColorHex(cat.color) }} />
                    <span className="text-slate-600 font-medium truncate">{cat.name}</span>
                  </div>
                  <span className="text-slate-400 font-semibold shrink-0">
                    {cat.percentage}% <span className="font-mono text-[10px]">({cat.value})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RECENT UPLOADS & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL: UPLOADS RECENTES */}
        <div id="panel-uploads-recentes" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Uploads recentes</h4>
              <p className="text-xs text-slate-400 mt-0.5">Arquivos anexados recentemente</p>
            </div>
            <button
              id="btn-ver-todos-uploads"
              onClick={() => navigate('/uploads')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3.5 scrollbar-thin">
            {uploads.slice(0, 4).map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-900 max-w-[200px] sm:max-w-xs md:max-w-sm truncate">
                      {file.nome}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-medium mt-1">
                      {file.data} • {file.tamanho}
                    </span>
                  </div>
                </div>
                {/* Download simulation link */}
                <button
                  onClick={() => simulateDownload(file.id, file.nome)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Baixar arquivo"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
            {uploads.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Upload className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs text-slate-500">Nenhum upload de apoio realizado</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL: ATIVIDADE RECENTE */}
        <div id="panel-atividades-recentes" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Atividade recente</h4>
              <p className="text-xs text-slate-400 mt-0.5">Logs operacionais do sistema</p>
            </div>
            {/* The instructions forbid full global audit features but the user wants 'Ver todas' visual links */}
            <span className="text-xs font-semibold text-blue-600 cursor-help hover:underline">
              Atualizado em tempo real
            </span>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4.5 scrollbar-thin">
            {atividades.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start justify-between text-xs gap-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${act.corPerfil} text-white flex items-center justify-center font-bold shrink-0 text-[10px]`}>
                    {act.perfilIniciais}
                  </div>
                  <div>
                    <span className="text-slate-900 font-semibold">{act.usuario}</span>
                    <span className="text-slate-500 font-medium"> {act.acao} </span>
                    <span className="block text-[11px] text-blue-600 font-semibold mt-0.5 break-all">
                      {act.documento}
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 font-medium shrink-0 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{act.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TABLE: ATAS RECENTES */}
      <div id="panel-atas-recentes-tabela" className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table top toolbar */}
        <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900 text-left">Atas recentes</h4>
            <p className="text-xs text-slate-400 mt-0.5 text-left">Resumo operacional das últimas atas geradas</p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
            {/* Category selection */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filtro-categoria"
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setSelectedCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Todas as categorias">Todas as categorias</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Real Dynamic Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[9px] font-bold border-b border-slate-150">
                <th className="py-4 px-6 font-bold">Nº da Ata</th>
                <th className="py-4 px-6 font-bold">Título</th>
                <th className="py-4 px-6 font-bold">Categoria</th>
                <th className="py-4 px-6 font-bold">Data</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right pr-8">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAtas.slice(0, pageSize).map((ata) => {
                const cat = categorias.find((c) => c.id === ata.categoriaId);
                const isDraft = ata.status === 'Rascunho';

                return (
                  <tr key={ata.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID O NUMERO */}
                    <td className="py-4 px-6 font-semibold text-slate-950 font-mono">
                      {ata.numero}
                    </td>

                    {/* TITULO */}
                    <td className="py-4 px-6 font-medium text-slate-600 max-w-[280px] break-words">
                      {ata.titulo}
                    </td>

                    {/* CATEGORIA BAGDE */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase ${getCatColorClasses(cat?.cor || 'gray')}`}>
                        {cat?.nome || 'Sem categoria'}
                      </span>
                    </td>

                    {/* DATA REUNIÃO */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {ata.data.split('-').reverse().join('/')}
                    </td>

                    {/* STATUS DE PUBLICACAO */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isDraft 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {ata.status}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="py-4 px-6 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Visualizar */}
                        <button
                          onClick={() => navigate(`/atas/${ata.id}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer font-medium"
                          title="Visualizar ata oficial"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => navigate(`/atas/${ata.id}/editar`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer font-medium"
                          title="Editar ata"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Baixar */}
                        <button
                          onClick={() => simulateDownload(ata.id, ata.titulo)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer font-medium"
                          title="Baixar ata oficial"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Eliminar (Soft delete) */}
                        <button
                          onClick={() => setShowDeleteModal(ata.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer font-medium"
                          title="Excluir ata"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAtas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Nenhuma ata encontrada na categoria selecionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer controls representing 1.248 results */}
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            Mostrando 1 a {Math.min(filteredAtas.length, pageSize)} de {totalAtasCount} atas
          </p>

          <div className="flex items-center gap-4">
            {/* Custom page size chooser */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Exibir:</span>
              <select
                id="select-registros"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>

            {/* Pagination simulator */}
            <div className="flex items-center gap-1 text-xs">
              <button disabled className="p-1.5 border border-slate-200 rounded-md text-slate-350 cursor-not-allowed">
                &lt;
              </button>
              <button className="w-7 h-7 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold shadow-sm shadow-blue-600/10">
                1
              </button>
              <button className="w-7 h-7 text-slate-600 hover:bg-slate-100 flex items-center justify-center rounded-md cursor-pointer">
                2
              </button>
              <button className="w-7 h-7 text-slate-600 hover:bg-slate-100 flex items-center justify-center rounded-md cursor-pointer">
                3
              </button>
              <span className="text-slate-400 px-1 font-semibold">...</span>
              <button className="w-7 h-7 text-slate-600 hover:bg-slate-100 flex items-center justify-center rounded-md cursor-pointer font-medium">
                250
              </button>
              <button className="p-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer">
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SOLID MODAL DESIGN: EXCLUIR CONFIRMATION */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl text-left border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">Mover para a Lixeira?</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Deseja realmente mover este documento para a lixeira? Ele continuará disponível na aba Lixeira para recuperação ou exclusão definitiva.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer"
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

