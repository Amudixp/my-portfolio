import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { OAuthCallback } from './pages/OAuthCallback';
import { Dashboard } from './pages/Dashboard';
import { ProfileManager } from './pages/ProfileManager';
import { ProjectsManager } from './pages/ProjectsManager';
import { ExperiencesManager } from './pages/ExperiencesManager';
import { SkillsManager } from './pages/SkillsManager';
import { EducationManager } from './pages/EducationManager';

export default function Root() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<OAuthCallback />} />
          
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* The backend redirects to /dashboard?token=xxx */}
            <Route path="/dashboard" element={
              <TokenCheckWrapper>
                <Dashboard />
              </TokenCheckWrapper>
            } />
            <Route path="/profile" element={<ProfileManager />} />
            <Route path="/projects" element={<ProjectsManager />} />
            <Route path="/experiences" element={<ExperiencesManager />} />
            <Route path="/skills" element={<SkillsManager />} />
            <Route path="/education" element={<EducationManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function TokenCheckWrapper({ children }: { children: React.ReactNode }) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('token')) {
    return <OAuthCallback />;
  }
  return <>{children}</>;
}
