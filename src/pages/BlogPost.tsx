import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ArrowRight, Search } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const postMeta: Record<string, { title: string; description: string }> = {
  'marka-tescil-nasil-yapilir': { title: 'Marka Tescili Nasıl Yapılır? Adım Adım Rehber 2026', description: 'Türkiye\'de marka tescil başvurusu nasıl yapılır? Gerekli evraklar, ücretler, süreç ve dikkat edilmesi gerekenler.' },
  'marka-tescil-ucreti-2026': { title: 'Marka Tescil Ücreti 2026 – Güncel Fiyatlar', description: '2026 yılı marka tescil ücretleri ne kadar? Türkpatent başvuru, yayın ve tescil ücretleri detaylı tablo.' },
  'turkpatent-sorgulama': { title: 'Türkpatent Sorgulama Nasıl Yapılır?', description: 'Türk Patent ve Marka Kurumu veri tabanında marka sorgulama adımları ve benzer marka kontrolü.' },
  'marka-cakismasi-nedir': { title: 'Marka Çakışması Nedir ve Nasıl Anlaşılır?', description: 'Marka çakışması kavramı, hukuki sonuçları, çakışma türleri ve risk analizi nasıl yapılır?' },
  'marka-itiraz-dilekcesi': { title: 'Marka İtiraz Dilekçesi Örneği ve Yazımı', description: 'Marka başvurusuna gelen itiraza karşı savunma dilekçesi nasıl yazılır? Örnek ve şablonlar.' },
  'marka-tescil-suresi': { title: 'Marka Tescil Süreci Kaç Gün Sürer?', description: 'Marka tescil başvurusundan sonuca kadar geçen süre, inceleme aşamaları ve beklenen tarihler.' },
  'marka-tescil-evraklari': { title: 'Marka Tescili İçin Gerekli Evraklar', description: 'Bireysel ve şirket başvuruları için gerekli belgeler, vekaletname ve dilekçe örnekleri.' },
  'nice-siniflari': { title: 'Nice Sınıfları Nedir? Nasıl Seçilir?', description: 'Nice sınıfları açıklaması, sektörlere göre seçim rehberi ve çoklu sınıf başvurusu.' },
  'marka-vekiligi': { title: 'Marka Vekilliği Nedir? Kimler Yapabilir?', description: 'Marka vekili olma şartları, sınavı, yetki alanı ve vekil ücretleri hakkında her şey.' },
  'marka-hakki-ihlali': { title: 'Marka Hakkı İhlali Nedir? Cezaları Nelerdir?', description: 'Marka ihlali tanımı, haksız rekabet, tazminat davaları ve hukuki süreç.' },
  'marka-benzerligi': { title: 'Marka Benzerliği Nasıl Belirlenir?', description: 'Görsel, işitsel ve kavramsal benzerlik kriterleri, tüketici karışıklığı testi.' },
  'marka-basvurusu-reddedilirse': { title: 'Marka Başvurusu Reddedilirse Ne Olur?', description: 'Red gerekçeleri, itiraz süreci, temyiz ve yeni başvuru stratejileri.' },
  'marka-yenileme-ucreti': { title: 'Marka Tescil Yenileme Ücreti ve Süresi', description: '10 yıllık koruma süresi sonrası yenileme ücretleri, süresi ve geç kalma durumu.' },
  'uluslararasi-marka-tescil': { title: 'Uluslararası Marka Tescil – Madrid Protokolü', description: 'Yurtdışında marka tescili, Madrid sistemi, WIPO başvurusu ve ülke seçimi.' },
  'marka-degeri': { title: 'Marka Değeri Nasıl Hesaplanır?', description: 'Marka değerleme yöntemleri, finansal analiz, bilançoya yansıtma ve lisanslama.' },
  'eticaret-marka-tescili': { title: 'E-Ticaret Sitesi İçin Marka Tescili Zorunlu mu?', description: 'Online satış yapanlar için marka tescili, domain-marka ilişkisi ve hukuki koruma.' },
  'logo-tescili': { title: 'Logo Tescili Nasıl Yapılır? Ayrı mı Gerekir?', description: 'Logo tescili ile marka tescili arasındaki fark, tasarım tescili ve birleştirilmiş başvuru.' },
  'marka-ismini-degistirmek': { title: 'Marka İsmini Değiştirmek Mümkün mü?', description: 'Tescilli marka adı değişikliği, yeni başvuru şartları ve süreç.' },
  'marka-tescili-olmadan-satis': { title: 'Marka Tescili Olmadan Satış Yapmak Riskli mi?', description: 'Tescilsiz marka kullanımının hukuki riskleri, ihlal durumunda yapılacaklar.' },
  'marka-arastirmasi': { title: 'Marka Araştırması Nasıl Yapılır? Profesyonel Rehber', description: 'Başvuru öncesi kapsamlı marka araştırması, ücretsiz ve ücretli araçlar, AI destekli analiz.' },
  'ai-destekli-marka-analizi': { title: 'AI Destekli Marka Analizi: Geleceğin Koruma Teknolojisi', description: 'Yapay zeka ile marka çakışma analizi nasıl yapılır? AI araçları, risk skorlama ve otomasyon.' },
  'startup-marka-tescili': { title: 'Startup Marka Tescili: Girişimciler İçin Rehber', description: 'Girişimciler için marka tescilinin önemi, erken aşama stratejileri ve bütçe dostu yöntemler.' },
  'marka-koruma-stratejileri': { title: 'Marka Koruma Stratejileri: Kapsamlı İşletme Rehberi', description: 'Tescil sonrası marka izleme, dijital koruma, ihlal mücadelesi ve hukuki stratejiler.' },
  'patent-ve-marka-farki': { title: 'Patent ve Marka Farkı Nedir?', description: 'Patent ve marka arasındaki hukuki ve kavramsal farklar, birlikte kullanım stratejileri.' },
  'endustriyel-tasarim-tescili': { title: 'Endüstriyel Tasarım Tescili Nasıl Yapılır?', description: 'Ürün görünümü koruma, başvuru süreci, maliyet ve marka ile birlikte kullanım.' },
  'marka-lisanslama-rehberi': { title: 'Marka Lisanslama Rehberi: Gelir Getiren Strateji', description: 'Marka lisanslama türleri, sözleşme şartları, royalty modelleri ve risk yönetimi.' },
  'sosyal-medya-marka-koruma': { title: 'Sosyal Medyada Marka Koruma: Etkili Stratejiler', description: 'Instagram, TikTok ve Facebookta marka ihlali tespiti, platform bildirimleri ve kriz yönetimi.' },
  'marka-davasi-sureci': { title: 'Marka Davası Süreci: Hukuki Rehber', description: 'Marka davası türleri, delil toplama, mahkeme süreci, maliyet ve alternatif çözümler.' },
  'eticaret-marka-ihlali': { title: 'E-Ticarette Marka İhlali: Korunma ve Çözüm Rehberi', description: 'Online platformlarda taklit ürün, izinsiz kullanım ve marka ihlali ile mücadele.' },
  'marka-stratejisi-olusturma': { title: 'Marka Stratejisi Oluşturma: Başarıya Götüren Rehber', description: 'Marka kimliği, hedef kitle, konumlandırma, görsel dil ve iletişim stratejisi.' },
};

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const meta = slug ? postMeta[slug] : null;

  useSEO({
    title: meta?.title ?? 'Blog',
    description: meta?.description ?? '',
    canonical: `https://patentradar.pro/#/blog/${slug}`,
    ogType: 'article',
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`/blog/${slug}.html`)
      .then(r => r.text())
      .then(setHtml)
      .finally(() => setLoading(false));
  }, [slug]);

  // Breadcrumb Schema.org
  useEffect(() => {
    if (!meta || !slug) return;
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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://patentradar.pro/#/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: meta.title,
          item: `https://patentradar.pro/#/blog/${slug}`,
        },
      ],
    };
    const bScript = document.createElement('script');
    bScript.type = 'application/ld+json';
    bScript.text = JSON.stringify(breadcrumbSchema);
    bScript.id = 'blogpost-breadcrumb-schema';
    document.head.appendChild(bScript);
    return () => { document.getElementById('blogpost-breadcrumb-schema')?.remove(); };
  }, [meta, slug]);

  // Article Schema.org
  useEffect(() => {
    if (!meta || !slug) return;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description,
      url: `https://patentradar.pro/#/blog/${slug}`,
      datePublished: '2026-04-25T08:00:00+03:00',
      dateModified: '2026-04-25T08:00:00+03:00',
      author: {
        '@type': 'Organization',
        name: 'MarkaRadar',
        url: 'https://patentradar.pro/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'MarkaRadar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://patentradar.pro/hero-illustration.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://patentradar.pro/#/blog/${slug}`,
      },
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    script.id = 'blogpost-article-schema';
    document.head.appendChild(script);
    return () => { document.getElementById('blogpost-article-schema')?.remove(); };
  }, [meta, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!html || !meta) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Yazı Bulunamadı</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">Bloga Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-slate-600 transition-colors">Ana Sayfa</Link></li>
              <li>/</li>
              <li><Link to="/blog" className="hover:text-slate-600 transition-colors">Blog</Link></li>
              <li>/</li>
              <li className="text-slate-600 max-w-[200px] truncate" title={meta.title}>{meta.title}</li>
            </ol>
          </nav>

          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Bloga Dön
          </Link>

          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <Calendar className="w-4 h-4" />
              25 Nisan 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">{meta.title}</h1>

            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-800 prose-li:text-slate-600"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* CTA */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Markanızı Hemen Analiz Edin</h3>
              <p className="text-slate-600 mb-4">Yapay zeka destekli marka çakışma analizi ile markanızın risk skorunu öğrenin. Benzer markaları tespit edin ve markanızı koruyun.</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                <Search className="w-4 h-4" />
                Ücretsiz Analiz Başlat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
