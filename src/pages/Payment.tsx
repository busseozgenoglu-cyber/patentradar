import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, ArrowLeft, Shield, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { paymentService, type PaymentRecord } from '@/services/paymentService';

export function Payment() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentRecord[]>(paymentService.getPayments());
  const [success, setSuccess] = useState('');

  const totalSpent = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4">
            <ArrowLeft className="w-4 h-4" /> Geri
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Ödeme Yönetimi</h1>
          <p className="text-slate-600 mt-1">Ödeme geçmişinizi görüntüleyin ve PayTR ayarlarınızı yönetin.</p>
        </motion.div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{payments.length}</div>
            <div className="text-sm text-slate-500">Toplam İşlem</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{totalSpent.toLocaleString('tr-TR')}</div>
            <div className="text-sm text-slate-500">Toplam Harcama (TL)</div>
          </div>
        </motion.div>

        {/* PayTR Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">PayTR Ödeme Altyapısı</h3>
              <p className="text-xs text-slate-500">Tüm ödemeler PayTR güvenli ödeme sistemi üzerinden işlenir.</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              256-bit SSL şifreleme
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              3D Secure / 3DS 2.0 desteği
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              Kart bilgileri tarafımızca saklanmaz
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://www.paytr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              PayTR Web Sitesi
            </a>
            <a
              href="https://dev.paytr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Geliştirici Dokümantasyonu
            </a>
          </div>
        </motion.div>

        {/* Backend Setup Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Backend Kurulumu Gerekli</p>
              <p className="text-sm text-amber-700 leading-relaxed mb-2">
                PayTR entegrasyonu için backend sunucusunu çalıştırmanız gerekiyor. Aşağıdaki adımları takip edin:
              </p>
              <ol className="text-sm text-amber-700 list-decimal list-inside space-y-1">
                <li><code className="bg-amber-100 px-1.5 py-0.5 rounded">.env</code> dosyasına PayTR bilgilerinizi girin</li>
                <li><code className="bg-amber-100 px-1.5 py-0.5 rounded">cd backend && npm install</code></li>
                <li><code className="bg-amber-100 px-1.5 py-0.5 rounded">npm start</code> (port 3001)</li>
                <li>Frontend <code className="bg-amber-100 px-1.5 py-0.5 rounded">VITE_API_URL=http://localhost:3001</code> ile çalışmalı</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ödeme Geçmişi</h2>
          {payments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Henüz ödeme geçmişiniz yok.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="col-span-3">Tarih</div>
                <div className="col-span-5">Açıklama</div>
                <div className="col-span-2">Tür</div>
                <div className="col-span-2 text-right">Tutar</div>
              </div>
              <div className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center">
                    <div className="sm:col-span-3 text-sm text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="sm:col-span-5">
                      <p className="text-sm font-medium text-slate-800">{p.description}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.type === 'analysis' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.type === 'analysis' ? 'Analiz' : 'Savunma'}
                      </span>
                    </div>
                    <div className="sm:col-span-2 text-sm font-bold text-slate-900 text-right">{p.amount} TL</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Security Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">Güvenlik Bilgisi</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tüm ödemeler PayTR altyapısı üzerinden, 256-bit SSL şifrelemeyle işlenir. Kart bilgileriniz
                hiçbir şekilde MarkaRadar sunucularında veya tarayıcınızda saklanmaz. Ödeme işlemi
                tamamen PayTR'nin güvenli ortamında gerçekleşir.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
