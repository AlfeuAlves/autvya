import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import UsageChart from '../components/UsageChart.jsx';
import ReportCard from '../components/ReportCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const PICTOGRAM_LABELS = {
  agua: '💧 Água', comer: '🍽️ Comer', brincar: '🎮 Brincar',
  mais: '➕ Mais', dormir: '😴 Dormir', nao: '🚫 Não',
};

const CATEGORIA_CONFIG = {
  comunicacao: { icon: '💬', label: 'Comunicação', color: 'primary' },
  rotina: { icon: '📅', label: 'Rotina', color: 'secondary' },
  sensorial: { icon: '🎨', label: 'Sensorial', color: 'feedback' },
  social: { icon: '🤝', label: 'Social', color: 'default' },
};

export default function Reports() {
  const { criancaId } = useParams();
  const navigate = useNavigate();

  const [filhos, setFilhos] = useState([]);
  const [selectedChild, setSelectedChild] = useState(criancaId || null);
  const [relatorio, setRelatorio] = useState(null);
  const [analiseIA, setAnaliseIA] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [errorIA, setErrorIA] = useState('');
  const [activeTab, setActiveTab] = useState('pais'); // 'pais' | 'tecnico'

  useEffect(() => {
    loadFilhos();
  }, []);

  useEffect(() => {
    if (selectedChild) loadRelatorio(selectedChild);
  }, [selectedChild]);

  async function loadFilhos() {
    try {
      const { data } = await api.get('/children');
      setFilhos(data.filhos);
      if (!selectedChild && data.filhos.length > 0) {
        setSelectedChild(data.filhos[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadRelatorio(id) {
    setLoading(true);
    setAnaliseIA(null);
    setErrorIA('');
    try {
      const { data } = await api.get(`/reports/${id}?dias=30`);
      setRelatorio(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function gerarAnaliseIA() {
    setLoadingIA(true);
    setErrorIA('');
    try {
      const { data } = await api.post('/ai/analise', {
        criancaId: selectedChild,
        dias: 30,
      }, { timeout: 90000 }); // 90s — aguarda Render acordar + chamada Claude
      setAnaliseIA(data.analise);
    } catch (err) {
      setErrorIA(err.response?.data?.error || 'Erro ao gerar análise. Tente novamente.');
    } finally {
      setLoadingIA(false);
    }
  }

  const criancaSelecionada = filhos.find((f) => f.id === selectedChild);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-neutral-800">Relatórios</h1>

      {/* Seletor de criança */}
      {filhos.length > 1 && (
        <select
          value={selectedChild || ''}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="input-field"
        >
          {filhos.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>
      )}

      {filhos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral-500">Nenhum perfil cadastrado.</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : relatorio ? (
        <>
          {/* Header do relatório */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {relatorio.crianca.nome[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-800">{relatorio.crianca.nome}</h2>
                <p className="text-sm text-neutral-500">
                  {relatorio.crianca.idade} anos · Fase {relatorio.crianca.fase.toLowerCase()}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Relatório dos últimos 30 dias
                </p>
              </div>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '👆', label: 'Interações', value: relatorio.metricas.totalInteracoes },
              { icon: '📅', label: 'Dias ativos', value: relatorio.metricas.diasAtivos },
              { icon: '⏱️', label: 'Sessão média', value: relatorio.metricas.duracaoMedia > 0 ? `${Math.round(relatorio.metricas.duracaoMedia / 60)}min` : 'N/A' },
              { icon: '⭐', label: 'Favorito', value: PICTOGRAM_LABELS[relatorio.metricas.botaoFavorito] || 'N/A' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="card p-4">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-lg font-bold text-neutral-800">{value}</p>
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Uso por botão */}
          {Object.keys(relatorio.metricas.contagemBotoes).length > 0 && (
            <div className="card space-y-3">
              <h3 className="font-semibold text-neutral-700">Uso por pictograma</h3>
              {Object.entries(relatorio.metricas.contagemBotoes)
                .sort((a, b) => b[1] - a[1])
                .map(([botao, count]) => (
                  <ProgressBar
                    key={botao}
                    label={PICTOGRAM_LABELS[botao] || botao}
                    value={count}
                    max={Math.max(...Object.values(relatorio.metricas.contagemBotoes))}
                    color="primary"
                  />
                ))}
            </div>
          )}

          {/* Gráfico de uso diário */}
          <div className="card">
            <h3 className="font-semibold text-neutral-700 mb-4">Uso diário</h3>
            <UsageChart data={relatorio.usoDiario} type="daily" />
          </div>

          {/* Gráfico por hora */}
          <div className="card">
            <h3 className="font-semibold text-neutral-700 mb-4">Horários de uso</h3>
            <UsageChart data={relatorio.metricas.usoPorHora} type="hourly" />
          </div>

          {/* Análise IA */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-neutral-700">Análise com Inteligência Artificial</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Gerada por IA · Não substitui avaliação profissional
                </p>
              </div>
              {!analiseIA && (
                <button
                  onClick={gerarAnaliseIA}
                  disabled={loadingIA}
                  className="btn-primary py-2 px-4 text-sm flex-shrink-0"
                >
                  {loadingIA ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando...
                    </span>
                  ) : '✨ Gerar análise'}
                </button>
              )}
            </div>

            {errorIA && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 mb-4">
                {errorIA}
              </div>
            )}

            {analiseIA && (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 bg-neutral-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('pais')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'pais' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500'
                    }`}
                  >
                    Para Pais
                  </button>
                  <button
                    onClick={() => setActiveTab('tecnico')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'tecnico' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500'
                    }`}
                  >
                    Técnico
                  </button>
                </div>

                {activeTab === 'pais' ? (
                  <div className="space-y-4">
                    {/* Resumo */}
                    <ReportCard icon="💬" title="Resumo" variant="primary">
                      <p className="text-sm text-neutral-700 leading-relaxed">{analiseIA.resumo}</p>
                    </ReportCard>

                    {/* Habilidades */}
                    {analiseIA.habilidades?.length > 0 && (
                      <ReportCard icon="⭐" title="Pontos fortes observados" variant="secondary">
                        <ul className="space-y-2">
                          {analiseIA.habilidades.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </ReportCard>
                    )}

                    {/* Recomendações */}
                    {analiseIA.recomendacoes?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-neutral-700 text-sm">Sugestões práticas</h4>
                        {analiseIA.recomendacoes.map((rec, i) => {
                          const cat = CATEGORIA_CONFIG[rec.categoria] || CATEGORIA_CONFIG.comunicacao;
                          return (
                            <ReportCard key={i} icon={cat.icon} title={rec.titulo} variant={cat.color === 'primary' ? 'primary' : cat.color === 'secondary' ? 'secondary' : 'feedback'}>
                              <p className="text-sm text-neutral-600">{rec.descricao}</p>
                            </ReportCard>
                          );
                        })}
                      </div>
                    )}

                    {/* Aviso */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <p className="text-xs text-yellow-700">
                        ⚠️ {analiseIA.aviso}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analiseIA.nivel_estimado && (
                      <ReportCard icon="📊" title="Nível estimado">
                        <p className="text-sm text-neutral-700">{analiseIA.nivel_estimado}</p>
                      </ReportCard>
                    )}

                    {analiseIA.pontos_atencao?.length > 0 && (
                      <ReportCard icon="🔍" title="Pontos de atenção" variant="warning">
                        <ul className="space-y-2">
                          {analiseIA.pontos_atencao.map((p, i) => (
                            <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                              <span className="text-orange-400 flex-shrink-0">•</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </ReportCard>
                    )}

                    {analiseIA.relatorio_tecnico && (
                      <>
                        <ReportCard icon="🧠" title="Padrão de comunicação">
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {analiseIA.relatorio_tecnico.padrao_comunicacao}
                          </p>
                        </ReportCard>

                        {analiseIA.relatorio_tecnico.referencias_teoricas && (
                          <ReportCard icon="📚" title="Referências teóricas">
                            <p className="text-sm text-neutral-700 leading-relaxed">
                              {analiseIA.relatorio_tecnico.referencias_teoricas}
                            </p>
                          </ReportCard>
                        )}

                        {analiseIA.relatorio_tecnico.indicadores_comportamentais && (
                          <ReportCard icon="📋" title="Indicadores comportamentais">
                            <p className="text-sm text-neutral-700 leading-relaxed">
                              {analiseIA.relatorio_tecnico.indicadores_comportamentais}
                            </p>
                          </ReportCard>
                        )}
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => { setAnaliseIA(null); gerarAnaliseIA(); }}
                  className="text-sm text-primary hover:underline"
                >
                  🔄 Regenerar análise
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
