import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import JourneysPage from "./pages/JourneysPage.tsx";
import ScenePage from "./pages/ScenePage.tsx";
import ResultPage from "./pages/ResultPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import CharactersPage from "./pages/CharactersPage.tsx";
import ReflectionsPage from "./pages/ReflectionsPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jornada" element={<JourneysPage />} />
          <Route path="/cena" element={<ScenePage />} />
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/progresso" element={<ProgressPage />} />
          <Route path="/personagens" element={<CharactersPage />} />
          <Route path="/reflexoes" element={<ReflectionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
