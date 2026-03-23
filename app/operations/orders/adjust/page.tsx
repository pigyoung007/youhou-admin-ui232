"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Clock, CheckCircle2, XCircle, ArrowDownUp, ArrowUp, ArrowDown, Ban, Eye, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdjustRecord {
  id: string
  orderId: string
  customer: string
  adjustType: "increase" | "decrease" | "cancel"
  originalAmount: number
  adjustAmount: number
  adjustedAmount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  applicant: string
  approver: string
  applyTime: string
  approveTime: string
}

const adjustRecords: AdjustRecord[] = [
  { id: "ADJ001", orderId: "ORD202501001", customer: "刘女士", adjustType: "increase", originalAmount: 18800, adjustAmount: 2000, adjustedAmount: 20800, reason: "加班5天服务费", status: "approved", applicant: "张顾问", approver: "王部长", applyTime: "2025-01-20 10:00", approveTime: "2025-01-20 14:00" },
  { id: "ADJ002", orderId: "ORD202501002", customer: "陈先生", adjustType: "decrease", originalAmount: 3800, adjustAmount: -500, adjustedAmount: 3300, reason: "服务项目调整，减少2次", status: "pending", applicant: "李顾问", approver: "", applyTime: "2025-01-22 09:30", approveTime: "" },
  { id: "ADJ003", orderId: "ORD202501005", customer: "孙女士", adjustType: "cancel", originalAmount: 15000, adjustAmount: -15000, adjustedAmount: 0, reason: "客户计划变更，取消订单", status: "approved", applicant: "李顾问", approver: "王部长", applyTime: "2025-01-06 11:00", approveTime: "2025-01-06 16:00" },
  { id: "ADJ004", orderId: "ORD202501014", customer: "何女士", adjustType: "decrease", originalAmount: 6800, adjustAmount: -800, adjustedAmount: 6000, reason: "优惠券抵扣", status: "rejected", applicant: "张顾问", approver: "财务确认", applyTime: "2025-01-15 14:00", approveTime: "2025-01-15 17:00" },
  { id: "ADJ005", orderId: "ORD202501004", customer: "赵女士", adjustType: "increase", originalAmount: 32000, adjustAmount: 3000, adjustedAmount: 35000, reason: "延长服务10天", status: "pending", applicant: "张顾问", approver: "", applyTime: "2025-01-23 08:00", approveTime: "" },
]

const adjustTypeConfig = {
  increase: { label: "调增", color: "bg-blue-100 text-blue-700 border-blue-200", icon: ArrowUp },
  decrease: { label: "调减", color: "bg-amber-100 text-amber-700 border-amber-200", icon: ArrowDown },
  cancel: { label: "取消", color: "bg-red-100 text-red-700 border-red-200", icon: Ban },
}

const statusConfig = {
  pending: { label: "待审批", color: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已通过", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "已驳回", color: "bg-red-100 text-red-600 border-red-200" },
}

export default function OrderAdjustPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const stats = useMemo(() => ({
    total: adjustRecords.length,
    pending: adjustRecords.filter(r => r.status === "pending").length,
    approved: adjustRecords.filter(r => r.status === "approved").length,
    rejected: adjustRecords.filter(r => r.status === "rejected").length,
  }), [])

  const filtered = useMemo(() => {
    return adjustRecords.filter(r => {
      const matchTab = activeTab === "all" || r.status === activeTab
      const matchSearch = !searchTerm || r.orderId.includes(searchTerm) || r.customer.includes(searchTerm)
      return matchTab && matchSearch
    })
  }, [activeTab, searchTerm])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">订单调整</h1>
            <p className="text-xs text-muted-foreground">管理订单金额调整、取消等变更申请</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建调整</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm flex items-center gap-2"><ArrowDownUp className="h-4 w-4" />订单调整申请</DialogTitle>
                <DialogDescription className="text-xs">调整后需经部门负责人及财务确认后生效</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">关联订单号</Label>
                  <Input placeholder="请输入订单号" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">调整类型</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择调整类型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">调增金额</SelectItem>
                      <SelectItem value="decrease">调减金额</SelectItem>
                      <SelectItem value="cancel">取消订单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">调整金额</Label>
                  <Input type="number" placeholder="请输入金额" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">调整原因</Label>
                  <Textarea placeholder="请详细说明调整原因..." className="text-xs min-h-[80px]" />
                </div>
              </div>
              <DialogFooter>
                <Button size="sm" className="text-xs">提交审批</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-muted"><ArrowDownUp className="h-3.5 w-3.5" /></div><div><p className="text-sm font-bold">{stats.total}</p><p className="text-[10px] text-muted-foreground">全部调整</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div><div><p className="text-sm font-bold">{stats.pending}</p><p className="text-[10px] text-muted-foreground">待审批</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div><div><p className="text-sm font-bold">{stats.approved}</p><p className="text-[10px] text-muted-foreground">已通过</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-red-100"><XCircle className="h-3.5 w-3.5 text-red-600" /></div><div><p className="text-sm font-bold">{stats.rejected}</p><p className="text-[10px] text-muted-foreground">已驳回</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待审批 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs h-6">已通过 ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs h-6">已驳回 ({stats.rejected})</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索订单号/客户..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-24">申请编号</TableHead>
                    <TableHead className="text-xs w-28">关联订单</TableHead>
                    <TableHead className="text-xs">客户</TableHead>
                    <TableHead className="text-xs">调整类型</TableHead>
                    <TableHead className="text-xs">原金额</TableHead>
                    <TableHead className="text-xs">调整金额</TableHead>
                    <TableHead className="text-xs">调整后</TableHead>
                    <TableHead className="text-xs">原因</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">申请人/时间</TableHead>
                    <TableHead className="text-xs w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(record => {
                    const TypeIcon = adjustTypeConfig[record.adjustType].icon
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-[10px] text-muted-foreground">{record.id}</TableCell>
                        <TableCell className="font-mono text-[10px] text-primary">{record.orderId}</TableCell>
                        <TableCell className="text-xs">{record.customer}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", adjustTypeConfig[record.adjustType].color)}>
                            <TypeIcon className="h-3 w-3 mr-0.5" />
                            {adjustTypeConfig[record.adjustType].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">¥{record.originalAmount.toLocaleString()}</TableCell>
                        <TableCell className={cn("text-xs font-bold", record.adjustAmount > 0 ? "text-blue-600" : "text-red-600")}>
                          {record.adjustAmount > 0 ? "+" : ""}{record.adjustAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-bold">¥{record.adjustedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground max-w-[120px] truncate" title={record.reason}>{record.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[record.status].color)}>
                            {statusConfig[record.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">{record.applicant}</p>
                          <p className="text-[10px] text-muted-foreground">{record.applyTime.split(" ")[0]}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-0.5" />详情</Button>
                            {record.status === "pending" && (
                              <Button size="sm" className="h-6 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />审批</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filtered.length} / {adjustRecords.length} 条记录
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
