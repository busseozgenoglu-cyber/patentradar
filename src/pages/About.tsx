import { motion } from 'framer-motion';
import { Target, Shield, Zap, Users, Award, Globe } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const values = [
  { icon: Target, title: 'Misyonumuz', desc: 'Türkiye\'deki girişimcilerin ve işletmelerin markalarını başvuru öncesi akıllıca analiz ederek, hukuki riskleri minimize etmelerini sağlamak.' },
  { icon: Shield, title: 'Güvenilirlik', desc: 'Yapay zeka destekli analizlerimiz ön değerlendirme niteliğindedir ve her zaman resmi kurumlarla desteklenmelidir.' },
  { icon: Zap, title: 'Teknoloji', desc: 'En son yapay zeka teknolojilerini ve benzerlik algoritmalarını kullanarak hızlı ve detaylı analizler sunuyoruz.' },
  { icon: Users, title: 'Kullanıcı Odaklılık', desc: 'Kullanıcı deneyimini ön planda tutarak, teknik karmaşıklığı basit ve anlaşılır arayüzlere dönüştürüyoruz.' },
  { icon: Award, title: 'Kalite', desc: 'Her analiz sonucu profesyonel standartlarda hazırlanır ve PDF rapor olarak sunulur.' },
  { icon: Globe, title: 'Erişilebilirlik', desc: 'Marka tescil sürecini herkes için erişilebilir kılmak istiyoruz. Uygun fiyatlı ve anlaşılır hizmet sunuyoruz.' },
];

const stats = [
  { value: '10.000+', label: 'Analiz Tamamlandı' },
  { value: '5.000+', label: 'Kayıtlı Kullanıcı' },
  { value: '26+', label: 'Sektör Kapsamı' },
  { value: '%98', label: 'Müşteri Memnuniyeti' },
];

export function About() {
  useSEO('Hakkımızda', 'MarkaRadar hakkında. Misyonumuz, vizyonumuz ve değerlerimiz.');

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Hakkımızda</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            MarkaRadar, Türkiye'deki marka tescil sürecini dijitalleştiren ve yapay zeka teknolojileriyle 
            güçlendiren yenilikçi bir platformdur. Markanızı korumanın en akıllı yolunu sunuyoruz.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Yasal Uyarı:</strong> MarkaRadar bir avukatlık bürosu, marka vekili veya resmi danışmanlık hizmeti değildir. 
            Platformumuz tarafından sunulan analizler yalnızca ön değerlendirme amaçlıdır ve kesin hukuki görüş yerine geçmez. 
            Resmi işlem öncesinde Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden sorgulama yapmanız ve bir hukuk uzmanına danışmanız önerilir.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
