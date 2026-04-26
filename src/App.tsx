import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/Landing';
import { Analyze } from '@/pages/Analyze';
import { Results } from '@/pages/Results';
import { Dashboard } from '@/pages/Dashboard';
import { Pricing } from '@/pages/Pricing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Admin } from '@/pages/Admin';
import { BrandDefense } from '@/pages/BrandDefense';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Payment } from '@/pages/Payment';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { NotFound } from '@/pages/NotFound';
import { Contact } from '@/pages/Contact';
import { About } from '@/pages/About';
import { HelpCenter } from '@/pages/HelpCenter';
import './App.css';

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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout><PageWrapper><Landing /></PageWrapper></AppLayout>} />
        <Route path="/analyze" element={<AppLayout><PageWrapper><Analyze /></PageWrapper></AppLayout>} />
        <Route path="/results/:analysisId" element={<AppLayout><PageWrapper><Results /></PageWrapper></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout><PageWrapper><Dashboard /></PageWrapper></AppLayout>} />
        <Route path="/pricing" element={<AppLayout><PageWrapper><Pricing /></PageWrapper></AppLayout>} />
        <Route path="/login" element={<AppLayout showFooter={false}><PageWrapper><Login /></PageWrapper></AppLayout>} />
        <Route path="/register" element={<AppLayout showFooter={false}><PageWrapper><Register /></PageWrapper></AppLayout>} />
        <Route path="/admin" element={<AppLayout><PageWrapper><Admin /></PageWrapper></AppLayout>} />
        <Route path="/savunma" element={<AppLayout><PageWrapper><BrandDefense /></PageWrapper></AppLayout>} />
        <Route path="/gizlilik" element={<AppLayout><PageWrapper><Privacy /></PageWrapper></AppLayout>} />
        <Route path="/kullanim-kosullari" element={<AppLayout><PageWrapper><Terms /></PageWrapper></AppLayout>} />
        <Route path="/odeme" element={<AppLayout><PageWrapper><Payment /></PageWrapper></AppLayout>} />
        <Route path="/blog" element={<AppLayout><PageWrapper><Blog /></PageWrapper></AppLayout>} />
        <Route path="/blog/:slug" element={<AppLayout><PageWrapper><BlogPost /></PageWrapper></AppLayout>} />
        <Route path="/iletisim" element={<AppLayout><PageWrapper><Contact /></PageWrapper></AppLayout>} />
        <Route path="/hakkimizda" element={<AppLayout><PageWrapper><About /></PageWrapper></AppLayout>} />
        <Route path="/yardim-merkezi" element={<AppLayout><PageWrapper><HelpCenter /></PageWrapper></AppLayout>} />
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
