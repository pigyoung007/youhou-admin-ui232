"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Settings,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 目标类型
type TargetType = "commission" | "revenue" | "orders" | "newCustomers" | "conversion"
type TargetPeriod = "monthly" | "quarterly" | "yearly"

// 佣金目标接口
interface CommissionTarget {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  period: TargetPeriod
  periodLabel: string // 如 "2025年1月" 或 "2025年Q1"
  targetType: TargetType
  targetValue: number
  achievedValue: number
  achievementRate: number
  status: "not-started" | "in-progress" | "completed" | "exceeded"
  createdAt: string
  updatedAt: string
}

// 目标设置接口
interface TargetSetting {
  id: string
  employeeId: string
  employeeName: string
  department: string
  commissionTarget: number
  revenueTarget: number
  ordersTarget: number
  newCustomersTarget: number
  conversionTarget: number
  period: string
}

// 模拟目标数据
const mockTargets: CommissionTarget[] = [
  {
    id: "TGT001",
    employeeId: "EMP001",
    employeeName: "张顾问",
    department: "居家服务事业部",
    position: "母婴顾问",
    period: "monthly",
    periodLabel: "2025年1月",
    targetType: "commission",
    targetValue: 15000,
    achievedValue: 12800,
    achievementRate: 85.3,
    status: "in-progress",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-25",
  },
  {
    id: "TGT002",
    employeeId: "EMP002",
    employeeName: "李顾问",
    department: "居家服务事业部",
    position: "母婴顾问",
    period: "monthly",
    periodLabel: "2025年1月",
    targetType: "commission",
    targetValue: 12000,
    achievedValue: 14200,
    achievementRate: 118.3,
    status: "exceeded",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-25",
  },
  {
    id: "TGT003",
    employeeId: "EMP003",
    employeeName: "王顾问",
    department: "人才孵化事业部",
    position: "职业顾问",
    period: "monthly",
    periodLabel: "2025年1月",
    targetType: "commission",
    targetValue: 10000,
    achievedValue: 8600,
    achievementRate: 86.0,
    status: "in-progress",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-25",
  },
  {
    id: "TGT004",
    employeeId: "EMP004",
    employeeName: "赵顾问",
    department: "居家服务事业部",
    position: "产康顾问",
    period: "monthly",
    periodLabel: "2025年1月",
    targetType: "commission",
    targetValue: 8000,
    achievedValue: 5200,
    achievementRate: 65.0,
    status: "in-progress",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-25",
  },
  {
    id: "TGT005",
    employeeId: "EMP005",
    employeeName: "孙顾问",
    department: "人才孵化事业部",
    position: "职业顾问",
    period: "monthly",
    periodLabel: "2025年1月",
    targetType: "commission",
    targetValue: 10000,
    achievedValue: 10000,
    achievementRate: 100.0,
    status: "completed",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-23",
  },
]

// 部门目标汇总
const departmentSummary = [
  { 
    department: "居家服务事业部", 
    targetTotal: 35000, 
    achievedTotal: 32200, 
    achievementRate: 92.0,
    employeeCount: 3,
    completedCount: 1,
    exceededCount: 1,
  },
  { 
    department: "人才孵化事业部", 
    targetTotal: 20000, 
    achievedTotal: 18600, 
    achievementRate: 93.0,
    employeeCount: 2,
    completedCount: 1,
    exceededCount: 0,
  },
]

// 年度目标汇总
const yearlyTargets = {
  totalTarget: 660000,
  achievedTotal: 125600,
  achievementRate: 19.0,
  monthsCompleted: 1,
  onTrack: true,
}

// 统计数据
const statsData = {
  totalEmployees: 5,
  completedCount: 1,
  exceededCount: 1,
  avgAchievementRate: 90.9,
}

