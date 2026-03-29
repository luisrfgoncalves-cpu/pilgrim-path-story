import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import JourneysPage from "./pages/JourneysPage.tsx";
import ScenePage from "./pages/ScenePage.tsx";
import ResultPage from "./pages/ResultPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import CharactersPage from "./pages/CharactersPage.tsx";
import ReflectionsPage from "./pages/ReflectionsPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import MultiplayerPage from "./pages/MultiplayerPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jornada" element={<JourneysPage />} />
            <Route path="/cena" element={<ScenePage />} />
            <Route path="/resultado" element={<ResultPage />} />
            <Route path="/progresso" element={<ProgressPage />} />
            <Route path="/personagens" element={<CharactersPage />} />
            <Route path="/reflexoes" element={<ReflectionsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/comunidade" element={<CommunityPage />} />
            <Route path="/multiplayer" element={<MultiplayerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
