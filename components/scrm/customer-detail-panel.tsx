"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Phone, MessageSquare, Users, ArrowRightLeft, Star, Plus, Edit,
  Eye, ChevronDown, Calendar, Clock, Paperclip,
  FileText, AlertTriangle, PhoneOff, Download,
  Settings, X, ExternalLink, Filter, ShoppingCart,
  FileCheck, Briefcase, Mail, Smartphone, Bell
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CreateContractSheet } from "@/components/business/create-contract-sheet"
import { CreateServiceOrderSheet } from "@/components/business/create-service-order-sheet"

// 客户详情数据接口
export interface CustomerDetail {
  id: string
  name: string
  avatar?: string
  phone: string
  gender?: "male" | "female"
  age?: number
  status: string
  consultant: string
  consultantId?: string
  // 基本信息
  customerStar?: number
  education?: string
  workExperience?: string
  remark?: string
  registrationDate?: string
  customerGroup?: string
  address?: string
  wechat?: string
  email?: string
  // 母婴相关
  expectedDueDate?: string
  babyBirthday?: string
  deliveryType?: string
  // 标签
  tags?: { id: string; name: string; color: string }[]
  // 跟进阶段
  stage?: string
  stageProgress?: number
  // 资料完整度
  profileCompleteness?: number
  // 动态记录
  activities?: ActivityRecord[]
  // 订单
  orders?: OrderRecord[]
  // 任务
  tasks?: TaskRecord[]
}

// 动态记录
export interface ActivityRecord {
  id: string
  type: "call" | "wechat" | "visit" | "transfer" | "system" | "edit"
  content: string
  operator: string
  operatorId?: string
  time: string
  date: string
  // 电话相关
  phoneNumber?: string
  callStatus?: "connected" | "missed" | "no_answer"
  duration?: string
  hasRecording?: boolean
  // 转移相关
  transferTo?: string
}

// 订单记录
export interface OrderRecord {
  id: string
  orderNo: string
  serviceName: string
  amount: number
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  date: string
}

// 任务记录
export interface TaskRecord {
  id: string
  title: string
  status: "pending" | "in_progress" | "completed"
  dueDate: string
  assignee: string
}

interface CustomerDetailPanelProps {
  customer: CustomerDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (customer: CustomerDetail) => void
  onCall?: (customer: CustomerDetail) => void
  onTransfer?: (customer: CustomerDetail) => void
  onAddFollowup?: (customer: CustomerDetail) => void
}

