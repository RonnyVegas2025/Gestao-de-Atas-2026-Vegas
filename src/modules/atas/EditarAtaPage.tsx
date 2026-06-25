import React, { useState, useEffect } from 'react';
import { useData } from '../../providers/DataProvider';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Upload,
  X,
  Plus,
  ArrowLeft,
  Edit,
} from 'lucide-react';

export const EditarAtaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { atas, categorias, updateAta, perfilUsuario } = useData();
  const navigate = useNavigate();

  // Leitor não pode editar atas
  useEffect(() => {
    if (perfilUsuario === 'Leitor') navigate('/atas');
  }, [perfilUsuario, navigate]);

  const originalAta = atas.find(a => a.id === id);

  // States
  const [numero, setNumero] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');
  const [presidente, setPresidente] = useState('');
  const [secretario, setSecretario] = useState('');
  const [status, setStatus] = useState<'Publicada' | 'Rascunho'>('Publicada');
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [novoParticipante, setNovoParticipante] = useState('');
  const [arquivos, setArquivos] = useState<{ name: string; size: string; type: string; url: string }[]>([]);
  const [arquivosUrls, setArquivosUrls] = useState<{ nome: string; url: string; tipo: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Hydrate fields
  useEffect(() => {
    if (originalAta) {
      setNumero(originalAta.numero);
      setTitulo(originalAta.titulo);
      setCategoriaId(originalAta.categoriaId);
      setDescricao(originalAta.descricao);
      setData(originalAta.data);
      setHorario(originalAta.horario);
      setLocal(originalAta.local);
      setPresidente(originalAta.presidente);
      setSecretario(originalAta.secretario);
      setStatus(originalAta.status);
      setParticipantes(originalAta.participantes);
      setArquivos(originalAta.arquivos || []);
      setArquivosUrls(originalAta.arquivosUrls || []);
    }
  }, [originalAta]);

  if (!originalAta) {
    return (
      <div className="bg-white p-8 border border-gray-100 rounded-2xl text-center">
        <p className="text-sm font-semibold text-gray-500">Ata irreconhecível ou excluída.</p>
      </div>
    );
  }

  // Participants Helper
  const handleAddParticipante = () => {
    const name = novoParticipante.trim();
    if (!name) return;
    if (participantes.includes(name)) {
      setNovoParticipante('');
      return;
    }
    setParticipantes(prev => [...prev, name]);
    setNovoParticipante('');
  };

  const handleRemoveParticipante = (name: string) => {
    setParticipantes(prev => prev.filter(p => p !== name));
  };

  // Real upload to Supabase Storage
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const filePath = `atas/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('documentos').upload(filePath, file);
    if (error) { alert('Erro ao enviar arquivo.'); return null; }
    const { data } = supabase.storage.from('documentos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!['pdf', 'docx', 'xlsx'].includes(ext)) {
        alert('Formatos permitidos: PDF, DOCX ou XLSX');
        return;
      }
      const url = await handleFileUpload(file);
      if (url) {
        setArquivos(prev => [...prev, {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: ext,
          url,
        }]);
        setArquivosUrls(prev => [...prev, { nome: file.name, url, tipo: file.type }]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
    setArquivosUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim()) return;
    if (!titulo.trim()) return;

    updateAta(originalAta.id, {
      numero,
      titulo,
      categoriaId,
      descricao,
      data,
      horario,
      local,
      presidente,
      secretario,
      participantes,
      arquivos,
      status,
      arquivosUrls,
    });

    navigate('/atas');
  };

  return (
    <div id="editar-ata-portal" className="space-y-6">
      
      {/* HEADER CONTROL */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
        <button
          onClick={() => navigate('/atas')}
          className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/60 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2">
            <Edit className="w-5 h-5 text-indigo-600" />
            <span>Editar Ata Oficial</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Modifique as deliberações e atualize os arquivos anexos com segurança</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* COL 1 & 2: REUNIÃO & ATA DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* INFORMAÇÕES PRINCIPAIS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Informações Gerais do Documento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Número identificador ou código *
                </label>
                <input
                  id="edit-form-numero"
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none focus:ring-1 font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Categoria Vinculada
                </label>
                <select
                  id="edit-form-categoria"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700"
                >
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Título do Documento *
              </label>
              <input
                id="edit-form-titulo"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none focus:ring-1 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Deliberações Registradas e Anotações Gerais
              </label>
              <textarea
                id="edit-form-descricao"
                rows={10}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none focus:ring-1"
              />
            </div>
          </div>

          {/* LOGISTICA E LOCAL */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Logística da Reunião
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Data de realização
                </label>
                <input
                  id="edit-form-data"
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Horário de Início
                </label>
                <input
                  id="edit-form-horario"
                  type="text"
                  required
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Localização / Link de Conexão
              </label>
              <input
                id="edit-form-local"
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-lg"
              />
            </div>
          </div>

          {/* ANEXOS MODIFICATION */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Arquivos de Apoio / Anexos Vinculados
            </h3>

            <div className="flex items-center gap-4">
              <input
                id="edit-file-upload"
                type="file"
                accept=".pdf,.docx,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="edit-file-upload"
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Anexar Novo Arquivo (.pdf, .docx, .xlsx)</span>
              </label>
            </div>

            {arquivos.length > 0 && (
              <div className="space-y-2 mt-4">
                {arquivos.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-indigo-50/20 border border-indigo-100/50 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase py-0.5 px-1.5 bg-indigo-100 text-indigo-700 rounded select-none">
                        {file.type}
                      </span>
                      <span className="text-gray-700 font-semibold">{file.name}</span>
                      <span className="text-gray-400">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50/60"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* COL 3: PRESIDENT & SECRETARY & MULTIPLE PARTICIPANTS LIST */}
        <div className="space-y-6">
          
          {/* RESPONSAVIES */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Composição da Mesa
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Presidente da Sessão *
              </label>
              <input
                id="edit-form-presidente"
                type="text"
                required
                value={presidente}
                onChange={(e) => setPresidente(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Secretário Redator *
              </label>
              <input
                id="edit-form-secretario"
                type="text"
                required
                value={secretario}
                onChange={(e) => setSecretario(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-lg"
              />
            </div>
          </div>

          {/* PARTICIPANTES CO-AUTORES */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Participantes do Conselho
            </h3>

            <div className="flex gap-2">
              <input
                id="edit-form-participante"
                type="text"
                placeholder="Nome curto..."
                value={novoParticipante}
                onChange={(e) => setNovoParticipante(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipante();
                  }
                }}
                className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddParticipante}
                className="px-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {participantes.map((part) => (
                <span
                  key={part}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-gray-100 text-gray-700 pl-2.5 pr-1.5 py-1 rounded-full border border-gray-200"
                >
                  <span className="truncate max-w-[120px]">{part}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipante(part)}
                    className="p-0.5 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* STATUS DE DIVULGAÇÃO & SAVE TRIGGERS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Status de Divulgacão
            </h3>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStatus('Publicada')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  status === 'Publicada' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Publicada
              </button>
              <button
                type="button"
                onClick={() => setStatus('Rascunho')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  status === 'Rascunho' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Rascunho
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                id="btn-salvar-edicao"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-md cursor-pointer"
              >
                Confirmar Modificações
              </button>
              <button
                type="button"
                onClick={() => navigate('/atas')}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Voltar à Listagem
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
