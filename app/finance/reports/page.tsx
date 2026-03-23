import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, Download } from "lucide-react"

const stats = [
  { title: "本月收入", value: "¥258,600", change: "+15.2%", trend: "up", icon: DollarSign },
  { title: "本月支出", value: "¥145,800", change: "+8.5%", trend: "up", icon: CreditCard },
  { title: "净利润", value: "¥112,800", change: "+23.1%", trend: "up", icon: Wallet },
  { title: "待收款", value: "¥86,400", change: "-5.2%", trend: "down", icon: PiggyBank },
]

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">财务报表</h1>
            <p className="text-muted-foreground">2025年10月财务概览</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-lg md:text-2xl font-bold mt-1">{stat.value}</p>
                      <div
                        className={`flex items-center gap-1 mt-2 text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">收入构成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "月嫂服务", value: "¥158,000", percent: 61 },
                  { name: "产康服务", value: "¥62,400", percent: 24 },
                  { name: "培训收入", value: "¥38,200", percent: 15 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">支出构成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "人员薪资", value: "¥98,500", percent: 68 },
                  { name: "运营成本", value: "¥32,100", percent: 22 },
                  { name: "其他支出", value: "¥15,200", percent: 10 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
