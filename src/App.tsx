import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreatorKPIPage from "./pages/CreatorKPIPage";
import CreatorScopePage from "./pages/CreatorScopePage";
import EventPage from "./pages/EventPage";
import PitchDeckPage from "./pages/PitchDeckPage";
import NotFound from "./pages/NotFound";
import TwitterMetricsPage from "./pages/TwitterMetricsPage";
import MetricsReportPage from "./pages/MetricsReportPage";
import { ThemeToggle } from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <ThemeToggle />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kpis/:entityType/:entityId" element={<CreatorKPIPage />} />
            <Route path="/scope/:entityType/:entityId" element={<CreatorScopePage />} />
            <Route path="/evento" element={<EventPage />} />
            <Route path="/pitchdeck" element={<PitchDeckPage />} />
            <Route path="/twitter-metrics" element={<TwitterMetricsPage />} />
            <Route path="/metrics-report" element={<MetricsReportPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
