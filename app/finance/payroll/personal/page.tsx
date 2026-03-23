"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Calendar, Download, DollarSign, ChevronRight, TrendingUp,
  TrendingDown, Eye, Award, Clock, FileText
} from "lucide-react"
import { SalaryDetailDialog } from "@/components/finance/salary-detail-dialog"

// ========== 个人薪资记录 ==========
interface PersonalSalaryMonth {
  month: string
  baseSalary: number
  commission: number
  bonus: number
  deductions: number
  adjustment: number
  finalPayout: number
  status: "pending" | "approved" | "paid"
  payDate?: string
}

const personalRecords: PersonalSalaryMonth[] = [
  { month: "2025-01", baseSalary: 5000, commission: 5000, bonus: 2450, deductions: 620, adjustment: 0, finalPayout: 11830, status: "paid", payDate: "2025-01-28" },
  { month: "2024-12", baseSalary: 5000, commission: 4200, bonus: 1800, deductions: 620, adjustment: 300, finalPayout: 10680, status: "paid", payDate: "2024-12-28" },
  { month: "2024-11", baseSalary: 5000, commission: 5800, bonus: 2600, deductions: 620, adjustment: 0, finalPayout: 12780, status: "paid", payDate: "2024-11-28" },
  { month: "2024-10", baseSalary: 5000, commission: 3500, bonus: 1200, deductions: 620, adjustment: -200, finalPayout: 8880, status: "paid", payDate: "2024-10-28" },
  { month: "2024-09", baseSalary: 5000, commission: 4800, bonus: 2100, deductions: 620, adjustment: 0, finalPayout: 11280, status: "paid", payDate: "2024-09-28" },
  { month: "2024-08", baseSalary: 5000, commission: 6200, bonus: 3000, deductions: 620, adjustment: 500, finalPayout: 14080, status: "paid", payDate: "2024-08-28" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待发放", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function PersonalSalaryPage() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const totalPaid = personalRecords.filter(r => r.status === "paid").reduce((s, r) => s + r.finalPayout, 0)
  const avgSalary = Math.round(totalPaid / personalRecords.filter(r => r.status === "paid").length)
  const maxSalary = Math.max(...personalRecords.map(r => r.finalPayout))
  const totalCommission = personalRecords.reduce((s, r) => s + r.commission, 0)

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/finance/payroll" className="hover:text-foreground transition-colors">薪资结算</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">个人薪资查看</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">个人薪资查看</h1>
            <p className="text-sm text-muted-foreground mt-1">查看个人所有已发放的薪资情况，支持佣金明细导出</p>
          </div>
          <Button variant="outline" className="bg-transparent"><Download className="h-4 w-4 mr-2" />导出薪资明细</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><DollarSign className="h-5 w-5 text-primary" /></div>
                <div><div className="text-xs text-muted-foreground">累计收入</div><div className="text-lg font-semibold">¥{(totalPaid / 10000).toFixed(1)}万</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
                <div><div className="text-xs text-muted-foreground">月均薪资</div><div className="text-lg font-semibold">¥{avgSalary.toLocaleString()}</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0"><Award className="h-5 w-5 text-amber-600" /></div>
                <div><div className="text-xs text-muted-foreground">最高月薪</div><div className="text-lg font-semibold">¥{maxSalary.toLocaleString()}</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 shrink-0"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
                <div><div className="text-xs text-muted-foreground">累计佣金</div><div className="text-lg font-semibold">¥{(totalCommission / 10000).toFixed(1)}万</div></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary trend bars */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">薪资趋势</CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025年</SelectItem>
                  <SelectItem value="2024">2024年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {personalRecords.slice().reverse().map((r, i) => {
                const height = (r.finalPayout / maxSalary) * 100
                const monthLabel = r.month.split("-")[1] + "月"
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">¥{(r.finalPayout / 1000).toFixed(1)}k</span>
                    <div className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{ height: `${height}%` }} />
                    <span className="text-xs text-muted-foreground">{monthLabel}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">薪资发放记录</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead>月份</TableHead>
                  <TableHead className="text-right">底薪</TableHead>
                  <TableHead className="text-right">佣金提成</TableHead>
                  <TableHead className="text-right">奖励</TableHead>
                  <TableHead className="text-right">扣款</TableHead>
                  <TableHead className="text-right">调整</TableHead>
                  <TableHead className="text-right">实发金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发放日期</TableHead>
                  <TableHead className="w-16">详情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personalRecords.map((r, i) => {
                  const config = statusConfig[r.status]
                  const prevRecord = personalRecords[i + 1]
                  const trend = prevRecord ? r.finalPayout - prevRecord.finalPayout : 0
                  return (
                    <TableRow key={r.month}>
                      <TableCell className="font-medium">{r.month}</TableCell>
                      <TableCell className="text-right">¥{r.baseSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-amber-600 font-medium">¥{r.commission.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-emerald-600">+¥{r.bonus.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-500">-¥{r.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {r.adjustment !== 0 ? (
                          <span className={r.adjustment > 0 ? "text-emerald-600" : "text-red-500"}>
                            {r.adjustment > 0 ? "+" : ""}¥{r.adjustment.toLocaleString()}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold text-primary">¥{r.finalPayout.toLocaleString()}</span>
                          {trend !== 0 && (
                            <span className={`text-xs flex items-center ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
                              {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={config.className + " text-xs"}>{config.label}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.payDate || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetailDialog(true)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <SalaryDetailDialog open={showDetailDialog} onOpenChange={setShowDetailDialog} />
      </div>
    </AdminLayout>
  )
}
