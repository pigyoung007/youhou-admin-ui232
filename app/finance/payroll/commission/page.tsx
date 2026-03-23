"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Calendar, Download, CheckCircle, DollarSign, ChevronRight,
  TrendingUp, Users, Eye, ArrowRight, Layers, Search, FileText,
  Globe, AlertCircle, Clock
} from "lucide-react"

// ========== 佣金结算记录 ==========
interface CommissionRecord {
  id: string
  orderId: string
  clientName: string
  serviceType: string
  orderAmount: number
  nodes: {
    nodeName: string
    participantName: string
    participantRole: string
    city: string
    weight: number
    amount: number
    status: "calculated" | "confirmed" | "paid"
  }[]
  totalCommission: number
  settlementDate: string
  status: "pending" | "settled" | "paid"
}

const commissionRecords: CommissionRecord[] = [
  {
    id: "CM001", orderId: "ORD-20250108-001", clientName: "张女士", serviceType: "月嫂服务(五星)", orderAmount: 14800,
    nodes: [
      { nodeName: "客源开发", participantName: "王小明", participantRole: "数据专员", city: "上海", weight: 10, amount: 1480, status: "confirmed" },
      { nodeName: "需求匹配", participantName: "陈秀英", participantRole: "职业顾问", city: "上海", weight: 15, amount: 2220, status: "confirmed" },
      { nodeName: "签约成交", participantName: "陈秀英", participantRole: "职业顾问", city: "上海", weight: 25, amount: 3700, status: "calculated" },
      { nodeName: "服务执行", participantName: "王美丽", participantRole: "月嫂", city: "上海", weight: 30, amount: 4440, status: "calculated" },
      { nodeName: "售后跟进", participantName: "陈秀英", participantRole: "职业顾问", city: "上海", weight: 10, amount: 1480, status: "calculated" },
    ],
    totalCommission: 13320, settlementDate: "2025-01-15", status: "pending",
  },
  {
    id: "CM002", orderId: "ORD-20250110-003", clientName: "李先生", serviceType: "育婴师服务(高级)", orderAmount: 8000,
    nodes: [
      { nodeName: "客源开发", participantName: "张小红", participantRole: "数据专员", city: "北京", weight: 10, amount: 800, status: "paid" },
      { nodeName: "需求匹配", participantName: "王晓芳", participantRole: "母婴顾问", city: "上海", weight: 15, amount: 1200, status: "paid" },
      { nodeName: "签约成交", participantName: "王晓芳", participantRole: "母婴顾问", city: "上海", weight: 25, amount: 2000, status: "paid" },
      { nodeName: "服务执行", participantName: "赵春兰", participantRole: "育婴师", city: "北京", weight: 30, amount: 2400, status: "paid" },
      { nodeName: "回款确认", participantName: "李财务", participantRole: "财务", city: "上海", weight: 10, amount: 800, status: "paid" },
    ],
    totalCommission: 7200, settlementDate: "2025-01-15", status: "paid",
  },
  {
    id: "CM003", orderId: "ORD-20250112-005", clientName: "赵女士", serviceType: "产康套餐", orderAmount: 12800,
    nodes: [
      { nodeName: "客源开发", participantName: "王小明", participantRole: "数据专员", city: "上海", weight: 10, amount: 1280, status: "confirmed" },
      { nodeName: "需求匹配", participantName: "李婷婷", participantRole: "母婴顾问", city: "上海", weight: 15, amount: 1920, status: "confirmed" },
      { nodeName: "签约成交", participantName: "李婷婷", participantRole: "母婴顾问", city: "上海", weight: 25, amount: 3200, status: "confirmed" },
      { nodeName: "服务执行", participantName: "张莉莉", participantRole: "产康技师", city: "上海", weight: 30, amount: 3840, status: "calculated" },
      { nodeName: "售后跟进", participantName: "李婷婷", participantRole: "母婴顾问", city: "上海", weight: 10, amount: 1280, status: "calculated" },
    ],
    totalCommission: 11520, settlementDate: "2025-01-15", status: "settled",
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待结算", className: "bg-amber-100 text-amber-700 border-amber-200" },
  settled: { label: "已结算", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

const nodeStatusConfig: Record<string, { label: string; className: string }> = {
  calculated: { label: "已计算", className: "bg-muted text-muted-foreground" },
  confirmed: { label: "已确认", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paid: { label: "已发放", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function CommissionSettlementPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [showTraceDialog, setShowTraceDialog] = useState(false)
  const [traceRecord, setTraceRecord] = useState<CommissionRecord | null>(null)

  const summaryData = {
    totalCommission: commissionRecords.reduce((s, r) => s + r.totalCommission, 0),
    totalOrders: commissionRecords.length,
    pendingCount: commissionRecords.filter(r => r.status === "pending").length,
    paidCount: commissionRecords.filter(r => r.status === "paid").length,
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/finance/payroll" className="hover:text-foreground transition-colors">薪资结算</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">佣金结算管理</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">佣金结算管理</h1>
            <p className="text-sm text-muted-foreground mt-1">基于订单数据、服务流程完成情况及分佣规则，自动计算各参与角色应得佣金</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent"><Download className="h-4 w-4 mr-2" />导出结算清单</Button>
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
                <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="服务类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="yuesao">月嫂服务</SelectItem>
                  <SelectItem value="yuyingshi">育婴师服务</SelectItem>
                  <SelectItem value="techkang">产康服务</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="结算状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待结算</SelectItem>
                  <SelectItem value="settled">已结算</SelectItem>
                  <SelectItem value="paid">已发放</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索订单号/客户名..." className="pl-9" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><DollarSign className="h-5 w-5 text-primary" /></div><div><div className="text-xs text-muted-foreground">佣金总额</div><div className="text-lg font-semibold">¥{(summaryData.totalCommission / 10000).toFixed(1)}万</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0"><FileText className="h-5 w-5 text-blue-600" /></div><div><div className="text-xs text-muted-foreground">结算订单</div><div className="text-lg font-semibold">{summaryData.totalOrders}单</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0"><Clock className="h-5 w-5 text-amber-600" /></div><div><div className="text-xs text-muted-foreground">待结算</div><div className="text-lg font-semibold">{summaryData.pendingCount}单</div></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 shrink-0"><CheckCircle className="h-5 w-5 text-emerald-600" /></div><div><div className="text-xs text-muted-foreground">已发放</div><div className="text-lg font-semibold">{summaryData.paidCount}单</div></div></div></CardContent></Card>
        </div>

        {/* Commission Records */}
        <div className="space-y-4">
          {commissionRecords.map(record => {
            const isExpanded = expandedRecord === record.id
            const config = statusConfig[record.status]
            return (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpandedRecord(isExpanded ? null : record.id)}>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.clientName}</span>
                          <Badge variant="outline" className="text-xs">{record.serviceType}</Badge>
                          <Badge variant="outline" className={config.className + " text-xs"}>{config.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>订单号: {record.orderId}</span>
                          <span>结算日: {record.settlementDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-muted-foreground">订单金额</div>
                        <div className="font-medium">¥{record.orderAmount.toLocaleString()}</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-muted-foreground">参与人数</div>
                        <div className="font-medium">{new Set(record.nodes.map(n => n.participantName)).size}人</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">佣金总额</div>
                        <div className="text-lg font-bold text-primary">¥{record.totalCommission.toLocaleString()}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setTraceRecord(record); setShowTraceDialog(true) }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded: Node details */}
                  {isExpanded && (
                    <div className="border-t bg-muted/10 p-4">
                      <h4 className="text-sm font-medium mb-3">各环节佣金分配明细</h4>
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent bg-muted/20">
                            <TableHead>环节</TableHead>
                            <TableHead>参与人</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>城市</TableHead>
                            <TableHead className="text-right">权重</TableHead>
                            <TableHead className="text-right">佣金金额</TableHead>
                            <TableHead>状态</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {record.nodes.map((node, i) => {
                            const nConfig = nodeStatusConfig[node.status]
                            return (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{node.nodeName}</TableCell>
                                <TableCell>{node.participantName}</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">{node.participantRole}</Badge></TableCell>
                                <TableCell className="text-muted-foreground text-sm"><Globe className="h-3 w-3 inline mr-1" />{node.city}</TableCell>
                                <TableCell className="text-right">{node.weight}%</TableCell>
                                <TableCell className="text-right font-medium text-primary">¥{node.amount.toLocaleString()}</TableCell>
                                <TableCell><Badge variant="outline" className={nConfig.className + " text-xs"}>{nConfig.label}</Badge></TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trace Dialog */}
        <Dialog open={showTraceDialog} onOpenChange={setShowTraceDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>佣金计算追溯</DialogTitle>
              <DialogDescription>查看该订单佣金的详细计算过程与依据</DialogDescription>
            </DialogHeader>
            {traceRecord && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 p-1">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">订单号:</span> <span className="font-medium">{traceRecord.orderId}</span></div>
                      <div><span className="text-muted-foreground">客户:</span> <span className="font-medium">{traceRecord.clientName}</span></div>
                      <div><span className="text-muted-foreground">服务类型:</span> <span className="font-medium">{traceRecord.serviceType}</span></div>
                      <div><span className="text-muted-foreground">订单金额:</span> <span className="font-medium text-primary">¥{traceRecord.orderAmount.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">计算过程</h4>
                    {traceRecord.nodes.map((node, i) => (
                      <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{node.nodeName}</Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-sm">{node.participantName}</span>
                            <span className="text-xs text-muted-foreground">({node.participantRole})</span>
                          </div>
                          <span className="font-bold text-primary">¥{node.amount.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono">
                          {'计算公式: 订单金额(¥' + traceRecord.orderAmount.toLocaleString() + ') x 环节权重(' + node.weight + '%) = ¥' + node.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                    <span className="font-medium">佣金合计</span>
                    <span className="text-xl font-bold text-primary">¥{traceRecord.totalCommission.toLocaleString()}</span>
                  </div>
                </div>
              </ScrollArea>
            )}
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setShowTraceDialog(false)}>关闭</Button>
              <Button><Download className="h-4 w-4 mr-2" />导出明细</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
