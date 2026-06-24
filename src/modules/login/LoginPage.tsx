import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../providers/DataProvider';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    
    // Slight delay for premium SaaS native feeling
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha inválidos. Utilize os dados de demonstração abaixo.');
      }
    }, 800);
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mb-3 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            G
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Portal GestãoAtas</h2>
          <p className="text-xs text-slate-400 mt-1">Insira suas credenciais para acessar o painel administrativo</p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-xs text-red-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block" htmlFor="email">
              Endereço de E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                id="email"
                type="email"
                required
                placeholder="exemplo@financeata.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 text-slate-100 text-xs pl-11 pr-4 py-3.5 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block" htmlFor="password">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                id="password"
                type="password"
                required
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 text-slate-100 text-xs pl-11 pr-4 py-3.5 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-entrar"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-blue-900/20 uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Autenticando...</span>
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-left">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wide block">Credenciais de Acesso Rápido</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Utilize <strong className="text-slate-200">admin@financeata.com</strong> com a senha <strong className="text-slate-200">admin123</strong> ou logins cadastrados em usuários.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
