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
  customer: string
  orderAmount: number
  paidAmount: number
  pendingAmount: number
  paymentMethod: "微信" | "支付宝" | "银行转账" | "现金" | "系统"
  paymentTime: string
  amount: number
  status: "confirmed" | "pending" | "unlinked"
  confirmedBy: string
  notes: string
}

const paymentRecords: PaymentRecord[] = [
  { id: "PAY001", orderId: "ORD202501001", customer: "刘女士", orderAmount: 18800, paidAmount: 18800, pendingAmount: 0, paymentMethod: "微信", paymentTime: "2025-01-10 15:00", amount: 18800, status: "confirmed", confirmedBy: "财务-赵会计", notes: "全款到账" },
  { id: "PAY002", orderId: "ORD202501002", customer: "陈先生", orderAmount: 3800, paidAmount: 1900, pendingAmount: 1900, paymentMethod: "支付宝", paymentTime: "2025-01-18 10:00", amount: 1900, status: "confirmed", confirmedBy: "财务-赵会计", notes: "定金" },
  { id: "PAY003", orderId: "ORD202501004", customer: "赵女士", orderAmount: 32000, paidAmount: 32000, pendingAmount: 0, paymentMethod: "银行转账", paymentTime: "2024-12-20 12:00", amount: 32000, status: "confirmed", confirmedBy: "财务-赵会计", notes: "VIP全款" },
  { id: "PAY004", orderId: "ORD202501008", customer: "郑女士", orderAmount: 15000, paidAmount: 5000, pendingAmount: 10000, paymentMethod: "微信", paymentTime: "2025-01-16 15:00", amount: 5000, status: "confirmed", confirmedBy: "财务-赵会计", notes: "定金" },
  { id: "PAY005", orderId: "ORD202501014", customer: "何女士", orderAmount: 6800, paidAmount: 3400, pendingAmount: 3400, paymentMethod: "系统", paymentTime: "2025-01-06 10:00", amount: 3400, status: "confirmed", confirmedBy: "财务-赵会计", notes: "分期第1笔" },
  { id: "PAY006", orderId: "", customer: "", orderAmount: 0, paidAmount: 0, pendingAmount: 0, paymentMethod: "微信", paymentTime: "2025-01-21 14:30", amount: 7600, status: "unlinked", confirmedBy: "", notes: "未关联订单" },
  { id: "PAY007", orderId: "ORD202501002", customer: "陈先生", orderAmount: 3800, paidAmount: 1900, pendingAmount: 1900, paymentMethod: "微信", paymentTime: "2025-01-23 09:00", amount: 1900, status: "pending", confirmedBy: "", notes: "尾款待确认" },
]

const statusConfig = {
  confirmed: { label: "已确认", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "待确认", color: "bg-amber-100 text-amber-700 border-amber-200" },
  unlinked: { label: "未关联", color: "bg-red-100 text-red-700 border-red-200" },
}

export default function OrderPaymentPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const stats = useMemo(() => ({
    total: paymentRecords.length,
    confirmed: paymentRecords.filter(r => r.status === "confirmed").length,
    pending: paymentRecords.filter(r => r.status === "pending").length,
    unlinked: paymentRecords.filter(r => r.status === "unlinked").length,
    totalAmount: paymentRecords.reduce((s, r) => s + r.amount, 0),
  }), [])

  const filtered = useMemo(() => {
    return paymentRecords.filter(r => {
      const matchTab = activeTab === "all" || r.status === activeTab
      const matchSearch = !searchTerm || r.orderId.includes(searchTerm) || r.customer.includes(searchTerm)
      return matchTab && matchSearch
    })
  }, [activeTab, searchTerm])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold">回款管理</h1>
          <p className="text-xs text-muted-foreground">管理订单回款记录，支持手动关联回款与财务确认</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-muted"><Banknote className="h-3.5 w-3.5" /></div><div><p className="text-sm font-bold">{stats.total}</p><p className="text-[10px] text-muted-foreground">全部记录</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div><div><p className="text-sm font-bold">{stats.confirmed}</p><p className="text-[10px] text-muted-foreground">已确认</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div><div><p className="text-sm font-bold">{stats.pending}</p><p className="text-[10px] text-muted-foreground">待确认</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-red-100"><AlertTriangle className="h-3.5 w-3.5 text-red-600" /></div><div><p className="text-sm font-bold">{stats.unlinked}</p><p className="text-[10px] text-muted-foreground">未关联</p></div></div></Card>
          <Card className="p-2"><div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-primary/10"><DollarSign className="h-3.5 w-3.5 text-primary" /></div><div><p className="text-sm font-bold">¥{(stats.totalAmount / 10000).toFixed(1)}万</p><p className="text-[10px] text-muted-foreground">回款总额</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="confirmed" className="text-xs h-6">已确认 ({stats.confirmed})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待确认 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="unlinked" className="text-xs h-6">未关联 ({stats.unlinked})</TabsTrigger>
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
                    <TableHead className="text-xs w-20">流水号</TableHead>
                    <TableHead className="text-xs w-28">关联订单</TableHead>
                    <TableHead className="text-xs">客户</TableHead>
                    <TableHead className="text-xs">回款金额</TableHead>
                    <TableHead className="text-xs">收款方式</TableHead>
                    <TableHead className="text-xs">收款时间</TableHead>
                    <TableHead className="text-xs">订单金额</TableHead>
                    <TableHead className="text-xs">待收余额</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">确认人</TableHead>
                    <TableHead className="text-xs w-28">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">{record.id}</TableCell>
                      <TableCell className="font-mono text-[10px] text-primary">{record.orderId || "-"}</TableCell>
                      <TableCell className="text-xs">{record.customer || "-"}</TableCell>
                      <TableCell className="text-xs font-bold text-primary">¥{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] h-5">{record.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{record.paymentTime}</TableCell>
                      <TableCell className="text-xs">{record.orderAmount ? `¥${record.orderAmount.toLocaleString()}` : "-"}</TableCell>
                      <TableCell className={cn("text-xs font-medium", record.pendingAmount > 0 ? "text-amber-600" : "text-emerald-600")}>
                        {record.pendingAmount > 0 ? `¥${record.pendingAmount.toLocaleString()}` : "已付清"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[record.status].color)}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{record.confirmedBy || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {record.status === "pending" && (
                            <Button size="sm" className="h-6 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />确认</Button>
                          )}
                          {record.status === "unlinked" && (
                            <Button size="sm" className="h-6 text-[10px]"><Link2 className="h-3 w-3 mr-0.5" />关联订单</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filtered.length} / {paymentRecords.length} 条记录
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
