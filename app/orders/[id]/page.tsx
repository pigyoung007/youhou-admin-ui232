"use client"

import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft, Calendar, Clock, CreditCard, Edit, FileText, MapPin, Phone, Star, User, MessageSquare,
  AlertTriangle, CheckCircle2, XCircle, TrendingUp, Shield, Download, ExternalLink, UserPlus, FileSignature, Ban
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock order data
const orderData = {
  id: "ORD202501001",
  status: "active",
  payStatus: "paid",
  customer: {
    name: "刘女士",
    phone: "138****5678",
    fullPhone: "13812345678",
    address: "银川市兴庆区凤凰北街凤凰花园小区12栋3单元801室",
    wechat: "liu_123",
  },
  service: {
    name: "金牌月嫂26天",
    type: "月嫂服务",
    startDate: "2025-01-15",
    endDate: "2025-02-10",
    days: 26,
  },
  amount: {
    total: 18800,
    paid: 18800,
    pending: 0,
    deposit: 5000,
    balance: 13800,
  },
  staff: {
    id: "N001",
    name: "李春华",
    role: "金牌月嫂",
    avatar: "",
    rating: 4.9,
    orders: 28,
    phone: "139****1234",
    certificates: ["高级母婴护理师", "催乳师"],
    insurance: { status: "valid", expiry: "2025-06-30" },
  },
  contract: { id: "CT202501001", status: "signed", signedAt: "2025-01-10" },
  consultant: "张顾问",
  source: "官网下单",
  notes: "客户要求提前上户，需特别关注",
  createTime: "2025-01-10 14:30",
  timeline: [
    { time: "2025-01-10 14:30", event: "订单创建", type: "create" },
    { time: "2025-01-10 16:00", event: "完成支付定金 ¥5,000", type: "payment" },
    { time: "2025-01-10 18:30", event: "三方合同签署完成", type: "contract" },
    { time: "2025-01-12 10:00", event: "支付尾款 ¥13,800", type: "payment" },
    { time: "2025-01-15 08:00", event: "服务开始，月嫂上户", type: "service" },
    { time: "2025-01-20 15:00", event: "客户回访：满意度5星", type: "feedback" },
  ],
  serviceLogs: [
    { date: "2025-01-20", content: "产妇恢复良好，宝宝体重增长正常", rating: 5 },
    { date: "2025-01-18", content: "指导产妇母乳喂养，宝宝吃奶情况改善", rating: 5 },
    { date: "2025-01-16", content: "上户第二天，熟悉家庭情况，与产妇建立良好关系", rating: 5 },
    { date: "2025-01-15", content: "正式上户，完成交接", rating: 5 },
  ],
}

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

