"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft, Calendar, Download, CheckCircle, DollarSign, Clock,
  AlertCircle, Eye, Upload, Edit, GraduationCap, Baby, FileText,
  ChevronRight, TrendingUp, Users
} from "lucide-react"
import { SalaryDetailDialog } from "@/components/finance/salary-detail-dialog"

// ========== 顾问薪资结算数据 ==========
interface ConsultantSalaryRecord {
  id: string
  name: string
  role: "职业顾问" | "母婴顾问"
  department: string
  baseSalary: number
  commission: number
  bonus: number
  deductions: number
  adjustment: number
  adjustmentReason?: string
  finalPayout: number
  status: "auto_generated" | "consultant_confirmed" | "supervisor_approved" | "finance_approved" | "paid"
  generatedDate: string
  period: string
}

const consultantRecords: ConsultantSalaryRecord[] = [
  { id: "CS001", name: "陈秀英", role: "职业顾问", department: "销售一部", baseSalary: 5000, commission: 5000, bonus: 2450, deductions: 620, adjustment: 0, finalPayout: 11830, status: "consultant_confirmed", generatedDate: "2025-01-15", period: "2025-01" },
  { id: "CS002", name: "赵丽娜", role: "职业顾问", department: "销售一部", baseSalary: 5000, commission: 3800, bonus: 1800, deductions: 620, adjustment: 500, adjustmentReason: "额外培训带教补贴", finalPayout: 10480, status: "supervisor_approved", generatedDate: "2025-01-15", period: "2025-01" },
  { id: "CS003", name: "王晓芳", role: "母婴顾问", department: "母婴部", baseSalary: 5500, commission: 6200, bonus: 2100, deductions: 620, adjustment: 0, finalPayout: 13180, status: "auto_generated", generatedDate: "2025-01-15", period: "2025-01" },
  { id: "CS004", name: "李婷婷", role: "母婴顾问", department: "母婴部", baseSalary: 5500, commission: 4800, bonus: 1500, deductions: 620, adjustment: -300, adjustmentReason: "客户投诉扣款", finalPayout: 10880, status: "finance_approved", generatedDate: "2025-01-15", period: "2025-01" },
  { id: "CS005", name: "孙悦", role: "职业顾问", department: "销售二部", baseSalary: 5000, commission: 4200, bonus: 1950, deductions: 620, adjustment: 0, finalPayout: 10530, status: "paid", generatedDate: "2025-01-15", period: "2025-01" },
  { id: "CS006", name: "周敏", role: "母婴顾问", department: "母婴部", baseSalary: 5500, commission: 7500, bonus: 2800, deductions: 620, adjustment: 200, adjustmentReason: "带新人奖励", finalPayout: 15380, status: "paid", generatedDate: "2025-01-15", period: "2025-01" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  auto_generated: { label: "已生成", className: "bg-muted text-muted-foreground border-border" },
  consultant_confirmed: { label: "顾问已确认", className: "bg-blue-100 text-blue-700 border-blue-200" },
  supervisor_approved: { label: "主管已审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
  finance_approved: { label: "财务已审核", className: "bg-purple-100 text-purple-700 border-purple-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function ConsultantSalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showAdjustDialog, setShowAdjustDialog] = useState(false)
  const [adjustRecord, setAdjustRecord] = useState<ConsultantSalaryRecord | null>(null)

  const filteredRecords = consultantRecords.filter(r => {
    if (selectedRole !== "all" && r.role !== selectedRole) return false
    if (selectedStatus !== "all" && r.status !== selectedStatus) return false
    return true
  })

  const summaryData = {
    totalPayout: filteredRecords.reduce((sum, r) => sum + r.finalPayout, 0),
    totalCommission: filteredRecords.reduce((sum, r) => sum + r.commission, 0),
    pendingCount: filteredRecords.filter(r => !["paid", "finance_approved"].includes(r.status)).length,
    paidCount: filteredRecords.filter(r => r.status === "paid").length,
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/finance/payroll" className="hover:text-foreground transition-colors">薪资结算</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">职业顾问薪资结算</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">职业顾问薪资结算</h1>
            <p className="text-sm text-muted-foreground mt-1">顾问薪资 = 基本工资(每月5号发放) + 佣金提成(每月15号生成)，系统每月自动生成结算单</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              导出结算单
            </Button>
            <Button disabled={selectedRecords.length === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />
              批量审核
            </Button>
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
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="顾问类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部顾问</SelectItem>
                  <SelectItem value="职业顾问">职业顾问</SelectItem>
                  <SelectItem value="母婴顾问">母婴顾问</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="审核状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="auto_generated">已生成</SelectItem>
                  <SelectItem value="consultant_confirmed">顾问已确认</SelectItem>
                  <SelectItem value="supervisor_approved">主管已审核</SelectItem>
                  <SelectItem value="finance_approved">财务已审核</SelectItem>
                  <SelectItem value="paid">已发放</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><DollarSign className="h-5 w-5 text-primary" /></div>
                <div className="min-w-0"><div className="text-xs text-muted-foreground">应发总额</div><div className="text-lg font-semibold">¥{(summaryData.totalPayout / 10000).toFixed(1)}万</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0"><TrendingUp className="h-5 w-5 text-amber-600" /></div>
                <div className="min-w-0"><div className="text-xs text-muted-foreground">佣金总额</div><div className="text-lg font-semibold">¥{(summaryData.totalCommission / 10000).toFixed(1)}万</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0"><Clock className="h-5 w-5 text-blue-600" /></div>
                <div className="min-w-0"><div className="text-xs text-muted-foreground">待审核</div><div className="text-lg font-semibold">{summaryData.pendingCount}人</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 shrink-0"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
                <div className="min-w-0"><div className="text-xs text-muted-foreground">已发放</div><div className="text-lg font-semibold">{summaryData.paidCount}人</div></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Flow */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              <span className="text-muted-foreground shrink-0">审批流程:</span>
              {["系统自动生成", "顾问确认(可调整)", "部门主管审核", "财务确认", "薪资发放"].map((step, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <span className="px-2 py-1 rounded bg-primary/5 border border-primary/15 font-medium whitespace-nowrap">{step}</span>
                  {i < 4 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-0.5" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/30">
                <TableHead className="w-10">
                  <input type="checkbox" className="h-4 w-4 rounded border-border" onChange={(e) => setSelectedRecords(e.target.checked ? filteredRecords.map(r => r.id) : [])} />
                </TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>部门</TableHead>
                <TableHead className="text-right">底薪</TableHead>
                <TableHead className="text-right">佣金提成</TableHead>
                <TableHead className="text-right">奖励</TableHead>
                <TableHead className="text-right">扣款</TableHead>
                <TableHead className="text-center">调整</TableHead>
                <TableHead className="text-right">实发金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => {
                const config = statusConfig[record.status]
                return (
                  <TableRow key={record.id} className="group">
                    <TableCell>
                      <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => setSelectedRecords(prev => prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id])} className="h-4 w-4 rounded border-border" />
                    </TableCell>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={record.role === "母婴顾问" ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                        {record.role === "母婴顾问" ? <Baby className="h-3 w-3 mr-1" /> : <GraduationCap className="h-3 w-3 mr-1" />}
                        {record.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{record.department}</TableCell>
                    <TableCell className="text-right">¥{record.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-amber-600 font-medium">¥{record.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-emerald-600">+¥{record.bonus.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-500">-¥{record.deductions.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      {record.adjustment !== 0 ? (
                        <span className={`font-medium ${record.adjustment > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {record.adjustment > 0 ? "+" : ""}¥{record.adjustment.toLocaleString()}
                        </span>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setAdjustRecord(record); setShowAdjustDialog(true) }}>
                          <Edit className="h-3 w-3 mr-1" />调整
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">¥{record.finalPayout.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className={config.className}>{config.label}</Badge></TableCell>
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
        </Card>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 shadow-lg z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-sm text-muted-foreground">已选择 <span className="font-medium text-foreground">{selectedRecords.length}</span> 条记录</div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent"><Download className="mr-2 h-4 w-4" />导出银行文件</Button>
              <Button disabled={selectedRecords.length === 0}><CheckCircle className="mr-2 h-4 w-4" />批量审核</Button>
            </div>
          </div>
        </div>
        <div className="h-20" />

        {/* 调整弹窗 */}
        <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>薪资调整</DialogTitle>
              <DialogDescription>录入调整金额和原因，正数为调增，负数为调减</DialogDescription>
            </DialogHeader>
            {adjustRecord && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium">{adjustRecord.name} - {adjustRecord.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">当前实发: ¥{adjustRecord.finalPayout.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label>调整金额 (元)</Label>
                  <Input type="number" placeholder="正数调增，负数调减" />
                </div>
                <div className="space-y-2">
                  <Label>调整原因</Label>
                  <Textarea placeholder="请填写调整原因" />
                </div>
                <div className="space-y-2">
                  <Label>附件材料</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">拖拽文件到此处或点击上传</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setShowAdjustDialog(false)}>取消</Button>
              <Button onClick={() => setShowAdjustDialog(false)}>提交调整</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SalaryDetailDialog open={showDetailDialog} onOpenChange={setShowDetailDialog} />
      </div>
    </AdminLayout>
  )
}
