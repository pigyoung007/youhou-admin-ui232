"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

import {
  Search,
  UserPlus,
  Check,
  X,
  Clock,
  Star,
  Heart,
  MapPin,
  Calendar,
  Phone,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Video,
  FileText,
} from "lucide-react"

interface Recommendation {
  id: string
  employer: {
    name: string
    phone: string
    requirement: string
    budget: string
    dueDate: string
  }
  caregiver: {
    name: string
    avatar?: string
    role: string
    level: string
    age: number
    hometown: string
    experience: string
    salary: string
    rating: number
    skills: string[]
  }
  consultant: string
  recommendedAt: string
  status: "pending" | "confirmed" | "rejected" | "replaced"
  confirmedAt?: string
  rejectionReason?: string
}

const mockRecommendations: Recommendation[] = [
  {
    id: "R001",
    employer: {
      name: "张女士",
      phone: "138****1234",
      requirement: "金牌月嫂，3月中旬预产期",
      budget: "15000-20000",
      dueDate: "2025-03-15",
    },
    caregiver: {
      name: "李春华",
      role: "月嫂",
      level: "金牌",
      age: 45,
      hometown: "四川成都",
      experience: "8年",
      salary: "18800/月",
      rating: 4.9,
      skills: ["新生儿护理", "产妇护理", "月子餐", "早教启蒙"],
    },
    consultant: "李顾问",
    recommendedAt: "2025-01-23 10:30",
    status: "pending",
  },
  {
    id: "R002",
    employer: {
      name: "刘先生",
      phone: "139****5678",
      requirement: "育婴师，宝宝3个月大",
      budget: "8000-12000",
      dueDate: "2025-02-01",
    },
    caregiver: {
      name: "王秀兰",
      role: "育婴师",
      level: "高级",
      age: 42,
      hometown: "湖南长沙",
      experience: "6年",
      salary: "10800/月",
      rating: 4.8,
      skills: ["辅食制作", "早教", "宝宝抚触", "睡眠训练"],
    },
    consultant: "王顾问",
    recommendedAt: "2025-01-22 15:45",
    status: "confirmed",
    confirmedAt: "2025-01-22 18:20",
  },
  {
    id: "R003",
    employer: {
      name: "陈女士",
      phone: "137****9012",
      requirement: "产康技师，产后恢复",
      budget: "200-300/次",
      dueDate: "2025-01-30",
    },
    caregiver: {
      name: "张美玲",
      role: "产康技师",
      level: "高级",
      age: 38,
      hometown: "江苏南京",
      experience: "5年",
      salary: "280/次",
      rating: 4.9,
      skills: ["骨盆修复", "腹直肌修复", "产后瑜伽", "乳腺疏通"],
    },
    consultant: "张顾问",
    recommendedAt: "2025-01-21 11:20",
    status: "rejected",
    rejectionReason: "时间不合适",
  },
]

