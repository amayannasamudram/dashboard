import ActiveProjects from "@/components/widgets/ActiveProjects";
import GitHubActivity from "@/components/widgets/GitHubActivity";
import TaskChecklist from "@/components/widgets/TaskChecklist";
import QuickActions from "@/components/widgets/QuickActions";
import ActionInbox from "@/components/widgets/ActionInbox";

export default function ProjectsWorkspace() {
  return (
    <div className="h-full p-4 grid gap-4" style={{
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "1fr 1fr",
    }}>
      {/* Col 1 */}
      <ActiveProjects />

      {/* Col 2 */}
      <div className="flex flex-col gap-4">
        <GitHubActivity />
        <QuickActions />
      </div>

      {/* Col 3 */}
      <div className="flex flex-col gap-4">
        <TaskChecklist />
        <ActionInbox label="Capture" />
      </div>
    </div>
  );
}
