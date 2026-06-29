import ActiveProjects from "@/components/widgets/ActiveProjects";
import GitHubActivity from "@/components/widgets/GitHubActivity";
import TaskChecklist from "@/components/widgets/TaskChecklist";
import QuickActions from "@/components/widgets/QuickActions";
import ActionInbox from "@/components/widgets/ActionInbox";
import VercelDeploys from "@/components/widgets/VercelDeploys";
import Weather from "@/components/widgets/Weather";
import Spotify from "@/components/widgets/Spotify";

export default function ProjectsWorkspace() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
      padding: 10,
      height: "100%",
    }}>
      {/* Col 1: Projects + Weather + Spotify */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <ActiveProjects style={{ flex: 1 }} />
        <Weather style={{ flex: "0 0 auto" }} />
        <Spotify style={{ flex: "0 0 auto" }} />
      </div>

      {/* Col 2: GitHub + Vercel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <GitHubActivity style={{ flex: 1 }} />
        <VercelDeploys style={{ flex: 1 }} />
      </div>

      {/* Col 3: Tasks + Quick Access + Capture */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <TaskChecklist style={{ flex: 1 }} />
        <QuickActions style={{ flex: "0 0 auto" }} />
        <ActionInbox label="Capture" style={{ flex: "0 0 auto" }} />
      </div>
    </div>
  );
}
