import { SupportPaymentsSection } from "@/components/support-payments-section"
import { MobileHeader } from '@/components/mobile-header'

export default function SupportPage() {
  return (
    <>
      <MobileHeader title="Support Payments" />
      <div className="p-4 lg:p-6">
        <SupportPaymentsSection />
      </div>
    </>
  )
}