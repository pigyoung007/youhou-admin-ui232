"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
  Calendar, Download, CheckCircle, DollarSign, Clock,
  AlertCircle, Eye, Settings, GraduationCap, Baby, Stethoscope,
  Home, ChevronRight, TrendingUp, Users, FileText, Layers,
  User, BarChart3, ArrowRight
} from "lucide-react"
import { SalaryDetailDialog } from "@/components/finance/salary-detail-dialog"

// ========== 三级入口配置 ==========
const subPages = [
  {
    id: "consultant",
    title: "职业顾问/母婴顾问薪资结算",
    desc: "顾问薪资 = 基本工资 + 佣金提成。系统每月自动生成结算单，经主管及财务审核后发放。",
    href: "/finance/payroll/consultant",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
    stats: { total: "7.2万", pending: 2, paid: 4 },
  },
  {
    id: "technician",
    title: "技师薪资结算",
    desc: "技师薪资 = 底薪 + 业绩提成 + 手工提成。支持按产康项目查看手工费明细。",
    href: "/finance/payroll/technician",
    icon: Stethoscope,
    color: "bg-pink-100 text-pink-600",
    stats: { total: "2.5万", pending: 1, paid: 1 },
  },
  {
    id: "domestic",
    title: "家政员薪资结算",
    desc: "月嫂/育婴师按天数计薪。逢8日(8/18/28)自动生成结算单并提交财务确认。",
    href: "/finance/payroll",
    icon: Home,
    color: "bg-emerald-100 text-emerald-600",
    stats: { total: "9.8万", pending: 3, paid: 5 },
  },
  {
    id: "commission",
    title: "佣金结算管理",
    desc: "基于订单流程完成情况和分佣规则，自动计算各角色应得佣金。支持跨城市多角色佣金拆分。",
    href: "/finance/payroll/commission",
    icon: Layers,
    color: "bg-amber-100 text-amber-600",
    stats: { total: "3.2万", pending: 1, paid: 1 },
  },
  {
    id: "personal",
    title: "个人薪资查看",
    desc: "查看个人所有已发放薪资情况，支持佣金明细导出。",
    href: "/finance/payroll/personal",
    icon: User,
    color: "bg-purple-100 text-purple-600",
    stats: { total: "11.8万", pending: 0, paid: 6 },
  },
]

// ========== 总览数据 ==========
interface PayrollRecord {
  id: string
  name: string
  role: string
  roleIcon: typeof Users
  attendanceDays: number
  baseSalary: number
  commission: number
  deductions: number
  adjustment: number
  finalPayout: number
  status: "pending" | "approved" | "paid"
}

