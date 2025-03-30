import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal as GoalType, Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Goal } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch user goals
  const { 
    data: goals = [], 
    isLoading,
    error
  } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: !!user,
  });
  
  // We'll calculate these for each goal
  const calculateProgress = (goal: Goal) => {
    // In a real app, this would be based on completed tasks
    // For now, we'll use a random percentage
    return Math.floor(Math.random() * 100);
  };
  
  const getTaskStats = (goal: Goal) => {
    // Simulating task stats
    const total = Math.floor(Math.random() * 20) + 5;
    const completed = Math.floor(Math.random() * total);
    return { total, completed };
  };

  const handleCreateGoal = () => {
    setLocation('/');
  };

  const handleViewGoal = (goalId: number) => {
    setLocation(`/goals/${goalId}`);
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
    <div>
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Track and manage your personal goals</p>
            </div>
            <Button onClick={handleCreateGoal} size="default" className="bg-purple-500 hover:bg-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
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
              <Button onClick={handleCreateGoal} className="bg-purple-500 hover:bg-purple-600">Create New Goal</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = calculateProgress(goal);
              const { total: tasks, completed: completedTasks } = getTaskStats(goal);
              
              return (
                <Card key={goal.id} className="overflow-hidden hover:shadow-md transition">
                  <CardHeader className="bg-gray-50 border-b px-6 py-4">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="truncate">{goal.title}</span>
                      <Badge commitment={goal.commitmentLevel} />
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {formatDate(goal.createdAt ?? new Date())}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>{completedTasks} of {tasks} tasks completed</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleViewGoal(goal.id)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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