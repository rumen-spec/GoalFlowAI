import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneratedPlan, CalendarWeek, Task } from "@/lib/types";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay, eachDayOfInterval } from "date-fns";

interface CalendarViewProps {
  plan: GeneratedPlan;
}

export default function CalendarView({ plan }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start, end });
    
    const weeks: CalendarWeek[] = [];
    let week: CalendarWeek = { days: [], weekNumber: 0 };
    
    days.forEach((day, i) => {
      const dayTasks = plan.tasks.filter(task => 
        task.dueDate && isSameDay(new Date(task.dueDate), day)
      );
      
      if (i % 7 === 0 && i > 0) {
        weeks.push(week);
        week = { days: [], weekNumber: weeks.length + 1 };
      }
      
      week.days.push({
        date: day,
        day: day.getDate(),
        tasks: dayTasks,
        isCurrentMonth: isSameMonth(day, currentDate)
      });
    });
    
    if (week.days.length > 0) {
      weeks.push(week);
    }
    
    return weeks;
  }, [currentDate, plan.tasks]);

  const formatDayNumber = (date: Date) => {
    return format(date, 'd');
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Week Navigation */}
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="ghost" size="icon" onClick={prevWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h3 className="font-medium">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y">
        {/* Days Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 md:p-3 text-center text-xs font-medium text-gray-500">{day}</div>
        ))}
        
        {/* Calendar Cells */}
        {weeks.map((week) => 
          week.days.map((day, i) => (
            <div 
              key={i} 
              className={`min-h-[100px] p-2 md:p-3 relative group hover:bg-gray-50 ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              }`}
            >
              <div className="text-xs text-gray-400">{formatDayNumber(day.date)}</div>
              
              {/* Tasks for this day */}
              <div className="mt-2 space-y-1">
                {day.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-2 text-xs rounded bg-primary/10 border border-primary/20 text-primary-foreground/70 cursor-pointer hover:bg-primary/20 transition"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs mt-1 text-gray-500">
                      {plan.goal.commitmentLevel === 'low' ? '30' : plan.goal.commitmentLevel === 'medium' ? '45' : '60'} min session
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
