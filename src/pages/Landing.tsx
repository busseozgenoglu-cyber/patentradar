import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileDown, Check, BarChart3 } from 'lucide-react';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`scroll-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } })
};

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.04)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" className="space-y-6">
            <motion.p custom={0} variants={fadeUp} className="text-xs sm:text-sm font-semibold tracking-[0.15em] text-blue-600 uppercase">AI Destekli Marka Çakışma ve Risk Analizi</motion.p>
            <motion.h1 custom={1} variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">Markanızı başvuru öncesi risk analizine tabi tutun</motion.h1>
            <motion.p custom={2} variants={fadeUp} className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">MarkaRadar, marka adı ve konseptinizi analiz ederek benzer markaları bulur, çakışma riskini değerlendirir ve markanızı koruma yolları önerir.</motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/analyze" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5">
                Marka Analizi Başlat <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Nasıl çalışır?</button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }} className="mt-12 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Marka Açıklamanız</div>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 leading-relaxed italic min-h-[100px]">"Yeni bir kahve markası oluşturuyorum. 'Sıcak Gün Kahvecisi' ismini düşünüyorum. Cafe işletmeciliği yapacağım, aynı zamanda online kahve satışı ve mobil uygulama üzerinden sipariş alacağım..."</div>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">gıda</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">cafe</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">online satış</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="w-24 h-24 rounded-full border-[6px] border-amber-400 flex items-center justify-center mb-3">
                    <span className="text-2xl font-extrabold text-amber-500">68</span>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">ORTA RİSK</span>
                  <p className="text-xs text-slate-500 mt-3 text-center">3 benzer marka tespit edildi</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-slate-100 py-5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[{ icon: Check, text: 'Marka Başına 499 TL' }, { icon: Search, text: '26+ Gerçek Marka Verisi' }, { icon: FileDown, text: 'Detaylı PDF Rapor' }, { icon: BarChart3, text: 'Türkçe Risk Analizi' }].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600"><item.icon className="w-4 h-4 text-blue-500" />{item.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-lg mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Nasıl Çalışır?</h2>
            <p className="text-slate-600">Markanızı analiz etmek için 4 basit adım</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ num: '1', title: 'Markanızı Anlatın', desc: 'Marka adınızı, sektörünüzü ve faaliyet alanlarınızı yazın. Ne kadar detaylı olursa sonuç o kadar doğru olur.' }, { num: '2', title: 'AI Analiz Etsin', desc: 'Yapay zeka markanızı yapılandırır: sektör, faaliyet alanı, hedef kitle ve risk alanlarını çıkarır.' }, { num: '3', title: 'Çakışmaları Görün', desc: 'Veri tabanında benzer marka kayıtlarını bulur ve çakışma risk skoru oluşturur.' }, { num: '4', title: 'Raporunuzu Alın', desc: 'Detaylı risk analiz raporunu görüntüleyin, PDF olarak indirin ve markanızı koruma önerilerini değerlendirin.' }].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 150}>
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-4">{step.num}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Analysis */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-lg mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Örnek Analiz Sonucu</h2>
            <p className="text-slate-600">Bir marka analizinin çıktısı nasıl görünür?</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-[8px] border-amber-400 flex items-center justify-center mb-3">
                    <span className="text-3xl font-extrabold text-amber-500">72</span>
                  </div>
                  <span className="text-sm font-bold bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full">ORTA RİSK</span>
                  <p className="text-xs text-slate-500 mt-3 text-center max-w-[200px]">Çakışma skoru orta seviyede. Önerileri değerlendirin.</p>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Sıcak Gün Kahvecisi</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Gıda Markası', 'Cafe', 'Online Satış', 'Gıda ve İçecek'].map(tag => <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">{tag}</span>)}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">3 benzer marka tespit edildi. En yüksek çakışma: <span className="font-semibold text-slate-800"> Starbucks (%78)</span>. Gıda ve içecek sektöründe cafe hizmetleri benzerliği mevcuttur.</p>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Koruma Önerisi:</p>
                    <p className="text-xs text-slate-600">Niş bir pazara yönelerek (örneğin sadece online özel kahve satışı) çakışma riskini azaltabilirsiniz.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-lg mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Şeffaf Fiyatlandırma</h2>
            <p className="text-slate-600">Her marka analizi için tek bir fiyat</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">TEK FİYAT</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Marka Analizi</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-extrabold text-slate-900">499</span>
                <span className="text-slate-500">TL</span>
              </div>
              <p className="text-center text-sm text-slate-500 mb-6">Her marka sorgusu için</p>
              <ul className="space-y-3 mb-8">
                {['Detaylı çakışma analizi', '0-100 risk skoru', 'Benzer marka listesi', 'Özgünleşme önerileri', 'Profesyonel PDF rapor', 'Analiz geçmişi erişimi'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600"><Check className="w-4 h-4 text-blue-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/analyze" className="block w-full text-center py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20">Analiz Başlat — 499 TL</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal><LegalDisclaimer /></ScrollReveal>
        </div>
      </section>
    </div>
  );
}
