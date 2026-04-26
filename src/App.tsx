import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css';

// Eager loaded (always needed)
import { Landing } from '@/pages/Landing';
import { NotFound } from '@/pages/NotFound';

// Lazy loaded pages
const Analyze = lazy(() => import('@/pages/Analyze').then(m => ({ default: m.Analyze })));
const Results = lazy(() => import('@/pages/Results').then(m => ({ default: m.Results })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Pricing = lazy(() => import('@/pages/Pricing').then(m => ({ default: m.Pricing })));
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })));
const Admin = lazy(() => import('@/pages/Admin').then(m => ({ default: m.Admin })));
const BrandDefense = lazy(() => import('@/pages/BrandDefense').then(m => ({ default: m.BrandDefense })));
const Privacy = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('@/pages/Terms').then(m => ({ default: m.Terms })));
const Payment = lazy(() => import('@/pages/Payment').then(m => ({ default: m.Payment })));
const Blog = lazy(() => import('@/pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('@/pages/BlogPost').then(m => ({ default: m.BlogPost })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const HelpCenter = lazy(() => import('@/pages/HelpCenter').then(m => ({ default: m.HelpCenter })));

function AppLayout({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <CookieBanner />
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-slate-400 text-sm">Yükleniyor...</div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout><PageWrapper><Landing /></PageWrapper></AppLayout>} />
        <Route path="/analyze" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Analyze /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/results/:analysisId" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Results /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/pricing" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Pricing /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/login" element={<AppLayout showFooter={false}><PageWrapper><Suspense fallback={<PageLoader />}><Login /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/register" element={<AppLayout showFooter={false}><PageWrapper><Suspense fallback={<PageLoader />}><Register /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/admin" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Admin /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/savunma" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><BrandDefense /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/gizlilik" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Privacy /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/kullanim-kosullari" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Terms /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/odeme" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Payment /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/blog" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Blog /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/blog/:slug" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><BlogPost /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/iletisim" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><Contact /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/hakkimizda" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><About /></Suspense></PageWrapper></AppLayout>} />
        <Route path="/yardim-merkezi" element={<AppLayout><PageWrapper><Suspense fallback={<PageLoader />}><HelpCenter /></Suspense></PageWrapper></AppLayout>} />
        <Route path="*" element={<AppLayout><PageWrapper><NotFound /></PageWrapper></AppLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <AnimatedRoutes />
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
