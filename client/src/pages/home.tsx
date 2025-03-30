import { useState } from "react";
import GoalForm from "@/components/GoalForm";
import ResultsView from "@/components/ResultsView";
import { CommitmentLevel, Goal, OutputFormat, GeneratedPlan } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {generatePlanTimeline} from "../lib/gemini"

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const goalMutation = useMutation({
    mutationFn: async (goal: Goal) => {
      const response = await apiRequest("POST", "/api/goals", goal);
      return response.json();
    },
    onSuccess: async (data) => {
      // Since we don't have a real AI, we'll simulate the plan generation
      if(currentGoal) {
        const plan = await generatePlanTimeline(currentGoal)
        if(plan) setGeneratedPlan(plan);
      }
      setShowResults(true);
    },
    onError: (error) => {
      toast({
        title: "Error generating plan",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleFormSubmit = (goal: Goal) => {
    setCurrentGoal(goal);
    goalMutation.mutate(goal);
  };

  const handleGoogleSignIn = () => {
    // This would integrate with Google OAuth in a real implementation
    setIsLoggedIn(true);
    toast({
      title: "Connected to Google Calendar",
      description: "You can now export your plan to Google Calendar",
    });
  };

  const handleReset = () => {
    setShowResults(false);
    setCurrentGoal(null);
    setGeneratedPlan(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">GoalFlow AI</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Turn your personal goals into actionable timelines — without overwhelm. 
          AI-powered scheduling that works with your lifestyle.
        </p>
      </header>

      {/* Main Content */}
      <main className="relative">
        {!showResults ? (
          <GoalForm 
            onSubmit={handleFormSubmit} 
            isProcessing={goalMutation.isPending}
            onGoogleSignIn={handleGoogleSignIn}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          generatedPlan && (
            <ResultsView 
              plan={generatedPlan} 
              onReset={handleReset}
              isLoggedIn={isLoggedIn}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GoalFlow AI. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Help</a>
        </div>
      </footer>
    </div>
  );
}
