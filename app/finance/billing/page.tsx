import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, FileText } from "lucide-react"

const bills = [
  { id: "INV202510001", customer: "刘女士", amount: "¥28,800", status: "paid", date: "2025-10-15", method: "微信支付" },
  { id: "INV202510002", customer: "陈先生", amount: "¥4,800", status: "pending", date: "2025-10-18", method: "-" },
  { id: "INV202510003", customer: "王女士", amount: "¥9,600", status: "paid", date: "2025-09-01", method: "银行转账" },
  {
    id: "INV202510004",
    customer: "赵女士",
    amount: "¥26,000",
    status: "partial",
    date: "2025-10-01",
    method: "支付宝",
  },
]

const statusMap = {
  pending: { label: "待付款", color: "bg-amber-100 text-amber-700 border-amber-200" },
  partial: { label: "部分付款", color: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已付款", color: "bg-green-100 text-green-700 border-green-200" },
}

export default function BillingPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">账单管理</h1>
            <p className="text-muted-foreground">查看和管理客户账单</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索账单..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{bill.id}</span>
                        <Badge variant="outline" className={statusMap[bill.status as keyof typeof statusMap].color}>
                          {statusMap[bill.status as keyof typeof statusMap].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {bill.customer} · {bill.date} · {bill.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{bill.amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
