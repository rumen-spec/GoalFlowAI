import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { GeneratedPlan, Task } from "@/lib/types";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChecklistViewProps {
  plan: GeneratedPlan;
}

export default function ChecklistView({ plan }: ChecklistViewProps) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [tasks, setTasks] = useState<Task[]>(plan.tasks);

  const weekTasks = tasks.filter(task => task.week === currentWeek);
  const completedTasks = weekTasks.filter(task => task.completed).length;
  const progressPercentage = weekTasks.length > 0 ? (completedTasks / weekTasks.length) * 100 : 0;

  const taskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number | undefined, completed: boolean }) => {
      if (!id) return null;
      const response = await apiRequest("PATCH", `/api/tasks/${id}/complete`, { completed });
      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
        setTasks(prev => prev.map(task => 
          task.id === data.id ? { ...task, completed: data.completed } : task
        ));
      }
    }
  });

  const handleTaskToggle = (task: Task) => {
    // Optimistically update UI
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    ));
    
    // Send update to server
    taskMutation.mutate({ id: task.id, completed: !task.completed });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'EEE, MMM d');
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Week Tabs */}
      <div className="flex overflow-x-auto border-b scrollbar-hide">
        {Array.from({ length: plan.weeks }, (_, i) => i + 1).map((week) => (
          <Button
            key={week}
            variant={week === currentWeek ? "default" : "ghost"}
            size="sm"
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-none ${
              week === currentWeek ? 'border-b-2 border-primary' : ''
            }`}
            onClick={() => setCurrentWeek(week)}
          >
            Week {week}
          </Button>
        ))}
      </div>
      
      {/* Checklist Items */}
      <div className="divide-y">
        {weekTasks.length > 0 ? (
          weekTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={() => handleTaskToggle(task)}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No tasks scheduled for this week
          </div>
        )}
      </div>
      
      {/* Week Completion Summary */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Week {currentWeek} Progress</p>
            <p className="text-xs text-gray-500">{completedTasks} of {weekTasks.length} tasks completed</p>
          </div>
          <div className="w-24 h-2 overflow-hidden">
            <Progress value={progressPercentage} className="h-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
