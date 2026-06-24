import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  UploadCloud,
  Trash2,
  Users,
  ShieldAlert,
  BarChart3,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useData } from '../providers/DataProvider';
import { Topbar } from '../components/Topbar';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      id={`nav-item-${label.toLowerCase().replace(/\s/g, '-')}`}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      <span className={`w-4 h-4 flex items-center justify-center ${active ? 'text-white' : 'text-slate-400'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useData();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const currentPath = location.pathname;

  // Derive page title for breadcrumbs
  const getHeaderInfo = () => {
    if (currentPath === '/' || currentPath === '/dashboard') {
      return { title: 'Dashboard Geral' };
    }
    if (currentPath.startsWith('/atas/nova')) {
      return { title: 'Nova Ata' };
    }
    if (currentPath.includes('/editar')) {
      return { title: 'Editar Ata' };
    }
    if (currentPath.match(/^\/atas\/[a-zA-Z0-9-]/)) {
      return { title: 'Visualização da Ata' };
    }
    if (currentPath.startsWith('/atas')) {
      return { title: 'Gestão de Atas' };
    }
    if (currentPath.startsWith('/categorias')) {
      return { title: 'Categorias' };
    }
    if (currentPath.startsWith('/uploads')) {
      return { title: 'Upload de Apoio' };
    }
    if (currentPath.startsWith('/lixeira')) {
      return { title: 'Lixeira' };
    }
    if (currentPath.startsWith('/usuarios')) {
      return { title: 'Gestão de Usuários' };
    }
    if (currentPath.startsWith('/permissoes')) {
      return { title: 'Matriz de Permissões' };
    }
    if (currentPath.startsWith('/relatorios')) {
      return { title: 'Relatórios Estatísticos' };
    }
    return { title: 'Sistema de Atas' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div id="app-container" className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        id="sidebar"
        className={`w-64 bg-[#1E293B] text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:translate-x-0 lg:static border-r border-slate-700/50 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* LOGO AREA */}
        <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold select-none text-base">G</div>
            <span className="text-white font-semibold text-lg tracking-tight">GestãoAtas</span>
          </div>
        </div>

        {/* MENU NAVIGATION */}
        <nav className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto scrollbar-thin">
          {/* SECTION: PAINEL GERAL */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              Painel Geral
            </p>
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
              active={currentPath === '/' || currentPath === '/dashboard'}
            />
          </div>

          {/* SECTION: DOCUMENTOS */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              Documentos
            </p>
            <ul className="space-y-1">
              <li>
                <SidebarItem
                  to="/atas"
                  icon={<FileText className="w-4 h-4" />}
                  label="Atas"
                  active={currentPath.startsWith('/atas')}
                />
              </li>
              <li>
                <SidebarItem
                  to="/categorias"
                  icon={<FolderTree className="w-4 h-4" />}
                  label="Categorias"
                  active={currentPath === '/categorias'}
                />
              </li>
              <li>
                <SidebarItem
                  to="/uploads"
                  icon={<UploadCloud className="w-4 h-4" />}
                  label="Uploads"
                  active={currentPath === '/uploads'}
                />
              </li>
              <li>
                <SidebarItem
                  to="/lixeira"
                  icon={<Trash2 className="w-4 h-4" />}
                  label="Lixeira"
                  active={currentPath === '/lixeira'}
                />
              </li>
            </ul>
          </div>

          {/* SECTION: CREDENCIAMENTO */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              Credenciamento
            </p>
            <ul className="space-y-1">
              <li>
                <SidebarItem
                  to="/usuarios"
                  icon={<Users className="w-4 h-4" />}
                  label="Usuários"
                  active={currentPath === '/usuarios'}
                />
              </li>
              <li>
                <SidebarItem
                  to="/permissoes"
                  icon={<ShieldAlert className="w-4 h-4" />}
                  label="Permissões"
                  active={currentPath === '/permissoes'}
                />
              </li>
              <li>
                <SidebarItem
                  to="/relatorios"
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Relatórios"
                  active={currentPath === '/relatorios'}
                />
              </li>
            </ul>
          </div>
        </nav>

        {/* Dynamic User Profile Status Footer */}
        <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-slate-500 border border-slate-400 text-white flex items-center justify-center font-bold text-xs select-none uppercase">
              {currentUser.nome.slice(0, 2)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate leading-tight">{currentUser.nome}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-none">{currentUser.perfil || 'Administrador'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* GLOBAL DYNAMIC TOPBAR */}
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* SCROLLABLE VIEWPORT CONTAINER */}
        <main id="main-viewport-content" className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Dynamic screen content container */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
