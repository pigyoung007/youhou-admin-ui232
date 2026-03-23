"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PieChart, TrendingUp, DollarSign, ShoppingCart, Users, Download, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const overviewData = {
  totalOrders: 18,
  totalAmount: 186800,
  paidAmount: 162200,
  avgOrderAmount: 10378,
  completedRate: 33.3,
  cancelRate: 11.1,
}

const consultantRanking = [
  { name: "张顾问", orders: 8, amount: 82600, commission: 8260, paidRate: 92 },
  { name: "李顾问", orders: 6, amount: 64400, commission: 6440, paidRate: 88 },
  { name: "王顾问", orders: 4, amount: 39800, commission: 3980, paidRate: 95 },
]

const serviceTypeStats = [
  { type: "月嫂服务", count: 8, amount: 109400, percentage: 58.6, color: "bg-rose-500" },
  { type: "育婴服务", count: 6, amount: 45600, percentage: 24.4, color: "bg-cyan-500" },
  { type: "产康服务", count: 4, amount: 19600, percentage: 10.5, color: "bg-teal-500" },
]

const monthlyTrend = [
  { month: "2024-11", orders: 3, amount: 22800 },
  { month: "2024-12", orders: 5, amount: 45600 },
  { month: "2025-01", orders: 10, amount: 118400 },
]

export default function OrderStatsPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">订单统计</h1>
            <p className="text-xs text-muted-foreground">多维度订单数据统计与分析</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2025-01">
              <SelectTrigger className="w-32 h-7 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01">2025年1月</SelectItem>
                <SelectItem value="2024-12">2024年12月</SelectItem>
                <SelectItem value="2024-11">2024年11月</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />导出</Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-6 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-primary/10"><ShoppingCart className="h-3.5 w-3.5 text-primary" /></div>
              <span className="text-[10px] text-muted-foreground">订单总数</span>
            </div>
            <p className="text-lg font-bold">{overviewData.totalOrders}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-[10px] text-muted-foreground">订单总额</span>
            </div>
            <p className="text-lg font-bold">¥{(overviewData.totalAmount / 10000).toFixed(1)}<span className="text-xs font-normal">万</span></p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-blue-100"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /></div>
              <span className="text-[10px] text-muted-foreground">实收金额</span>
            </div>
            <p className="text-lg font-bold">¥{(overviewData.paidAmount / 10000).toFixed(1)}<span className="text-xs font-normal">万</span></p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-amber-100"><PieChart className="h-3.5 w-3.5 text-amber-600" /></div>
              <span className="text-[10px] text-muted-foreground">平均客单价</span>
            </div>
            <p className="text-lg font-bold">¥{overviewData.avgOrderAmount.toLocaleString()}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-emerald-100"><TrendingUp className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-[10px] text-muted-foreground">完成率</span>
            </div>
            <p className="text-lg font-bold">{overviewData.completedRate}<span className="text-xs font-normal">%</span></p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-red-100"><TrendingUp className="h-3.5 w-3.5 text-red-600" /></div>
              <span className="text-[10px] text-muted-foreground">取消率</span>
            </div>
            <p className="text-lg font-bold">{overviewData.cancelRate}<span className="text-xs font-normal">%</span></p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Service Type Distribution */}
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">服务类型分布</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {serviceTypeStats.map(item => (
                  <div key={item.type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{item.type}</span>
                      <span className="text-muted-foreground">{item.count}单 / ¥{item.amount.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">月度趋势</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">月份</TableHead>
                    <TableHead className="text-xs">订单数</TableHead>
                    <TableHead className="text-xs">订单金额</TableHead>
                    <TableHead className="text-xs">环比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTrend.map((m, i) => {
                    const prev = i > 0 ? monthlyTrend[i - 1].amount : 0
                    const growth = prev > 0 ? ((m.amount - prev) / prev * 100).toFixed(1) : "-"
                    return (
                      <TableRow key={m.month}>
                        <TableCell className="text-xs">{m.month}</TableCell>
                        <TableCell className="text-xs font-medium">{m.orders}</TableCell>
                        <TableCell className="text-xs font-bold text-primary">¥{m.amount.toLocaleString()}</TableCell>
                        <TableCell className={cn("text-xs font-medium", typeof growth === "string" ? "" : Number(growth) > 0 ? "text-emerald-600" : "text-red-600")}>
                          {growth === "-" ? "-" : `${Number(growth) > 0 ? "+" : ""}${growth}%`}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Consultant Ranking */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" />顾问业绩排行</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs w-12">排名</TableHead>
                  <TableHead className="text-xs">顾问</TableHead>
                  <TableHead className="text-xs">订单数</TableHead>
                  <TableHead className="text-xs">订单总额</TableHead>
                  <TableHead className="text-xs">佣金</TableHead>
                  <TableHead className="text-xs">回款率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultantRanking.map((c, i) => (
                  <TableRow key={c.name}>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] h-5 w-5 justify-center p-0",
                        i === 0 ? "bg-amber-100 text-amber-700 border-amber-200" :
                        i === 1 ? "bg-gray-100 text-gray-700 border-gray-200" :
                        "bg-orange-50 text-orange-700 border-orange-200"
                      )}>{i + 1}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs">{c.orders}单</TableCell>
                    <TableCell className="text-xs font-bold text-primary">¥{c.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-emerald-600">¥{c.commission.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.paidRate}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{c.paidRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
