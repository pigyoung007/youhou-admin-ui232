"use client"

import React from "react"
import { Video } from "lucide-react" // Import Video component

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, Phone, Eye, Users, Clock, UserPlus, ChevronLeft, ChevronRight,
  Filter, RefreshCw, Tag, X, ChevronDown, Check, Plus, MessageSquare,
  FileText, Share2, Star, PhoneCall, PhoneOff, Mic, Download, User, MapPin, Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomerFollowupDialog, type CustomerForFollowup, type FollowupRecord } from "@/components/scrm/customer-followup-dialog"
import { CreateInterviewDialog, type CustomerForInterview } from "@/components/scrm/interview-dialog"
import { MergeCustomersDialog, type MergeFieldConfig } from "@/components/scrm/merge-customers-dialog"
import { CustomerDetailPanel, type CustomerDetail } from "@/components/scrm/customer-detail-panel"
import { Merge } from "lucide-react"

interface SeaCustomer {
  id: string
  name: string
  phone: string
  phone2?: string
  gender: "male" | "female"
  age?: number
  ethnicity?: string
  source: string
  originalOwner: string
  releaseReason: string
  releaseDate: string
  daysInSea: number
  lastFollowup: string
  followupCount: number
  intentLevel: "high" | "medium" | "low"
  tags: { id: string; name: string; color: string }[]
  expectedDueDate?: string
  address?: string
  wechat?: string
  customerStar?: number
  deliveryType?: "natural" | "cesarean"
  babyBirthday?: string
  motherBirthday?: string
  serviceType?: string
  customerType?: "母婴客户" | "产康客户"
  totalAmount?: number
  orderCount?: number
  callCount?: number
  visitCount?: number
}

const mockSeaCustomers: SeaCustomer[] = [
  { id: "SEA001", name: "李女士", phone: "138****2345", gender: "female", age: 29, ethnicity: "汉族", source: "美团推广", originalOwner: "张顾问", releaseReason: "长期未跟进", releaseDate: "2025-01-15", daysInSea: 9, lastFollowup: "2025-01-10", followupCount: 3, intentLevel: "medium", tags: [{ id: "T2", name: "月嫂需求", color: "rose" }, { id: "T8", name: "预产期3月", color: "pink" }], expectedDueDate: "2025-03-15", address: "银川市金凤区", customerStar: 3, serviceType: "月嫂", customerType: "母婴客户", callCount: 3, visitCount: 0, totalAmount: 0, orderCount: 0 },
  { id: "SEA002", name: "王先生", phone: "139****6789", gender: "male", age: 35, ethnicity: "汉族", source: "抖音广告", originalOwner: "李顾问", releaseReason: "客户暂无需求", releaseDate: "2025-01-18", daysInSea: 6, lastFollowup: "2025-01-16", followupCount: 5, intentLevel: "low", tags: [{ id: "T3", name: "育婴师", color: "cyan" }, { id: "T5", name: "价格敏感", color: "gray" }], address: "银川市兴庆区", serviceType: "育婴师", customerType: "母婴客户", callCount: 5, visitCount: 1, totalAmount: 0, orderCount: 0 },
  { id: "SEA003", name: "赵女士", phone: "137****4567", gender: "female", age: 32, ethnicity: "回族", source: "小红书", originalOwner: "王顾问", releaseReason: "顾问离职释放", releaseDate: "2025-01-20", daysInSea: 4, lastFollowup: "2025-01-19", followupCount: 2, intentLevel: "high", tags: [{ id: "T4", name: "高净值", color: "amber" }, { id: "T6", name: "产康需求", color: "teal" }], expectedDueDate: "2025-04-10", address: "银川市西夏区", customerStar: 5, serviceType: "产康", customerType: "产康客户", callCount: 2, visitCount: 1, totalAmount: 9600, orderCount: 1 },
  { id: "SEA004", name: "孙女士", phone: "135****8901", gender: "female", age: 28, ethnicity: "汉族", source: "官网咨询", originalOwner: "张顾问", releaseReason: "超期未成交", releaseDate: "2025-01-12", daysInSea: 12, lastFollowup: "2025-01-08", followupCount: 8, intentLevel: "medium", tags: [{ id: "T2", name: "月嫂需求", color: "rose" }, { id: "T5", name: "比价中", color: "gray" }], expectedDueDate: "2025-03-01", address: "银川市金凤区", customerStar: 3, serviceType: "月嫂", customerType: "母婴客户", callCount: 8, visitCount: 2, totalAmount: 0, orderCount: 0 },
  { id: "SEA005", name: "周先生", phone: "136****2345", gender: "male", age: 40, ethnicity: "汉族", source: "朋友介绍", originalOwner: "李顾问", releaseReason: "客户要求释放", releaseDate: "2025-01-22", daysInSea: 2, lastFollowup: "2025-01-21", followupCount: 4, intentLevel: "high", tags: [{ id: "T9", name: "企业客户", color: "blue" }, { id: "T10", name: "批量需求", color: "purple" }], address: "银川市兴庆区", customerStar: 4, serviceType: "月嫂", customerType: "母婴客户", callCount: 4, visitCount: 1, totalAmount: 28800, orderCount: 2 },
]

