"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PieChart, TrendingUp, DollarSign, GraduationCap, Users, Download, Calendar, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const overviewData = {
  totalOrders: 18,
  totalAmount: 48600,
  paidAmount: 42100,
  avgOrderAmount: 2700,
  completedRate: 28,
  enrollmentRate: 85,
}

const courseStats = [
  { course: "高级月嫂培训", count: 6, amount: 22800, percentage: 46.9, color: "bg-rose-500" },
  { course: "产康师培训", count: 5, amount: 14000, percentage: 28.8, color: "bg-teal-500" },
  { course: "育婴师培训", count: 4, amount: 10000, percentage: 20.6, color: "bg-cyan-500" },
  { course: "催乳师培训", count: 3, amount: 1800, percentage: 3.7, color: "bg-amber-500" },
]

const instructorRanking = [
  { name: "王老师", students: 8, amount: 22800, passRate: 96 },
  { name: "李老师", students: 6, amount: 14000, passRate: 92 },
  { name: "陈老师", students: 4, amount: 10000, passRate: 88 },
]

export default function EduOrderStatsPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-lg font-bold">培训订单统计</h1><p className="text-xs text-muted-foreground">培训订单数据统计与分析</p></div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2025-01"><SelectTrigger className="w-32 h-7 text-xs"><Calendar className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2025-01">2025年1月</SelectItem><SelectItem value="2024-12">2024年12月</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />导出</Button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-primary/10"><GraduationCap className="h-3.5 w-3.5 text-primary" /></div><span className="text-[10px] text-muted-foreground">订单总数</span></div><p className="text-lg font-bold">{overviewData.totalOrders}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div><span className="text-[10px] text-muted-foreground">总额</span></div><p className="text-lg font-bold">¥{(overviewData.totalAmount / 10000).toFixed(1)}<span className="text-xs font-normal">万</span></p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-blue-100"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /></div><span className="text-[10px] text-muted-foreground">实收</span></div><p className="text-lg font-bold">¥{(overviewData.paidAmount / 10000).toFixed(1)}<span className="text-xs font-normal">万</span></p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-amber-100"><PieChart className="h-3.5 w-3.5 text-amber-600" /></div><span className="text-[10px] text-muted-foreground">客单价</span></div><p className="text-lg font-bold">¥{overviewData.avgOrderAmount}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-emerald-100"><TrendingUp className="h-3.5 w-3.5 text-emerald-600" /></div><span className="text-[10px] text-muted-foreground">结业率</span></div><p className="text-lg font-bold">{overviewData.completedRate}<span className="text-xs font-normal">%</span></p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-blue-100"><Users className="h-3.5 w-3.5 text-blue-600" /></div><span className="text-[10px] text-muted-foreground">到课率</span></div><p className="text-lg font-bold">{overviewData.enrollmentRate}<span className="text-xs font-normal">%</span></p></Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4"><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4" />课程分布</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {courseStats.map(item => (
                  <div key={item.course} className="space-y-1">
                    <div className="flex items-center justify-between text-xs"><span>{item.course}</span><span className="text-muted-foreground">{item.count}单 / ¥{item.amount.toLocaleString()} ({item.percentage}%)</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} /></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 px-4"><CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" />讲师业绩排行</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="text-xs w-12">排名</TableHead><TableHead className="text-xs">讲师</TableHead><TableHead className="text-xs">学员数</TableHead><TableHead className="text-xs">金额</TableHead><TableHead className="text-xs">通过率</TableHead></TableRow></TableHeader>
                <TableBody>
                  {instructorRanking.map((c, i) => (
                    <TableRow key={c.name}>
                      <TableCell><Badge variant="outline" className={cn("text-[10px] h-5 w-5 justify-center p-0", i === 0 ? "bg-amber-100 text-amber-700 border-amber-200" : i === 1 ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-orange-50 text-orange-700 border-orange-200")}>{i + 1}</Badge></TableCell>
                      <TableCell className="text-xs font-medium">{c.name}</TableCell>
                      <TableCell className="text-xs">{c.students}人</TableCell>
                      <TableCell className="text-xs font-bold text-primary">¥{c.amount.toLocaleString()}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.passRate}%` }} /></div><span className="text-[10px]">{c.passRate}%</span></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
