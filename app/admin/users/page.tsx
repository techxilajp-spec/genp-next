import { UserProductivitySection } from "@/components/user-productivity-section"
import { MobileHeader } from '@/components/mobile-header'

export default function UsersPage() {
  return (
    <>
      <MobileHeader title="User Productivity" />
      <div className="p-4 lg:p-6">
        <UserProductivitySection />
      </div>
    </>
  )
}
