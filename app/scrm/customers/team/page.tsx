"use client"

import React from "react"
import { useRouter } from "next/navigation"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, Plus, Phone, MessageSquare, FileText, Eye, Users, TrendingUp,
  DollarSign, UserCheck, ChevronLeft, ChevronRight, Download, Share2,
  Tag, X, Filter, ChevronDown, Check, PhoneCall, PhoneOff, Send, User, Star, Clock, Video
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomerFollowupDialog, type CustomerForFollowup, type FollowupRecord } from "@/components/scrm/customer-followup-dialog"
import { CreateInterviewDialog, type CustomerForInterview } from "@/components/scrm/interview-dialog"
import { MergeCustomersDialog, type MergeFieldConfig } from "@/components/scrm/merge-customers-dialog"
import { CustomerDetailPanel, type CustomerDetail } from "@/components/scrm/customer-detail-panel"
import { Merge } from "lucide-react"

interface TeamCustomer {
  id: string
  name: string
  phone: string
  gender: "male" | "female"
  age?: number
  ethnicity?: string
  status: "active" | "inactive" | "potential"
  source: string
  assignedTo: string
  department: string
  orderCount: number
  totalValue: number
  lastFollowup: string
  createdAt: string
  tags: { id: string; name: string; color: string }[]
  expectedDueDate?: string
  address?: string
  wechat?: string
  momBirthday?: string
  babyBirthday?: string
  deliveryType?: string
  star?: number
  customerType?: "母婴客户" | "产康客户"
  contactCount?: number
  visitCount?: number
  totalCallDuration?: number
  daysNoContact?: number
}

const mockTeamCustomers: TeamCustomer[] = [
  { id: "TC001", name: "刘女士", phone: "138****5678", gender: "female", age: 30, ethnicity: "汉族", status: "active", source: "团队活动获客", assignedTo: "张顾问", department: "家庭服务一部", orderCount: 3, totalValue: 28800, lastFollowup: "2025-01-20", createdAt: "2024-10-15", tags: [{ id: "T4", name: "高净值", color: "amber" }, { id: "T11", name: "复购客户", color: "green" }], expectedDueDate: "2025-03-15", address: "银川市金凤区", wechat: "liu_mm", momBirthday: "1994-05-20", star: 5, customerType: "母婴客户", contactCount: 18, visitCount: 4, totalCallDuration: 56, daysNoContact: 5 },
  { id: "TC002", name: "陈先生", phone: "139****1234", gender: "male", age: 35, ethnicity: "汉族", status: "active", source: "公司官网", assignedTo: "李顾问", department: "家庭服务二部", orderCount: 1, totalValue: 9600, lastFollowup: "2025-01-18", createdAt: "2025-01-10", tags: [{ id: "T12", name: "新客户", color: "blue" }], address: "银川市兴庆区", star: 4, customerType: "母婴客户", contactCount: 5, visitCount: 1, totalCallDuration: 15, daysNoContact: 7 },
  { id: "TC003", name: "王女士", phone: "137****9876", gender: "female", age: 28, ethnicity: "回族", status: "potential", source: "展会获客", assignedTo: "王顾问", department: "职业发展一部", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-19", createdAt: "2025-01-15", tags: [{ id: "T7", name: "培训意向", color: "purple" }], address: "银川市西夏区", star: 3, customerType: "产康客户", contactCount: 3, visitCount: 0, totalCallDuration: 8, daysNoContact: 6 },
  { id: "TC004", name: "赵女士", phone: "135****4567", gender: "female", age: 32, ethnicity: "汉族", status: "active", source: "合作渠道", assignedTo: "张顾问", department: "家庭服务一部", orderCount: 5, totalValue: 52000, lastFollowup: "2025-01-22", createdAt: "2024-03-10", tags: [{ id: "T4", name: "高净值", color: "amber" }, { id: "T13", name: "VIP", color: "red" }, { id: "T11", name: "复购客户", color: "green" }], expectedDueDate: "2025-04-01", address: "银川市金凤区", wechat: "zhao_vip", momBirthday: "1992-08-15", babyBirthday: "", deliveryType: "待定", star: 5, customerType: "母婴客户", contactCount: 32, visitCount: 8, totalCallDuration: 120, daysNoContact: 3 },
  { id: "TC005", name: "孙先生", phone: "136****8901", gender: "male", age: 40, ethnicity: "汉族", status: "potential", source: "企业合作", assignedTo: "赵顾问", department: "职业发展二部", orderCount: 0, totalValue: 0, lastFollowup: "2025-01-21", createdAt: "2025-01-20", tags: [{ id: "T9", name: "企业客户", color: "blue" }, { id: "T14", name: "批量培训", color: "teal" }], address: "银川市兴庆区", star: 4, customerType: "产康客户", contactCount: 2, visitCount: 1, totalCallDuration: 25, daysNoContact: 4 },
]

const availableTags = [
  { id: "T1", name: "高意向", color: "red", group: "意向" },
  { id: "T5", name: "价格敏感", color: "gray", group: "意向" },
  { id: "T2", name: "月嫂需求", color: "rose", group: "需求" },
  { id: "T3", name: "育婴需求", color: "cyan", group: "需求" },
  { id: "T7", name: "培训意向", color: "purple", group: "需求" },
  { id: "T4", name: "高净值", color: "amber", group: "特征" },
  { id: "T9", name: "企业客户", color: "blue", group: "特征" },
  { id: "T11", name: "复购客户", color: "green", group: "特征" },
  { id: "T12", name: "新客户", color: "blue", group: "特征" },
  { id: "T13", name: "VIP", color: "red", group: "特征" },
  { id: "T14", name: "批量培训", color: "teal", group: "特征" },
]

const tagColorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700 border-gray-200",
  red: "bg-red-100 text-red-700 border-red-200",
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
}

