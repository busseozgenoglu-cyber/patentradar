import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { analyzeWithOpenAI, buildFullResult } from '@/services/openaiService';
import { storageService } from '@/services/storageService';
import { authService } from '@/services/authService';

export function Analyze() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');
  const navigate = useNavigate();

  const charCount = text.length;
  const isValid = charCount >= 10;

  const handleAnalyze = useCallback(async () => {
    if (!isValid) {
      setError('Lütfen marka adınızı ve sektörünüzü yazın.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setStep('Marka bilgileri analiz ediliyor...');

    try {
      setStep('Benzer markalar araştırılıyor...');
      const openaiResult = await analyzeWithOpenAI(text);
      setStep('Risk değerlendirmesi tamamlanıyor...');
      const result = buildFullResult(openaiResult, text);

      const stored: import('@/types').StoredAnalysis = {
        id: result.id,
        userId: authService.getCurrentUser()?.id,
        inputText: text,
        result,
        createdAt: result.createdAt,
      };

      if (authService.isAuthenticated()) {
        storageService.saveAnalysis(stored);
      } else {
        storageService.saveGuestAnalysis(stored);
      }

      navigate(`/results/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setIsAnalyzing(false);
      setStep('');
    }
  }, [text, isValid, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Markanızı Analiz Edin
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Marka adınızı, sektörünüzü ve faaliyet alanlarınızı aşağıya yazın. MarkaRadar size benzer markaları ve çakışma risk değerlendirmesi sunacak.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
            <Search className="w-4 h-4" />
            Her analiz 499 TL
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 relative"
        >
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setText(e.target.value);
                  setError('');
                }
              }}
              placeholder="Örneğin: Yeni bir kahve markası oluşturuyorum. 'Sıcak Gün Kahvecisi' ismini düşünüyorum. Cafe işletmeciliği yapacağım, aynı zamanda online kahve satışı ve mobil uygulama üzerinden sipariş alacağım..."
              className="w-full min-h-[200px] p-4 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex-1">
                {error && (
                  <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>
              <span className={`text-xs ${charCount > 1800 ? 'text-amber-500' : 'text-slate-400'}`}>
                {charCount} / 2000
              </span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !isValid}
            className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isAnalyzing || !isValid
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analiz Et — 499 TL
              </>
            )}
          </button>

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 z-10"
            >
              <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">MarkaRadar analiz ediyor...</h3>
              <p className="text-sm text-slate-500 text-center mb-2">
                {step || 'Marka bilgileri işleniyor...'}
              </p>
              <p className="text-xs text-slate-400 text-center mb-6">
                Bu işlem 15-30 saniye sürebilir.
              </p>
              <div className="w-full max-w-sm space-y-3">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-400 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 20, ease: 'easeInOut' }} />
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-400 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 20, delay: 3, ease: 'easeInOut' }} />
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-400 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 20, delay: 6, ease: 'easeInOut' }} />
                </div>
              </div>
              <div className="flex gap-6 mt-6 text-xs text-slate-400">
                <span>Marka tarama</span>
                <span>→</span>
                <span>Çakışma analizi</span>
                <span>→</span>
                <span>Risk değerlendirmesi</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