function CaregiverDetailDialog({ caregiver }: { caregiver: Recommendation["caregiver"] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          查看详情
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>服务人员详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={caregiver.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-rose-500/10 text-rose-600 text-xl">
                {caregiver.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{caregiver.name}</h3>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                  {caregiver.level}{caregiver.role}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{caregiver.age}岁</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {caregiver.hometown}
                </span>
                <span>{caregiver.experience}经验</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{caregiver.rating}</span>
                <span className="text-muted-foreground text-sm">(128条评价)</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium mb-2">专业技能</h4>
            <div className="flex flex-wrap gap-2">
              {caregiver.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">期望薪资</span>
              <span className="text-lg font-semibold text-primary">{caregiver.salary}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              联系阿姨
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              查看简历
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReplaceDialog({ recommendation }: { recommendation: Recommendation }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCcw className="h-3 w-3 mr-1" />
          更换
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>更换推荐人员</DialogTitle>
          <DialogDescription>
            为 {recommendation.employer.name} 更换推荐的服务人员
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">当前推荐</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-rose-500/10 text-rose-600">
                  {recommendation.caregiver.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{recommendation.caregiver.name}</p>
                <p className="text-xs text-muted-foreground">
                  {recommendation.caregiver.level}{recommendation.caregiver.role}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">选择新的服务人员</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="搜索或选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zhao">赵丽华 - 金牌月嫂</SelectItem>
                <SelectItem value="sun">孙秀英 - 高级月嫂</SelectItem>
                <SelectItem value="zhou">周小红 - 金牌月嫂</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">更换原因</label>
            <textarea
              className="w-full min-h-[80px] p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="请输入更换原因..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">取消</Button>
          <Button>确认更换</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmActionDialog({
  recommendation,
  action,
}: {
  recommendation: Recommendation
  action: "confirm" | "reject"
}) {
  const isConfirm = action === "confirm"

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isConfirm ? (
          <Button size="sm">
            <Check className="h-3 w-3 mr-1" />
            确认
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <X className="h-3 w-3 mr-1" />
            拒绝
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isConfirm ? "确认推荐" : "拒绝推荐"}</DialogTitle>
          <DialogDescription>
            {isConfirm
              ? `确认将 ${recommendation.caregiver.name} 推荐给 ${recommendation.employer.name}？`
              : `确定拒绝 ${recommendation.caregiver.name} 的推荐吗？`}
          </DialogDescription>
        </DialogHeader>

        {isConfirm ? (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700">确认后将执行以下操作：</p>
                  <ul className="mt-2 text-sm text-green-600 space-y-1">
                    <li>1. 通知顾问推荐已确认</li>
                    <li>2. 自动创建面试安排待办</li>
                    <li>3. 发送短信通知服务人员</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">拒绝原因</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择原因" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">时间不合适</SelectItem>
                  <SelectItem value="price">价格超出预算</SelectItem>
                  <SelectItem value="skill">技能不符合要求</SelectItem>
                  <SelectItem value="other">其他原因</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">补充说明（可选）</label>
              <textarea
                className="w-full min-h-[80px] p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="请输入补充说明..."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline">取消</Button>
          <Button variant={isConfirm ? "default" : "destructive"}>
            {isConfirm ? "确认推荐" : "拒绝推荐"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function RecommendationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("pending")
  const searchParams = useSearchParams()

  const statusConfig = {
    pending: { label: "待确认", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    confirmed: { label: "已确认", className: "bg-green-500/10 text-green-600 border-green-500/30" },
    rejected: { label: "已拒绝", className: "bg-red-500/10 text-red-600 border-red-500/30" },
    replaced: { label: "已更换", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  }

  const filteredRecommendations = mockRecommendations.filter((r) =>
    activeTab === "all" ? true : r.status === activeTab
  )

  const pendingCount = mockRecommendations.filter((r) => r.status === "pending").length

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">推荐确认</h1>
              <p className="text-muted-foreground mt-1">管理顾问推荐的服务人员确认流程</p>
            </div>
            {pendingCount > 0 && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 px-3 py-1.5">
                <AlertCircle className="h-4 w-4 mr-1" />
                {pendingCount} 条待确认
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">待确认</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">86</p>
                    <p className="text-sm text-muted-foreground">已确认</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-muted-foreground">已安排面试</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">72%</p>
                    <p className="text-sm text-muted-foreground">确认率</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs & Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                  <TabsList>
                    <TabsTrigger value="pending" className="relative">
                      待确认
                      {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                          {pendingCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="confirmed">已确认</TabsTrigger>
                    <TabsTrigger value="rejected">已拒绝</TabsTrigger>
                    <TabsTrigger value="all">全部</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索雇主/服务人员" className="pl-9 w-full md:w-60" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="顾问" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部顾问</SelectItem>
                      <SelectItem value="li">李顾问</SelectItem>
                      <SelectItem value="wang">王顾问</SelectItem>
                      <SelectItem value="zhang">张顾问</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Employer Info */}
                    <div className="lg:w-1/3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm text-muted-foreground">雇主信息</h4>
                        <Badge variant="outline" className={statusConfig[rec.status].className}>
                          {statusConfig[rec.status].label}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {rec.employer.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{rec.employer.name}</p>
                            <p className="text-xs text-muted-foreground">{rec.employer.phone}</p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">
                            需求: <span className="text-foreground">{rec.employer.requirement}</span>
                          </p>
                          <p className="text-muted-foreground">
                            预算: <span className="text-foreground">{rec.employer.budget}</span>
                          </p>
                          <p className="text-muted-foreground">
                            预产期: <span className="text-foreground">{rec.employer.dueDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Caregiver Info */}
                    <div className="lg:w-1/3 p-4 bg-rose-500/5 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">推荐人员</h4>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={rec.caregiver.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-rose-500/10 text-rose-600">
                            {rec.caregiver.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{rec.caregiver.name}</p>
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                              {rec.caregiver.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.caregiver.role}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{rec.caregiver.age}岁</span>
                            <span>{rec.caregiver.hometown}</span>
                            <span>{rec.caregiver.experience}经验</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{rec.caregiver.rating}</span>
                          </div>
                          <p className="text-sm font-medium text-primary mt-1">{rec.caregiver.salary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/3 flex flex-col justify-between">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>推荐顾问: {rec.consultant}</p>
                        <p>推荐时间: {rec.recommendedAt}</p>
                        {rec.confirmedAt && <p>确认时间: {rec.confirmedAt}</p>}
                        {rec.rejectionReason && (
                          <p className="text-red-500">拒绝原因: {rec.rejectionReason}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <CaregiverDetailDialog caregiver={rec.caregiver} />
                        {rec.status === "pending" && (
                          <>
                            <ReplaceDialog recommendation={rec} />
                            <ConfirmActionDialog recommendation={rec} action="reject" />
                            <ConfirmActionDialog recommendation={rec} action="confirm" />
                          </>
                        )}
                        {rec.status === "confirmed" && (
                          <Button size="sm">
                            <Video className="h-3 w-3 mr-1" />
                            安排面试
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">98</span> 条记录
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
