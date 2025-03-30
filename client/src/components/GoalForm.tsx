import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CommitmentLevel, OutputFormat, Goal } from "@/lib/types";

const goalFormSchema = z.object({
  title: z.string().min(3, {
    message: "Goal must be at least 3 characters.",
  }),
  commitmentLevel: z.enum(["low", "medium", "high"] as const),
  outputFormat: z.enum(["calendar", "checklist", "summary"] as const),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
  isProcessing: boolean;
  onGoogleSignIn: () => void;
  isLoggedIn: boolean;
}

export default function GoalForm({ onSubmit, isProcessing, onGoogleSignIn, isLoggedIn }: GoalFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      commitmentLevel: "medium",
      outputFormat: "calendar",
    },
  });

  const handleSubmit = (values: GoalFormValues) => {
    if (!values.title.trim()) {
      setErrorMessage("Please enter your goal");
      return;
    }
    
    setErrorMessage("");
    onSubmit(values);
  };

  const handleExampleClick = (example: string) => {
    form.setValue("title", example);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
            {/* Goal Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">What's your goal?</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Learn Python, Write a novel, Lose 10 pounds"
                      className="w-full px-4 py-3 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Learn piano", "Start a side hustle", "Read more books"].map((example) => (
                      <Button
                        key={example}
                        type="button"
                        variant="outline"
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full h-auto"
                        onClick={() => handleExampleClick(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Commitment Level */}
            <FormField
              control={form.control}
              name="commitmentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3">How committed are you?</FormLabel>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {(["low", "medium", "high"] as const).map((level) => {
                      const icons = {
                        low: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ),
                        medium: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ),
                        high: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )
                      };
                      
                      const hours = {
                        low: "~2 hrs/week",
                        medium: "~4 hrs/week",
                        high: "~1 hr/day"
                      };
                      
                      return (
                        <Button
                          key={level}
                          type="button"
                          variant="outline"
                          className={`flex h-auto flex-col items-center justify-center p-4 rounded-lg border transition ${
                            field.value === level 
                              ? 'bg-purple-100 border-purple-400 text-purple-900' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-purple-400'
                          }`}
                          onClick={() => field.onChange(level)}
                        >
                          <div className="w-6 h-6 flex items-center justify-center mb-2">
                            {icons[level]}
                          </div>
                          <span className="font-medium capitalize">{level}</span>
                          <span className="text-xs text-gray-500 mt-1">{hours[level]}</span>
                        </Button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            
            {/* Output Format */}
            <FormField
              control={form.control}
              name="outputFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3">How do you want your plan?</FormLabel>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {(["calendar", "checklist", "summary"] as const).map((format) => {
                      const icons = {
                        calendar: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ),
                        checklist: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ),
                        summary: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )
                      };
                      
                      const descriptions = {
                        calendar: "Daily view",
                        checklist: "Weekly tasks",
                        summary: "Overview"
                      };
                      
                      return (
                        <Button
                          key={format}
                          type="button"
                          variant="outline"
                          className={`flex h-auto flex-col items-center justify-center p-4 rounded-lg border transition ${
                            field.value === format 
                              ? 'bg-purple-100 border-purple-400 text-purple-900' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-purple-400'
                          }`}
                          onClick={() => field.onChange(format)}
                        >
                          <div className="w-6 h-6 flex items-center justify-center mb-2">
                            {icons[format]}
                          </div>
                          <span className="font-medium capitalize">{format}</span>
                          <span className="text-xs text-gray-500 mt-1">{descriptions[format]}</span>
                        </Button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            
            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition"
                  onClick={onGoogleSignIn}
                  disabled={isLoggedIn}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span>{isLoggedIn ? 'Connected to Google Calendar' : 'Connect Google Calendar'}</span>
                </Button>
              </div>
              
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition flex items-center justify-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate My Plan</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
