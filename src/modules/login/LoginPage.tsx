import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../providers/DataProvider';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, atas, categorias } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic stats from DataProvider
  const atasPublicadas = atas.filter(a => a.status === 'Publicada').length;
  const totalCategorias = categorias.length;
  const anoAtual = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha inválidos.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE — dark brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0D1117] flex-col justify-between p-12 relative overflow-hidden">

        {/* subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse,rgba(255,255,255,0.02),transparent_70%)]" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-end gap-3">
            <span className="text-white font-serif text-4xl font-black tracking-tight leading-none">SBS</span>
            <span className="text-slate-400 text-sm font-light tracking-widest pb-1">Participações</span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Painel de Administração</p>
          <h2 className="text-white font-bold text-3xl leading-snug">
            Gerencie atas,<br />
            documentos financeiros<br />
            e estatutos do Portal<br />
            de Transparência.
          </h2>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-end gap-10">
          <div>
            <p className="text-white font-black text-4xl">{atasPublicadas}</p>
            <p className="text-slate-500 text-xs mt-1 tracking-wide">Atas publicadas</p>
          </div>
          <div>
            <p className="text-white font-black text-4xl">{totalCategorias}</p>
            <p className="text-slate-500 text-xs mt-1 tracking-wide">Categorias</p>
          </div>
          <div>
            <p className="text-white font-black text-4xl">{anoAtual}</p>
            <p className="text-slate-500 text-xs mt-1 tracking-wide">Ano atual</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — login form */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">

        {/* Back to portal */}
        <div className="mb-12">
          <a
            href="https://atas-financeiras.vercel.app"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao portal
          </a>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="text-slate-900 font-serif text-3xl font-black tracking-tight">SBS</span>
            <span className="text-slate-400 text-xs font-light tracking-widest ml-2">Participações</span>
          </div>

          <h1 className="text-slate-900 font-bold text-2xl mb-1">Entrar no painel</h1>
          <p className="text-slate-400 text-sm mb-8">Use suas credenciais de administrador</p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@sbs.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D1117] hover:bg-slate-800 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-[11px] text-slate-300 mt-6 text-center">
            admin@financeata.com · admin123
          </p>
        </div>
      </div>
    </div>
  );
};
