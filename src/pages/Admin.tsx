import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, Activity, TrendingUp, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { paymentService } from '@/services/paymentService';
import { useSEO } from '@/hooks/useSEO';

export function Admin() {
  useSEO('Admin Panel', 'Yönetim paneli.');
  const navigate = useNavigate();
  const analyses = storageService.getAnalyses();
  const guestAnalyses = storageService.getGuestAnalyses();
  const payments = paymentService.getPayments();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const user = authService.getCurrentUser();
    if (!user || (user.email !== 'demo@markaradar.com' && user.plan !== 'pro')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const totalAnalyses = analyses.length;
  const totalGuestAnalyses = guestAnalyses.length;
  // const totalPayments = payments.length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayAnalyses = analyses.filter(a => a.createdAt.startsWith(today)).length;
  const todayPayments = payments.filter(p => p.createdAt.startsWith(today)).length;

  const allAnalyses = [...analyses, ...guestAnalyses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentActivity = allAnalyses.slice(0, 8);

  const stats = [
    { label: 'Kayıtlı Analiz', value: totalAnalyses.toString(), icon: FileSearch, color: 'bg-blue-500' },
    { label: 'Misafir Analiz', value: totalGuestAnalyses.toString(), icon: BarChart3, color: 'bg-indigo-500' },
    { label: 'Toplam Ödeme', value: `${totalRevenue.toLocaleString('tr-TR')} TL`, icon: CreditCard, color: 'bg-emerald-500' },
    { label: 'Bugün Aktif', value: `${todayAnalyses + todayPayments}`, icon: Activity, color: 'bg-amber-500' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">Yönetim Paneli</h1>
          <p className="text-slate-600 mt-1">Platform kullanım istatistikleri ve son aktiviteler.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Payment History */}
        {payments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Son Ödemeler</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="col-span-3">Tarih</div>
                <div className="col-span-5">Açıklama</div>
                <div className="col-span-2">Tür</div>
                <div className="col-span-2 text-right">Tutar</div>
              </div>
              <div className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((p) => (
                  <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center">
                    <div className="sm:col-span-3 text-sm text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="sm:col-span-5">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.description}</p>
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
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Son Analizler</h2>
          
          {recentActivity.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Henüz analiz verisi bulunmuyor.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="col-span-2">Tarih</div>
                <div className="col-span-5">Ürün Özeti</div>
                <div className="col-span-2">Risk Skoru</div>
                <div className="col-span-3">Kullanıcı</div>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivity.map((analysis) => (
                  <div key={analysis.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center">
                    <div className="sm:col-span-2 text-sm text-slate-600">
                      {new Date(analysis.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="sm:col-span-5">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {analysis.result.product_summary}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        analysis.result.risk_score > 70 ? 'bg-red-100 text-red-700' :
                        analysis.result.risk_score > 40 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        %{analysis.result.risk_score}
                      </span>
                    </div>
                    <div className="sm:col-span-3 text-sm text-slate-500">
                      {analysis.userId ? 'Kayıtlı Kullanıcı' : 'Misafir'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
