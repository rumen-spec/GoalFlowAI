import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, RequireAuth, useAuth } from "./lib/auth";
import NavBar from "@/components/NavBar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

function Router() {
  const [location] = useLocation();
  const { user } = useAuth();

  // If user is logged in and tries to access login page, redirect to dashboard
  if (user && location === "/login") {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard">
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          </Route>
          <Route path="/" component={Home} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
