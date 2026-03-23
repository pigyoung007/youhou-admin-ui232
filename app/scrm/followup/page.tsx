"use client"

import React from "react"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  Phone, MessageSquare, Clock, Plus, Search, Play, Pause, FileText, User,
  ChevronRight, Mic, Video, Edit, Trash2, MoreHorizontal, Download, Eye,
  Calendar, UserX, ArrowRightLeft, History, Star, AlertTriangle, Tag, X, Check
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FollowupRecord {
  id: string
  type: "phone" | "wechat" | "meeting" | "video"
  businessType: "母婴业务" | "产康业务" | "学员业务" // 业务线分类
  content: string
  time: string
  duration?: string
  consultantId: string
  consultantName: string
  consultantStatus: "active" | "resigned" // 顾问状态
  handoverTo?: string // 如果离职，交接给谁
  hasRecording?: boolean
  recordingUrl?: string
  transcription?: string
}

interface Customer {
  id: string
  name: string
  phone: string
  status: string
  intention: "high" | "medium" | "low"
  serviceType: string
  currentConsultantId: string
  currentConsultantName: string
  lastContact: string
  followups: FollowupRecord[]
  tags: { id: string; name: string; color: string; groupName: string }[]
}

// 可用标签
const availableTags = [
  { id: "T001", name: "线上咨询", color: "blue", groupId: "G001", groupName: "客户来源" },
  { id: "T002", name: "老客户推荐", color: "green", groupId: "G001", groupName: "客户来源" },
  { id: "T003", name: "线下活动", color: "purple", groupId: "G001", groupName: "客户来源" },
  { id: "T006", name: "高意向", color: "red", groupId: "G002", groupName: "客户意向" },
  { id: "T007", name: "中意向", color: "amber", groupId: "G002", groupName: "客户意向" },
  { id: "T008", name: "低意向", color: "gray", groupId: "G002", groupName: "客户意向" },
  { id: "T010", name: "月嫂服务", color: "rose", groupId: "G003", groupName: "服务需求" },
  { id: "T011", name: "育婴服务", color: "cyan", groupId: "G003", groupName: "服务需求" },
  { id: "T012", name: "产康服务", color: "teal", groupId: "G003", groupName: "服务需求" },
  { id: "T014", name: "高端客户", color: "amber", groupId: "G004", groupName: "预算范围" },
  { id: "T015", name: "中端客户", color: "blue", groupId: "G004", groupName: "预算范围" },
  { id: "T017", name: "VIP客户", color: "amber", groupId: "G005", groupName: "客户特征" },
  { id: "T018", name: "二胎妈妈", color: "pink", groupId: "G005", groupName: "客户特征" },
  { id: "T019", name: "高龄产妇", color: "purple", groupId: "G005", groupName: "客户特征" },
  { id: "T020", name: "双胞胎", color: "cyan", groupId: "G005", groupName: "客户特征" },
]

const tagColorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700 border-gray-200",
  red: "bg-red-100 text-red-700 border-red-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  green: "bg-green-100 text-green-700 border-green-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
}

