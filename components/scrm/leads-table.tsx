"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CustomerDetailPanel, type CustomerDetail } from "@/components/scrm/customer-detail-panel"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, Upload, Users, MoreHorizontal, Phone, MessageSquare, Calendar,
  UserPlus, Eye, Clock, TrendingUp, Plus, ArrowRightLeft, ChevronLeft,
  ChevronRight, Tag, X, Filter, ChevronDown, Check, Edit, Trash2, FileText,
  Share2, Star, PhoneCall, PhoneOff, Mic, Download, User, MapPin, Building
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MergeCustomersDialog, type MergeFieldConfig } from "@/components/scrm/merge-customers-dialog"
import { Merge } from "lucide-react"

interface Lead {
  id: string
  name: string
  phone: string
  gender: "male" | "female"
  age?: number
  ethnicity?: string
  source: string
  intention: "high" | "medium" | "low"
  status: "new" | "following" | "opportunity" | "converted" | "invalid"
  lastContact: string
  daysInPool: number
  consultant?: string
  serviceType?: string
  notes?: string
  pool: "public" | "team"
  tags: { id: string; name: string; color: string }[]
  // 母婴顾问字段
  customerStar?: number
  expectedDueDate?: string
  babyBirthday?: string
  motherBirthday?: string
  deliveryType?: "natural" | "cesarean"
  address?: string
  // 共用字段
  phone2?: string
  phone3?: string
  wechat?: string
  registerDate?: string
  shareDate?: string
  familyIntro?: string
  createTime?: string
  lastActiveTime?: string
  lastContactTime?: string
  progress?: string
  customerType?: "母婴客户" | "产康客户"
  followPerson?: string
  prevFollowPerson?: string
  department?: string
  creator?: string
  lastFollowTime?: string
  lastFollowRecord?: string
  firstContact?: string
  lastContactPerson?: string
  firstFollowPerson?: string
  firstContactTime?: string
  transferReason?: string
  callCount?: number
  visitCount?: number
  totalAmount?: number
  orderCount?: number
  lastDealTime?: string
  totalCallDuration?: number
  noContactDays?: number
}

