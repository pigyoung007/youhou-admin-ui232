"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Gift, TrendingUp, TrendingDown, Award, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

const stats = [
  { title: "已发放积分", value: "128,500", change: "+12.5%", trend: "up" },
  { title: "已兑换积分", value: "86,200", change: "+8.3%", trend: "up" },
  { title: "待兑换积分", value: "42,300", change: "-5.2%", trend: "down" },
  { title: "本月新增", value: "15,800", change: "+25.6%", trend: "up" },
]

const customers = [
  { id: 1, name: "刘女士", phone: "138****5678", points: 5680, level: "黄金", orders: 5, lastActive: "今天" },
  { id: 2, name: "王女士", phone: "137****9876", points: 3250, level: "白银", orders: 3, lastActive: "昨天" },
  { id: 3, name: "陈先生", phone: "139****1234", points: 8920, level: "钻石", orders: 8, lastActive: "3天前" },
  { id: 4, name: "赵女士", phone: "135****4567", points: 1580, level: "普通", orders: 2, lastActive: "1周前" },
]

const recentRecords = [
  { id: 1, customer: "刘女士", type: "earn", points: 580, reason: "月嫂服务订单", time: "今天 14:30" },
  { id: 2, customer: "陈先生", type: "redeem", points: 1000, reason: "兑换产康体验券", time: "今天 11:20" },
  { id: 3, customer: "王女士", type: "earn", points: 320, reason: "推荐新客户", time: "昨天 16:45" },
  { id: 4, customer: "赵女士", type: "earn", points: 150, reason: "评价奖励", time: "昨天 09:30" },
]

const levelColors = {
  "普通": "bg-gray-100 text-gray-700 border-gray-200",
  "白银": "bg-slate-100 text-slate-700 border-slate-200",
  "黄金": "bg-amber-100 text-amber-700 border-amber-200",
  "钻石": "bg-blue-100 text-blue-700 border-blue-200",
}

export default function PointsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">积分管理</h1>
              <p className="text-muted-foreground">管理客户积分与兑换</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Gift className="h-4 w-4 mr-2" />
                兑换商品
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                手动赠送
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Customer Points */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-base font-semibold">客户积分</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索客户..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {customer.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{customer.name}</span>
                          <Badge variant="outline" className={levelColors[customer.level as keyof typeof levelColors]}>
                            {customer.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.phone} · {customer.orders}单 · {customer.lastActive}活跃</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-primary">
                          <Award className="h-4 w-4" />
                          {customer.points.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">积分</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">最近记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${record.type === "earn" ? "bg-emerald-100" : "bg-rose-100"}`}>
                        {record.type === "earn" ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{record.customer}</span>
                          <span className={`text-sm font-semibold ${record.type === "earn" ? "text-emerald-600" : "text-rose-600"}`}>
                            {record.type === "earn" ? "+" : "-"}{record.points}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{record.reason}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{record.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
