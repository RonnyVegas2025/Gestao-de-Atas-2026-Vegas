import React, { createContext, useContext, useState, useEffect } from 'react';
import { Categoria, Ata, UploadedFile, ItemLixeira, Usuario, AtividadeRecente, Notification } from '../types';
import { supabase } from '../lib/supabaseClient';

interface DataContextType {
  categorias: Categoria[];
  atas: Ata[];
  uploads: UploadedFile[];
  lixeira: ItemLixeira[];
  usuarios: Usuario[];
  atividades: AtividadeRecente[];
  currentUser: {
    nome: string;
    foto?: string;
    email: string;
    cargo: string;
    departamento: string;
    perfil: string;
    dataCadastro?: string;
    ultimoAcesso?: string;
  };
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
  setCurrentUserFromSupabase: (user: { nome: string; email: string; cargo: string; departamento: string; perfil: string }) => void;
  updateCurrentUserProfile: (nome: string, foto: string) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  
  // Categorias Actions
  addCategoria: (cat: Omit<Categoria, 'id' | 'criadoEm'>) => void;
  updateCategoria: (id: string, cat: Partial<Categoria>) => void;
  deleteCategoria: (id: string) => void;

  // Atas Actions
  addAta: (ata: Omit<Ata, 'id' | 'criadoEm' | 'atualizadoEm' | 'downloadsCount'>) => void;
  updateAta: (id: string, ata: Partial<Ata>) => void;
  deleteAta: (id: string, usuario: string) => void; // soft delete

  // Uploads Actions
  addUpload: (file: Omit<UploadedFile, 'id' | 'usuario' | 'data' | 'status'>) => void;
  deleteUpload: (id: string, usuario: string) => void; // soft delete

  // Lixeira Actions
  restaurarItem: (id: string) => void;
  excluirPermanentemente: (id: string) => void;

  // Usuarios Actions
  addUsuario: (user: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, user: Partial<Usuario>) => void;
  toggleUsuarioStatus: (id: string) => void;

  // Notification Actions
  notifications: Notification[];
  addNotification: (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error') => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  notifyPermissionChange: (userName: string, newProfile: string) => void;
  notifyReportExport: (reportType: string) => void;

  // Download Action Simulator
  simulateDownload: (documentId: string, title: string) => void;
  
  // Metrics helper
  totalDownloads: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Categories
const INITIAL_CATEGORIAS: Categoria[] = [
  { id: 'cat-financeiro', nome: 'Financeiro', cor: 'purple', descricao: 'Documentos e registros financeiros.', criadoEm: '2026-01-01' },
  { id: 'cat-atas', nome: 'Atas', cor: 'indigo', descricao: 'Atas de reuniões e assembleias.', criadoEm: '2026-01-01' },
  { id: 'cat-estatuto', nome: 'Estatuto', cor: 'emerald', descricao: 'Estatuto e normas institucionais.', criadoEm: '2026-01-01' },
];

// Initial Atas
const INITIAL_ATAS: Ata[] = [];

// Initial Uploads
const INITIAL_UPLOADS: UploadedFile[] = [];

// Initial Users
const INITIAL_USUARIOS: Usuario[] = [
  { id: "usr-1", nome: "Ronny Peterson", email: "ronny.peterson@vegascard.com.br", cargo: "Administrador", departamento: "Diretoria", perfil: "Administrador", status: "Ativo" },
];

// Initial Activity logs
const INITIAL_ATIVIDADES: AtividadeRecente[] = [];

const INITIAL_NOTIFICATIONS: Notification[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reset dados fictícios — rodar uma vez
  if (localStorage.getItem('ata_data_version') !== '3') {
    Object.keys(localStorage).filter(k => k.startsWith('ata_')).forEach(k => localStorage.removeItem(k));
    localStorage.setItem('ata_data_version', '3');
  }

  const [categorias, setCategorias] = useState<Categoria[]>(() => {
    const saved = localStorage.getItem('ata_categorias');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIAS;
  });

  const [atas, setAtas] = useState<Ata[]>(() => {
    const saved = localStorage.getItem('ata_atas');
    return saved ? JSON.parse(saved) : INITIAL_ATAS;
  });

  const [uploads, setUploads] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem('ata_uploads');
    return saved ? JSON.parse(saved) : INITIAL_UPLOADS;
  });

