import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NavBar() {
  const { user, logoutMutation, isLoading } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-1.5 text-primary-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 12A10 10 0 1 1 12 2" />
              <polyline points="8 16 12 12 16 16" />
              <line x1="12" y1="22" x2="12" y2="12" />
            </svg>
          </div>
          <Link href="/" className="font-bold text-xl text-gray-900 hover:text-primary transition">
            GoalFlow AI
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary transition">
            Home
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary transition">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Logout'
                )}
              </Button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}