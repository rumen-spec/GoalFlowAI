import { Card } from "@/components/ui/card";
import { GeneratedPlan } from "@/lib/types";
import { format, addWeeks } from "date-fns";

interface SummaryViewProps {
  plan: GeneratedPlan;
}

export default function SummaryView({ plan }: SummaryViewProps) {
  const phases = [
    { name: 'Foundation', weeks: [1, 2], focus: 'building basic skills' },
    { name: 'Development', weeks: [3, 4], focus: 'expanding knowledge' },
    { name: 'Refinement', weeks: [5, 6], focus: 'applying techniques' },
    { name: 'Mastery', weeks: [7, 8], focus: 'demonstrating expertise' }
  ];

  const sessionsByCommitment = {
    low: { sessions: 2, hours: '1-2' },
    medium: { sessions: 3, hours: '2-3' },
    high: { sessions: 5, hours: '4-5' }
  };

  const formatDate = (date: Date, weeksToAdd: number) => {
    const newDate = addWeeks(date, weeksToAdd);
    return format(newDate, 'MMM d');
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Goal Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
          
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border-4 border-white shadow z-10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-medium text-gray-900">{`Phase ${index + 1}: ${phase.name}`}</h4>
                  <p className="mt-1 text-sm text-gray-500">{`Weeks ${phase.weeks[0]}-${phase.weeks[1]}`}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Focus on <span className="font-medium">{phase.focus}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Weekly breakdown */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Breakdown</h3>
        <div className="space-y-4">
          {Array.from({ length: plan.weeks }, (_, i) => i + 1).map((week) => (
            <div 
              key={week}
              className={`p-4 rounded-lg border ${
                week === 1 ? 'bg-primary/10 border-primary/20' : 'bg-white border-gray-200'
              }`}
            >
              <h4 className="font-medium flex justify-between">
                <span>{`Week ${week}`}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(plan.startDate, week-1)}
                </span>
              </h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <span>
                    {sessionsByCommitment[plan.goal.commitmentLevel as keyof typeof sessionsByCommitment].sessions} sessions
                  </span> • 
                  <span>
                    {` Total: ${sessionsByCommitment[plan.goal.commitmentLevel as keyof typeof sessionsByCommitment].hours} hours`}
                  </span>
                </p>
                <p className="mt-1">
                  {`Focus: ${
                    week <= 2 ? 'Fundamentals' :
                    week <= 4 ? 'Building skills' :
                    week <= 6 ? 'Practice' : 'Advanced techniques'
                  }`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
