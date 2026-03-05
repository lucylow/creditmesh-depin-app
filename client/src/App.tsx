import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Web3Provider } from "./contexts/Web3Context";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Leaderboard from "./pages/Leaderboard";
import FAQ from "./pages/FAQ";
import DeviceMetrics from "./pages/DeviceMetrics";
import { EpochCountdown } from "./components/EpochCountdown";
import CreditMeshLanding from "./pages/creditmesh/Landing";
import CreditMeshDashboard from "./pages/creditmesh/Dashboard";
import CreditMeshDevices from "./pages/creditmesh/Devices";
import DeviceDetailPage from "./pages/creditmesh/DeviceDetailPage";
import CreditMeshStaking from "./pages/creditmesh/Staking";
import CreditMeshMarketplace from "./pages/creditmesh/Marketplace";
import CreditMeshVerifier from "./pages/creditmesh/Verifier";
import CreditMeshGovernance from "./pages/creditmesh/Governance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/creditmesh" component={CreditMeshLanding} />
      <Route path="/dashboard" component={CreditMeshDashboard} />
      <Route path="/devices" component={CreditMeshDevices} />
      <Route path="/devices/:id" component={DeviceDetailPage} />
      <Route path="/staking" component={CreditMeshStaking} />
      <Route path="/marketplace" component={CreditMeshMarketplace} />
      <Route path="/verifier" component={CreditMeshVerifier} />
      <Route path="/governance" component={CreditMeshGovernance} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/faq" component={FAQ} />
      <Route path="/device-metrics" component={DeviceMetrics} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Web3Provider>
          <TooltipProvider>
            <EpochCountdown />
            <Toaster />
            <Router />
          </TooltipProvider>
        </Web3Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