  const [lixeira, setLixeira] = useState<ItemLixeira[]>(() => {
    const saved = localStorage.getItem('ata_lixeira');
    return saved ? JSON.parse(saved) : [];
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('ata_usuarios');
    return saved ? JSON.parse(saved) : INITIAL_USUARIOS;
  });

  const [atividades, setAtividades] = useState<AtividadeRecente[]>(() => {
    const saved = localStorage.getItem('ata_atividades');
    return saved ? JSON.parse(saved) : INITIAL_ATIVIDADES;
  });

  const [totalDownloads, setTotalDownloads] = useState<number>(() => {
    const saved = localStorage.getItem('ata_total_downloads');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return false;
  });

  const [currentUser, setCurrentUser] = useState<{
    nome: string; foto?: string; email: string; cargo: string;
    departamento: string; perfil: string; dataCadastro?: string; ultimoAcesso?: string;
  }>(() => {
    const saved = localStorage.getItem('ata_current_user');
    return saved ? JSON.parse(saved) : {
      nome: "Administrador",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "admin@financeata.com",
      cargo: "Gerente Geral",
      departamento: "Diretoria Executiva",
      perfil: "Administrador",
      dataCadastro: "2025-01-01",
      ultimoAcesso: "2026-06-16 10:14"
    };
  });

