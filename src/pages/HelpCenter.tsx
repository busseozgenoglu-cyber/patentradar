import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, FileText, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

const categories = [
  { id: 'general', label: 'Genel', icon: HelpCircle },
  { id: 'analysis', label: 'Analiz', icon: FileText },
  { id: 'payment', label: 'Ödeme', icon: CreditCard },
  { id: 'account', label: 'Hesap', icon: Shield },
  { id: 'legal', label: 'Hukuki', icon: AlertCircle },
];

const faqs = [
  { category: 'general', q: 'MarkaRadar nedir?', a: 'MarkaRadar, yapay zeka destekli marka çakışma ve risk analizi platformudur. Markanızı başvuru öncesi analiz ederek benzer markaları bulur ve çakışma riskini değerlendirir.' },
  { category: 'general', q: 'MarkaRadar resmi bir marka araştırması mıdır?', a: 'Hayır. MarkaRadar yalnızca ön değerlendirme amaçlı bir araçtır. Kesin hukuki görüş veya resmi marka araştırması yerine geçmez. Resmi başvuru öncesinde Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden mutlaka sorgulama yapınız.' },
  { category: 'general', q: 'Analiz sonuçları ne kadar güvenilir?', a: 'Sonuçlar yapay zeka ve benzerlik algoritmaları ile üretilir. Ancak bu sonuçlar ön değerlendirme niteliğindedir. Kesin karar için bir marka vekiline veya hukuk uzmanına danışmanızı öneririz.' },
  { category: 'analysis', q: 'Bir analiz ne kadar sürer?', a: 'Analiz işlemi genellikle 15-30 saniye arasında tamamlanır. AI API key varsa gerçek zamanlı analiz yapılır, yoksa mock verilerle hızlı bir sonuç üretilir.' },
  { category: 'analysis', q: 'PDF raporu nasıl alabilirim?', a: 'Her marka analizi (299 TL) kapsamında profesyonel PDF raporu otomatik olarak oluşturulur ve indirilebilir. PDF indirme özelliği Pro plan kullanıcılarına sunulmaktadır.' },
  { category: 'analysis', q: 'Kaç marka analizi yapabilirim?', a: 'Herhangi bir sınırlama yoktur. Her marka için ayrı analiz satın alabilirsiniz. Her analiz 299 TL\'dir.' },
  { category: 'analysis', q: 'Analiz geçmişime nasıl ulaşabilirim?', a: 'Giriş yaptıktan sonra Dashboard sayfasından tüm analiz geçmişinizi görüntüleyebilir, detaylarına bakabilir ve PDF raporlarını tekrar indirebilirsiniz.' },
  { category: 'payment', q: 'Ödeme yöntemleri nelerdir?', a: 'Tüm ödemeler PayTR güvenli ödeme altyapısı üzerinden kredi kartı ile gerçekleştirilir. 256-bit SSL şifreleme ve 3D Secure desteği mevcuttur.' },
  { category: 'payment', q: 'Ödemem güvenli mi?', a: 'Evet. Tüm ödemeler PayTR\'nin güvenli ortamında işlenir. Kart bilgileriniz hiçbir şekilde MarkaRadar sunucularında saklanmaz.' },
  { category: 'payment', q: 'Fatura alabilir miyim?', a: 'Evet. Ödeme sonrası fatura talebinizi info@markaradar.com adresine iletebilirsiniz. Kurumsal fatura düzenlenebilir.' },
  { category: 'account', q: 'Nasıl kayıt olabilirim?', a: 'Kayıt sayfasından ad soyad, e-posta ve şifre bilgilerinizi girerek ücretsiz hesap oluşturabilirsiniz.' },
  { category: 'account', q: 'Şifremi unuttum, ne yapmalıyım?', a: 'Giriş sayfasındaki "Şifremi unuttum" bağlantısına tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.' },
  { category: 'account', q: 'Hesabımı nasıl silebilirim?', a: 'Hesap silme talebinizi info@markaradar.com adresine iletebilirsiniz. Talebiniz en kısa sürede işleme alınacaktır.' },
  { category: 'legal', q: 'Marka itiraz savunma dosyası nedir?', a: 'Markanıza yapılan haksız itirazlara karşı hukuki temelli savunma dosyası hazırlayan bir hizmettir. AI destekli detaylı analiz ve argümanlar içerir.' },
  { category: 'legal', q: 'Savunma dosyası hukuki bağlayıcılığı var mı?', a: 'Hayır. Savunma dosyası yapay zeka tarafından oluşturulmuş ön bir taslaktır. Bir hukuk uzmanına danışmadan doğrudan kullanmayınız.' },
  { category: 'legal', q: 'Nice sınıfı nedir?', a: 'Nice sınıfları, markaların hangi mal/hizmet kategorilerinde korunacağını belirleyen uluslararası bir sınıflandırma sistemidir. MarkaRadar analizi sonrasında doğru Nice sınıfını seçmeniz önerilir.' },
];

export function HelpCenter() {
  useSEO({ title: 'Yardım Merkezi', description: 'MarkaRadar hakkında sık sorulan sorular ve yardım kaynakları.', canonical: 'https://patentradar.pro/#/yardim-merkezi' });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(f => {
    const matchCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Yardım Merkezi</h1>
          <p className="text-slate-600">Sık sorulan sorular ve hızlı yanıtlar</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setOpenIndex(null); }}
            placeholder="Bir soru arayın..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </motion.div>

        {/* Categories */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => { setActiveCategory('all'); setOpenIndex(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Tümü
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveCategory(c.id); setOpenIndex(null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${activeCategory === c.id ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              <c.icon className="w-3.5 h-3.5" />
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Sonuç bulunamadı.</p>
              <p className="text-sm text-slate-400 mt-1">Farklı bir arama terimi deneyin.</p>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                  {openIndex === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Cevabını bulamadın mı?</h2>
          <p className="text-sm text-slate-600 mb-4">Bizimle doğrudan iletişime geçebilirsin.</p>
          <Link
            to="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
          >
            Bize Ulaş
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
