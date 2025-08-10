import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PetitionForm from "@/pages/petition-form";
import FormLibrary from "@/pages/form-library";
import FL100PetitionPage from "@/pages/fl-100-petition";
import FL200PetitionPage from "@/pages/fl-200-petition";
import DE111PetitionPage from "@/pages/de-111-petition";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PetitionForm} />
      <Route path="/library" component={FormLibrary} />
      <Route path="/california-fl-100-petition" component={FL100PetitionPage} />
      <Route path="/california-fl-200-response" component={FL200PetitionPage} />
      <Route path="/california-de-111-probate" component={DE111PetitionPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
