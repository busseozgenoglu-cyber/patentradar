import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Download, Eye, TrendingUp, FileText, Crown, Loader2, Trash2, CreditCard } from 'lucide-react';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { generatePDF, downloadPDF } from '@/services/pdfService';
import { RiskScoreRing } from '@/components/RiskScoreRing';
import type { StoredAnalysis, User } from '@/types';
import { useSEO } from '@/hooks/useSEO';

export function Dashboard() {
  useSEO('Dashboard', 'Analiz geçmişinizi görüntüleyin ve yönetin.');
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setAnalyses(storageService.getAnalyses());
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) return null;

  const totalAnalyses = analyses.length;
  const avgRisk = totalAnalyses > 0
    ? Math.round(analyses.reduce((acc, a) => acc + a.result.risk_score, 0) / totalAnalyses)
    : 0;

  const handleDelete = (id: string) => {
    if (!confirm('Bu analizi silmek istediğinize emin misiniz?')) return;
    storageService.deleteAnalysis(id);
    setAnalyses(storageService.getAnalyses());
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Hoş geldiniz, <span className="font-semibold">{user.name}</span>. İşte analiz geçmişiniz.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 text-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Analiz
            </Link>
            <Link
              to="/odeme"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all text-sm"
            >
              <CreditCard className="w-4 h-4" />
              Kartlarım
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{totalAnalyses}</div>
            <div className="text-sm text-slate-500">Toplam Analiz</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className={`text-3xl font-extrabold mb-1 ${avgRisk > 70 ? 'text-red-500' : avgRisk > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {totalAnalyses > 0 ? avgRisk : '-'}
            </div>
            <div className="text-sm text-slate-500">Ortalama Risk Skoru</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {user.plan === 'pro' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                  <Crown className="w-3.5 h-3.5" />
                  Profesyonel
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                  Standart
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500">Mevcut Plan</div>
          </div>
        </motion.div>

        {/* Analysis History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Analiz Geçmişi</h2>
            <p className="text-sm text-slate-500">Tüm analizlerinizi görüntüleyin ve yönetin.</p>
          </div>

          {analyses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Henüz analiz yapmamışsınız</h3>
              <p className="text-sm text-slate-500 mb-6">
                İlk analizinizi başlatmak için aşağıdaki butona tıklayın.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Analiz Başlat
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="col-span-2">Tarih</div>
                <div className="col-span-4">Ürün Özeti</div>
                <div className="col-span-2 text-center">Risk Skoru</div>
                <div className="col-span-2 text-center">Durum</div>
                <div className="col-span-2 text-center">İşlemler</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100">
                {analyses.map((analysis, i) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center"
                  >
                    <div className="sm:col-span-2 text-sm text-slate-600">
                      {new Date(analysis.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="sm:col-span-4">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {analysis.result.product_summary.length > 60
                          ? analysis.result.product_summary.substring(0, 60) + '...'
                          : analysis.result.product_summary}
                      </p>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-center gap-2">
                      <div className="w-8 h-8">
                        <RiskScoreRing score={analysis.result.risk_score} size="sm" animated={false} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">%{analysis.result.risk_score}</span>
                    </div>
                    <div className="sm:col-span-2 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Tamamlandı
                      </span>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-center gap-1">
                      <Link
                        to={`/results/${analysis.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detay
                      </Link>
                      {user.plan === 'pro' ? (
                        <button
                          onClick={async () => {
                            setPdfLoadingId(analysis.id);
                            try {
                              const blob = await generatePDF(analysis.result);
                              downloadPDF(blob, `MarkaRadar_Rapor_${analysis.result.id.slice(-8)}.pdf`);
                            } catch (err) {
                              console.error('PDF generation failed:', err);
                              alert('PDF oluşturulurken bir hata oluştu.');
                            } finally {
                              setPdfLoadingId(null);
                            }
                          }}
                          disabled={pdfLoadingId === analysis.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {pdfLoadingId === analysis.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          PDF
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed">
                          <FileText className="w-3.5 h-3.5" />
                          PDF
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(analysis.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
