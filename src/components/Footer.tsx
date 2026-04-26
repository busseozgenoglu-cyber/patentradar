import { Link, useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="text-blue-500">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <line x1="14" y1="2" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="14" r="2" fill="currentColor" />
              </svg>
              <span className="text-lg font-bold text-white">MarkaRadar</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              AI destekli marka çakışma ve risk analizi platformu. Markanızı başvuru öncesi analiz edin.
            </p>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} MarkaRadar. Tüm hakları saklıdır.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ürün</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => scrollToSection('features')} className="text-sm hover:text-white transition-colors">
                  Özellikler
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-white transition-colors">
                  Nasıl Çalışır
                </button>
              </li>
              <li>
                <Link to="/pricing" className="text-sm hover:text-white transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link to="/savunma" className="text-sm hover:text-white transition-colors">
                  İtiraz Savunma
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Kaynaklar</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/blog" className="text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/yardim-merkezi" className="text-sm hover:text-white transition-colors">
                  Yardım Merkezi
                </Link>
              </li>
              <li>
                <Link to="/gizlilik" className="text-sm hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-kosullari" className="text-sm hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Şirket</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/hakkimizda" className="text-sm hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-sm hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <a href="mailto:info@markaradar.com" className="text-sm hover:text-white transition-colors">
                  info@markaradar.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6">
          <p className="text-xs text-slate-500 text-center">
            Bu sistem resmi marka araştırması veya hukuki danışmanlık sunmaz. Sonuçlar yalnızca ön değerlendirme amaçlıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
