import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Kullanım Koşulları</h1>
          <p className="text-slate-500">Son güncelleme: 25 Nisan 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
          <Section icon={<Scale className="w-5 h-5" />} title="1. Hizmet Kapsamı">
            MarkaRadar, AI destekli ön marka çakışma analizi ve itiraz savunma dosyası hazırlama aracıdır. Platform üzerinden sağlanan analizler yalnızca bilgilendirme amaçlıdır ve kesin hukuki görüş niteliğinde değildir.
          </Section>

          <Section icon={<AlertTriangle className="w-5 h-5" />} title="2. Sorumluluk Reddi">
            MarkaRadar bir avukat, marka vekili veya patent vekili yerine geçmez. Resmi marka tescili veya hukuki işlem yapmadan önce Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden sorgulama yapmanız ve bir hukuk uzmanına danışmanız önerilir.
          </Section>

          <Section icon={<CheckCircle className="w-5 h-5" />} title="3. Kullanıcı Yükümlülükleri">
            Kullanıcılar, platformu yasalara uygun şekilde kullanmayı kabul eder. Yanlış veya yanıltıcı bilgi vermekten kaçınmalı, başka kullanıcıların haklarına saygılı olmalıdır. Platform üzerinden elde edilen raporların ticari amaçla üçüncü taraflara satılması yasaktır.
          </Section>

          <Section icon={<FileText className="w-5 h-5" />} title="4. Değişiklikler">
            MarkaRadar, kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Değişiklikler yayınlandığı tarihte yürürlüğe girer.
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
