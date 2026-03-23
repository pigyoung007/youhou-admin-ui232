"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Calendar, Download, CheckCircle, DollarSign, Clock, Eye,
  ChevronRight, TrendingUp, Stethoscope, AlertCircle
} from "lucide-react"

// ========== 技师薪资数据 ==========
interface TechnicianRecord {
  id: string
  name: string
  level: "试用期" | "转正"
  baseSalary: number
  performanceCommission: number
  handFee: number
  handFeeDetails: { project: string; count: number; unit: number; total: number }[]
  deductions: number
  finalPayout: number
  status: "pending" | "approved" | "paid"
  period: string
}

const techRecords: TechnicianRecord[] = [
  {
    id: "T001", name: "张莉莉", level: "转正", baseSalary: 4000, performanceCommission: 3200, handFee: 1850,
    handFeeDetails: [
      { project: "开奶", count: 8, unit: 30, total: 240 },
      { project: "乳腺疏通", count: 12, unit: 30, total: 360 },
      { project: "产后排毒发汗", count: 6, unit: 40, total: 240 },
      { project: "徒手骨盆修复", count: 10, unit: 25, total: 250 },
      { project: "盆底肌修复", count: 15, unit: 10, total: 150 },
      { project: "全身经络疏通", count: 8, unit: 20, total: 160 },
      { project: "扶阳补气太极灸", count: 10, unit: 20, total: 200 },
      { project: "外阴SPA", count: 5, unit: 30, total: 150 },
      { project: "圆肩驼背", count: 2, unit: 15, total: 30 },
      { project: "淋巴排毒", count: 3, unit: 15, total: 45 },
      { project: "疤痕套盒", count: 2.5, unit: 10, total: 25 },
    ],
    deductions: 420, finalPayout: 8630, status: "approved", period: "2025-01"
  },
  {
    id: "T002", name: "吴佳佳", level: "试用期", baseSalary: 3500, performanceCommission: 1800, handFee: 920,
    handFeeDetails: [
      { project: "开奶", count: 5, unit: 20, total: 100 },
      { project: "乳腺疏通", count: 8, unit: 20, total: 160 },
      { project: "产后排毒发汗", count: 4, unit: 25, total: 100 },
      { project: "盆底肌修复", count: 10, unit: 8, total: 80 },
      { project: "全身经络疏通", count: 6, unit: 15, total: 90 },
      { project: "扶阳补气太极灸", count: 8, unit: 15, total: 120 },
      { project: "宫廷滋养脐罐灸", count: 6, unit: 10, total: 60 },
      { project: "淋巴排毒", count: 5, unit: 10, total: 50 },
      { project: "外阴SPA", count: 3, unit: 20, total: 60 },
      { project: "私密粉嫩", count: 5, unit: 20, total: 100 },
    ],
    deductions: 350, finalPayout: 5870, status: "pending", period: "2025-01"
  },
  {
    id: "T003", name: "刘雅静", level: "转正", baseSalary: 4000, performanceCommission: 4500, handFee: 2400,
    handFeeDetails: [
      { project: "开奶", count: 10, unit: 30, total: 300 },
      { project: "乳腺疏通", count: 15, unit: 30, total: 450 },
      { project: "回奶/排残奶", count: 6, unit: 30, total: 180 },
      { project: "急慢性乳腺炎", count: 4, unit: 30, total: 120 },
      { project: "产后排毒发汗", count: 8, unit: 40, total: 320 },
      { project: "徒手骨盆修复", count: 12, unit: 25, total: 300 },
      { project: "腹直肌修复", count: 10, unit: 10, total: 100 },
      { project: "扶阳补气太极灸", count: 10, unit: 20, total: 200 },
      { project: "全身经络疏通", count: 8, unit: 20, total: 160 },
      { project: "外阴SPA", count: 6, unit: 30, total: 180 },
      { project: "私密粉嫩", count: 3, unit: 30, total: 90 },
    ],
    deductions: 420, finalPayout: 10480, status: "paid", period: "2025-01"
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function TechnicianSalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])

  const summaryData = {
    totalPayout: techRecords.reduce((s, r) => s + r.finalPayout, 0),
    totalHandFee: techRecords.reduce((s, r) => s + r.handFee, 0),
    totalPerformance: techRecords.reduce((s, r) => s + r.performanceCommission, 0),
    pendingCount: techRecords.filter(r => r.status === "pending").length,
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/finance/payroll" className="hover:text-foreground transition-colors">薪资结算</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">技师薪资结算</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">技师薪资结算</h1>
            <p className="text-sm text-muted-foreground mt-1">技师薪资 = 底薪 + 业绩提成 + 手工提成。底薪每月5号发放，提成每月15号生成。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent"><Download className="h-4 w-4 mr-2" />导出结算单</Button>
            <Button disabled={selectedRecords.length === 0}><CheckCircle className="h-4 w-4 mr-2" />批量审核</Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full md:w-44 pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="技师状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="试用期">试用期</SelectItem>
                  <SelectItem value="转正">转正</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><DollarSign className="h-5 w-5 text-primary" /></div><div><div className="text-xs text-muted-foreground">应发总额</div><div className="text-lg font-semibold">¥{(summaryData.totalPayout / 10000).toFixed(1)}万</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0"><Stethoscope className="h-5 w-5 text-amber-600" /></div><div><div className="text-xs text-muted-foreground">手工费总额</div><div className="text-lg font-semibold">¥{summaryData.totalHandFee.toLocaleString()}</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0"><TrendingUp className="h-5 w-5 text-blue-600" /></div><div><div className="text-xs text-muted-foreground">业绩提成总额</div><div className="text-lg font-semibold">¥{summaryData.totalPerformance.toLocaleString()}</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0"><AlertCircle className="h-5 w-5 text-red-600" /></div><div><div className="text-xs text-muted-foreground">待审核</div><div className="text-lg font-semibold">{summaryData.pendingCount}人</div></div></div></CardContent></Card>
        </div>

        {/* Technician Cards with expandable hand fee details */}
        <div className="space-y-4">
          {techRecords.map(record => {
            const isExpanded = expandedRecord === record.id
            const config = statusConfig[record.status]
            return (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Summary Row */}
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpandedRecord(isExpanded ? null : record.id)}>
                    <div className="flex items-center gap-4">
                      <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={(e) => { e.stopPropagation(); setSelectedRecords(prev => prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id]) }} className="h-4 w-4 rounded border-border" />
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Stethoscope className="h-5 w-5 text-primary" /></div>
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className={record.level === "试用期" ? "bg-amber-50 text-amber-700 border-amber-200 text-xs" : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"}>{record.level}</Badge>
                          <Badge variant="outline" className={config.className + " text-xs"}>{config.label}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-muted-foreground">底薪</div>
                        <div className="font-medium">¥{record.baseSalary.toLocaleString()}</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-muted-foreground">业绩提成</div>
                        <div className="font-medium text-amber-600">¥{record.performanceCommission.toLocaleString()}</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-muted-foreground">手工费</div>
                        <div className="font-medium text-blue-600">¥{record.handFee.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">实发</div>
                        <div className="text-lg font-bold text-primary">¥{record.finalPayout.toLocaleString()}</div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded: Hand fee details */}
                  {isExpanded && (
                    <div className="border-t bg-muted/10 p-4">
                      <Tabs defaultValue="handfee">
                        <TabsList className="bg-muted/50 h-8">
                          <TabsTrigger value="handfee" className="text-xs h-6">手工费明细</TabsTrigger>
                          <TabsTrigger value="summary" className="text-xs h-6">薪资汇总</TabsTrigger>
                        </TabsList>
                        <TabsContent value="handfee" className="mt-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent bg-muted/20">
                                <TableHead>项目名称</TableHead>
                                <TableHead className="text-right">服务次数</TableHead>
                                <TableHead className="text-right">单次手工费</TableHead>
                                <TableHead className="text-right">小计</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {record.handFeeDetails.map((d, i) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium text-sm">{d.project}</TableCell>
                                  <TableCell className="text-right">{d.count}次</TableCell>
                                  <TableCell className="text-right text-muted-foreground">¥{d.unit}</TableCell>
                                  <TableCell className="text-right font-medium text-primary">¥{d.total}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="bg-muted/30 font-medium">
                                <TableCell>手工费合计</TableCell>
                                <TableCell className="text-right">{record.handFeeDetails.reduce((s, d) => s + d.count, 0)}次</TableCell>
                                <TableCell />
                                <TableCell className="text-right text-primary font-bold">¥{record.handFee.toLocaleString()}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="summary" className="mt-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between p-2 rounded bg-muted/50"><span>底薪</span><span className="font-medium">¥{record.baseSalary.toLocaleString()}</span></div>
                              <div className="flex justify-between p-2 rounded bg-muted/50"><span>业绩提成</span><span className="font-medium text-amber-600">+¥{record.performanceCommission.toLocaleString()}</span></div>
                              <div className="flex justify-between p-2 rounded bg-muted/50"><span>手工提成</span><span className="font-medium text-blue-600">+¥{record.handFee.toLocaleString()}</span></div>
                              <div className="flex justify-between p-2 rounded bg-muted/50"><span>扣款</span><span className="font-medium text-red-500">-¥{record.deductions.toLocaleString()}</span></div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                                <div className="text-sm text-muted-foreground">实发工资</div>
                                <div className="text-3xl font-bold text-primary mt-1">¥{record.finalPayout.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sticky Bar */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 shadow-lg z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-sm text-muted-foreground">已选择 <span className="font-medium text-foreground">{selectedRecords.length}</span> 条记录</div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent"><Download className="mr-2 h-4 w-4" />导出结算单</Button>
              <Button disabled={selectedRecords.length === 0}><CheckCircle className="mr-2 h-4 w-4" />批量审核</Button>
            </div>
          </div>
        </div>
        <div className="h-20" />
      </div>
    </AdminLayout>
  )
}
