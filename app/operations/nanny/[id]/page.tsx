"use client"

import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Star, 
  Award,
  FileText,
  Clock,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Shield,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Download,
  CreditCard,
  Heart,
  User,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServiceAvailability, type ServicePeriod } from "@/components/operations/service-availability"
import { use } from "react" // Added import for use

const nannyData = {
  id: "N001",
  name: "李春华",
  avatar: "/placeholder.svg",
  phone: "139****1234",
  fullPhone: "13912341234",
  age: 35,
  hometown: "安徽合肥",
  currentLocation: "上海浦东",
  status: "working",
  level: "金牌月嫂",
  rating: 4.9,
  reviewCount: 128,
  experience: "8年",
  salary: "15000-18000",
  joinDate: "2020-03-15",
  idCard: "340***********1234",
  address: "上海市浦东新区xxx路xxx弄xxx号",
  emergencyContact: "李先生 (丈夫) 138****5678",
  certificates: [
    { name: "高级母婴护理师", level: "高级", issueDate: "2022-03-15", expireDate: "2027-03-15", status: "valid", issuer: "人社部" },
    { name: "催乳师证书", level: "高级", issueDate: "2021-08-20", expireDate: "2026-08-20", status: "valid", issuer: "卫健委" },
    { name: "营养师证", level: "中级", issueDate: "2023-06-10", expireDate: "2028-06-10", status: "valid", issuer: "人社部" },
    { name: "健康证", level: "-", issueDate: "2024-06-01", expireDate: "2025-06-01", status: "expiring", issuer: "疾控中心" },
  ],
  skills: ["月子餐制作", "新生儿护理", "产妇护理", "催乳通乳", "早教启蒙", "双胞胎护理"],
  insurance: {
    status: "valid",
    policyNo: "INS202501001",
    company: "中国人保",
    coverage: 1000000,
    expiry: "2025-06-30",
  },
  serviceHistory: [
    { id: "ORD202401001", customer: "张女士", phone: "138****1234", period: "2024-02-15 ~ 服务中", type: "月嫂服务", amount: 18800, rating: null, status: "active" },
    { id: "ORD202312001", customer: "刘女士", phone: "139****5678", period: "2023-12-01 ~ 2023-12-28", type: "月嫂服务", amount: 16800, rating: 5.0, status: "completed" },
    { id: "ORD202310001", customer: "陈女士", phone: "137****9012", period: "2023-10-10 ~ 2023-11-06", type: "月嫂服务", amount: 15800, rating: 4.9, status: "completed" },
    { id: "ORD202308001", customer: "王女士", phone: "136****3456", period: "2023-08-05 ~ 2023-09-01", type: "月嫂服务", amount: 15800, rating: 4.8, status: "completed" },
  ],
  trainings: [
    { id: "T001", name: "高级月嫂技能提升班", date: "2024-01-10", hours: 40, score: 95, status: "completed", certificate: true },
    { name: "新生儿急救培训", date: "2023-11-15", hours: 16, score: 92, status: "completed", certificate: true },
    { name: "产后康复护理", date: "2023-09-20", hours: 24, score: 88, status: "completed", certificate: false },
    { name: "营养月子餐制作", date: "2023-06-10", hours: 32, score: 96, status: "completed", certificate: true },
  ],
  payroll: {
    lastMonth: 16800,
    thisMonth: 0,
    totalEarnings: 186000,
    pendingSettlement: 18800,
  },
  contracts: [
    { id: "CT202401001", customer: "张女士", status: "in_effect", amount: 18800, date: "2025-02-15" },
    { id: "CT202312001", customer: "刘女士", status: "completed", amount: 16800, date: "2024-12-01" },
  ],
  schedule: [
    { date: "2025-01-23", time: "全天", customer: "张女士", address: "浦东新区xxx", type: "上户服务", status: "current" },
    { date: "2025-01-24", time: "全天", customer: "张女士", address: "浦东新区xxx", type: "上户服务", status: "scheduled" },
    { date: "2025-01-25", time: "14:00-16:00", customer: "-", address: "公司培训室", type: "技能培训", status: "scheduled" },
    { date: "2025-03-15", time: "待定", customer: "待分配", address: "-", type: "待接单", status: "available" },
  ],
  serviceAvailability: [
    { id: "SA001", startDate: "2025-01-15", endDate: "2025-03-14", type: "contract" as const, source: "合同约定" as const, contractId: "CT202401001", note: "张女士订单" },
    { id: "SA002", startDate: "2025-03-15", endDate: "2025-03-20", type: "rest" as const, source: "个人设置" as const, note: "订单结束后休息" },
    { id: "SA003", startDate: "2025-03-21", endDate: "2025-06-30", type: "available" as const, source: "顾问设置" as const },
  ]
}

