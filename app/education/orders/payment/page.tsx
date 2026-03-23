"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle2, Clock, Banknote, DollarSign, Link2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentRecord {
  id: string
  orderId: string
  student: string
  orderAmount: number
  amount: number
  paymentMethod: string
  paymentTime: string
  status: "confirmed" | "pending" | "unlinked"
  confirmedBy: string
  notes: string
}

const paymentRecords: PaymentRecord[] = [
  { id: "EPAY001", orderId: "EDU202501001", student: "李春华", orderAmount: 3800, amount: 3800, paymentMethod: "微信", paymentTime: "2025-01-10 14:30", status: "confirmed", confirmedBy: "财务-赵会计", notes: "全款" },
  { id: "EPAY002", orderId: "EDU202501002", student: "王秀兰", orderAmount: 2800, amount: 2800, paymentMethod: "支付宝", paymentTime: "2024-11-25 10:00", status: "confirmed", confirmedBy: "财务-赵会计", notes: "老学员介绍" },
  { id: "EPAY003", orderId: "EDU202501003", student: "张美玲", orderAmount: 2500, amount: 1250, paymentMethod: "微信", paymentTime: "2025-01-05 17:00", status: "confirmed", confirmedBy: "财务-赵会计", notes: "分期第1笔" },
  { id: "EPAY004", orderId: "EDU202501003", student: "张美玲", orderAmount: 2500, amount: 1250, paymentMethod: "微信", paymentTime: "2025-01-20 09:00", status: "pending", confirmedBy: "", notes: "分期第2笔" },
]

const statusConfig = {
  confirmed: { label: "已确认", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "待确认", color: "bg-amber-100 text-amber-700 border-amber-200" },
  unlinked: { label: "未关联", color: "bg-red-100 text-red-700 border-red-200" },
}

export default function EduOrderPaymentPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const stats = useMemo(() => ({
    total: paymentRecords.length,
    confirmed: paymentRecords.filter(r => r.status === "confirmed").length,
    pending: paymentRecords.filter(r => r.status === "pending").length,
    totalAmount: paymentRecords.reduce((s, r) => s + r.amount, 0),
  }), [])

  const filtered = useMemo(() => {
    return paymentRecords.filter(r => {
      const matchTab = activeTab === "all" || r.status === activeTab
      const matchSearch = !searchTerm || r.orderId.includes(searchTerm) || r.student.includes(searchTerm)
      return matchTab && matchSearch
    })
  }, [activeTab, searchTerm])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div><h1 className="text-lg font-bold">培训回款管理</h1><p className="text-xs text-muted-foreground">管理培训订单回款记录</p></div>

        <div className="grid grid-cols-4 gap-3">
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-muted"><Banknote className="h-3.5 w-3.5" /></div><div><p className="text-sm font-bold">{stats.total}</p><p className="text-[10px] text-muted-foreground">全部</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div><div><p className="text-sm font-bold">{stats.confirmed}</p><p className="text-[10px] text-muted-foreground">已确认</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div><div><p className="text-sm font-bold">{stats.pending}</p><p className="text-[10px] text-muted-foreground">待确认</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-primary/10"><DollarSign className="h-3.5 w-3.5 text-primary" /></div><div><p className="text-sm font-bold">¥{stats.totalAmount.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">回款总额</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
              <TabsTrigger value="confirmed" className="text-xs h-6">已确认</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待确认</TabsTrigger>
            </TabsList>
            <div className="relative"><Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="搜索..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          </div>
          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">流水号</TableHead>
                    <TableHead className="text-xs">订单号</TableHead>
                    <TableHead className="text-xs">学员</TableHead>
                    <TableHead className="text-xs">回款金额</TableHead>
                    <TableHead className="text-xs">方式</TableHead>
                    <TableHead className="text-xs">时间</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">确认人</TableHead>
                    <TableHead className="text-xs">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-[10px]">{r.id}</TableCell>
                      <TableCell className="font-mono text-[10px] text-primary">{r.orderId}</TableCell>
                      <TableCell className="text-xs">{r.student}</TableCell>
                      <TableCell className="text-xs font-bold text-primary">¥{r.amount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] h-5">{r.paymentMethod}</Badge></TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{r.paymentTime}</TableCell>
                      <TableCell><Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[r.status].color)}>{statusConfig[r.status].label}</Badge></TableCell>
                      <TableCell className="text-[10px]">{r.confirmedBy || "-"}</TableCell>
                      <TableCell>{r.status === "pending" && <Button size="sm" className="h-6 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />确认</Button>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
