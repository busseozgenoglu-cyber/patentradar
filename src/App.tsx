import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Landing } from '@/pages/Landing';
import { Analyze } from '@/pages/Analyze';
import { Results } from '@/pages/Results';
import { Dashboard } from '@/pages/Dashboard';
import { Pricing } from '@/pages/Pricing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Admin } from '@/pages/Admin';
import { BrandDefense } from '@/pages/BrandDefense';
import './App.css';

function AppLayout({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<AppLayout><Landing /></AppLayout>} />
          <Route path="/analyze" element={<AppLayout><Analyze /></AppLayout>} />
          <Route path="/results/:analysisId" element={<AppLayout><Results /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/pricing" element={<AppLayout><Pricing /></AppLayout>} />
          <Route path="/login" element={<AppLayout showFooter={false}><Login /></AppLayout>} />
          <Route path="/register" element={<AppLayout showFooter={false}><Register /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
          <Route path="/savunma" element={<AppLayout><BrandDefense /></AppLayout>} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
}

export default App;