const statusConfig = {
  available: { label: "待接单", className: "status-success" },
  working: { label: "服务中", className: "status-info" },
  vacation: { label: "休假中", className: "status-neutral" },
  training: { label: "培训中", className: "status-warning" },
}

const certStatusConfig = {
  valid: { label: "有效", className: "status-success" },
  expiring: { label: "即将到期", className: "status-warning" },
  expired: { label: "已过期", className: "status-error" },
}

export default function NannyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const nanny = nannyData

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="服务人员详情"
          description={`工号: ${nanny.id}`}
        >
          <Button variant="outline" asChild>
            <Link href="/operations/nanny">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            生成简历
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            编辑资料
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>调整状态</DropdownMenuItem>
              <DropdownMenuItem>安排排班</DropdownMenuItem>
              <DropdownMenuItem>查看合同</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">停用账号</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PageHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={nanny.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-rose-50 text-rose-600 text-2xl font-semibold">
                      {nanny.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">{nanny.name}</h2>
                    <Badge className="bg-amber-500 text-white">{nanny.level}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{nanny.rating}</span>
                    <span>({nanny.reviewCount}条评价)</span>
                  </div>
                  <Badge variant="outline" className={`mt-3 ${statusConfig[nanny.status as keyof typeof statusConfig].className}`}>
                    {statusConfig[nanny.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>

                <div className="flex gap-2 mb-6">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1.5" />
                    拨打
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    消息
                  </Button>
                </div>

                <Separator className="mb-6" />

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">年龄</span>
                    <span>{nanny.age}岁</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">籍贯</span>
                    <span>{nanny.hometown}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">从业经验</span>
                    <span>{nanny.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">入职日期</span>
                    <span>{nanny.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">期望薪资</span>
                    <span className="font-medium text-primary">¥{nanny.salary}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{nanny.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">紧急联系人: {nanny.emergencyContact}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {nanny.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insurance Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-600" />
                  保险信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">保险状态</span>
                  <Badge variant="outline" className={nanny.insurance.status === "valid" ? "status-success" : "status-warning"}>
                    {nanny.insurance.status === "valid" ? "有效" : "即将到期"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">保单号</span>
                  <span>{nanny.insurance.policyNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">保险公司</span>
                  <span>{nanny.insurance.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">保额</span>
                  <span>¥{(nanny.insurance.coverage / 10000)}万</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">有效期至</span>
                  <span>{nanny.insurance.expiry}</span>
                </div>
                <Button variant="outline" className="w-full mt-2 bg-transparent" size="sm" asChild>
                  <Link href={`/contracts/insurance?policy=${nanny.insurance.policyNo}`}>
                    查看详情
                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardContent>
</Card>

              {/* 可服务时段 */}
              <ServiceAvailability periods={nanny.serviceAvailability} />
  
              {/* Payroll Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    收入概况
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">累计收入</span>
                    <span className="font-semibold">¥{nanny.payroll.totalEarnings.toLocaleString()}</span>
                  </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">上月收入</span>
                  <span>¥{nanny.payroll.lastMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">待结算</span>
                  <span className="text-amber-600">¥{nanny.payroll.pendingSettlement.toLocaleString()}</span>
                </div>
                <Button variant="outline" className="w-full mt-2 bg-transparent" size="sm" asChild>
                  <Link href={`/finance/payroll?staff=${nanny.id}`}>
                    查看详情
                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="certificates" className="space-y-6">
              <Card>
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="certificates">证书资质</TabsTrigger>
                    <TabsTrigger value="history">服务记录</TabsTrigger>
                    <TabsTrigger value="training">培训记录</TabsTrigger>
                    <TabsTrigger value="schedule">排班日程</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="certificates" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      {nanny.certificates.map((cert, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{cert.name}</p>
                                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={certStatusConfig[cert.status as keyof typeof certStatusConfig].className}>
                              {certStatusConfig[cert.status as keyof typeof certStatusConfig].label}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">等级</span>
                              <span>{cert.level}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">发证日期</span>
                              <span>{cert.issueDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">有效期至</span>
                              <span className={cert.status === "expiring" ? "text-amber-600" : ""}>{cert.expireDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-0">
                    <div className="space-y-4">
                      {nanny.serviceHistory.map((record) => (
                        <Link key={record.id} href={`/orders/${record.id}`}>
                          <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                              record.status === "active" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                            }`}>
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium group-hover:text-primary transition-colors">{record.customer}</span>
                                <Badge variant="outline" className={record.status === "active" ? "status-info" : "status-success"}>
                                  {record.status === "active" ? "服务中" : "已完成"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{record.period}</p>
                              <p className="text-xs text-muted-foreground">{record.type} | 订单号: {record.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">¥{record.amount.toLocaleString()}</p>
                              {record.rating && (
                                <div className="flex items-center justify-end gap-1 text-sm">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  <span>{record.rating}</span>
                                </div>
                              )}
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="training" className="mt-0">
                    <div className="space-y-4">
                      {nanny.trainings.map((training, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{training.name}</span>
                              {training.certificate && (
                                <Badge variant="outline" className="text-xs status-success">
                                  <Award className="h-3 w-3 mr-1" />
                                  有证书
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {training.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {training.hours}课时
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <Progress value={training.score} className="w-20 h-2" />
                              <span className="text-sm font-semibold">{training.score}分</span>
                            </div>
                            <Badge variant="outline" className="status-success text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              已完成
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-0">
                    <div className="space-y-4">
                      {nanny.schedule.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            item.status === "current" ? "bg-blue-50/50 border-blue-200" : ""
                          }`}
                        >
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            item.status === "current" ? "bg-blue-100 text-blue-600" : 
                            item.status === "available" ? "bg-green-100 text-green-600" : 
                            "bg-muted"
                          }`}>
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.date}</span>
                              <Badge variant="outline" className={`text-xs ${
                                item.status === "current" ? "status-info" :
                                item.status === "available" ? "status-success" :
                                "status-neutral"
                              }`}>
                                {item.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {item.time}
                              </span>
                              {item.customer !== "-" && item.customer !== "待分配" && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {item.customer}
                                </span>
                              )}
                              {item.address !== "-" && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {item.address}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.status === "current" && (
                            <Badge className="bg-blue-500">当前</Badge>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/operations/scheduling">
                          <Calendar className="h-4 w-4 mr-2" />
                          查看完整排班日历
                        </Link>
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      关联合同
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                      <Link href={`/contracts/list?staff=${nanny.id}`}>
                        查看全部
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nanny.contracts.map((contract) => (
                      <Link key={contract.id} href={`/contracts/detail/${contract.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium group-hover:text-primary transition-colors">{contract.id}</p>
                              <p className="text-xs text-muted-foreground">{contract.customer} | {contract.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-primary">¥{contract.amount.toLocaleString()}</span>
                            <Badge variant="outline" className={contract.status === "in_effect" ? "status-info" : "status-success"}>
                              {contract.status === "in_effect" ? "生效中" : "已完成"}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
