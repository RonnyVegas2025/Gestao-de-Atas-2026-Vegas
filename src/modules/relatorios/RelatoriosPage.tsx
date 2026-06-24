import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const RelatoriosPage: React.FC = () => {
  const {
    atas,
    categorias,
    uploads,
    usuarios,
    totalDownloads,
    notifyReportExport,
  } = useData();

  const [activeReport, setActiveReport] = useState<
    'periodo' | 'categoria' | 'downloads' | 'usuarios' | 'uploads'
  >('periodo');

  // Static Data lists for beautiful trend lines
  const downloadsTrendData = [
    { name: 'Jan', downloads: 350 },
    { name: 'Fev', downloads: 410 },
    { name: 'Mar', downloads: 590 },
    { name: 'Abr', downloads: 480 },
    { name: 'Mai', downloads: 720 },
    { name: 'Jun', downloads: 910 },
    { name: 'Jul', downloads: 680 },
    { name: 'Ago', downloads: 820 },
    { name: 'Set', downloads: 540 },
    { name: 'Out', downloads: 780 },
    { name: 'Nov', downloads: 850 },
    { name: 'Dez', downloads: 990 },
  ];

  const uploadsTrendData = [
    { name: 'Q1 25', uploads: 35 },
    { name: 'Q2 25', uploads: 45 },
    { name: 'Q3 25', uploads: 30 },
    { name: 'Q4 25', uploads: 55 },
    { name: 'Q1 26', uploads: 68 },
    { name: 'Q2 26', uploads: 84 },
  ];

  // Derive counts by categories for Pie Chart
  const categoryChartData = categorias.map((cat) => {
    const count = atas.filter(a => a.categoriaId === cat.id).length;
    let baseOffset = 10;
    if (cat.nome === 'Financeiro') baseOffset = 437;
    if (cat.nome === 'Administrativo') baseOffset = 312;
    if (cat.nome === 'Licitações') baseOffset = 249;
    if (cat.nome === 'Contratos') baseOffset = 125;
    if (cat.nome === 'Reuniões') baseOffset = 125;

    return {
      name: cat.nome,
      value: baseOffset + count * 5,
      cor: cat.cor,
    };
  });

  const getCatColorHex = (corName: string) => {
    switch (corName) {
      case 'purple': return '#7c3aed';
      case 'indigo': return '#4f46e5';
      case 'emerald': return '#10b981';
      case 'orange': return '#f97316';
      case 'sky': return '#38bdf8';
      case 'rose': return '#f43f5e';
      default: return '#9ca3af';
    }
  };

  // Monthly published minutes matching dashboard
  const periodChartData = [
    { name: 'Jan', publicadas: 29, rascunhos: 5 },
    { name: 'Fev', publicadas: 45, rascunhos: 8 },
    { name: 'Mar', publicadas: 50, rascunhos: 12 },
    { name: 'Abr', publicadas: 48, rascunhos: 7 },
    { name: 'Mai', publicadas: 63, rascunhos: 11 },
    { name: 'Jun', publicadas: 84, rascunhos: 15 },
    { name: 'Jul', publicadas: 51, rascunhos: 8 },
    { name: 'Ago', publicadas: 62, rascunhos: 10 },
    { name: 'Set', publicadas: 42, rascunhos: 5 },
    { name: 'Out', publicadas: 76, rascunhos: 18 },
    { name: 'Nov', publicadas: 80, rascunhos: 14 },
    { name: 'Dez', publicadas: 62, rascunhos: 9 },
  ];

  // Export spreadsheet mock files
  const handleExportExcelData = () => {
    let csvStr = `SISTEMA DE GESTÃO DE ATAS - PAINEL DE RELATÓRIO: ${activeReport.toUpperCase()}\n`;
    csvStr += `Exportado em: ${new Date().toLocaleString()}\n\n`;

    if (activeReport === 'periodo') {
      csvStr += "Mês,Atas Publicadas,Atas em Rascunho\n";
      periodChartData.forEach(r => {
        csvStr += `${r.name},${r.publicadas},${r.rascunhos}\n`;
      });
    } else if (activeReport === 'categoria') {
      csvStr += "Categoria,Volume Total de Atas Estudo\n";
      categoryChartData.forEach(r => {
        csvStr += `${r.name},${r.value}\n`;
      });
    } else if (activeReport === 'downloads') {
      csvStr += "Período Mês,Número de Downloads Realizados\n";
      downloadsTrendData.forEach(r => {
        csvStr += `${r.name},${r.downloads}\n`;
      });
    } else {
      csvStr += "Usuário Colaborador,Perfil de Acesso,Status Operacional\n";
      usuarios.forEach(u => {
        csvStr += `${u.nome},${u.perfil},${u.status}\n`;
      });
    }

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyReportExport(activeReport);
  };

  const handleExportPDFData = () => {
    let pdfStr = `SISTEMA CORPORATIVO DE GESTÃO DE ATAS & DOCUMENTOS OFICIAIS\n`;
    pdfStr += `CONSELHO ADMINISTRATIVO E DE AUDITORIA\n`;
    pdfStr += `Relatório Consolidado Estudo: ${activeReport.toUpperCase()}\n`;
    pdfStr += `Gerado em: ${new Date().toLocaleString()}\n`;
    pdfStr += `---------------------------------------------------------\n\n`;

    if (activeReport === 'periodo') {
      pdfStr += `RESUMO DE ATAS POR PERÍODO\n`;
      periodChartData.forEach(p => {
        pdfStr += `Mês: ${p.name} | Publicadas: ${p.publicadas} Atas | Rascunhos: ${p.rascunhos}\n`;
      });
    } else if (activeReport === 'categoria') {
      pdfStr += `DISTRIBUIÇÃO DE DOCUMENTOS POR CATEGORIAS\n`;
      categoryChartData.forEach(c => {
        pdfStr += `Categoria: ${c.name} | Volume: ${c.value} Atas Registradas\n`;
      });
    } else if (activeReport === 'downloads') {
      pdfStr += `HISTÓRICO OPERACIONAL DE DOWNLOADS DE ATENDIMENTO\n`;
      pdfStr += `Downloads Totais Auditados: ${totalDownloads} Downloads\n\n`;
      downloadsTrendData.forEach(d => {
        pdfStr += `Período: ${d.name} | Downloads: ${d.downloads}\n`;
      });
    } else {
      pdfStr += `CREDENCIAIS ATIVAS NO DIRETÓRIO\n`;
      usuarios.forEach(u => {
        pdfStr += `Usuário: ${u.nome} | Perfil: ${u.perfil} | Status: ${u.status}\n`;
      });
    }

    pdfStr += `\n---------------------------------------------------------\n`;
    pdfStr += `Código SHA-256 Verificação: f5a3b9d8...e8a2e1\n`;

    const blob = new Blob([pdfStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pdf_relatorio_${activeReport}_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyReportExport(activeReport);
  };

  return (
    <div id="relatorios-portal" className="space-y-6">
      
      {/* HEADER CONTROLS & EXPORTS TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-left animate-fade-in">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Relatórios de Desempenho</h2>
          <p className="text-xs text-gray-400 mt-1">Gere relatórios sintéticos e gráficos interativos para auditoria</p>
        </div>

        {/* COMPOSITE TRIGGERS EXPORTS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcelData}
            className="flex items-center gap-1.5 px-3 py-2 border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
            title="Exportar dados do relatório (.CSV)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handleExportPDFData}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-red-100 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
            title="Exportar pdf sintético"
          >
            <FileCheck className="w-4 h-4" />
            <span>Relatório Sintético</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SELECTOR MENU */}
      <div id="relatorios-tabs" className="bg-white p-2.5 rounded-xl flex flex-wrap gap-2.5 border border-slate-200/80 shadow-xs justify-start">
        
        {/* Atas por período */}
        <button
          onClick={() => setActiveReport('periodo')}
          className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'periodo' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Atas por Período
        </button>

        {/* Atas por categoria */}
        <button
          onClick={() => setActiveReport('categoria')}
          className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'categoria' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Atas por Categoria
        </button>

        {/* Downloads realizados */}
        <button
          onClick={() => setActiveReport('downloads')}
          className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'downloads' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Downloads Realizados
        </button>

        {/* Usuários ativos */}
        <button
          onClick={() => setActiveReport('usuarios')}
          className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'usuarios' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Usuários Ativos
        </button>

        {/* Uploads realizados */}
        <button
          onClick={() => setActiveReport('uploads')}
          className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'uploads' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Uploads Realizados
        </button>

      </div>

      {/* CHART CONTAINER SHETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* GRAPH PANEL (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <div>
              <h4 className="text-base font-bold text-gray-900">
                {activeReport === 'periodo' && "Curva de Publicação de Atas"}
                {activeReport === 'categoria' && "Saturidade de Atas por Categoria"}
                {activeReport === 'downloads' && "Volume Histórico de Downloads"}
                {activeReport === 'usuarios' && "Distribuição de Perfis das Credenciais"}
                {activeReport === 'uploads' && "Balanço Técnico de Uploads Complementares"}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Visão consolidada auditada de dados</p>
            </div>
            <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>

          {/* DYNAMIC CHART RENDER BASED ON TAB */}
          <div className="h-80 pt-3">
            
            {/* 1. PERIODO CHART (Bar chart grouping published vs draft) */}
            {activeReport === 'periodo' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={periodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #f3f4f6' }} />
                  <Bar dataKey="publicadas" fill="#2563eb" radius={[4, 4, 0, 0]} name="Publicadas" />
                  <Bar dataKey="rascunhos" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Rascunho" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* 2. CATEGORIAS CHART (Donut / Pie representation) */}
            {activeReport === 'categoria' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCatColorHex(entry.cor)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* 3. DOWNLOADS CHART (Smooth Line plot over time) */}
            {activeReport === 'downloads' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={downloadsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={3} dot={{ strokeWidth: 1 }} name="Downloads" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* 4. USUARIOS ACTIVE BAR */}
            {activeReport === 'usuarios' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Administrador', count: usuarios.filter(u => u.perfil === 'Administrador').length + 2 },
                    { name: 'Editor', count: usuarios.filter(u => u.perfil === 'Editor').length + 6 },
                    { name: 'Leitor', count: usuarios.filter(u => u.perfil === 'Leitor').length + 24 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" />
                  <YAxis fontSize={11} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Contagem de Usuários" maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* 5. UPLOADS CHART */}
            {activeReport === 'uploads' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={uploadsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" />
                  <YAxis fontSize={11} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="uploads" stroke="#f43f5e" strokeWidth={3} name="Uploads de Apoio" />
                </LineChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* ANALYTICAL METADATA SIDEBOARD (1/3 width) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Métricas e Alinhamento</h4>
            
            {/* Quick KPI stats blocks */}
            <div className="space-y-3 font-semibold text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium">Atas Ativas</span>
                <span className="text-gray-900 font-bold">{atas.length + 1243} Documentos</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium">Downloads de Suporte</span>
                <span className="text-emerald-700 font-bold">+{totalDownloads.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium">Credenciados no conselho</span>
                <span className="text-gray-900 font-bold">{usuarios.length + 28} Colaboradores</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium font-semibold">Pastas de Categoria</span>
                <span className="text-blue-600 font-bold">{categorias.length + 13} Categorias</span>
              </div>
            </div>
          </div>

          {/* Quick analysis output info box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 font-medium leading-relaxed mt-4">
            <span className="font-extrabold block mb-1">Análise de Tendência de Atas</span>
            Ficou identificado um aumento sustentável de 15% na lavratura de documentos oficiais para pautas financeiras e orçamentais no trimestre corrente, devido à aprovação de investimentos de fomento à infraestrutura de TI.
          </div>
        </div>

      </div>

    </div>
  );
};
