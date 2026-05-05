import { Toaster } from "@/components/ui/toaster";
import { LunaSonner } from "@/components/LunaSonner";
import LunaErrorBoundary from "@/components/LunaErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import AppShell from "@/components/shell/AppShell";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Diary from "./pages/Diary";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import Voortgang from "./pages/Voortgang";
import Profiel from "./pages/Profiel";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Voorwaarden from "./pages/Voorwaarden";
import Contact from "./pages/Contact";
import PrivacyCenter from "./pages/PrivacyCenter";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Rust from "./pages/Rust";
import Geheugen from "./pages/Geheugen";
import Inzichten from "./pages/Inzichten";
import LunaPreferenceRootSync from "@/components/shell/LunaPreferenceRootSync";

const AuthenticatedApp = () => {
  const { authError, isAuthenticated } = useAuth();

  if (authError?.type === "user_not_registered") return <UserNotRegisteredError />;

  if (authError?.type === "auth_required") {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/voorwaarden" element={<Voorwaarden />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <>
      {isAuthenticated && <LunaPreferenceRootSync />}
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/rust" element={<Rust />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:key" element={<SkillDetail />} />
        <Route path="/voortgang" element={<Voortgang />} />
        <Route path="/inzichten" element={<Inzichten />} />
        <Route path="/geheugen" element={<Geheugen />} />
        <Route path="/profiel" element={<Profiel />} />
      </Route>
      <Route path="/landing" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/voorwaarden" element={<Voorwaarden />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-center" element={<PrivacyCenter />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};

export default function App() {
  return (
    <LunaErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <LunaSonner />
        </QueryClientProvider>
      </AuthProvider>
    </LunaErrorBoundary>
  );
}