import { DepartmentsDetailsSection } from '@/components/departments-details-section'
import { MobileHeader } from '@/components/mobile-header'

export default function DepartmentDetailsPage() {
  return (
    <>
      <MobileHeader title="Departments" />
      <div className="p-4 lg:p-6">
        <DepartmentsDetailsSection />
      </div>
    </>
  )
}