const mockLeads: Lead[] = [
  { id: "L001", name: "张女士", phone: "138****1234", phone2: "139****5555", gender: "female", age: 28, ethnicity: "汉族", source: "美团推广", intention: "high", status: "following", lastContact: "2025-01-23 10:30", daysInPool: 2, consultant: "张顾问", serviceType: "月嫂", notes: "预产期3月，已确定需求", pool: "team", tags: [{ id: "T1", name: "高意向", color: "red" }, { id: "T2", name: "月嫂需求", color: "rose" }], expectedDueDate: "2025-03-15", customerStar: 5, deliveryType: "natural", address: "银川市金凤区", wechat: "zhang_wx", registerDate: "2025-01-10", createTime: "2025-01-10 09:30", customerType: "母婴客户", department: "家庭服务一部", callCount: 5, visitCount: 1, totalAmount: 0, orderCount: 0 },
  { id: "L002", name: "李先生", phone: "139****5678", gender: "male", age: 35, ethnicity: "汉族", source: "抖音广告", intention: "medium", status: "new", lastContact: "2025-01-22 15:45", daysInPool: 5, serviceType: "育婴师", pool: "public", tags: [{ id: "T3", name: "育婴需求", color: "cyan" }], expectedDueDate: "2025-04-20", address: "银川市兴庆区", wechat: "li_wx", registerDate: "2025-01-15", createTime: "2025-01-15 14:20", customerType: "母婴客户", callCount: 2, visitCount: 0, totalAmount: 0, orderCount: 0 },
  { id: "L003", name: "王女士", phone: "137****9012", gender: "female", age: 32, ethnicity: "回族", source: "朋友介绍", intention: "high", status: "opportunity", lastContact: "2025-01-21 09:20", daysInPool: 3, consultant: "李顾问", serviceType: "月嫂", notes: "高端客户，对价格不敏感", pool: "team", tags: [{ id: "T1", name: "高意向", color: "red" }, { id: "T4", name: "VIP客户", color: "amber" }, { id: "T2", name: "月嫂需求", color: "rose" }], expectedDueDate: "2025-02-28", customerStar: 5, deliveryType: "cesarean", address: "银川市西夏区", wechat: "wang_wx", registerDate: "2025-01-08", createTime: "2025-01-08 10:15", customerType: "母婴客户", department: "家庭服务二部", callCount: 8, visitCount: 2, totalAmount: 28800, orderCount: 1, lastDealTime: "2025-01-20" },
  { id: "L004", name: "赵先生", phone: "136****3456", gender: "male", age: 40, ethnicity: "汉族", source: "官网咨询", intention: "low", status: "following", lastContact: "2025-01-20 14:10", daysInPool: 7, consultant: "王顾问", serviceType: "保姆", pool: "team", tags: [{ id: "T5", name: "价格敏感", color: "gray" }], address: "银川市金凤区", registerDate: "2025-01-05", createTime: "2025-01-05 16:40", customerType: "母婴客户", department: "家庭服务一部", callCount: 3, visitCount: 0, totalAmount: 0, orderCount: 0 },
  { id: "L005", name: "陈女士", phone: "135****7890", gender: "female", age: 30, ethnicity: "汉族", source: "小红书", intention: "medium", status: "new", lastContact: "2025-01-19 11:55", daysInPool: 4, serviceType: "产康", pool: "public", tags: [{ id: "T6", name: "产康需求", color: "teal" }], expectedDueDate: "2025-05-10", address: "银川市兴庆区", wechat: "chen_wx", registerDate: "2025-01-12", createTime: "2025-01-12 11:30", customerType: "产康客户", callCount: 1, visitCount: 0, totalAmount: 0, orderCount: 0 },
  { id: "L006", name: "刘先生", phone: "134****2345", gender: "male", age: 38, ethnicity: "汉族", source: "百度推广", intention: "high", status: "new", lastContact: "2025-01-18 16:30", daysInPool: 1, serviceType: "月嫂", pool: "public", tags: [{ id: "T1", name: "高意向", color: "red" }, { id: "T2", name: "月嫂需求", color: "rose" }], expectedDueDate: "2025-03-01", customerStar: 4, address: "银川市金凤区", registerDate: "2025-01-18", createTime: "2025-01-18 16:00", customerType: "母婴客户", callCount: 1, visitCount: 0, totalAmount: 0, orderCount: 0 },
  { id: "L007", name: "吴女士", phone: "133****6789", gender: "female", age: 42, ethnicity: "汉族", source: "线下活动", intention: "high", status: "following", lastContact: "2025-01-23 09:00", daysInPool: 1, consultant: "张顾问", serviceType: "月嫂培训", pool: "team", tags: [{ id: "T7", name: "培训意向", color: "purple" }], address: "银川市金凤区", registerDate: "2025-01-20", createTime: "2025-01-20 14:00", customerType: "产康客户", department: "职业发展一部", callCount: 4, visitCount: 1, totalAmount: 0, orderCount: 0 },
  { id: "L008", name: "孙女士", phone: "132****0123", gender: "female", age: 45, ethnicity: "回族", source: "朋友介绍", intention: "medium", status: "new", lastContact: "2025-01-22 14:00", daysInPool: 2, serviceType: "育婴师培训", pool: "public", tags: [{ id: "T7", name: "培训意向", color: "purple" }], address: "银川市兴庆区", registerDate: "2025-01-19", createTime: "2025-01-19 10:30", customerType: "产康客户", callCount: 2, visitCount: 0, totalAmount: 0, orderCount: 0 },
]

