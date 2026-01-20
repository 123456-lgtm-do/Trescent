import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Showcase from "@/pages/showcase";
import Moodboard from "@/pages/moodboard";
import ProductDetail from "@/pages/product-detail";
import Admin from "@/pages/admin";
import FlipbookViewer from "@/pages/flipbook-viewer";
import LightingSolution from "@/pages/solutions/lighting";
import TheaterSolution from "@/pages/solutions/theater";
import AudioSolution from "@/pages/solutions/audio";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/showcase" component={Showcase} />
      <Route path="/moodboard" component={Moodboard} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/view/:token" component={FlipbookViewer} />
      <Route path="/admin" component={Admin} />
      <Route path="/solutions/lighting" component={LightingSolution} />
      <Route path="/solutions/theater" component={TheaterSolution} />
      <Route path="/solutions/audio" component={AudioSolution} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
