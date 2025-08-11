import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient, prefetchCommonQueries } from "@/lib/queryClient";
import Router from "@/Router";

function App() {
  // Prefetch common data on app load for better UX
  useEffect(() => {
    prefetchCommonQueries().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-legal-light">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