const mockPayroll: PayrollRecord[] = [
  { id: "P001", name: "王美丽", role: "月嫂", roleIcon: Home, attendanceDays: 26, baseSalary: 10000, commission: 0, deductions: 0, adjustment: 0, finalPayout: 10000, status: "pending" },
  { id: "P002", name: "李芳芳", role: "产康师", roleIcon: Stethoscope, attendanceDays: 22, baseSalary: 4000, commission: 3200, deductions: 400, adjustment: 200, finalPayout: 7000, status: "approved" },
  { id: "P003", name: "张晓红", role: "月嫂", roleIcon: Home, attendanceDays: 28, baseSalary: 12800, commission: 0, deductions: 0, adjustment: 0, finalPayout: 12800, status: "paid" },
  { id: "P004", name: "陈秀英", role: "职业顾问", roleIcon: GraduationCap, attendanceDays: 23, baseSalary: 5000, commission: 5000, deductions: 620, adjustment: 0, finalPayout: 11830, status: "pending" },
  { id: "P005", name: "王晓芳", role: "母婴顾问", roleIcon: Baby, attendanceDays: 25, baseSalary: 5500, commission: 6200, deductions: 620, adjustment: 0, finalPayout: 13180, status: "approved" },
  { id: "P006", name: "张莉莉", role: "产康师", roleIcon: Stethoscope, attendanceDays: 24, baseSalary: 4000, commission: 3200, deductions: 420, adjustment: 0, finalPayout: 8630, status: "paid" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")

  const summaryData = {
    totalPayout: mockPayroll.reduce((sum, r) => sum + r.finalPayout, 0),
    pendingCount: mockPayroll.filter((r) => r.status === "pending").length,
    paidCount: mockPayroll.filter((r) => r.status === "paid").length,
    totalPeople: mockPayroll.length,
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">薪资结算</h1>
            <p className="text-sm text-muted-foreground mt-1">管理全部角色的薪资结算、佣金分成和审批发放</p>
          </div>
          <div className="flex gap-2">
            <Link href="/finance/salary-engine">
              <Button variant="outline" className="bg-transparent"><Settings className="h-4 w-4 mr-2" />薪资引擎配置</Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><DollarSign className="h-5 w-5 text-primary" /></div><div><div className="text-xs text-muted-foreground">应发总额</div><div className="text-lg font-semibold">¥{(summaryData.totalPayout / 10000).toFixed(1)}万</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0"><Users className="h-5 w-5 text-blue-600" /></div><div><div className="text-xs text-muted-foreground">结算人数</div><div className="text-lg font-semibold">{summaryData.totalPeople}人</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0"><Clock className="h-5 w-5 text-amber-600" /></div><div><div className="text-xs text-muted-foreground">待审核</div><div className="text-lg font-semibold">{summaryData.pendingCount}人</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 shrink-0"><CheckCircle className="h-5 w-5 text-emerald-600" /></div><div><div className="text-xs text-muted-foreground">已发放</div><div className="text-lg font-semibold">{summaryData.paidCount}人</div></div></div></CardContent></Card>
        </div>

        {/* Sub-page Navigation Cards */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">薪资结算模块</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subPages.map((page) => {
              const Icon = page.icon
              return (
                <Link key={page.id} href={page.href}>
                  <Card className="hover:border-primary/30 transition-all hover:shadow-md cursor-pointer h-full group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${page.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{page.title}</h3>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{page.desc}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="text-primary font-medium">¥{page.stats.total}</span>
                            {page.stats.pending > 0 && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">待审{page.stats.pending}</Badge>}
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">已发{page.stats.paid}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Table - All Roles */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-base">本月结算总览</CardTitle>
                <CardDescription className="text-xs mt-0.5">所有角色当月薪资快速预览</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-44 pl-9 h-8 text-sm" />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="角色" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部角色</SelectItem>
                    <SelectItem value="月嫂">月嫂</SelectItem>
                    <SelectItem value="产康师">产康师</SelectItem>
                    <SelectItem value="职业顾问">职业顾问</SelectItem>
                    <SelectItem value="母婴顾问">母婴顾问</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="bg-transparent h-8"><Download className="h-3.5 w-3.5 mr-1" />导出</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="w-10">
                      <input type="checkbox" className="h-4 w-4 rounded border-border" onChange={(e) => setSelectedRecords(e.target.checked ? mockPayroll.map(r => r.id) : [])} />
                    </TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead className="text-right">出勤</TableHead>
                    <TableHead className="text-right">底薪/工资</TableHead>
                    <TableHead className="text-right">提成</TableHead>
                    <TableHead className="text-right">扣款</TableHead>
                    <TableHead className="text-right">实发</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-16">明细</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayroll.filter(r => selectedRole === "all" || r.role === selectedRole).map((record) => {
                    const config = statusConfig[record.status]
                    const RoleIcon = record.roleIcon
                    return (
                      <TableRow key={record.id} className="group">
                        <TableCell>
                          <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => setSelectedRecords(prev => prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id])} className="h-4 w-4 rounded border-border" />
                        </TableCell>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs gap-1"><RoleIcon className="h-3 w-3" />{record.role}</Badge></TableCell>
                        <TableCell className="text-right">{record.attendanceDays}天</TableCell>
                        <TableCell className="text-right">¥{record.baseSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-amber-600">{record.commission > 0 ? `+¥${record.commission.toLocaleString()}` : "-"}</TableCell>
                        <TableCell className="text-right text-red-500">{record.deductions > 0 ? `-¥${record.deductions.toLocaleString()}` : "-"}</TableCell>
                        <TableCell className="text-right font-bold text-primary">¥{record.finalPayout.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="outline" className={config.className + " text-xs"}>{config.label}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetailDialog(true)}><Eye className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 shadow-lg z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-sm text-muted-foreground">已选择 <span className="font-medium text-foreground">{selectedRecords.length}</span> 条记录</div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent"><Download className="mr-2 h-4 w-4" />导出银行文件</Button>
              <Button variant="outline" className="bg-transparent" disabled={selectedRecords.length === 0} onClick={() => { setApprovalAction("reject"); setShowApprovalDialog(true); }}><AlertCircle className="mr-2 h-4 w-4" />驳回</Button>
              <Button variant="outline" className="bg-transparent" disabled={selectedRecords.length === 0} onClick={() => { setApprovalAction("approve"); setShowApprovalDialog(true); }}><CheckCircle className="mr-2 h-4 w-4" />批量审核</Button>
              <Button disabled={selectedRecords.length === 0} onClick={() => setShowPaymentDialog(true)}><DollarSign className="mr-2 h-4 w-4" />批量发放</Button>
            </div>
          </div>
        </div>
        <div className="h-20" />

        <SalaryDetailDialog open={showDetailDialog} onOpenChange={setShowDetailDialog} />

        {/* 审批对话框 */}
        <ApprovalDialog 
          open={showApprovalDialog} 
          onOpenChange={setShowApprovalDialog}
          action={approvalAction}
          selectedCount={selectedRecords.length}
          selectedRecords={mockPayroll.filter(r => selectedRecords.includes(r.id))}
          onConfirm={() => {
            setShowApprovalDialog(false)
            setSelectedRecords([])
          }}
        />

        {/* 发放对话框 */}
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          selectedCount={selectedRecords.length}
          selectedRecords={mockPayroll.filter(r => selectedRecords.includes(r.id))}
          onConfirm={() => {
            setShowPaymentDialog(false)
            setSelectedRecords([])
          }}
        />
      </div>
    </AdminLayout>
  )
}

// ========== 审批对话框组件 ==========
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function ApprovalDialog({ 
  open, 
  onOpenChange, 
  action,
  selectedCount,
  selectedRecords,
  onConfirm
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  action: "approve" | "reject"
  selectedCount: number
  selectedRecords: PayrollRecord[]
  onConfirm: () => void
}) {
  const [remark, setRemark] = useState("")
  const isApprove = action === "approve"
  const totalAmount = selectedRecords.reduce((sum, r) => sum + r.finalPayout, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <><CheckCircle className="h-5 w-5 text-green-600" />批量审核通过</>
            ) : (
              <><AlertCircle className="h-5 w-5 text-red-600" />批量驳回</>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApprove ? "确认审核通过后，薪资单将进入待发放状态" : "驳回后将返回给相关人员重新核对"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">选中人数</span>
              <span className="font-medium">{selectedCount}人</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">涉及金额</span>
              <span className="font-medium text-primary tabular-nums">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          {selectedRecords.length > 0 && selectedRecords.length <= 5 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">选中人员</Label>
              <div className="space-y-1">
                {selectedRecords.map(r => (
                  <div key={r.id} className="flex justify-between items-center p-2 rounded bg-muted/30 text-sm">
                    <span>{r.name} <span className="text-muted-foreground text-xs">({r.role})</span></span>
                    <span className="tabular-nums">¥{r.finalPayout.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>{isApprove ? "审批备注（可选）" : "驳回原因（必填）"}</Label>
            <Textarea 
              placeholder={isApprove ? "请输入审批备注..." : "请输入驳回原因..."} 
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button 
            variant={isApprove ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={!isApprove && !remark}
          >
            {isApprove ? "确认审核" : "确认驳回"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ========== 发放对话框组件 ==========
function PaymentDialog({ 
  open, 
  onOpenChange,
  selectedCount,
  selectedRecords,
  onConfirm
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  selectedRecords: PayrollRecord[]
  onConfirm: () => void
}) {
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [confirmChecked, setConfirmChecked] = useState(false)
  const totalAmount = selectedRecords.reduce((sum, r) => sum + r.finalPayout, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            批量发放薪资
          </DialogTitle>
          <DialogDescription>
            确认发放后将生成付款指令并通知财务执行
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">发放人数</span>
              <span className="font-medium">{selectedCount}人</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">发放总额</span>
              <span className="text-2xl font-bold text-primary tabular-nums">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>发放方式</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">银行转账</SelectItem>
                <SelectItem value="wechat">微信转账</SelectItem>
                <SelectItem value="alipay">支付宝转账</SelectItem>
                <SelectItem value="cash">现金发放</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">发放前请确认：</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>- 所有薪资单已完成审核</li>
                  <li>- 银行账户信息准确无误</li>
                  <li>- 公司账户余额充足</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="confirm-payment"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="confirm-payment" className="text-sm cursor-pointer">
              我已确认以上信息无误，同意执行发放
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button 
            onClick={onConfirm}
            disabled={!confirmChecked}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            确认发放
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
