import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import MedicationPage from './pages/MedicationPage';
import InsightsPage from './pages/InsightsPage';

import { Sidebar } from './components/Layout/Sidebar';
import { Topbar } from './components/Layout/Topbar';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
        <Route path="/medication" element={<PageWrapper><MedicationPage /></PageWrapper>} />
        <Route path="/insights" element={<PageWrapper><InsightsPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none opacity-30 mix-blend-screen" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20 md:pb-6 relative z-10 w-full h-full min-h-full">
        {children}
      </div>
    </motion.div>
  );
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop fixed, Mobile animated */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth scrollbar-hide">
          <AnimatedRoutes />
        </main>
      </div>

    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
