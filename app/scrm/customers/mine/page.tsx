"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { DialogTrigger } from "@/components/ui/dialog"

import React from "react"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, Plus, Phone, MessageSquare, FileText, Eye, Heart,
  DollarSign, UserCheck, ChevronLeft, ChevronRight, Download, Clock, Star, Upload,
  Tag, X, Filter, ChevronDown, Check, PhoneCall, PhoneOff, User, Calendar,
  Mail, MapPin, Baby, CreditCard, AlertCircle, Send, Mic, Video, Edit, Copy, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomerFollowupDialog, type CustomerForFollowup } from "@/components/scrm/customer-followup-dialog"
import { CreateInterviewDialog, type CustomerForInterview } from "@/components/scrm/interview-dialog"
import { MergeCustomersDialog, type MergeFieldConfig } from "@/components/scrm/merge-customers-dialog"
import { CustomerDetailPanel, type CustomerDetail, type ActivityRecord } from "@/components/scrm/customer-detail-panel"
import { Merge } from "lucide-react"

interface MyCustomer {
  id: string
  name: string
  phone: string
  gender: "male" | "female"
  age?: number
  ethnicity?: string
  status: "active" | "inactive" | "potential" | "following"
  source: string
  acquireType: "self" | "assigned" | "claimed"
  orderCount: number
  totalValue: number
  lastFollowup: string
  nextFollowup: string | null
  createdAt: string
  tags: { id: string; name: string; color: string }[]
  priority: "high" | "medium" | "low"
  expectedDueDate?: string
  address?: string
  email?: string
  wechat?: string
  // 母婴顾问字段
  customerStar?: number
  customerType?: "母婴客户" | "产康客户"
  babyBirthday?: string
  motherBirthday?: string
  deliveryType?: "natural" | "cesarean"
  // 跟进记录
  followupRecords?: { id: string; date: string; type: string; content: string; consultant: string }[]
  // 客户分组
  groupId?: string
}

// 客户分组
interface CustomerGroup {
  id: string
  name: string
  color: string
  count: number
}

const defaultGroups: CustomerGroup[] = [
  { id: "GRP001", name: "高意向客户", color: "rose", count: 3 },
  { id: "GRP002", name: "VIP客户", color: "amber", count: 2 },
  { id: "GRP003", name: "预产期近", color: "teal", count: 2 },
  { id: "GRP004", name: "需要重点跟进", color: "purple", count: 1 },
]

