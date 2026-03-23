import { AdminLayout } from "@/components/admin/admin-layout"
import { LeadsTable } from "@/components/scrm/leads-table"

export default function LeadsPage() {
  return (
    <AdminLayout>
      <LeadsTable />
    </AdminLayout>
  )
}
