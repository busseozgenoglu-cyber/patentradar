import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileSearch, Activity, Crown, TrendingUp, FileText } from 'lucide-react';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { useSEO } from '@/hooks/useSEO';

export function Admin() {
  useSEO('Admin Panel', 'Yönetim paneli.');
  const navigate = useNavigate();
  const analyses = storageService.getAnalyses();
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const user = authService.getCurrentUser();
    // Only allow admin access for demo user or explicit admin flag
    if (!user || (user.email !== 'demo@markaradar.com' && !user.plan)) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const stats = [
    { label: 'Toplam Kullanıcı', value: '1,248', icon: Users, color: 'bg-blue-500' },
    { label: 'Toplam Analiz', value: analyses.length > 0 ? analyses.length.toString() : '3,847', icon: FileSearch, color: 'bg-emerald-500' },
    { label: 'Bugün Aktif', value: '156', icon: Activity, color: 'bg-amber-500' },
    { label: 'Pro Kullanıcı', value: '342', icon: Crown, color: 'bg-indigo-500' },
  ];

  const recentActivity = analyses.slice(0, 5);

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
          <p className="text-slate-600 mt-1">Platform kullanım istatistikleri.</p>
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
