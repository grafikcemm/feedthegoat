import { TaskGroup } from "@/components/daily/TaskGroup";

interface CriticalRoutesSectionProps {
  kritikTasks: any[];
  sistemTasks: any[];
  activeTasks: any[];
  completedIds: Set<string>;
  englishSubtasks: any[];
  isTreadmillActive: boolean;
  vitaminPackages: any[];
  completedSkincareIds: string[];
}

export function CriticalRoutinesSection(props: CriticalRoutesSectionProps) {
  return (
    <TaskGroup
      showOnly="kritik"
      {...props}
    />
  );
}
