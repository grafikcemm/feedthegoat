import { TaskGroup } from "@/components/daily/TaskGroup";

interface RhythmSummarySectionProps {
  kritikTasks: any[];
  sistemTasks: any[];
  activeTasks: any[];
  completedIds: Set<string>;
  englishSubtasks: any[];
  isTreadmillActive: boolean;
  vitaminPackages: any[];
  completedSkincareIds: string[];
}

export function RhythmSummarySection(props: RhythmSummarySectionProps) {
  return (
    <TaskGroup
      showOnly="sistem"
      {...props}
    />
  );
}
