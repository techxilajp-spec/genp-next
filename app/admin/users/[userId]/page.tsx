import { UserTaskDetails } from "@/components/user-task-details"
import { MobileHeader } from '@/components/mobile-header'

interface UserTaskPageProps {
  params: {
    userId: string
  }
}

export default function UserTaskPage({ params }: UserTaskPageProps) {
  return (
    <>
      <MobileHeader title="User Tasks" />
      <div className="p-4 lg:p-6">
        <UserTaskDetails userId={params.userId} />
      </div>
    </>
  )
}
