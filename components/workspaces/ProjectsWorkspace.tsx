import ActiveProjects from "@/components/widgets/ActiveProjects";
import GitHubActivity from "@/components/widgets/GitHubActivity";
import TaskChecklist from "@/components/widgets/TaskChecklist";
import QuickActions from "@/components/widgets/QuickActions";
import ActionInbox from "@/components/widgets/ActionInbox";

export default function ProjectsWorkspace() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
      padding: 10,
      height: "100%",
    }}>
      {/* Col 1: Projects (full height) */}
      <ActiveProjects style={{ height: "100%" }} />

      {/* Col 2: GitHub + Quick Access */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <GitHubActivity style={{ flex: "0 0 auto" }} />
        <QuickActions style={{ flex: 1 }} />
      </div>

      {/* Col 3: Tasks + Capture */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <TaskChecklist style={{ flex: 1 }} />
        <ActionInbox label="Capture" style={{ flex: "0 0 auto" }} />
      </div>
    </div>
  );
}
