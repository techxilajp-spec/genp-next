import { UsersSection } from "@/components/users-section"
import { MobileHeader } from '@/components/mobile-header'

export default function UsersPage() {
  return (
    <>
      <MobileHeader title="Users" />
      <div className="p-4 lg:p-6">
        <UsersSection />
      </div>
    </>
  )
}