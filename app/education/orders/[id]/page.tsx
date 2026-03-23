"use client"

import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, FileText, User, Calendar, DollarSign, Star, Phone, MapPin, 
  Edit, FileSignature, Clock, CheckCircle2, XCircle, TrendingUp, 
  CreditCard, Receipt, MessageSquare, History, Printer, Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 订单状态配置
const statusConfig = {
  pending: { label: "待服务", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  active: { label: "培训中", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
  completed: { label: "已结业", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const payStatusConfig = {
  unpaid: { label: "未支付", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "部分付", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "已付清", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Mock订单数据
const mockOrders: Record<string, {
  id: string
  customer: string
  phone: string
  idCard: string
  address: string
  courseName: string
  className: string
  serviceType: string
  amount: number
  paidAmount: number
  status: "pending" | "active" | "completed" | "cancelled"
  payStatus: "unpaid" | "partial" | "paid" | "refunded"
  instructor: string
  instructorRating: number
  startDate: string
  endDate: string
  createTime: string
  source: string
  consultant: string
  notes: string
  // 账单信息
  bills: { id: string; type: string; amount: number; paidAt: string; method: string; status: "paid" | "unpaid" }[]
  // 跟进记录
  followUps: { id: string; time: string; operator: string; content: string; type: string }[]
  // 连报信息
  bundleCourses?: { name: string; amount: number; status: string }[]
}> = {
  "EDU202501001": {
    id: "EDU202501001",
    customer: "李春华",
    phone: "138****1234",
    idCard: "640***********1234",
    address: "宁夏银川市金凤区正源北街某小区12栋3单元501",
    courseName: "高级月嫂培训班",
    className: "2025年第1期",
    serviceType: "月嫂培训",
    amount: 3800,
    paidAmount: 3800,
    status: "active",
    payStatus: "paid",
    instructor: "王老师",
    instructorRating: 4.9,
    startDate: "2025-01-15",
    endDate: "2025-02-28",
    createTime: "2025-01-10 14:30",
    source: "线上报名",
    consultant: "张顾问",
    notes: "学员学习态度积极，出勤率100%",
    bills: [
      { id: "B001", type: "报名费（全款）", amount: 3800, paidAt: "2025-01-10 14:35", method: "微信支付", status: "paid" },
    ],
    followUps: [
      { id: "F001", time: "2025-01-20 10:00", operator: "王老师", content: "学员理论学习进度良好，实操技能掌握较快", type: "学习跟进" },
      { id: "F002", time: "2025-01-15 09:00", operator: "张顾问", content: "学员已完成报到，领取教材和校服", type: "入学跟进" },
      { id: "F003", time: "2025-01-10 14:30", operator: "张顾问", content: "学员完成报名缴费，预约1月15日开课班级", type: "报名跟进" },
    ],
  },
  "EDU202501002": {
    id: "EDU202501002",
    customer: "王秀兰",
    phone: "139****5678",
    idCard: "640***********5678",
    address: "宁夏银川市兴庆区解放西街某小区",
    courseName: "产康师初级培训",
    className: "2024年第4期",
    serviceType: "产康培训",
    amount: 2800,
    paidAmount: 2800,
    status: "completed",
    payStatus: "paid",
    instructor: "李老师",
    instructorRating: 4.8,
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    createTime: "2024-11-25 09:15",
    source: "老学员介绍",
    consultant: "李顾问",
    notes: "已结业，成绩优秀，推荐上岗",
    bills: [
      { id: "B001", type: "报名费（全款）", amount: 2800, paidAt: "2024-11-25 09:20", method: "支付宝", status: "paid" },
    ],
    followUps: [
      { id: "F001", time: "2025-01-15 16:00", operator: "李老师", content: "学员顺利结业，考核成绩优秀，已颁发结业证书", type: "结业跟进" },
      { id: "F002", time: "2025-01-10 14:00", operator: "李顾问", content: "学员即将结业，已推荐至合作门店面试", type: "就业跟进" },
    ],
  },
  "EDU202501003": {
    id: "EDU202501003",
    customer: "张美玲",
    phone: "137****9012",
    idCard: "640***********9012",
    address: "宁夏银川市西夏区贺兰山路某小区",
    courseName: "育婴师培训班",
    className: "2025年第1期",
    serviceType: "育婴培训",
    amount: 2500,
    paidAmount: 1250,
    status: "active",
    payStatus: "partial",
    instructor: "陈老师",
    instructorRating: 4.7,
    startDate: "2025-01-20",
    endDate: "2025-03-10",
    createTime: "2025-01-05 16:45",
    source: "抖音推广",
    consultant: "王顾问",
    notes: "分期付款学员，尾款预计培训结束前支付",
    bills: [
      { id: "B001", type: "报名费（首付）", amount: 1250, paidAt: "2025-01-05 16:50", method: "微信支付", status: "paid" },
      { id: "B002", type: "报名费（尾款）", amount: 1250, paidAt: "", method: "", status: "unpaid" },
    ],
    followUps: [
      { id: "F001", time: "2025-01-22 11:00", operator: "王顾问", content: "电话提醒学员尾款支付事宜，学员表示月底支付", type: "付款跟进" },
      { id: "F002", time: "2025-01-20 09:00", operator: "陈老师", content: "学员正常入学，课程进行中", type: "学习跟进" },
    ],
    bundleCourses: [
      { name: "育婴师培训班", amount: 2500, status: "培训中" },
      { name: "小儿推拿培训", amount: 1800, status: "待开课" },
    ],
  },
}

export default function EducationOrderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const order = mockOrders[id]

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <FileText className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">订单不存在</h2>
          <p className="text-muted-foreground">订单 {id} 未找到</p>
          <Button asChild>
            <Link href="/education/orders"><ArrowLeft className="h-4 w-4 mr-2" />返回订单列表</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const StatusIcon = statusConfig[order.status].icon

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/education/orders"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">培训订单详情</h1>
                <Badge variant="outline" className={cn("text-xs", statusConfig[order.status].color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[order.status].label}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", payStatusConfig[order.payStatus].color)}>
                  {payStatusConfig[order.payStatus].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />编辑订单</Button>
            <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />打印</Button>
            <Button size="sm"><FileSignature className="h-4 w-4 mr-2" />生成合同</Button>
          </div>
        </div>

        {/* 主体内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 学员信息 */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />学员信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">学员姓名</p>
                    <p className="text-sm font-medium">{order.customer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">联系电话</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />{order.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">身份证号</p>
                    <p className="text-sm font-medium">{order.idCard}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">招生顾问</p>
                    <p className="text-sm font-medium">{order.consultant}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">联系地址</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{order.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 课程信息 */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />课程信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 rounded-lg border bg-primary/5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{order.serviceType}</Badge>
                    <span className="text-2xl font-bold text-primary">¥{order.amount.toLocaleString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{order.courseName}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">班级：</span>
                      <span>{order.className}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">讲师：</span>
                      <span>{order.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">开始日期：</span>
                      <span>{order.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">结束日期：</span>
                      <span>{order.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* 连报信息 */}
                {order.bundleCourses && order.bundleCourses.length > 1 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">连报课程</p>
                    <div className="space-y-2">
                      {order.bundleCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded border bg-muted/30">
                          <span className="text-sm">{course.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">¥{course.amount}</span>
                            <Badge variant="outline" className="text-xs">{course.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tab切换：账单/跟进记录 */}
            <Card>
              <Tabs defaultValue="bills">
                <CardHeader className="py-3 pb-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bills" className="text-xs"><Receipt className="h-3 w-3 mr-1" />账单明细</TabsTrigger>
                    <TabsTrigger value="followups" className="text-xs"><History className="h-3 w-3 mr-1" />跟进记录</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="bills" className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">费用类型</TableHead>
                          <TableHead className="text-xs">金额</TableHead>
                          <TableHead className="text-xs">支付方式</TableHead>
                          <TableHead className="text-xs">支付时间</TableHead>
                          <TableHead className="text-xs">状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.bills.map(bill => (
                          <TableRow key={bill.id}>
                            <TableCell className="text-sm">{bill.type}</TableCell>
                            <TableCell className="text-sm font-medium">¥{bill.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm">{bill.method || "-"}</TableCell>
                            <TableCell className="text-sm">{bill.paidAt || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("text-xs", bill.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                                {bill.status === "paid" ? "已付" : "待付"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {order.payStatus !== "paid" && (
                      <div className="flex justify-end mt-4">
                        <Button size="sm"><CreditCard className="h-4 w-4 mr-2" />收款</Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="followups" className="mt-0">
                    <div className="space-y-3">
                      {order.followUps.map(record => (
                        <div key={record.id} className="flex gap-3 p-3 rounded-lg border bg-muted/20">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{record.operator[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{record.operator}</span>
                                <Badge variant="secondary" className="text-xs">{record.type}</Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{record.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{record.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" />添加跟进</Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-6">
            {/* 付款汇总 */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />付款信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">订单金额</span>
                  <span className="text-lg font-bold">¥{order.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                  <span className="text-sm text-emerald-600">已付金额</span>
                  <span className="text-lg font-bold text-emerald-700">¥{order.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                  <span className="text-sm text-amber-600">待付金额</span>
                  <span className="text-lg font-bold text-amber-700">¥{(order.amount - order.paidAmount).toLocaleString()}</span>
                </div>
                {order.payStatus !== "paid" && (
                  <Button className="w-full" size="sm"><CreditCard className="h-4 w-4 mr-2" />立即收款</Button>
                )}
              </CardContent>
            </Card>

            {/* 培训讲师 */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />培训讲师
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">{order.instructor[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{order.instructor}</p>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm">{order.instructorRating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 其他信息 */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">报名来源</span>
                  <span className="text-sm">{order.source}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">招生顾问</span>
                  <span className="text-sm">{order.consultant}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">创建时间</span>
                  <span className="text-sm">{order.createTime}</span>
                </div>
                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">备注</span>
                      <p className="text-sm mt-1 p-2 rounded bg-amber-50 text-amber-800">{order.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