// 可用标签
const availableTags = [
  { id: "T1", name: "高意向", color: "red", group: "意向" },
  { id: "T5", name: "价格敏感", color: "gray", group: "意向" },
  { id: "T2", name: "月嫂需求", color: "rose", group: "需求" },
  { id: "T3", name: "育婴需求", color: "cyan", group: "需求" },
  { id: "T6", name: "产康需求", color: "teal", group: "需求" },
  { id: "T7", name: "培训意向", color: "purple", group: "需求" },
  { id: "T4", name: "VIP客户", color: "amber", group: "特征" },
  { id: "T8", name: "二胎妈妈", color: "pink", group: "特征" },
  { id: "T9", name: "高龄产妇", color: "orange", group: "特征" },
  { id: "T10", name: "双胞胎", color: "blue", group: "特征" },
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

const intentionConfig = {
  high: { label: "高意向", className: "bg-green-50 text-green-600 border-green-200" },
  medium: { label: "中意向", className: "bg-amber-50 text-amber-600 border-amber-200" },
  low: { label: "低意向", className: "bg-gray-50 text-gray-600 border-gray-200" },
}

const statusConfig = {
  new: { label: "新线索", className: "bg-blue-50 text-blue-600 border-blue-200" },
  following: { label: "跟进中", className: "bg-amber-50 text-amber-600 border-amber-200" },
  opportunity: { label: "有机会", className: "bg-purple-50 text-purple-600 border-purple-200" },
  converted: { label: "已转化", className: "bg-green-50 text-green-600 border-green-200" },
  invalid: { label: "无效", className: "bg-gray-50 text-gray-600 border-gray-200" },
}

// 查看详情弹窗
// 拨打电话弹窗
function CallDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [callNote, setCallNote] = useState("")
  
  const startCall = () => {
    setCallStatus("calling")
    setTimeout(() => setCallStatus("connected"), 2000)
  }
  
  const endCall = () => {
    setCallStatus("ended")
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setCallStatus("idle"); setCallNote("") } }}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)}><Phone className="h-3.5 w-3.5" /></Button>
      )}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm pr-6">拨打电话</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">{lead.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.phone}</p>
            </div>
          </div>

          {callStatus === "idle" && (
            <Button className="w-full" onClick={startCall}>
              <PhoneCall className="h-4 w-4 mr-2" />开始拨打
            </Button>
          )}

          {callStatus === "calling" && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm">正在呼叫中...</p>
              <Button variant="destructive" onClick={endCall}><PhoneOff className="h-4 w-4 mr-2" />挂断</Button>
            </div>
          )}

          {callStatus === "connected" && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-green-600">通话中 00:32</p>
              <Button variant="destructive" onClick={endCall}><PhoneOff className="h-4 w-4 mr-2" />挂断</Button>
            </div>
          )}

          {callStatus === "ended" && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-sm">通话结束</p>
                <p className="text-xs text-muted-foreground">通话时长: 02:15</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">通话备注</Label>
                <Textarea placeholder="记录本次通话内容..." className="text-xs" rows={3} value={callNote} onChange={e => setCallNote(e.target.value)} />
              </div>
              <Button className="w-full" onClick={() => setOpen(false)}>保存并关闭</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 发送消息弹窗
function MessageDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [messageType, setMessageType] = useState<"sms" | "wechat">("sms")
  const [message, setMessage] = useState("")
  
  const templates = [
    "您好，这里是优厚家政，您之前咨询的月嫂服务有最新优惠活动...",
    "尊敬的客户，感谢您的咨询，我们为您推荐一位经验丰富的月嫂...",
    "您好，您预约的上门服务已确认，服务人员将于...",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)}><MessageSquare className="h-3.5 w-3.5" /></Button>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm pr-6">发送消息</DialogTitle>
          <DialogDescription className="text-xs">发送给 {lead.name} ({lead.phone})</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant={messageType === "sms" ? "default" : "outline"} size="sm" className="flex-1 text-xs" onClick={() => setMessageType("sms")}>短信</Button>
            <Button variant={messageType === "wechat" ? "default" : "outline"} size="sm" className="flex-1 text-xs bg-transparent" onClick={() => setMessageType("wechat")}>微信</Button>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">快捷消息</Label>
            <div className="space-y-1">
              {templates.map((t, i) => (
                <button key={i} type="button" onClick={() => setMessage(t)} className="w-full text-left p-2 rounded text-xs bg-muted/50 hover:bg-muted truncate">
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">消息内容</Label>
            <Textarea placeholder="输入消息内容..." className="text-xs" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
            <p className="text-[10px] text-muted-foreground text-right">{message.length}/500</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => setOpen(false)}>取消</Button>
          <Button size="sm" className="text-xs" disabled={!message.trim()}>发送</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 打标签弹窗
function AddTagPopover({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<string[]>(lead.tags.map(t => t.id))
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Tag className="h-3.5 w-3.5" /></Button>}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b">
            <span className="text-xs font-medium">管理标签</span>
            <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1">
              <Plus className="h-2.5 w-2.5 mr-0.5" />新建
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded min-h-8">
            {selectedTags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId)
              if (!tag) return null
              return (
                <Badge key={tagId} variant="outline" className={cn("text-[9px] gap-0.5", tagColorMap[tag.color])}>
                  {tag.name}
                  <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full"><X className="h-2 w-2" /></button>
                </Badge>
              )
            })}
            {selectedTags.length === 0 && <span className="text-[10px] text-muted-foreground">暂无标签</span>}
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
                        "px-1.5 py-0.5 rounded text-[10px] border transition-colors flex items-center gap-0.5",
                        selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {selectedTags.includes(tag.id) && <Check className="h-2.5 w-2.5" />}
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          <div className="pt-1 border-t">
            <Button size="sm" className="w-full h-6 text-xs">确认</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// 跟进记录弹窗
function FollowupDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [followType, setFollowType] = useState("phone")
  const [content, setContent] = useState("")
  const [nextDate, setNextDate] = useState("")

  const records = [
    { type: "phone", content: "客户有意向，约定下次沟通时间", time: lead.lastContact, person: lead.consultant || "张顾问" },
    { type: "visit", content: "上门拜访，详细介绍了月嫂服务", time: "2025-01-20 14:00", person: lead.consultant || "张顾问" },
    { type: "wechat", content: "微信发送服务介绍资料", time: "2025-01-18 10:30", person: lead.consultant || "张顾问" },
  ]

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setShowAdd(false) }}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)}><FileText className="h-3.5 w-3.5" /></Button>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm pr-6 flex items-center justify-between">
            <span>跟进记录 - {lead.name}</span>
            <Button size="sm" className="h-6 text-xs" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="h-3 w-3 mr-1" />{showAdd ? "取消" : "新增"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        {showAdd && (
          <div className="p-3 rounded-lg border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">跟进方式</Label>
                <Select value={followType} onValueChange={setFollowType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">电话</SelectItem>
                    <SelectItem value="wechat">微信</SelectItem>
                    <SelectItem value="visit">拜访</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">下次跟进</Label>
                <Input type="date" className="h-8 text-xs" value={nextDate} onChange={e => setNextDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">跟进内容</Label>
              <Textarea placeholder="记录跟进内容..." className="text-xs" rows={3} value={content} onChange={e => setContent(e.target.value)} />
            </div>
            <Button size="sm" className="w-full h-7 text-xs">保存记录</Button>
          </div>
        )}

        <ScrollArea className="max-h-80">
          <div className="space-y-2">
            {records.map((record, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg border">
                <div className={cn("p-1 rounded", record.type === "phone" ? "bg-blue-100" : record.type === "visit" ? "bg-green-100" : "bg-purple-100")}>
                  {record.type === "phone" ? <Phone className="h-3 w-3 text-blue-600" /> : record.type === "visit" ? <MapPin className="h-3 w-3 text-green-600" /> : <MessageSquare className="h-3 w-3 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{record.type === "phone" ? "电话跟进" : record.type === "visit" ? "上门拜访" : "微信沟通"}</p>
                    <span className="text-[10px] text-muted-foreground">{record.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{record.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">跟进人: {record.person}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// 分享/释放弹窗
function ShareDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<"release" | "transfer" | "export">("release")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)}><Share2 className="h-3.5 w-3.5" /></Button>
      )}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm pr-6">客户操作 - {lead.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setAction("release")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "release" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <ArrowRightLeft className="h-5 w-5 mx-auto mb-1 text-amber-600" />
              <p className="text-xs">释放公海</p>
            </button>
            <button type="button" onClick={() => setAction("transfer")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "transfer" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <UserPlus className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xs">转给同事</p>
            </button>
            <button type="button" onClick={() => setAction("export")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "export" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <Download className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-xs">导出资料</p>
            </button>
          </div>

          {action === "release" && (
            <div className="space-y-2">
              <Label className="text-xs">释放原因</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择原因" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nofollow">长期未跟进</SelectItem>
                  <SelectItem value="noneed">客户暂无需求</SelectItem>
                  <SelectItem value="timeout">超期未成交</SelectItem>
                  <SelectItem value="other">其他原因</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "transfer" && (
            <div className="space-y-2">
              <Label className="text-xs">转给同事</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择同事" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zhang">张顾问</SelectItem>
                  <SelectItem value="li">李顾问</SelectItem>
                  <SelectItem value="wang">王顾问</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "export" && (
            <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
              将导出该客户的完整信息，包括基本资料、跟进记录等
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => setOpen(false)}>取消</Button>
          <Button size="sm" className="text-xs">{action === "release" ? "确认释放" : action === "transfer" ? "确认转移" : "导出"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function LeadsTable() {
  const router = useRouter()
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)

  // 转换Lead数据为CustomerDetail格式
  const convertToCustomerDetail = (lead: Lead): CustomerDetail => {
    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      gender: lead.gender,
      age: lead.age,
      status: lead.intention === "high" ? "高意向" : lead.intention === "medium" ? "中意向" : "低意向",
      consultant: lead.consultant,
      customerStar: lead.customerStar,
      address: lead.address,
      wechat: lead.wechat,
      expectedDueDate: lead.expectedDueDate,
      babyBirthday: lead.babyBirthday,
      deliveryType: lead.deliveryType,
      tags: lead.tags,
      profileCompleteness: 60,
      activities: [
        { id: "1", type: "call", content: "首次电话联系", operator: lead.consultant || "未分配", time: lead.lastContact.split(" ")[1], date: lead.lastContact.split(" ")[0], callStatus: "connected", duration: "2分30秒" },
      ],
    }
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLeadForDetail(lead)
    setShowDetailPanel(true)
  }

  // 业务流程处理函数 - 使用路由跳转到对应页面
  const handleCall = (customer: any) => {
    console.log("拨打电话:", customer.phone)
  }


  const leadsMergeFields: MergeFieldConfig[] = [
    { label: "手机号", key: "phone" },
    { label: "来源", key: "source" },
    { label: "预产期", key: "dueDate" },
    { label: "地址", key: "address" },
    { label: "备注", key: "remark" },
  ]
  const [activePool, setActivePool] = useState<"public" | "team">("public")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  // 常用筛选条件
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ethnicityFilter, setEthnicityFilter] = useState("all")
  const [lastContactDays, setLastContactDays] = useState("all")
  const [dueDateMonth, setDueDateMonth] = useState("all")
  const [addressFilter, setAddressFilter] = useState("all")

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(l => {
      if (l.pool !== activePool) return false
      if (searchTerm && !l.name.includes(searchTerm) && !l.phone.includes(searchTerm)) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => l.tags.some(t => t.id === tagId))) return false
      if (ethnicityFilter !== "all" && l.ethnicity !== ethnicityFilter) return false
      if (genderFilter !== "all" && l.gender !== genderFilter) return false
      if (ageMin && l.age && l.age < parseInt(ageMin)) return false
      if (ageMax && l.age && l.age > parseInt(ageMax)) return false
      return true
    })
  }, [activePool, searchTerm, selectedTags, ethnicityFilter, genderFilter, ageMin, ageMax])
  
  const stats = {
    public: mockLeads.filter(l => l.pool === "public").length,
    team: mockLeads.filter(l => l.pool === "team").length,
    new: filteredLeads.filter(l => l.status === "new").length,
    highIntent: filteredLeads.filter(l => l.intention === "high").length,
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedLeads((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">客户线索池</h1>
          <p className="text-xs text-muted-foreground">公海 {stats.public} 条 · 团队 {stats.team} 条</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-3 w-3 mr-1" />导入
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-3 w-3 mr-1" />新增线索
          </Button>
        </div>
      </div>

      {/* Pool Tabs & Stats */}
      <div className="flex items-center gap-3">
        <Tabs value={activePool} onValueChange={(v) => setActivePool(v as "public" | "team")}>
          <TabsList className="h-8">
            <TabsTrigger value="public" className="text-xs h-6 gap-1">
              公海池<Badge variant="secondary" className="h-4 text-[10px]">{stats.public}</Badge>
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs h-6 gap-1">
              团队线索<Badge variant="secondary" className="h-4 text-[10px]">{stats.team}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex-1 flex gap-2">
          <Card className="flex-1 border-0 shadow-none bg-muted/30">
            <CardContent className="p-2 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-sm font-bold">{filteredLeads.length}</span>
              <span className="text-[10px] text-muted-foreground">当前</span>
            </CardContent>
          </Card>
          <Card className="flex-1 border-0 shadow-none bg-muted/30">
            <CardContent className="p-2 flex items-center gap-2">
              <Plus className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-sm font-bold">{stats.new}</span>
              <span className="text-[10px] text-muted-foreground">新线索</span>
            </CardContent>
          </Card>
          <Card className="flex-1 border-0 shadow-none bg-muted/30">
            <CardContent className="p-2 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm font-bold">{filteredLeads.filter(l => l.daysInPool > 5).length}</span>
              <span className="text-[10px] text-muted-foreground">超5天</span>
            </CardContent>
          </Card>
          <Card className="flex-1 border-0 shadow-none bg-muted/30">
            <CardContent className="p-2 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-sm font-bold">{stats.highIntent}</span>
              <span className="text-[10px] text-muted-foreground">高意向</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索姓名/手机号" className="pl-8 h-8 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="来源" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部来源</SelectItem>
              <SelectItem value="meituan">美团推广</SelectItem>
              <SelectItem value="douyin">抖音广告</SelectItem>
              <SelectItem value="xiaohongshu">小红书</SelectItem>
              <SelectItem value="baidu">百度推广</SelectItem>
              <SelectItem value="referral">朋友介绍</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="意向" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部意向</SelectItem>
              <SelectItem value="high">高意向</SelectItem>
              <SelectItem value="medium">中意向</SelectItem>
              <SelectItem value="low">低意向</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="new">新线索</SelectItem>
              <SelectItem value="following">跟进中</SelectItem>
              <SelectItem value="opportunity">有机会</SelectItem>
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

          {selectedLeads.length > 0 && (
            <div className="flex gap-1.5 ml-auto">
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                <UserPlus className="h-3 w-3 mr-1" />分配 ({selectedLeads.length})
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                <ArrowRightLeft className="h-3 w-3 mr-1" />转移
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                <Tag className="h-3 w-3 mr-1" />批量打标
              </Button>
              {selectedLeads.length >= 2 && (
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setMergeDialogOpen(true)}>
                  <Merge className="h-3 w-3 mr-1" />合并客户 ({selectedLeads.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 高级筛选面板 */}
        <Collapsible open={showAdvancedFilter}>
          <CollapsibleContent>
            <Card className="p-4 mt-2">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-36">
                  <Label className="text-[10px] text-muted-foreground mb-1.5 block">年龄区间</Label>
                  <div className="flex items-center gap-1.5">
                    <Input placeholder="最小" className="h-8 text-xs w-14" value={ageMin} onChange={e => setAgeMin(e.target.value)} />
                    <span className="text-xs text-muted-foreground">-</span>
                    <Input placeholder="最大" className="h-8 text-xs w-14" value={ageMax} onChange={e => setAgeMax(e.target.value)} />
                  </div>
                </div>
                <div className="w-24">
                  <Label className="text-[10px] text-muted-foreground mb-1.5 block">性别</Label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                      <SelectItem value="male">男</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => { setAgeMin(""); setAgeMax(""); setGenderFilter("all"); setEthnicityFilter("all"); setDueDateMonth("all"); setAddressFilter("all"); setLastContactDays("all") }}>
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
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className="text-xs">客户</TableHead>
              <TableHead className="text-xs">客户类型</TableHead>
              <TableHead className="text-xs">状态</TableHead>
              <TableHead className="text-xs">来源</TableHead>
              <TableHead className="text-xs">标签</TableHead>
              <TableHead className="text-xs">服务需求</TableHead>
              <TableHead className="text-xs">池内天数</TableHead>
              <TableHead className="text-xs">最近跟进</TableHead>
              <TableHead className="text-xs w-44">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="group">
                <TableCell>
                  <Checkbox checked={selectedLeads.includes(lead.id)} onCheckedChange={() => toggleSelect(lead.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{lead.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium">{lead.name}</p>
                        {lead.customerStar && lead.customerStar >= 4 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{lead.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px]", 
                    lead.customerType === "母婴客户" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200"
                  )}>
                    {lead.customerType || "母婴客户"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Badge variant="outline" className={cn("text-[10px] w-fit", statusConfig[lead.status].className)}>
                      {statusConfig[lead.status].label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px] w-fit", intentionConfig[lead.intention].className)}>
                      {intentionConfig[lead.intention].label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{lead.source}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-0.5 max-w-28">
                    {lead.tags.slice(0, 2).map(tag => (
                      <Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>
                        {tag.name}
                      </Badge>
                    ))}
                    {lead.tags.length > 2 && <Badge variant="secondary" className="text-[9px] h-4 px-1">+{lead.tags.length - 2}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{lead.serviceType || "-"}</TableCell>
                <TableCell>
                  <Badge variant={lead.daysInPool > 5 ? "destructive" : "secondary"} className="text-[10px]">
                    {lead.daysInPool}天
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{lead.lastContact.split(" ")[0]}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="查看详情" onClick={() => handleViewDetail(lead)}><Eye className="h-3.5 w-3.5" /></Button>
                    <CallDialog lead={lead} trigger={<Button variant="ghost" size="icon" className="h-7 w-7" title="拨打电话"><Phone className="h-3.5 w-3.5" /></Button>} />
                    <MessageDialog lead={lead} trigger={<Button variant="ghost" size="icon" className="h-7 w-7" title="发送消息"><MessageSquare className="h-3.5 w-3.5" /></Button>} />
                    <AddTagPopover lead={lead} trigger={<Button variant="ghost" size="icon" className="h-7 w-7" title="打标签"><Tag className="h-3.5 w-3.5" /></Button>} />
                    <FollowupDialog lead={lead} trigger={<Button variant="ghost" size="icon" className="h-7 w-7" title="跟进记录"><FileText className="h-3.5 w-3.5" /></Button>} />
                    <ShareDialog lead={lead} trigger={<Button variant="ghost" size="icon" className="h-7 w-7" title="释放/分享"><Share2 className="h-3.5 w-3.5" /></Button>} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">显示 1-{filteredLeads.length} 条，共 {filteredLeads.length} 条</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" disabled><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <Button variant="outline" size="sm" className="h-7 w-7 text-xs bg-primary text-primary-foreground">1</Button>
          <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" disabled><ChevronRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm pr-6">新增客户/线索</DialogTitle>
            <DialogDescription className="text-xs">请填写客户基本信息</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start h-8">
              <TabsTrigger value="basic" className="text-xs h-6">基本信息</TabsTrigger>
              <TabsTrigger value="maternity" className="text-xs h-6">母婴顾问字段</TabsTrigger>
              <TabsTrigger value="more" className="text-xs h-6">更多信息</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">客户全名 *</Label><Input className="h-8 text-xs" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">手机号 *</Label><Input className="h-8 text-xs" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">性别 *</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="female">女</SelectItem><SelectItem value="male">男</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">手机号2</Label><Input className="h-8 text-xs" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">手机号3</Label><Input className="h-8 text-xs" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">微信</Label><Input className="h-8 text-xs" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">年龄</Label><Input className="h-8 text-xs" type="number" placeholder="请输入" /></div>
                <div className="space-y-1"><Label className="text-xs">民族</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="han">汉族</SelectItem><SelectItem value="hui">回族</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">来源 *</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="meituan">美团推广</SelectItem><SelectItem value="douyin">抖音广告</SelectItem><SelectItem value="xiaohongshu">小红书</SelectItem><SelectItem value="baidu">百度推广</SelectItem><SelectItem value="referral">朋友介绍</SelectItem><SelectItem value="offline">线下活动</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">所属顾问</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="zhang">张顾问</SelectItem><SelectItem value="li">李顾问</SelectItem><SelectItem value="wang">王顾问</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">客户类型</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="employer">雇主</SelectItem><SelectItem value="student">学员</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">服务需求</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="nanny">月嫂</SelectItem><SelectItem value="infant">育婴师</SelectItem><SelectItem value="recovery">产康</SelectItem><SelectItem value="housekeeper">保姆</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><Label className="text-xs">地址</Label><Input className="h-8 text-xs" placeholder="请输入详细地址" /></div>
              <div className="space-y-1"><Label className="text-xs">备注</Label><Textarea className="text-xs" rows={2} placeholder="请输入备注信息" /></div>
              <div className="space-y-1">
                <Label className="text-xs">客户标签</Label>
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-md min-h-[60px]">
                  {availableTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className={cn("text-[10px] cursor-pointer hover:opacity-80 transition-opacity", tagColorMap[tag.color])}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">点击选择标签，可多选</p>
              </div>
            </TabsContent>

            <TabsContent value="maternity" className="space-y-4 mt-3">
              <p className="text-xs text-muted-foreground">母婴顾问专用字段（管理雇主客户时填写）</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">客户星级</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="5">5星</SelectItem><SelectItem value="4">4星</SelectItem><SelectItem value="3">3星</SelectItem><SelectItem value="2">2星</SelectItem><SelectItem value="1">1星</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">预产期/产龄</Label><Input type="date" className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">宝宝生日</Label><Input type="date" className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">宝妈生日</Label><Input type="date" className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">分娩方式</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="natural">顺产</SelectItem><SelectItem value="cesarean">剖腹产</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><Label className="text-xs">家庭介绍</Label><Textarea className="text-xs" rows={2} placeholder="请输入家庭情况介绍" /></div>
            </TabsContent>

            <TabsContent value="more" className="space-y-4 mt-3">
              <p className="text-xs text-muted-foreground">更多可选信息字段</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">登记时间</Label><Input type="datetime-local" className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">共享时间</Label><Input type="datetime-local" className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">客户进展</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="new">新客户</SelectItem><SelectItem value="following">跟进中</SelectItem><SelectItem value="opportunity">有机会</SelectItem><SelectItem value="converted">已转化</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">客户跟进人</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="zhang">张顾问</SelectItem><SelectItem value="li">李顾问</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">部门</Label>
                  <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="family1">家庭服务一部</SelectItem><SelectItem value="family2">家庭服务二部</SelectItem><SelectItem value="career1">职业发展一部</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button size="sm" className="text-xs">保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm pr-6">导入线索</DialogTitle>
            <DialogDescription className="text-xs">支持 Excel、CSV 格式文件，单次最多导入5000条</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="text-xs">上传文件</TabsTrigger>
              <TabsTrigger value="template" className="text-xs">下载模板</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium text-foreground mb-1">拖拽文件到此处或点击选择</p>
                <p className="text-[10px] text-muted-foreground mb-3">支持 Excel (.xlsx, .xls) 和 CSV 格式，单个文件不超过 20MB</p>
                <Button variant="outline" size="sm" className="text-xs bg-white hover:bg-muted">选择文件</Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-medium">字段映射</Label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-1">文件中的列</p>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-[10px] w-full justify-start">姓名</Badge>
                      <Badge variant="secondary" className="text-[10px] w-full justify-start">手机号</Badge>
                      <Badge variant="secondary" className="text-[10px] w-full justify-start">来源</Badge>
                    </div>
                  </div>
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-1">系统字段</p>
                    <div className="space-y-1">
                      <Badge className="text-[10px] w-full justify-start bg-primary/10 text-primary">客户名称</Badge>
                      <Badge className="text-[10px] w-full justify-start bg-primary/10 text-primary">手机号</Badge>
                      <Badge className="text-[10px] w-full justify-start bg-primary/10 text-primary">线索来源</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-[10px] text-blue-700">提示：导入后将自动查重。手机号相同的线索将被识别为可能重复。</p>
              </div>
            </TabsContent>
            
            <TabsContent value="template" className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium mb-2">可选模板</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-white">
                    <Download className="h-3 w-3 mr-2" />
                    母婴客户导入模板
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-white">
                    <Download className="h-3 w-3 mr-2" />
                    产康客户导入模板
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-white">
                    <Download className="h-3 w-3 mr-2" />
                    培训学员导入模板
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[10px] text-amber-700"><span className="font-medium">模板说明：</span>包含所有标准字段，可按需填写。必填字段为：客户名称、手机号。</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => setShowImportDialog(false)}>取消</Button>
            <Button size="sm" className="text-xs">开始导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MergeCustomersDialog
        customers={filteredLeads.filter(l => selectedLeads.includes(l.id))}
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        fields={leadsMergeFields}
      />

      {/* 客户详情侧边面板 */}
      {selectedLeadForDetail && (
        <CustomerDetailPanel
          customer={convertToCustomerDetail(selectedLeadForDetail)}
          open={showDetailPanel}
          onOpenChange={setShowDetailPanel}
          onCall={handleCall}
        />
      )}
    </div>
  )
}
