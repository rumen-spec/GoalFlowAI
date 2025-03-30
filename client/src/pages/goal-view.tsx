import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Goal, Task } from "@shared/schema";

interface GoalWithTasks extends Goal {
  tasks?: Task[];
  startDate: Date;
  endDate: Date;
  description?: string;
}

// Reuse the same progress calculation functions from dashboard
const calculateProgress = (goal: GoalWithTasks) => {
  if (!goal.tasks?.length) return 0;
  const completedTasks = goal.tasks.filter(task => task.completed).length;
  return (completedTasks / goal.tasks.length) * 100;
};

const getTaskStats = (goal: GoalWithTasks) => {
  const total = goal.tasks?.length || 0;
  const completed = goal.tasks?.filter(task => task.completed).length || 0;
  return { total, completed };
};

export default function GoalView() {
  const params = useParams();
  const goalId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the goal details
  const { data: goal, isLoading: isGoalLoading, error: goalError } = useQuery<Goal>({
    queryKey: ["goal", goalId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/goals/${goalId}`);
      return response.json();
    },
    enabled: !isNaN(goalId),
  });

  // Get the tasks for the goal
  const { data: tasks = [], isLoading: isTasksLoading, error: tasksError } = useQuery<Task[]>({
    queryKey: ["goal", goalId, "tasks"],
    queryFn: async () => {
      console.log(`Fetching tasks for goal ${goalId}`);
      const response = await apiRequest("GET", `/api/goals/${goalId}/tasks`);
      const data = await response.json();
      console.log("Tasks data received:", data);
      return data;
    },
    enabled: !isNaN(goalId) && !!goal,
  });

  // Construct the combined goal with tasks
  const goalWithTasks: GoalWithTasks | undefined = goal && {
    ...goal,
    tasks,
    startDate: new Date(), // This would ideally come from your goal data
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Mock end date 3 months from now
    description: goal.title, // Using title as description if no description exists
  };

  const taskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number | undefined, completed: boolean }) => {
      if (!id) return null;
      const response = await apiRequest("PATCH", `/api/tasks/${id}/complete`, {
        body: JSON.stringify({ completed }),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both the goal and tasks queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId, "tasks"] });
      
      // Also invalidate the dashboard tasks query to update progress bars there
      queryClient.invalidateQueries({ queryKey: ["/api/goals/tasks"] });
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const handleTaskToggle = (taskId: number | undefined, currentCompleted: boolean) => {
    if (!taskId) return;
    taskMutation.mutate({ id: taskId, completed: !currentCompleted });
  };

  const isLoading = isGoalLoading || isTasksLoading;
  const error = goalError || tasksError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !goalWithTasks) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Error</h1>
              <p className="mt-4 text-gray-600">Failed to load goal details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = calculateProgress(goalWithTasks);
  const { total: totalTasks, completed: completedTasks } = getTaskStats(goalWithTasks);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">{goalWithTasks.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="mt-2 text-gray-600">{goalWithTasks.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Commitment Level</h3>
              <p className="mt-2 text-gray-600 capitalize">{goalWithTasks.commitmentLevel}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Timeline</h3>
              <p className="mt-2 text-gray-600">
                {format(new Date(goalWithTasks.startDate), "MMMM d, yyyy")} - {format(new Date(goalWithTasks.endDate), "MMMM d, yyyy")}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Progress</h3>
                <span className="text-sm text-gray-600">{progressPercentage.toFixed(0)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h3>
              <ul className="space-y-3">
                {goalWithTasks.tasks?.map((task: Task) => (
                  <li key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Due {task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "No due date"}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 