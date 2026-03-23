"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, Edit, Phone, MapPin, Star, Calendar, Clock, 
  DollarSign, User, UserPlus, FileText, CheckCircle2, Ban,
  CreditCard, Receipt, AlertTriangle, Download, Plus, MessageSquare,
  History, FileSignature
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 模拟订单数据
const mockOrder = {
  id: "FSO2025010001",
  customerName: "赵女士",
  phone: "136****5432",
  address: "银川市兴庆区民族街某小区3号楼1单元501室",
  serviceType: "月嫂服务",
  serviceName: "金牌月嫂42天",
  amount: 32000,
  paidAmount: 32000,
  status: "in_service",
  payStatus: "paid",
  nanny: "陈桂芳",
  nannyId: "N001",
  nannyRating: 5.0,
  nannyLevel: "金牌月嫂",
  nannyPhone: "138****8888",
  serviceDate: "2025-01-01",
  endDate: "2025-02-11",
  expectedDays: 42,
  completedDays: 23,
  createTime: "2024-12-20 11:20",
  source: "小红书",
  consultant: "张顾问",
  consultantPhone: "139****9999",
  notes: "VIP客户，注意服务质量",
  contract: {
    id: "CON2024122001",
    status: "active",
    signDate: "2024-12-22",
  },
  // 账单记录
  bills: [
    { id: "B001", type: "定金", amount: 5000, status: "paid", paidDate: "2024-12-20", method: "微信支付" },
    { id: "B002", type: "首期款", amount: 15000, status: "paid", paidDate: "2024-12-28", method: "银行转账" },
    { id: "B003", type: "尾款", amount: 12000, status: "paid", paidDate: "2025-01-15", method: "支付宝" },
  ],
  // 服务日志
  serviceLogs: [
    { id: "L001", date: "2025-01-23", time: "08:30", type: "日常护理", content: "宝宝洗澡、抚触按摩", operator: "陈桂芳" },
    { id: "L002", date: "2025-01-23", time: "12:00", type: "喂养", content: "协助母乳喂养，记录宝宝进食量350ml", operator: "陈桂芳" },
    { id: "L003", date: "2025-01-22", time: "15:00", type: "月子餐", content: "制作下午茶点心和晚餐准备", operator: "陈桂芳" },
    { id: "L004", date: "2025-01-22", time: "09:00", type: "产妇护理", content: "产妇伤口护理，协助进行产后恢复运动", operator: "陈桂芳" },
  ],
  // 跟进记录
  followups: [
    { id: "F001", date: "2025-01-20", content: "电话回访客户满意度，客户反馈服务非常满意", operator: "张顾问" },
    { id: "F002", date: "2025-01-10", content: "上门巡检服务情况，一切正常", operator: "李经理" },
    { id: "F003", date: "2025-01-01", content: "月嫂上户，交接完成", operator: "张顾问" },
  ],
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_assignment: { label: "待分配", color: "bg-amber-100 text-amber-700" },
  assigned: { label: "已分配", color: "bg-blue-100 text-blue-700" },
  in_service: { label: "服务中", color: "bg-emerald-100 text-emerald-700" },
  completed: { label: "已完成", color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600" },
}

const payStatusConfig: Record<string, { label: string; color: string }> = {
  unpaid: { label: "未支付", color: "bg-red-100 text-red-700" },
  partial: { label: "部分付", color: "bg-amber-100 text-amber-700" },
  paid: { label: "已付清", color: "bg-emerald-100 text-emerald-700" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-600" },
}

export default function ServiceOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  
  const order = mockOrder // 实际项目中根据params.id获取订单数据
  const progress = Math.round((order.completedDays / order.expectedDays) * 100)

  return (
    <AdminLayout title="订单详情">
      <div className="space-y-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{order.serviceName}</h1>
                <Badge className={cn("text-xs", statusConfig[order.status].color)}>
                  {statusConfig[order.status].label}
                </Badge>
                <Badge className={cn("text-xs", payStatusConfig[order.payStatus].color)}>
                  {payStatusConfig[order.payStatus].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">订单号：{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <FileSignature className="h-3.5 w-3.5 mr-1" />
              查看合同
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              导出
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Edit className="h-3.5 w-3.5 mr-1" />
              编辑订单
            </Button>
          </div>
        </div>

        {/* 关键信息卡片 */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">客户</p>
                  <p className="text-sm font-medium">{order.customerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">服务人员</p>
                  <p className="text-sm font-medium">{order.nanny || "未分配"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">订单金额</p>
                  <p className="text-sm font-bold text-emerald-600">¥{order.amount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">服务进度</p>
                  <p className="text-sm font-medium">{order.completedDays}/{order.expectedDays}天 ({progress}%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="h-8">
            <TabsTrigger value="overview" className="text-xs h-6">订单概览</TabsTrigger>
            <TabsTrigger value="bills" className="text-xs h-6">账单记录</TabsTrigger>
            <TabsTrigger value="service" className="text-xs h-6">服务日志</TabsTrigger>
            <TabsTrigger value="followup" className="text-xs h-6">跟进记录</TabsTrigger>
          </TabsList>

          {/* 订单概览 */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* 客户信息 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    客户信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">姓名</span>
                    <span className="text-xs font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">电话</span>
                    <span className="text-xs font-medium">{order.phone}</span>
                  </div>
                  <div className="py-1.5">
                    <span className="text-xs text-muted-foreground">服务地址</span>
                    <p className="text-xs font-medium mt-0.5">{order.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 服务信息 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    服务信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">服务类型</span>
                    <Badge variant="outline" className="text-xs">{order.serviceType}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">服务套餐</span>
                    <span className="text-xs font-medium">{order.serviceName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">服务周期</span>
                    <span className="text-xs font-medium">{order.serviceDate} ~ {order.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">服务天数</span>
                    <span className="text-xs font-medium">{order.expectedDays}天</span>
                  </div>
                </CardContent>
              </Card>

              {/* 服务人员 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    服务人员
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.nanny ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-pink-100 text-pink-700">{order.nanny.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{order.nanny}</p>
                          <p className="text-xs text-muted-foreground">{order.nannyLevel}</p>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs">{order.nannyRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-t">
                        <span className="text-xs text-muted-foreground">联系电话</span>
                        <span className="text-xs font-medium">{order.nannyPhone}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        联系家政员
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground mb-2">暂未分配服务人员</p>
                      <Button size="sm" className="h-7 text-xs">
                        <UserPlus className="h-3 w-3 mr-1" />立即分配
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 付款信息和其他信息 */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    付款信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-[10px] text-muted-foreground">订单金额</p>
                      <p className="text-sm font-bold">¥{order.amount.toLocaleString()}</p>
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
                  <div className="flex items-center justify-between py-1.5 border-t">
                    <span className="text-xs text-muted-foreground">付款状态</span>
                    <Badge className={cn("text-xs", payStatusConfig[order.payStatus].color)}>
                      {payStatusConfig[order.payStatus].label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    其他信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">订单来源</span>
                    <span className="text-xs font-medium">{order.source}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">所属顾问</span>
                    <span className="text-xs font-medium">{order.consultant}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground">创建时间</span>
                    <span className="text-xs font-medium">{order.createTime}</span>
                  </div>
                  {order.notes && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-[10px] text-amber-600 mb-0.5">备注</p>
                      <p className="text-xs text-amber-800">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 账单记录 */}
          <TabsContent value="bills">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Receipt className="h-4 w-4" />
                    账单记录
                  </CardTitle>
                  <Button size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    添加账单
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">账单ID</TableHead>
                      <TableHead className="text-xs">类型</TableHead>
                      <TableHead className="text-xs">金额</TableHead>
                      <TableHead className="text-xs">状态</TableHead>
                      <TableHead className="text-xs">支付方式</TableHead>
                      <TableHead className="text-xs">支付日期</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.bills.map(bill => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-mono text-xs">{bill.id}</TableCell>
                        <TableCell className="text-xs">{bill.type}</TableCell>
                        <TableCell className="text-xs font-medium">¥{bill.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", bill.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                            {bill.status === "paid" ? "已支付" : "待支付"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{bill.method}</TableCell>
                        <TableCell className="text-xs">{bill.paidDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-xs">查看</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700">
                    提示：一笔账单可关联多个订单，例如学员交的3000元中1680元是第一科全款，1320元是后续课程定金。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 服务日志 */}
          <TabsContent value="service">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <History className="h-4 w-4" />
                    服务日志
                  </CardTitle>
                  <Button size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    添加日志
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.serviceLogs.map(log => (
                    <div key={log.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{log.type}</Badge>
                          <span className="text-xs text-muted-foreground">{log.date} {log.time}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">记录人：{log.operator}</span>
                      </div>
                      <p className="text-sm">{log.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 跟进记录 */}
          <TabsContent value="followup">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    跟进记录
                  </CardTitle>
                  <Button size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    添加跟进
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.followups.map(followup => (
                    <div key={followup.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{followup.date}</span>
                        <span className="text-xs text-muted-foreground">跟进人：{followup.operator}</span>
                      </div>
                      <p className="text-sm">{followup.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
