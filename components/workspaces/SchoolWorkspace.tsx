import Assignments from "@/components/widgets/Assignments";
import CollegeTracker from "@/components/widgets/CollegeTracker";
import ActionInbox from "@/components/widgets/ActionInbox";
import TaskChecklist from "@/components/widgets/TaskChecklist";

export default function SchoolWorkspace() {
  return (
    <div className="h-full p-4 grid gap-4" style={{
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "1fr",
    }}>
      <Assignments />
      <CollegeTracker />
      <div className="flex flex-col gap-4">
        <TaskChecklist />
        <ActionInbox label="School Inbox" />
      </div>
    </div>
  );
}