// 可用标签
const availableTags = [
  { id: "T1", name: "高意向", color: "red", group: "意向" },
  { id: "T5", name: "价格敏感", color: "gray", group: "意向" },
  { id: "T2", name: "月嫂需求", color: "rose", group: "需求" },
  { id: "T3", name: "育婴师", color: "cyan", group: "需求" },
  { id: "T6", name: "产康需求", color: "teal", group: "需求" },
  { id: "T4", name: "高净值", color: "amber", group: "特征" },
  { id: "T8", name: "预产期3月", color: "pink", group: "特征" },
  { id: "T9", name: "企业客户", color: "blue", group: "特征" },
  { id: "T10", name: "批量需求", color: "purple", group: "特征" },
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

const intentConfig = {
  high: { label: "高意向", className: "bg-green-50 text-green-600 border-green-200" },
  medium: { label: "中意向", className: "bg-amber-50 text-amber-600 border-amber-200" },
  low: { label: "低意向", className: "bg-gray-50 text-gray-600 border-gray-200" },
}

// 转换公海客户数据为CustomerDetail格式
function convertToCustomerDetail(customer: SeaCustomer): CustomerDetail {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender,
    age: customer.age,
    status: customer.intentLevel === "high" ? "高意向" : customer.intentLevel === "medium" ? "中意向" : "低意向",
    consultant: customer.originalOwner,
    customerStar: customer.customerStar,
    address: customer.address,
    wechat: customer.wechat,
    expectedDueDate: customer.expectedDueDate,
    babyBirthday: customer.babyBirthday,
    deliveryType: customer.deliveryType === "natural" ? "顺产" : customer.deliveryType === "cesarean" ? "剖腹产" : undefined,
    tags: customer.tags,
    profileCompleteness: 65,
    activities: [
      { id: "1", type: "call", content: "电话跟进，客户表示正在比较", operator: customer.originalOwner, time: "14:30", date: customer.lastFollowup, callStatus: "connected", duration: "3分28秒" },
      { id: "2", type: "transfer", content: `客户释放至公海，原因：${customer.releaseReason}`, operator: "系统", time: "10:00", date: customer.releaseDate, transferTo: "公海" },
    ],
  }
}

