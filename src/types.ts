export interface Categoria {
  id: string;
  nome: string;
  cor: string; // e.g., "purple" | "indigo" | "emerald" | "orange" | "sky" | "rose"
  descricao: string;
  criadoEm: string;
}

export interface Ata {
  id: string;
  numero: string;
  titulo: string;
  categoriaId: string; // references Categoria.id or "Financeiro", "Administrativo", etc.
  descricao: string;
  data: string; // YYYY-MM-DD
  horario: string;
  local: string;
  presidente: string;
  secretario: string;
  participantes: string[];
  arquivos: {
    name: string;
    size: string;
    type: string; // "pdf" | "docx" | "xlsx"
    url: string;
  }[];
  status: 'Publicada' | 'Rascunho';
  arquivosUrls?: { nome: string; url: string; tipo: string }[];
  criadoEm: string;
  atualizadoEm: string;
  downloadsCount: number;
}

export interface UploadedFile {
  id: string;
  nome: string;
  tipo: 'pdf' | 'docx' | 'xlsx';
  tamanho: string;
  usuario: string;
  data: string;
  status: 'Processando' | 'Concluído' | 'Falhou';
}

export interface ItemLixeira {
  id: string;
  tipo: 'ata' | 'upload';
  nome: string; // Título da ata ou nome do arquivo
  usuario: string; // Quem excluiu
  dataExclusao: string;
  originalData: any; // O objeto inteiro para ser restaurado
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  perfil: 'Administrador' | 'Editor' | 'Leitor';
  status: 'Ativo' | 'Inativo';
}

export interface AtividadeRecente {
  id: string;
  usuario: string;
  acao: string; // e.g. "publicou uma nova ata", "editou uma ata"
  documento: string; // e.g. "ATA - 1537/1423.726"
  data: string; // e.g. "Há 2 horas", "Há 1 dia"
  perfilIniciais: string; // e.g. "A", "M"
  corPerfil: string; // tailwind color class
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
  createdAt: string; // ISO string
  createdBy: string;
}
