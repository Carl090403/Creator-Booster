import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import ToolsPage from './pages/ToolsPage';
import GuidePage from './pages/GuidePage';
import PricingPage from './pages/PricingPage';
import { useAppStore } from './stores/appStore';
import { authService } from './services/authService';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAppStore();
  
  // Si l'utilisateur n'est pas authentifié, on bloque l'accès et on renvoie au Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté mais n'a pas fait son onboarding, on le force à y aller
  if (user && !user.onboarding_completed && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { setUser, clearUser } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A14] text-[#F1F5F9] font-sans selection:bg-[#7C3AED]/30">
        <Routes>
          {/* ================= ROUTES PUBLIQUES ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Les tarifs et le support sont désormais accessibles sans connexion */}
          <Route path="/recharge-credits" element={<Navigate to="/pricing" replace />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guide" element={<GuidePage />} />

          {/* ================= ROUTES PROTÉGÉES ================= */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/tools/:toolId" element={
            <ProtectedRoute>
              <ToolsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirection globale pour les URLs inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#12121F',
            color: '#F1F5F9',
            border: '1px solid #1E1E3A',
          },
        }} />
      </div>
    </Router>
  );
}