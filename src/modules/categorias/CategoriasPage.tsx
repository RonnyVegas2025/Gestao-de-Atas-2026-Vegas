import React, { useState } from 'react';
import { useData } from '../../providers/DataProvider';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';

export const CategoriasPage: React.FC = () => {
  const {
    categorias,
    atas,
    addCategoria,
    updateCategoria,
    deleteCategoria,
  } = useData();

  // Create Mode states
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('purple');
  const [descricao, setDescricao] = useState('');

  // Edit Mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCor, setEditCor] = useState('purple');
  const [editDescricao, setEditDescricao] = useState('');

  const availableColors = [
    { name: 'purple', Class: 'bg-purple-500', hex: '#7c3aed' },
    { name: 'blue', Class: 'bg-blue-600', hex: '#2563eb' },
    { name: 'emerald', Class: 'bg-emerald-500', hex: '#10b981' },
    { name: 'orange', Class: 'bg-orange-500', hex: '#f97316' },
    { name: 'sky', Class: 'bg-sky-400', hex: '#38bdf8' },
    { name: 'rose', Class: 'bg-rose-500', hex: '#f43f5e' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    addCategoria({ nome, cor, descricao });
    setNome('');
    setDescricao('');
  };

  const handleStartEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditNome(cat.nome);
    setEditCor(cat.cor);
    setEditDescricao(cat.descricao);
  };

  const handleSaveEdit = () => {
    if (!editNome.trim() || !editingId) return;
    updateCategoria(editingId, {
      nome: editNome,
      cor: editCor,
      descricao: editDescricao,
    });
    setEditingId(null);
  };

  // Counting real minutes linked in DB
  const getMinutesCount = (id: string) => {
    return atas.filter(a => a.categoriaId === id).length;
  };

  const getColorPoint = (corName: string) => {
    switch (corName) {
      case 'purple': return 'bg-purple-500';
      case 'indigo': return 'bg-indigo-600';
      case 'emerald': return 'bg-emerald-500';
      case 'orange': return 'bg-orange-500';
      case 'sky': return 'bg-sky-400';
      case 'rose': return 'bg-rose-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div id="categorias-view" className="space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
        <h2 className="text-lg font-bold text-gray-950">Gerência de Categorias</h2>
        <p className="text-xs text-gray-400 mt-1">Defina classificações, cores identificadoras e decore e ordene pastas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* COL 1: CREATE FORM (1/3 Width) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 font-sans">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Cadastrar Categoria</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            {/* Nome */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Nome da Categoria *
              </label>
              <input
                id="cat-form-nome"
                type="text"
                required
                placeholder="Ex: Auditorias, Licitações, TI"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Descrição de Escopo
              </label>
              <textarea
                id="cat-form-desc"
                rows={4}
                placeholder="Indique quais tipos de atas e deliberações oficiais pertencem a esta tag..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white rounded-lg focus:outline-none"
              />
            </div>

            {/* Cor representativa */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Cor de Destaque
              </label>
              <div className="flex items-center gap-2.5">
                {availableColors.map((colorItem) => (
                  <button
                    key={colorItem.name}
                    type="button"
                    onClick={() => setCor(colorItem.name)}
                    className={`w-7 h-7 rounded-full ${colorItem.Class} flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
                      cor === colorItem.name
                        ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-sm'
                        : 'opacity-85 hover:scale-105'
                    }`}
                    title={colorItem.name}
                  >
                    {cor === colorItem.name && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              id="btn-registar-categoria"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-md cursor-pointer mt-2"
            >
              Registrar Categoria
            </button>
          </form>
        </div>

        {/* COL 2 & 3: CATEGORIES LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 pb-4 border-b border-gray-50">
            <h4 className="text-base font-bold text-gray-900">Categorias Cadastradas</h4>
            <p className="text-xs text-gray-400 mt-1">Veja a quantia de atas oficiais correlacionadas por classe</p>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-widest text-[9px] font-bold border-b border-gray-100">
                  <th className="py-4.5 px-6">Nome / Marcador</th>
                  <th className="py-4.5 px-6">Descrição de Alinhamento</th>
                  <th className="py-4.5 px-6">Data de Criação</th>
                  <th className="py-4.5 px-6">Atas Vinculadas</th>
                  <th className="py-4.5 px-6 text-right pr-8">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {categorias.map((cat) => {
                  const isEditing = editingId === cat.id;

                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Categoria nome + Color selector inline if editing */}
                      <td className="py-4-5 px-6 font-semibold text-gray-900">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              id="edit-inline-nome"
                              type="text"
                              value={editNome}
                              onChange={(e) => setEditNome(e.target.value)}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none"
                            />
                            {/* inline color choose */}
                            <div className="flex gap-1">
                              {availableColors.map(col => (
                                <button
                                  key={col.name}
                                  type="button"
                                  onClick={() => setEditCor(col.name)}
                                  className={`w-4 h-4 rounded-full ${col.Class} ${editCor === col.name ? 'ring-1 ring-black' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${getColorPoint(cat.cor)}`} />
                            <span>{cat.nome}</span>
                          </div>
                        )}
                      </td>

                      {/* Descricao */}
                      <td className="py-4-5 px-6 text-gray-500 max-w-[200px] break-words">
                        {isEditing ? (
                          <input
                            id="edit-inline-desc"
                            type="text"
                            value={editDescricao}
                            onChange={(e) => setEditDescricao(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                          />
                        ) : (
                          cat.descricao || <span className="text-gray-300 italic">Sem descrição informativa</span>
                        )}
                      </td>

                      {/* CriadoEm */}
                      <td className="py-4-5 px-6 text-gray-400 font-medium whitespace-nowrap">
                        {cat.criadoEm.split('-').reverse().join('/')}
                      </td>

                      {/* Atas count */}
                      <td className="py-4-5 px-6">
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-bold font-mono">
                          {getMinutesCount(cat.id)} Atas
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-4-5 px-6 pr-6 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={handleSaveEdit}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(cat)}
                              className="p-1 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/20"
                              title="Editar Categoria"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja realmente excluir a categoria "${cat.nome}"?`)) {
                                  deleteCategoria(cat.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50/20"
                              title="Excluir Categoria"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