const departmentColors: Record<string, string> = {
  "家庭服务一部": "bg-teal-50 text-teal-700 border-teal-200",
  "家庭服务二部": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "职业发展一部": "bg-violet-50 text-violet-700 border-violet-200",
  "职业发展二部": "bg-purple-50 text-purple-700 border-purple-200",
}

// 转换团队客户数据为CustomerDetail格式
function convertToCustomerDetail(customer: TeamCustomer): CustomerDetail {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender,
    age: customer.age,
    status: statusConfig[customer.status].label,
    consultant: customer.assignedTo,
    customerStar: customer.star,
    address: customer.address,
    wechat: customer.wechat,
    expectedDueDate: customer.expectedDueDate,
    babyBirthday: customer.babyBirthday,
    deliveryType: customer.deliveryType,
    tags: customer.tags,
    registrationDate: customer.createdAt,
    profileCompleteness: 75,
    activities: [
      { id: "1", type: "call", content: "电话跟进，客户对服务表示满意", operator: customer.assignedTo, time: "15:30", date: customer.lastFollowup, callStatus: "connected", duration: "5分12秒" },
    ],
    orders: customer.orderCount > 0 ? [
      { id: "1", orderNo: `DD${customer.id}001`, serviceName: "月嫂服务", amount: customer.totalValue, status: "completed", date: customer.createdAt }
    ] : [],
  }
}

