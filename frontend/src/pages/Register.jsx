import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '',
    consentimento: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.senha !== form.confirmaSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (form.senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (!form.consentimento) {
      setError('Você precisa aceitar os termos para continuar.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        consentimento: form.consentimento,
      });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
            🌈
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">AUTVYA</h1>
          <p className="text-neutral-500 mt-1">Crie sua conta gratuita</p>
        </div>

        <div className="card shadow-lg">
          <h2 className="text-xl font-bold text-neutral-800 mb-6">Criar conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="label">Seu nome</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="input-field"
                placeholder="Maria Silva"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="label">Senha</label>
              <input
                id="senha"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                className="input-field"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmaSenha" className="label">Confirmar senha</label>
              <input
                id="confirmaSenha"
                type="password"
                name="confirmaSenha"
                value={form.confirmaSenha}
                onChange={handleChange}
                className="input-field"
                placeholder="Repita a senha"
                autoComplete="new-password"
                required
              />
            </div>

            {/* Consentimento LGPD */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consentimento"
                checked={form.consentimento}
                onChange={handleChange}
                className="mt-0.5 w-5 h-5 rounded accent-primary flex-shrink-0"
              />
              <span className="text-sm text-neutral-600">
                Concordo com o uso dos dados da minha família para fins de análise de desenvolvimento infantil,
                conforme a <strong>LGPD</strong>. Os dados são armazenados com segurança e não são compartilhados
                com terceiros sem consentimento.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
