import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function GoalView() {
  const [, params] = useParams();
  const goalId = parseInt(params?.id || "0");

  const { data: goal, isLoading, error } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => apiRequest(`/api/goals/${goalId}`),
    enabled: !isNaN(goalId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !goal) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">{goal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="mt-2 text-gray-600">{goal.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Commitment Level</h3>
              <p className="mt-2 text-gray-600 capitalize">{goal.commitmentLevel}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Timeline</h3>
              <p className="mt-2 text-gray-600">
                {format(new Date(goal.startDate), "MMMM d, yyyy")} - {format(new Date(goal.endDate), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Tasks</h3>
              <ul className="mt-2 space-y-2">
                {goal.tasks?.map((task) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                      readOnly
                    />
                    <span className="text-gray-600">
                      {task.title} - Due {format(new Date(task.dueDate), "MMMM d, yyyy")}
                    </span>
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