// 拨打电话弹窗
function CallDialog({ customer, trigger }: { customer: SeaCustomer; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [callNote, setCallNote] = useState("")
  
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setCallStatus("idle"); setCallNote("") } }}>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)}><Phone className="h-3 w-3" /></Button>}
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="text-sm pr-6">拨打电话</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{customer.name.slice(0, 1)}</AvatarFallback></Avatar>
            <div><p className="text-sm font-medium">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.phone}</p></div>
          </div>
          {callStatus === "idle" && <Button className="w-full" onClick={() => { setCallStatus("calling"); setTimeout(() => setCallStatus("connected"), 2000) }}><PhoneCall className="h-4 w-4 mr-2" />开始拨打</Button>}
          {callStatus === "calling" && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-pulse"><Phone className="h-8 w-8 text-green-600" /></div>
              <p className="text-sm">正在呼叫中...</p>
              <Button variant="destructive" onClick={() => setCallStatus("ended")}><PhoneOff className="h-4 w-4 mr-2" />挂断</Button>
            </div>
          )}
          {callStatus === "connected" && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center"><Mic className="h-8 w-8 text-white" /></div>
              <p className="text-sm text-green-600">通话中 00:32</p>
              <Button variant="destructive" onClick={() => setCallStatus("ended")}><PhoneOff className="h-4 w-4 mr-2" />挂断</Button>
            </div>
          )}
          {callStatus === "ended" && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center"><p className="text-sm">通话结束</p><p className="text-xs text-muted-foreground">通话时长: 02:15</p></div>
              <div className="space-y-1.5"><Label className="text-xs">通话备注</Label><Textarea placeholder="记录本次通话内容..." className="text-xs" rows={3} value={callNote} onChange={e => setCallNote(e.target.value)} /></div>
              <Button className="w-full" onClick={() => setOpen(false)}>保存并关闭</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 打标签弹窗
function AddTagPopover({ customer, trigger }: { customer: SeaCustomer; trigger?: React.ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<string[]>(customer.tags.map(t => t.id))
  const toggleTag = (tagId: string) => setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger || <Button variant="ghost" size="icon" className="h-6 w-6"><Tag className="h-3 w-3" /></Button>}</PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b"><span className="text-xs font-medium">管理标签</span><Button variant="ghost" size="sm" className="h-5 text-[10px] px-1"><Plus className="h-2.5 w-2.5 mr-0.5" />新建</Button></div>
          <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded min-h-8">
            {selectedTags.map(tagId => { const tag = availableTags.find(t => t.id === tagId); if (!tag) return null; return (<Badge key={tagId} variant="outline" className={cn("text-[9px] gap-0.5", tagColorMap[tag.color])}>{tag.name}<button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full"><X className="h-2 w-2" /></button></Badge>) })}
            {selectedTags.length === 0 && <span className="text-[10px] text-muted-foreground">暂无标签</span>}
          </div>
          {["意向", "需求", "特征"].map(group => (<div key={group}><p className="text-[10px] text-muted-foreground mb-1">{group}</p><div className="flex flex-wrap gap-1">{availableTags.filter(t => t.group === group).map(tag => (<button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={cn("px-1.5 py-0.5 rounded text-[10px] border transition-colors flex items-center gap-0.5", selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted")}>{selectedTags.includes(tag.id) && <Check className="h-2.5 w-2.5" />}{tag.name}</button>))}</div></div>))}
          <div className="pt-1 border-t"><Button size="sm" className="w-full h-6 text-xs">确认</Button></div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// 跟进记录弹窗 - 使用共享组件
function FollowupDialog({ customer, trigger }: { customer: SeaCustomer; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  
  // 模拟跟进记录数据
  const mockFollowups: FollowupRecord[] = [
    { id: "F1", type: "phone", content: "客户表示暂时不需要服务，建议过段时间再联系", time: customer.lastFollowup, consultantId: "C1", consultantName: customer.originalOwner, consultantStatus: "resigned", handoverTo: "新顾问", hasRecording: true, duration: "3分钟" },
    { id: "F2", type: "meeting", content: "上门拜访，介绍了服务内容和价格", time: "2025-01-15 14:00", consultantId: "C1", consultantName: customer.originalOwner, consultantStatus: "resigned", handoverTo: "新顾问" },
  ]

  const customerForFollowup: CustomerForFollowup = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    intention: customer.intentLevel,
    serviceType: customer.serviceType,
    currentConsultantName: customer.originalOwner,
    tags: customer.tags.map(t => ({ ...t, color: t.color })),
    followups: mockFollowups,
  }

  return (
    <>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)}><FileText className="h-3 w-3" /></Button>}
      <CustomerFollowupDialog customer={customerForFollowup} open={open} onOpenChange={setOpen} />
    </>
  )
}

// 领取/分享弹窗
function ClaimDialog({ customer, trigger }: { customer: SeaCustomer; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)}><UserPlus className="h-3 w-3" /></Button>}
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="text-sm pr-6">领取客户</DialogTitle><DialogDescription className="text-xs">确认领取 {customer.name} 到我的客户？</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{customer.name.slice(0, 1)}</AvatarFallback></Avatar>
              <div><p className="text-sm font-medium">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.phone} · {customer.intentLevel === "high" ? "高意向" : customer.intentLevel === "medium" ? "中意向" : "低意向"}</p></div>
            </div>
          </div>
          <div className="p-3 rounded-lg border space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">原归属人</span><span>{customer.originalOwner}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">公海天数</span><span className="text-amber-600">{customer.daysInSea}天</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">跟进次数</span><span>{customer.followupCount}次</span></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => setOpen(false)}>取消</Button><Button size="sm" className="text-xs">确认领取</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 面试弹窗
function InterviewDialog({ customer, trigger }: { customer: SeaCustomer; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const customerForInterview: CustomerForInterview = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    serviceType: customer.serviceType,
  }
  return (
    <>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => setOpen(true)}><Video className="h-3 w-3" /></Button>}
      <CreateInterviewDialog customer={customerForInterview} open={open} onOpenChange={setOpen} />
    </>
  )
}

export default function SeaCustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<SeaCustomer | null>(null)

  const handleViewDetail = (customer: SeaCustomer) => {
    setSelectedCustomerForDetail(customer)
    setDetailPanelOpen(true)
  }

  const handleCall = (customer: any) => {
    // TODO: 实现拨打电话功能，可集成第三方电话系统
    console.log("拨打电话:", customer.phone)
  }

  const handleAddFollowup = (customer: any) => {
    // TODO: 打开跟进记录添加对话框
    console.log("添加跟进:", customer.name)
  }
  
  const seaMergeFields: MergeFieldConfig[] = [
    { label: "手机号", key: "phone" },
    { label: "来源", key: "source" },
    { label: "原负责人", key: "originalOwner" },
    { label: "意向等级", key: "intentLevel" },
    { label: "地址", key: "address" },
  ]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ethnicityFilter, setEthnicityFilter] = useState("all")
  const [dueDateMonth, setDueDateMonth] = useState("all")
  const [addressFilter, setAddressFilter] = useState("all")

  const toggleTag = (tagId: string) => setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])

  const filteredCustomers = useMemo(() => {
    return mockSeaCustomers.filter(c => {
      if (searchTerm && !c.name.includes(searchTerm) && !c.phone.includes(searchTerm)) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => c.tags.some(t => t.id === tagId))) return false
      if (ethnicityFilter !== "all" && c.ethnicity !== ethnicityFilter) return false
      if (genderFilter !== "all" && c.gender !== genderFilter) return false
      if (addressFilter !== "all" && !c.address?.includes(addressFilter)) return false
      if (ageMin && c.age && c.age < parseInt(ageMin)) return false
      if (ageMax && c.age && c.age > parseInt(ageMax)) return false
      return true
    })
  }, [searchTerm, selectedTags, ethnicityFilter, genderFilter, addressFilter, ageMin, ageMax])

  const stats = { total: filteredCustomers.length, highIntent: filteredCustomers.filter(c => c.intentLevel === "high").length, overWeek: filteredCustomers.filter(c => c.daysInSea > 7).length, todayNew: 2 }

  const toggleSelectAll = () => { if (selectedCustomers.length === filteredCustomers.length) { setSelectedCustomers([]) } else { setSelectedCustomers(filteredCustomers.map(c => c.id)) } }
  const toggleSelect = (id: string) => setSelectedCustomers(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])

  return (
    <AdminLayout>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div><h1 className="text-lg font-bold">公海客户</h1><p className="text-xs text-muted-foreground">被销售顾问放弃或释放的客户，可领取跟进</p></div>
          {selectedCustomers.length > 0 && (
            <div className="flex gap-1.5">
              <Button size="sm" className="h-7 text-xs"><UserPlus className="h-3 w-3 mr-1" />批量领取 ({selectedCustomers.length})</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Tag className="h-3 w-3 mr-1" />批量打标</Button>
              {selectedCustomers.length >= 2 && (
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setMergeDialogOpen(true)}>
                  <Merge className="h-3 w-3 mr-1" />合并客户 ({selectedCustomers.length})
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Card className="border-0 shadow-none bg-muted/30"><CardContent className="p-2.5 flex items-center gap-2"><div className="p-1.5 rounded bg-blue-100 text-blue-600"><Users className="h-3.5 w-3.5" /></div><div><p className="text-base font-bold leading-none">{stats.total}</p><p className="text-[10px] text-muted-foreground">公海客户</p></div></CardContent></Card>
          <Card className="border-0 shadow-none bg-muted/30"><CardContent className="p-2.5 flex items-center gap-2"><div className="p-1.5 rounded bg-green-100 text-green-600"><UserPlus className="h-3.5 w-3.5" /></div><div><p className="text-base font-bold leading-none">{stats.highIntent}</p><p className="text-[10px] text-muted-foreground">高意向</p></div></CardContent></Card>
          <Card className="border-0 shadow-none bg-muted/30"><CardContent className="p-2.5 flex items-center gap-2"><div className="p-1.5 rounded bg-amber-100 text-amber-600"><Clock className="h-3.5 w-3.5" /></div><div><p className="text-base font-bold leading-none">{stats.overWeek}</p><p className="text-[10px] text-muted-foreground">超7天未领</p></div></CardContent></Card>
          <Card className="border-0 shadow-none bg-muted/30"><CardContent className="p-2.5 flex items-center gap-2"><div className="p-1.5 rounded bg-purple-100 text-purple-600"><RefreshCw className="h-3.5 w-3.5" /></div><div><p className="text-base font-bold leading-none">{stats.todayNew}</p><p className="text-[10px] text-muted-foreground">今日新增</p></div></CardContent></Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="搜索姓名/手机号" className="pl-8 h-8 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <Select defaultValue="all"><SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="意向度" /></SelectTrigger><SelectContent><SelectItem value="all">全部意向</SelectItem><SelectItem value="high">高意向</SelectItem><SelectItem value="medium">中意向</SelectItem><SelectItem value="low">低意向</SelectItem></SelectContent></Select>
            <Select defaultValue="all"><SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="来源" /></SelectTrigger><SelectContent><SelectItem value="all">全部来源</SelectItem><SelectItem value="meituan">美团推广</SelectItem><SelectItem value="douyin">抖音广告</SelectItem><SelectItem value="xiaohongshu">小红书</SelectItem></SelectContent></Select>
            <Select defaultValue="all"><SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="释放原因" /></SelectTrigger><SelectContent><SelectItem value="all">全部原因</SelectItem><SelectItem value="nofollow">长期未跟进</SelectItem><SelectItem value="noneed">客户暂无需求</SelectItem><SelectItem value="resign">顾问离职</SelectItem></SelectContent></Select>
            
            <Popover><PopoverTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs bg-transparent"><Tag className="h-3 w-3 mr-1" />标签{selectedTags.length > 0 && <Badge variant="secondary" className="ml-1 h-4 text-[9px]">{selectedTags.length}</Badge>}</Button></PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end"><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-medium">按标签筛选</span>{selectedTags.length > 0 && <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => setSelectedTags([])}>清空</Button>}</div>{["意向", "需求", "特征"].map(group => (<div key={group}><p className="text-[10px] text-muted-foreground mb-1">{group}</p><div className="flex flex-wrap gap-1">{availableTags.filter(t => t.group === group).map(tag => (<button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={cn("px-1.5 py-0.5 rounded text-[10px] border transition-colors", selectedTags.includes(tag.id) ? tagColorMap[tag.color] : "bg-muted/50 hover:bg-muted")}>{tag.name}</button>))}</div></div>))}</div></PopoverContent>
            </Popover>

            <Collapsible open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}><CollapsibleTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs bg-transparent"><Filter className="h-3 w-3 mr-1" />更多筛选<ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvancedFilter && "rotate-180")} /></Button></CollapsibleTrigger></Collapsible>
          </div>

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
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => { setAgeMin(""); setAgeMax(""); setGenderFilter("all"); setEthnicityFilter("all"); setDueDateMonth("all"); setAddressFilter("all") }}>
                    重置筛选
                  </Button>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {selectedTags.length > 0 && (<div className="flex items-center gap-2 flex-wrap"><span className="text-xs text-muted-foreground">已选标签:</span>{selectedTags.map(tagId => { const tag = availableTags.find(t => t.id === tagId); if (!tag) return null; return (<Badge key={tagId} variant="outline" className={cn("text-[10px] gap-1", tagColorMap[tag.color])}>{tag.name}<button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full"><X className="h-2.5 w-2.5" /></button></Badge>) })}</div>)}
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="w-10"><Checkbox checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
              <TableHead className="text-xs">客户</TableHead><TableHead className="text-xs">客户类型</TableHead><TableHead className="text-xs">意向</TableHead><TableHead className="text-xs">来源</TableHead><TableHead className="text-xs">标签</TableHead><TableHead className="text-xs">原归属</TableHead><TableHead className="text-xs">公海天数</TableHead><TableHead className="text-xs">释放原因</TableHead><TableHead className="text-xs w-44">操作</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id} className="group">
                  <TableCell><Checkbox checked={selectedCustomers.includes(customer.id)} onCheckedChange={() => toggleSelect(customer.id)} /></TableCell>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{customer.name.slice(0, 1)}</AvatarFallback></Avatar><div><div className="flex items-center gap-1"><p className="text-xs font-medium">{customer.name}</p>{customer.customerStar && customer.customerStar >= 4 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}</div><p className="text-[10px] text-muted-foreground">{customer.phone}</p></div></div></TableCell>
                  <TableCell><Badge variant="outline" className={cn("text-[10px]", customer.customerType === "母婴客户" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200")}>{customer.customerType || "母婴客户"}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={cn("text-[10px]", intentConfig[customer.intentLevel].className)}>{intentConfig[customer.intentLevel].label}</Badge></TableCell>
                  <TableCell className="text-xs">{customer.source}</TableCell>
                  <TableCell><div className="flex flex-wrap gap-0.5 max-w-24">{customer.tags.slice(0, 2).map(tag => (<Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>{tag.name}</Badge>))}{customer.tags.length > 2 && <Badge variant="secondary" className="text-[9px] h-4 px-1">+{customer.tags.length - 2}</Badge>}</div></TableCell>
                  <TableCell className="text-xs">{customer.originalOwner}</TableCell>
                  <TableCell><Badge variant={customer.daysInSea > 7 ? "destructive" : "secondary"} className="text-[10px]">{customer.daysInSea}天</Badge></TableCell>
                  <TableCell className="text-xs">{customer.releaseReason}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="查看详情" onClick={() => handleViewDetail(customer)}><Eye className="h-3 w-3" /></Button>
                      <CallDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="拨打电话"><Phone className="h-3 w-3" /></Button>} />
                      
                      <AddTagPopover customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="打标签"><Tag className="h-3 w-3" /></Button>} />
                      <FollowupDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="跟进记录"><FileText className="h-3 w-3" /></Button>} />
                      <ClaimDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="领取客户"><UserPlus className="h-3 w-3" /></Button>} />
                      <InterviewDialog customer={customer} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="面试安排"><Video className="h-3 w-3" /></Button>} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">显示 1-{filteredCustomers.length} 条，共 {filteredCustomers.length} 条</p><div className="flex items-center gap-1"><Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" disabled><ChevronLeft className="h-3.5 w-3.5" /></Button><Button variant="outline" size="sm" className="h-7 w-7 text-xs bg-primary text-primary-foreground">1</Button><Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" disabled><ChevronRight className="h-3.5 w-3.5" /></Button></div></div>
        <MergeCustomersDialog
          customers={mockSeaCustomers.filter(c => selectedCustomers.includes(c.id))}
          open={mergeDialogOpen}
          onOpenChange={setMergeDialogOpen}
          fields={seaMergeFields}
        />

        {/* 客户详情侧边面板 */}
        {selectedCustomerForDetail && (
          <CustomerDetailPanel
            customer={convertToCustomerDetail(selectedCustomerForDetail)}
            open={detailPanelOpen}
            onOpenChange={setDetailPanelOpen}
            onCall={handleCall}
            onAddFollowup={handleAddFollowup}
          />
        )}
      </div>
    </AdminLayout>
  )
}