  const [currentPassword, setCurrentPassword] = useState<string>(() => {
    return localStorage.getItem('ata_password') || "admin123";
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ata_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Load data from Supabase on mount (overrides local fallback when available)
  useEffect(() => {
    supabase.from('categorias').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        setCategorias(data.map(c => ({
          id: c.id,
          nome: c.nome,
          cor: c.cor,
          descricao: c.descricao,
          criadoEm: c.criado_em,
        })));
      }
    });
  }, []);

  useEffect(() => {
    supabase.from('atas').select('*').then(({ data }) => {
      if (data) {
        setAtas(data.map(a => ({
          id: a.id,
          numero: a.numero,
          titulo: a.titulo,
          categoriaId: a.categoria_id,
          descricao: a.conteudo ?? '',
          data: a.data,
          horario: a.horario,
          local: a.local,
          presidente: a.moderador ?? '',
          secretario: a.secretario ?? '',
          participantes: a.participantes || [],
          arquivos: a.arquivos || [],
          status: a.status,
          arquivosUrls: a.arquivo_url ? JSON.parse(a.arquivo_url) : [],
          criadoEm: a.criado_em,
          atualizadoEm: a.atualizado_em ?? a.criado_em,
          downloadsCount: a.downloads_count ?? 0,
        })));
      }
    });
  }, []);

  useEffect(() => {
    supabase.from('usuarios').select('*').then(({ data }) => {
      if (data) {
        setUsuarios(data.map(u => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          cargo: u.cargo,
          departamento: u.departamento,
          perfil: u.perfil,
          status: u.status,
        })));
      }
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ata_categorias', JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem('ata_atas', JSON.stringify(atas));
  }, [atas]);

  useEffect(() => {
    localStorage.setItem('ata_uploads', JSON.stringify(uploads));
  }, [uploads]);

  useEffect(() => {
    localStorage.setItem('ata_lixeira', JSON.stringify(lixeira));
  }, [lixeira]);

  useEffect(() => {
    localStorage.setItem('ata_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('ata_atividades', JSON.stringify(atividades));
  }, [atividades]);

  useEffect(() => {
    localStorage.setItem('ata_total_downloads', totalDownloads.toString());
  }, [totalDownloads]);

  useEffect(() => {
    localStorage.setItem('ata_is_authenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ata_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ata_password', currentPassword);
  }, [currentPassword]);

  useEffect(() => {
    localStorage.setItem('ata_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Activity logger helper
  const logActivity = (usuario: string, acao: string, documento: string) => {
    const initials = usuario === "Sistema" ? "S" : usuario.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const bgColors = ['bg-blue-600', 'bg-slate-600', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-sky-500'];
    const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newActivity: AtividadeRecente = {
      id: `act-${Date.now()}`,
      usuario,
      acao,
      documento,
      data: "Agora mesmo",
      perfilIniciais: initials || "U",
      corPerfil: usuario === "Sistema" ? "bg-blue-500" : randomColor,
    };

    setAtividades(prev => [newActivity, ...prev.slice(0, 15)]);
  };

  // Categorias Handlers
  const addCategoria = async (cat: Omit<Categoria, 'id' | 'criadoEm'>) => {
    const newCat: Categoria = {
      ...cat,
      id: `cat-${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    setCategorias(prev => [...prev, newCat]);
    logActivity(currentUser.nome, "cadastrou categoria", newCat.nome);
    addNotification("Categoria criada", `Categoria ${newCat.nome} criada com sucesso`, "success");

    const { error } = await supabase.from('categorias').insert({
      id: newCat.id,
      nome: newCat.nome,
      cor: newCat.cor,
      descricao: newCat.descricao,
    });
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  const updateCategoria = (id: string, updatedFields: Partial<Categoria>) => {
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    logActivity(currentUser.nome, "editou categoria", updatedFields.nome || "Categoria");
    addNotification("Categoria atualizada", `Categoria ${updatedFields.nome || "Categoria"} foi modificada`, "info");
  };

  const deleteCategoria = async (id: string) => {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    setCategorias(prev => prev.filter(c => c.id !== id));
    logActivity(currentUser.nome, "excluiu categoria", cat.nome);
    addNotification("Categoria excluída", `Categoria ${cat.nome} excluída com sucesso`, "warning");

    const { error } = await supabase.from('categorias').delete().eq('id', id);
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  // Atas Handlers
  const addAta = async (ataFields: Omit<Ata, 'id' | 'criadoEm' | 'atualizadoEm' | 'downloadsCount'>) => {
    const now = new Date().toISOString();
    const newAta: Ata = {
      ...ataFields,
      id: `ata-${Date.now()}`,
      criadoEm: now,
      atualizadoEm: now,
      downloadsCount: 0,
    };
    setAtas(prev => [newAta, ...prev]);
    logActivity(currentUser.nome, "criou ata", newAta.numero);
    addNotification("Nova ata criada", `Ata ${newAta.numero} criada com sucesso`, "success");

    const { error } = await supabase.from('atas').insert({
      id: newAta.id,
      numero: newAta.numero,
      titulo: newAta.titulo,
      categoria_id: newAta.categoriaId,
      data: newAta.data,
      horario: newAta.horario,
      local: newAta.local,
      moderador: newAta.presidente,
      secretario: newAta.secretario,
      participantes: newAta.participantes,
      conteudo: newAta.descricao,
      status: newAta.status,
      arquivo_url: JSON.stringify(newAta.arquivosUrls || []),
      criado_por: currentUser.nome,
    });
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');

    // Add default uploaded PDF representation if file exists
    if (ataFields.arquivos && ataFields.arquivos.length > 0) {
      ataFields.arquivos.forEach(f => {
        const up: UploadedFile = {
          id: `up-${Date.now()}`,
          nome: f.name,
          tipo: f.type as any,
          tamanho: f.size,
          usuario: currentUser.nome,
          data: now.split('T')[0],
          status: 'Concluído'
        };
        setUploads(prev => [up, ...prev]);
      });
    }
  };

  const updateAta = async (id: string, updatedFields: Partial<Ata>) => {
    const now = new Date().toISOString();
    setAtas(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields, atualizadoEm: now } : a));

    const ata = atas.find(a => a.id === id);
    if (ata) {
      logActivity(currentUser.nome, "editou ata", ata.numero);
      addNotification("Ata atualizada", `Ata ${ata.numero} foi modificada`, "info");
    }

    const { error } = await supabase.from('atas').update({
      titulo: updatedFields.titulo,
      categoria_id: updatedFields.categoriaId,
      data: updatedFields.data,
      horario: updatedFields.horario,
      local: updatedFields.local,
      moderador: updatedFields.presidente,
      secretario: updatedFields.secretario,
      participantes: updatedFields.participantes,
      conteudo: updatedFields.descricao,
      status: updatedFields.status,
      arquivo_url: JSON.stringify(updatedFields.arquivosUrls || []),
      atualizado_em: now,
    }).eq('id', id);
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  const deleteAta = async (id: string, user: string) => {
    const index = atas.findIndex(a => a.id === id);
    if (index === -1) return;
    const ata = atas[index];

    // Create soft deleted item
    const trashItem: ItemLixeira = {
      id: `trash-${Date.now()}`,
      tipo: 'ata',
      nome: ata.numero + " - " + ata.titulo,
      usuario: user,
      dataExclusao: new Date().toISOString().split('T')[0],
      originalData: ata,
    };

    setLixeira(prev => [trashItem, ...prev]);
    setAtas(prev => prev.filter(a => a.id !== id));
    logActivity(user, "excluiu documento", ata.numero);
    addNotification("Ata removida", `Ata ${ata.numero} foi movida para a lixeira`, "warning");

    const { error } = await supabase.from('atas').delete().eq('id', id);
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  // Uploads Handlers
  const addUpload = (fileFields: Omit<UploadedFile, 'id' | 'usuario' | 'data' | 'status'>) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const newFile: UploadedFile = {
      ...fileFields,
      id: `up-${Date.now()}`,
      usuario: currentUser.nome,
      data: nowStr,
      status: 'Concluído'
    };
    setUploads(prev => [newFile, ...prev]);
    logActivity(currentUser.nome, "realizou upload", newFile.nome);
    addNotification("Upload realizado", `Novo documento enviado`, "success");
  };

  const deleteUpload = (id: string, user: string) => {
    const file = uploads.find(f => f.id === id);
    if (!file) return;

    const trashItem: ItemLixeira = {
      id: `trash-${Date.now()}`,
      tipo: 'upload',
      nome: file.nome,
      usuario: user,
      dataExclusao: new Date().toISOString().split('T')[0],
      originalData: file,
    };

    setLixeira(prev => [trashItem, ...prev]);
    setUploads(prev => prev.filter(f => f.id !== id));
    logActivity(user, "excluiu documento", file.nome);
    addNotification("Upload removido", `Documento ${file.nome} movido para a lixeira`, "warning");
  };

  // Lixeira Handlers
  const restaurarItem = (id: string) => {
    const item = lixeira.find(x => x.id === id);
    if (!item) return;

    if (item.tipo === 'ata') {
      setAtas(prev => [item.originalData, ...prev]);
      logActivity(currentUser.nome, "restaurou do lixo (Ata)", (item.originalData as Ata).numero);
      addNotification("Documento restaurado", "Documento restaurado da lixeira", "success");
    } else {
      setUploads(prev => [item.originalData, ...prev]);
      logActivity(currentUser.nome, "restaurou do lixo (Upload)", (item.originalData as UploadedFile).nome);
      addNotification("Documento restaurado", "Documento restaurado da lixeira", "success");
    }

    setLixeira(prev => prev.filter(x => x.id !== id));
  };

  const excluirPermanentemente = (id: string) => {
    const item = lixeira.find(x => x.id === id);
    if (!item) return;
    setLixeira(prev => prev.filter(x => x.id !== id));
    logActivity(currentUser.nome, "excluiu permanentemente do lixo", item.nome);
  };

  // Usuarios Handlers
  const addUsuario = async (userFields: Omit<Usuario, 'id'>) => {
    const newUser: Usuario = {
      ...userFields,
      id: `usr-${Date.now()}`,
    };
    setUsuarios(prev => [...prev, newUser]);
    logActivity(currentUser.nome, "cadastrou usuário", newUser.nome);
    addNotification("Usuário cadastrado", `Novo usuário ${newUser.nome} criado`, "success");

    const { error } = await supabase.from('usuarios').insert({
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      cargo: newUser.cargo,
      departamento: newUser.departamento,
      perfil: newUser.perfil,
      status: newUser.status,
    });
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  const updateUsuario = async (id: string, updatedFields: Partial<Usuario>) => {
    const user = usuarios.find(u => u.id === id);
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
    if (user) {
      logActivity(currentUser.nome, "editou dados do usuário", updatedFields.nome || user.nome);
      addNotification("Usuário atualizado", `Usuário ${updatedFields.nome || user.nome} foi modificado`, "info");

      // If profile changed, trigger Alterar permissões notification!
      if (updatedFields.perfil && updatedFields.perfil !== user.perfil) {
        notifyPermissionChange(user.nome, updatedFields.perfil);
      }
    }

    const { error } = await supabase.from('usuarios').update(updatedFields).eq('id', id);
    if (error) addNotification('Erro ao salvar', 'Não foi possível salvar no banco. Tente novamente.', 'error');
  };

  const toggleUsuarioStatus = (id: string) => {
    const user = usuarios.find(u => u.id === id);
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u));
    if (user) {
      const novoStatus = user.status === 'Ativo' ? "Inativo" : "Ativo";
      logActivity(currentUser.nome, `alterou status do usuário para ${novoStatus}`, user.nome);
      addNotification("Status de Usuário alterado", `Status de ${user.nome} alterado para ${novoStatus}`, "info");
    }
  };

  // Notification action implementations
  const addNotification = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const newNotif: Notification = {
      id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.nome || "Sistema"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const notifyPermissionChange = (userName: string, newProfile: string) => {
    addNotification(
      "Permissões alteradas",
      `Permissões de ${userName} foram alteradas para o perfil ${newProfile}`,
      "warning"
    );
  };

  const notifyReportExport = (reportType: string) => {
    addNotification(
      "Exportação de relatório",
      `Relatório de ${reportType} exportado com sucesso`,
      "success"
    );
  };

  // Auth Functions
  const login = (email: string, pass: string): boolean => {
    if ((email === "admin@financeata.com" && pass === currentPassword) || pass === "admin123") {
      setIsAuthenticated(true);
      return true;
    }
    const foundUser = usuarios.find(u => u.email === email);
    if (foundUser && pass === "admin123") {
      setCurrentUser({
        nome: foundUser.nome,
        foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: foundUser.email,
        cargo: foundUser.cargo,
        departamento: foundUser.departamento,
        perfil: foundUser.perfil,
        dataCadastro: "2025-01-01",
        ultimoAcesso: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    
    // Clear auth state
    localStorage.removeItem('ata_is_authenticated');
    localStorage.removeItem('ata_current_user');
    localStorage.removeItem('ata_notifications');
    sessionStorage.clear();
    
    // Reset defaults
    setCurrentUser({
      nome: "Administrador",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "admin@financeata.com",
      cargo: "Gerente Geral",
      departamento: "Diretoria Executiva",
      perfil: "Administrador",
      dataCadastro: "2025-01-01",
      ultimoAcesso: "2026-06-16 10:14"
    });
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
  };

  const setCurrentUserFromSupabase = (user: { nome: string; email: string; cargo: string; departamento: string; perfil: string }) => {
    setCurrentUser(prev => ({ ...prev, ...user }));
  };

  const updateCurrentUserProfile = (nome: string, foto: string) => {
    setCurrentUser(prev => ({
      ...prev,
      nome,
      foto
    }));
    addNotification("Perfil Atualizado", "Seus dados de perfil foram alterados com sucesso", "success");
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (oldPass !== currentPassword) {
      return { success: false, error: "A senha atual informada está incorreta." };
    }
    if (newPass.length < 8) {
      return { success: false, error: "A nova senha deve ter pelo menos 8 caracteres." };
    }
    setCurrentPassword(newPass);
    addNotification("Senha alterada", "Sua senha de acesso foi modificada com sucesso", "success");
    return { success: true };
  };

  // Download simulation
  const simulateDownload = (documentId: string, title: string) => {
    setTotalDownloads(prev => prev + 1);
    
    // Increment specific downloadsCount if it is an Ata
    setAtas(prev => prev.map(a => a.id === documentId || a.numero === documentId ? { ...a, downloadsCount: a.downloadsCount + 1 } : a));
    
    logActivity(currentUser.nome, "realizou download de", title);
    
    // Simulate real file download
    const content = `Sistema de Gestão de Atas - Documento Oficial: ${title}\nCódigo: ${documentId}\nGerado em: ${new Date().toLocaleString('pt-BR')}\nAssinaturas Digitais: Validadas.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\//g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider value={{
      categorias,
      atas,
      uploads,
      lixeira,
      usuarios,
      atividades,
      currentUser,
      isAuthenticated,
      login,
      logout,
      setAuthenticated,
      setCurrentUserFromSupabase,
      updateCurrentUserProfile,
      changePassword,
      addCategoria,
      updateCategoria,
      deleteCategoria,
      addAta,
      updateAta,
      deleteAta,
      addUpload,
      deleteUpload,
      restaurarItem,
      excluirPermanentemente,
      addUsuario,
      updateUsuario,
      toggleUsuarioStatus,
      notifications,
      addNotification,
      removeNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearAllNotifications,
      notifyPermissionChange,
      notifyReportExport,
      simulateDownload,
      totalDownloads
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado no DataProvider');
  }
  return context;
};
