import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import LoadingSplash from "./components/luna/LoadingSplash";
import AppShell from "@/components/nora/AppShell";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Voice from "./pages/Voice";
import Journal from "./pages/Journal";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Voorwaarden from "./pages/Voorwaarden";
import Contact from "./pages/Contact";
import PrivacyCenter from "./pages/PrivacyCenter";
import AdminDashboard from "./pages/AdminDashboard";
import ChatFolders from "./pages/ChatFolders";

const AuthenticatedApp = () => {
  const { authError } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) return <LoadingSplash onDone={() => setSplashDone(true)} />;

  if (authError?.type === "user_not_registered") return <UserNotRegisteredError />;

  if (authError?.type === "auth_required") {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
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
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/landing" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/voorwaarden" element={<Voorwaarden />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-center" element={<PrivacyCenter />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/chat/folders" element={<ChatFolders />} />
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