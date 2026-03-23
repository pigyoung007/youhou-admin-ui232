"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, Plus, Search, Download, Filter, Calendar, Clock, User, 
  FileText, TrendingUp, Star, Phone, MapPin, CreditCard, Package,
  ChevronRight, Edit, Eye
} from "lucide-react"

// 产康服务记录接口
interface TechServiceRecord {
  id: string
  technician: string // 技师
  technicianId: string
  date: string // 服务日期
  time: string // 服务时间
  customer: string // 客户
  customerId: string
  phone: string
  address: string
  project: string // 服务项目
  projectCategory: string // 项目分类
  sessions: number // 服务次数
  cardUsed: number // 耗卡次数
  amount: number // 金额
  duration: number // 服务时长(分钟)
  status: "待服务" | "服务中" | "已完成" | "已取消"
  rating: number // 客户评分
  feedback: string // 客户反馈
  notes: string // 备注
  packageId: string // 关联套餐卡ID
  packageName: string // 套餐卡名称
  createdAt: string
  updatedAt: string
}

// 套餐卡接口
interface PackageCard {
  id: string
  customer: string
  customerId: string
  packageName: string // 套餐名称
  packageType: string // 套餐类型
  totalSessions: number // 总次数
  usedSessions: number // 已用次数
  remainingSessions: number // 剩余次数
  totalAmount: number // 总金额
  purchaseDate: string // 购买日期
  expireDate: string // 过期日期
  status: "有效" | "已用完" | "已过期"
  consultant: string // 销售顾问
}

// 升单记录接口
interface UpgradeRecord {
  id: string
  technician: string
  customer: string
  fromService: string // 原服务
  toService: string // 升级后服务
  fromAmount: number
  toAmount: number
  upgradeAmount: number // 升单金额
  upgradeDate: string
  reason: string // 升单原因
}

