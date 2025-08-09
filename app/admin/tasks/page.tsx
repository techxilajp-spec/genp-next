import { TaskOverviewSection } from "@/components/task-overview-section"
import { MobileHeader } from '@/components/mobile-header'

export default function TasksPage() {
  return (
    <>
      <MobileHeader title="Task Analytics" />
      <div className="p-4 lg:p-6">
        <TaskOverviewSection />
      </div>
    </>
  )
}
