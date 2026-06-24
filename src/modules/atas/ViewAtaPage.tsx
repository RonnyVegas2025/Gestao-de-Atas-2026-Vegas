import React from 'react';
import { useData } from '../../providers/DataProvider';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Download,
  ArrowLeft,
  Edit,
  History,
  FileDown,
  Building,
} from 'lucide-react';

export const ViewAtaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { atas, categorias, simulateDownload } = useData();
  const navigate = useNavigate();

  const ata = atas.find(a => a.id === id);

  if (!ata) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-4">
        <FileText className="w-12 h-12 text-red-500 mx-auto opacity-70" />
        <h3 className="text-base font-bold text-gray-900">Documento não encontrado</h3>
        <p className="text-xs text-gray-400">A ata de identificação selecionada não está cadastrada ou foi permanentemente removida.</p>
        <button
          onClick={() => navigate('/atas')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 font-bold rounded-lg transition-colors"
        >
          Voltar para listagem
        </button>
      </div>
    );
  }

  const cat = categorias.find(c => c.id === ata.categoriaId);

  // Status indicators colors
  const getStatusClasses = (status: string) => {
    return status === 'Rascunho'
      ? 'bg-amber-50 text-amber-700 border border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

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

  return (
    <div id="view-ata-portal" className="space-y-6">
      
      {/* UPPER CONTROLS PANEL */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={() => navigate('/atas')}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/60 rounded-xl transition-all"
            title="Voltar para a listagem"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-950 font-mono inline-block pr-2">{ata.numero}</h2>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold align-middle ${getStatusClasses(ata.status)}`}>
              {ata.status}
            </span>
            <p className="text-xs text-gray-400 mt-1">Auditado digitalmente • Chave de assinatura pública ativa</p>
          </div>
        </div>

        {/* CONTROLS TRIGGERS */}
        <div className="flex items-center gap-2">
          {/* Edit Trigger */}
          <button
            onClick={() => navigate(`/atas/${ata.id}/editar`)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Editar Informações</span>
          </button>

          {/* Download Text Representation */}
          <button
            onClick={() => simulateDownload(ata.id, ata.titulo)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width) - BEAUTIFUL INTEGRATED EMBED PDF SHEET PREVIEW */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PDF EMBED SIMULATOR */}
          <div id="pdf-embed-simulator" className="bg-gray-100 rounded-2xl p-6 border border-gray-200 shadow-inner flex flex-col items-center">
            
            {/* Embedded window header */}
            <div className="w-full max-w-[650px] bg-[#1a1c24] text-white px-4 py-2 rounded-t-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-300 font-mono">Visualizador Integrado: {ata.numero}.pdf</span>
              <span className="font-semibold text-[10px] py-0.5 px-2 bg-emerald-600 text-white rounded">PDF Protegido</span>
            </div>

            {/* WHITE SHEET ACTING AS WATERMARKED PDF DOC */}
            <div className="w-full max-w-[650px] min-h-[750px] bg-white text-gray-800 p-8 sm:p-12 shadow-md border-x border-b border-gray-200 relative overflow-hidden select-text text-left">
              
              {/* Brazil Federal Republic / General Republic Stylized Seal */}
              <div className="flex flex-col items-center text-center space-y-2 border-b-2 border-gray-800 pb-5">
                <div className="w-16 h-16 bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center">
                  <Building className="w-9 h-9 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold tracking-widest text-gray-900 uppercase">REPÚBLICA FEDERATIVA DO BRASIL</h4>
                  <h5 className="text-[10px] font-bold tracking-wider text-gray-600 uppercase mt-0.5">SISTEMA INTEGRADO DE ATAS E DOCUMENTOS OFICIAIS</h5>
                  <h6 className="text-[9px] font-semibold text-indigo-700 tracking-wide mt-1 uppercase">CORP - CONSELHO ADMINISTRATIVO E FINANCEIRO</h6>
                </div>
              </div>

              {/* Watermark layer (behind text) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none z-0">
                <Building className="w-96 h-96 rotate-45 text-black" />
              </div>

              {/* PDF Content (Z-10 to stay overlayed on watermark) */}
              <div className="space-y-6 mt-8 relative z-10 leading-relaxed text-xs">
                
                {/* Header title */}
                <div className="text-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase font-mono">{ata.numero}</h3>
                  <h2 className="text-[11px] font-bold text-gray-600 mt-1 uppercase italic">"{ata.titulo}"</h2>
                </div>

                {/* I. DATA, HORA E LOCAL */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5">I. DO LOCAL, DATA E HORÁRIO</h4>
                  <p className="text-gray-700">
                    Aos <strong>{ata.data.split('-').reverse().join('/')}</strong>, com início às <strong>{ata.horario}</strong> horas,
                    no(a) <strong>{ata.local || "Sede do Conselho corporativo por canais digitais de segurança"}</strong>, reuniu-se a mesa oficial sob o escopo de pauta da referida categoria correspondente.
                  </p>
                </div>

                {/* II. COMPOSIÇÃO DA MESA */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5">II. DOS RESPONSÁVEIS DE REUNIÃO</h4>
                  <p className="text-gray-700">
                    Presidiu a comissão o moderador <strong>{ata.presidente}</strong>, sendo redigida, revisada e consolidada sob a secretaria geral de <strong>{ata.secretario || "Aline de Souza"}</strong>.
                  </p>
                </div>

                {/* III. PARTICIPANTES */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5">III. REPETITÓRIO DE PARTICIPANTES E CO-AUTORES</h4>
                  <p className="text-gray-700">
                    Ficou constatada a assinatura e presença oficial dos seguintes representantes oficiais e coordenadores adjuntos:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {ata.participantes.map((part, i) => (
                      <li key={i}>{part}</li>
                    ))}
                    {ata.participantes.length === 0 && (
                      <li>Nenhum participante adicional registrado.</li>
                    )}
                  </ul>
                </div>

                {/* IV. DELIBERAÇÕES E DECISÕES */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5">IV. DELIBERAÇÕES, CONCLUSÕES E DECISÕES ACORDADAS</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                    {ata.descricao || "Não há deliberações extras cadastradas neste documento para esta reunião específica."}
                  </p>
                </div>

                {/* V. ENCERRAMENTO */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5">V. DO ENCERRAMENTO</h4>
                  <p className="text-gray-700 text-justify">
                    Nada mais havendo a tratar, foram encerrados os trabalhos do conselho administrativo desta sessão, sendo redigida a presente ata por {ata.secretario || "mim, Secretário Geral Redator"} que, após lida e aprovada, segue assinada consensualmente pelas vias eletrônicas digitais oficiais.
                  </p>
                </div>

                {/* SIGNATURE BLOCKS */}
                <div className="grid grid-cols-2 gap-8 pt-12 text-center text-[10px] uppercase font-mono">
                  <div className="space-y-1">
                    <div className="border-t border-gray-400 pt-1.5 font-bold text-gray-800">{ata.presidente}</div>
                    <div className="text-gray-400">Moderador Presidente</div>
                  </div>
                  <div className="space-y-1">
                    <div className="border-t border-gray-400 pt-1.5 font-bold text-gray-800">{ata.secretario || "Assinatura do Redator"}</div>
                    <div className="text-gray-400">Secretário Redator</div>
                  </div>
                </div>

                {/* Barcode representation */}
                <div className="pt-8 border-t border-gray-100 flex flex-col items-center space-y-1 text-[8px] text-gray-400 font-mono select-none">
                  <div className="tracking-widest bg-gray-200 text-gray-500 h-6 w-48 text-center flex items-center justify-center font-bold">
                    ||| | || ||| || ||| || ||| || || | | ||
                  </div>
                  <span>Chave de Verificação SHA-256: 7f4a2d3e...e9c8a7f1</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width) - DETAILED SIDE METADATA */}
        <div className="space-y-6 text-left">
          
          {/* TECHNICAL METADATA COMPILATION */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Metadados Oficiais</span>
            </h3>

            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assunto/Título</span>
                <span className="text-gray-700 font-semibold mt-0.5 block leading-normal">{ata.titulo}</span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoria Vinculada</span>
                <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold tracking-wide uppercase ${getCatColorClasses(cat?.cor || 'gray')}`}>
                  {cat?.nome || 'Geral'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</span>
                  <span className="text-gray-700 font-semibold mt-0.5 block">{ata.data.split('-').reverse().join('/')}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horário</span>
                  <span className="text-gray-700 font-semibold mt-0.5 block">{ata.horario} Horas</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Local</span>
                <span className="text-gray-700 font-semibold mt-0.5 block leading-normal">{ata.local || "Videoconferência"}</span>
              </div>
            </div>
          </div>

          {/* HISTORIC TIMELINE */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-blue-600" />
              <span>Linha do Tempo</span>
            </h3>

            <div className="relative pl-5 border-l border-gray-100 space-y-4.5 text-xs">
              {/* Event 1: Creation */}
              <div className="relative">
                <span className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
                <span className="block text-[11px] font-bold text-gray-900">Documento Inicial Registrado</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  {new Date(ata.criadoEm || ata.data).toLocaleString('pt-BR')}
                </span>
                <span className="block text-[10px] text-gray-500 font-medium mt-1">Autoria: Administrador</span>
              </div>

              {/* Event 2: Last Update */}
              <div className="relative">
                <span className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                <span className="block text-[11px] font-bold text-gray-900">Versão Consolidada Publicada</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  {new Date(ata.atualizadoEm || ata.data).toLocaleString('pt-BR')}
                </span>
                <span className="block text-[10px] text-gray-500 font-medium mt-1">Status: Confiável e Assinado</span>
              </div>
            </div>
          </div>

          {/* ATTACHMENTS SECURED DOWNLOADS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <FileDown className="w-4 h-4 text-blue-600" />
              <span>Anexos Oficiais</span>
            </h3>

            {ata.arquivos && ata.arquivos.length > 0 ? (
              <div className="space-y-2">
                {ata.arquivos.map((file, idx) => (
                  <div
                    key={idx}
                    onClick={() => simulateDownload(ata.id, file.name)}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer group text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <FileDown className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-gray-800 truncate group-hover:text-indigo-700">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                          Formato {file.type.toUpperCase()} • {file.size}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Nenhum anexo adicional anexado a esta ata.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
