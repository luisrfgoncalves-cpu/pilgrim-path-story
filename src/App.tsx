import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import PreviewPaywall from "@/components/PreviewPaywall";
import PreviewTrialGate from "@/components/PreviewTrialGate";
import { useBackgroundTTSPregen } from "@/hooks/useBackgroundTTSPregen";
import { useAudioPrewarm } from "@/hooks/useAudioPrewarm";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Eagerly loaded pages (needed immediately)
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/AuthPage.tsx";

// Lazy loaded pages (loaded on demand — saves ~500KB+ on initial load)
const JourneysPage = lazy(() => import("./pages/JourneysPage.tsx"));
const ScenePage = lazy(() => import("./pages/ScenePage.tsx"));
const ResultPage = lazy(() => import("./pages/ResultPage.tsx"));
const ProgressPage = lazy(() => import("./pages/ProgressPage.tsx"));
const CharactersPage = lazy(() => import("./pages/CharactersPage.tsx"));
const ReflectionsPage = lazy(() => import("./pages/ReflectionsPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const CommunityPage = lazy(() => import("./pages/CommunityPage.tsx"));
const MultiplayerPage = lazy(() => import("./pages/MultiplayerPage.tsx"));
const PresentialMultiplayer = lazy(() => import("./pages/PresentialMultiplayer.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.tsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.tsx"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage.tsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const queryClient = new QueryClient();

// Check if app is in preview mode (embedded in landing page)
const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === 'landing';

// Chapters allowed in preview mode (first chapter of Part 1 and Part 2)
const PREVIEW_ALLOWED_CHAPTERS = ['cena1', 'p2-cena1'];

// Detect if running as installed PWA
const isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

/** Gate that requires authentication — always enforced */
const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

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

/** Invisible background TTS pre-generator */
const BackgroundPregen = () => {
  useBackgroundTTSPregen();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
      <BackgroundPregen />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth & public routes — always accessible */}
            <Route path="/auth" element={isPreviewMode ? <PreviewPaywall /> : <AuthPage />} />
            <Route path="/reset-password" element={isPreviewMode ? <PreviewPaywall /> : <ResetPasswordPage />} />
            <Route path="/vendas" element={isInstalledPWA ? <Navigate to="/" replace /> : <LandingPage />} />
            <Route path="/landing" element={isInstalledPWA ? <Navigate to="/" replace /> : <LandingPage />} />
            <Route path="/obrigado" element={<ThankYouPage />} />
            <Route path="/termos" element={<TermsPage />} />

            {/* Protected routes — require auth (preview mode uses 3-min trial) */}
            <Route path="/" element={
              isPreviewMode ? <PreviewTrialGate><Index /></PreviewTrialGate> : <AuthGate><Index /></AuthGate>
            } />
            <Route path="/jornada" element={
              isPreviewMode ? <PreviewTrialGate><JourneysPage /></PreviewTrialGate> : <AuthGate><JourneysPage /></AuthGate>
            } />
            <Route path="/personagens" element={
              isPreviewMode ? <PreviewTrialGate><CharactersPage /></PreviewTrialGate> : <AuthGate><CharactersPage /></AuthGate>
            } />
            <Route path="/reflexoes" element={
              isPreviewMode ? <PreviewTrialGate><ReflectionsPage /></PreviewTrialGate> : <AuthGate><ReflectionsPage /></AuthGate>
            } />
            <Route path="/comunidade" element={
              isPreviewMode ? <PreviewTrialGate><CommunityPage /></PreviewTrialGate> : <AuthGate><CommunityPage /></AuthGate>
            } />
            <Route path="/progresso" element={
              isPreviewMode ? <PreviewTrialGate><ProgressPage /></PreviewTrialGate> : <AuthGate><ProgressPage /></AuthGate>
            } />
            <Route path="/multiplayer" element={
              isPreviewMode ? <PreviewTrialGate><MultiplayerPage /></PreviewTrialGate> : <AuthGate><MultiplayerPage /></AuthGate>
            } />
            <Route path="/cena" element={
              isPreviewMode
                ? <PreviewTrialGate><PreviewSceneGate><ScenePage /></PreviewSceneGate></PreviewTrialGate>
                : <AuthGate><ScenePage /></AuthGate>
            } />
            <Route path="/resultado" element={
              isPreviewMode
                ? <PreviewTrialGate><PreviewResultGate><ResultPage /></PreviewResultGate></PreviewTrialGate>
                : <AuthGate><ResultPage /></AuthGate>
            } />
            <Route path="/perfil" element={isPreviewMode ? <PreviewPaywall /> : <AuthGate><ProfilePage /></AuthGate>} />
            <Route path="/multiplayer/presencial" element={
              isPreviewMode ? <PreviewTrialGate><PresentialMultiplayer /></PreviewTrialGate> : <AuthGate><PresentialMultiplayer /></AuthGate>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

