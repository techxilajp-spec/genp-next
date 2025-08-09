import { AdminUserManagement } from "@/components/admin-user-management"
import { MobileHeader } from '@/components/mobile-header'

export default function AdminUsersPage() {
  return (
    <>
      <MobileHeader title="Admin User Management" />
      <div className="p-4 lg:p-6">
        <AdminUserManagement />
      </div>
    </>
  )
}
