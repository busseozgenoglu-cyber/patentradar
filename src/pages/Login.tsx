import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/services/authService';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      authService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      authService.demoLogin();
      navigate('/dashboard');
      setLoading(false);
    }, 600);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgot(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center pt-16 pb-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" className="text-blue-500">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <line x1="14" y1="2" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="14" r="2" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold text-slate-900">MarkaRadar</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {showForgot ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setShowForgot(false)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Girişe Dön
                </button>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Şifremi Unuttum</h1>
                <p className="text-sm text-slate-500 mb-6">
                  E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                </p>

                {forgotSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Şifre sıfırlama bağlantısı gönderildi!
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="ornek@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
                    >
                      Sıfırlama Bağlantısı Gönder
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Hoş Geldiniz</h1>
                <p className="text-sm text-slate-500 text-center mb-6">
                  Hesabınıza giriş yaparak analiz geçmişinize erişin.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                      Beni hatırla
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Şifremi unuttum
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Giriş Yap
                      </>
                    )}
                  </button>
                </form>

                {/* Separator */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">veya</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Demo Login */}
                <button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Demo olarak devam et
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-slate-500 mt-6">
                  Hesabınız yok mu?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Kayıt olun
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct Analysis Link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/analyze" className="text-blue-600 hover:text-blue-700 font-medium">
            Analize başlamak için tıklayın
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
