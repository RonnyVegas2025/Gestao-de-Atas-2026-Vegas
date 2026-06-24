import React, { createContext, useContext, useState, useEffect } from 'react';
import { Categoria, Ata, UploadedFile, ItemLixeira, Usuario, AtividadeRecente, Notification } from '../types';

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
  { id: "cat-financeiro", nome: "Financeiro", cor: "purple", descricao: "Assuntos financeiros, orçamentos, auditorias e contas do exercício.", criadoEm: "2025-01-10" },
  { id: "cat-administrativo", nome: "Administrativo", cor: "indigo", descricao: "Decisões administrativas, organograma, TI e recursos humanos.", criadoEm: "2025-01-15" },
  { id: "cat-licitacoes", nome: "Licitações", cor: "emerald", descricao: "Processos de concorrência, licitações públicas e editais.", criadoEm: "2025-02-01" },
  { id: "cat-contratos", nome: "Contratos", cor: "sky", descricao: "Acompanhamento de obrigações e termos contratuais com fornecedores.", criadoEm: "2025-02-15" },
  { id: "cat-reunioes", nome: "Reuniões", cor: "rose", descricao: "Atas de reuniões gerais com coordenadores e assembleias regulares.", criadoEm: "2025-03-01" },
];

// Initial Atas
const INITIAL_ATAS: Ata[] = [
  {
    id: "ata-1537",
    numero: "ATA - 1537/1423.726",
    titulo: "Ata financeira referente à reunião ordinária",
    categoriaId: "cat-financeiro",
    descricao: "Revisão do balanço financeiro anual, aprovação de orçamento para investimentos de tecnologia e remanejamento do plano de contas para despesas recorrentes.",
    data: "2025-05-15",
    horario: "14:00",
    local: "Auditório Principal & Microsoft Teams",
    presidente: "Administrador",
    secretario: "Maria Souza",
    participantes: ["Administrador", "Maria Souza", "João Lima", "Ana Paula", "Carlos Ramos"],
    arquivos: [
      { name: "ATA - 1537/1423.726.pdf", size: "2.4 MB", type: "pdf", url: "#" }
    ],
    status: "Publicada",
    criadoEm: "2025-05-15T14:00:00Z",
    atualizadoEm: "2025-05-15T16:30:00Z",
    downloadsCount: 437
  },
  {
    id: "ata-1536",
    numero: "ATA - 1536/1423.725",
    titulo: "Ata administrativa referente à reunião extraordinária",
    categoriaId: "cat-administrativo",
    descricao: "Definição do plano de migração de servidores on-premise para nuvem hibrida e aprovação dos novos perfis de acesso remoto por VPN.",
    data: "2025-05-10",
    horario: "10:30",
    local: "Sala de Reuniões B",
    presidente: "Maria Souza",
    secretario: "João Lima",
    participantes: ["Maria Souza", "João Lima", "Carlos Santos", "Daniel Alencar"],
    arquivos: [
      { name: "ATA - 1536/1423.725.pdf", size: "1.8 MB", type: "pdf", url: "#" }
    ],
    status: "Publicada",
    criadoEm: "2025-05-10T10:30:00Z",
    atualizadoEm: "2025-05-10T12:00:00Z",
    downloadsCount: 312
  },
  {
    id: "ata-1535",
    numero: "ATA - 1535/1423.724",
    titulo: "Ata de processo de licitação",
    categoriaId: "cat-licitacoes",
    descricao: "Julgamento de recursos referentes à aquisição de novos computadores para o setor operacional. Parecer jurídico favorável à homologação presencial.",
    data: "2025-05-08",
    horario: "09:00",
    local: "Sala da Diretoria",
    presidente: "João Lima",
    secretario: "Gabriela Costa",
    participantes: ["João Lima", "Gabriela Costa", "Fernando Silva"],
    arquivos: [
      { name: "ATA - 1535/1423.724.pdf", size: "2.1 MB", type: "pdf", url: "#" }
    ],
    status: "Publicada",
    criadoEm: "2025-05-08T09:00:00Z",
    atualizadoEm: "2025-05-08T11:45:00Z",
    downloadsCount: 249
  },
  {
    id: "ata-1534",
    numero: "ATA - 1534/1423.723",
    titulo: "Ata de reunião ordinária",
    categoriaId: "cat-reunioes",
    descricao: "Reunião mensal de alinhamento estratégico com coordenadores. Apresentação do cronograma de desenvolvimento de novos sistemas internos de controle.",
    data: "2025-05-05",
    horario: "16:00",
    local: "Videoconferência Teams",
    presidente: "Roberto Campos",
    secretario: "Aline Reis",
    participantes: ["Roberto Campos", "Aline Reis", "Pedro Silva", "Juliana Lima"],
    arquivos: [],
    status: "Publicada",
    criadoEm: "2025-05-05T16:00:00Z",
    atualizadoEm: "2025-05-05T17:30:00Z",
    downloadsCount: 125
  },
  {
    id: "ata-1533",
    numero: "ATA - 1533/1423.722",
    titulo: "Ata de contrato de prestação de serviço",
    categoriaId: "cat-contratos",
    descricao: "Revisão e homologação das cláusulas de penalidade de nível de serviço (SLA) para a prestadora terceirizada de facilities e vigilância patrimonial.",
    data: "2025-05-02",
    horario: "11:00",
    local: "Sala Presencial de Treinamento",
    presidente: "Juliana Barros",
    secretario: "Ricardo Souza",
    participantes: ["Juliana Barros", "Ricardo Souza"],
    arquivos: [
      { name: "ATA - 1533_1423.722.pdf", size: "1.2 MB", type: "pdf", url: "#" }
    ],
    status: "Rascunho",
    criadoEm: "2025-05-02T11:00:00Z",
    atualizadoEm: "2025-05-02T12:15:00Z",
    downloadsCount: 0
  }
];

