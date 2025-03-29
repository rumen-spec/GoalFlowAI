import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GeneratedPlan, OutputFormat } from "@/lib/types";
import CalendarView from "./CalendarView";
import ChecklistView from "./ChecklistView";
import SummaryView from "./SummaryView";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  plan: GeneratedPlan;
  onReset: () => void;
  isLoggedIn: boolean;
}

export default function ResultsView({ plan, onReset, isLoggedIn }: ResultsViewProps) {
  const { goal, tasks } = plan;
  const { toast } = useToast();
  const [viewFormat, setViewFormat] = useState<OutputFormat>(goal.outputFormat);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short',
      day: 'numeric' 
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleExportPDF = () => {
    toast({
      title: "Exporting to PDF",
      description: "Your plan is being exported to PDF format",
    });
    // This would be implemented with a real PDF export library in production
  };

  const handleExportToCalendar = () => {
    toast({
      title: "Exporting to Google Calendar",
      description: "Your plan is being exported to your Google Calendar",
    });
    // This would integrate with Google Calendar API in production
  };

  return (
    <>
      {/* Result Header */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{goal.title}</h2>
              <p className="text-gray-500 mt-1">
                <span>{`${plan.weeks} weeks timeline`}</span> • 
                <span>{` ${goal.commitmentLevel} commitment`}</span>
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-3">
              <Button
                variant="outline" 
                size="sm"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
                onClick={handleExportPDF}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg> 
                PDF
              </Button>
              
              {isLoggedIn && (
                <Button
                  variant="outline" 
                  size="sm"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                  onClick={handleExportToCalendar}
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19.5 12c0-4.14-3.36-7.5-7.5-7.5S4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5zm2.5 0c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM10.66 4.12l3.59 3.58 1.77-1.77L10.66.66 5.5 5.83l1.77 1.77 3.39-3.48z"
                    ></path>
                  </svg>
                  Export to Calendar
                </Button>
              )}
              
              <Button
                variant="outline" 
                size="sm"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
                onClick={onReset}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </Button>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="flex items-center mb-2">
            <div className="flex-1 h-2 overflow-hidden">
              <Progress value={progressPercentage} className="h-full" />
            </div>
            <span className="ml-3 text-sm text-gray-600">{`${progressPercentage.toFixed(0)}% Complete`}</span>
          </div>
          
          {/* Date Range */}
          <div className="text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(plan.startDate)}</span> - 
            <span>{formatDate(plan.endDate)}</span>
          </div>

          {/* View format selector */}
          <div className="flex mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Button
                variant={viewFormat === 'calendar' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewFormat('calendar')}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </Button>
              <Button
                variant={viewFormat === 'checklist' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewFormat('checklist')}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Checklist
              </Button>
              <Button
                variant={viewFormat === 'summary' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewFormat('summary')}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Component based on selected format */}
      {viewFormat === 'calendar' && <CalendarView plan={plan} />}
      {viewFormat === 'checklist' && <ChecklistView plan={plan} />}
      {viewFormat === 'summary' && <SummaryView plan={plan} />}
    </>
  );
}
