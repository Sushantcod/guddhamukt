import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDemoPage } from './pages/AdminDemoPage';
import { LoginPage } from './pages/LoginPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/track/:id" element={<TrackComplaintPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDemoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans">
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Pages with Motion Transitions */}
        <div className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </div>

        {/* Global Modern Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
