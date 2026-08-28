import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoNoticeBanner } from './components/layout/DemoNoticeBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDemoPage } from './pages/AdminDemoPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans">
        {/* Top Disclaimer Banner */}
        <DemoNoticeBanner />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
            <Route path="/track" element={<TrackComplaintPage />} />
            <Route path="/track/:id" element={<TrackComplaintPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminDemoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Civic Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
