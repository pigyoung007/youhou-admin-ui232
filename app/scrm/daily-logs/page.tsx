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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  FileText,
  Phone,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  Target,
  MessageSquare,
  Video,
  UserPlus,
  DollarSign,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 员工日志数据接口
interface DailyLog {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  // 自动统计字段（来自电话系统/CRM）
  assignedLeads: number // 分配数据量
  callCount: number // 呼出次数
  callDuration: number // 通话时长（分钟）
  connectedCount: number // 接通次数
  connectedRate: number // 接通率
  // 手动填写字段
  wechatContacts: number // 微信联系次数
  interviewCount: number // 面试量
  newSignCount: number // 新签量
  performanceAmount: number // 业绩完成
  tomorrowPlan: string // 明日计划
  workSummary: string // 工作总结
  difficulties: string // 遇到的困难
  // 状态
  status: "draft" | "submitted" | "approved"
  submittedAt: string
  approvedBy: string
  approvedAt: string
}

// 模拟数据
const mockLogs: DailyLog[] = [
  {
    id: "LOG001",
    employeeId: "EMP001",
    employeeName: "张顾问",
    department: "居家服务事业部",
    date: "2025-01-25",
    assignedLeads: 15,
    callCount: 45,
    callDuration: 128,
    connectedCount: 38,
    connectedRate: 84.4,
    wechatContacts: 12,
    interviewCount: 3,
    newSignCount: 1,
    performanceAmount: 18800,
    tomorrowPlan: "继续跟进3个高意向客户，安排2个面试",
    workSummary: "今日完成45通电话外呼，成功签约1单金牌月嫂服务",
    difficulties: "部分客户对价格比较敏感，需要更多话术支持",
    status: "submitted",
    submittedAt: "2025-01-25 18:30",
    approvedBy: "",
    approvedAt: "",
  },
  {
    id: "LOG002",
    employeeId: "EMP002",
    employeeName: "李顾问",
    department: "居家服务事业部",
    date: "2025-01-25",
    assignedLeads: 12,
    callCount: 38,
    callDuration: 95,
    connectedCount: 30,
    connectedRate: 78.9,
    wechatContacts: 8,
    interviewCount: 2,
    newSignCount: 0,
    performanceAmount: 0,
    tomorrowPlan: "跟进昨日面试的2个客户，争取签约",
    workSummary: "今日外呼38通，面试2个客户，暂无签约",
    difficulties: "有2个客户还在比较其他公司",
    status: "approved",
    submittedAt: "2025-01-25 18:00",
    approvedBy: "王经理",
    approvedAt: "2025-01-25 19:00",
  },
  {
    id: "LOG003",
    employeeId: "EMP003",
    employeeName: "王顾问",
    department: "人才孵化事业部",
    date: "2025-01-25",
    assignedLeads: 10,
    callCount: 32,
    callDuration: 85,
    connectedCount: 28,
    connectedRate: 87.5,
    wechatContacts: 15,
    interviewCount: 4,
    newSignCount: 2,
    performanceAmount: 5600,
    tomorrowPlan: "完成新学员的入学手续办理",
    workSummary: "今日新增2名培训学员，收款5600元",
    difficulties: "无",
    status: "submitted",
    submittedAt: "2025-01-25 17:45",
    approvedBy: "",
    approvedAt: "",
  },
  {
    id: "LOG004",
    employeeId: "EMP001",
    employeeName: "张顾问",
    department: "居家服务事业部",
    date: "2025-01-24",
    assignedLeads: 18,
    callCount: 52,
    callDuration: 145,
    connectedCount: 42,
    connectedRate: 80.8,
    wechatContacts: 10,
    interviewCount: 2,
    newSignCount: 1,
    performanceAmount: 15000,
    tomorrowPlan: "继续跟进今日未成交的高意向客户",
    workSummary: "完成52通电话，签约1单高级月嫂服务",
    difficulties: "客户预产期较近，需要加快服务人员匹配",
    status: "approved",
    submittedAt: "2025-01-24 18:15",
    approvedBy: "王经理",
    approvedAt: "2025-01-24 19:30",
  },
  {
    id: "LOG005",
    employeeId: "EMP002",
    employeeName: "李顾问",
    department: "居家服务事业部",
    date: "2025-01-24",
    assignedLeads: 14,
    callCount: 40,
    callDuration: 102,
    connectedCount: 35,
    connectedRate: 87.5,
    wechatContacts: 6,
    interviewCount: 1,
    newSignCount: 1,
    performanceAmount: 7600,
    tomorrowPlan: "跟进产康意向客户",
    workSummary: "签约1单育婴师服务，面试1个客户",
    difficulties: "无",
    status: "approved",
    submittedAt: "2025-01-24 17:50",
    approvedBy: "王经理",
    approvedAt: "2025-01-24 19:00",
  },
]

