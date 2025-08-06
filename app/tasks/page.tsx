import { TasksSection } from "@/components/tasks-section"
import { MobileHeader } from '@/components/mobile-header'

export default function TasksPage() {
  return (
    <>
      <MobileHeader title="Tasks" />
      <div className="p-4 lg:p-6">
        <TasksSection />
      </div>
    </>
  )
}