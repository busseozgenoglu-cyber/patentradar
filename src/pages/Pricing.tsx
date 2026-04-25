import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { useSEO } from '@/hooks/useSEO';
const faqs = [
  {
    q: 'MarkaRadar resmi bir marka araştırması mıdır?',
    a: 'Hayır. MarkaRadar yalnızca ön değerlendirme amaçlı bir araçtır. Kesin hukuki görüş veya resmi marka araştırması yerine geçmez. Resmi başvuru öncesinde Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden mutlaka sorgulama yapınız.',
  },
  {
    q: 'Analiz sonuçları ne kadar güvenilir?',
    a: 'Sonuçlar yapay zeka ve benzerlik algoritmaları ile üretilir. Ancak bu sonuçlar ön değerlendirme niteliğindedir. Kesin karar için bir marka vekiline veya hukuk uzmanına danışmanızı öneririz.',
  },
  {
    q: 'PDF raporu nasıl alabilirim?',
    a: 'Her marka analizi (299 TL) kapsamında profesyonel PDF raporu otomatik olarak oluşturulur ve indirilebilir.',
  },
  {
    q: 'Kaç marka analizi yapabilirim?',
    a: "Herhangi bir sınırlama yoktur. Her marka için ayrı analiz satın alabilirsiniz. Her analiz 299 TL'dir."
  },
];

export function Pricing() {
  useSEO('Fiyatlandırma', 'MarkaRadar fiyatlandırma planları. Marka analizi ve itiraz savunma hizmetleri.');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
    script.id = 'faq-schema';
    document.head.appendChild(script);
    return () => { const el = document.getElementById('faq-schema'); if (el) document.head.removeChild(el); };
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Şeffaf Fiyatlandırma</h1>
          <p className="text-slate-600">Her marka analizi için tek bir fiyat, gizli maliyet yok</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-sm mx-auto mb-16">
          <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
              <Search className="w-3 h-3" />TEK FİYAT
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Marka Analizi</h3>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-extrabold text-slate-900">299</span>
              <span className="text-slate-500">TL</span>
            </div>
            <p className="text-center text-sm text-slate-500 mb-6">Her marka sorgusu için</p>
            <ul className="space-y-3 mb-8">
              {['Detaylı çakışma analizi', '0-100 risk skoru', 'Benzer marka listesi', 'Özgünleşme önerileri', 'Profesyonel PDF rapor', 'Analiz geçmişi erişimi'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600"><Check className="w-4 h-4 text-blue-500 flex-shrink-0" />{f}</li>
              ))}
            </ul>
            <Link to="/analyze" className="block w-full text-center py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20">Analiz Başlat — 299 TL</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }} className="border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4"><p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p></div>}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto">
          <LegalDisclaimer />
        </motion.div>
      </div>
    </div>
  );
}