// Call Dialog
function CallDialog({ customer, trigger }: { customer: TeamCustomer; trigger: React.ReactNode }) {
  const [callState, setCallState] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [callNote, setCallNote] = useState("")
  
  const startCall = () => { setCallState("calling"); setTimeout(() => setCallState("connected"), 2000) }
  const endCall = () => setCallState("ended")
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6"><Phone className="h-4 w-4 text-primary" />拨打电话</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">{customer.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.phone}</p>
          {callState === "calling" && <p className="text-xs text-amber-600 mt-2 animate-pulse">呼叫中...</p>}
          {callState === "connected" && <p className="text-xs text-green-600 mt-2">通话中 00:00</p>}
          {callState === "ended" && <p className="text-xs text-muted-foreground mt-2">通话已结束</p>}
        </div>
        {callState === "ended" && (
          <div className="space-y-2">
            <Label className="text-xs">通话备注</Label>
            <Textarea value={callNote} onChange={e => setCallNote(e.target.value)} placeholder="记录通话内容..." className="text-xs min-h-16" />
          </div>
        )}
        <DialogFooter>
          {callState === "idle" && <Button onClick={startCall} className="w-full h-8 text-xs"><PhoneCall className="h-3 w-3 mr-1" />开始呼叫</Button>}
          {(callState === "calling" || callState === "connected") && <Button onClick={endCall} variant="destructive" className="w-full h-8 text-xs"><PhoneOff className="h-3 w-3 mr-1" />结束通话</Button>}
          {callState === "ended" && <Button className="w-full h-8 text-xs"><Check className="h-3 w-3 mr-1" />保存记录</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Tag Dialog
function TagDialog({ customer, trigger }: { customer: TeamCustomer; trigger: React.ReactNode }) {
  const [customerTags, setCustomerTags] = useState(customer.tags)
  
  const toggleTag = (tag: typeof availableTags[0]) => {
    const exists = customerTags.some(t => t.id === tag.id)
    if (exists) {
      setCustomerTags(customerTags.filter(t => t.id !== tag.id))
    } else {
      setCustomerTags([...customerTags, { id: tag.id, name: tag.name, color: tag.color }])
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6"><Tag className="h-4 w-4 text-primary" />管理标签</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">当前标签</Label>
            <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded min-h-10">
              {customerTags.length > 0 ? customerTags.map(tag => (
                <Badge key={tag.id} variant="outline" className={cn("text-[10px] gap-1", tagColorMap[tag.color])}>
                  {tag.name}
                  <button type="button" onClick={() => toggleTag(tag as typeof availableTags[0])} className="hover:bg-black/10 rounded-full"><X className="h-2.5 w-2.5" /></button>
                </Badge>
              )) : <span className="text-xs text-muted-foreground">暂无标签</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">可用标签</Label>
            {["意向", "需求", "特征"].map(group => {
              const groupTags = availableTags.filter(t => t.group === group)
              return (
                <div key={group}>
                  <p className="text-[10px] text-muted-foreground mb-1">{group}</p>
                  <div className="flex flex-wrap gap-1">
                    {groupTags.map(tag => {
                      const isSelected = customerTags.some(t => t.id === tag.id)
                      return (
                        <button key={tag.id} type="button" onClick={() => toggleTag(tag)} className={cn("px-2 py-0.5 rounded text-[10px] border transition-colors", isSelected ? tagColorMap[tag.color] : "bg-muted/30 hover:bg-muted")}>
                          {isSelected && <Check className="h-2.5 w-2.5 inline mr-0.5" />}{tag.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" className="h-7 text-xs"><Check className="h-3 w-3 mr-1" />保存标签</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Followup Dialog - 使用共享组件
function FollowupDialog({ customer, trigger }: { customer: TeamCustomer; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  
  // 模拟跟进记录数据
  const mockFollowups: FollowupRecord[] = [
    { id: "F1", type: "phone", content: "确认了服务需求，客户意向较强，计划下周签约", time: "2025-01-22 14:30", duration: "8分钟", consultantId: "C1", consultantName: customer.assignedTo, consultantStatus: "active", hasRecording: true },
    { id: "F2", type: "wechat", content: "发送了服务报价单和公司介绍资料", time: "2025-01-18 10:15", consultantId: "C1", consultantName: customer.assignedTo, consultantStatus: "active" },
    { id: "F3", type: "phone", content: "初次联系客户，了解基本需求", time: "2025-01-15 09:00", duration: "5分钟", consultantId: "C2", consultantName: "前顾问", consultantStatus: "resigned", handoverTo: customer.assignedTo, hasRecording: true },
  ]

  const customerForFollowup: CustomerForFollowup = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    intention: customer.status === "active" ? "high" : customer.status === "potential" ? "medium" : "low",
    serviceType: customer.customerType === "母婴客户" ? "母婴服务" : "产康服务",
    currentConsultantName: customer.assignedTo,
    tags: customer.tags,
    followups: mockFollowups,
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <CustomerFollowupDialog customer={customerForFollowup} open={open} onOpenChange={setOpen} />
    </>
  )
}

// Interview Dialog
function InterviewDialog({ customer, trigger }: { customer: TeamCustomer; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const customerForInterview: CustomerForInterview = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    serviceType: customer.customerType === "母婴客户" ? "母婴服务" : "产康服务",
  }
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <CreateInterviewDialog customer={customerForInterview} open={open} onOpenChange={setOpen} />
    </>
  )
}

// Transfer Dialog
function TransferDialog({ customer, trigger }: { customer: TeamCustomer; trigger: React.ReactNode }) {
  const [action, setAction] = useState<"release" | "transfer" | "export">("transfer")
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6"><Share2 className="h-4 w-4 text-primary" />客户操作</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setAction("release")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "release" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <Users className="h-5 w-5 mx-auto mb-1 text-amber-600" />
              <p className="text-xs font-medium">释放公海</p>
            </button>
            <button type="button" onClick={() => setAction("transfer")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "transfer" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <User className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-medium">转给同事</p>
            </button>
            <button type="button" onClick={() => setAction("export")} className={cn("p-3 rounded-lg border text-center transition-colors", action === "export" ? "border-primary bg-primary/5" : "hover:bg-muted/50")}>
              <FileText className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-medium">导出资料</p>
            </button>
          </div>
          {action === "release" && (
            <div className="space-y-2">
              <Label className="text-xs">释放原因</Label>
              <Textarea placeholder="请输入释放原因..." className="text-xs min-h-16" />
            </div>
          )}
          {action === "transfer" && (
            <div className="space-y-2">
              <Label className="text-xs">选择接收人</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择顾问" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zhang">张顾问</SelectItem>
                  <SelectItem value="li">李顾问</SelectItem>
                  <SelectItem value="wang">王顾问</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {action === "export" && (
            <div className="space-y-2">
              <Label className="text-xs">导出内容</Label>
              <div className="space-y-1">
                <div className="flex items-center gap-2"><Checkbox id="exp1" defaultChecked /><label htmlFor="exp1" className="text-xs">基本信息</label></div>
                <div className="flex items-center gap-2"><Checkbox id="exp2" defaultChecked /><label htmlFor="exp2" className="text-xs">跟进记录</label></div>
                <div className="flex items-center gap-2"><Checkbox id="exp3" /><label htmlFor="exp3" className="text-xs">订单信息</label></div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button size="sm" className="h-7 text-xs">
            {action === "release" && "确认释放"}
            {action === "transfer" && "确认转移"}
            {action === "export" && "导出"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add Customer Dialog
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
                <SelectItem value="team">团队活动获客</SelectItem>
                <SelectItem value="website">公司官网</SelectItem>
                <SelectItem value="partner">合作渠道</SelectItem>
                <SelectItem value="referral">朋友介绍</SelectItem>
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

export default function TeamCustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<TeamCustomer | null>(null)

  const handleViewDetail = (customer: TeamCustomer) => {
    setSelectedCustomerForDetail(customer)
    setDetailPanelOpen(true)
  }

  const teamMergeFields: MergeFieldConfig[] = [
    { label: "手机号", key: "phone" },
    { label: "来源", key: "source" },
    { label: "负责顾问", key: "assignedTo" },
    { label: "所属部门", key: "department" },
    { label: "地址", key: "address" },
  ]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [ethnicityFilter, setEthnicityFilter] = useState("all")
  const [lastContactDays, setLastContactDays] = useState("all")
  const [dueDateMonth, setDueDateMonth] = useState("all")
  const [addressFilter, setAddressFilter] = useState("all")

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const handleCall = (customer: any) => {
    console.log("拨打电话:", customer.phone)
  }

  const filteredCustomers = useMemo(() => {
    return mockTeamCustomers.filter(c => {
      if (searchTerm && !c.name.includes(searchTerm) && !c.phone.includes(searchTerm)) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => c.tags.some(t => t.id === tagId))) return false
      if (ethnicityFilter !== "all" && c.ethnicity !== ethnicityFilter) return false
      if (addressFilter !== "all" && !c.address?.includes(addressFilter)) return false
      return true
    })
  }, [searchTerm, selectedTags, ethnicityFilter, addressFilter])

  const stats = {
    total: filteredCustomers.length,
    active: filteredCustomers.filter(c => c.status === "active").length,
    totalValue: filteredCustomers.reduce((sum, c) => sum + c.totalValue, 0),
    thisMonth: 3,
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
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">团队客户</h1>
            <p className="text-xs text-muted-foreground">通过团队渠道获取的客户资源</p>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />导出</Button>
            {selectedCustomers.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Share2 className="h-3 w-3 mr-1" />分配 ({selectedCustomers.length})</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Tag className="h-3 w-3 mr-1" />批量打标</Button>
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
              <div className="p-1.5 rounded bg-blue-100 text-blue-600"><Users className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.total}</p><p className="text-[10px] text-muted-foreground">团队客户</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-green-100 text-green-600"><UserCheck className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.active}</p><p className="text-[10px] text-muted-foreground">活跃客户</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-100 text-amber-600"><DollarSign className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">¥{(stats.totalValue / 10000).toFixed(1)}万</p><p className="text-[10px] text-muted-foreground">累计成交</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-none bg-muted/30">
            <CardContent className="p-2.5 flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-100 text-purple-600"><TrendingUp className="h-3.5 w-3.5" /></div>
              <div><p className="text-base font-bold leading-none">{stats.thisMonth}</p><p className="text-[10px] text-muted-foreground">本月新增</p></div>
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
                <SelectItem value="inactive">沉默</SelectItem>
                <SelectItem value="potential">潜在</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="部门" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                <SelectItem value="family1">家庭服务一部</SelectItem>
                <SelectItem value="family2">家庭服务二部</SelectItem>
                <SelectItem value="career1">职业发展一部</SelectItem>
                <SelectItem value="career2">职业发展二部</SelectItem>
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
                    {selectedTags.length > 0 && <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => setSelectedTags([])}>清空</Button>}
                  </div>
                  {["意向", "需求", "特征"].map(group => {
                    const groupTags = availableTags.filter(t => t.group === group)
                    return (
                      <div key={group}>
                        <p className="text-[10px] text-muted-foreground mb-1">{group}</p>
                        <div className="flex flex-wrap gap-1">
                          {groupTags.map(tag => (
                            <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={cn("px-1.5 py-0.5 rounded text-[10px] border transition-colors", selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted")}>{tag.name}</button>
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

          {/* 高级筛选面板 */}
          <Collapsible open={showAdvancedFilter}>
            <CollapsibleContent>
              <Card className="p-4 mt-2">
                <div className="flex flex-wrap gap-4 items-end">
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
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => { setEthnicityFilter("all"); setLastContactDays("all"); setDueDateMonth("all"); setAddressFilter("all") }}>
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
                    <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full"><X className="h-2.5 w-2.5" /></button>
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
                <TableHead className="w-10 px-2">
                  <input type="checkbox" checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0} onChange={toggleSelectAll} className="h-3.5 w-3.5 rounded border-gray-300" />
                </TableHead>
                <TableHead className="text-xs">客户信息</TableHead>
                <TableHead className="text-xs">客户类型</TableHead>
                <TableHead className="text-xs">状态</TableHead>
                <TableHead className="text-xs">标签</TableHead>
                <TableHead className="text-xs">部门/顾问</TableHead>
                <TableHead className="text-xs text-right w-16">订单</TableHead>
                <TableHead className="text-xs text-right w-20">消费</TableHead>
                <TableHead className="text-xs w-24">最近跟进</TableHead>
                <TableHead className="text-xs w-36">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="group">
                  <TableCell className="px-2">
                    <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelect(customer.id)} className="h-3.5 w-3.5 rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">{customer.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{customer.name}</p>
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
                    <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[customer.status].className)}>
                      {statusConfig[customer.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-0.5 max-w-24">
                      {customer.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>{tag.name}</Badge>
                      ))}
                      {customer.tags.length > 2 && <Badge variant="secondary" className="text-[9px] h-4 px-1">+{customer.tags.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <Badge variant="outline" className={cn("text-[10px] h-5", departmentColors[customer.department] || "bg-gray-50")}>
                        {customer.department}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{customer.assignedTo}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-medium">{customer.orderCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-medium text-primary">¥{customer.totalValue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] text-muted-foreground">{customer.lastFollowup}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="查看详情" onClick={() => handleViewDetail(customer)}><Eye className="h-3 w-3" /></Button>
                      <CallDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="拨打电话"><Phone className="h-3 w-3" /></Button>} />
                      
                      <TagDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="打标签"><Tag className="h-3 w-3" /></Button>} />
                      <FollowupDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="跟进记录"><FileText className="h-3 w-3" /></Button>} />
                      <InterviewDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6 text-primary" title="发起面试"><Video className="h-3 w-3" /></Button>} />
                      <TransferDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="分享/转移"><Share2 className="h-3 w-3" /></Button>} />
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
        <MergeCustomersDialog
          customers={mockTeamCustomers.filter(c => selectedCustomers.includes(c.id))}
          open={mergeDialogOpen}
          onOpenChange={setMergeDialogOpen}
          fields={teamMergeFields}
        />

        {/* 客户详情侧边面板 */}
        {selectedCustomerForDetail && (
          <CustomerDetailPanel
            customer={convertToCustomerDetail(selectedCustomerForDetail)}
            open={detailPanelOpen}
            onOpenChange={setDetailPanelOpen}
            onCall={handleCall}
          />
        )}
      </div>
    </AdminLayout>
  )
}
