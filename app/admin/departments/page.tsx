import { DepartmentsSection } from '@/components/departments-section'
import { MobileHeader } from '@/components/mobile-header'

export default function DepartmentsPage() {
  return (
    <>
      <MobileHeader title="Department Details" />
      <div className="p-4 lg:p-6">
        <DepartmentsSection />
      </div>
    </>
  )
}
