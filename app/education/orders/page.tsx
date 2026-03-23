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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Plus, FileText, Clock, CheckCircle2, XCircle, TrendingUp, DollarSign,
  Eye, Edit, Phone, MapPin, Star, User, Calendar, UserPlus, FileSignature, Ban, AlertTriangle, MessageSquare, ChevronRight, Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { NewEducationOrderDialog } from "@/components/orders/new-education-order-dialog"

interface Order {
  id: string
  customer: string
  phone: string
  address: string
  service: string
  serviceType: string
  amount: number
  paidAmount: number
  status: "pending" | "active" | "completed" | "cancelled"
  payStatus: "unpaid" | "partial" | "paid" | "refunded"
  staff: string
  staffAvatar: string
  staffRating: number
  startDate: string
  endDate: string
  createTime: string
  source: string
  consultant: string
  notes: string
  // 培训订单特有字段
  courseName?: string
  className?: string
  instructor?: string
}

const orders: Order[] = [
  { id: "EDU202501001", customer: "李春华", phone: "138****1234", address: "银川市金凤区某小区", service: "高级月嫂培训班", serviceType: "月嫂培训", amount: 3800, paidAmount: 3800, status: "active", payStatus: "paid", staff: "王老师", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-15", endDate: "2025-02-28", createTime: "2025-01-10 14:30", source: "线上报名", consultant: "张顾问", notes: "", courseName: "高级月嫂", className: "2025年第1期", instructor: "王老师" },
  { id: "EDU202501002", customer: "王秀兰", phone: "139****5678", address: "银川市兴庆区某小区", service: "产康师初级培训", serviceType: "产康培训", amount: 2800, paidAmount: 2800, status: "completed", payStatus: "paid", staff: "李老师", staffAvatar: "", staffRating: 4.8, startDate: "2024-12-01", endDate: "2025-01-15", createTime: "2024-11-25 09:15", source: "老学员介绍", consultant: "李顾问", notes: "已结业，成绩优秀", courseName: "产康师初级", className: "2024年第4期", instructor: "李老师" },
  { id: "EDU202501003", customer: "张美玲", phone: "137****9012", address: "银川市西夏区某小区", service: "育婴师培训班", serviceType: "育婴培训", amount: 2500, paidAmount: 1250, status: "active", payStatus: "partial", staff: "陈老师", staffAvatar: "", staffRating: 4.7, startDate: "2025-01-20", endDate: "2025-03-10", createTime: "2025-01-05 16:45", source: "抖音推广", consultant: "王顾问", notes: "分期付款", courseName: "育婴师", className: "2025年第1期", instructor: "陈老师" },
  { id: "ORD202501004", customer: "赵女士", phone: "136****5432", address: "银川市兴庆区民族街", service: "金牌月嫂42天", serviceType: "月嫂服务", amount: 32000, paidAmount: 32000, status: "active", payStatus: "paid", staff: "陈桂芳", staffAvatar: "", staffRating: 5.0, startDate: "2025-01-01", endDate: "2025-02-11", createTime: "2024-12-20 11:20", source: "小红书", consultant: "张顾问", notes: "VIP客户，需特别关注" },
  { id: "ORD202501005", customer: "孙女士", phone: "135****7890", address: "银川市金凤区正源街", service: "高级月嫂26天", serviceType: "月嫂服务", amount: 15000, paidAmount: 0, status: "cancelled", payStatus: "refunded", staff: "-", staffAvatar: "", staffRating: 0, startDate: "2025-01-20", endDate: "2025-02-15", createTime: "2025-01-05 10:30", source: "抖音", consultant: "李顾问", notes: "客户取消，原因：计划变更" },
  { id: "ORD202501006", customer: "周先生", phone: "158****2345", address: "银川市兴庆区解放街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "active", payStatus: "paid", staff: "刘小红", staffAvatar: "", staffRating: 4.7, startDate: "2025-01-10", endDate: "2025-02-09", createTime: "2025-01-05 15:20", source: "朋友推荐", consultant: "张顾问", notes: "" },
  { id: "ORD202501007", customer: "吴女士", phone: "186****6789", address: "银川市西夏区贺兰山路", service: "产康套餐12次", serviceType: "产康服务", amount: 5200, paidAmount: 5200, status: "active", payStatus: "paid", staff: "王秀兰", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-08", endDate: "2025-03-08", createTime: "2025-01-03 10:00", source: "官网下单", consultant: "李顾问", notes: "" },
  { id: "ORD202501008", customer: "郑女士", phone: "139****0123", address: "银川市金凤区阅海万家", service: "高级月嫂26天", serviceType: "月嫂服务", amount: 15000, paidAmount: 5000, status: "pending", payStatus: "partial", staff: "待分配", staffAvatar: "", staffRating: 0, startDate: "2025-02-01", endDate: "2025-02-27", createTime: "2025-01-16 14:00", source: "微信公众号", consultant: "王顾问", notes: "预产期2月初" },
  { id: "ORD202501009", customer: "钱先生", phone: "136****4567", address: "银川市兴庆区北京路", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "赵小燕", staffAvatar: "", staffRating: 4.6, startDate: "2024-11-15", endDate: "2024-12-15", createTime: "2024-11-10 09:30", source: "电话咨询", consultant: "张顾问", notes: "" },
  { id: "ORD202501010", customer: "冯女士", phone: "188****8901", address: "银川市西夏区同心路", service: "金牌月嫂26天", serviceType: "月嫂服务", amount: 18800, paidAmount: 18800, status: "active", payStatus: "paid", staff: "孙美华", staffAvatar: "", staffRating: 4.8, startDate: "2025-01-12", endDate: "2025-02-07", createTime: "2025-01-08 16:45", source: "老客户转介", consultant: "李顾问", notes: "二胎客户" },
  { id: "ORD202501011", customer: "杨女士", phone: "159****2345", address: "银川市金凤区宝湖路", service: "产康套餐8次", serviceType: "产康服务", amount: 3800, paidAmount: 0, status: "pending", payStatus: "unpaid", staff: "待分配", staffAvatar: "", staffRating: 0, startDate: "2025-01-28", endDate: "2025-02-28", createTime: "2025-01-19 11:00", source: "小红书", consultant: "张顾问", notes: "新客户咨询" },
  { id: "ORD202501012", customer: "徐先生", phone: "137****6789", address: "银川市兴庆区中山街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "周小芳", staffAvatar: "", staffRating: 4.9, startDate: "2024-12-10", endDate: "2025-01-10", createTime: "2024-12-05 14:20", source: "朋友推荐", consultant: "王顾问", notes: "服务完成，好评" },
  { id: "ORD202501013", customer: "朱女士", phone: "138****0123", address: "银川市西夏区文昌路", service: "高级月嫂42天", serviceType: "月嫂服务", amount: 22000, paidAmount: 22000, status: "active", payStatus: "paid", staff: "吴桂兰", staffAvatar: "", staffRating: 4.7, startDate: "2025-01-05", endDate: "2025-02-16", createTime: "2024-12-28 10:15", source: "官网下单", consultant: "李顾问", notes: "" },
  { id: "ORD202501014", customer: "何女士", phone: "186****4567", address: "银川市金凤区长城路", service: "产康套餐16次", serviceType: "产康服务", amount: 6800, paidAmount: 3400, status: "active", payStatus: "partial", staff: "郑小梅", staffAvatar: "", staffRating: 4.8, startDate: "2025-01-10", endDate: "2025-04-10", createTime: "2025-01-06 09:00", source: "抖音", consultant: "张顾问", notes: "分期付款" },
  { id: "ORD202501015", customer: "高先生", phone: "159****8901", address: "银川市兴庆区胜利街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "陈小玲", staffAvatar: "", staffRating: 5.0, startDate: "2024-11-20", endDate: "2024-12-20", createTime: "2024-11-15 15:30", source: "电话咨询", consultant: "王顾问", notes: "优质客户" },
  { id: "ORD202501016", customer: "林女士", phone: "136****2345", address: "银川市西夏区学院路", service: "金牌月嫂26天", serviceType: "月嫂服务", amount: 18800, paidAmount: 18800, status: "active", payStatus: "paid", staff: "钱秀英", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-18", endDate: "2025-02-13", createTime: "2025-01-12 11:45", source: "微信公众号", consultant: "李顾问", notes: "" },
  { id: "ORD202501017", customer: "梁女士", phone: "188****6789", address: "银川市金凤区满城街", service: "产康套餐8次", serviceType: "产康服务", amount: 3800, paidAmount: 3800, status: "completed", payStatus: "paid", staff: "孙小红", staffAvatar: "", staffRating: 4.7, startDate: "2024-12-15", endDate: "2025-01-15", createTime: "2024-12-10 16:00", source: "老客户转介", consultant: "张顾问", notes: "服务完成" },
  { id: "ORD202501018", customer: "谢先生", phone: "137****0123", address: "银川市兴庆区清和街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 0, status: "cancelled", payStatus: "refunded", staff: "-", staffAvatar: "", staffRating: 0, startDate: "2025-01-15", endDate: "2025-02-15", createTime: "2025-01-08 10:20", source: "小红书", consultant: "王顾问", notes: "客户取消" },
]

const statusConfig = {
  pending: { label: "待服务", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  active: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
  completed: { label: "已完成", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const payStatusConfig = {
  unpaid: { label: "未支付", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "部分付", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "已付清", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Order Detail Dialog - 培训订单详情
function OrderDetailDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  const isEducationOrder = order.id.startsWith('EDU')
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{isEducationOrder ? '培训订单详情' : '订单详情'}</span>
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
          {/* 学员信息 - 培训订单 */}
          {isEducationOrder ? (
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />学员信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">学员姓名</p>
                  <p className="text-xs font-medium">{order.customer}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">联系电话</p>
                  <p className="text-xs font-medium">{order.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">招生顾问</p>
                  <p className="text-xs font-medium">{order.consultant}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">招生来源</p>
                  <p className="text-xs font-medium">{order.source}</p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">联系地址</p>
                <p className="text-xs font-medium">{order.address}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />客户信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">客户姓名</p>
                  <p className="text-xs font-medium">{order.customer}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">联系电话</p>
                  <p className="text-xs font-medium">{order.phone}</p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">服务地址</p>
                <p className="text-xs font-medium">{order.address}</p>
              </div>
            </div>
          )}

          {/* 课程信息 - 培训订单 */}
          {isEducationOrder ? (
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />课程信息
              </h4>
              <div className="p-3 rounded-lg border bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">{order.serviceType}</Badge>
                  <span className="text-lg font-bold text-primary">¥{order.amount.toLocaleString()}</span>
                </div>
                <p className="font-medium text-sm">{order.courseName || order.service}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>班级：</span>
                    <span className="text-foreground">{order.className || '2025年第1期'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>讲师：</span>
                    <span className="text-foreground">{order.instructor || order.staff}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  培训周期：{order.startDate} ~ {order.endDate}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />服务信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">服务类型</p>
                  <p className="text-xs font-medium">{order.serviceType}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">服务内容</p>
                  <p className="text-xs font-medium">{order.service}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">开始日期</p>
                  <p className="text-xs font-medium">{order.startDate}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">结束日期</p>
                  <p className="text-xs font-medium">{order.endDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* 讲师/服务人员 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-primary" />{isEducationOrder ? '培训讲师' : '服务人员'}
            </h4>
            {order.staff !== "待分配" && order.staff !== "-" ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{order.staff.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs font-medium">{order.staff}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>{order.staffRating}分</span>
                  </div>
                </div>
                {!isEducationOrder && (
                  <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent">更换人员</Button>
                )}
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />暂未分配{isEducationOrder ? '讲师' : '服务人员'}
                </p>
              </div>
            )}
          </div>

          {/* 付款信息 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-primary" />付款信息
            </h4>
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
            {/* 账单明细 - 模拟 */}
            {order.payStatus === 'partial' && (
              <div className="p-2 rounded-lg border bg-muted/20 space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-medium">账单明细</p>
                <div className="flex items-center justify-between text-xs">
                  <span>首付款</span>
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
                <p className="text-[10px] text-muted-foreground">{isEducationOrder ? '报名来源' : '订单来源'}</p>
                <p className="text-xs font-medium">{order.source}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">{isEducationOrder ? '招生顾问' : '销售顾问'}</p>
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
              <Link href={`/education/orders/${order.id}`}><Eye className="h-3 w-3 mr-1" />查看完整</Link>
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

// Assign Staff Dialog
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
            分配服务人员
          </DialogTitle>
          <DialogDescription className="text-xs">为订单 {order.id} 分配服务人员</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 space-y-3">
          <div className="p-2 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground">服务内容</p>
            <p className="text-xs font-medium">{order.service}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{order.startDate} ~ {order.endDate}</p>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">选择服务人员</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择服务人员" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">李春华 - 金牌月嫂 (4.9分)</SelectItem>
                <SelectItem value="2">张美玲 - 高级月嫂 (4.8分)</SelectItem>
                <SelectItem value="3">陈桂芳 - 金牌月嫂 (5.0分)</SelectItem>
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

// Cancel Order Dialog
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
                  <li>已分配的服务人员将被释放</li>
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
                <SelectItem value="2">无法安排服务人员</SelectItem>
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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [payFilter, setPayFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = activeTab === "all" || o.status === activeTab
      const matchService = serviceFilter === "all" || o.serviceType === serviceFilter
      const matchPay = payFilter === "all" || o.payStatus === payFilter
      const matchSearch = !searchTerm || o.id.includes(searchTerm) || o.customer.includes(searchTerm) || o.service.includes(searchTerm)
      return matchStatus && matchService && matchPay && matchSearch
    })
  }, [activeTab, serviceFilter, payFilter, searchTerm])

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => o.status === "active").length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0),
    paidAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.paidAmount, 0),
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">培训订单</h1>
            <p className="text-xs text-muted-foreground">管理学员培训报名订单</p>
          </div>
          <NewEducationOrderDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="active" className="text-xs h-6">服务中 ({stats.active})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待服务 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs h-6">已完成 ({stats.completed})</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs h-6">已取消 ({stats.cancelled})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索订单..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="月嫂服务">月嫂服务</SelectItem>
                  <SelectItem value="产康服务">产康服务</SelectItem>
                  <SelectItem value="育婴服务">育婴服务</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payFilter} onValueChange={setPayFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">支付状态</SelectItem>
                  <SelectItem value="unpaid">未支付</SelectItem>
                  <SelectItem value="partial">部分付</SelectItem>
                  <SelectItem value="paid">已付清</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-28">订单号</TableHead>
                    <TableHead className="text-xs">客户/服务</TableHead>
                    <TableHead className="text-xs w-20">服务类型</TableHead>
                    <TableHead className="text-xs">服务人员</TableHead>
                    <TableHead className="text-xs">服务周期</TableHead>
                    <TableHead className="text-xs">金额/支付</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs w-56">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-mono text-[10px] text-muted-foreground">{order.id}</p>
                          <p className="text-[10px] text-muted-foreground">{order.createTime.split(" ")[0]}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{order.customer.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium">{order.customer}</p>
                              <p className="text-[10px] text-muted-foreground">{order.service}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", 
                            order.serviceType === "月嫂服务" ? "bg-rose-50 text-rose-700 border-rose-200" :
                            order.serviceType === "产康服务" ? "bg-teal-50 text-teal-700 border-teal-200" :
                            "bg-cyan-50 text-cyan-700 border-cyan-200"
                          )}>
                            {order.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.staff !== "待分配" && order.staff !== "-" ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px]">{order.staff.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs">{order.staff}</p>
                                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />{order.staffRating}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">
                              待分配
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">{order.startDate}</p>
                          <p className="text-[10px] text-muted-foreground">至 {order.endDate}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-bold text-primary">¥{order.amount.toLocaleString()}</p>
                          <Badge variant="outline" className={cn("text-[10px] h-4", payStatusConfig[order.payStatus].color)}>
                            {payStatusConfig[order.payStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* Always visible: View Detail */}
                            <OrderDetailDialog order={order} trigger={
                              <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-1" />详情</Button>
                            } />
                            
                            {/* Key actions based on status */}
                            {order.status === "pending" && order.staff === "待分配" && (
                              <AssignStaffDialog order={order} trigger={
                                <Button size="sm" className="h-6 text-[10px]"><UserPlus className="h-3 w-3 mr-1" />分配人员</Button>
                              } />
                            )}
                            
                            {order.status === "pending" && order.staff !== "待分配" && (
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><FileSignature className="h-3 w-3 mr-1" />生成合同</Button>
                            )}
                            
                            {order.status === "active" && (
                              <>
                                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Phone className="h-3 w-3 mr-1" />联系</Button>
                                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><MessageSquare className="h-3 w-3 mr-1" />回访</Button>
                              </>
                            )}
                            
                            {order.status === "completed" && (
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Star className="h-3 w-3 mr-1" />查看评价</Button>
                            )}
                            
                            {(order.status === "pending" || order.status === "active") && (
                              <>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Edit className="h-3 w-3 mr-1" />编辑</Button>
                                <CancelOrderDialog order={order} />
                              </>
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
              显示 {filteredOrders.length} / {orders.length} 条订单
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
