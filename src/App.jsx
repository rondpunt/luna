import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import LoadingSplash from "./components/luna/LoadingSplash";

// App pages
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Voortgang from "./pages/Voortgang";
import Profiel from "./pages/Profiel";
import Bibliotheek from "./pages/Bibliotheek";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Voorwaarden from "./pages/Voorwaarden";
import Contact from "./pages/Contact";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <LoadingSplash onDone={() => setSplashDone(true)} />;
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      return (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/prijzen" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/voorwaarden" element={<Voorwaarden />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      );
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/voortgang" element={<Voortgang />} />
      <Route path="/bibliotheek" element={<Bibliotheek />} />
      <Route path="/profiel" element={<Profiel />} />
      <Route path="/prijzen" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/voorwaarden" element={<Voorwaarden />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
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

export default App;