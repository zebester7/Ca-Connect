/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/src/components/AuthProvider';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Toaster } from '@/components/ui/sonner';

import { LoginView } from '@/src/views/LoginView';
import { OnboardingView } from '@/src/views/OnboardingView';
import { HomeView } from '@/src/views/HomeView';
import { GroupsView } from '@/src/views/GroupsView';
import { QAView } from '@/src/views/QAView';
import { DashboardLayout } from '@/src/components/DashboardLayout';

// Placeholder components
const Notes = () => <DashboardLayout><div>Notes Workspace</div></DashboardLayout>;
const Resources = () => <DashboardLayout><div>Resource Library</div></DashboardLayout>;
const Events = () => <DashboardLayout><div>Events & Webinars</div></DashboardLayout>;
const Mentorship = () => <DashboardLayout><div>Mentorship Program</div></DashboardLayout>;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuthStore();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user && !profile && window.location.pathname !== '/onboarding') return <Navigate to="/onboarding" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingView /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout><HomeView /></DashboardLayout></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><DashboardLayout><GroupsView /></DashboardLayout></ProtectedRoute>} />
          <Route path="/qa" element={<ProtectedRoute><DashboardLayout><QAView /></DashboardLayout></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/mentorship" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
