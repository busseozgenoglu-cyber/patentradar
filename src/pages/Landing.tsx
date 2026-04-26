import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileDown, Check, BarChart3, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { useSEO } from '@/hooks/useSEO';

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
  useSEO('Marka Patent Tescil ve Çakışma Analizi', 'Marka patent tescili öncesi AI destekli çakışma analizi. Benzer markaları tespit edin, risk skorunuzu öğrenin ve markanızı güvence altına alın.');

  // FAQPage Schema.org
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: landingFaqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'landing-faq-schema';
    document.head.appendChild(script);
    return () => { document.getElementById('landing-faq-schema')?.remove(); };
  }, []);

  // HowTo Schema.org
  useEffect(() => {
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Marka Analizi Nasıl Yapılır?',
      description: 'Markanızı MarkaRadar ile analiz etmek için 4 basit adım.',
      totalTime: 'PT15S',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'TRY',
        value: '299',
      },
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Markanızı Anlatın',
          text: 'Marka adınızı, sektörünüzü ve faaliyet alanlarınızı yazın. Ne kadar detaylı olursa sonuç o kadar doğru olur.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'AI Analiz Etsin',
          text: 'Yapay zeka markanızı yapılandırır: sektör, faaliyet alanı, hedef kitle ve risk alanlarını çıkarır.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Çakışmaları Görün',
          text: 'Veri tabanında benzer marka kayıtlarını bulur ve çakışma risk skoru oluşturur.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Raporunuzu Alın',
          text: 'Detaylı risk analiz raporunu görüntüleyin, PDF olarak indirin ve markanızı koruma önerilerini değerlendirin.',
        },
      ],
    };
    const hScript = document.createElement('script');
    hScript.type = 'application/ld+json';
    hScript.text = JSON.stringify(howToSchema);
    hScript.id = 'landing-howto-schema';
    document.head.appendChild(hScript);
    return () => { document.getElementById('landing-howto-schema')?.remove(); };
  }, []);

  // Breadcrumb Schema.org
  useEffect(() => {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: 'https://patentradar.pro/',
        },
      ],
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    script.id = 'landing-breadcrumb-schema';
    document.head.appendChild(script);
    return () => { document.getElementById('landing-breadcrumb-schema')?.remove(); };
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.04)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" className="space-y-6">
            <motion.p custom={0} variants={fadeUp} className="text-xs sm:text-sm font-semibold tracking-[0.15em] text-blue-600 uppercase">Marka Patent Tescil Öncesi AI Analizi</motion.p>
            <motion.h1 custom={1} variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">Marka patent tescili öncesi AI destekli risk analizi yapın</motion.h1>
            <motion.p custom={2} variants={fadeUp} className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">MarkaRadar ile marka patent başvurunuz öncesi benzer markaları tespit edin, çakışma riskini değerlendirin ve markanızı hukuki güvence altına alın.</motion.p>
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
            {[{ icon: Check, text: 'Marka Başına 299 TL' }, { icon: Search, text: '26+ Gerçek Marka Verisi' }, { icon: FileDown, text: 'Detaylı PDF Rapor' }, { icon: BarChart3, text: 'Türkçe Risk Analizi' }].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600"><item.icon className="w-4 h-4 text-blue-500" />{item.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-lg mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Özellikler</h2>
            <p className="text-slate-600">MarkaRadar'ın size sunduğu güçlü araçlar</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Çakışma Analizi', desc: 'Yapay zeka markanızı binlerce kayıtlı marka ile karşılaştırır, çakışma riskini puanlar.' },
              { title: 'Gerçek Zamanlı Araştırma', desc: "Web'de gerçek zamanlı arama yaparak Türkiye'deki aktif markaları ve işletmeleri bulur." },
              { title: 'Risk Skoru (0-100)', desc: 'Anlaşılır bir 0-100 risk skoru ile markanızın çakışma potansiyelini görün.' },
              { title: 'PDF Rapor', desc: 'Profesyonel tasarımlı, hukuki uyarıları içeren detaylı PDF raporunu indirin.' },
              { title: 'Özgünleşme Önerileri', desc: 'Riski azaltmak için marka ismi, sektör ve hedef kitle önerileri alın.' },
              { title: 'İtiraz Savunma Dosyası', desc: 'Markanıza gelen itirazlara karşı hukuki temelli savunma dosyası hazırlayın.' },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
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
          </ScrollReveal>
        </div>
      </section>

      {/* SSS / FAQ */}
      <section className="bg-slate-50 py-20 lg:py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-600">Marka tescili, analiz süreci ve ücretler hakkında merak edilenler</p>
          </ScrollReveal>
          <LandingFAQ />
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white py-20 lg:py-24 border-t border-slate-100;">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Marka Patent Tescil Öncesi Neden Araştırma Yapmalısınız?</h2>
            <p className="text-slate-600">Marka patent başvurusu öncesi çakışma analizi, markanızın geleceğini korur ve hukuki riskleri minimize eder.</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p><strong className="text-slate-800">Marka patent</strong> tescili, bir işletmenin en değerli varlıklarından birini koruma altına almanın en etkili yoludur. Türkiye'de marka sahibi olmak isteyen her girişimci için <strong>marka patent</strong> başvurusu öncesi çakışma analizi zorunlu bir adımdır. <strong className="text-slate-800">Türkpatent</strong> üzerinden yapılan resmi sorgulamaların yanı sıra, web'de aktif olan benzer isimde işletmeleri tespit etmek de büyük önem taşır. MarkaRadar, yapay zeka destekli algoritmaları ile hem tescilli hem de tescilsiz markaları analiz ederek size kapsamlı bir risk raporu sunar.</p>
              <p><strong className="text-slate-800">Patent marka</strong> farkını bilmek de başvuru sürecinde kritik öneme sahiptir. Marka, bir ürün veya hizmeti diğerlerinden ayıran işaret iken; patent, teknik bir buluşu korur. <strong>Marka patent</strong> birlikteliği, ürününüzün hem ticari kimliğini hem de teknik yeniliğini aynı anda korumanızı sağlar. Nice sınıfı seçimi, markanızın hangi alanlarda korunacağını belirler. Gıda, kozmetik, tekstil veya teknoloji sektöründe faaliyet gösteriyorsanız, doğru Nice sınıfını seçmek ve bu sınıftaki benzer markaları incelemek, başvuru sürecinizin başarı şansını doğrudan etkiler.</p>
              <p>MarkaRadar analizi sonrasında elde edeceğiniz <strong className="text-slate-800">risk skoru</strong>, markanızın çakışma potansiyelini sayısal olarak ifade eder ve karar verme sürecinizi kolaylaştırır. İtiraz savunma hizmetimiz ile markanıza yapılan haksız itirazlara karşı hukuki temelli, profesyonel savunma dosyaları hazırlayabilirsiniz. <Link to="/analyze" className="text-blue-600 hover:underline font-medium">Hemen marka patent analizi başlatın</Link> ve markanızı koruma altına alın.</p>
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

