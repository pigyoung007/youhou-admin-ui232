"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { NannyDetailPanel } from "@/components/family-service/nanny-detail-panel"
import { CompactScheduleTimeline, type ScheduleBlock } from "@/components/family-service/schedule-timeline"
import {
  Plus, Search, Filter, Download, Upload, Eye, Edit, Phone, Star,
  Calendar, MapPin, Award, Clock, User, Heart, Baby, MoreHorizontal,
  FileText, CheckCircle, XCircle, AlertTriangle, ChevronRight
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// 家政员类型
type NannyType = "nanny" | "infant" | "elder" | "housekeeper"
const nannyTypeConfig: Record<NannyType, { label: string; color: string }> = {
  nanny: { label: "月嫂", color: "bg-pink-100 text-pink-700" },
  infant: { label: "育婴师", color: "bg-blue-100 text-blue-700" },
  elder: { label: "养老护理", color: "bg-amber-100 text-amber-700" },
  housekeeper: { label: "保姆", color: "bg-green-100 text-green-700" },
}

// 状态配置
type NannyStatus = "available" | "working" | "training" | "leave" | "resigned"
const statusConfig: Record<NannyStatus, { label: string; color: string }> = {
  available: { label: "待派单", color: "bg-green-100 text-green-700" },
  working: { label: "在户中", color: "bg-blue-100 text-blue-700" },
  training: { label: "培训中", color: "bg-amber-100 text-amber-700" },
  leave: { label: "请假", color: "bg-gray-100 text-gray-700" },
  resigned: { label: "已离职", color: "bg-red-100 text-red-700" },
}

// 星级配置
const starLevelConfig: Record<number, { label: string; color: string }> = {
  1: { label: "一星", color: "text-gray-400" },
  2: { label: "二星", color: "text-gray-500" },
  3: { label: "三星", color: "text-amber-400" },
  4: { label: "四星", color: "text-amber-500" },
  5: { label: "五星", color: "text-amber-600" },
  6: { label: "金牌", color: "text-orange-500" },
}

// Mock数据
const mockNannies = [
  {
    id: "NY001",
    name: "李秀英",
    type: "nanny" as NannyType,
    phone: "138****5678",
    age: 45,
    status: "working" as NannyStatus,
    starLevel: 5,
    certificates: ["高级母婴护理师", "催乳师"],
    experience: "8年",
    hometown: "河南郑州",
    currentOrder: "DD202603001",
    currentCustomer: "张女士",
    serviceEndDate: "2026-04-15",
    totalOrders: 28,
    avgRating: 4.8,
    consultant: "王顾问",
    joinDate: "2018-06-15",
    // 排班数据
    schedules: [
      { id: "s1", startDate: "2026-01-11", endDate: "2026-02-10", type: "booked" as const, customerName: "王女士" },
      { id: "s2", startDate: "2026-02-11", endDate: "2026-02-15", type: "training" as const },
      { id: "s3", startDate: "2026-03-01", endDate: "2026-04-15", type: "booked" as const, customerName: "张女士" },
    ] as ScheduleBlock[],
  },
  {
    id: "NY002",
    name: "张玉兰",
    type: "nanny" as NannyType,
    phone: "139****1234",
    age: 42,
    status: "available" as NannyStatus,
    starLevel: 4,
    certificates: ["高级母婴护理师"],
    experience: "5年",
    hometown: "安徽合肥",
    currentOrder: null,
    currentCustomer: null,
    serviceEndDate: null,
    totalOrders: 15,
    avgRating: 4.6,
    consultant: "刘顾问",
    joinDate: "2021-03-20",
    schedules: [
      { id: "s1", startDate: "2026-01-05", endDate: "2026-01-25", type: "booked" as const, customerName: "李女士" },
      { id: "s2", startDate: "2026-04-20", endDate: "2026-05-20", type: "booked" as const, customerName: "赵女士" },
    ] as ScheduleBlock[],
  },
  {
    id: "YY001",
    name: "王秀芳",
    type: "infant" as NannyType,
    phone: "137****9876",
    age: 38,
    status: "working" as NannyStatus,
    starLevel: 4,
    certificates: ["高级育婴师", "早教指导师"],
    experience: "6年",
    hometown: "山东济南",
    currentOrder: "DD202603005",
    currentCustomer: "李先生",
    serviceEndDate: "2026-05-20",
    totalOrders: 22,
    avgRating: 4.7,
    consultant: "陈顾问",
    joinDate: "2020-01-10",
    schedules: [
      { id: "s1", startDate: "2026-03-18", endDate: "2026-05-20", type: "booked" as const, customerName: "李先生" },
    ] as ScheduleBlock[],
  },
  {
    id: "YL001",
    name: "刘桂芬",
    type: "elder" as NannyType,
    phone: "136****5432",
    age: 50,
    status: "training" as NannyStatus,
    starLevel: 3,
    certificates: ["养老护理员"],
    experience: "3年",
    hometown: "四川成都",
    currentOrder: null,
    currentCustomer: null,
    serviceEndDate: null,
    totalOrders: 8,
    avgRating: 4.5,
    consultant: "张顾问",
    joinDate: "2023-08-05",
    schedules: [
      { id: "s1", startDate: "2026-03-10", endDate: "2026-03-25", type: "training" as const },
      { id: "s2", startDate: "2026-03-26", endDate: "2026-03-31", type: "rest" as const },
    ] as ScheduleBlock[],
  },
  {
    id: "BM001",
    name: "赵淑珍",
    type: "housekeeper" as NannyType,
    phone: "135****7890",
    age: 48,
    status: "available" as NannyStatus,
    starLevel: 3,
    certificates: ["家政服务员"],
    experience: "4年",
    hometown: "江苏徐州",
    currentOrder: null,
    currentCustomer: null,
    serviceEndDate: null,
    totalOrders: 12,
    avgRating: 4.4,
    consultant: "王顾问",
    joinDate: "2022-05-18",
    schedules: [] as ScheduleBlock[],
  },
]

// 统计数据
const statsData = {
  total: 186,
  available: 45,
  working: 98,
  training: 23,
  leave: 15,
  resigned: 5,
  avgRating: 4.6,
}

export default function NannyManagementPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNanny, setSelectedNanny] = useState<typeof mockNannies[0] | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleViewDetail = (nanny: typeof mockNannies[0]) => {
    setSelectedNanny(nanny)
    setShowDetailPanel(true)
  }

  // 业务流程跳转回调函数
  const handleCall = (nanny: typeof mockNannies[0]) => {
    // TODO: 实现拨打电话功能
    console.log("拨打电话:", nanny.phone)
  }

  const handleSchedule = (nanny: typeof mockNannies[0]) => {
    // 跳转到排班管理页面，查看该家政员的排班
    router.push(`/family-service/scheduling?nannyId=${nanny.id}&nannyName=${nanny.name}`)
  }

  const handleAssignOrder = (nanny: typeof mockNannies[0]) => {
    // 跳转到创建订单页面，预先选择该家政员
    router.push(`/family-service/orders?action=create&nannyId=${nanny.id}&nannyName=${nanny.name}`)
  }

  const handleViewOrders = (nanny: typeof mockNannies[0]) => {
    // 跳转到服务订单页面，筛选该家政员的所有订单
    router.push(`/family-service/orders?filter=nanny&nannyId=${nanny.id}`)
  }

  const handleViewContract = (nanny: typeof mockNannies[0]) => {
    // TODO: 实现查看合同功能
    console.log("查看合同:", nanny.id)
  }

  const filteredNannies = mockNannies.filter(n => {
    if (activeTab !== "all" && n.type !== activeTab) return false
    if (typeFilter !== "all" && n.type !== typeFilter) return false
    if (statusFilter !== "all" && n.status !== statusFilter) return false
    if (searchTerm && !n.name.includes(searchTerm) && !n.id.includes(searchTerm) && !n.phone.includes(searchTerm)) return false
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">家政员管理</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理月嫂、育婴师、养老护理、保姆等家政服务人员档案
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Upload className="h-4 w-4 mr-1" />导入
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />导出
            </Button>
            <Button size="sm" className="h-8" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />新增家政员
            </Button>
          </div>
        </div>

        {/* 分类Tab + 筛选 */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent">
                <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  全部 ({mockNannies.length})
                </TabsTrigger>
                <TabsTrigger value="nanny" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  月嫂 ({mockNannies.filter(n => n.type === "nanny").length})
                </TabsTrigger>
                <TabsTrigger value="infant" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  育婴师 ({mockNannies.filter(n => n.type === "infant").length})
                </TabsTrigger>
                <TabsTrigger value="elder" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  养老护理 ({mockNannies.filter(n => n.type === "elder").length})
                </TabsTrigger>
                <TabsTrigger value="housekeeper" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  保姆 ({mockNannies.filter(n => n.type === "housekeeper").length})
                </TabsTrigger>
              </TabsList>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索姓名、编号、手机号..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="工作状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="available">待派单</SelectItem>
                    <SelectItem value="working">在户中</SelectItem>
                    <SelectItem value="training">培训中</SelectItem>
                    <SelectItem value="leave">请假</SelectItem>
                    <SelectItem value="resigned">已离职</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-1" />更多筛选
                </Button>
              </div>
            </CardContent>
          </Tabs>
        </Card>

        {/* 家政员列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[80px]">编号</TableHead>
                <TableHead className="min-w-[150px]">姓名</TableHead>
                <TableHead className="w-[80px]">类型</TableHead>
                <TableHead className="w-[80px]">星级</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="min-w-[200px]">档期</TableHead>
                <TableHead className="w-[80px]">订单数</TableHead>
                <TableHead className="w-[80px]">评分</TableHead>
                <TableHead className="w-[100px]">负责顾问</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNannies.map((nanny) => (
                <TableRow key={nanny.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetail(nanny)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{nanny.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{nanny.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{nanny.name}</div>
                        <div className="text-xs text-muted-foreground">{nanny.phone} · {nanny.age}岁</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", nannyTypeConfig[nanny.type].color)}>
                      {nannyTypeConfig[nanny.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: Math.min(nanny.starLevel, 5) }).map((_, i) => (
                        <Star key={i} className={cn("h-3 w-3 fill-current", starLevelConfig[nanny.starLevel]?.color || "text-amber-400")} />
                      ))}
                      {nanny.starLevel === 6 && <span className="text-xs text-orange-500 ml-1">金牌</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", statusConfig[nanny.status].color)}>
                      {statusConfig[nanny.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <CompactScheduleTimeline 
                      schedules={nanny.schedules || []}
                      startMonth={new Date(2026, 0, 1)}
                      monthCount={4}
                    />
                  </TableCell>
                  <TableCell className="text-center">{nanny.totalOrders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{nanny.avgRating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{nanny.consultant}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(nanny)}>
                          <Eye className="h-4 w-4 mr-2" />查看档案
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />编辑信息
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />拨打电话
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {nanny.status === "available" && (
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />安排上户
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Award className="h-4 w-4 mr-2" />证书管理
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 新增家政员对话框 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>新增家政员</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名 *</Label>
                  <Input placeholder="请输入姓名" />
                </div>
                <div className="space-y-2">
                  <Label>类型 *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="请选择类型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nanny">月嫂</SelectItem>
                      <SelectItem value="infant">育婴师</SelectItem>
                      <SelectItem value="elder">养老护理</SelectItem>
                      <SelectItem value="housekeeper">保姆</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>手机号 *</Label>
                  <Input placeholder="请输入手机号" />
                </div>
                <div className="space-y-2">
                  <Label>年龄</Label>
                  <Input type="number" placeholder="请输入年龄" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>籍贯</Label>
                  <Input placeholder="请输入籍贯" />
                </div>
                <div className="space-y-2">
                  <Label>工作经验</Label>
                  <Input placeholder="如: 5年" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>持有证书</Label>
                <Textarea placeholder="请输入持有的证书，多个证书用逗号分隔" />
              </div>
              <div className="space-y-2">
                <Label>负责顾问 *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="请选择负责顾问" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wang">王顾问</SelectItem>
                    <SelectItem value="liu">刘顾问</SelectItem>
                    <SelectItem value="chen">陈顾问</SelectItem>
                    <SelectItem value="zhang">张顾问</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
              <Button onClick={() => setShowCreateDialog(false)}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 家政员详情侧边面板 */}
        {selectedNanny && (
          <NannyDetailPanel
            nanny={selectedNanny}
            open={showDetailPanel}
            onOpenChange={setShowDetailPanel}
            onCall={handleCall}
            onSchedule={handleSchedule}
            onAssignOrder={handleAssignOrder}
            onViewOrders={handleViewOrders}
            onViewContract={handleViewContract}
          />
        )}
      </div>
    </AdminLayout>
  )
}
