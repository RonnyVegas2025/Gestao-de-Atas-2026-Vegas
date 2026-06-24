import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './providers/DataProvider';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Module Imports
import { LoginPage } from './modules/login/LoginPage';
import { PerfilPage } from './modules/perfil/PerfilPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { AtasListPage } from './modules/atas/AtasListPage';
import { NovaAtaPage } from './modules/atas/NovaAtaPage';
import { ViewAtaPage } from './modules/atas/ViewAtaPage';
import { EditarAtaPage } from './modules/atas/EditarAtaPage';
import { CategoriasPage } from './modules/categorias/CategoriasPage';
import { UploadsPage } from './modules/uploads/UploadsPage';
import { LixeiraPage } from './modules/lixeira/LixeiraPage';
import { UsuariosPage } from './modules/usuarios/UsuariosPage';
import { PermissoesPage } from './modules/permissoes/PermissoesPage';
import { RelatoriosPage } from './modules/relatorios/RelatoriosPage';

export default function App() {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          {/* Public Route: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated/Protected Routes wrapped in MainLayout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/atas" element={<AtasListPage />} />
                    <Route path="/atas/nova" element={<NovaAtaPage />} />
                    <Route path="/atas/:id" element={<ViewAtaPage />} />
                    <Route path="/atas/:id/editar" element={<EditarAtaPage />} />
                    <Route path="/categorias" element={<CategoriasPage />} />
                    <Route path="/uploads" element={<UploadsPage />} />
                    <Route path="/lixeira" element={<LixeiraPage />} />
                    <Route path="/usuarios" element={<UsuariosPage />} />
                    <Route path="/permissoes" element={<PermissoesPage />} />
                    <Route path="/relatorios" element={<RelatoriosPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}
