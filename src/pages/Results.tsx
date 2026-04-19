import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, AlertCircle, Lightbulb } from 'lucide-react';
import { storageService } from '@/services/storageService';
import { authService } from '@/services/authService';
import { generatePDF, downloadPDF } from '@/services/pdfService';
import { analyzePatent } from '@/services/aiAnalysisService';
import { RiskScoreRing } from '@/components/RiskScoreRing';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import type { AnalysisResult } from '@/types';

export function Results() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);


  useEffect(() => {
    if (!analysisId) {
      navigate('/analyze');
      return;
    }

    // Try to find stored analysis
    const stored = storageService.getAnalysisById(analysisId) || 
                   storageService.getGuestAnalyses().find(a => a.id === analysisId);
    
    if (stored) {
      setResult(stored.result);
      setLoading(false);
    } else {
      // If not found, redirect to analyze
      navigate('/analyze');
    }
  }, [analysisId, navigate]);

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;
    
    // All analyses include PDF download at 499 TL per query
    
    setPdfLoading(true);
    try {
      const blob = await generatePDF(result);
      downloadPDF(blob, `MarkaRadar_Rapor_${result.id.slice(-8)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setPdfLoading(false);
    }
  }, [result]);

  const handleReanalyze = useCallback(() => {
    if (result?.inputText) {
      // Re-run analysis with same text
      const newResult = analyzePatent(result.inputText);
      const stored: import('@/types').StoredAnalysis = {
        id: newResult.id,
        userId: authService.getCurrentUser()?.id,
        inputText: result.inputText,
        result: newResult,
        createdAt: newResult.createdAt,
      };
      
      if (authService.isAuthenticated()) {
        storageService.saveAnalysis(stored);
      } else {
        storageService.saveGuestAnalysis(stored);
      }
      
      navigate(`/results/${newResult.id}`, { replace: true });
      setResult(newResult);
    }
  }, [result, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!result) return null;

  // All analyses include PDF download (499 TL per analysis)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          {authService.isAuthenticated() ? (
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Dashboard'a Dön
            </Link>
          ) : (
            <Link to="/analyze" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Yeni Analiz
            </Link>
          )}
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Analiz Sonuçları</h1>
          <p className="text-xs text-slate-400">
            {new Date(result.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>

        {/* Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-8"
        >
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2 flex justify-center md:justify-start">
              <RiskScoreRing score={result.risk_score} size="lg" animated />
            </div>
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Risk Değerlendirmesi</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{result.summary_comment}</p>
              <div className="space-y-2">
                {result.risk_factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detected Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Tespit Edilen Özellikler</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {result.detected_features.map((feature) => (
                <span key={feature} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {feature}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400">AI tarafından çıkarılan marka özellikleri.</p>
          </div>
        </motion.div>

        {/* Search Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Önerilen Arama Terimleri</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {result.search_keywords.map((kw) => (
                <span key={kw} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full">
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400">Benzer markaları bulmak için kullanılan anahtar kelimeler.</p>
          </div>
        </motion.div>

        {/* Top Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-1">En Benzer Marka Kayıtları</h2>
          <p className="text-sm text-slate-500 mb-4">Aşağıdaki markalar sizin markanızla çakışma riski göstermektedir.</p>
          
          <div className="space-y-4">
            {result.top_matches.map((match, i) => {
              const matchColor = match.similarity_score > 70 ? 'text-red-600 bg-red-50' : match.similarity_score > 40 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50';
              return (
                <motion.div
                  key={match.patent_number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900">{match.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{match.patent_number} · {match.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${matchColor}`}>
                      %{match.similarity_score}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{match.summary}</p>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Neden benzer?</p>
                    <ul className="space-y-1">
                      {match.match_reasons.map((reason, ri) => (
                        <li key={ri} className="text-xs text-slate-500 flex items-start gap-1.5">
                          <span className="text-slate-300 mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Uniqueness Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-1">Özgünleşme Önerileri</h2>
          <p className="text-sm text-slate-500 mb-4">Riski azaltmak ve farklılaşmak için değerlendirebileceğiniz yönler.</p>
          
          <div className="space-y-3">
            {result.uniqueness_suggestions.map((suggestion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="bg-white rounded-xl shadow-sm border-l-[3px] border-blue-500 border-y border-r border-slate-100 p-5"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{suggestion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <LegalDisclaimer />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {pdfLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                PDF Oluşturuluyor...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                PDF Rapor İndir
              </>
            )}
          </button>
          
          <button
            onClick={handleReanalyze}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Yeniden Analiz Et
          </button>
          
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Yeni Analiz
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
