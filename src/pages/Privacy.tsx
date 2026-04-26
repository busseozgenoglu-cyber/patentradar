import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Mail } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export function Privacy() {
  useSEO({ title: 'Gizlilik Politikası', description: 'MarkaRadar gizlilik politikası. Kişisel verilerinizin korunması ve kullanımı.', canonical: 'https://patentradar.pro/gizlilik' });
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-slate-500">Son güncelleme: 25 Nisan 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
          <Section icon={<Eye className="w-5 h-5" />} title="1. Topladığımız Bilgiler" >
            MarkaRadar olarak, size hizmet sunabilmek adına minimum düzeyde veri toplarız. Kayıt sırasında ad, e-posta adresi ve şifre bilgilerinizi alırız. Analiz geçmişiniz tarayıcınızın yerel depolama alanında (localStorage) saklanır.
          </Section>

          <Section icon={<Lock className="w-5 h-5" />} title="2. Veri Güvenliği">
            Şifreleriniz tarayıcı tarafında hashlenerek saklanır. Kişisel verileriniz üçüncü taraflarla paylaşılmaz. API anahtarları yalnızca sizin tarayıcınızda bulunur ve sunucularımıza gönderilmez.
          </Section>

          <Section icon={<Server className="w-5 h-5" />} title="3. Veri Saklama">
            Analiz geçmişiniz kayıtlı kullanıcılar için en fazla 50 analiz, misafir kullanıcılar için en fazla 10 analiz olarak tarayıcınızda saklanır. Hesabınızı sildiğinizde tüm verileriniz silinir.
          </Section>

          <Section icon={<Mail className="w-5 h-5" />} title="4. İletişim">
            Gizlilik politikamız hakkında sorularınız için info@markaradar.com adresine e-posta gönderebilirsiniz.
          </Section>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue-500">{icon}</div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}
