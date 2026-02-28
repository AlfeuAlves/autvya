import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';

const FASES = [
  {
    id: 'CONEXAO',
    label: 'Fase 1 – Conexão',
    desc: 'Aprendendo a usar pictogramas básicos. Ideal para iniciantes.',
    icon: '🌱',
    color: 'border-blue-200 bg-blue-50',
    activeColor: 'border-primary bg-primary-50',
  },
  {
    id: 'ESCOLHA',
    label: 'Fase 2 – Escolha',
    desc: 'Selecionando entre opções contextuais.',
    icon: '⭐',
    color: 'border-yellow-200 bg-yellow-50',
    activeColor: 'border-yellow-400 bg-yellow-50',
  },
  {
    id: 'COMUNICACAO',
    label: 'Fase 3 – Comunicação',
    desc: 'Combinando pictogramas para formar frases.',
    icon: '🚀',
    color: 'border-green-200 bg-green-50',
    activeColor: 'border-green-400 bg-green-50',
  },
];

const CONFIG_DEFAULTS = {
  volumeVoz: 1.0,
  velocidadeVoz: 0.85,
  tamanhoTexto: 'normal',
  corFundo: '#F0F4FF',
  vibrarNoToque: true,
};

export default function ChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    nome: '',
    idade: '',
    fase: 'CONEXAO',
    configuracoes: CONFIG_DEFAULTS,
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isEditing) loadCrianca();
  }, [id]);

  async function loadCrianca() {
    try {
      const { data } = await api.get(`/children/${id}`);
      const c = data.crianca;
      setForm({
        nome: c.nome,
        idade: String(c.idade),
        fase: c.fase,
        configuracoes: { ...CONFIG_DEFAULTS, ...(c.configuracoes || {}) },
      });
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleConfigChange(key, value) {
    setForm((f) => ({
      ...f,
      configuracoes: { ...f.configuracoes, [key]: value },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const idade = parseInt(form.idade);
    if (!form.nome.trim()) { setError('Nome é obrigatório.'); return; }
    if (!idade || idade < 1 || idade > 18) { setError('Idade inválida.'); return; }

    setSaving(true);
    try {
      const payload = { nome: form.nome.trim(), idade, fase: form.fase, configuracoes: form.configuracoes };
      if (isEditing) {
        await api.put(`/children/${id}`, payload);
      } else {
        await api.post('/children', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/children/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir.');
      setShowDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-xl border border-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-50">
          ←
        </button>
        <h1 className="text-2xl font-bold text-neutral-800">
          {isEditing ? 'Editar perfil' : 'Novo perfil'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-neutral-700">Informações básicas</h2>

          <div>
            <label className="label">Nome da criança</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="input-field"
              placeholder="Nome"
              required
            />
          </div>

          <div>
            <label className="label">Idade</label>
            <input
              type="number"
              name="idade"
              value={form.idade}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: 6"
              min="1"
              max="18"
              required
            />
          </div>
        </div>

        {/* Seleção de fase */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-neutral-700">Fase de comunicação</h2>
          <p className="text-xs text-neutral-500">Selecione o nível adequado para a criança</p>
          {FASES.map((fase) => (
            <button
              key={fase.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, fase: fase.id }))}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                form.fase === fase.id ? fase.activeColor + ' border-opacity-100' : 'border-neutral-100 bg-white hover:border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{fase.icon}</span>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">{fase.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{fase.desc}</p>
                </div>
                {form.fase === fase.id && (
                  <span className="ml-auto text-primary text-lg">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Configurações sensoriais */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-neutral-700">Configurações sensoriais</h2>

          <div>
            <label className="label">Volume da voz: {Math.round(form.configuracoes.volumeVoz * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={form.configuracoes.volumeVoz}
              onChange={(e) => handleConfigChange('volumeVoz', parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="label">Velocidade da voz</label>
            <select
              value={form.configuracoes.velocidadeVoz}
              onChange={(e) => handleConfigChange('velocidadeVoz', parseFloat(e.target.value))}
              className="input-field"
            >
              <option value={0.6}>Muito devagar</option>
              <option value={0.75}>Devagar</option>
              <option value={0.85}>Normal</option>
              <option value={1.0}>Rápido</option>
            </select>
          </div>

          <div>
            <label className="label">Cor de fundo da interface</label>
            <div className="flex gap-3 flex-wrap">
              {['#F0F4FF', '#F0FDF4', '#FFFBEB', '#FFF1F2', '#F5F3FF'].map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => handleConfigChange('corFundo', cor)}
                  style={{ backgroundColor: cor }}
                  className={`w-10 h-10 rounded-xl border-3 transition-all ${
                    form.configuracoes.corFundo === cor
                      ? 'border-primary border-4 scale-110'
                      : 'border-neutral-200 border-2'
                  }`}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.configuracoes.vibrarNoToque}
              onChange={(e) => handleConfigChange('vibrarNoToque', e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-sm text-neutral-700 font-medium">Vibrar ao tocar (se disponível)</span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </span>
          ) : isEditing ? 'Salvar alterações' : 'Criar perfil'}
        </button>

        {isEditing && (
          <>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 text-sm text-red-500 hover:text-red-700 hover:underline"
              >
                Excluir este perfil
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                <p className="text-sm text-red-700 font-medium">
                  Tem certeza? Todos os dados de interação serão perdidos permanentemente.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={handleDelete} className="btn-danger flex-1 py-2 text-sm">
                    Sim, excluir
                  </button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1 py-2 text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
