"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, FileEdit, Clock, CheckCircle2, XCircle, AlertTriangle, Plus, Eye, User, Calendar, 
  DollarSign, FileText, ChevronRight, Send, Smartphone, Pen, Download
} from "lucide-react"
import { ContractPreviewDialog } from "@/components/contracts/contract-preview-dialog"

// 订单数据
const orders = [
  {
    id: "ORD202501001",
    customer: { name: "张女士", phone: "138****1234" },
    serviceType: "月嫂服务",
    caregiver: { name: "李春华", role: "金牌月嫂" },
    servicePeriod: "2025-01-15 ~ 2025-02-15",
    status: "active",
    totalAmount: 26800,
    contracts: [
      { id: "CT001", type: "main", typeName: "主合同", title: "月嫂服务合同", amount: 26800, signedAt: "2025-01-10", status: "signed" },
    ],
    amendments: [],
  },
  {
    id: "ORD202501002",
    customer: { name: "刘女士", phone: "139****5678" },
    serviceType: "育婴师服务",
    caregiver: { name: "王秀兰", role: "高级育婴师" },
    servicePeriod: "2025-01-20 ~ 2025-03-20",
    status: "active",
    totalAmount: 19800,
    contracts: [
      { id: "CT002", type: "main", typeName: "主合同", title: "育婴师服务合同", amount: 18800, signedAt: "2025-01-18", status: "signed" },
      { id: "CT002-A1", type: "supplement", typeName: "增补合同", title: "服务延期补充协议", amount: 1000, signedAt: "2025-01-22", status: "signed" },
    ],
    amendments: [
      { id: "AM001", type: "extend", typeName: "服务延期", reason: "客户申请延长2周服务", originalValue: "2025-03-06", newValue: "2025-03-20", status: "approved", createdAt: "2025-01-22", approvedAt: "2025-01-22" },
    ],
  },
  {
    id: "ORD202501003",
    customer: { name: "陈先生", phone: "137****9012" },
    serviceType: "产后康复",
    caregiver: { name: "赵丽娜", role: "产康技师" },
    servicePeriod: "2025-01-10 ~ 2025-02-10",
    status: "active",
    totalAmount: 12800,
    contracts: [
      { id: "CT003", type: "main", typeName: "主合同", title: "产后康复服务合同", amount: 12800, signedAt: "2025-01-08", status: "signed" },
    ],
    amendments: [
      { id: "AM002", type: "change_staff", typeName: "更换人员", reason: "原服务人员因故无法继续服务", originalValue: "刘小燕", newValue: "赵丽娜", status: "pending", createdAt: "2025-01-20" },
    ],
  },
  {
    id: "ORD202501004",
    customer: { name: "王女士", phone: "136****3456" },
    serviceType: "月嫂服务",
    caregiver: { name: "张美玲", role: "金牌月嫂" },
    servicePeriod: "2025-02-01 ~ 2025-03-01",
    status: "pending",
    totalAmount: 28800,
    contracts: [
      { id: "CT004", type: "main", typeName: "主合同", title: "月嫂服务合同", amount: 25800, signedAt: "2025-01-25", status: "signed" },
      { id: "CT004-A1", type: "supplement", typeName: "增补合同", title: "服务升级补充协议", amount: 3000, signedAt: null, status: "pending" },
    ],
    amendments: [
      { id: "AM003", type: "price_adjust", typeName: "价格调整", reason: "客户升级服务套餐", originalValue: "¥25,800", newValue: "¥28,800", status: "pending", createdAt: "2025-01-24" },
    ],
  },
]

const typeColors: Record<string, string> = {
  extend: "bg-blue-50 text-blue-700 border-blue-200",
  change_staff: "bg-purple-50 text-purple-700 border-purple-200",
  price_adjust: "bg-amber-50 text-amber-700 border-amber-200",
  supplement: "bg-green-50 text-green-700 border-green-200",
  early_termination: "bg-red-50 text-red-700 border-red-200",
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  signed: "bg-green-50 text-green-700 border-green-200",
}

