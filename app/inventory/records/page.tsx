"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpCircle, ArrowDownCircle, Download, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

const records = [
  { 
    id: "REC202510001",
    type: "in",
    material: "婴儿纸尿裤(M)",
    quantity: 100,
    unit: "包",
    operator: "张管理",
    reason: "常规采购入库",
    time: "2025-10-20 14:30",
    batch: "BC202510001"
  },
  { 
    id: "REC202510002",
    type: "out",
    material: "产康按摩油",
    quantity: 5,
    unit: "瓶",
    operator: "李服务",
    reason: "服务消耗-王女士订单",
    time: "2025-10-20 11:20",
    batch: "BC202509012"
  },
  { 
    id: "REC202510003",
    type: "in",
    material: "月子餐食材包",
    quantity: 30,
    unit: "份",
    operator: "张管理",
    reason: "供应商补货",
    time: "2025-10-19 16:45",
    batch: "BC202510002"
  },
  { 
    id: "REC202510004",
    type: "out",
    material: "产妇卫生巾",
    quantity: 10,
    unit: "包",
    operator: "王服务",
    reason: "服务消耗-刘女士订单",
    time: "2025-10-19 09:30",
    batch: "BC202509008"
  },
  { 
    id: "REC202510005",
    type: "out",
    material: "婴儿湿巾",
    quantity: 20,
    unit: "包",
    operator: "李服务",
    reason: "服务消耗-陈先生订单",
    time: "2025-10-18 15:20",
    batch: "BC202509015"
  },
  { 
    id: "REC202510006",
    type: "in",
    material: "吸奶器配件",
    quantity: 25,
    unit: "套",
    operator: "张管理",
    reason: "紧急补货",
    time: "2025-10-18 10:00",
    batch: "BC202510003"
  },
]

const stats = [
  { title: "今日入库", value: 130, unit: "件", type: "in" },
  { title: "今日出库", value: 35, unit: "件", type: "out" },
  { title: "本月入库", value: 856, unit: "件", type: "in" },
  { title: "本月出库", value: 623, unit: "件", type: "out" },
]

export default function InventoryRecordsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">出入库记录</h1>
              <p className="text-muted-foreground">查看物料出入库历史</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索记录..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${stat.type === "in" ? "bg-emerald-50" : "bg-rose-50"}`}>
                    {stat.type === "in" ? (
                      <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}<span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span></p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Records List */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">记录明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.map((record) => (
                  <div 
                    key={record.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${record.type === "in" ? "bg-emerald-50" : "bg-rose-50"}`}>
                        {record.type === "in" ? (
                          <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{record.material}</span>
                          <Badge variant={record.type === "in" ? "default" : "secondary"}>
                            {record.type === "in" ? "入库" : "出库"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{record.reason}</p>
                        <p className="text-xs text-muted-foreground">批次: {record.batch}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0">
                      <div className="text-sm text-muted-foreground">
                        <p>{record.operator}</p>
                        <p className="text-xs">{record.time}</p>
                      </div>
                      <div className={`text-xl font-bold ${record.type === "in" ? "text-emerald-600" : "text-rose-600"}`}>
                        {record.type === "in" ? "+" : "-"}{record.quantity}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{record.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
