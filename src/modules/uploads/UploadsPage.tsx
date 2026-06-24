import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import {
  UploadCloud,
  FileDown,
  Download,
  Trash2,
  File,
  CheckCircle,
  AlertCircle,
  ServerCrash
} from 'lucide-react';

export const UploadsPage: React.FC = () => {
  const {
    uploads,
    addUpload,
    deleteUpload,
    simulateDownload,
  } = useData();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'xlsx'>('pdf');
  const [isUploading, setIsUploading] = useState(false);

  // File chooser trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileSave(file.name, file.size);
    }
  };

  const simulateFileSave = (name: string, sizeBytes: number) => {
    setIsUploading(true);
    setTimeout(() => {
      const mbSize = (sizeBytes / (1024 * 1024)).toFixed(2) + " MB";
      const ext = name.split('.').pop()?.toLowerCase() || 'pdf';
      
      addUpload({
        nome: name,
        tipo: (['pdf', 'docx', 'xlsx'].includes(ext) ? ext : 'pdf') as any,
        tamanho: mbSize === "0.00 MB" ? "1.5 MB" : mbSize,
      });

      setIsUploading(false);
    }, 1200);
  };

  // Drag logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileSave(file.name, file.size);
    }
  };

  const getStatusComponent = (status: string) => {
    if (status === 'Concluído') {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Concluído</span>
        </span>
      );
    }
    if (status === 'Processando') {
      return (
        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-indigo-100 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping mr-0.5" />
          <span>Processando</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-red-100">
        <AlertCircle className="w-3 h-3 text-red-500" />
        <span>Falhou</span>
      </span>
    );
  };

  return (
    <div id="uploads-hub" className="space-y-6">
      
      {/* HEADER ACTION CONTROL & DRAG DROP BOX */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-left animate-fade-in">
        <h2 className="text-lg font-bold text-gray-950">Uploads de Apoio</h2>
        <p className="text-xs text-gray-400 mt-1">Anexe planilhas, arquivos complementares, termos de compromisso em lote ou formato avulso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* DRAG DROP ZONE BOX (1/3 Width) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Importar Novo Arquivo
          </h3>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive ? 'border-blue-600 bg-blue-50/40' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50'
            }`}
          >
            <input
              id="upload-file-picker"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="upload-file-picker" className="cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud className="w-10 h-10 text-blue-500 mb-3" />
              <span className="text-xs font-bold text-gray-700 block">Arraste seus arquivos para aqui</span>
              <span className="text-[11px] text-gray-400 mt-1.5 leading-normal block">Ou clique para navegar de sua máquina externa</span>
            </label>
          </div>

          {/* Loader bar */}
          {isUploading && (
            <div className="text-xs text-blue-700 font-bold flex items-center justify-center gap-2 py-1.5 bg-blue-50/50 rounded-xl border border-blue-200/40 animate-pulse">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Anexando e revisando assinaturas...</span>
            </div>
          )}

          <div className="text-[10px] text-gray-400 leading-normal space-y-1">
            <p><strong>Dica de Conformidade:</strong></p>
            <p>• Tamanho máximo por arquivo: 100MB</p>
            <p>• Formatos recomendados: .pdf, .docx, .xlsx</p>
            <p>• Todos os arquivos passam por auditoria automática por criptografia</p>
          </div>
        </div>

        {/* REAL TABLE LIST OF ATTACHMENTS (2/3 Width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 pb-4 border-b border-gray-50">
            <h4 className="text-base font-bold text-gray-900">Histórico de Arquivos de Apoio</h4>
            <p className="text-xs text-gray-400 mt-1">Lista unificada de documentos anexos complementares salvos em nosso repositório</p>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                  <th className="py-4.5 px-6">Nome do Arquivo</th>
                  <th className="py-4.5 px-6">Tamanho</th>
                  <th className="py-4.5 px-6">Responsável Autor</th>
                  <th className="py-4.5 px-6">Data de Envio</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right pr-8">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {uploads.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Nome do arquivo + icon */}
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      <div className="flex items-center gap-2 max-w-xs sm:max-w-sm">
                        <File className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="truncate" title={file.nome}>{file.nome}</span>
                      </div>
                    </td>

                    {/* Tamanho */}
                    <td className="py-4 px-6 font-medium font-mono text-gray-500 whitespace-nowrap">
                      {file.tamanho}
                    </td>

                    {/* Usuario autor */}
                    <td className="py-4 px-6 font-semibold text-gray-500 whitespace-nowrap">
                      {file.usuario}
                    </td>

                    {/* Data formatada */}
                    <td className="py-4 px-6 text-gray-400 font-medium whitespace-nowrap">
                      {file.data.split('-').reverse().join('/')}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusComponent(file.status)}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download link */}
                        <button
                          onClick={() => simulateDownload(file.id, file.nome)}
                          className="p-1 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100/50"
                          title="Fazer download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Excluir (Soft delete) */}
                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente desassociar o arquivo complementar "${file.nome}"? Ele será inserido na lixeira corporativa.`)) {
                              deleteUpload(file.id, "Administrador");
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100/50"
                          title="Mover para a lixeira"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {uploads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <ServerCrash className="w-8 h-8 opacity-25 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Nenhum arquivo de apoio cadastrado</p>
                      <p className="text-[11px] text-gray-400 mt-1">Arraste novos pdfs no menu lateral ao lado para iniciar</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
