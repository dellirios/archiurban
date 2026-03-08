import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import ArchiLayout from "@/layouts/ArchiLayout";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Team from "./pages/Team";
import Clients from "./pages/Clients";
import AppSettings from "./pages/AppSettings";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import CrmPage from "./pages/CrmPage";
import PurchasesPage from "./pages/PurchasesPage";
import TemplatesPage from "./pages/TemplatesPage";
import ReportsPage from "./pages/ReportsPage";
import PortfolioPage from "./pages/PortfolioPage";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";
import Pricing from "./pages/Pricing";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTenants from "./pages/admin/AdminTenants";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTenantDetail from "./pages/admin/AdminTenantDetail";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { viewMode } = useApp();

  if (viewMode === 'client') {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={
          <ProtectedRoute><ClientPortal /></ProtectedRoute>
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:slug" element={<PublicPortfolioPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/app" element={
        <ProtectedRoute><ArchiLayout /></ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="team" element={<Team />} />
        <Route path="clients" element={<Clients />} />
        <Route path="chat" element={<Chat />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="settings" element={<AppSettings />} />
      </Route>
      <Route path="/admin" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="tenants" element={<AdminTenants />} />
        <Route path="tenants/:id" element={<AdminTenantDetail />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
