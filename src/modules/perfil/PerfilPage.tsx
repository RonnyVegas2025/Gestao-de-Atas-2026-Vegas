import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../providers/DataProvider';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building, 
  Shield, 
  Calendar, 
  Clock, 
  Key, 
  Camera, 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export const PerfilPage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  // Form States
  const [nome, setNome] = useState(currentUser.nome);
  const [foto, setFoto] = useState(currentUser.foto || DEFAULT_AVATAR);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Automatically trigger change password modal if query contains senha=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('senha') === 'true') {
      setIsPasswordModalOpen(true);
      // Clean query param
      navigate('/perfil', { replace: true });
    }
  }, [location, navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    updateCurrentUserProfile(nome, foto);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Reads the chosen image, converts to base64 and saves it as profile photo
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFoto(base64);
      updateCurrentUserProfile(nome, base64);
    };
    reader.readAsDataURL(file);
    // Reset input so selecting the same file again still triggers change
    e.target.value = '';
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validações
    if (!novaSenha || !confirmarSenha) {
      setPasswordError('Preencha a nova senha e a confirmação.');
      return;
    }

    if (novaSenha.length < 8) {
      setPasswordError('A nova senha deve possuir no mínimo 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setPasswordError('A nova senha e a confirmação não conferem.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) {
      setPasswordError('Erro ao alterar senha. Tente novamente.');
    } else {
      setPasswordSuccess(true);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 2000);
    }
  };

  return (
    <div id="perfil-viewport" className="space-y-8 text-left selection:bg-blue-500 selection:text-white">
      {/* Header Context */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Meu Perfil Corporativo</h2>
        <p className="text-xs text-slate-500 mt-1">Visualize seus dados de cadastro, altere suas preferências de exibição e credenciais de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Main details & Avatar editing */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6 items-center text-center relative">
            
            <div className="relative group mt-4">
              <img 
                src={foto} 
                alt={currentUser.nome} 
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-md"
              />
              <button
                id="btn-trigger-avatar"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
                title="Alterar foto de perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-4 space-y-1 w-full">
              <h3 className="font-bold text-slate-900 text-base">{nome}</h3>
              <p className="text-xs text-slate-500">{currentUser.cargo}</p>
              <div className="pt-2 flex justify-center">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 py-0.5 px-3 rounded-full uppercase tracking-wider">
                  {currentUser.perfil}
                </span>
              </div>
            </div>

            {/* Quick Actions List Block */}
            <div className="w-full pt-6 mt-6 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="btn-trigger-password"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>ALTERAR SENHA DE ACESSO</span>
              </button>
            </div>
          </div>

          {/* Quick Stats list (Read only) */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Metadados de Loggabilidade</h4>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Data do Cadastro</span>
                  <span className="text-xs text-slate-700 font-medium">{currentUser.dataCadastro || '01/01/2025'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Último Acesso Registrado</span>
                  <span className="text-xs text-slate-700 font-medium">{currentUser.ultimoAcesso || '16/06/2026 10:14'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Detailed forms & permissions display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main User Fields Edit */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-5">Detalhes Cadastrais</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="profile-nome">
                    Nome Completo
                  </label>
                  <input
                    id="profile-nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="profile-email">
                    Endereço de E-mail (Inalterável)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      id="profile-email"
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cargo Corporativo (Inalterável)
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      disabled
                      value={currentUser.cargo}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Departamento de Alocação (Inalterável)
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      disabled
                      value={currentUser.departamento || 'Diretoria Executiva'}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">* Detalhes funcionais bloqueados para edição pelo setor de TI e RH.</span>
                <button
                  id="btn-save-profile"
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-blue-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{isSaved ? 'DADOS SALVOS!' : 'SALVAR ALTERAÇÕES'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Secure Permissions Display */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Escopo de Nível de Permissões</h3>
            </div>

            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Seu perfil de acesso é mapeado como <strong className="text-slate-800">{currentUser.perfil}</strong>. Abaixo constam as principais diretrizes de governança aplicadas ao seu nível de privilégio:
              </p>

              {/* Grid of read only permissions cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Lavratura Total</span>
                    <span className="text-[10px] text-slate-500 block leading-normal">Criação, edição e exclusão de atas oficiais e rascunhos.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Parâmetros de Sistema</span>
                    <span className="text-[10px] text-slate-500 block leading-normal">Gerenciamento lúdico de categorias, relatórios e permissões.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Administração de Quadros</span>
                    <span className="text-[10px] text-slate-500 block leading-normal">Cadastramento direto e ativação/desativação de utilizadores.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">DocumentaLixeira</span>
                    <span className="text-[10px] text-slate-500 block leading-normal">Exclusão irreversível ou restauração de entidades arquivadas.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ALTERAR SENHA MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordError('');
                setPasswordSuccess(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Alterar Senha de Acesso</h4>
                </div>
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError('');
                    setPasswordSuccess(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-start gap-2 max-w-md antialiased">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs flex items-start gap-2 max-w-md antialiased font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Sua senha foi redefinida com sucesso! Fechando...</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                
                {/* Senha Atual */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block" htmlFor="original-pwd">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      id="original-pwd"
                      type={showSenhaAtual ? 'text' : 'password'}
                      placeholder="Senha atual utilizada"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full text-xs pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSenhaAtual ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block" htmlFor="new-pwd">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      id="new-pwd"
                      type={showNovaSenha ? 'text' : 'password'}
                      required
                      placeholder="Mínimo de 8 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full text-xs pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNovaSenha(!showNovaSenha)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNovaSenha ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block" htmlFor="confirm-pwd">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-pwd"
                      type={showConfirmarSenha ? 'text' : 'password'}
                      required
                      placeholder="Repita a nova senha digitada"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full text-xs pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmarSenha ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 uppercase tracking-wider cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    id="btn-confirm-change-password"
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-blue-600/10 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Confirmar Redefinição
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
