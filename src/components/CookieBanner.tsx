import { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'markaradar_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900">Çerez ve Gizlilik Ayarları</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              MarkaRadar, size daha iyi bir deneyim sunmak için çerezler kullanır. Zorunlu çerezler site çalışması için gereklidir.
              Analitik ve pazarlama çerezleri ise tercihinize bağlıdır. Daha fazla bilgi için{' '}
              <a href="#/gizlilik" className="text-blue-600 hover:underline font-medium">Gizlilik Politikamızı</a> inceleyebilirsiniz.
            </p>

            {detailOpen && (
              <div className="mt-4 space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Zorunlu Çerezler</p>
                    <p className="text-xs text-slate-500">Site işlevselliği, güvenlik ve temel özellikler için gereklidir. Kapatılamaz.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Analitik Çerezler</p>
                    <p className="text-xs text-slate-500">Site kullanımını analiz ederek iyileştirmemize yardımcı olur.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Pazarlama Çerezleri</p>
                    <p className="text-xs text-slate-500">Size kişiselleştirilmiş içerik ve reklamlar sunmamızı sağlar.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-start min-w-fit">
            <button
              onClick={() => setDetailOpen(!detailOpen)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {detailOpen ? 'Detayları Gizle' : 'Detayları Gör'}
            </button>
            <button
              onClick={acceptEssential}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Sadece Zorunlu
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-sm"
            >
              Tümünü Kabul Et
            </button>
            <button
              onClick={acceptEssential}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
