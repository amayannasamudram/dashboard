import Assignments from "@/components/widgets/Assignments";
import CollegeTracker from "@/components/widgets/CollegeTracker";
import ActionInbox from "@/components/widgets/ActionInbox";
import TaskChecklist from "@/components/widgets/TaskChecklist";
import Grades from "@/components/widgets/Grades";
import Calendar from "@/components/widgets/Calendar";

export default function SchoolWorkspace() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
      padding: 10,
      height: "100%",
    }}>
      <Assignments style={{ height: "100%" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <Grades style={{ flex: 1 }} />
        <CollegeTracker style={{ flex: 1 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <Calendar style={{ flex: "0 0 auto" }} />
        <TaskChecklist style={{ flex: 1 }} />
        <ActionInbox label="School Inbox" style={{ flex: "0 0 auto" }} />
      </div>
    </div>
  );
}
