import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock
} from 'lucide-react';

interface PermissoesMatrixRow {
  recurso: string;
  descricao: string;
  administrador: boolean;
  editor: boolean;
  leitor: boolean;
}

const MATRIX_DATA: PermissoesMatrixRow[] = [
  { recurso: 'Visualizar Atas Oficiais', descricao: 'Acesso para leitura de documentos e visualização do embed PDF.', administrador: true, editor: true, leitor: true },
  { recurso: 'Baixar Documentações (PDF/CSV)', descricao: 'Permissão para efetuar o download dos arquivos oficiais gerados.', administrador: true, editor: true, leitor: true },
  { recurso: 'Criar Novas Atas', descricao: 'Capacidade de submeter o formulário de lavratura de reuniões.', administrador: true, editor: true, leitor: false },
  { recurso: 'Editar Atas Existentes', descricao: 'Acesso para correção e recalibração de atas e anotações.', administrador: true, editor: true, leitor: false },
  { recurso: 'Realizar Uploads de Anexo', descricao: 'Envio de arquivos em lote e associação de documentos complementares.', administrador: true, editor: true, leitor: false },
  { recurso: 'Mover Documentos para a Lixeira', descricao: 'Capacidade de exclusão temporária para descarte de dados supérfluos.', administrador: true, editor: false, leitor: false },
  { recurso: 'Restaurar Elementos da Lixeira', descricao: 'Recuperação de arquivos e atas da lixeira de volta aos painéis ativos.', administrador: true, editor: false, leitor: false },
  { recurso: 'Gerenciar Usuários e Credenciais', descricao: 'Ativação, desativação, criação e edição de acesso no diretório corporativo.', administrador: true, editor: false, leitor: false },
];

export const PermissoesPage: React.FC = () => {
  return (
    <div id="permissoes-hub" className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
        <h2 className="text-lg font-bold text-gray-950">Matriz de Permissões</h2>
        <p className="text-xs text-gray-400 mt-1">Veja os direitos de operação associados a cada perfil administrativo oficial do conselho</p>
      </div>

      {/* MATRIX BOX */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col text-left">
        
        <div className="p-6 pb-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-gray-900">Matriz de Operabilidade RBAC</h4>
            <p className="text-xs text-gray-400 mt-1">Controle de acesso lógico baseado em perfil e papéis cadastrados</p>
          </div>
          <span className="text-[10px] whitespace-nowrap font-bold uppercase border border-blue-200 bg-blue-50/50 text-blue-700 py-1 px-3.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Perfil Administrador Ativo</span>
          </span>
        </div>

        {/* REAL INTERACTIVE SECURITY MATRIX */}
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                <th className="py-5 px-6">Recurso Funcional</th>
                <th className="py-5 px-6">Descrição da Operação</th>
                <th className="py-5 px-6 text-center">Administrador</th>
                <th className="py-5 px-6 text-center">Editor</th>
                <th className="py-5 px-6 text-center">Leitor</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 text-xs text-left">
              {MATRIX_DATA.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Recurso de segurança */}
                  <td className="py-4.5 px-6 font-semibold text-gray-900">
                    {row.recurso}
                  </td>

                  {/* Informação descritiva */}
                  <td className="py-4.5 px-6 text-gray-500 max-w-xs leading-normal">
                    {row.descricao}
                  </td>

                  {/* ADMIN checkbox */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center">
                      {row.administrador ? (
                        <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-5.5 h-5.5 text-red-400 opacity-60" />
                      )}
                    </div>
                  </td>

                  {/* EDITOR checkbox */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center">
                      {row.editor ? (
                        <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-5.5 h-5.5 text-red-300 opacity-60" />
                      )}
                    </div>
                  </td>

                  {/* LEITOR checkbox */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center">
                      {row.leitor ? (
                        <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-5.5 h-5.5 text-red-300 opacity-60" />
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECURITY INFO WARNING FOOR */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-start gap-3.5 text-xs text-gray-500">
          <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <span className="font-bold text-gray-700 block">Como funciona o controle RBAC?</span>
            <p className="text-[11px] leading-relaxed max-w-3xl">
              As autorizações seguem regras seguras auditadas baseadas em papéis lógicos. Caso precise alterar as atribuições de um colaborador específico, navegue para a aba <strong>Usuários</strong> e mude o perfil de acesso correspondente. As alterações na matriz refletem em tempo real no escopo do portal.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
