import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fotoKey = `autvya_foto_${user?.id}`;
  const [fotoUrl, setFotoUrl] = useState(() => localStorage.getItem(fotoKey) || null);
  const [fotoErro, setFotoErro] = useState(null);
  const inputFotoRef = useRef(null);

  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFotoErro(null);
    if (file.size > 2 * 1024 * 1024) {
      setFotoErro('Imagem muito grande. Use menos de 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      localStorage.setItem(fotoKey, base64);
      setFotoUrl(base64);
    };
    reader.readAsDataURL(file);
  }

  function removerFoto() {
    localStorage.removeItem(fotoKey);
    setFotoUrl(null);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-800">Configurações</h1>

      {/* Perfil do usuário */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar / foto */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Foto de perfil"
                style={{ width: 64, height: 64, borderRadius: 18, objectFit: 'cover', border: '3px solid #E0EEF8' }}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {user?.nome?.[0]?.toUpperCase()}
              </div>
            )}
            {/* Botão câmera */}
            <button
              onClick={() => inputFotoRef.current?.click()}
              style={{ position: 'absolute', bottom: -6, right: -6, width: 26, height: 26, background: '#4A90D9', border: '2px solid white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}
              title="Alterar foto"
            >
              📷
            </button>
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <p className="font-bold text-neutral-800">{user?.nome}</p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                onClick={() => inputFotoRef.current?.click()}
                style={{ fontSize: 12, fontWeight: 700, color: '#4A90D9', background: '#EBF4FF', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
              >
                {fotoUrl ? 'Trocar foto' : '+ Adicionar foto'}
              </button>
              {fotoUrl && (
                <button
                  onClick={removerFoto}
                  style={{ fontSize: 12, fontWeight: 700, color: '#E53E3E', background: '#FFF0F0', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
                >
                  Remover
                </button>
              )}
            </div>
            {fotoErro && <p style={{ fontSize: 11, color: '#E53E3E', marginTop: 4 }}>{fotoErro}</p>}
          </div>
        </div>
        <div className="bg-neutral-50 rounded-xl p-3 text-xs text-neutral-500">
          Conta criada com segurança · Dados protegidos pela LGPD
        </div>
      </div>

      {/* Sobre o app */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-neutral-700">Sobre o AUTVYA</h2>

        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            <strong>AUTVYA</strong> é uma plataforma de Comunicação Aumentativa e Alternativa (CAA)
            desenvolvida especialmente para crianças neurodiversas de 4 a 10 anos.
          </p>
          <p>
            Nosso objetivo é facilitar a expressão e comunicação de crianças com autismo, TDAH
            e outros perfis neuroatípicos, através de pictogramas e síntese de voz.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { icon: '🌈', label: '3 fases de comunicação' },
            { icon: '🔊', label: 'Síntese de voz PT-BR' },
            { icon: '📊', label: 'Relatórios com IA' },
            { icon: '📱', label: 'Funciona offline (PWA)' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-neutral-600">
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Botão Sobre a Metodologia */}
        <Link
          to="/sobre"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, marginTop: 8,
            background: 'linear-gradient(135deg, #EBF5FF, #F0FDF4)',
            border: '1.5px solid #BFDBFE', borderRadius: 16, padding: '14px 16px',
            textDecoration: 'none',
          }}
        >
          <div style={{ width: 42, height: 42, background: '#4A90D9', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            🧠
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1A3A6B' }}>Metodologia AUTVYA</div>
            <div style={{ fontSize: 12, color: '#5A8AB0', marginTop: 2 }}>
              Entenda as 3 fases, PECS, CAA e embasamento científico
            </div>
          </div>
          <span style={{ fontSize: 18, color: '#4A90D9' }}>›</span>
        </Link>
      </div>

      {/* LGPD */}
      <div className="card space-y-2">
        <h2 className="font-semibold text-neutral-700">Privacidade e LGPD</h2>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            Os dados coletados são usados exclusivamente para análise do desenvolvimento da criança
            e geração de relatórios para pais e educadores.
          </p>
          <p>
            Não compartilhamos dados com terceiros sem consentimento explícito.
            Todos os dados são armazenados com criptografia.
          </p>
          <p>
            Você pode solicitar a exclusão de todos os seus dados a qualquer momento
            através do suporte.
          </p>
        </div>
      </div>

      {/* Versão */}
      <div className="card">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">Versão</span>
          <span className="font-medium text-neutral-700">1.0.0</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-neutral-500">Modelo IA</span>
          <span className="font-medium text-neutral-700">Claude Sonnet</span>
        </div>
      </div>

      {/* Logout */}
      {!showLogoutConfirm ? (
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3 text-red-500 font-semibold border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          Sair da conta
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <p className="text-sm text-red-700 font-medium">Deseja realmente sair?</p>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="btn-danger flex-1 py-2 text-sm">
              Sim, sair
            </button>
            <button onClick={() => setShowLogoutConfirm(false)} className="btn-secondary flex-1 py-2 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
