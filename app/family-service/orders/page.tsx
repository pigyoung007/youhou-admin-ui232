"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Eye, Edit, Clock, CheckCircle2, XCircle, TrendingUp, DollarSign,
  Phone, MapPin, Star, User, Calendar, UserPlus, FileSignature, Ban, AlertTriangle, FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { NewServiceOrderDialog } from "@/components/orders/new-service-order-dialog"

interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  serviceType: string
  serviceName: string
  amount: number
  paidAmount: number
  status: "pending_assignment" | "assigned" | "in_service" | "completed" | "cancelled"
  payStatus: "unpaid" | "partial" | "paid" | "refunded"
  nanny: string | null
  nannyRating: number
  serviceDate: string
  endDate: string
  expectedDays: number
  createTime: string
  source: string
  consultant: string
  notes: string
}

const orders: Order[] = [
  { id: "FSO2025010001", customerName: "赵女士", phone: "136****5432", address: "银川市兴庆区民族街某小区", serviceType: "月嫂服务", serviceName: "金牌月嫂42天", amount: 32000, paidAmount: 32000, status: "in_service", payStatus: "paid", nanny: "陈桂芳", nannyRating: 5.0, serviceDate: "2025-01-01", endDate: "2025-02-11", expectedDays: 42, createTime: "2024-12-20 11:20", source: "小红书", consultant: "张顾问", notes: "VIP客户" },
  { id: "FSO2025010002", customerName: "孙女士", phone: "135****7890", address: "银川市金凤区正源街某小区", serviceType: "月嫂服务", serviceName: "高级月嫂26天", amount: 15000, paidAmount: 0, status: "cancelled", payStatus: "refunded", nanny: null, nannyRating: 0, serviceDate: "2025-01-20", endDate: "2025-02-15", expectedDays: 26, createTime: "2025-01-05 10:30", source: "抖音", consultant: "李顾问", notes: "客户取消" },
  { id: "FSO2025010003", customerName: "周先生", phone: "158****2345", address: "银川市兴庆区解放街某小区", serviceType: "育婴服务", serviceName: "育婴师月度", amount: 7600, paidAmount: 7600, status: "in_service", payStatus: "paid", nanny: "刘小红", nannyRating: 4.7, serviceDate: "2025-01-10", endDate: "2025-02-09", expectedDays: 30, createTime: "2025-01-05 15:20", source: "朋友推荐", consultant: "张顾问", notes: "" },
  { id: "FSO2025010004", customerName: "吴女士", phone: "186****6789", address: "银川市西夏区贺兰山路某小区", serviceType: "产康服务", serviceName: "产康套餐12次", amount: 5200, paidAmount: 5200, status: "in_service", payStatus: "paid", nanny: "王秀兰", nannyRating: 4.9, serviceDate: "2025-01-08", endDate: "2025-03-08", expectedDays: 60, createTime: "2025-01-03 10:00", source: "官网下单", consultant: "李顾问", notes: "" },
  { id: "FSO2025010005", customerName: "郑女士", phone: "139****0123", address: "银川市金凤区阅海万家某小区", serviceType: "月嫂服务", serviceName: "高级月嫂26天", amount: 15000, paidAmount: 5000, status: "pending_assignment", payStatus: "partial", nanny: null, nannyRating: 0, serviceDate: "2025-02-01", endDate: "2025-02-27", expectedDays: 26, createTime: "2025-01-16 14:00", source: "微信公众号", consultant: "王顾问", notes: "预产期2月初" },
  { id: "FSO2025010006", customerName: "钱先生", phone: "136****4567", address: "银川市兴庆区北京路某小区", serviceType: "育婴服务", serviceName: "育婴师月度", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", nanny: "赵小燕", nannyRating: 4.6, serviceDate: "2024-11-15", endDate: "2024-12-15", expectedDays: 30, createTime: "2024-11-10 09:30", source: "电话咨询", consultant: "张顾问", notes: "" },
  { id: "FSO2025010007", customerName: "冯女士", phone: "188****8901", address: "银川市西夏区同心路某小区", serviceType: "月嫂服务", serviceName: "金牌月嫂26天", amount: 18800, paidAmount: 18800, status: "in_service", payStatus: "paid", nanny: "孙美华", nannyRating: 4.8, serviceDate: "2025-01-12", endDate: "2025-02-07", expectedDays: 26, createTime: "2025-01-08 16:45", source: "老客户转介", consultant: "李顾问", notes: "二胎客户" },
  { id: "FSO2025010008", customerName: "杨女士", phone: "159****2345", address: "银川市金凤区宝湖路某小区", serviceType: "产康服务", serviceName: "产康套餐8次", amount: 3800, paidAmount: 0, status: "pending_assignment", payStatus: "unpaid", nanny: null, nannyRating: 0, serviceDate: "2025-01-28", endDate: "2025-02-28", expectedDays: 30, createTime: "2025-01-19 11:00", source: "小红书", consultant: "张顾问", notes: "新客户咨询" },
  { id: "FSO2025010009", customerName: "徐先生", phone: "137****6789", address: "银川市兴庆区中山街某小区", serviceType: "育婴服务", serviceName: "育婴师月度", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", nanny: "周小芳", nannyRating: 4.9, serviceDate: "2024-12-10", endDate: "2025-01-10", expectedDays: 30, createTime: "2024-12-05 14:20", source: "朋友推荐", consultant: "王顾问", notes: "服务完成，好评" },
  { id: "FSO2025010010", customerName: "朱女士", phone: "138****0123", address: "银川市西夏区文昌路某小区", serviceType: "月嫂服务", serviceName: "高级月嫂42天", amount: 22000, paidAmount: 22000, status: "in_service", payStatus: "paid", nanny: "吴桂兰", nannyRating: 4.7, serviceDate: "2025-01-05", endDate: "2025-02-16", expectedDays: 42, createTime: "2024-12-28 10:15", source: "官网下单", consultant: "李顾问", notes: "" },
]

const statusConfig = {
  pending_assignment: { label: "待分配", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  assigned: { label: "已分配", color: "bg-blue-100 text-blue-700 border-blue-200", icon: User },
  in_service: { label: "服务中", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: TrendingUp },
  completed: { label: "已完成", color: "bg-gray-100 text-gray-600 border-gray-200", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const payStatusConfig = {
  unpaid: { label: "未支付", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "部分付", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "已付清", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// 订单详情对话框 - 服务订单详情
function OrderDetailDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>服务订单详情</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                {statusConfig[order.status].label}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px] h-5", payStatusConfig[order.payStatus].color)}>
                {payStatusConfig[order.payStatus].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 客户信息 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" />客户信息</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">客户姓名</p>
                <p className="text-xs font-medium">{order.customerName}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">联系电话</p>
                <p className="text-xs font-medium">{order.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">母婴顾问</p>
                <p className="text-xs font-medium">{order.consultant}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">客户来源</p>
                <p className="text-xs font-medium">{order.source}</p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground">服务地址</p>
              <p className="text-xs font-medium">{order.address}</p>
            </div>
          </div>

          {/* 服务信息 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />服务信息</h4>
            <div className="p-3 rounded-lg border bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{order.serviceType}</Badge>
                <span className="text-lg font-bold text-primary">¥{order.amount.toLocaleString()}</span>
              </div>
              <p className="font-medium text-sm">{order.serviceName}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>服务开始：</span>
                  <span className="text-foreground">{order.serviceDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>服务结束：</span>
                  <span className="text-foreground">{order.endDate}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                预计服务周期：{order.expectedDays}天
              </p>
            </div>
          </div>

          {/* 服务人员 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5"><UserPlus className="h-3.5 w-3.5 text-primary" />服务人员</h4>
            {order.nanny ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-pink-100 text-pink-700">{order.nanny.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{order.nanny}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs">{order.nannyRating.toFixed(1)}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">更换人员</Button>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed text-center">
                <p className="text-xs text-muted-foreground mb-2">暂未分配服务人员</p>
                <AssignStaffDialog order={order} trigger={
                  <Button size="sm" className="h-7 text-xs"><UserPlus className="h-3 w-3 mr-1" />立即分配</Button>
                } />
              </div>
            )}
          </div>

          {/* 付款信息 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-primary" />付款信息</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/30 text-center">
                <p className="text-[10px] text-muted-foreground">订单金额</p>
                <p className="text-sm font-bold text-primary">¥{order.amount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-center">
                <p className="text-[10px] text-emerald-600">已付金额</p>
                <p className="text-sm font-bold text-emerald-700">¥{order.paidAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 text-center">
                <p className="text-[10px] text-amber-600">待付金额</p>
                <p className="text-sm font-bold text-amber-700">¥{(order.amount - order.paidAmount).toLocaleString()}</p>
              </div>
            </div>
            {/* 账单明细 */}
            {order.payStatus === 'partial' && (
              <div className="p-2 rounded-lg border bg-muted/20 space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-medium">账单明细</p>
                <div className="flex items-center justify-between text-xs">
                  <span>首付款（定金）</span>
                  <span className="text-emerald-600">¥{order.paidAmount.toLocaleString()} 已付</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>尾款</span>
                  <span className="text-amber-600">¥{(order.amount - order.paidAmount).toLocaleString()} 待付</span>
                </div>
              </div>
            )}
          </div>

          {/* 其他信息 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">其他信息</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">订单来源</p>
                <p className="text-xs font-medium">{order.source}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">母婴顾问</p>
                <p className="text-xs font-medium">{order.consultant}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">创建时间</p>
                <p className="text-xs font-medium">{order.createTime.split(" ")[0]}</p>
              </div>
            </div>
            {order.notes && (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-[10px] text-amber-600 mb-0.5">备注</p>
                <p className="text-xs text-amber-800">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" asChild>
              <Link href={`/family-service/orders/${order.id}`}><Eye className="h-3 w-3 mr-1" />查看完整</Link>
            </Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Edit className="h-3 w-3 mr-1" />编辑</Button>
              <Button size="sm" className="h-7 text-xs"><FileSignature className="h-3 w-3 mr-1" />生成合同</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 分配家政员对话框
function AssignStaffDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><UserPlus className="h-3 w-3 mr-1" />分配</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            分配家政员
          </DialogTitle>
          <DialogDescription className="text-xs">为订单 {order.id} 分配服务人员</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 space-y-3">
          <div className="p-2 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground">服务内容</p>
            <p className="text-xs font-medium">{order.serviceName}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{order.serviceDate} ~ {order.endDate}</p>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">选择家政员</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择家政员" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">陈桂芳 - 金牌月嫂 (5.0分)</SelectItem>
                <SelectItem value="2">孙美华 - 金牌月嫂 (4.8分)</SelectItem>
                <SelectItem value="3">刘小红 - 高级育婴师 (4.7分)</SelectItem>
                <SelectItem value="4">王秀兰 - 高级产康师 (4.9分)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">备注说明</Label>
            <Textarea placeholder="填写分配备注..." className="text-xs min-h-16 resize-none" />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><UserPlus className="h-3 w-3 mr-1" />确认分配</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 取消订单对话框
function CancelOrderDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50"><Ban className="h-3 w-3 mr-1" />取消</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 text-red-600">
            <Ban className="h-4 w-4" />
            取消订单
          </DialogTitle>
          <DialogDescription className="text-xs">确定要取消订单 {order.id} 吗？</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700">
                <p className="font-medium mb-1">取消订单将产生以下影响：</p>
                <ul className="list-disc list-inside space-y-0.5 text-red-600">
                  <li>订单状态变更为"已取消"</li>
                  <li>已分配的家政员将被释放</li>
                  <li>如有预付款项需要处理退款</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">取消原因</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择取消原因" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">客户主动取消</SelectItem>
                <SelectItem value="2">无法安排家政员</SelectItem>
                <SelectItem value="3">客户联系不上</SelectItem>
                <SelectItem value="4">其他原因</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">详细说明</Label>
            <Textarea placeholder="填写取消原因详情..." className="text-xs min-h-16 resize-none" />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">返回</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs"><Ban className="h-3 w-3 mr-1" />确认取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ServiceOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [payFilter, setPayFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = activeTab === "all" || o.status === activeTab
      const matchService = serviceFilter === "all" || o.serviceType === serviceFilter
      const matchPay = payFilter === "all" || o.payStatus === payFilter
      const matchSearch = !searchTerm || o.id.includes(searchTerm) || o.customerName.includes(searchTerm) || o.serviceName.includes(searchTerm)
      return matchStatus && matchService && matchPay && matchSearch
    })
  }, [activeTab, serviceFilter, payFilter, searchTerm])

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "pending_assignment").length,
    inService: orders.filter(o => o.status === "in_service").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0),
    paidAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.paidAmount, 0),
  }), [])

  return (
    <AdminLayout title="服务订单">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">服务订单</h1>
            <p className="text-xs text-muted-foreground">管理家政服务订单</p>
          </div>
          <NewServiceOrderDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending_assignment" className="text-xs h-6">待分配 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="in_service" className="text-xs h-6">服务中 ({stats.inService})</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs h-6">已完成 ({stats.completed})</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs h-6">已取消 ({stats.cancelled})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索订单号、客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                />
              </div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue placeholder="服务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="月嫂服务">月嫂服务</SelectItem>
                  <SelectItem value="育婴服务">育婴服务</SelectItem>
                  <SelectItem value="产康服务">产康服务</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payFilter} onValueChange={setPayFilter}>
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue placeholder="付款状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="unpaid">未支付</SelectItem>
                  <SelectItem value="partial">部分付</SelectItem>
                  <SelectItem value="paid">已付清</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-medium w-32">订单号</TableHead>
                    <TableHead className="text-xs font-medium w-24">客户</TableHead>
                    <TableHead className="text-xs font-medium">服务内容</TableHead>
                    <TableHead className="text-xs font-medium w-24">家政员</TableHead>
                    <TableHead className="text-xs font-medium w-28">服务日期</TableHead>
                    <TableHead className="text-xs font-medium w-20 text-right">金额</TableHead>
                    <TableHead className="text-xs font-medium w-16">付款</TableHead>
                    <TableHead className="text-xs font-medium w-16">状态</TableHead>
                    <TableHead className="text-xs font-medium w-20">所属顾问</TableHead>
                    <TableHead className="text-xs font-medium w-28 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{order.customerName}</div>
                          <div className="text-[10px] text-muted-foreground">{order.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{order.serviceName}</div>
                          <Badge variant="outline" className="text-[10px] mt-0.5">{order.serviceType}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.nanny ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-pink-100 text-pink-700 text-[10px]">{order.nanny.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-medium">{order.nanny}</div>
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  <Star className="h-2.5 w-2.5 fill-current" />
                                  <span className="text-[10px]">{order.nannyRating}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-600">未分配</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div>{order.serviceDate}</div>
                          <div className="text-[10px] text-muted-foreground">{order.expectedDays}天</div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">¥{order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px]", payStatusConfig[order.payStatus].color)}>
                            {payStatusConfig[order.payStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px]", statusConfig[order.status].color)}>
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{order.consultant}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <OrderDetailDialog order={order} trigger={
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                            } />
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                            {order.status === "pending_assignment" && (
                              <AssignStaffDialog order={order} trigger={
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary"><UserPlus className="h-4 w-4" /></Button>
                              } />
                            )}
                            {order.status !== "cancelled" && order.status !== "completed" && (
                              <CancelOrderDialog order={order} trigger={
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600"><Ban className="h-4 w-4" /></Button>
                              } />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        暂无订单数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
            
            {/* 底部统计 */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>显示 {filteredOrders.length} / {orders.length} 条订单</span>
              <div className="flex items-center gap-4">
                <span>订单总额: <span className="font-medium text-foreground">¥{stats.totalAmount.toLocaleString()}</span></span>
                <span>已收款: <span className="font-medium text-emerald-600">¥{stats.paidAmount.toLocaleString()}</span></span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