// 目标详情弹窗
function TargetDetailDialog({ target }: { target: CommissionTarget }) {
  const statusConfig = {
    "not-started": { label: "未开始", className: "bg-gray-50 text-gray-700", icon: Minus },
    "in-progress": { label: "进行中", className: "bg-blue-50 text-blue-700", icon: TrendingUp },
    "completed": { label: "已完成", className: "bg-green-50 text-green-700", icon: Award },
    "exceeded": { label: "超额完成", className: "bg-emerald-50 text-emerald-700", icon: ArrowUp },
  }

  const StatusIcon = statusConfig[target.status].icon

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            目标详情
            <Badge variant="outline" className={cn("text-[10px] ml-2", statusConfig[target.status].className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[target.status].label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* 员工信息 */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {target.employeeName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{target.employeeName}</p>
              <p className="text-xs text-muted-foreground">{target.department} · {target.position}</p>
            </div>
          </div>

          {/* 目标进度 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{target.periodLabel} 佣金目标</span>
              <Badge variant="outline" className={cn(
                "text-xs",
                target.achievementRate >= 100 ? "bg-emerald-50 text-emerald-700" :
                target.achievementRate >= 80 ? "bg-blue-50 text-blue-700" :
                target.achievementRate >= 60 ? "bg-amber-50 text-amber-700" :
                "bg-red-50 text-red-700"
              )}>
                完成 {target.achievementRate.toFixed(1)}%
              </Badge>
            </div>

            <div className="space-y-1.5">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    target.achievementRate >= 100 ? "bg-emerald-500" :
                    target.achievementRate >= 80 ? "bg-blue-500" :
                    target.achievementRate >= 60 ? "bg-amber-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${Math.min(target.achievementRate, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>已完成: ¥{target.achievedValue.toLocaleString()}</span>
                <span>目标: ¥{target.targetValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 差距分析 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">剩余目标</p>
              <p className={cn(
                "text-sm font-bold",
                target.achievedValue >= target.targetValue ? "text-emerald-600" : "text-amber-600"
              )}>
                {target.achievedValue >= target.targetValue 
                  ? `+¥${(target.achievedValue - target.targetValue).toLocaleString()}`
                  : `¥${(target.targetValue - target.achievedValue).toLocaleString()}`
                }
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">日均需完成</p>
              <p className="text-sm font-bold text-primary">
                ¥{target.achievedValue >= target.targetValue 
                  ? "0"
                  : Math.ceil((target.targetValue - target.achievedValue) / 6).toLocaleString()
                }
              </p>
            </div>
          </div>

          {/* 历史对比 */}
          <div className="p-3 rounded-lg border">
            <p className="text-xs font-medium mb-2">历史对比</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">上月完成</span>
              <span className="flex items-center gap-1">
                ¥14,500
                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">
                  <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                  8%
                </Badge>
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t bg-muted/30">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
            <Edit className="h-3 w-3 mr-1" />
            调整目标
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 设置目标弹窗
function SetTargetDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          设置目标
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            设置员工目标
          </DialogTitle>
          <DialogDescription className="text-xs">
            为员工设置月度/季度/年度业绩目标
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* 员工选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">选择员工</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择员工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">张顾问 - 居家服务事业部</SelectItem>
                  <SelectItem value="2">李顾问 - 居家服务事业部</SelectItem>
                  <SelectItem value="3">王顾问 - 人才孵化事业部</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 目标周期 */}
            <div className="space-y-1.5">
              <Label className="text-xs">目标周期</Label>
              <Select defaultValue="monthly">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月度目标</SelectItem>
                  <SelectItem value="quarterly">季度目标</SelectItem>
                  <SelectItem value="yearly">年度目标</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 时间选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">目标时间</Label>
              <Select defaultValue="202502">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="202502">2025年2月</SelectItem>
                  <SelectItem value="202503">2025年3月</SelectItem>
                  <SelectItem value="202504">2025年4月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 目标设置 */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium">目标设置</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    佣金目标 (元)
                  </Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" defaultValue="15000" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    业绩目标 (元)
                  </Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" defaultValue="150000" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-purple-600" />
                    订单目标 (单)
                  </Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" defaultValue="8" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-600" />
                    新客户目标 (个)
                  </Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" defaultValue="20" />
                </div>
              </div>
            </div>

            {/* 参考数据 */}
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-xs font-medium mb-2">参考数据（上月）</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">佣金完成</span>
                  <span className="font-medium">¥14,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">业绩完成</span>
                  <span className="font-medium">¥145,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">订单完成</span>
                  <span className="font-medium">7单</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">新客户</span>
                  <span className="font-medium">18个</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">保存目标</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 批量设置弹窗
function BatchSetDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
          <Settings className="h-4 w-4" />
          批量设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-primary" />
            批量设置目标
          </DialogTitle>
          <DialogDescription className="text-xs">
            为部门或全体员工批量设置目标
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">选择范围</Label>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部员工</SelectItem>
                <SelectItem value="home">居家服务事业部</SelectItem>
                <SelectItem value="training">人才孵化事业部</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">目标周期</Label>
            <Select defaultValue="202502">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="202502">2025年2月</SelectItem>
                <SelectItem value="2025Q1">2025年Q1</SelectItem>
                <SelectItem value="2025">2025年度</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">设置方式</Label>
            <Select defaultValue="same">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same">统一目标</SelectItem>
                <SelectItem value="increase">按上月增长10%</SelectItem>
                <SelectItem value="increase20">按上月增长20%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">佣金目标 (元)</Label>
            <Input type="number" placeholder="统一设置的目标值" className="h-8 text-xs" />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">批量设置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TargetsPage() {
  const [currentTab, setCurrentTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const statusConfig = {
    "not-started": { label: "未开始", className: "bg-gray-50 text-gray-700" },
    "in-progress": { label: "进行中", className: "bg-blue-50 text-blue-700" },
    "completed": { label: "已完成", className: "bg-green-50 text-green-700" },
    "exceeded": { label: "超额完成", className: "bg-emerald-50 text-emerald-700" },
  }

  const filteredTargets = mockTargets.filter(target => {
    if (currentTab === "exceeded") return target.status === "exceeded"
    if (currentTab === "completed") return target.status === "completed"
    if (currentTab === "in-progress") return target.status === "in-progress"
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">目标设定</h1>
            <p className="text-muted-foreground mt-1">设置和跟踪员工佣金及业绩目标</p>
          </div>
          <div className="flex gap-2">
            <BatchSetDialog />
            <SetTargetDialog />
          </div>
        </div>

        {/* 年度目标卡片 */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">2025年度总目标</h3>
                <p className="text-2xl font-bold">¥{(yearlyTargets.totalTarget / 10000).toFixed(0)}万</p>
              </div>
              <div className="flex-1 max-w-md space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">年度进度</span>
                  <span className="font-medium">{yearlyTargets.achievementRate}%</span>
                </div>
                <Progress value={yearlyTargets.achievementRate} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>已完成: ¥{(yearlyTargets.achievedTotal / 10000).toFixed(1)}万</span>
                  <span>已过 {yearlyTargets.monthsCompleted}/12 月</span>
                </div>
              </div>
              <Badge variant="outline" className={cn(
                "text-xs h-7",
                yearlyTargets.onTrack ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              )}>
                {yearlyTargets.onTrack ? "进度正常" : "进度落后"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.totalEmployees}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">有目标员工</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 flex-shrink-0">
                  <Award className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.completedCount}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">已达标</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                  <ArrowUp className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.exceededCount}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">超额完成</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.avgAchievementRate}%</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">平均完成率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 部门汇总 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              部门目标汇总 - 2025年1月
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">部门</TableHead>
                    <TableHead className="text-xs text-center">人数</TableHead>
                    <TableHead className="text-xs text-right">目标总额</TableHead>
                    <TableHead className="text-xs text-right">完成总额</TableHead>
                    <TableHead className="text-xs text-center">完成率</TableHead>
                    <TableHead className="text-xs text-center">达标/超额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentSummary.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell className="text-xs font-medium">{dept.department}</TableCell>
                      <TableCell className="text-xs text-center">{dept.employeeCount}</TableCell>
                      <TableCell className="text-xs text-right">¥{dept.targetTotal.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right font-medium text-emerald-600">
                        ¥{dept.achievedTotal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          dept.achievementRate >= 90 ? "bg-green-50 text-green-700" :
                          dept.achievementRate >= 70 ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        )}>
                          {dept.achievementRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        {dept.completedCount + dept.exceededCount}/{dept.employeeCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 筛选和标签 */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs">进行中</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">已达标</TabsTrigger>
              <TabsTrigger value="exceeded" className="text-xs">超额完成</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select defaultValue="202501">
              <SelectTrigger className="w-full sm:w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="202501">2025年1月</SelectItem>
                <SelectItem value="202412">2024年12月</SelectItem>
                <SelectItem value="202411">2024年11月</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-36 h-9">
                <SelectValue placeholder="部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                <SelectItem value="home">居家服务事业部</SelectItem>
                <SelectItem value="training">人才孵化事业部</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 目标列表 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">员工</TableHead>
                    <TableHead className="text-xs">部门</TableHead>
                    <TableHead className="text-xs">周期</TableHead>
                    <TableHead className="text-xs text-right">目标</TableHead>
                    <TableHead className="text-xs text-right">完成</TableHead>
                    <TableHead className="text-xs text-center">进度</TableHead>
                    <TableHead className="text-xs text-center">状态</TableHead>
                    <TableHead className="text-xs text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <TableRow key={target.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {target.employeeName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{target.employeeName}</p>
                            <p className="text-[10px] text-muted-foreground">{target.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{target.department}</TableCell>
                      <TableCell className="text-xs">{target.periodLabel}</TableCell>
                      <TableCell className="text-xs text-right">¥{target.targetValue.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right font-medium text-emerald-600">
                        ¥{target.achievedValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                target.achievementRate >= 100 ? "bg-emerald-500" :
                                target.achievementRate >= 80 ? "bg-blue-500" :
                                target.achievementRate >= 60 ? "bg-amber-500" :
                                "bg-red-500"
                              )}
                              style={{ width: `${Math.min(target.achievementRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-10">
                            {target.achievementRate.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-[10px]", statusConfig[target.status].className)}>
                          {statusConfig[target.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <TargetDetailDialog target={target} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">{filteredTargets.length}</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8">1</Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
