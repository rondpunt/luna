import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import AppShell from "@/components/nora/AppShell";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
import Chat from "./pages/Chat";
import Diary from "./pages/Diary";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import Voortgang from "./pages/Voortgang";
import Profiel from "./pages/Profiel";
import Reports from "./pages/Reports";
import Onboarding from "./pages/Onboarding";
import ConsoleOnboarding from "./pages/ConsoleOnboarding";
import WordSelect from "./pages/WordSelect";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Voorwaarden from "./pages/Voorwaarden";
import Contact from "./pages/Contact";
import PrivacyCenter from "./pages/PrivacyCenter";
import AdminDashboard from "./pages/AdminDashboard";

const AuthenticatedApp = () => {
  const { authError } = useAuth();

  if (authError?.type === "user_not_registered") return <UserNotRegisteredError />;

  if (authError?.type === "auth_required") {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<ConsoleOnboarding />} />
      <Route path="/wordselect" element={<WordSelect />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/voorwaarden" element={<Voorwaarden />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<OnboardingGate />} />
      <Route path="/onboarding" element={<ConsoleOnboarding />} />
      <Route path="/wordselect" element={<WordSelect />} />
      <Route element={<AppShell />}>
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:key" element={<SkillDetail />} />
        <Route path="/voortgang" element={<Voortgang />} />
        <Route path="/profiel" element={<Profiel />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="/landing" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/voorwaarden" element={<Voorwaarden />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-center" element={<PrivacyCenter />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}