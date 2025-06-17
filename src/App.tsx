
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Barbers from "./pages/Barbers";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <SidebarProvider>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </SidebarProvider>
            } />
            <Route path="/agendamentos" element={
              <SidebarProvider>
                <AppLayout>
                  <Appointments />
                </AppLayout>
              </SidebarProvider>
            } />
            <Route path="/produtos" element={
              <SidebarProvider>
                <AppLayout>
                  <Products />
                </AppLayout>
              </SidebarProvider>
            } />
            <Route path="/barbeiros" element={
              <SidebarProvider>
                <AppLayout>
                  <Barbers />
                </AppLayout>
              </SidebarProvider>
            } />
            <Route path="/configuracoes" element={
              <SidebarProvider>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </SidebarProvider>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
