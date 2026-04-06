import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Public pages
import LandingPage from './components/LandingPage';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Auth
import LoginPage from './pages/LoginPage';

// Authenticated pages
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import SavedPropertiesPage from './pages/SavedPropertiesPage';
import InquiriesPage from './pages/InquiriesPage';
import ProfilePage from './pages/ProfilePage';
import ListPropertyPage from './pages/ListPropertyPage';
import ManagePropertiesPage from './pages/ManagePropertiesPage';

// Redirect authenticated users away from /login
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" replace /> : children;
}

// Redirect unauthenticated users to /login, preserving intended destination
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  return user
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Auth */}
        <Route path="/login" element={
          <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
        } />

        {/* Protected */}
        <Route path="/home" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/property/:id" element={
          <ProtectedRoute><PropertyDetailsPage /></ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute><SavedPropertiesPage /></ProtectedRoute>
        } />
        <Route path="/inquiries" element={
          <ProtectedRoute><InquiriesPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/list-property" element={
          <ProtectedRoute><ListPropertyPage /></ProtectedRoute>
        } />
        <Route path="/list-property/:id" element={
          <ProtectedRoute><ListPropertyPage /></ProtectedRoute>
        } />
        <Route path="/my-properties" element={
          <ProtectedRoute><ManagePropertiesPage /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