// Cancel Order Dialog
function CancelOrderDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
          <Ban className="h-3 w-3 mr-1" />取消订单
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 text-red-600">
            <Ban className="h-4 w-4" />取消订单
          </DialogTitle>
          <DialogDescription className="text-xs">确定要取消此订单吗？</DialogDescription>
        </DialogHeader>
        <div className="p-4 space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">取消订单后，服务人员将被释放，如有预付款项需要处理退款。</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">取消原因</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择取消原因" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">客户主动取消</SelectItem>
                <SelectItem value="2">无法安排服务人员</SelectItem>
                <SelectItem value="3">其他原因</SelectItem>
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
          <Button variant="destructive" size="sm" className="h-7 text-xs">确认取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const order = orderData
  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header with Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/orders"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{order.id}</h1>
                <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status as keyof typeof statusConfig].color)}>
                  <StatusIcon className="h-3 w-3 mr-0.5" />
                  {statusConfig[order.status as keyof typeof statusConfig].label}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px] h-5", payStatusConfig[order.payStatus as keyof typeof payStatusConfig].color)}>
                  {payStatusConfig[order.payStatus as keyof typeof payStatusConfig].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{order.service.type} - {order.service.name}</p>
            </div>
          </div>
          
          {/* Key Actions - Always Visible */}
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Phone className="h-3 w-3 mr-1" />联系客户
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Edit className="h-3 w-3 mr-1" />编辑订单
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <UserPlus className="h-3 w-3 mr-1" />分配人员
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <FileSignature className="h-3 w-3 mr-1" />生成合同
            </Button>
            <CancelOrderDialog />
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">服务周期</p>
                  <p className="text-sm font-medium">{order.service.startDate} 至 {order.service.endDate} ({order.service.days}天)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">订单金额</p>
                <p className="text-xl font-bold text-primary">¥{order.amount.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Customer & Staff Info */}
            <div className="grid md:grid-cols-2 gap-3">
              {/* Customer Card */}
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />客户信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{order.customer.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{order.customer.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">微信: {order.customer.wechat}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
                      <Phone className="h-3 w-3 mr-1" />拨打
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
                      <MessageSquare className="h-3 w-3 mr-1" />消息
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Staff Card */}
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-rose-500" />服务人员
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <Link href={`/operations/nanny/${order.staff.id}`}>
                    <div className="flex items-center gap-2 p-1.5 -mx-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-rose-100 text-rose-600 text-xs">{order.staff.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium">{order.staff.name}</p>
                          <Badge variant="secondary" className="text-[10px] h-4">{order.staff.role}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{order.staff.rating}
                          </span>
                          <span>{order.staff.orders}单</span>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </Link>
                  <Separator />
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">证书</span>
                      <div className="flex gap-1">
                        {order.staff.certificates.map((cert, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] h-4">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">保险</span>
                      <Badge variant="outline" className={cn("text-[10px] h-4", order.staff.insurance.status === "valid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        {order.staff.insurance.status === "valid" ? "有效" : "即将到期"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
                      <Phone className="h-3 w-3 mr-1" />联系
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
                      <Calendar className="h-3 w-3 mr-1" />排班
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline & Logs */}
            <Card>
              <Tabs defaultValue="timeline" className="w-full">
                <CardHeader className="p-3 pb-0">
                  <TabsList className="h-7">
                    <TabsTrigger value="timeline" className="text-xs h-5">订单时间线</TabsTrigger>
                    <TabsTrigger value="logs" className="text-xs h-5">服务日志</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="p-3">
                  <TabsContent value="timeline" className="mt-0">
                    <div className="space-y-2">
                      {order.timeline.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex flex-col items-center">
                            <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            {index < order.timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-0.5" />}
                          </div>
                          <div className="pb-2">
                            <p className="text-xs font-medium">{item.event}</p>
                            <p className="text-[10px] text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="logs" className="mt-0">
                    <div className="space-y-2">
                      {order.serviceLogs.map((log, index) => (
                        <div key={index} className="p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{log.date}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: log.rating }).map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{log.content}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Payment Info */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />付款信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">订单金额</span>
                    <span className="font-bold">¥{order.amount.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">定金</span>
                    <span>¥{order.amount.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">尾款</span>
                    <span>¥{order.amount.balance.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">已支付</span>
                    <span className="font-semibold text-emerald-600">¥{order.amount.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">待支付</span>
                    <span className={order.amount.pending > 0 ? "font-semibold text-red-500" : ""}>
                      ¥{order.amount.pending.toLocaleString()}
                    </span>
                  </div>
                </div>
                {order.amount.pending > 0 && (
                  <Button size="sm" className="w-full h-7 text-xs">发送收款提醒</Button>
                )}
              </CardContent>
            </Card>

            {/* Contract Info */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-teal-600" />合同信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">合同编号</span>
                    <Link href={`/contracts/list?id=${order.contract.id}`} className="text-primary hover:underline">
                      {order.contract.id}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">签署状态</span>
                    <Badge variant="outline" className="text-[10px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />已签署
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">签署时间</span>
                    <span>{order.contract.signedAt}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full h-7 text-xs bg-transparent">
                  <Download className="h-3 w-3 mr-1" />下载合同
                </Button>
              </CardContent>
            </Card>

            {/* Order Info */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold">订单信息</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">订单来源</span>
                  <span>{order.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">销售顾问</span>
                  <span>{order.consultant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{order.createTime}</span>
                </div>
                {order.notes && (
                  <div className="pt-1">
                    <p className="text-muted-foreground mb-1">备注</p>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span className="text-amber-800">{order.notes}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
