import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const NovaAtaPage: React.FC = () => {
  const { categorias, addAta } = useData();
  const navigate = useNavigate();

  // Form Fields State
  const [numero, setNumero] = useState('ATA - ');
  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id || '');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState('14:00');
  const [local, setLocal] = useState('');
  const [presidente, setPresidente] = useState('Administrador');
  const [secretario, setSecretario] = useState('');
  const [status, setStatus] = useState<'Publicada' | 'Rascunho'>('Publicada');

  // Participants State
  const [novoParticipante, setNovoParticipante] = useState('');
  const [participantes, setParticipantes] = useState<string[]>(['Administrador']);

  // Upload Simulation State
  const [arquivos, setArquivos] = useState<{ name: string; size: string; type: string; url: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Add Participant
  const handleAddParticipante = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = novoParticipante.trim();
    if (!name) return;
    if (participantes.includes(name)) {
      setNovoParticipante('');
      return;
    }
    setParticipantes(prev => [...prev, name]);
    setNovoParticipante('');
  };

  // Remove Participant
  const handleRemoveParticipante = (name: string) => {
    setParticipantes(prev => prev.filter(p => p !== name));
  };

  // Drag Support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateFileUpload = (fileList: FileList) => {
    setIsUploading(true);
    setTimeout(() => {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const allowed = ['pdf', 'docx', 'xlsx'];
        
        if (allowed.includes(ext)) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          setArquivos(prev => [...prev, {
            name: file.name,
            size: `${sizeMB} MB`,
            type: ext,
            url: '#'
          }]);
        } else {
          alert('Apenas arquivos PDF, DOCX ou XLSX são aceitos!');
        }
      }
      setIsUploading(false);
      setDragActive(false);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || numero === 'ATA - ') {
      alert('Por favor, informe o número da ata para identificação.');
      return;
    }
    if (!titulo.trim()) {
      alert('Por favor, defina o título da ata.');
      return;
    }

    addAta({
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
    });

    navigate('/atas');
  };

  return (
    <div id="nova-ata-view" className="space-y-6">
      
      {/* UPPER TITLE BAR */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
        <button
          onClick={() => navigate('/atas')}
          className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/60 rounded-xl transition-all"
          title="Voltar para a listagem"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-950">Nova Ata Eletrônica</h2>
          <p className="text-xs text-gray-400 mt-1">Gere atas formais e vincule anexos e participantes imediatamente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* COL 1 & 2: REUNIÃO & ATA DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CARD 1: INFORMAÇÕES GERAIS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Dados Principais da Ata</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identificador / Número */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Número / Código Identificador *
                </label>
                <input
                  id="form-numero-ata"
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: ATA - 1538/1423.727"
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
                />
              </div>

              {/* Categorias */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Categoria da Ata *
                </label>
                <select
                  id="form-categoria-ata"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
                >
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Título da Ata */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Título Geral da Reunião / Assunto Principal *
              </label>
              <input
                id="form-titulo-ata"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex e.g. Reunião extraordinária para realocação de servidores"
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
              />
            </div>

            {/* Descrição / Conteúdo Deliberações */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Deliberações, Decisões e Pautas (Conteúdo)
              </label>
              <textarea
                id="form-descricao-ata"
                rows={8}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Insira as discussões gerais, aprovações, orçamentos acordados e demais decisões formais da mesa..."
                className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
              />
            </div>
          </div>

          {/* CARD 2: REUNIÃO METADATA */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Logística da Reunião</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Data de Reunião *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    id="form-data-ata"
                    type="date"
                    required
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Horário */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Horário de Início *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input
                    id="form-horario-ata"
                    type="text"
                    required
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    placeholder="Ex: 14:00"
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Local da Reunião */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Local ou Link da Videoconferência
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  id="form-local-ata"
                  type="text"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Ex: Auditório Administrativo ou Sala Virtual do Teams"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: FILE UPLOAD DRAGZONE */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Arquivos de Apoio / Anexos Oficiais</span>
            </h3>

            <p className="text-xs text-gray-400 leading-normal">
              Anexe arquivos relevantes de formatação oficial (PDF, DOCX, XLSX). O tamanho máximo recomendado é 15MB.
            </p>

            {/* DRAG AND DROP ZONE */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-600 bg-blue-50/40'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400 animate-pulse mb-3" />
                <span className="text-xs font-bold text-gray-700">Arraste seus arquivos aquis ou Clique para Upload</span>
                <span className="text-[11px] text-gray-400 mt-1">Formatos suportados: PDF, Word (.docx), Excel (.xlsx)</span>
              </label>
            </div>

            {/* List of files being uploaded */}
            {isUploading && (
              <div className="text-xs text-blue-600 font-medium flex items-center gap-2">
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                <span>Processando arquivos anexos...</span>
              </div>
            )}

            {arquivos.length > 0 && (
              <div className="space-y-2 mt-2">
                {arquivos.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold uppercase py-0.5 px-1.5 bg-slate-200 text-slate-700 rounded select-none shrink-0">
                        {file.type}
                      </span>
                      <span className="text-gray-700 font-semibold truncate max-w-xs">{file.name}</span>
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
          
          {/* CARD 4: RESPONSÁVEIS DE REUNIÃO */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Responsáveis pela Reunião</span>
            </h3>

            {/* Presidente */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Presidente / Moderador *
              </label>
              <input
                id="form-presidente-ata"
                type="text"
                required
                value={presidente}
                onChange={(e) => setPresidente(e.target.value)}
                placeholder="Nome do moderador da mesa"
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
              />
            </div>

            {/* Secretário */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Secretário para Redação *
              </label>
              <input
                id="form-secretario-ata"
                type="text"
                required
                value={secretario}
                onChange={(e) => setSecretario(e.target.value)}
                placeholder="Nome de quem irá redigir a ata"
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 font-medium"
              />
            </div>
          </div>

          {/* CARD 5: MULTIPLE PARTICIPANTS ASSIGNMENT */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Lista de Participantes</span>
            </h3>

            <p className="text-xs text-gray-400 leading-normal">
              Insira os nomes dos colaboradores ou terceiros que participaram da pauta oficial.
            </p>

            {/* Add Input trigger */}
            <div className="flex gap-2.5">
              <input
                id="form-novo-participante"
                type="text"
                placeholder="Adicionar nome completo..."
                value={novoParticipante}
                onChange={(e) => setNovoParticipante(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipante();
                  }
                }}
                className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => handleAddParticipante()}
                className="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Collapsed view of participants */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {participantes.map((part) => (
                <span
                  key={part}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-700 pl-2.5 pr-1.5 py-1 rounded-full border border-gray-200"
                >
                  <span className="truncate max-w-[120px]">{part}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipante(part)}
                    className="p-0.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {participantes.length === 0 && (
                <span className="text-xs text-gray-400 italic">Lista vazia.</span>
              )}
            </div>
          </div>

          {/* CARD 6: STATUS & ACTION BUTTONS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Status de Divulgação
            </h3>

            {/* Toggle public or draft preview */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStatus('Publicada')}
                className={`flex-1 text-xs font-bold text-center py-2 rounded-lg transition-all ${
                  status === 'Publicada'
                    ? 'bg-white text-emerald-700 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Publicada
              </button>
              <button
                type="button"
                onClick={() => setStatus('Rascunho')}
                className={`flex-1 text-xs font-bold text-center py-2 rounded-lg transition-all ${
                  status === 'Rascunho'
                    ? 'bg-white text-amber-700 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Rascunho
              </button>
            </div>

            {/* Main triggers: Save & Cancel */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                id="btn-salvar-nova-ata"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Salvar Documento
              </button>
              <button
                type="button"
                onClick={() => navigate('/atas')}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