// 模拟数据
const techServiceRecords: TechServiceRecord[] = [
  { id: "TS001", technician: "赵丽娜", technicianId: "T001", date: "2025-01-25", time: "09:00", customer: "刘女士", customerId: "CUS001", phone: "138****5678", address: "银川市兴庆区凤凰北街", project: "产后修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 480, duration: 60, status: "已完成", rating: 5, feedback: "非常满意，技师很专业", notes: "", packageId: "PKG001", packageName: "产康套餐8次", createdAt: "2025-01-25 09:00", updatedAt: "2025-01-25 10:05" },
  { id: "TS002", technician: "孙技师", technicianId: "T002", date: "2025-01-25", time: "10:30", customer: "王女士", customerId: "CUS002", phone: "139****1234", address: "银川市金凤区万达广场", project: "盆底修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 580, duration: 90, status: "已完成", rating: 4, feedback: "效果不错", notes: "", packageId: "PKG002", packageName: "盆底修复套餐", createdAt: "2025-01-25 10:30", updatedAt: "2025-01-25 12:05" },
  { id: "TS003", technician: "李技师", technicianId: "T003", date: "2025-01-25", time: "14:00", customer: "陈女士", customerId: "CUS003", phone: "137****9876", address: "银川市西夏区怀远路", project: "腹直肌修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 520, duration: 75, status: "服务中", rating: 0, feedback: "", notes: "首次服务", packageId: "PKG003", packageName: "腹直肌修复套餐", createdAt: "2025-01-25 14:00", updatedAt: "2025-01-25 14:00" },
  { id: "TS004", technician: "赵丽娜", technicianId: "T001", date: "2025-01-25", time: "16:00", customer: "张女士", customerId: "CUS004", phone: "136****5432", address: "银川市兴庆区民族街", project: "骨盆矫正", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 680, duration: 90, status: "待服务", rating: 0, feedback: "", notes: "VIP客户", packageId: "PKG004", packageName: "全套产康套餐", createdAt: "2025-01-24 16:00", updatedAt: "2025-01-24 16:00" },
  { id: "TS005", technician: "孙技师", technicianId: "T002", date: "2025-01-24", time: "09:30", customer: "赵女士", customerId: "CUS005", phone: "135****7890", address: "银川市金凤区正源街", project: "产后修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 480, duration: 60, status: "已完成", rating: 5, feedback: "很棒", notes: "", packageId: "PKG005", packageName: "产康套餐8次", createdAt: "2025-01-24 09:30", updatedAt: "2025-01-24 10:35" },
  { id: "TS006", technician: "李技师", technicianId: "T003", date: "2025-01-24", time: "11:00", customer: "周女士", customerId: "CUS006", phone: "158****2345", address: "银川市兴庆区解放街", project: "开奶服务", projectCategory: "催乳服务", sessions: 1, cardUsed: 0, amount: 380, duration: 45, status: "已完成", rating: 5, feedback: "效果立竿见影", notes: "新生儿妈妈", packageId: "", packageName: "单次服务", createdAt: "2025-01-24 11:00", updatedAt: "2025-01-24 11:50" },
  { id: "TS007", technician: "赵丽娜", technicianId: "T001", date: "2025-01-23", time: "14:00", customer: "吴女士", customerId: "CUS007", phone: "186****6789", address: "银川市西夏区贺兰山路", project: "产后修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 480, duration: 60, status: "已完成", rating: 4, feedback: "服务态度好", notes: "", packageId: "PKG006", packageName: "产康套餐12次", createdAt: "2025-01-23 14:00", updatedAt: "2025-01-23 15:05" },
  { id: "TS008", technician: "孙技师", technicianId: "T002", date: "2025-01-23", time: "16:30", customer: "郑女士", customerId: "CUS008", phone: "139****0123", address: "银川市金凤区阅海万家", project: "盆底修复", projectCategory: "产康服务", sessions: 1, cardUsed: 1, amount: 580, duration: 90, status: "已完成", rating: 5, feedback: "专业", notes: "", packageId: "PKG007", packageName: "盆底修复套餐", createdAt: "2025-01-23 16:30", updatedAt: "2025-01-23 18:05" },
]

const packageCards: PackageCard[] = [
  { id: "PKG001", customer: "刘女士", customerId: "CUS001", packageName: "产康套餐8次", packageType: "产后修复", totalSessions: 8, usedSessions: 3, remainingSessions: 5, totalAmount: 3800, purchaseDate: "2025-01-10", expireDate: "2025-07-10", status: "有效", consultant: "张顾问" },
  { id: "PKG002", customer: "王女士", customerId: "CUS002", packageName: "盆底修复套餐", packageType: "盆底修复", totalSessions: 12, usedSessions: 5, remainingSessions: 7, totalAmount: 6800, purchaseDate: "2025-01-05", expireDate: "2025-07-05", status: "有效", consultant: "李顾问" },
  { id: "PKG003", customer: "陈女士", customerId: "CUS003", packageName: "腹直肌修复套餐", packageType: "腹直肌修复", totalSessions: 10, usedSessions: 1, remainingSessions: 9, totalAmount: 5200, purchaseDate: "2025-01-20", expireDate: "2025-07-20", status: "有效", consultant: "王顾问" },
  { id: "PKG004", customer: "张女士", customerId: "CUS004", packageName: "全套产康套餐", packageType: "综合服务", totalSessions: 20, usedSessions: 8, remainingSessions: 12, totalAmount: 9800, purchaseDate: "2024-12-15", expireDate: "2025-06-15", status: "有效", consultant: "张顾问" },
  { id: "PKG005", customer: "赵女士", customerId: "CUS005", packageName: "产康套餐8次", packageType: "产后修复", totalSessions: 8, usedSessions: 8, remainingSessions: 0, totalAmount: 3800, purchaseDate: "2024-11-01", expireDate: "2025-05-01", status: "已用完", consultant: "李顾问" },
  { id: "PKG006", customer: "吴女士", customerId: "CUS007", packageName: "产康套餐12次", packageType: "产后修复", totalSessions: 12, usedSessions: 4, remainingSessions: 8, totalAmount: 5200, purchaseDate: "2025-01-03", expireDate: "2025-07-03", status: "有效", consultant: "张顾问" },
]

const upgradeRecords: UpgradeRecord[] = [
  { id: "UP001", technician: "赵丽娜", customer: "刘女士", fromService: "产康套餐8次", toService: "全套产康套餐", fromAmount: 3800, toAmount: 9800, upgradeAmount: 6000, upgradeDate: "2025-01-20", reason: "客户对效果满意，希望全面修复" },
  { id: "UP002", technician: "孙技师", customer: "王女士", fromService: "盆底修复单次", toService: "盆底修复套餐", fromAmount: 580, toAmount: 6800, upgradeAmount: 6220, upgradeDate: "2025-01-15", reason: "单次体验后决定购买套餐" },
  { id: "UP003", technician: "李技师", customer: "周女士", fromService: "基础产康", toService: "进阶产康套餐", fromAmount: 2800, toAmount: 5200, upgradeAmount: 2400, upgradeDate: "2025-01-18", reason: "效果好，想要更全面的服务" },
]

// 统计数据
function getStats() {
  const today = "2025-01-25"
  const thisWeekStart = "2025-01-20"
  const thisMonthStart = "2025-01-01"
  
  const todayRecords = techServiceRecords.filter(r => r.date === today)
  const weekRecords = techServiceRecords.filter(r => r.date >= thisWeekStart)
  const monthRecords = techServiceRecords.filter(r => r.date >= thisMonthStart)
  
  return {
    todayServices: todayRecords.length,
    todayAmount: todayRecords.reduce((sum, r) => sum + r.amount, 0),
    weekServices: weekRecords.length,
    weekAmount: weekRecords.reduce((sum, r) => sum + r.amount, 0),
    monthServices: monthRecords.length,
    monthAmount: monthRecords.reduce((sum, r) => sum + r.amount, 0),
    avgRating: (techServiceRecords.filter(r => r.rating > 0).reduce((sum, r) => sum + r.rating, 0) / techServiceRecords.filter(r => r.rating > 0).length).toFixed(1),
    upgradeRate: ((upgradeRecords.length / packageCards.length) * 100).toFixed(1),
  }
}

export default function TechServicesPage() {
  const [activeTab, setActiveTab] = useState("records")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTechnician, setFilterTechnician] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPackageDialog, setShowPackageDialog] = useState(false)
  
  const stats = getStats()
  
  // 筛选服务记录
  const filteredRecords = techServiceRecords.filter(record => {
    const matchSearch = record.customer.includes(searchTerm) || record.technician.includes(searchTerm) || record.project.includes(searchTerm)
    const matchTechnician = filterTechnician === "all" || record.technician === filterTechnician
    const matchStatus = filterStatus === "all" || record.status === filterStatus
    return matchSearch && matchTechnician && matchStatus
  })
  
  // 获取技师列表
  const technicians = [...new Set(techServiceRecords.map(r => r.technician))]
  
  // 按技师统计
  const technicianStats = technicians.map(tech => {
    const records = techServiceRecords.filter(r => r.technician === tech && r.status === "已完成")
    const upgrades = upgradeRecords.filter(u => u.technician === tech)
    return {
      technician: tech,
      serviceCount: records.length,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      avgRating: records.length > 0 ? (records.reduce((sum, r) => sum + r.rating, 0) / records.length).toFixed(1) : "0",
      upgradeCount: upgrades.length,
      upgradeAmount: upgrades.reduce((sum, u) => sum + u.upgradeAmount, 0),
    }
  })
  
  // 按项目统计耗卡
  const projectStats = [...new Set(techServiceRecords.map(r => r.project))].map(project => {
    const records = techServiceRecords.filter(r => r.project === project && r.status === "已完成")
    return {
      project,
      totalUsed: records.reduce((sum, r) => sum + r.cardUsed, 0),
      monthUsed: records.filter(r => r.date >= "2025-01-01").reduce((sum, r) => sum + r.cardUsed, 0),
      customerCount: new Set(records.map(r => r.customerId)).size,
      avgUsed: records.length > 0 ? (records.reduce((sum, r) => sum + r.cardUsed, 0) / new Set(records.map(r => r.customerId)).size).toFixed(1) : "0",
    }
  })

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                产康服务记录
              </h1>
              <p className="text-sm text-muted-foreground mt-1">管理产康技师上门服务记录、套餐卡耗卡、升单情况</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    套餐卡管理
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>套餐卡管理</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>客户</TableHead>
                          <TableHead>套餐名称</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>总/已用/剩余</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>有效期</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {packageCards.map(pkg => (
                          <TableRow key={pkg.id}>
                            <TableCell className="font-medium">{pkg.customer}</TableCell>
                            <TableCell>{pkg.packageName}</TableCell>
                            <TableCell>{pkg.packageType}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-xs">{pkg.usedSessions}/{pkg.totalSessions}次</div>
                                <Progress value={(pkg.usedSessions / pkg.totalSessions) * 100} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>¥{pkg.totalAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs">{pkg.expireDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                pkg.status === "有效" ? "bg-green-50 text-green-700" :
                                pkg.status === "已用完" ? "bg-blue-50 text-blue-700" :
                                "bg-red-50 text-red-700"
                              }>
                                {pkg.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新增服务记录
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新增产康服务记录</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>技师</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="选择技师" /></SelectTrigger>
                        <SelectContent>
                          {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>客户</Label>
                      <Input placeholder="输入客户姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label>服务日期</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>服务时间</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>服务项目</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="选择项目" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="产后修复">产后修复</SelectItem>
                          <SelectItem value="盆底修复">盆底修复</SelectItem>
                          <SelectItem value="腹直肌修复">腹直肌修复</SelectItem>
                          <SelectItem value="骨盆矫正">骨盆矫正</SelectItem>
                          <SelectItem value="开奶服务">开奶服务</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>关联套餐卡</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="选择套餐卡" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">无(单次服务)</SelectItem>
                          {packageCards.filter(p => p.status === "有效").map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.customer} - {p.packageName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>服务时长(分钟)</Label>
                      <Input type="number" placeholder="60" />
                    </div>
                    <div className="space-y-2">
                      <Label>金额</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>客户地址</Label>
                      <Input placeholder="输入服务地址" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>备注</Label>
                      <Textarea placeholder="备注信息" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)} className="bg-transparent">取消</Button>
                    <Button onClick={() => setShowAddDialog(false)}>保存</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">今日服务</p>
                    <p className="text-xl font-bold">{stats.todayServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">本周服务</p>
                    <p className="text-xl font-bold">{stats.weekServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">本月业绩</p>
                    <p className="text-xl font-bold">¥{stats.monthAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Star className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">平均评分</p>
                    <p className="text-xl font-bold">{stats.avgRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100">
                    <TrendingUp className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">升单率</p>
                    <p className="text-xl font-bold">{stats.upgradeRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="records">服务记录</TabsTrigger>
              <TabsTrigger value="technician">技师统计</TabsTrigger>
              <TabsTrigger value="project">项目耗卡</TabsTrigger>
              <TabsTrigger value="upgrade">升单记录</TabsTrigger>
            </TabsList>

            {/* 服务记录 */}
            <TabsContent value="records" className="space-y-4">
              {/* 筛选栏 */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="搜索客户、技师、项目..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="选择技师" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部技师</SelectItem>
                        {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="待服务">待服务</SelectItem>
                        <SelectItem value="服务中">服务中</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                        <SelectItem value="已取消">已取消</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      导出
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 服务记录表格 */}
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日期/时间</TableHead>
                          <TableHead>技师</TableHead>
                          <TableHead>客户</TableHead>
                          <TableHead>服务项目</TableHead>
                          <TableHead>套餐卡</TableHead>
                          <TableHead>耗卡</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>时长</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>评分</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="text-sm">{record.date}</div>
                              <div className="text-xs text-muted-foreground">{record.time}</div>
                            </TableCell>
                            <TableCell className="font-medium">{record.technician}</TableCell>
                            <TableCell>
                              <div>{record.customer}</div>
                              <div className="text-xs text-muted-foreground">{record.phone}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.project}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{record.packageName || "-"}</TableCell>
                            <TableCell>{record.cardUsed}次</TableCell>
                            <TableCell className="font-medium">¥{record.amount}</TableCell>
                            <TableCell>{record.duration}分钟</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                record.status === "已完成" ? "bg-green-50 text-green-700" :
                                record.status === "服务中" ? "bg-blue-50 text-blue-700" :
                                record.status === "待服务" ? "bg-amber-50 text-amber-700" :
                                "bg-red-50 text-red-700"
                              }>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.rating > 0 ? (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span>{record.rating}</span>
                                </div>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 技师统计 */}
            <TabsContent value="technician" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">技师业绩统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>技师</TableHead>
                        <TableHead>服务次数</TableHead>
                        <TableHead>服务金额</TableHead>
                        <TableHead>平均评分</TableHead>
                        <TableHead>升单数</TableHead>
                        <TableHead>升单金额</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {technicianStats.map(stat => (
                        <TableRow key={stat.technician}>
                          <TableCell className="font-medium">{stat.technician}</TableCell>
                          <TableCell>{stat.serviceCount}次</TableCell>
                          <TableCell className="font-medium">¥{stat.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {stat.avgRating}
                            </div>
                          </TableCell>
                          <TableCell>{stat.upgradeCount}单</TableCell>
                          <TableCell className="text-emerald-600">¥{stat.upgradeAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 项目耗卡统计 */}
            <TabsContent value="project" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">服务项目耗卡统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>项目名称</TableHead>
                        <TableHead>总耗卡次数</TableHead>
                        <TableHead>本月耗卡</TableHead>
                        <TableHead>服务客户数</TableHead>
                        <TableHead>平均耗卡</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectStats.map(stat => (
                        <TableRow key={stat.project}>
                          <TableCell className="font-medium">{stat.project}</TableCell>
                          <TableCell>{stat.totalUsed}次</TableCell>
                          <TableCell>{stat.monthUsed}次</TableCell>
                          <TableCell>{stat.customerCount}人</TableCell>
                          <TableCell>{stat.avgUsed}次/人</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 升单记录 */}
            <TabsContent value="upgrade" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">升单记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>日期</TableHead>
                        <TableHead>技师</TableHead>
                        <TableHead>客户</TableHead>
                        <TableHead>原服务</TableHead>
                        <TableHead>升级服务</TableHead>
                        <TableHead>升单金额</TableHead>
                        <TableHead>升单原因</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upgradeRecords.map(record => (
                        <TableRow key={record.id}>
                          <TableCell>{record.upgradeDate}</TableCell>
                          <TableCell className="font-medium">{record.technician}</TableCell>
                          <TableCell>{record.customer}</TableCell>
                          <TableCell>
                            <div className="text-sm">{record.fromService}</div>
                            <div className="text-xs text-muted-foreground">¥{record.fromAmount}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              <div>
                                <div className="text-sm">{record.toService}</div>
                                <div className="text-xs text-muted-foreground">¥{record.toAmount}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-emerald-600">+¥{record.upgradeAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">{record.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminLayout>
  )
}