// Initial Uploads
const INITIAL_UPLOADS: UploadedFile[] = [
  { id: "up-1", nome: "ATA - 1537/1423.726.pdf", tipo: "pdf", tamanho: "2.4 MB", usuario: "Administrador", data: "2025-05-15", status: "Concluído" },
  { id: "up-2", nome: "ATA - 1536/1423.725.pdf", tipo: "pdf", tamanho: "1.8 MB", usuario: "Maria Souza", data: "2025-05-10", status: "Concluído" },
  { id: "up-3", nome: "ATA - 1535/1423.724.pdf", tipo: "pdf", tamanho: "2.1 MB", usuario: "João Lima", data: "2025-05-08", status: "Concluído" },
  { id: "up-4", nome: "CONTRATO_SEG_VIG_2025_V1.docx", tipo: "docx", tamanho: "4.5 MB", usuario: "Administrador", data: "2025-05-05", status: "Concluído" },
  { id: "up-5", nome: "PLANILHA_FIN_Q2_RECALC.xlsx", tipo: "xlsx", tamanho: "8.2 MB", usuario: "Aline Reis", data: "2025-05-03", status: "Concluído" },
];

// Initial Users
const INITIAL_USUARIOS: Usuario[] = [
  { id: "usr-1", nome: "Administrador", email: "admin@financeata.com", cargo: "Gerente Geral", departamento: "Presidência", perfil: "Administrador", status: "Ativo" },
  { id: "usr-2", nome: "Maria Souza", email: "maria.souza@corporativo.com", cargo: "Coordenadora Fiscal", departamento: "Financeiro", perfil: "Editor", status: "Ativo" },
  { id: "usr-3", nome: "João Lima", email: "joao.lima@licitacoes.gov", cargo: "Pregoeiro Líder", departamento: "Contratos/Licitações", perfil: "Editor", status: "Ativo" },
  { id: "usr-4", nome: "Gabriela Costa", email: "gabriela.costa@auxiliar.com", cargo: "Assistente Administrativa", departamento: "TI/Suporte", perfil: "Leitor", status: "Ativo" },
  { id: "usr-5", nome: "Fernando Silva", email: "fernando.silva@parceiro.com", cargo: "Auditor Externo", departamento: "Auditoria", perfil: "Leitor", status: "Inativo" },
];

