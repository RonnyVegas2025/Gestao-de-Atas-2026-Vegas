import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../providers/DataProvider';
import { supabase } from '../../lib/supabaseClient';
import {
  Users,
  Plus,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Mail,
  Lock,
  Network
} from 'lucide-react';

export const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    updateUsuario,
    toggleUsuarioStatus,
    reloadUsuarios,
    perfilUsuario,
  } = useData();
  const navigate = useNavigate();

  // Apenas Administrador acede à gestão de usuários
  useEffect(() => {
    if (perfilUsuario !== 'Administrador') navigate('/dashboard');
  }, [perfilUsuario, navigate]);

  // Create Mode States
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [perfil, setPerfil] = useState<'Administrador' | 'Editor' | 'Leitor'>('Leitor');

  // Edit Mode States
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    if (editingId) {
      updateUsuario(editingId, {
        nome,
        email,
        cargo,
        departamento,
        perfil,
      });
      setEditingId(null);
    } else {
      if (!senha.trim()) {
        alert('Informe uma senha para o novo usuário.');
        return;
      }

      const response = await fetch('https://rmfyswnoxpyfvebbkrwn.supabase.co/functions/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ nome, email, password: senha, cargo, departamento, perfil, status: 'Ativo' })
      });
      const result = await response.json();
      if (result.error) {
        alert('Erro: ' + result.error);
        return;
      }
      // Recarrega lista de usuários do Supabase
      await reloadUsuarios();
    }

    // Reset fields
    setNome('');
    setEmail('');
    setSenha('');
    setCargo('');
    setDepartamento('');
    setPerfil('Leitor');
  };

  const handleStartEdit = (user: any) => {
    setEditingId(user.id);
    setNome(user.nome);
    setEmail(user.email);
    setCargo(user.cargo);
    setDepartamento(user.departamento);
    setPerfil(user.perfil);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNome('');
    setEmail('');
    setSenha('');
    setCargo('');
    setDepartamento('');
    setPerfil('Leitor');
  };

  const getPerfilBadge = (perf: string) => {
    switch (perf) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Editor':
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div id="usuarios-hub" className="space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-left animate-fade-in">
        <h2 className="text-lg font-bold text-gray-950">Diretório de Credenciados</h2>
        <p className="text-xs text-gray-400 mt-1">Gerencie chaves, atribuições de departamento e autorizações de acesso para lavratura de atas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* COL 1: SAVE / UPDATE REGISTER FORM (1/3 Width) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>{editingId ? "Editar Colaborador" : "Credenciar Novo Usuário"}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Nome do Colaborador *
              </label>
              <input
                id="user-form-nome"
                type="text"
                required
                placeholder="Ex: Amanda Goulart"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none"
              />
            </div>

            {/* Email corporativo */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Email Funcional *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  id="user-form-email"
                  type="email"
                  required
                  placeholder="Ex: amanda.g@corporativo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Senha (apenas na criação - cria login no Supabase Auth) */}
            {!editingId && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="user-form-senha"
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {/* Cargo */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Cargo/Função
                </label>
                <input
                  id="user-form-cargo"
                  type="text"
                  placeholder="Ex: Auditora"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Departamento
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-400">
                    <Network className="w-3 h-3" />
                  </span>
                  <input
                    id="user-form-depto"
                    type="text"
                    placeholder="Ex: Setor Fiscal"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Perfis de acesso */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Perfil de Acesso / Papel
              </label>
              <select
                id="user-form-perfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none font-semibold text-gray-700"
              >
                <option value="Administrador">Administrador (Acesso total)</option>
                <option value="Editor">Editor (Criação e uploads)</option>
                <option value="Leitor">Leitor (Leitura e downloads)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                id="btn-salvar-usuario"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {editingId ? "Atualizar Credência" : "Salvar Colaborador"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>

        {/* COL 2 & 3: USER LIST DATATABLE (2/3 Width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 pb-4 border-b border-gray-50">
            <h4 className="text-base font-bold text-gray-900">Mapeamento de Usuários</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">Veja a matriz de atividade dos usuários com acesso sob o regime geral corporativo</p>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                  <th className="py-4.5 px-6">Nome do Usuário</th>
                  <th className="py-4.5 px-6">Email / Contato</th>
                  <th className="py-4.5 px-6">Cargo & Logística</th>
                  <th className="py-4.5 px-6">Perfil do Sistema</th>
                  <th className="py-4.5 px-6 text-center">Status</th>
                  <th className="py-4.5 px-6 text-right pr-8">Ações</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-50 text-xs text-left">
                {usuarios.map((usr) => {
                  const isActive = usr.status === 'Ativo';

                  return (
                    <tr key={usr.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Avatar initials + Name */}
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                            {usr.nome.slice(0, 2)}
                          </div>
                          <span>{usr.nome}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-gray-500 font-mono">
                        {usr.email}
                      </td>

                      {/* Cargo, Depto */}
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        <span className="block font-bold text-gray-700">{usr.cargo || "Não cadastrado"}</span>
                        <span className="block text-[11px] text-gray-400 mt-0.5">{usr.departamento || "Sem departamento"}</span>
                      </td>

                      {/* Perfil badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold lowercase tracking-wide ${getPerfilBadge(usr.perfil)}`}>
                          {usr.perfil}
                        </span>
                      </td>

                      {/* Status dot */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                          <span>{usr.status}</span>
                        </span>
                      </td>

                      {/* Ações: Editar, Desativar / Reativar */}
                      <td className="py-4 px-6 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit inline */}
                          <button
                            onClick={() => handleStartEdit(usr)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Editar usuário"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle status */}
                          <button
                            onClick={() => toggleUsuarioStatus(usr.id)}
                            className={`p-1.5 rounded-lg hover:bg-gray-100/50 ${
                              isActive ? 'text-red-500 hover:text-red-700' : 'text-emerald-500 hover:text-emerald-700'
                            }`}
                            title={isActive ? "Desativar colaborador" : "Reativar colaborador"}
                          >
                            {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
