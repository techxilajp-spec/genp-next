import { CategoriesSection } from "@/components/categories-section"
import { MobileHeader } from '@/components/mobile-header'

export default function CategoriesPage() {
  return (
    <>
      <MobileHeader title="Categories" />
      <div className="p-4 lg:p-6">
        <CategoriesSection />
      </div>
    </>
  )
}