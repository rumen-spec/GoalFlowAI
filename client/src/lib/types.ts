export type CommitmentLevel = 'low' | 'medium' | 'high';
export type OutputFormat = 'calendar' | 'checklist' | 'summary';

export interface Goal {
  id?: number;
  title: string;
  commitmentLevel: CommitmentLevel;
  outputFormat: OutputFormat;
  createdAt?: Date;
}

export interface Task {
  id?: number;
  goalId?: number;
  title: string;
  description?: string;
  week: number;
  completed: boolean;
  dueDate?: Date;
}

export interface GeneratedPlan {
  goal: Goal;
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  weeks: number;
}

export interface CalendarDay {
  date: Date;
  day: number;
  tasks: Task[];
  isCurrentMonth: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}
