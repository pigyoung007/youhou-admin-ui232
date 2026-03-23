import { AdminLayout } from "@/components/admin/admin-layout"
import { SchedulingCalendar } from "@/components/scheduling/scheduling-calendar"

export default function SchedulingPage() {
  return (
    <AdminLayout>
      <SchedulingCalendar />
    </AdminLayout>
  )
}
