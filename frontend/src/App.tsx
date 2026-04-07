import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import PatientInputPage from './pages/PatientInputPage';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import MedicationPage from './pages/MedicationPage';
import InsightsPage from './pages/InsightsPage';

import { Sidebar } from './components/Layout/Sidebar';
import { Topbar } from './components/Layout/Topbar';
import { PageWrapper } from './components/Layout/PageWrapper';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient-input" element={<PatientInputPage />} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/scenarios" element={<PageWrapper><ComparePage /></PageWrapper>} />
        <Route path="/medication" element={<PageWrapper><MedicationPage /></PageWrapper>} />
        <Route path="/insights" element={<PageWrapper><InsightsPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
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
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - fixed left-0 top-0 h-full w-[260px] */}
      <div className={`fixed inset-y-0 left-0 h-full w-[260px] z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Main Content Area - ml-[260px] on Desktop */}
      <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-[260px]">
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
