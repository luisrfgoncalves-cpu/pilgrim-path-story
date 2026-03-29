import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import PreviewPaywall from "@/components/PreviewPaywall";
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
import PresentialMultiplayer from "./pages/PresentialMultiplayer.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ThankYouPage from "./pages/ThankYouPage.tsx";

const queryClient = new QueryClient();

// Check if app is in preview mode (embedded in landing page)
const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === 'landing';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vendas" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            {/* Browsable in preview — strategic showcase routes */}
            <Route path="/jornada" element={<JourneysPage />} />
            <Route path="/personagens" element={<CharactersPage />} />
            <Route path="/reflexoes" element={<ReflectionsPage />} />
            <Route path="/comunidade" element={<CommunityPage />} />
            <Route path="/progresso" element={<ProgressPage />} />
            <Route path="/multiplayer" element={isPreviewMode ? <PreviewPaywall /> : <MultiplayerPage />} />
            {/* Blocked in preview — game routes */}
            <Route path="/cena" element={isPreviewMode ? <PreviewPaywall /> : <ScenePage />} />
            <Route path="/resultado" element={isPreviewMode ? <PreviewPaywall /> : <ResultPage />} />
            <Route path="/auth" element={isPreviewMode ? <PreviewPaywall /> : <AuthPage />} />
            <Route path="/reset-password" element={isPreviewMode ? <PreviewPaywall /> : <ResetPasswordPage />} />
            <Route path="/perfil" element={isPreviewMode ? <PreviewPaywall /> : <ProfilePage />} />
            <Route path="/multiplayer/presencial" element={isPreviewMode ? <PreviewPaywall /> : <PresentialMultiplayer />} />
            <Route path="/obrigado" element={<ThankYouPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