// Initial Activity logs
const INITIAL_ATIVIDADES: AtividadeRecente[] = [
  { id: "act-1", usuario: "Administrador", acao: "publicou uma nova ata", documento: "ATA - 1537/1423.726", data: "Há 2 horas", perfilIniciais: "A", corPerfil: "bg-blue-600" },
  { id: "act-2", usuario: "Maria Souza", acao: "editou uma ata", documento: "ATA - 1536/1423.725", data: "Há 5 horas", perfilIniciais: "M", corPerfil: "bg-emerald-500" },
  { id: "act-3", usuario: "João Lima", acao: "fez upload de um arquivo", documento: "ATA - 1535/1423.724", data: "Há 1 dia", perfilIniciais: "J", corPerfil: "bg-orange-500" },
  { id: "act-4", usuario: "Sistema", acao: "realizou backup automático", documento: "Backup completo realizado", data: "Há 1 dia", perfilIniciais: "S", corPerfil: "bg-blue-500" },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    title: "Nova ata criada",
    message: "Ata ATA-1537 criada com sucesso",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    createdBy: "Administrador"
  },
  {
    id: "not-2",
    title: "Ata atualizada",
    message: "Ata ATA-1536 foi modificada",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    createdBy: "Maria Souza"
  },
  {
    id: "not-3",
    title: "Upload realizado",
    message: "Novo documento enviado",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    createdBy: "João Lima"
  },
  {
    id: "not-4",
    title: "Usuário cadastrado",
    message: "Novo usuário criado",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 1440 * 60000).toISOString(),
    createdBy: "Sistema"
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    return saved ? parseInt(saved, 10) : 5342;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('ata_is_authenticated');
    return saved !== null ? saved === 'true' : true;
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
  const addCategoria = (cat: Omit<Categoria, 'id' | 'criadoEm'>) => {
    const newCat: Categoria = {
      ...cat,
      id: `cat-${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    setCategorias(prev => [...prev, newCat]);
    logActivity(currentUser.nome, "cadastrou categoria", newCat.nome);
    addNotification("Categoria criada", `Categoria ${newCat.nome} criada com sucesso`, "success");
  };

  const updateCategoria = (id: string, updatedFields: Partial<Categoria>) => {
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    logActivity(currentUser.nome, "editou categoria", updatedFields.nome || "Categoria");
    addNotification("Categoria atualizada", `Categoria ${updatedFields.nome || "Categoria"} foi modificada`, "info");
  };

  const deleteCategoria = (id: string) => {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    setCategorias(prev => prev.filter(c => c.id !== id));
    logActivity(currentUser.nome, "excluiu categoria", cat.nome);
    addNotification("Categoria excluída", `Categoria ${cat.nome} excluída com sucesso`, "warning");
  };

  // Atas Handlers
  const addAta = (ataFields: Omit<Ata, 'id' | 'criadoEm' | 'atualizadoEm' | 'downloadsCount'>) => {
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

  const updateAta = (id: string, updatedFields: Partial<Ata>) => {
    const now = new Date().toISOString();
    setAtas(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields, atualizadoEm: now } : a));
    
    const ata = atas.find(a => a.id === id);
    if (ata) {
      logActivity(currentUser.nome, "editou ata", ata.numero);
      addNotification("Ata atualizada", `Ata ${ata.numero} foi modificada`, "info");
    }
  };

  const deleteAta = (id: string, user: string) => {
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
  const addUsuario = (userFields: Omit<Usuario, 'id'>) => {
    const newUser: Usuario = {
      ...userFields,
      id: `usr-${Date.now()}`,
    };
    setUsuarios(prev => [...prev, newUser]);
    logActivity(currentUser.nome, "cadastrou usuário", newUser.nome);
    addNotification("Usuário cadastrado", `Novo usuário ${newUser.nome} criado`, "success");
  };

  const updateUsuario = (id: string, updatedFields: Partial<Usuario>) => {
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