const landingFaqs = [
  {
    q: 'MarkaRadar nedir ve nasıl çalışır?',
    a: 'MarkaRadar, yapay zeka destekli bir marka çakışma ve risk analizi platformudur. Marka adınızı ve faaliyet alanınızı girersiniz, sistem benzer markaları tarar, risk skoru üretir ve detaylı PDF rapor sunar. Analiz süreci genellikle 15-30 saniye sürer.'
  },
  {
    q: 'Marka analizi ücreti ne kadar?',
    a: 'Her marka analizi tek fiyat üzerinden 299 TL olarak sunulmaktadır. Bu ücret kapsamında detaylı çakışma analizi, 0-100 arası risk skoru, benzer marka listesi, özgünleşme önerileri ve profesyonel PDF rapor elde edersiniz.'
  },
  {
    q: 'MarkaRadar resmi bir marka araştırması mıdır?',
    a: 'Hayır, MarkaRadar yalnızca ön değerlendirme amaçlı bir araçtır. Kesin hukuki görüş veya resmi marka araştırması yerine geçmez. Resmi başvuru öncesinde Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden mutlaka sorgulama yapmanızı öneririz.'
  },
  {
    q: 'Marka tescil süreci ne kadar sürer?',
    a: 'Türkiyede marka tescil süreci, itirazsız bir başvuru için ortalama 8-12 ay sürer. İtirazlı süreçler 2-3 yıla kadar uzayabilir. MarkaRadar ile başvuru öncesi çakışma analizi yaparak ret ve itiraz riskini önemli ölçüde azaltabilirsiniz.'
  },
  {
    q: 'Nice sınıfı nedir ve nasıl seçilir?',
    a: 'Nice sınıfları, markaların hangi mal ve hizmet kategorilerinde korunacağını belirleyen uluslararası bir sınıflandırma sistemidir. Toplam 45 sınıf bulunur. Faaliyet alanınıza en uygun sınıfları seçmek için MarkaRadar blogundaki Nice Sınıfları rehberimize göz atabilirsiniz.'
  },
  {
    q: 'Marka tescili olmadan satış yapmak riskli mi?',
    a: 'Evet, oldukça risklidir. Tescilsiz marka kullanımı, başkalarının önceden tescil ettiği markalarla çakışma riski taşır. Bu durum haksız rekabet, marka ihlali ve tazminat davalarına yol açabilir. Ayrıca markanızı başkaları tescil edebilir ve sizin kullanımınızı engelleyebilir.'
  },
  {
    q: 'Ödeme güvenli mi?',
    a: 'Evet, tüm ödemeler PayTRnin PCI DSS uyumlu, 256-bit SSL şifrelemeli ve 3D Secure destekli güvenli ödeme altyapısı üzerinden işlenir. Kart bilgileriniz hiçbir şekilde MarkaRadar sunucularında saklanmaz.'
  },
  {
    q: 'Analiz geçmişime nasıl ulaşabilirim?',
    a: 'Giriş yaptıktan sonra Dashboard sayfasından tüm analiz geçmişinizi görüntüleyebilir, detaylarına bakabilir ve PDF raporlarını tekrar indirebilirsiniz. Ücretsiz hesap oluşturarak bu özelliği kullanmaya başlayabilirsiniz.'
  },
  {
    q: 'Marka itiraz savunma dosyası nedir?',
    a: 'Markanıza yapılan haksız itirazlara karşı hukuki temelli savunma dosyası hazırlayan bir hizmettir. AI destekli detaylı analiz ve argümanlar içerir. Ancak bu dosya yapay zeka tarafından oluşturulmuş ön bir taslaktır; bir hukuk uzmanına danışmadan doğrudan kullanmayınız.'
  },
  {
    q: 'Uluslararası marka tescili yapabilir miyim?',
    a: 'Evet, Madrid Protokolü kapsamında tek bir başvuruyla birden fazla ülkede marka koruması elde edebilirsiniz. Türkiyedeki tescilli markanız temel alınarak WIPO üzerinden uluslararası başvuru yapılır. Detaylar için blogumuzdaki uluslararası marka tescil rehberine göz atabilirsiniz.'
  },
];

function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {landingFaqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
            {openIndex === i ? (
              <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
