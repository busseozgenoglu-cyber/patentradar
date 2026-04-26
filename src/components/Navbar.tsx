import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Search, User as LucideUser, Shield, Gavel, HelpCircle, Info } from 'lucide-react';
import { authService } from '@/services/authService';
import type { User } from '@/types';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      if (authService.isAuthenticated()) {
        setUser(authService.getCurrentUser());
      } else {
        setUser(null);
      }
    };
    checkUser();
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMobileOpen(false);
    navigate('/');
  };

  const isLanding = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (isLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#' + id);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/92 backdrop-blur-xl border-b border-slate-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              className="text-blue-500 group-hover:scale-105 transition-transform"
            >
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <line x1="14" y1="2" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="14" r="2" fill="currentColor" />
            </svg>
            <span className="text-lg font-bold text-slate-900 tracking-tight">MarkaRadar</span>
          </Link>

          {/* Center nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Özellikler
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Nasıl Çalışır
            </button>
            <Link
              to="/pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Fiyatlandırma
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/savunma"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              İtiraz Savunma
            </Link>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <LucideUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/analyze"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Search className="w-4 h-4" />
                        Yeni Analiz
                      </Link>
                      <Link
                        to="/odeme"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Ödemelerim
                      </Link>
                      <Link
                        to="/yardim-merkezi"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Yardım
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/analyze"
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Analiz Başlat
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col gap-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-slate-900">Menü</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <button
              onClick={() => scrollToSection('features')}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Özellikler
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Nasıl Çalışır
            </button>
            <Link
              to="/pricing"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Fiyatlandırma
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/savunma"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Gavel className="w-4 h-4" />
              İtiraz Savunma
            </Link>
            <Link
              to="/hakkimizda"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              Hakkımızda
            </Link>
            <Link
              to="/yardim-merkezi"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Yardım Merkezi
            </Link>
            <Link
              to="/iletisim"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              İletişim
            </Link>
            
            <div className="border-t border-slate-100 my-3" />
            
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/analyze" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                  <Search className="w-4 h-4" />
                  Yeni Analiz
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                  Giriş Yap
                </Link>
                <Link
                  to="/analyze"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors mt-2"
                >
                  Analiz Başlat
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
