import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Artists from "./pages/Artists";
import Studios from "./pages/Studios";
import MusicSchools from "./pages/MusicSchools";
import RecordLabels from "./pages/RecordLabels";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import Collaborations from "./pages/Collaborations";
import Gigs from "./pages/Gigs";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/schools" element={<MusicSchools />} />
            <Route path="/labels" element={<RecordLabels />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/collaborations" element={<Collaborations />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content/*" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminUsers />} />
            <Route path="/admin/messages" element={<AdminUsers />} />
            <Route path="/admin/reviews" element={<AdminUsers />} />
            <Route path="/admin/reports" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminUsers />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