// 根据类型获取图标和样式
const activityTypeConfig: Record<string, { icon: typeof Phone; color: string; bgColor: string }> = {
  call: { icon: Phone, color: "text-blue-600", bgColor: "bg-blue-50" },
  wechat: { icon: MessageSquare, color: "text-green-600", bgColor: "bg-green-50" },
  visit: { icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
  transfer: { icon: ArrowRightLeft, color: "text-amber-600", bgColor: "bg-amber-50" },
  system: { icon: Settings, color: "text-gray-600", bgColor: "bg-gray-50" },
  edit: { icon: Edit, color: "text-indigo-600", bgColor: "bg-indigo-50" },
}

// 标签颜色映射
const tagColorMap: Record<string, string> = {
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  amber: "bg-amber-500 text-white",
  yellow: "bg-yellow-500 text-white",
  lime: "bg-lime-500 text-white",
  green: "bg-green-500 text-white",
  emerald: "bg-emerald-500 text-white",
  teal: "bg-teal-500 text-white",
  cyan: "bg-cyan-500 text-white",
  sky: "bg-sky-500 text-white",
  blue: "bg-blue-500 text-white",
  indigo: "bg-indigo-500 text-white",
  violet: "bg-violet-500 text-white",
  purple: "bg-purple-500 text-white",
  fuchsia: "bg-fuchsia-500 text-white",
  pink: "bg-pink-500 text-white",
  rose: "bg-rose-500 text-white",
  gray: "bg-gray-500 text-white",
}

export function CustomerDetailPanel({
  customer,
  open,
  onOpenChange,
  onEdit,
  onCall,
  onTransfer,
  onAddFollowup,
}: CustomerDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("activities")
  const [activityFilter, setActivityFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")
  const [newFollowup, setNewFollowup] = useState("")
  const [showNextFollowup, setShowNextFollowup] = useState(false)
  const [nextFollowupDate, setNextFollowupDate] = useState("")
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [createContractSheetOpen, setCreateContractSheetOpen] = useState(false)
  const [createServiceOrderSheetOpen, setCreateServiceOrderSheetOpen] = useState(false)
  
  // 新建任务对话框状态
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    executeTime: "",
    deadline: "",
    reminderContent: "",
    taskType: "followup",
    priority: "normal"
  })

  if (!customer) return null

  // 模拟警告信息
  const warningMessage = customer.activities && customer.activities.length === 0
    ? `此客户已入库，但从未发生有效联系，请尽快与客户联系。`
    : null

  // 按日期分组活动记录
  const groupedActivities = customer.activities?.reduce((groups, activity) => {
    const date = activity.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, ActivityRecord[]>) || {}

  // 过滤活动记录
  const filteredGroupedActivities = Object.entries(groupedActivities).reduce((filtered, [date, activities]) => {
    const filteredActivities = activityFilter === "all"
      ? activities
      : activities.filter(a => {
          if (activityFilter === "contact") return ["call", "wechat", "visit"].includes(a.type)
          if (activityFilter === "behavior") return a.type === "system"
          if (activityFilter === "sales") return a.type === "transfer"
          if (activityFilter === "flow") return a.type === "transfer"
          if (activityFilter === "edit") return a.type === "edit"
          return true
        })
    if (filteredActivities.length > 0) {
      filtered[date] = filteredActivities
    }
    return filtered
  }, {} as Record<string, ActivityRecord[]>)

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[1100px] p-0 gap-0 flex flex-col h-screen max-h-screen overflow-hidden [&>button]:hidden"
      >
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
          <SheetTitle className="text-base font-medium">客户详情</SheetTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 警告条 */}
        {warningMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border-b border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
            <span className="text-sm text-orange-700">{warningMessage}</span>
          </div>
        )}

        {/* 主内容区 - 左右分栏 */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* 左侧 - 客户信息 */}
          <div className="w-[420px] border-r flex flex-col min-h-0 overflow-hidden">
            {/* 客户头像和基本信息 */}
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-muted">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold truncate">{customer.name}</h3>
                    {/* 电话按钮移到客户名称右侧 */}
                    <Button
                      size="sm"
                      className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-sm flex-shrink-0 ml-auto"
                      onClick={() => onCall?.(customer)}
                      title="拨打电话"
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {customer.consultant} 跟进
                  </div>
                  {/* 跟进阶段进度条 */}
                  {customer.stageProgress !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{customer.stage || "入库"}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      <Progress value={customer.stageProgress} className="flex-1 h-1.5" />
                    </div>
                  )}
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {customer.tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-5",
                          tagColorMap[tag.color] || "bg-gray-500 text-white"
                        )}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-5 px-1.5 text-[10px]">
                      <Plus className="h-3 w-3 mr-0.5" />标签
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-4">
                {/* 个人客户类型和资料完整度 */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">个人客户</span>
                    <span className="text-xs text-muted-foreground">资料完整度 {customer.profileCompleteness || 36}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(customer)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* 基本信息 */}
                <Collapsible open={basicInfoOpen} onOpenChange={setBasicInfoOpen}>
                  <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium w-full py-2 hover:text-primary">
                    <span>基本信息</span>
                    <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", basicInfoOpen && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0">
                    {/* 客户全名 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>客户全名</span>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{customer.name}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* 客户星级 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">客户星级</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < (customer.customerStar || 5) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                        ))}
                      </div>
                    </div>
                    {/* 手机 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>手机</span>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div>
                          <p className="text-right">{customer.phone}</p>
                          {customer.address && <p className="text-[10px] text-muted-foreground text-right">{customer.address}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* 微信号 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">微信号</span>
                      <div className="flex items-center gap-1">
                        <span className="flex items-center gap-0.5">
                          {customer.wechat && <MessageSquare className="h-3 w-3 text-green-500" />}
                          {customer.wechat || "-"}
                        </span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* 性别 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">性别</span>
                      <span>{customer.gender === "female" ? "女" : customer.gender === "male" ? "男" : "-"}</span>
                    </div>
                    {/* 所属顾问 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">所属母婴顾问</span>
                      <span>{customer.consultant}</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 客户自定义信息 - 与基本信息格式一致 */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium w-full py-2 hover:text-primary">
                    <span>客户自定义信息</span>
                    <ChevronDown className="h-4 w-4 ml-auto transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0">
                    {/* 预产期 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">预产期</span>
                      <div className="flex items-center gap-1">
                        <span>{customer.expectedDueDate || "-"}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* 宝宝出生日期 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">宝宝出生日期</span>
                      <div className="flex items-center gap-1">
                        <span>{customer.babyBirthday || "-"}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* 宝妈妈年龄 */}
                    <div className="flex items-center justify-between py-2 px-0 border-b border-dashed text-xs">
                      <span className="text-muted-foreground">宝妈妈年龄</span>
                      <div className="flex items-center gap-1">
                        <span>{customer.age || "-"}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </div>

          {/* 右侧 - 动态/订单/任务等 */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* 右侧主Tab */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="border-b overflow-x-auto flex-shrink-0">
                <TabsList className="w-max min-w-full justify-start h-9 px-2 rounded-none bg-transparent gap-0">
                  <TabsTrigger value="activities" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                    跟进信息
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                    合同
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                    订单
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                    任务
                  </TabsTrigger>
                  <TabsTrigger value="evaluations" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                    评价
                  </TabsTrigger>
  <TabsTrigger value="files" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
文件
  </TabsTrigger>
                <TabsTrigger value="points" className="text-xs px-3 h-9 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                  积分
                </TabsTrigger>
              </TabsList>
              </div>

              {/* 跟进信息Tab */}
              <TabsContent value="activities" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                {/* 顶部操作栏 - 统一风格 */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">跟进信息</span>
                  <div className="flex items-center gap-2">
                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="sales">销售活动</SelectItem>
                <SelectItem value="flow">流转记录</SelectItem>
                <SelectItem value="edit">资料维护</SelectItem>
                <SelectItem value="followup">跟进记录</SelectItem>
                <SelectItem value="order">销售订单</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={operatorFilter} onValueChange={setOperatorFilter}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部操作人" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部操作人</SelectItem>
                        <SelectItem value="张顾问">张顾问</SelectItem>
                        <SelectItem value="李顾问">李顾问</SelectItem>
                        <SelectItem value="王顾问">王顾问</SelectItem>
                        <SelectItem value="刘经理">刘经理</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => onAddFollowup?.(customer)}>
                      添加跟进
                    </Button>
                  </div>
                </div>

                {/* 活动时间线 */}
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    {Object.entries(filteredGroupedActivities).length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        暂无动态记录
                      </div>
                    ) : (
                      Object.entries(filteredGroupedActivities).map(([date, activities]) => (
                        <div key={date} className="space-y-3">
                          <div className="text-xs font-medium text-muted-foreground">{date}</div>
                          {activities.map((activity) => {
                            const config = activityTypeConfig[activity.type] || activityTypeConfig.system
                            const ActivityIcon = config.icon
                            return (
                              <div key={activity.id} className="border rounded-lg overflow-hidden">
                                <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className={cn("text-xs", config.bgColor)}>
                                        {activity.operator.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{activity.operator}</p>
                                      <p className="text-xs text-muted-foreground">{activity.type === "call" ? "电话跟进" : activity.type === "wechat" ? "微信沟通" : "系统记录"} | {activity.time}</p>
                                    </div>
                                  </div>
                                  <Badge className={cn("text-xs", activity.type === "call" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800")}>
                                    {activity.callStatus === "connected" ? "已接通" : activity.callStatus === "missed" ? "未接通" : "已完成"}
                                  </Badge>
                                </div>
                                <div className="p-3 space-y-2">
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2 bg-muted/30 rounded">
                                      <p className="text-muted-foreground">跟进内容</p>
                                      <p className="font-medium">{activity.content}</p>
                                    </div>
                                    {activity.phoneNumber && (
                                      <div className="p-2 bg-muted/30 rounded">
                                        <p className="text-muted-foreground">联系电话</p>
                                        <p className="font-medium">{activity.phoneNumber}</p>
                                      </div>
                                    )}
                                  </div>
                                  {activity.duration && (
                                    <div className="p-2 bg-muted/30 rounded text-xs">
                                      <p className="text-muted-foreground">通话时长</p>
                                      <p className="font-medium">{activity.duration}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 合同Tab - 统一风格 */}
              <TabsContent value="contracts" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">合同</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="signed">已签署</SelectItem>
                        <SelectItem value="pending">待签署</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setCreateContractSheetOpen(true)}>
                      新建合同
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    {/* 合同卡片 - 统一风格 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-200">合</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">月嫂服务合同</p>
                            <p className="text-xs text-muted-foreground">HT2025031800001 | 2025-03-15</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">已签署</Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">合同金额</p>
                            <p className="font-medium text-red-500">¥28,800</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">有效期</p>
                            <p className="font-medium">2025-03-15 至 2026-03-15</p>
                          </div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <p className="text-muted-foreground">备注</p>
                          <p className="font-medium">金牌月嫂26天服务，含产妇护理及新生儿照护</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-amber-200">合</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">产康服务协议</p>
                            <p className="text-xs text-muted-foreground">HT2025031800002 | 2025-03-18</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">待签署</Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">合同金额</p>
                            <p className="font-medium text-red-500">¥5,800</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">状态</p>
                            <p className="font-medium">等待客户签署</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 订单Tab - 统一风格 */}
              <TabsContent value="orders" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">订单</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待确认</SelectItem>
                        <SelectItem value="in_progress">进行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setCreateServiceOrderSheetOpen(true)}>
                      新建订单
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-200">订</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">金牌月嫂服务-26天</p>
                            <p className="text-xs text-muted-foreground">DD2025031800001 | 2025-03-10</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">进行中</Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">订单金额</p>
                            <p className="font-medium text-red-500">¥28,800</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">服务时间</p>
                            <p className="font-medium">2025-03-20 至 2025-04-15</p>
                          </div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <p className="text-muted-foreground">服务人员</p>
                          <p className="font-medium">王阿姨（金牌月嫂）</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-green-200">订</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">产后康复套餐</p>
                            <p className="text-xs text-muted-foreground">DD2025021500002 | 2025-02-15</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">已完成</Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">订单金额</p>
                            <p className="font-medium text-red-500">¥5,800</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">完成时间</p>
                            <p className="font-medium">2025-03-15</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 任务Tab - 统一风格 */}
              <TabsContent value="tasks" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">任务</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待处理</SelectItem>
                        <SelectItem value="in_progress">进行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="h-8 text-xs" onClick={() => setCreateTaskDialogOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      新建任务
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-orange-50/50 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-orange-200">张</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">电话回访确认服务满意度</p>
                            <p className="text-xs text-muted-foreground">负责人：张顾问 | 截止：2025-03-20</p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 text-xs">待处理</Badge>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">任务类型</p>
                            <p className="font-medium">客户回访</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">优先级</p>
                            <p className="font-medium text-orange-600">高</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-200">李</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">安排产康技师上门服务</p>
                            <p className="text-xs text-muted-foreground">负责人：李经理 | 截止：2025-03-22</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">进行中</Badge>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">任务类型</p>
                            <p className="font-medium">服务安排</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">优先级</p>
                            <p className="font-medium">普通</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-green-200">张</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium line-through text-muted-foreground">发送服务协议给客户</p>
                            <p className="text-xs text-muted-foreground">负责人：张顾问 | 完成：2025-03-15</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">已完成</Badge>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 评价Tab - 统一风格 */}
              <TabsContent value="evaluations" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">评价</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部服务" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部服务</SelectItem>
                        <SelectItem value="yuesao">月嫂服务</SelectItem>
                        <SelectItem value="chankang">产康服务</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-amber-200">刘</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">刘女士</p>
                            <p className="text-xs text-muted-foreground">月嫂服务评价 | 2025-03-16</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">服务项目</p>
                            <p className="font-medium">金牌月嫂服务</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">服务人员</p>
                            <p className="font-medium">王阿姨</p>
                          </div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <p className="text-muted-foreground">评价内容</p>
                          <p className="font-medium">王阿姨非常专业负责，照顾宝宝和产妇都很细心，月子餐做得也很好吃，非常满意！</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 文件Tab - 统一风格 */}
              <TabsContent value="files" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">文件</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="contract">合同</SelectItem>
                        <SelectItem value="image">图片</SelectItem>
                        <SelectItem value="document">文档</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      上传文件
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">月嫂服务合同.pdf</p>
                            <p className="text-xs text-muted-foreground">合同文件 | 2025-03-15 上传</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">文件大小</p>
                            <p className="font-medium">2.3 MB</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">上传人</p>
                            <p className="font-medium">张顾问</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 积分Tab - 统一风格 */}
              <TabsContent value="points" className="flex-1 flex flex-col m-0 p-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <span className="text-sm font-medium">积分</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="全部记录" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部记录</SelectItem>
                        <SelectItem value="earn">获得积分</SelectItem>
                        <SelectItem value="use">使用积分</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      积分兑换
                    </Button>
                  </div>
                </div>
                {/* 积分概览 */}
                <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">当前可用积分</p>
                      <p className="text-2xl font-bold text-orange-600">2,580</p>
                    </div>
                    <div className="text-right text-xs">
                      <p><span className="text-muted-foreground">累计获得：</span><span className="font-medium">3,200</span></p>
                      <p><span className="text-muted-foreground">已使用：</span><span className="font-medium">620</span></p>
                    </div>
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">消费获得积分</p>
                            <p className="text-xs text-muted-foreground">月嫂服务订单 | 2025-03-15</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-green-600">+288</span>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 text-sm font-bold">-</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">积分兑换</p>
                            <p className="text-xs text-muted-foreground">兑换产康体验券 | 2025-03-10</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-red-600">-500</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>

      {/* 新建合同Sheet */}
      <CreateContractSheet
        open={createContractSheetOpen}
        onOpenChange={setCreateContractSheetOpen}
        customerId={customer.id}
        customerName={customer.name}
        onContractCreated={(data) => {
          setCreateContractSheetOpen(false)
        }}
      />

      {/* 新建服务订单Sheet */}
      <CreateServiceOrderSheet
        open={createServiceOrderSheetOpen}
        onOpenChange={setCreateServiceOrderSheetOpen}
        customerId={customer.id}
        customerName={customer.name}
        customerPhone={customer.phone}
        onOrderCreated={(data) => {
          setCreateServiceOrderSheetOpen(false)
        }}
      />

      {/* 新建任务对话框 */}
      <Dialog open={createTaskDialogOpen} onOpenChange={setCreateTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">任务标题 <span className="text-destructive">*</span></Label>
              <Input 
                placeholder="请输入任务标题"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">任务类型</Label>
                <Select value={newTask.taskType} onValueChange={(v) => setNewTask({...newTask, taskType: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="followup">客户回访</SelectItem>
                    <SelectItem value="service">服务安排</SelectItem>
                    <SelectItem value="contract">合同跟进</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">优先级</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">任务执行人 <span className="text-destructive">*</span></Label>
              <Select value={newTask.assignee} onValueChange={(v) => setNewTask({...newTask, assignee: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择执行人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zhang">张顾问</SelectItem>
                  <SelectItem value="li">李经理</SelectItem>
                  <SelectItem value="wang">王主管</SelectItem>
                  <SelectItem value="chen">陈助理</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  执行时间 <span className="text-destructive">*</span>
                </Label>
                <Input 
                  type="datetime-local"
                  value={newTask.executeTime}
                  onChange={(e) => setNewTask({...newTask, executeTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" />
                  提醒截止时间
                </Label>
                <Input 
                  type="datetime-local"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">提醒内容</Label>
              <Textarea 
                placeholder="请输入任务提醒内容..."
                rows={3}
                value={newTask.reminderContent}
                onChange={(e) => setNewTask({...newTask, reminderContent: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTaskDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              console.log('创建任务:', newTask)
              setCreateTaskDialogOpen(false)
              setNewTask({
                title: "",
                assignee: "",
                executeTime: "",
                deadline: "",
                reminderContent: "",
                taskType: "followup",
                priority: "normal"
              })
            }}>
              创建任务
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// 信息行组件
function InfoRow({
  label,
  value,
  subValue,
  required,
  editable,
}: {
  label: string
  value: React.ReactNode
  subValue?: string
  required?: boolean
  editable?: boolean
}) {
  return (
    <div className="flex items-start py-2 border-b border-dashed last:border-0">
      <div className="w-24 shrink-0 text-sm text-muted-foreground flex items-center gap-0.5">
        {label}
        {required && <span className="text-red-500">*</span>}
        {editable && <Edit className="h-3 w-3 ml-1 text-muted-foreground/50" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm">{value}</div>
        {subValue && <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>}
      </div>
      {editable && (
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
          <Edit className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