export default function ContractAmendmentsPage() {
  const [filterStatus, setFilterStatus] = useState("all")

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.amendments.some(a => a.status === "pending")).length,
    active: orders.filter(o => o.status === "active").length,
    completed: orders.filter(o => o.status === "completed").length,
  }

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : filterStatus === "pending"
    ? orders.filter(o => o.amendments.some(a => a.status === "pending"))
    : orders.filter(o => o.status === filterStatus)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">合同变更</h1>
            <p className="text-muted-foreground">管理订单合同变更与增补协议</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索订单..." className="pl-9 w-full sm:w-48" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  发起变更
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>发起合同变更</DialogTitle>
                  <DialogDescription>选择订单并填写变更信息</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>选择订单</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择要变更的订单" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders.map(o => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.id} - {o.customer.name} ({o.serviceType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>变更类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择变更类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="extend">服务延期</SelectItem>
                        <SelectItem value="change_staff">更换人员</SelectItem>
                        <SelectItem value="price_adjust">价格调整</SelectItem>
                        <SelectItem value="supplement">增补服务</SelectItem>
                        <SelectItem value="early_termination">提前终止</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>变更原因</Label>
                    <Textarea placeholder="请详细说明变更原因..." rows={3} />
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      变更申请提交后需经审批通过，审批通过后将生成变更协议并推送给客户签署
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button>提交申请</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("all")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">全部订单</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("pending")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">待审批变更</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("active")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-muted-foreground">进行中</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("completed")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">已完成</p>
            </CardContent>
          </Card>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {order.customer.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.customer.name}</span>
                        <Badge variant="outline">{order.serviceType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.id} | {order.servicePeriod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">¥{order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{order.contracts.length} 份合同</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>订单详情 - {order.id}</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="contracts" className="w-full">
                          <TabsList className="w-full">
                            <TabsTrigger value="contracts" className="flex-1">合同文件</TabsTrigger>
                            <TabsTrigger value="amendments" className="flex-1">变更记录</TabsTrigger>
                            <TabsTrigger value="info" className="flex-1">订单信息</TabsTrigger>
                          </TabsList>
                          <TabsContent value="contracts" className="mt-4 space-y-3">
                            {order.contracts.map(ct => (
                              <div key={ct.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{ct.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className={typeColors[ct.type] || ""}>{ct.typeName}</Badge>
                                      <span className="text-sm text-muted-foreground">¥{ct.amount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className={statusColors[ct.status]}>
                                    {ct.status === "signed" ? "已签署" : "待签署"}
                                  </Badge>
                                  <ContractPreviewDialog
                                    contractId={ct.id}
                                    contractNo={order.id}
                                    title={ct.title}
                                    type={ct.type}
                                    typeName={ct.typeName}
                                    amount={ct.amount}
                                    status={ct.status}
                                    signedAt={ct.signedAt}
                                    company={{ name: "银川优厚家庭服务有限公司" }}
                                    employer={{ name: order.customer.name, phone: order.customer.phone }}
                                    caregiver={{ name: order.caregiver.name, role: order.caregiver.role }}
                                  />
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                          <TabsContent value="amendments" className="mt-4 space-y-3">
                            {order.amendments.length > 0 ? order.amendments.map(am => (
                              <div key={am.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className={typeColors[am.type]}>{am.typeName}</Badge>
                                  <Badge variant="outline" className={statusColors[am.status]}>
                                    {am.status === "pending" ? "待审批" : am.status === "approved" ? "已通过" : "已拒绝"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{am.reason}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground line-through">{am.originalValue}</span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{am.newValue}</span>
                                </div>
                              </div>
                            )) : (
                              <p className="text-center text-muted-foreground py-4">暂无变更记录</p>
                            )}
                          </TabsContent>
                          <TabsContent value="info" className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">客户姓名</p>
                                <p className="font-medium">{order.customer.name}</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">联系电话</p>
                                <p className="font-medium">{order.customer.phone}</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">服务人员</p>
                                <p className="font-medium">{order.caregiver.name} ({order.caregiver.role})</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">服务周期</p>
                                <p className="font-medium">{order.servicePeriod}</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Pending Amendments */}
                {order.amendments.filter(a => a.status === "pending").map(am => (
                  <div key={am.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={typeColors[am.type]}>{am.typeName}</Badge>
                            <span className="text-sm text-muted-foreground">{am.createdAt}</span>
                          </div>
                          <p className="text-sm mt-1">{am.reason}</p>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="text-muted-foreground line-through">{am.originalValue}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{am.newValue}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          驳回
                        </Button>
                        <Button size="sm">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          通过
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create Amendment for this order */}
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileEdit className="h-4 w-4 mr-1" />
                        发起变更
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>发起变更 - {order.id}</DialogTitle>
                        <DialogDescription>为 {order.customer.name} 的订单发起变更</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>变更类型</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="选择变更类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="extend">服务延期</SelectItem>
                              <SelectItem value="change_staff">更换人员</SelectItem>
                              <SelectItem value="price_adjust">价格调整</SelectItem>
                              <SelectItem value="supplement">增补服务</SelectItem>
                              <SelectItem value="early_termination">提前终止</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>变更原因</Label>
                          <Textarea placeholder="请详细说明变更原因..." rows={3} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>提交申请</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