const mockMyCustomers: MyCustomer[] = [
  { id: "MY001", name: "刘女士", phone: "138****5678", gender: "female", age: 30, ethnicity: "汉族", status: "active", source: "美团推广", acquireType: "self", orderCount: 3, totalValue: 28800, lastFollowup: "2025-01-22", nextFollowup: "2025-01-25", createdAt: "2024-10-15", tags: [{ id: "T4", name: "高净值", color: "amber" }, { id: "T11", name: "复购客户", color: "green" }], priority: "high", expectedDueDate: "2025-03-15", customerStar: 5, customerType: "母婴客户", deliveryType: "natural", address: "银川市金凤区正源街瑞银财富中心", email: "liu@example.com", wechat: "liu_wechat", followupRecords: [
    { id: "F001", date: "2025-01-22 14:30", type: "phone", content: "客户表示对月嫂服务很满意，考虑续约产康服务", consultant: "张顾问" },
    { id: "F002", date: "2025-01-18 10:00", type: "wechat", content: "发送了产康服务介绍资料", consultant: "张顾问" },
    { id: "F003", date: "2025-01-10 16:45", type: "visit", content: "上门回访，客户反馈月嫂阿姨服务态度好", consultant: "张顾问" },
  ] },
  { id: "MY002", name: "陈先生", phone: "139****1234", gender: "male", age: 35, ethnicity: "汉族", status: "following", source: "朋友介绍", acquireType: "assigned", orderCount: 1, totalValue: 9600, lastFollowup: "2025-01-20", nextFollowup: "2025-01-24", createdAt: "2025-01-10", tags: [{ id: "T15", name: "跟进中", color: "orange" }], priority: "medium", customerType: "母婴客户", address: "银川市兴庆区", wechat: "chen_wx", followupRecords: [
    { id: "F004", date: "2025-01-20 11:00", type: "phone", content: "客户询问育婴师价格，已发送报价单", consultant: "李顾问" },
  ] },
  { id: "MY003", name: "王女士", phone: "137****9876", gender: "female", age: 28, ethnicity: "回族", status: "potential", source: "公海领取", acquireType: "claimed", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-21", nextFollowup: "2025-01-23", createdAt: "2025-01-19", tags: [{ id: "T2", name: "月嫂需求", color: "rose" }, { id: "T16", name: "预产期近", color: "pink" }], priority: "high", expectedDueDate: "2025-02-28", customerStar: 4, customerType: "母婴客户", deliveryType: "cesarean", address: "银川市西夏区", followupRecords: [
    { id: "F005", date: "2025-01-21 09:30", type: "wechat", content: "客户咨询剖腹产月嫂服务，预产期2月底", consultant: "张顾问" },
  ] },
  { id: "MY004", name: "赵女士", phone: "135****4567", gender: "female", age: 32, ethnicity: "汉族", status: "active", source: "小红书", acquireType: "self", orderCount: 5, totalValue: 52000, lastFollowup: "2025-01-22", nextFollowup: null, createdAt: "2024-03-10", tags: [{ id: "T4", name: "高净值", color: "amber" }, { id: "T13", name: "VIP", color: "red" }], priority: "high", expectedDueDate: "2025-04-01", customerStar: 5, customerType: "母婴客户", address: "银川市金凤区", followupRecords: [] },
  { id: "MY005", name: "孙先生", phone: "136****8901", gender: "male", age: 42, ethnicity: "汉族", status: "inactive", source: "官网咨询", acquireType: "assigned", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-10", nextFollowup: null, createdAt: "2025-01-05", tags: [{ id: "T17", name: "待激活", color: "gray" }], priority: "low", customerType: "母婴客户", address: "银川市兴庆区", followupRecords: [] },
  { id: "MY006", name: "周女士", phone: "133****2345", gender: "female", age: 29, ethnicity: "汉族", status: "following", source: "抖音广告", acquireType: "self", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-21", nextFollowup: "2025-01-24", createdAt: "2025-01-18", tags: [{ id: "T6", name: "产康意向", color: "teal" }, { id: "T5", name: "比价中", color: "gray" }], priority: "medium", expectedDueDate: "2025-04-15", customerType: "产康客户", address: "银川市金凤区", followupRecords: [] },
  { id: "MY007", name: "吴女士", phone: "132****6789", gender: "female", age: 45, ethnicity: "汉族", status: "following", source: "线下活动", acquireType: "self", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-23", nextFollowup: "2025-01-26", createdAt: "2025-01-20", tags: [{ id: "T7", name: "培训意向", color: "purple" }], priority: "high", customerType: "产康客户", address: "银川市金凤区", followupRecords: [] },
  { id: "MY008", name: "郑女士", phone: "131****0123", gender: "female", age: 40, ethnicity: "回族", status: "potential", source: "朋友介绍", acquireType: "assigned", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-22", nextFollowup: "2025-01-25", createdAt: "2025-01-21", tags: [{ id: "T7", name: "培训意向", color: "purple" }, { id: "T18", name: "月嫂培训", color: "rose" }], priority: "medium", customerType: "产康客户", address: "银川市金凤区", followupRecords: [] },
]

// 可用标签
const availableTags = [
  { id: "T1", name: "高意向", color: "red", group: "意向" },
  { id: "T5", name: "比价中", color: "gray", group: "意向" },
  { id: "T15", name: "跟进中", color: "orange", group: "意向" },
  { id: "T17", name: "待激活", color: "gray", group: "意向" },
  { id: "T2", name: "月嫂需求", color: "rose", group: "需求" },
  { id: "T3", name: "育婴需求", color: "cyan", group: "需求" },
  { id: "T6", name: "产康意向", color: "teal", group: "需求" },
  { id: "T7", name: "培训意向", color: "purple", group: "需求" },
  { id: "T18", name: "月嫂培训", color: "rose", group: "需求" },
  { id: "T4", name: "高净值", color: "amber", group: "特征" },
  { id: "T11", name: "复购客户", color: "green", group: "特征" },
  { id: "T13", name: "VIP", color: "red", group: "特征" },
  { id: "T16", name: "预产期近", color: "pink", group: "特征" },
]

const tagColorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700 border-gray-200",
  red: "bg-red-100 text-red-700 border-red-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  green: "bg-green-100 text-green-700 border-green-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
}

const statusConfig = {
  active: { label: "活跃", className: "bg-green-50 text-green-600 border-green-200" },
  inactive: { label: "沉默", className: "bg-gray-50 text-gray-600 border-gray-200" },
  potential: { label: "潜在", className: "bg-blue-50 text-blue-600 border-blue-200" },
  following: { label: "跟进中", className: "bg-amber-50 text-amber-600 border-amber-200" },
}

const acquireTypeLabels = {
  self: "自拓",
  assigned: "分配",
  claimed: "公海领取",
}

const priorityConfig = {
  high: { label: "高", className: "text-red-500" },
  medium: { label: "中", className: "text-amber-500" },
  low: { label: "低", className: "text-gray-400" },
}

// 辅助组件已移至主组件内联渲染

// 2. 拨打电话弹窗 - 增强版（包含通话录音和微信识别功能）
function CallDialog({ customer, open, onOpenChange }: { customer: MyCustomer; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [callNote, setCallNote] = useState("")
  const [showWechatInfo, setShowWechatInfo] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("note")

  const startCall = () => {
    setCallStatus("calling")
    setTimeout(() => setCallStatus("connected"), 2000)
  }

  const endCall = () => {
    setCallStatus("ended")
    // 模拟检测到手机号即微信号
    if (customer.phone.includes("138") || customer.phone.includes("139")) {
      setShowWechatInfo(true)
    }
  }

  const quickTags = ["高意向", "需继续跟进", "暂无意向", "已预约面试", "价格敏感", "需发送资料"]

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setCallStatus("idle"); setCallNote(""); setShowWechatInfo(false) } }}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Phone className="h-4 w-4 text-primary" />
            <span>拨打电话</span>
            {isRecording && callStatus === "connected" && (
              <Badge variant="destructive" className="text-[9px] h-4 animate-pulse">录音中</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* 客户信息 */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">{customer.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
              <div className="flex gap-1 mt-1">
                {customer.tags.slice(0, 2).map(tag => (
                  <Badge key={tag.id} variant="outline" className="text-[9px] h-4">{tag.name}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          {callStatus === "idle" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs text-blue-700">
                <span className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  通话将自动录音并AI转写
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 text-[10px] px-2"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? "关闭录音" : "开启录音"}
                </Button>
              </div>
              <Button onClick={startCall} className="w-full h-10">
                <PhoneCall className="h-4 w-4 mr-2" />
                拨打电话
              </Button>
            </div>
          )}

          {callStatus === "calling" && (
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-amber-600">正在呼叫...</p>
                <p className="text-xs text-muted-foreground mt-1">等待对方接听</p>
              </div>
              <Button variant="destructive" onClick={endCall} className="w-full h-10">
                <PhoneOff className="h-4 w-4 mr-2" />
                取消呼叫
              </Button>
            </div>
          )}

          {callStatus === "connected" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-green-600">通话中</p>
                <p className="text-2xl font-mono">00:32</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant={isMuted ? "destructive" : "outline"} 
                  size="icon" 
                  className={cn("h-12 w-12 rounded-full", !isMuted && "bg-transparent")}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={endCall}>
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <Button 
                  variant={isRecording ? "default" : "outline"} 
                  size="icon" 
                  className={cn("h-12 w-12 rounded-full", !isRecording && "bg-transparent")}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <div className={cn("h-3 w-3 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400")} />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isMuted ? "已静音" : ""} {isRecording ? "· 录音中" : ""}
              </p>
            </div>
          )}

          {callStatus === "ended" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">通话结束</p>
                  <p className="text-xs text-muted-foreground">通话时长: 02:15</p>
                </div>
                {isRecording && (
                  <Badge variant="secondary" className="text-[10px]">
                    <Download className="h-3 w-3 mr-1" />
                    录音已保存
                  </Badge>
                )}
              </div>

              {/* 微信识别提示 */}
              {showWechatInfo && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      检测到该手机号可能是微信号
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-muted rounded mx-auto mb-1" />
                        <p className="text-[8px] text-muted-foreground">微信二维码</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">微信号</p>
                      <p className="text-sm font-mono">{customer.phone.replace(/\*+/g, "")}</p>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] mt-2 bg-transparent">
                        <Copy className="h-3 w-3 mr-1" />复制并添加
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 通话记录标签页 */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full h-8">
                  <TabsTrigger value="note" className="flex-1 text-xs h-6">通话备注</TabsTrigger>
                  <TabsTrigger value="transcript" className="flex-1 text-xs h-6">AI转写</TabsTrigger>
                  <TabsTrigger value="summary" className="flex-1 text-xs h-6">AI摘要</TabsTrigger>
                </TabsList>
                <TabsContent value="note" className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">快速打标</Label>
                    <div className="flex flex-wrap gap-1">
                      {quickTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] border transition-colors",
                            selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          {selectedTags.includes(tag) && <Check className="h-2.5 w-2.5 inline mr-1" />}
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">通话备注</Label>
                    <Textarea 
                      placeholder="记录通话内容要点..." 
                      className="text-xs resize-none" 
                      rows={3}
                      value={callNote}
                      onChange={(e) => setCallNote(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">下次跟进</Label>
                    <Input type="date" className="h-8 text-xs" />
                  </div>
                </TabsContent>
                <TabsContent value="transcript" className="mt-3">
                  <div className="p-3 bg-muted/30 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      [00:00] 顾问：您好，请问是{customer.name}吗？<br/>
                      [00:03] 客户：是的，你好。<br/>
                      [00:05] 顾问：我是优厚家政的顾问，之前您咨询过我们的月嫂服务...<br/>
                      [00:15] 客户：对对，我想了解一下价格...<br/>
                      <span className="text-[10px] text-blue-600">（AI转写中，稍后查看完整内容）</span>
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="summary" className="mt-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-2">AI智能摘要</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• 客户对月嫂服务有明确需求</li>
                      <li>• 预产期约3月中旬</li>
                      <li>• 对价格有一定关注，建议发送报价单</li>
                      <li>• 建议：3天内跟进，发送优质月嫂简历</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-8 text-xs bg-transparent" onClick={() => { setCallStatus("idle"); onOpenChange(false) }}>
                  取消
                </Button>
                <Button className="flex-1 h-8 text-xs" onClick={() => { setCallStatus("idle"); onOpenChange(false) }}>
                  保存记录
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 3. 打标签弹窗
function TagDialog({ customer, open, onOpenChange }: { customer: MyCustomer; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedTags, setSelectedTags] = useState<string[]>(customer.tags.map(t => t.id))
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Tag className="h-4 w-4 text-primary" />
            <span>管理标签</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            为 {customer.name} 添加或移除标签
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 当前标签 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">当前标签</Label>
            <div className="flex flex-wrap gap-1.5 min-h-8 p-2 bg-muted/30 rounded">
              {selectedTags.length > 0 ? (
                selectedTags.map(tagId => {
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
                })
              ) : (
                <span className="text-[10px] text-muted-foreground">暂无标签</span>
              )}
            </div>
          </div>

          {/* 可选标签 */}
          <div className="space-y-3">
            {["意向", "需求", "特征"].map(group => {
              const groupTags = availableTags.filter(t => t.group === group)
              return (
                <div key={group}>
                  <Label className="text-xs text-muted-foreground">{group}</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {groupTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          "px-2 py-1 rounded text-xs border transition-colors flex items-center gap-1",
                          selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        {selectedTags.includes(tag.id) && <Check className="h-3 w-3" />}
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 新建标签 */}
          <Button variant="outline" size="sm" className="w-full h-7 text-xs bg-transparent">
            <Plus className="h-3 w-3 mr-1" />
            新建标签
          </Button>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 5. 跟进记录弹窗 - 使用共享组件
function FollowupDialogWrapper({ customer, open, onOpenChange }: { customer: MyCustomer; open: boolean; onOpenChange: (open: boolean) => void }) {
  // 将 MyCustomer 转换为 CustomerForFollowup 格式
  const customerForFollowup: CustomerForFollowup = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    intention: customer.priority === "high" ? "high" : customer.priority === "medium" ? "medium" : "low",
    serviceType: customer.customerType === "母婴客户" ? "母婴服务" : customer.customerType === "产康客户" ? "产康服务" : undefined,
    currentConsultantName: "当前顾问",
    tags: customer.tags,
    followups: (customer.followupRecords || []).map((record, index) => ({
      id: record.id,
      type: record.type as "phone" | "wechat" | "meeting" | "video",
      content: record.content,
      time: record.date,
      consultantId: `C${index}`,
      consultantName: record.consultant,
      consultantStatus: "active" as const,
    })),
  }

  return (
    <CustomerFollowupDialog
      customer={customerForFollowup}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

// 6. 释放/分享弹窗
function ReleaseDialog({ customer, open, onOpenChange }: { customer: MyCustomer; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [action, setAction] = useState<"release" | "transfer" | "export">("release")
  const [reason, setReason] = useState("")
  const [targetConsultant, setTargetConsultant] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Upload className="h-4 w-4 text-primary" />
            <span>客户操作</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 操作选择 */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={action === "release" ? "default" : "outline"}
              size="sm"
              className={cn("h-16 flex-col gap-1", action !== "release" && "bg-transparent")}
              onClick={() => setAction("release")}
            >
              <Upload className="h-4 w-4" />
              <span className="text-[10px]">释放公海</span>
            </Button>
            <Button
              variant={action === "transfer" ? "default" : "outline"}
              size="sm"
              className={cn("h-16 flex-col gap-1", action !== "transfer" && "bg-transparent")}
              onClick={() => setAction("transfer")}
            >
              <User className="h-4 w-4" />
              <span className="text-[10px]">转给同事</span>
            </Button>
            <Button
              variant={action === "export" ? "default" : "outline"}
              size="sm"
              className={cn("h-16 flex-col gap-1", action !== "export" && "bg-transparent")}
              onClick={() => setAction("export")}
            >
              <Download className="h-4 w-4" />
              <span className="text-[10px]">导出资料</span>
            </Button>
          </div>

          {action === "release" && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded text-xs text-amber-700">
                <p className="font-medium mb-1">释放到公海后：</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                  <li>客户将从您的客户池中移除</li>
                  <li>其他顾问可以从公海领取该客户</li>
                  <li>您的跟进记录将保留</li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">释放原因</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择原因" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-response">客户无响应</SelectItem>
                    <SelectItem value="no-intention">客户无意向</SelectItem>
                    <SelectItem value="service-complete">服务已完成</SelectItem>
                    <SelectItem value="other">其他原因</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {action === "transfer" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">选择同事</Label>
                <Select value={targetConsultant} onValueChange={setTargetConsultant}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择接收人" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E001">张顾问</SelectItem>
                    <SelectItem value="E002">李顾问</SelectItem>
                    <SelectItem value="E003">王顾问</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">转移备注</Label>
                <Textarea placeholder="告知同事需要注意的事项..." className="text-xs resize-none" rows={2} />
              </div>
            </div>
          )}

          {action === "export" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">导出客户 {customer.name} 的完整资料，包括：</p>
              <div className="grid grid-cols-2 gap-2">
                {["基本信息", "联系方式", "订单记录", "跟进记录", "标签信息", "消费统计"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            size="sm" 
            className="h-7 text-xs"
            variant={action === "release" ? "destructive" : "default"}
          >
            {action === "release" && "确认释放"}
            {action === "transfer" && "确认转移"}
            {action === "export" && "下载导出"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 7. Add Customer Dialog
function AddCustomerDialog({ trigger }: { trigger: React.ReactNode }) {
  const [customerType, setCustomerType] = useState<"母婴客户" | "产康客户">("母婴客户")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [source, setSource] = useState("")
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6"><Plus className="h-4 w-4 text-primary" />新增客户</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Customer Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">客户类型 <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCustomerType("母婴客户")}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all",
                  customerType === "母婴客户" 
                    ? "border-rose-500 bg-rose-50 ring-1 ring-rose-500" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className={cn("w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center", customerType === "母婴客户" ? "bg-rose-100" : "bg-muted")}>
                  <User className={cn("h-4 w-4", customerType === "母婴客户" ? "text-rose-600" : "text-muted-foreground")} />
                </div>
                <p className={cn("text-xs font-medium", customerType === "母婴客户" ? "text-rose-700" : "")}>母婴客户</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">月嫂、育婴、催乳等</p>
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("产康客户")}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all",
                  customerType === "产康客户" 
                    ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className={cn("w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center", customerType === "产康客户" ? "bg-teal-100" : "bg-muted")}>
                  <Star className={cn("h-4 w-4", customerType === "产康客户" ? "text-teal-600" : "text-muted-foreground")} />
                </div>
                <p className={cn("text-xs font-medium", customerType === "产康客户" ? "text-teal-700" : "")}>产康客户</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">产后康复、调理等</p>
              </button>
            </div>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">客户姓名 <span className="text-red-500">*</span></Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="请输入姓名" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">联系电话 <span className="text-red-500">*</span></Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="请输入手机号" className="h-8 text-xs" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">客户来源</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择来源" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meituan">美团推广</SelectItem>
                <SelectItem value="douyin">抖音广告</SelectItem>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="referral">朋友介绍</SelectItem>
                <SelectItem value="website">官网咨询</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">备注说明</Label>
            <Textarea placeholder="请输入备注信息..." className="text-xs min-h-16 resize-none" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />确认新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 分组管理弹窗
function GroupManageDialog({ open, onOpenChange, groups, onGroupsChange }: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CustomerGroup[]
  onGroupsChange: (groups: CustomerGroup[]) => void 
}) {
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupColor, setNewGroupColor] = useState("blue")
  const colors = ["rose", "amber", "teal", "purple", "blue", "green", "cyan", "orange"]
  
  const addGroup = () => {
    if (newGroupName.trim()) {
      onGroupsChange([...groups, { id: `GRP${Date.now()}`, name: newGroupName.trim(), color: newGroupColor, count: 0 }])
      setNewGroupName("")
    }
  }
  
  const removeGroup = (id: string) => {
    onGroupsChange(groups.filter(g => g.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Tag className="h-4 w-4 text-primary" />
            管理客户分组
          </DialogTitle>
          <DialogDescription className="text-xs">创建自定义分组来管理您的客户</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* 现有分组 */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">现有分组</Label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {groups.map(group => (
                <div key={group.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", `bg-${group.color}-500`)} />
                    <span className="text-xs font-medium">{group.name}</span>
                    <Badge variant="secondary" className="text-[9px] h-4">{group.count}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeGroup(group.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* 新建分组 */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">新建分组</Label>
            <div className="flex gap-2">
              <Input 
                value={newGroupName} 
                onChange={e => setNewGroupName(e.target.value)} 
                placeholder="输入分组名称" 
                className="h-8 text-xs flex-1" 
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                    <div className={cn("w-4 h-4 rounded-full", `bg-${newGroupColor}-500`)} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <div className="flex gap-1">
                    {colors.map(c => (
                      <button 
                        key={c} 
                        type="button"
                        onClick={() => setNewGroupColor(c)}
                        className={cn("w-6 h-6 rounded-full", `bg-${c}-500`, newGroupColor === c && "ring-2 ring-offset-2")}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button size="sm" className="h-8 text-xs" onClick={addGroup} disabled={!newGroupName.trim()}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>完成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 移动到分组弹窗
function MoveToGroupDialog({ open, onOpenChange, groups, customerCount }: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CustomerGroup[]
  customerCount: number
}) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-sm pr-6">移动到分组</DialogTitle>
          <DialogDescription className="text-xs">将选中的 {customerCount} 位客户移动到分组</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {groups.map(group => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroup(group.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                selectedGroup === group.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", `bg-${group.color}-500`)} />
                <span className="text-sm">{group.name}</span>
              </div>
              {selectedGroup === group.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm" className="h-7 text-xs" disabled={!selectedGroup} onClick={() => onOpenChange(false)}>确认移动</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MyCustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const mineMergeFields: MergeFieldConfig[] = [
    { label: "手机号", key: "phone" },
    { label: "来源", key: "source" },
    { label: "获取方式", key: "acquireType" },
    { label: "地址", key: "address" },
    { label: "微信号", key: "wechat" },
  ]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  // 筛选条件
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100])
  const [ethnicityFilter, setEthnicityFilter] = useState("all")
  const [lastContactDays, setLastContactDays] = useState("all")
  const [dueDateMonth, setDueDateMonth] = useState("all")
  const [addressFilter, setAddressFilter] = useState("all")
  
  // 客户分组
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>(defaultGroups)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [showGroupManage, setShowGroupManage] = useState(false)
  const [showMoveToGroup, setShowMoveToGroup] = useState(false)
  
  // Dialog states
  const [detailCustomer, setDetailCustomer] = useState<MyCustomer | null>(null)
  const [callCustomer, setCallCustomer] = useState<MyCustomer | null>(null)
  const [tagCustomer, setTagCustomer] = useState<MyCustomer | null>(null)
  const [followupCustomer, setFollowupCustomer] = useState<MyCustomer | null>(null)
const [releaseCustomer, setReleaseCustomer] = useState<MyCustomer | null>(null)
  const [interviewCustomer, setInterviewCustomer] = useState<MyCustomer | null>(null)

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const filteredCustomers = useMemo(() => {
    return mockMyCustomers.filter(c => {
      if (searchTerm && !c.name.includes(searchTerm) && !c.phone.includes(searchTerm)) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => c.tags.some(t => t.id === tagId))) return false
      if (ethnicityFilter !== "all" && c.ethnicity !== ethnicityFilter) return false
      if (c.age && (c.age < ageRange[0] || c.age > ageRange[1])) return false
      if (addressFilter !== "all" && !c.address?.includes(addressFilter)) return false
      return true
    })
  }, [searchTerm, selectedTags, ethnicityFilter, ageRange, addressFilter])

  const stats = {
    total: filteredCustomers.length,
    following: filteredCustomers.filter(c => c.status === "following" || c.status === "potential").length,
    todayFollow: filteredCustomers.filter(c => c.nextFollowup === "2025-01-24" || c.nextFollowup === "2025-01-23").length,
    totalValue: filteredCustomers.reduce((sum, c) => sum + c.totalValue, 0),
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedCustomers(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  return (
    <AdminLayout>
      <div className="flex gap-4">
        {/* 左侧分组栏 */}
        <div className="w-48 shrink-0 space-y-3">
          <Card className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold">客户分组</h3>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowGroupManage(true)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                className={cn(
                  "w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                  selectedGroupId === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <span>全部客户</span>
                <Badge variant={selectedGroupId === null ? "secondary" : "outline"} className="text-[9px] h-4">
                  {mockMyCustomers.length}
                </Badge>
              </button>
              {customerGroups.map(group => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                    selectedGroupId === group.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      group.color === "rose" && "bg-rose-500",
                      group.color === "amber" && "bg-amber-500",
                      group.color === "teal" && "bg-teal-500",
                      group.color === "purple" && "bg-purple-500",
                      group.color === "blue" && "bg-blue-500",
                      group.color === "green" && "bg-green-500",
                    )} />
                    <span className="truncate">{group.name}</span>
                  </div>
                  <Badge variant={selectedGroupId === group.id ? "secondary" : "outline"} className="text-[9px] h-4">
                    {group.count}
                  </Badge>
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 h-7 text-xs bg-transparent"
              onClick={() => setShowGroupManage(true)}
            >
              <Plus className="h-3 w-3 mr-1" />新建分组
            </Button>
          </Card>
        </div>

        {/* 右侧主内容 */}
        <div className="flex-1 space-y-3 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">我的客户</h1>
            <p className="text-xs text-muted-foreground">自己分配、跟进、获取的客户</p>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Download className="h-3 w-3 mr-1" />导出
            </Button>
            {selectedCustomers.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setShowMoveToGroup(true)}>
                  <Tag className="h-3 w-3 mr-1" />移动到分组 ({selectedCustomers.length})
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Upload className="h-3 w-3 mr-1" />释放公海
                </Button>
                {selectedCustomers.length >= 2 && (
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setMergeDialogOpen(true)}>
                    <Merge className="h-3 w-3 mr-1" />合并客户 ({selectedCustomers.length})
                  </Button>
                )}
              </>
            )}
            <AddCustomerDialog trigger={<Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新增客户</Button>} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-rose-100 text-rose-600"><Heart className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.total}</p><p className="text-[10px] text-muted-foreground">我的客户</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-100 text-amber-600"><UserCheck className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.following}</p><p className="text-[10px] text-muted-foreground">待跟进</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-100 text-blue-600"><Clock className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.todayFollow}</p><p className="text-[10px] text-muted-foreground">今日待跟</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-100 text-emerald-600"><DollarSign className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">¥{(stats.totalValue / 10000).toFixed(1)}万</p><p className="text-[10px] text-muted-foreground">累计成交</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索姓名/手机号" className="pl-8 h-8 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="following">跟进中</SelectItem>
                <SelectItem value="potential">潜在</SelectItem>
                <SelectItem value="inactive">沉默</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="获取方式" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部方式</SelectItem>
                <SelectItem value="self">自拓</SelectItem>
                <SelectItem value="assigned">分配</SelectItem>
                <SelectItem value="claimed">公海领取</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="优先级" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高优先</SelectItem>
                <SelectItem value="medium">中优先</SelectItem>
                <SelectItem value="low">低优先</SelectItem>
              </SelectContent>
            </Select>
            
            {/* 标签筛选 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  <Tag className="h-3 w-3 mr-1" />标签
                  {selectedTags.length > 0 && <Badge variant="secondary" className="ml-1 h-4 text-[9px]">{selectedTags.length}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">按标签筛选</span>
                    {selectedTags.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => setSelectedTags([])}>清空</Button>
                    )}
                  </div>
                  {["意向", "需求", "特征"].map(group => {
                    const groupTags = availableTags.filter(t => t.group === group)
                    return (
                      <div key={group}>
                        <p className="text-[10px] text-muted-foreground mb-1">{group}</p>
                        <div className="flex flex-wrap gap-1">
                          {groupTags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] border transition-colors",
                                selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted"
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

            {/* 高级筛选 */}
            <Collapsible open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  <Filter className="h-3 w-3 mr-1" />更多筛选
                  <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvancedFilter && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* 高级筛选面板 - 常用筛选条件 */}
          <Collapsible open={showAdvancedFilter}>
            <CollapsibleContent>
              <Card className="p-4 mt-2">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="w-36">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">年龄范围</Label>
                    <div className="flex items-center gap-1.5">
                      <Input type="number" placeholder="最小" className="h-8 text-xs w-14" value={ageRange[0] || ""} onChange={e => setAgeRange([Number(e.target.value), ageRange[1]])} />
                      <span className="text-xs text-muted-foreground">-</span>
                      <Input type="number" placeholder="最大" className="h-8 text-xs w-14" value={ageRange[1] === 100 ? "" : ageRange[1]} onChange={e => setAgeRange([ageRange[0], Number(e.target.value) || 100])} />
                    </div>
                  </div>
                  <div className="w-24">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">民族</Label>
                    <Select value={ethnicityFilter} onValueChange={setEthnicityFilter}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="汉族">汉族</SelectItem>
                        <SelectItem value="回族">回族</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">最后联系</Label>
                    <Select value={lastContactDays} onValueChange={setLastContactDays}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="3">3天内</SelectItem>
                        <SelectItem value="7">7天内</SelectItem>
                        <SelectItem value="15">15天内</SelectItem>
                        <SelectItem value="30">30天内</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">预产期月份</Label>
                    <Select value={dueDateMonth} onValueChange={setDueDateMonth}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="2025-02">2025年2月</SelectItem>
                        <SelectItem value="2025-03">2025年3月</SelectItem>
                        <SelectItem value="2025-04">2025年4月</SelectItem>
                        <SelectItem value="2025-05">2025年5月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">家庭住址</Label>
                    <Select value={addressFilter} onValueChange={setAddressFilter}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="金凤区">金凤区</SelectItem>
                        <SelectItem value="兴庆区">兴庆区</SelectItem>
                        <SelectItem value="西夏区">西夏区</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => { setAgeRange([0, 100]); setEthnicityFilter("all"); setLastContactDays("all"); setDueDateMonth("all"); setAddressFilter("all") }}>
                    重置筛选
                  </Button>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* 已选标签 */}
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
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-8 px-2">
                  <input type="checkbox" checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0} onChange={toggleSelectAll} className="h-3.5 w-3.5 rounded border-gray-300" />
                </TableHead>
                <TableHead className="w-6 px-0"></TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>客户</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>客户类型</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>状态</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>来源</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>标签</TableHead>
                <TableHead className="text-xs text-right" style={{width: "11.1%"}}>订单</TableHead>
                <TableHead className="text-xs text-right" style={{width: "11.1%"}}>消费</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>下次跟进</TableHead>
                <TableHead className="text-xs" style={{width: "11.1%"}}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="group">
                  <TableCell className="px-2">
                    <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelect(customer.id)} className="h-3.5 w-3.5 rounded border-gray-300" />
                  </TableCell>
                  <TableCell className="px-0">
                    <Star className={cn("h-3 w-3", priorityConfig[customer.priority].className)} fill="currentColor" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">{customer.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <button type="button" onClick={() => setDetailCustomer(customer)} className="text-xs font-medium hover:text-primary transition-colors block truncate text-left">{customer.name}</button>
                        <p className="text-[10px] text-muted-foreground">{customer.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] h-5", customer.customerType === "母婴客户" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200")}>
                      {customer.customerType || "母婴客户"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={cn("text-[10px] h-5 px-1", statusConfig[customer.status].className)}>
                        {statusConfig[customer.status].label}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">{acquireTypeLabels[customer.acquireType]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] text-muted-foreground">{customer.source}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-0.5 max-w-20">
                      {customer.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>
                          {tag.name}
                        </Badge>
                      ))}
                      {customer.tags.length > 2 && <Badge variant="secondary" className="text-[9px] h-4 px-1">+{customer.tags.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-medium">{customer.orderCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-medium text-primary">¥{customer.totalValue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {customer.nextFollowup ? (
                      <span className="text-[10px] text-amber-600 font-medium">{customer.nextFollowup}</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="查看详情" onClick={() => setDetailCustomer(customer)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="拨打电话" onClick={() => setCallCustomer(customer)}>
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="打标签" onClick={() => setTagCustomer(customer)}>
                        <Tag className="h-3 w-3" />
                      </Button>
<Button variant="ghost" size="icon" className="h-6 w-6" title="跟进记录" onClick={() => setFollowupCustomer(customer)}>
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" title="发起面试" onClick={() => setInterviewCustomer(customer)}>
                                  <Video className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" title="释放/分享" onClick={() => setReleaseCustomer(customer)}>
                                  <Upload className="h-3 w-3" />
                                </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-3 py-2 border-t">
            <span className="text-[10px] text-muted-foreground">共 {filteredCustomers.length} 条</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent" disabled><ChevronLeft className="h-3 w-3" /></Button>
              <Button variant="default" size="icon" className="h-6 w-6">1</Button>
              <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent"><ChevronRight className="h-3 w-3" /></Button>
            </div>
          </div>
        </Card>
        </div>
      </div>

      {/* Dialogs */}
      {detailCustomer && (
        <CustomerDetailPanel
          customer={{
            id: detailCustomer.id,
            name: detailCustomer.name,
            phone: detailCustomer.phone,
            gender: detailCustomer.gender,
            age: detailCustomer.age,
            status: statusConfig[detailCustomer.status].label,
            consultant: "张顾问",
            customerStar: detailCustomer.customerStar,
            education: "高中",
            workExperience: detailCustomer.followupRecords?.[0]?.content || "-",
            remark: detailCustomer.address || "-",
            registrationDate: detailCustomer.createdAt,
            customerGroup: detailCustomer.groupId ? "VIP客户" : "其他",
            address: detailCustomer.address,
            wechat: detailCustomer.wechat,
            email: detailCustomer.email,
            expectedDueDate: detailCustomer.expectedDueDate,
            tags: detailCustomer.tags,
            stage: "入库",
            stageProgress: 35,
            profileCompleteness: 36,
            activities: detailCustomer.followupRecords?.map((record, index) => ({
              id: record.id,
              type: record.type === "phone" ? "call" : record.type === "wechat" ? "wechat" : "visit",
              content: `${record.type === "phone" ? "打电话给" : record.type === "wechat" ? "发微信给" : "拜访了"} ${detailCustomer.name}`,
              operator: record.consultant,
              time: "10:15",
              date: record.date,
              phoneNumber: record.type === "phone" ? detailCustomer.phone : undefined,
              callStatus: index % 2 === 0 ? "connected" : "missed",
            })) as ActivityRecord[] || [],
            orders: [],
            tasks: [],
          }}
          open={!!detailCustomer}
          onOpenChange={(open) => !open && setDetailCustomer(null)}
          onAddFollowup={(cust) => {
            // 使用已有的跟进记录组件
            setFollowupCustomer({ id: cust.id, name: cust.name, phone: cust.phone } as MyCustomer)
          }}
        />
      )}
      {callCustomer && <CallDialog customer={callCustomer} open={!!callCustomer} onOpenChange={(open) => !open && setCallCustomer(null)} />}

      {tagCustomer && <TagDialog customer={tagCustomer} open={!!tagCustomer} onOpenChange={(open) => !open && setTagCustomer(null)} />}
{followupCustomer && <FollowupDialogWrapper customer={followupCustomer} open={!!followupCustomer} onOpenChange={(open) => !open && setFollowupCustomer(null)} />}
      {releaseCustomer && <ReleaseDialog customer={releaseCustomer} open={!!releaseCustomer} onOpenChange={(open) => !open && setReleaseCustomer(null)} />}
      {interviewCustomer && <CreateInterviewDialog customer={{ id: interviewCustomer.id, name: interviewCustomer.name, phone: interviewCustomer.phone, serviceType: interviewCustomer.customerType }} open={!!interviewCustomer} onOpenChange={(open) => !open && setInterviewCustomer(null)} />}
      
      {/* Group Dialogs */}
      <GroupManageDialog open={showGroupManage} onOpenChange={setShowGroupManage} groups={customerGroups} onGroupsChange={setCustomerGroups} />
      <MoveToGroupDialog open={showMoveToGroup} onOpenChange={setShowMoveToGroup} groups={customerGroups} customerCount={selectedCustomers.length} />
      <MergeCustomersDialog
        customers={mockMyCustomers.filter(c => selectedCustomers.includes(c.id))}
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        fields={mineMergeFields}
      />
    </AdminLayout>
  )
}
