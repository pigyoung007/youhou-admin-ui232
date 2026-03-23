"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Clock, CheckCircle2, XCircle, ArrowDownUp, ArrowUp, ArrowDown, Ban, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdjustRecord {
  id: string
  orderId: string
  student: string
  adjustType: "increase" | "decrease" | "cancel"
  originalAmount: number
  adjustAmount: number
  adjustedAmount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  applicant: string
  applyTime: string
}

const adjustRecords: AdjustRecord[] = [
  { id: "EADJ001", orderId: "EDU202501001", student: "李春华", adjustType: "increase", originalAmount: 3800, adjustAmount: 500, adjustedAmount: 4300, reason: "增加办证费用", status: "approved", applicant: "张顾问", applyTime: "2025-01-20 10:00" },
  { id: "EADJ002", orderId: "EDU202501003", student: "张美玲", adjustType: "decrease", originalAmount: 2500, adjustAmount: -300, adjustedAmount: 2200, reason: "老学员优惠", status: "pending", applicant: "王顾问", applyTime: "2025-01-22 09:30" },
  { id: "EADJ003", orderId: "EDU202501005", student: "周小燕", adjustType: "cancel", originalAmount: 2800, adjustAmount: -2800, adjustedAmount: 0, reason: "学员因个人原因退学", status: "approved", applicant: "李顾问", applyTime: "2025-01-18 14:00" },
]

const adjustTypeConfig = {
  increase: { label: "调增", color: "bg-blue-100 text-blue-700 border-blue-200", icon: ArrowUp },
  decrease: { label: "调减", color: "bg-amber-100 text-amber-700 border-amber-200", icon: ArrowDown },
  cancel: { label: "退学", color: "bg-red-100 text-red-700 border-red-200", icon: Ban },
}

const statusConfig = {
  pending: { label: "待审批", color: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已通过", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "已驳回", color: "bg-red-100 text-red-600 border-red-200" },
}

export default function EduOrderAdjustPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = useMemo(() => {
    return adjustRecords.filter(r => {
      const matchTab = activeTab === "all" || r.status === activeTab
      const matchSearch = !searchTerm || r.orderId.includes(searchTerm) || r.student.includes(searchTerm)
      return matchTab && matchSearch
    })
  }, [activeTab, searchTerm])

  const stats = { total: adjustRecords.length, pending: adjustRecords.filter(r => r.status === "pending").length, approved: adjustRecords.filter(r => r.status === "approved").length, rejected: adjustRecords.filter(r => r.status === "rejected").length }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">培训订单调整</h1>
            <p className="text-xs text-muted-foreground">管理培训订单金额调整、退学等变更申请</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建调整</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm flex items-center gap-2"><ArrowDownUp className="h-4 w-4" />培训订单调整</DialogTitle>
                <DialogDescription className="text-xs">调整后需经部门负责人确认后生效</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5"><Label className="text-xs">关联订单号</Label><Input placeholder="请输入订单号" className="h-8 text-xs" /></div>
                <div className="space-y-1.5"><Label className="text-xs">调整类型</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="increase">调增金额</SelectItem><SelectItem value="decrease">调减金额</SelectItem><SelectItem value="cancel">退学取消</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">调整金额</Label><Input type="number" className="h-8 text-xs" /></div>
                <div className="space-y-1.5"><Label className="text-xs">调整原因</Label><Textarea className="text-xs min-h-[80px]" /></div>
              </div>
              <DialogFooter><Button size="sm" className="text-xs">提交审批</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-muted"><ArrowDownUp className="h-3.5 w-3.5" /></div><div><p className="text-sm font-bold">{stats.total}</p><p className="text-[10px] text-muted-foreground">全部</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div><div><p className="text-sm font-bold">{stats.pending}</p><p className="text-[10px] text-muted-foreground">待审批</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div><div><p className="text-sm font-bold">{stats.approved}</p><p className="text-[10px] text-muted-foreground">已通过</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-red-100"><XCircle className="h-3.5 w-3.5 text-red-600" /></div><div><p className="text-sm font-bold">{stats.rejected}</p><p className="text-[10px] text-muted-foreground">已驳回</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待审批</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs h-6">已通过</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs h-6">已驳回</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">编号</TableHead>
                    <TableHead className="text-xs">订单号</TableHead>
                    <TableHead className="text-xs">学员</TableHead>
                    <TableHead className="text-xs">类型</TableHead>
                    <TableHead className="text-xs">原金额</TableHead>
                    <TableHead className="text-xs">调整</TableHead>
                    <TableHead className="text-xs">调整后</TableHead>
                    <TableHead className="text-xs">原因</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(r => {
                    const TypeIcon = adjustTypeConfig[r.adjustType].icon
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-[10px]">{r.id}</TableCell>
                        <TableCell className="font-mono text-[10px] text-primary">{r.orderId}</TableCell>
                        <TableCell className="text-xs">{r.student}</TableCell>
                        <TableCell><Badge variant="outline" className={cn("text-[10px] h-5", adjustTypeConfig[r.adjustType].color)}><TypeIcon className="h-3 w-3 mr-0.5" />{adjustTypeConfig[r.adjustType].label}</Badge></TableCell>
                        <TableCell className="text-xs">¥{r.originalAmount.toLocaleString()}</TableCell>
                        <TableCell className={cn("text-xs font-bold", r.adjustAmount > 0 ? "text-blue-600" : "text-red-600")}>{r.adjustAmount > 0 ? "+" : ""}{r.adjustAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-bold">¥{r.adjustedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground max-w-[100px] truncate">{r.reason}</TableCell>
                        <TableCell><Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[r.status].color)}>{statusConfig[r.status].label}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-0.5" />详情</Button>
                            {r.status === "pending" && <Button size="sm" className="h-6 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />审批</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
