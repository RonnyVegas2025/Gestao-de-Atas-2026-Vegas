import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useData } from '../providers/DataProvider';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Key, 
  LogOut, 
  Check, 
  Trash2, 
  FileText, 
  Edit, 
  UploadCloud, 
  FolderTree, 
  Trash, 
  ShieldCheck, 
  ShieldAlert, 
  Info,
  CheckCheck,
  CheckCircle,
  Menu,
  Clock,
  Calendar
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    currentUser, 
    logout, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useData();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close dropdowns on route changes
  useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const currentPath = location.pathname;

  // Derive dynamic title and subtitle for Topbar
  const getPageContext = () => {
    if (currentPath === '/' || currentPath === '/dashboard') {
      return { 
        title: 'Dashboard', 
        subtitle: 'Bem-vindo de volta!' 
      };
    }
    if (currentPath.startsWith('/atas/nova')) {
      return { 
        title: 'Atas', 
        subtitle: 'Crie e registre um novo documento' 
      };
    }
    if (currentPath.includes('/editar')) {
      return { 
        title: 'Atas', 
        subtitle: 'Modifique as regras e atas registradas' 
      };
    }
    if (currentPath.match(/^\/atas\/[a-zA-Z0-9-]/)) {
      return { 
        title: 'Atas', 
        subtitle: 'Explore os detalhes e arquivos do termo' 
      };
    }
    if (currentPath.startsWith('/atas')) {
      return { 
        title: 'Atas', 
        subtitle: 'Gerencie todas as atas cadastradas' 
      };
    }
    if (currentPath.startsWith('/categorias')) {
      return { 
        title: 'Categorias', 
        subtitle: 'Gerencie as categorias estruturais de atas' 
      };
    }
    if (currentPath.startsWith('/uploads')) {
      return { 
        title: 'Uploads', 
        subtitle: 'Visualize os anexos e arquivos complementares' 
      };
    }
    if (currentPath.startsWith('/lixeira')) {
      return { 
        title: 'Lixeira', 
        subtitle: 'Recupere atas e uploads excluídos temporariamente' 
      };
    }
    if (currentPath.startsWith('/usuarios')) {
      return { 
        title: 'Usuários', 
        subtitle: 'Gerencie os usuários do sistema' 
      };
    }
    if (currentPath.startsWith('/permissoes')) {
      return { 
        title: 'Permissões', 
        subtitle: 'Gerencie a matriz operacional do sistema' 
      };
    }
    if (currentPath.startsWith('/relatorios')) {
      return { 
        title: 'Relatórios', 
        subtitle: 'Rastreabilidade e relatórios estatísticos de dados' 
      };
    }
    if (currentPath.startsWith('/perfil')) {
      return { 
        title: 'Perfil', 
        subtitle: 'Visualize e edite seus dados de acesso' 
      };
    }
    return { 
      title: 'Sistema de Atas', 
      subtitle: 'Painel Geral de Governança' 
    };
  };

  const context = getPageContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to get formatted date and hour
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { date: 'Recente', time: '' };
    
    const dStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const tStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { date: dStr, time: tStr };
  };

  const getNotificationIcon = (type: string, title: string) => {
    const isSuccess = type === 'success';
    const isWarning = type === 'warning';
    const isError = type === 'error';

    // Match icons loosely to notification titles
    const textLower = title.toLowerCase();
    
    if (textLower.includes('ata')) {
      if (textLower.includes('criada')) return <FileText className="w-4 h-4 text-emerald-500" />;
      return <Edit className="w-4 h-4 text-blue-500" />;
    }
    if (textLower.includes('upload') || textLower.includes('documento')) {
      if (textLower.includes('restaurado')) return <FolderTree className="w-4 h-4 text-emerald-500" />;
      if (textLower.includes('removido') || textLower.includes('excluido')) return <Trash className="w-4 h-4 text-amber-500" />;
      return <UploadCloud className="w-4 h-4 text-sky-500" />;
    }
    if (textLower.includes('usuário')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
    if (textLower.includes('categoria')) {
      return <FolderTree className="w-4 h-4 text-purple-500" />;
    }
    
    if (isSuccess) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (isWarning) return <ShieldAlert className="w-4 h-4 text-amber-500" />;
    if (isError) return <ShieldAlert className="w-4 h-4 text-red-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const getNotificationBg = (type: string) => {
    if (type === 'success') return 'bg-emerald-50 border-emerald-100/50';
    if (type === 'warning') return 'bg-amber-50 border-amber-100/50';
    if (type === 'error') return 'bg-red-50 border-red-100/50';
    return 'bg-blue-50 border-blue-100/50';
  };

  return (
    <header
      id="global-topbar"
      className="h-20 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between shrink-0 relative z-40 select-none"
    >
      {/* LEFT SIDE: PAGE CONTEXTUAL TITLES */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            id="topbar-mobile-burger"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 mr-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="text-left space-y-0.5">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{context.title}</h1>
          <p className="text-[11px] font-medium text-slate-400 max-w-xs md:max-w-md lg:max-w-lg truncate leading-none">{context.subtitle}</p>
        </div>
      </div>

      {/* RIGHT SIDE: NOTIFICATION & USER STATUS DROPDOWNS */}
      <div className="flex items-center gap-4">
        
        {/* BELL NOTIFICATIONS TRIGGER */}
        <div className="relative">
          <button
            id="bell-trigger"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className={`p-2.5 rounded-xl border text-slate-600 transition-all cursor-pointer relative ${
              notifOpen 
                ? 'bg-slate-100 border-slate-300 text-slate-900' 
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5" />

            {/* Notification unread badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="bell-badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center leading-none shadow-sm"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* NOTIFICATION CENTER DROPDOWN PANEL */}
          <AnimatePresence>
            {notifOpen && (
              <>
                {/* Visual Backdrop Layer for lightweight Dismiss */}
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-3.5 bg-white border border-slate-200 shadow-2xl rounded-2xl w-80 md:w-96 z-40 overflow-hidden flex flex-col text-left"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Notificações</span>
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 select-none animate-pulse">
                        {unreadCount} ATIVAS
                      </span>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Lidas todas</span>
                      </button>
                    )}
                  </div>

                  {/* Dropdown List Items scroll area */}
                  <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center flex flex-col items-center justify-center">
                        <Bell className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                        <span className="text-xs text-slate-400 font-medium mt-2">Nenhuma notificação ativa</span>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const dt = formatDateTime(n.createdAt);
                        return (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-4 flex items-start gap-3 transition-colors cursor-pointer relative hover:bg-slate-50/50 ${
                              !n.read ? 'bg-blue-50/15' : ''
                            }`}
                          >
                            {/* Icon Wrapper */}
                            <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center shrink-0 ${getNotificationBg(n.type)}`}>
                              {getNotificationIcon(n.type, n.title)}
                            </div>

                            {/* Middle Body */}
                            <div className="flex-1 space-y-0.5 text-left pr-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[11px] font-extrabold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>
                                  {n.title}
                                </span>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal">{n.message}</p>
                              
                              {/* Metadata date time */}
                              <div className="flex items-center gap-2.5 text-[9px] text-slate-400 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {dt.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {dt.time}
                                </span>
                                <span>-</span>
                                <span className="uppercase">por {n.createdBy}</span>
                              </div>
                            </div>

                            {/* Delete single notification button */}
                            <button
                              id={`delete-notif-${n.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(n.id);
                              }}
                              className="absolute right-3 top-3 text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                              title="Excluir notificação"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer Action */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] font-extrabold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer"
                      >
                        Limpar todo o painel
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* LINE VERTICAL SPLITTER */}
        <span className="w-px h-6 bg-slate-200 select-none" />

        {/* PROFILE CARD & DROPDOWN TRIGGER */}
        <div className="relative">
          <button
            id="profile-trigger"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl border transition-all cursor-pointer ${
              profileOpen
                ? 'bg-slate-100 border-slate-300'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <img 
              src={currentUser.foto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt={currentUser.nome} 
              className="w-8.5 h-8.5 rounded-lg object-cover shadow-xs border border-white"
            />
            <div className="text-left hidden md:flex flex-col select-none pr-1 focus:outline-none">
              <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">{currentUser.nome}</span>
              <span className="text-[9px] font-semibold text-slate-400 leading-none">{currentUser.cargo || 'Administrador'}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* PROFILE ACTIONS COMPONENT */}
          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-3.5 bg-white border border-slate-200 shadow-2xl rounded-2xl w-56 z-40 overflow-hidden flex flex-col text-left py-1.5"
                >
                  <Link
                    to="/perfil"
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Meu Perfil</span>
                  </Link>

                  <Link
                    to="/perfil?senha=true"
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-slate-400" />
                    <span>Alterar Senha</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-extrabold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border-0 text-left outline-none"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};
