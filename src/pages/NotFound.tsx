import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export function NotFound() {
  useSEO('Sayfa Bulunamadı', 'Aradığınız sayfa bulunamadı. Ana sayfaya dönün veya yeni bir analiz başlatın.');
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16 pb-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-extrabold text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-slate-600 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Analiz Başlat
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
