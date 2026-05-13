import { TaskGroup } from "@/components/daily/TaskGroup";

interface TodayTasksSectionProps {
  kritikTasks: any[];
  sistemTasks: any[];
  activeTasks: any[];
  completedIds: Set<string>;
  englishSubtasks: any[];
  isTreadmillActive: boolean;
  vitaminPackages: any[];
  completedSkincareIds: string[];
}

export function TodayTasksSection(props: TodayTasksSectionProps) {
  return (
    <TaskGroup
      showOnly="active"
      {...props}
    />
  );
}
