import { FinancialSection } from "@/components/financial-section"
import { MobileHeader } from '@/components/mobile-header'

export default function FinancialPage() {
  return (
    <>
      <MobileHeader title="Financial" />
      <div className="p-4 lg:p-6">
        <FinancialSection />
      </div>
    </>
  )
}