import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const posts = [
  { slug: 'marka-tescil-nasil-yapilir', title: 'Marka Tescili Nasıl Yapılır? Adım Adım Rehber 2026', excerpt: 'Türkiye\'de marka tescil başvurusu nasıl yapılır? Gerekli evraklar, ücretler, süreç ve dikkat edilmesi gerekenler detaylı anlatım.', date: '2026-04-25' },
  { slug: 'marka-tescil-ucreti-2026', title: 'Marka Tescil Ücreti 2026 – Güncel Fiyatlar', excerpt: '2026 yılı marka tescil ücretleri ne kadar? Türkpatent başvuru, yayın ve tescil ücretleri detaylı tablo.', date: '2026-04-25' },
  { slug: 'turkpatent-sorgulama', title: 'Türkpatent Sorgulama Nasıl Yapılır?', excerpt: 'Türk Patent ve Marka Kurumu veri tabanında marka sorgulama adımları, benzer marka kontrolü ve filtreleme.', date: '2026-04-25' },
  { slug: 'marka-cakismasi-nedir', title: 'Marka Çakışması Nedir ve Nasıl Anlaşılır?', excerpt: 'Marka çakışması kavramı, hukuki sonuçları, çakışma türleri ve risk analizi nasıl yapılır?', date: '2026-04-25' },
  { slug: 'marka-itiraz-dilekcesi', title: 'Marka İtiraz Dilekçesi Örneği ve Yazımı', excerpt: 'Marka başvurusuna gelen itiraza karşı savunma dilekçesi nasıl yazılır? Örnek ve şablonlar.', date: '2026-04-25' },
  { slug: 'marka-tescil-suresi', title: 'Marka Tescil Süreci Kaç Gün Sürer?', excerpt: 'Marka tescil başvurusundan sonuca kadar geçen süre, inceleme aşamaları ve beklenen tarihler.', date: '2026-04-25' },
  { slug: 'marka-tescil-evraklari', title: 'Marka Tescili İçin Gerekli Evraklar', excerpt: 'Bireysel ve şirket başvuruları için gerekli belgeler, vekaletname ve dilekçe örnekleri.', date: '2026-04-25' },
  { slug: 'nice-siniflari', title: 'Nice Sınıfları Nedir? Nasıl Seçilir?', excerpt: 'Nice sınıfları açıklaması, sektörlere göre seçim rehberi ve çoklu sınıf başvurusu.', date: '2026-04-25' },
  { slug: 'marka-vekiligi', title: 'Marka Vekilliği Nedir? Kimler Yapabilir?', excerpt: 'Marka vekili olma şartları, sınavı, yetki alanı ve vekil ücretleri hakkında her şey.', date: '2026-04-25' },
  { slug: 'marka-hakki-ihlali', title: 'Marka Hakkı İhlali Nedir? Cezaları Nelerdir?', excerpt: 'Marka ihlali tanımı, haksız rekabet, tazminat davaları ve hukuki süreç.', date: '2026-04-25' },
  { slug: 'marka-benzerligi', title: 'Marka Benzerliği Nasıl Belirlenir?', excerpt: 'Görsel, işitsel ve kavramsal benzerlik kriterleri, tüketici karışıklığı testi.', date: '2026-04-25' },
  { slug: 'marka-basvurusu-reddedilirse', title: 'Marka Başvurusu Reddedilirse Ne Olur?', excerpt: 'Red gerekçeleri, itiraz süreci, temyiz ve yeni başvuru stratejileri.', date: '2026-04-25' },
  { slug: 'marka-yenileme-ucreti', title: 'Marka Tescil Yenileme Ücreti ve Süresi', excerpt: '10 yıllık koruma süresi sonrası yenileme ücretleri, süresi ve geç kalma durumu.', date: '2026-04-25' },
  { slug: 'uluslararasi-marka-tescil', title: 'Uluslararası Marka Tescil – Madrid Protokolü', excerpt: 'Yurtdışında marka tescili, Madrid sistemi, WIPO başvurusu ve ülke seçimi.', date: '2026-04-25' },
  { slug: 'marka-degeri', title: 'Marka Değeri Nasıl Hesaplanır?', excerpt: 'Marka değerleme yöntemleri, finansal analiz, bilançoya yansıtma ve lisanslama.', date: '2026-04-25' },
  { slug: 'eticaret-marka-tescili', title: 'E-Ticaret Sitesi İçin Marka Tescili Zorunlu mu?', excerpt: 'Online satış yapanlar için marka tescili, domain-marka ilişkisi ve hukuki koruma.', date: '2026-04-25' },
  { slug: 'logo-tescili', title: 'Logo Tescili Nasıl Yapılır? Ayrı mı Gerekir?', excerpt: 'Logo tescili ile marka tescili arasındaki fark, tasarım tescili ve birleştirilmiş başvuru.', date: '2026-04-25' },
  { slug: 'marka-ismini-degistirmek', title: 'Marka İsmini Değiştirmek Mümkün mü?', excerpt: 'Tescilli marka adı değişikliği, yeni başvuru şartları ve süreç.', date: '2026-04-25' },
  { slug: 'marka-tescili-olmadan-satis', title: 'Marka Tescili Olmadan Satış Yapmak Riskli mi?', excerpt: 'Tescilsiz marka kullanımının hukuki riskleri, ihlal durumunda yapılacaklar.', date: '2026-04-25' },
  { slug: 'marka-arastirmasi', title: 'Marka Araştırması Nasıl Yapılır? Profesyonel Rehber', excerpt: 'Başvuru öncesi kapsamlı marka araştırması, ücretsiz ve ücretli araçlar, AI destekli analiz.', date: '2026-04-25' },
  { slug: 'ai-destekli-marka-analizi', title: 'AI Destekli Marka Analizi: Geleceğin Koruma Teknolojisi', excerpt: 'Yapay zeka ile marka çakışma analizi nasıl yapılır? AI araçları, risk skorlama ve otomasyon.', date: '2026-04-25' },
  { slug: 'startup-marka-tescili', title: 'Startup Marka Tescili: Girişimciler İçin Rehber', excerpt: 'Girişimciler için marka tescilinin önemi, erken aşama stratejileri ve bütçe dostu yöntemler.', date: '2026-04-25' },
  { slug: 'marka-koruma-stratejileri', title: 'Marka Koruma Stratejileri: Kapsamlı İşletme Rehberi', excerpt: 'Tescil sonrası marka izleme, dijital koruma, ihlal mücadelesi ve hukuki stratejiler.', date: '2026-04-25' },
  { slug: 'patent-ve-marka-farki', title: 'Patent ve Marka Farkı Nedir?', excerpt: 'Patent ve marka arasındaki hukuki ve kavramsal farklar, birlikte kullanım stratejileri.', date: '2026-04-25' },
  { slug: 'endustriyel-tasarim-tescili', title: 'Endüstriyel Tasarım Tescili Nasıl Yapılır?', excerpt: 'Ürün görünümü koruma, başvuru süreci, maliyet ve marka ile birlikte kullanım.', date: '2026-04-25' },
  { slug: 'marka-lisanslama-rehberi', title: 'Marka Lisanslama Rehberi: Gelir Getiren Strateji', excerpt: 'Marka lisanslama türleri, sözleşme şartları, royalty modelleri ve risk yönetimi.', date: '2026-04-25' },
  { slug: 'sosyal-medya-marka-koruma', title: 'Sosyal Medyada Marka Koruma: Etkili Stratejiler', excerpt: 'Instagram, TikTok ve Facebookta marka ihlali tespiti, platform bildirimleri ve kriz yönetimi.', date: '2026-04-25' },
  { slug: 'marka-davasi-sureci', title: 'Marka Davası Süreci: Hukuki Rehber', excerpt: 'Marka davası türleri, delil toplama, mahkeme süreci, maliyet ve alternatif çözümler.', date: '2026-04-25' },
  { slug: 'eticaret-marka-ihlali', title: 'E-Ticarette Marka İhlali: Korunma ve Çözüm Rehberi', excerpt: 'Online platformlarda taklit ürün, izinsiz kullanım ve marka ihlali ile mücadele.', date: '2026-04-25' },
  { slug: 'marka-stratejisi-olusturma', title: 'Marka Stratejisi Oluşturma: Başarıya Götüren Rehber', excerpt: 'Marka kimliği, hedef kitle, konumlandırma, görsel dil ve iletişim stratejisi.', date: '2026-04-25' },
];

export function Blog() {
  useSEO('Blog', 'Marka tescili, çakışma analizi ve hukuki süreçler hakkında kapsamlı rehberler ve güncel bilgiler.');

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Marka Radar Blog</h1>
          <p className="text-slate-600">Marka tescili, çakışma analizi ve marka hukuku hakkında kapsamlı rehberler</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{post.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Devamını Oku <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