// 统计数据
const statsData = {
  todayLogs: 3,
  pendingApproval: 2,
  totalCalls: 115,
  totalPerformance: 24400,
}

// 员工日统计汇总
const employeeStats = [
  { name: "张顾问", callCount: 97, callDuration: 273, connectedRate: 82.5, newSignCount: 2, performanceAmount: 33800 },
  { name: "李顾问", callCount: 78, callDuration: 197, connectedRate: 83.2, newSignCount: 1, performanceAmount: 7600 },
  { name: "王顾问", callCount: 32, callDuration: 85, connectedRate: 87.5, newSignCount: 2, performanceAmount: 5600 },
]

// 日志详情弹窗
function LogDetailDialog({ log }: { log: DailyLog }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            工作日志详情
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">员工</p>
                <p className="text-xs font-medium">{log.employeeName}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">部门</p>
                <p className="text-xs font-medium">{log.department}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">日期</p>
                <p className="text-xs font-medium">{log.date}</p>
              </div>
            </div>

            {/* 自动统计数据 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                自动统计（来自系统）
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-[10px] text-blue-600">分配数据量</p>
                  <p className="text-sm font-bold text-blue-700">{log.assignedLeads}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-[10px] text-purple-600">呼出次数</p>
                  <p className="text-sm font-bold text-purple-700">{log.callCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600">通话时长</p>
                  <p className="text-sm font-bold text-emerald-700">{log.callDuration}分钟</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[10px] text-amber-600">接通率</p>
                  <p className="text-sm font-bold text-amber-700">{log.connectedRate}%</p>
                </div>
              </div>
            </div>

            {/* 手动填写数据 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <Edit className="h-3.5 w-3.5 text-primary" />
                手动填写
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">微信联系</p>
                  <p className="text-sm font-medium">{log.wechatContacts}次</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">面试量</p>
                  <p className="text-sm font-medium">{log.interviewCount}个</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">新签量</p>
                  <p className="text-sm font-medium">{log.newSignCount}单</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">业绩完成</p>
                  <p className="text-sm font-medium text-emerald-600">¥{log.performanceAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 工作总结 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">工作总结</h4>
              <div className="p-2 rounded-lg bg-muted/30 text-xs">
                {log.workSummary || "暂无"}
              </div>
            </div>

            {/* 遇到的困难 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">遇到的困难</h4>
              <div className="p-2 rounded-lg bg-muted/30 text-xs">
                {log.difficulties || "无"}
              </div>
            </div>

            {/* 明日计划 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">明日计划</h4>
              <div className="p-2 rounded-lg bg-muted/30 text-xs">
                {log.tomorrowPlan || "暂无"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 新建日志弹窗
function CreateLogDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          填写日志
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4 text-primary" />
            填写工作日志
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* 日期选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">日期</Label>
              <Input type="date" defaultValue="2025-01-25" className="h-8 text-xs" />
            </div>

            {/* 自动统计数据展示 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                自动统计数据（来自系统）
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-[10px] text-blue-600">分配数据量</p>
                  <p className="text-sm font-bold text-blue-700">15</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-[10px] text-purple-600">呼出次数</p>
                  <p className="text-sm font-bold text-purple-700">45</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600">通话时长</p>
                  <p className="text-sm font-bold text-emerald-700">128分钟</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[10px] text-amber-600">接通率</p>
                  <p className="text-sm font-bold text-amber-700">84.4%</p>
                </div>
              </div>
            </div>

            {/* 手动填写字段 */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium">手动填写</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">微信联系次数</Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">面试量</Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">新签量</Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">业绩完成（元）</Label>
                  <Input type="number" placeholder="0" className="h-8 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">工作总结</Label>
                <Textarea placeholder="请填写今日工作总结..." className="text-xs min-h-[60px] resize-none" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">遇到的困难</Label>
                <Textarea placeholder="请填写遇到的困难及需要的支持..." className="text-xs min-h-[60px] resize-none" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">明日计划</Label>
                <Textarea placeholder="请填写明日工作计划..." className="text-xs min-h-[60px] resize-none" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t flex-shrink-0 bg-background">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">保存草稿</Button>
          <Button size="sm" className="h-7 text-xs">提交日志</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function DailyLogsPage() {
  const [currentTab, setCurrentTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState("2025-01-25")
  const [currentPage, setCurrentPage] = useState(1)

  const statusConfig = {
    draft: { label: "草稿", className: "bg-amber-50 text-amber-700 border-amber-200" },
    submitted: { label: "待审批", className: "bg-blue-50 text-blue-700 border-blue-200" },
    approved: { label: "已审批", className: "bg-green-50 text-green-700 border-green-200" },
  }

  const filteredLogs = mockLogs.filter(log => {
    if (currentTab === "pending") return log.status === "submitted"
    if (currentTab === "approved") return log.status === "approved"
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">员工日志</h1>
            <p className="text-muted-foreground mt-1">管理员工每日工作日志提报与审批</p>
          </div>
          <CreateLogDialog />
        </div>

        {/* 筛选和标签 */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs">全部日志</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索员工..." className="pl-9 h-9" />
            </div>
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
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full sm:w-40 h-9" />
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Download className="h-4 w-4 mr-1.5" />
              导出
            </Button>
          </div>
        </div>

        {/* 员工统计汇总 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              员工日统计汇总
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">员工</TableHead>
                    <TableHead className="text-xs text-center">呼出次数</TableHead>
                    <TableHead className="text-xs text-center">通话时长</TableHead>
                    <TableHead className="text-xs text-center">接通率</TableHead>
                    <TableHead className="text-xs text-center">新签量</TableHead>
                    <TableHead className="text-xs text-center">业绩</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeStats.map((emp) => (
                    <TableRow key={emp.name}>
                      <TableCell className="text-xs font-medium">{emp.name}</TableCell>
                      <TableCell className="text-xs text-center">{emp.callCount}</TableCell>
                      <TableCell className="text-xs text-center">{emp.callDuration}分钟</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          emp.connectedRate >= 85 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {emp.connectedRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{emp.newSignCount}单</TableCell>
                      <TableCell className="text-xs text-center font-medium text-emerald-600">
                        ¥{emp.performanceAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 日志列表 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              日志列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">员工</TableHead>
                    <TableHead className="text-xs">部门</TableHead>
                    <TableHead className="text-xs">日期</TableHead>
                    <TableHead className="text-xs text-center">分配数据</TableHead>
                    <TableHead className="text-xs text-center">呼出</TableHead>
                    <TableHead className="text-xs text-center">时长</TableHead>
                    <TableHead className="text-xs text-center">微信</TableHead>
                    <TableHead className="text-xs text-center">面试</TableHead>
                    <TableHead className="text-xs text-center">新签</TableHead>
                    <TableHead className="text-xs text-center">业绩</TableHead>
                    <TableHead className="text-xs text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {log.employeeName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{log.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.department}</TableCell>
                      <TableCell className="text-xs">{log.date}</TableCell>
                      <TableCell className="text-xs text-center">{log.assignedLeads}</TableCell>
                      <TableCell className="text-xs text-center">{log.callCount}</TableCell>
                      <TableCell className="text-xs text-center">{log.callDuration}分</TableCell>
                      <TableCell className="text-xs text-center">{log.wechatContacts}</TableCell>
                      <TableCell className="text-xs text-center">{log.interviewCount}</TableCell>
                      <TableCell className="text-xs text-center">{log.newSignCount}</TableCell>
                      <TableCell className="text-xs text-center font-medium text-emerald-600">
                        ¥{log.performanceAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <LogDetailDialog log={log} />
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
            共 <span className="font-medium text-foreground">{filteredLogs.length}</span> 条记录
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
