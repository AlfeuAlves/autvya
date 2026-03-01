import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
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
          <p className="text-neutral-500 mt-1">Comunicação que conecta</p>
        </div>

        {/* Form */}
        <div className="card shadow-lg">
          <h2 className="text-xl font-bold text-neutral-800 mb-6">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 text-center animate-fade-in">
                ⏳ O servidor pode levar até <strong>60 segundos</strong> para iniciar na primeira vez. Por favor, aguarde...
              </div>
            )}
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Não tem conta?{' '}
            <Link to="/registro" className="text-primary font-semibold hover:underline">
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
