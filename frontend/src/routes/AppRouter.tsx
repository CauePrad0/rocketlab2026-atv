import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/templates/AppShell';
import { CatalogoPage } from '@/pages/CatalogoPage';
import { DashboardPage } from '@/pages/DashboardPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
