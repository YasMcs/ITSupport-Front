import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EstadisticasPage } from "../pages/EstadisticasPage";
import { TicketsPage } from "../pages/TicketsPage";
import { TicketDetailPage } from "../pages/TicketDetailPage";
import { NuevoTicketPage } from "../pages/NuevoTicketPage";
import { PerfilPage } from "../pages/PerfilPage";
import { SucursalesPage } from "../pages/SucursalesPage";
import { NuevaSucursalPage } from "../pages/NuevaSucursalPage";
import { EditarSucursalPage } from "../pages/EditarSucursalPage";
import { SucursalDetallePage } from "../pages/SucursalDetallePage";
import { AreasPage } from "../pages/AreasPage";
import { NuevaAreaPage } from "../pages/NuevaAreaPage";
import { EditarAreaPage } from "../pages/EditarAreaPage";
import { AreaDetallePage } from "../pages/AreaDetallePage";
import { UsuariosPage } from "../pages/UsuariosPage";
import { NuevoUsuarioPage } from "../pages/NuevoUsuarioPage";
import { EditarUsuarioPage } from "../pages/EditarUsuarioPage";
import { UsuarioDetallePage } from "../pages/UsuarioDetallePage";
import { AccesoDenegadoPage } from "../pages/AccesoDenegadoPage";
import { SessionExpiredPage } from "../pages/SessionExpiredPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROLES } from "../constants/roles";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sesion-expirada" element={<SessionExpiredPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <ProtectedRoute>
            <EstadisticasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sucursales"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <SucursalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sucursales/nueva"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <NuevaSucursalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sucursales/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <SucursalDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sucursales/editar/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <EditarSucursalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/areas"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AreasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/areas/nueva"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <NuevaAreaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/areas/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AreaDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/areas/editar/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <EditarAreaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UsuariosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/nuevo"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <NuevoUsuarioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UsuarioDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/editar/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <EditarUsuarioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/acceso-denegado"
        element={
          <ProtectedRoute>
            <AccesoDenegadoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/disponibles"
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/nuevo"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ENCARGADO]}>
            <NuevoTicketPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
