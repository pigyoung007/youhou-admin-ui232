"use client"

import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  MapPin,
  Phone,
  Star,
  User,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Heart,
  Plus,
  Video,
  CreditCard,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { use } from "react" // Import the use hook from react

const customerData = {
  id: "C001",
  name: "张女士",
  phone: "138****1234",
  fullPhone: "13812341234",
  wechat: "zhang_mm",
  address: "上海市浦东新区张江高科技园区",
  source: "美团推广",
  consultant: "张顾问",
  status: "active",
  intention: "high",
  tags: ["高端客户", "月嫂需求", "二胎"],
  createTime: "2025-01-15 10:30",
  lastContact: "2025-01-23 14:20",
  serviceNeeds: {
    type: "月嫂",
    expectedDate: "2025-03-15",
    duration: "26天",
    budget: "15000-20000",
    requirements: "需要有催乳经验，擅长月子餐",
  },
  followupRecords: [
    {
      time: "2025-01-23 14:20",
      type: "call",
      content: "电话跟进，客户确认3月中旬预产期，已推荐金牌月嫂李春华",
      operator: "张顾问",
      duration: "8分32秒",
    },
    {
      time: "2025-01-20 11:00",
      type: "interview",
      content: "视频面试完成，客户与李春华面试通过，待确认",
      operator: "张顾问",
    },
    {
      time: "2025-01-18 16:45",
      type: "message",
      content: "发送了3位月嫂资料，客户感兴趣李春华",
      operator: "张顾问",
    },
    {
      time: "2025-01-15 10:30",
      type: "create",
      content: "新线索录入，来源美团推广",
      operator: "系统",
    },
  ],
  orders: [
    {
      id: "ORD202501001",
      service: "金牌月嫂26天",
      amount: 18800,
      status: "pending",
      date: "2025-03-15",
    },
  ],
  recommendations: [
    {
      staff: "李春华",
      role: "金牌月嫂",
      rating: 4.9,
      status: "pending_confirm",
      sentAt: "2025-01-20",
    },
  ],
}

const typeIcons = {
  call: Phone,
  interview: Video,
  message: MessageSquare,
  create: Plus,
}

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params.id as string
  const customer = customerData

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="客户详情"
          description={`客户编号: ${customer.id}`}
        >
          <Button variant="outline" asChild>
            <Link href="/scrm/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Link>
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            联系客户
          </Button>
        </PageHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {customer.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{customer.name}</h2>
                  <p className="text-muted-foreground">{customer.phone}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="status-success">高意向</Badge>
                    <Badge variant="outline" className="status-info">活跃客户</Badge>
                  </div>
                </div>
                <Separator className="mb-6" />
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">微信: {customer.wechat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">负责人: {customer.consultant}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">来源: {customer.source}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {customer.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Needs Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  服务需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">服务类型</span>
                  <Badge variant="outline">{customer.serviceNeeds.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">预计日期</span>
                  <span>{customer.serviceNeeds.expectedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">服务周期</span>
                  <span>{customer.serviceNeeds.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">预算范围</span>
                  <span>¥{customer.serviceNeeds.budget}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">特殊要求</p>
                  <p className="text-sm">{customer.serviceNeeds.requirements}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">推荐记录</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    推荐阿姨
                    <Plus className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {customer.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-rose-50 text-rose-600 text-sm">
                        {rec.staff.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{rec.staff}</span>
                        <Badge variant="secondary" className="text-xs">{rec.role}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {rec.rating}
                        </span>
                        <span>推荐于 {rec.sentAt}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="status-warning text-xs">
                      待确认
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Orders */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="followup" className="w-full">
              <Card>
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
                    <TabsTrigger value="followup">跟进记录</TabsTrigger>
                    <TabsTrigger value="orders">订单记录</TabsTrigger>
                    <TabsTrigger value="contracts">合同记录</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="followup" className="mt-0 space-y-6">
                    {/* Add Follow-up */}
                    <div className="space-y-3">
                      <Textarea placeholder="输入跟进内容..." className="min-h-[100px]" />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5" />
                            电话
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-3.5 w-3.5 mr-1.5" />
                            面试
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            消息
                          </Button>
                        </div>
                        <Button size="sm">保存记录</Button>
                      </div>
                    </div>
                    <Separator />
                    {/* Follow-up List */}
                    <div className="space-y-4">
                      {customer.followupRecords.map((record, index) => {
                        const Icon = typeIcons[record.type as keyof typeof typeIcons]
                        return (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                index === 0 ? "bg-primary text-white" : "bg-muted"
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              {index < customer.followupRecords.length - 1 && (
                                <div className="w-0.5 flex-1 bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{record.time}</span>
                                <span className="text-xs text-muted-foreground">{record.operator}</span>
                              </div>
                              <p className="text-sm">{record.content}</p>
                              {record.duration && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  通话时长: {record.duration}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="mt-0">
                    {customer.orders.length > 0 ? (
                      <div className="space-y-4">
                        {customer.orders.map((order) => (
                          <Link key={order.id} href={`/orders/${order.id}`}>
                            <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{order.service}</span>
                                  <Badge variant="outline" className="status-warning text-xs">
                                    待服务
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  订单号: {order.id} | 计划: {order.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">¥{order.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">暂无订单记录</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          创建订单
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="contracts" className="mt-0">
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">暂无合同记录</p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        创建合同
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
