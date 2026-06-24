import React from 'react';
import { useData } from '../../providers/DataProvider';
import {
  Trash2,
  RefreshCw,
  FolderLock,
  FileCheck,
  FileText,
  Upload,
} from 'lucide-react';

export const LixeiraPage: React.FC = () => {
  const {
    lixeira,
    restaurarItem,
    excluirPermanentemente
  } = useData();

  return (
    <div id="trash-hub" className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
        <h2 className="text-lg font-bold text-gray-950">Lixeira Corporativa</h2>
        <p className="text-xs text-gray-400 mt-1">Recupere ou elimine definitivamente atas de decisões e documentos complementares excluídos</p>
      </div>

      {/* RECYCLER TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col text-left">
        
        <div className="p-6 pb-4 border-b border-gray-50">
          <h4 className="text-base font-bold text-gray-900">Documentos Excluídos</h4>
          <p className="text-xs text-gray-400 mt-1">Arquivos sob regime de descarte provisório com suporte à restauração imediata</p>
        </div>

        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                <th className="py-4.5 px-6">Tipo</th>
                <th className="py-4.5 px-6">Identificação / Documento</th>
                <th className="py-4.5 px-6">Operador Responsável Exclusão</th>
                <th className="py-4.5 px-6">Data de Exclusão</th>
                <th className="py-4.5 px-6 text-right pr-8">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-50 text-xs">
              {lixeira.map((item) => {
                const isAta = item.tipo === 'ata';

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Badge tipo */}
                    <td className="py-4 px-6 font-medium whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        isAta ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {isAta ? <FileText className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                        <span>{isAta ? "Ata Oficial" : "Upload Anexo"}</span>
                      </span>
                    </td>

                    {/* Identitificacao do nome */}
                    <td className="py-4 px-6 font-semibold text-gray-800 font-mono">
                      {item.nome}
                    </td>

                    {/* Nome de quem excluiu */}
                    <td className="py-4 px-6 text-gray-600 font-medium whitespace-nowrap">
                      {item.usuario}
                    </td>

                    {/* Data exclusão */}
                    <td className="py-4 px-6 text-gray-400 font-medium whitespace-nowrap">
                      {item.dataExclusao.split('-').reverse().join('/')}
                    </td>

                    {/* Ações: Restaurar, Excluir definitivamente */}
                    <td className="py-4 px-6 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Restaurar */}
                        <button
                          onClick={() => restaurarItem(item.id)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                          title="Restaurar para a coleção original"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Restaurar</span>
                        </button>

                        {/* Eliminar permanentement */}
                        <button
                          onClick={() => {
                            if (confirm(`Atenção: A exclusão do documento "${item.nome}" será definitiva e irreversível do banco corporativo. Deseja prosseguir de forma irrevogável?`)) {
                              excluirPermanentemente(item.id);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 border border-red-100 bg-red-50/50 text-red-700 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          title="Excluir de forma irrecuperável"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Destruir</span>
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {lixeira.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400">
                    <FolderLock className="w-12 h-12 opacity-30 mx-auto mb-3.5" />
                    <p className="text-sm font-semibold text-gray-700">Lixeira sem registros pendentes</p>
                    <p className="text-xs text-gray-400 mt-1">Todas as atas e arquivos de apoio estão ativos no sistema principal</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
