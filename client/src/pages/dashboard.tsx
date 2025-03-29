import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal, Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface User {
  name?: string;
  email: string;
  isLoggedIn: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setLocation('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    // Simulate fetching goals from API
    setTimeout(() => {
      // Fake data for demonstration
      const mockGoals = [
        {
          id: 1,
          title: "Learn JavaScript",
          commitmentLevel: "high",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
          progress: 75,
          tasks: 12,
          completedTasks: 9,
        },
        {
          id: 2,
          title: "Run a marathon",
          commitmentLevel: "medium",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
          progress: 30,
          tasks: 10,
          completedTasks: 3,
        },
        {
          id: 3,
          title: "Read 12 books this year",
          commitmentLevel: "low",
          createdAt: new Date(),
          progress: 5,
          tasks: 20,
          completedTasks: 1,
        }
      ];
      
      setGoals(mockGoals);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
    });
    setLocation('/login');
  };

  const handleCreateGoal = () => {
    setLocation('/');
  };

  const handleViewGoal = (goalId: number) => {
    // In a real app, this would navigate to a goal details page
    toast({
      title: "View Goal",
      description: `Viewing details for goal #${goalId}`,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-500">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary rounded-lg p-2 mr-3 text-primary-foreground">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
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
            <h1 className="text-2xl font-bold text-gray-900">GoalFlow AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user?.name || user?.email}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Goals</h2>
          <Button onClick={handleCreateGoal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No goals yet</h3>
              <p className="text-gray-500 mb-6">Create your first goal to get started</p>
              <Button onClick={handleCreateGoal}>Create New Goal</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden hover:shadow-md transition">
                <CardHeader className="bg-gray-50 border-b px-6 py-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span className="truncate">{goal.title}</span>
                    <Badge commitment={goal.commitmentLevel} />
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Created on {formatDate(goal.createdAt)}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{goal.completedTasks} of {goal.tasks} tasks completed</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleViewGoal(goal.id)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Badge({ commitment }: { commitment: string }) {
  const colors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-green-100 text-green-700",
  };

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <span 
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        colors[commitment as keyof typeof colors]
      }`}
    >
      {labels[commitment as keyof typeof labels]}
    </span>
  );
}