const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "张女士",
    phone: "138****1234",
    status: "跟进中",
    intention: "high",
    serviceType: "月嫂",
    currentConsultantId: "E008",
    currentConsultantName: "周顾问",
    lastContact: "2025-01-23 14:30",
    tags: [
      { id: "T001", name: "线上咨询", color: "blue", groupName: "客户来源" },
      { id: "T006", name: "高意向", color: "red", groupName: "客户意向" },
      { id: "T010", name: "月嫂服务", color: "rose", groupName: "服务需求" },
      { id: "T014", name: "高端客户", color: "amber", groupName: "预算范围" },
    ],
    followups: [
      { id: "F001", type: "phone", businessType: "母婴业务", content: "客户咨询月嫂服务，预产期3月中旬，对金牌月嫂有需求，预算15000-20000元。已介绍李春华阿姨的情况，客户表示满意，约定明天视频面试。", time: "2025-01-23 14:30", duration: "12分钟", consultantId: "E008", consultantName: "周顾问", consultantStatus: "active", hasRecording: true, transcription: "顾问：您好张女士，我是优厚家庭服务的周顾问...\n客户：你好，我想咨询一下月嫂服务...\n顾问：好的，请问您的预产期是什么时候？\n客户：3月15日左右..." },
      { id: "F002", type: "wechat", businessType: "母婴业务", content: "发送了李春华阿姨的简历和服务案例", time: "2025-01-23 15:00", consultantId: "E008", consultantName: "周顾问", consultantStatus: "active" },
      { id: "F0021", type: "phone", businessType: "产康业务", content: "客户同时咨询产后修复服务，了解套餐价格，已推荐产康8次套餐", time: "2025-01-23 16:00", duration: "6分钟", consultantId: "E008", consultantName: "周顾问", consultantStatus: "active" },
      // 历史记录 - 离职顾问的跟进
      { id: "F003", type: "phone", businessType: "母婴业务", content: "首次电话沟通，了解客户基本需求，客户正在比较多家机构", time: "2025-01-10 10:20", duration: "8分钟", consultantId: "E012", consultantName: "杨顾问", consultantStatus: "resigned", handoverTo: "周顾问", hasRecording: true },
      { id: "F004", type: "wechat", businessType: "母婴业务", content: "添加客户微信，发送公司介绍资料", time: "2025-01-10 11:00", consultantId: "E012", consultantName: "杨顾问", consultantStatus: "resigned", handoverTo: "周顾问" },
    ]
  },
  {
    id: "C002",
    name: "李先生",
    phone: "139****5678",
    status: "有机会",
    intention: "medium",
    serviceType: "育婴师",
    currentConsultantId: "E008",
    currentConsultantName: "周顾问",
    lastContact: "2025-01-23 11:20",
    tags: [
      { id: "T002", name: "老客户推荐", color: "green", groupName: "客户来源" },
      { id: "T007", name: "中意向", color: "amber", groupName: "客户意向" },
      { id: "T011", name: "育婴服务", color: "cyan", groupName: "服务需求" },
      { id: "T015", name: "中端客户", color: "blue", groupName: "预算范围" },
    ],
    followups: [
      { id: "F005", type: "wechat", businessType: "母婴业务", content: "发送育婴师服务套餐报价单", time: "2025-01-23 11:20", consultantId: "E008", consultantName: "周顾问", consultantStatus: "active" },
      { id: "F006", type: "phone", businessType: "母婴业务", content: "客户宝宝3个月大，需要找育婴师帮忙带娃，时间周一到周六", time: "2025-01-22 15:45", duration: "10分钟", consultantId: "E008", consultantName: "周顾问", consultantStatus: "active", hasRecording: true },
      // 历史记录 - 离职顾问
      { id: "F007", type: "phone", businessType: "母婴业务", content: "客户来电咨询育婴师服务，初步了解需求", time: "2025-01-05 09:30", duration: "6分钟", consultantId: "E012", consultantName: "杨顾问", consultantStatus: "resigned", hasRecording: true },
    ]
  },
  {
    id: "C003",
    name: "王女士",
    phone: "137****9012",
    status: "已转化",
    intention: "high",
    serviceType: "产康",
    currentConsultantId: "E010",
    currentConsultantName: "孙顾问",
    lastContact: "2025-01-21 16:45",
    tags: [
      { id: "T001", name: "线上咨询", color: "blue", groupName: "客户来源" },
      { id: "T006", name: "高意向", color: "red", groupName: "客户意向" },
      { id: "T012", name: "产康服务", color: "teal", groupName: "服务需求" },
      { id: "T017", name: "VIP客户", color: "amber", groupName: "客户特征" },
    ],
    followups: [
      { id: "F008", type: "meeting", businessType: "产康业务", content: "客户到店签约，选择了产后恢复套餐（20次），已完成首次服务", time: "2025-01-21 16:45", consultantId: "E010", consultantName: "孙顾问", consultantStatus: "active" },
      { id: "F009", type: "phone", businessType: "产康业务", content: "回访客户，确认到店时间", time: "2025-01-20 10:00", duration: "3分钟", consultantId: "E010", consultantName: "孙顾问", consultantStatus: "active", hasRecording: true },
      { id: "F0091", type: "wechat", businessType: "学员业务", content: "客户咨询产康师培训课程，有意向报名学习", time: "2025-01-19 14:00", consultantId: "E010", consultantName: "孙顾问", consultantStatus: "active" },
    ]
  },
  {
    id: "C004",
    name: "刘女士",
    phone: "136****3456",
    status: "待跟进",
    intention: "medium",
    serviceType: "月嫂",
    currentConsultantId: "E008",
    currentConsultantName: "周顾问",
    lastContact: "2025-01-15 14:00",
    tags: [
      { id: "T003", name: "线下活动", color: "purple", groupName: "客户来源" },
      { id: "T007", name: "中意向", color: "amber", groupName: "客户意向" },
      { id: "T010", name: "月嫂服务", color: "rose", groupName: "服务需求" },
      { id: "T018", name: "二胎妈妈", color: "pink", groupName: "客户特征" },
    ],
    followups: [
      // 全部是离职顾问的历史记录
      { id: "F010", type: "phone", businessType: "母婴业务", content: "客户咨询月嫂服务，预产期4月底，还在考虑中", time: "2025-01-15 14:00", duration: "15分钟", consultantId: "E012", consultantName: "杨顾问", consultantStatus: "resigned", handoverTo: "周顾问", hasRecording: true },
      { id: "F011", type: "wechat", businessType: "母婴业务", content: "发送月嫂价格表和服务内容介绍", time: "2025-01-15 14:30", consultantId: "E012", consultantName: "杨顾问", consultantStatus: "resigned", handoverTo: "周顾问" },
    ]
  },
  {
    id: "C005",
    name: "陈先生",
    phone: "135****7890",
    status: "跟进中",
    intention: "high",
    serviceType: "育婴师",
    currentConsultantId: "E010",
    currentConsultantName: "孙顾问",
    lastContact: "2025-01-22 16:00",
    tags: [
      { id: "T002", name: "老客户推荐", color: "green", groupId: "G001", groupName: "客户来源" },
      { id: "T006", name: "高意向", color: "red", groupId: "G002", groupName: "客户意向" },
      { id: "T011", name: "育婴服务", color: "cyan", groupId: "G003", groupName: "服务需求" },
      { id: "T014", name: "高端客户", color: "amber", groupId: "G004", groupName: "预算范围" },
      { id: "T020", name: "双胞胎", color: "cyan", groupId: "G005", groupName: "客户特征" },
    ],
    followups: [
      { id: "F012", type: "video", businessType: "母婴业务", content: "视频面试育婴师张美玲，客户对阿姨很满意，准备下周签约", time: "2025-01-22 16:00", duration: "25分钟", consultantId: "E010", consultantName: "孙顾问", consultantStatus: "active", hasRecording: true },
      { id: "F013", type: "phone", businessType: "母婴业务", content: "确认视频面试时间", time: "2025-01-21 11:00", duration: "5分钟", consultantId: "E010", consultantName: "孙顾问", consultantStatus: "active", hasRecording: true },
    ]
  },
]

