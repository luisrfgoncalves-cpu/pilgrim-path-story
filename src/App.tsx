import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Check if app is in preview mode (embedded in landing page)
const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === 'landing';

// Chapters allowed in preview mode (first chapter of Part 1 and Part 2)
const PREVIEW_ALLOWED_CHAPTERS = ['cena1', 'p2-cena1'];

// Detect if running as installed PWA
const isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

/** Gate that requires auth when opened as installed app */
const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Only enforce auth when running as installed PWA
  if (!isInstalledPWA) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

/** In preview mode, allow only the first chapter of each part */
const PreviewSceneGate = ({ children }: { children: React.ReactNode }) => {
  const [params] = useSearchParams();
  const chapterId = params.get('id') || '';

  if (isPreviewMode && !PREVIEW_ALLOWED_CHAPTERS.includes(chapterId)) {
    return <PreviewPaywall />;
  }

  return <>{children}</>;
};

/** In preview mode, allow result only for allowed chapters */
const PreviewResultGate = ({ children }: { children: React.ReactNode }) => {
  const [params] = useSearchParams();
  const fromChapter = params.get('from') || params.get('id') || '';

  if (isPreviewMode && !PREVIEW_ALLOWED_CHAPTERS.includes(fromChapter)) {
    return <PreviewPaywall />;
  }

  return <>{children}</>;
};

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
            {/* Auth & public routes — always accessible */}
            <Route path="/auth" element={isPreviewMode ? <PreviewPaywall /> : <AuthPage />} />
            <Route path="/reset-password" element={isPreviewMode ? <PreviewPaywall /> : <ResetPasswordPage />} />
            <Route path="/vendas" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/obrigado" element={<ThankYouPage />} />
            <Route path="/termos" element={<TermsPage />} />

            {/* Protected routes — require auth when installed as PWA */}
            <Route path="/" element={<AuthGate><Index /></AuthGate>} />
            <Route path="/jornada" element={<AuthGate><JourneysPage /></AuthGate>} />
            <Route path="/personagens" element={<AuthGate><CharactersPage /></AuthGate>} />
            <Route path="/reflexoes" element={<AuthGate><ReflectionsPage /></AuthGate>} />
            <Route path="/comunidade" element={<AuthGate><CommunityPage /></AuthGate>} />
            <Route path="/progresso" element={<AuthGate><ProgressPage /></AuthGate>} />
            <Route path="/multiplayer" element={isPreviewMode ? <PreviewPaywall /> : <MultiplayerPage />} />
            <Route path="/cena" element={
              isPreviewMode
                ? <PreviewSceneGate><ScenePage /></PreviewSceneGate>
                : <AuthGate><ScenePage /></AuthGate>
            } />
            <Route path="/resultado" element={
              isPreviewMode
                ? <PreviewResultGate><ResultPage /></PreviewResultGate>
                : <AuthGate><ResultPage /></AuthGate>
            } />
            <Route path="/perfil" element={isPreviewMode ? <PreviewPaywall /> : <AuthGate><ProfilePage /></AuthGate>} />
            <Route path="/multiplayer/presencial" element={isPreviewMode ? <PreviewPaywall /> : <PresentialMultiplayer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