const intentionConfig = {
  high: { label: "高意向", className: "bg-green-100 text-green-700 border-green-200" },
  medium: { label: "中意向", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "低意向", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

const typeConfig = {
  phone: { label: "电话", icon: Phone, color: "bg-blue-100 text-blue-700" },
  wechat: { label: "微信", icon: MessageSquare, color: "bg-green-100 text-green-700" },
  meeting: { label: "到店", icon: User, color: "bg-purple-100 text-purple-700" },
  video: { label: "视频", icon: Video, color: "bg-rose-100 text-rose-700" },
}

// 录音播放器
function RecordingPlayer({ record }: { record: FollowupRecord }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  if (!record.hasRecording) return null

  return (
    <div className="mt-2 p-2 bg-muted/30 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full" />
        </div>
        <span className="text-[10px] text-muted-foreground">{record.duration}</span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Download className="h-3 w-3 mr-1" />下载</Button>
      </div>
      {record.transcription && (
        <>
          <Button variant="ghost" size="sm" className="w-full justify-between text-[10px] h-6" onClick={() => setShowTranscript(!showTranscript)}>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />通话转写</span>
            <ChevronRight className={`h-3 w-3 transition-transform ${showTranscript ? "rotate-90" : ""}`} />
          </Button>
          {showTranscript && (
            <div className="p-2 bg-background rounded border text-[10px] whitespace-pre-wrap max-h-32 overflow-y-auto">
              {record.transcription}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 跟进记录详情弹窗
function CustomerFollowupDialog({ customer, open, onClose, setSelectedCustomer }: { customer: Customer | null; open: boolean; onClose: () => void; setSelectedCustomer: (customer: Customer | null) => void }) {
  const [showAddFollowup, setShowAddFollowup] = useState(false)
  const consultantStats = useMemo(() => {
    const stats: Record<string, { name: string; count: number; status: string }> = {}
    if (customer) {
      customer.followups.forEach(f => {
        if (!stats[f.consultantId]) {
          stats[f.consultantId] = { name: f.consultantName, count: 0, status: f.consultantStatus }
        }
        stats[f.consultantId].count++
      })
    }
    return Object.entries(stats)
  }, [customer])

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <History className="h-4 w-4 text-primary" />
            客户跟进记录
          </DialogTitle>
          <DialogDescription className="text-xs">查看完整跟进历史，包括离职顾问的记录</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Customer Info Header */}
          <div className="p-3 bg-muted/30 border-b shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">{customer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{customer.name}</h3>
                    <Badge variant="outline" className={cn("text-[10px]", intentionConfig[customer.intention].className)}>
                      {intentionConfig[customer.intention].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                    <span>{customer.phone}</span>
                    <span>需求: {customer.serviceType}</span>
                    <span>当前顾问: {customer.currentConsultantName}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="h-7 text-xs" onClick={() => setShowAddFollowup(true)}>
                <Plus className="h-3 w-3 mr-1" />新增跟进
              </Button>
            </div>

            {/* Consultant History */}
            {consultantStats.length > 1 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-[10px] text-muted-foreground mb-2">跟进顾问历史</p>
                <div className="flex flex-wrap gap-2">
                  {consultantStats.map(([id, stat]) => (
                    <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-background rounded border">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className={cn("text-[8px]", stat.status === "resigned" ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>
                          {stat.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px]">{stat.name}</span>
                      <Badge variant="secondary" className="text-[8px] h-4">{stat.count}条</Badge>
                      {stat.status === "resigned" && (
                        <Badge variant="outline" className="text-[8px] h-4 bg-gray-100 text-gray-500">已离职</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Business Category Tabs + Followup Timeline */}
          <div className="flex-1 min-h-0 flex flex-col">
            <Tabs defaultValue="all" className="flex flex-col flex-1 min-h-0">
              <div className="px-3 pt-2 border-b shrink-0">
                <TabsList className="h-7 w-full justify-start">
                  <TabsTrigger value="all" className="text-[10px] h-5 px-2">
                    全部动态
                    <Badge variant="secondary" className="ml-1 text-[8px] h-3.5 px-1">{customer.followups.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="母婴业务" className="text-[10px] h-5 px-2">
                    母婴业务
                    <Badge variant="secondary" className="ml-1 text-[8px] h-3.5 px-1">{customer.followups.filter(f => f.businessType === "母婴业务").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="产康业务" className="text-[10px] h-5 px-2">
                    产康业务
                    <Badge variant="secondary" className="ml-1 text-[8px] h-3.5 px-1">{customer.followups.filter(f => f.businessType === "产康业务").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="学员业务" className="text-[10px] h-5 px-2">
                    学员业务
                    <Badge variant="secondary" className="ml-1 text-[8px] h-3.5 px-1">{customer.followups.filter(f => f.businessType === "学员业务").length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              {["all", "母婴业务", "产康业务", "学员业务"].map(tabValue => {
                const records = tabValue === "all" 
                  ? customer.followups 
                  : customer.followups.filter(f => f.businessType === tabValue)
                return (
                  <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
                    <div className="space-y-3 p-3">
                      {records.length === 0 && (
                        <div className="text-center py-8 text-xs text-muted-foreground">暂无{tabValue === "all" ? "" : tabValue}相关动态记录</div>
                      )}
                      {records.map((record, index) => {
                  const TypeIcon = typeConfig[record.type].icon
                  const isResigned = record.consultantStatus === "resigned"
                  return (
                    <div key={record.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full shrink-0", typeConfig[record.type].color)}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        {index < customer.followups.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className={cn("flex-1 pb-3", isResigned && "opacity-80")}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] h-5">{typeConfig[record.type].label}</Badge>
                              <Badge variant="secondary" className={cn("text-[9px] h-4 px-1",
                                record.businessType === "母婴业务" ? "bg-rose-100 text-rose-700" :
                                record.businessType === "产康业务" ? "bg-teal-100 text-teal-700" :
                                "bg-blue-100 text-blue-700"
                              )}>{record.businessType}</Badge>
                              <span className="text-[10px] text-muted-foreground">{record.time}</span>
                              {record.duration && <span className="text-[10px] text-muted-foreground">· {record.duration}</span>}
                            </div>
                            {/* Consultant Info */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className={cn("text-[6px]", isResigned ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>
                                  {record.consultantName.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-muted-foreground">{record.consultantName}</span>
                              {isResigned && (
                                <>
                                  <Badge variant="outline" className="text-[8px] h-4 bg-gray-100 text-gray-500 border-gray-200">
                                    <UserX className="h-2 w-2 mr-0.5" />已离职
                                  </Badge>
                                  {record.handoverTo && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <ArrowRightLeft className="h-2.5 w-2.5" />已交接给{record.handoverTo}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <p className="text-xs mt-1.5 leading-relaxed">{record.content}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-28">
                              <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />查看</DropdownMenuItem>
                              {!isResigned && <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>}
                              {record.hasRecording && <DropdownMenuItem className="text-xs"><Download className="h-3 w-3 mr-2" />下载录音</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <RecordingPlayer record={record} />
                      </div>
                    </div>
                  )
                })}
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>

          {/* Add Followup Form */}
          {showAddFollowup && (
            <div className="border-t p-3 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">新增跟进记录</h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowAddFollowup(false)}>取消</Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Select defaultValue="phone">
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="跟进方式" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">电话</SelectItem>
                    <SelectItem value="wechat">微信</SelectItem>
                    <SelectItem value="meeting">到店</SelectItem>
                    <SelectItem value="video">视频</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="母婴业务">
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="业务线" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="母婴业务">母婴业务</SelectItem>
                    <SelectItem value="产康业务">产康业务</SelectItem>
                    <SelectItem value="学员业务">学员业务</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="datetime-local" className="h-8 text-xs" defaultValue="2025-01-23T15:00" />
              </div>
              <Textarea placeholder="请输入跟进内容..." className="text-xs min-h-16 resize-none" />
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1 h-8 text-xs bg-transparent"><Mic className="h-3 w-3 mr-1" />上传录音</Button>
                <Button className="flex-1 h-8 text-xs">保存记录</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function FollowupPage() {
  const searchParams = useSearchParams()
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [consultantFilter, setConsultantFilter] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 从URL参数自动选择客户
  useEffect(() => {
    const customerId = searchParams.get("customerId")
    const customerName = searchParams.get("customerName")
    
    if (customerId) {
      const customer = mockCustomers.find(c => c.id === customerId)
      if (customer) {
        setSelectedCustomer(customer)
      }
    }
  }, [searchParams])

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(c => {
      if (searchTerm && !c.name.includes(searchTerm) && !c.phone.includes(searchTerm)) return false
      if (consultantFilter !== "all" && c.currentConsultantId !== consultantFilter) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => c.tags.some(t => t.id === tagId))) return false
      return true
    })
  }, [searchTerm, consultantFilter, selectedTags])

  // 统计
  const stats = useMemo(() => {
    const totalFollowups = mockCustomers.reduce((sum, c) => sum + c.followups.length, 0)
    const todayFollowups = mockCustomers.reduce((sum, c) => 
      sum + c.followups.filter(f => f.time.startsWith("2025-01-23")).length, 0)
    const hasRecording = mockCustomers.reduce((sum, c) => 
      sum + c.followups.filter(f => f.hasRecording).length, 0)
    const resignedRecords = mockCustomers.reduce((sum, c) => 
      sum + c.followups.filter(f => f.consultantStatus === "resigned").length, 0)
    return { totalFollowups, todayFollowups, hasRecording, resignedRecords }
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">跟进记录</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{stats.totalFollowups}条记录</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-green-500" />今日{stats.todayFollowups}条</span>
              <span className="flex items-center gap-1"><Mic className="h-3 w-3 text-blue-500" />{stats.hasRecording}条录音</span>
              <span className="flex items-center gap-1"><UserX className="h-3 w-3 text-gray-400" />{stats.resignedRecords}条离职顾问记录</span>
            </div>
          </div>
          <Button size="sm" className="h-7 text-xs" onClick={() => setSelectedCustomer(null)}>
            <Plus className="h-3 w-3 mr-1" />新增跟进
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
              <TabsTrigger value="today" className="text-xs h-6">今日</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待跟进</TabsTrigger>
              <TabsTrigger value="mine" className="text-xs h-6">我的</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索客户..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={consultantFilter} onValueChange={setConsultantFilter}>
              <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部顾问</SelectItem>
                <SelectItem value="E008">周顾问</SelectItem>
                <SelectItem value="E010">孙顾问</SelectItem>
                <SelectItem value="E012">杨顾问(离职)</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Tag className="h-3 w-3 mr-1" />
                  标签筛选
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 text-[9px]">{selectedTags.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="end">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">按标签筛选</span>
                    {selectedTags.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => setSelectedTags([])}>
                        清空
                      </Button>
                    )}
                  </div>
                  {["客户来源", "客户意向", "服务需求", "预算范围", "客户特征"].map(groupName => {
                    const groupTags = availableTags.filter(t => t.groupName === groupName)
                    return (
                      <div key={groupName}>
                        <p className="text-[10px] text-muted-foreground mb-1">{groupName}</p>
                        <div className="flex flex-wrap gap-1">
                          {groupTags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] border transition-colors",
                                selectedTags.includes(tag.id)
                                  ? tagColorMap[tag.color] || "bg-gray-100"
                                  : "bg-muted/50 hover:bg-muted"
                              )}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">已选标签:</span>
            {selectedTags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId)
              if (!tag) return null
              return (
                <Badge key={tagId} variant="outline" className={cn("text-[10px] gap-1", tagColorMap[tag.color])}>
                  {tag.name}
                  <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}

        {/* Customer List */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">客户</TableHead>
                <TableHead className="text-xs">需求</TableHead>
                <TableHead className="text-xs">意向</TableHead>
                <TableHead className="text-xs">标签</TableHead>
                <TableHead className="text-xs">当前顾问</TableHead>
                <TableHead className="text-xs">跟进次数</TableHead>
                <TableHead className="text-xs">最近跟进</TableHead>
                <TableHead className="text-xs w-28">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const hasResignedRecords = customer.followups.some(f => f.consultantStatus === "resigned")
                return (
                  <TableRow key={customer.id} className="cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{customer.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">{customer.name}</p>
                          <p className="text-[10px] text-muted-foreground">{customer.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{customer.serviceType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px]", intentionConfig[customer.intention].className)}>
                        {intentionConfig[customer.intention].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-0.5 max-w-32">
                        {customer.tags.slice(0, 3).map(tag => (
                          <Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>
                            {tag.name}
                          </Badge>
                        ))}
                        {customer.tags.length > 3 && (
                          <Badge variant="secondary" className="text-[9px] h-4 px-1">+{customer.tags.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{customer.currentConsultantName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{customer.followups.length}次</span>
                        {hasResignedRecords && (
                          <Badge variant="outline" className="text-[8px] h-4 bg-gray-100 text-gray-500">含离职</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{customer.lastContact}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="h-3 w-3 mr-1" />详情
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                              <Tag className="h-3 w-3 mr-1" />标签
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2" align="end">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">管理客户标签</span>
                              </div>
                              <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded min-h-8">
                                {customer.tags.map(tag => (
                                  <Badge key={tag.id} variant="outline" className={cn("text-[9px] gap-0.5", tagColorMap[tag.color])}>
                                    {tag.name}
                                    <button type="button" className="hover:bg-black/10 rounded-full"><X className="h-2 w-2" /></button>
                                  </Badge>
                                ))}
                                {customer.tags.length === 0 && <span className="text-[10px] text-muted-foreground">暂无标签</span>}
                              </div>
                              <div className="max-h-40 overflow-y-auto space-y-1.5">
                                {["客户来源", "客户意向", "服务需求", "预算范围", "客户特征"].map(groupName => {
                                  const groupTags = availableTags.filter(t => t.groupName === groupName)
                                  return (
                                    <div key={groupName}>
                                      <p className="text-[9px] text-muted-foreground">{groupName}</p>
                                      <div className="flex flex-wrap gap-0.5 mt-0.5">
                                        {groupTags.map(tag => {
                                          const isSelected = customer.tags.some(t => t.id === tag.id)
                                          return (
                                            <button
                                              key={tag.id}
                                              type="button"
                                              className={cn(
                                                "px-1 py-0.5 rounded text-[9px] border transition-colors",
                                                isSelected ? tagColorMap[tag.color] : "bg-muted/30 hover:bg-muted"
                                              )}
                                            >
                                              {isSelected && <Check className="h-2 w-2 inline mr-0.5" />}
                                              {tag.name}
                                            </button>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              <Button size="sm" className="w-full h-6 text-[10px]">保存标签</Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Phone className="h-3 w-3" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-28">
                            <DropdownMenuItem className="text-xs"><Plus className="h-3 w-3 mr-2" />新增跟进</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs"><MessageSquare className="h-3 w-3 mr-2" />发消息</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>

        <div className="text-xs text-muted-foreground text-center">
          显示 {filteredCustomers.length} / {mockCustomers.length} 位客户
        </div>

        {/* Customer Followup Dialog */}
        <CustomerFollowupDialog customer={selectedCustomer} open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} setSelectedCustomer={setSelectedCustomer} />
      </div>
    </AdminLayout>
  )
}
