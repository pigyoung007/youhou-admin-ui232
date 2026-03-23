"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Star,
  Phone,
  Calendar,
  Plus,
  LayoutGrid,
  List,
  TableIcon,
  Eye,
  MoreHorizontal,
  Shield,
  AlertTriangle,
  UserMinus,
  Ban,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Users,
} from "lucide-react"
import { StaffCallDialog, type StaffForCall } from "@/components/operations/staff-call-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface StaffMember {
  id: string
  name: string
  age: number
  status: "available" | "working" | "vacation"
  rating: number
  orders: number
  experience?: string
  skills: string[]
  location?: string
  price?: string
  phone?: string
}

interface StaffListViewProps {
  title: string
  subtitle: string
  staffList: StaffMember[]
  statusConfig: Record<string, { label: string; color: string }>
  avatarColor?: string
  detailPath?: string
  schedulingPath?: string
  staffType?: "nanny" | "infant-care" | "tech"
}

type ViewMode = "card" | "list" | "table"

// 加入黑名单弹窗
function AddToBlacklistDialog({ 
  staff, 
  staffType,
  trigger 
}: { 
  staff: StaffMember
  staffType: string
  trigger?: React.ReactNode 
}) {
  const [open, setOpen] = useState(false)
  const [actionType, setActionType] = useState<"blacklist" | "resign">("blacklist")
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const staffTypeLabel = staffType === "nanny" ? "月嫂" : staffType === "infant-care" ? "育婴师" : "产康技师"

  const blacklistReasons = [
    "服务态度恶劣",
    "违反公司规定",
    "客户严重投诉",
    "私自收费/飞单",
    "虚假信息",
    "严重失职",
    "职业道德问题",
    "其他原因",
  ]

  const resignReasons = [
    "个人原因离职",
    "家庭原因",
    "健康原因",
    "转行",
    "退休",
    "合同到期不续签",
    "其他原因",
  ]

  const handleSubmit = () => {
    // 模拟提交
    setStep(3)
    setTimeout(() => {
      setOpen(false)
      setStep(1)
      setReason("")
      setDescription("")
    }, 2000)
  }

  const resetDialog = () => {
    setStep(1)
    setReason("")
    setDescription("")
    setActionType("blacklist")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetDialog() }}>
      <DialogTrigger asChild>
        {trigger || (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpen(true) }} className="text-red-600">
            <Shield className="h-4 w-4 mr-2" />
            加入黑名单
          </DropdownMenuItem>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Shield className="h-4 w-4 text-red-500" />
            {step === 3 ? "操作完成" : actionType === "blacklist" ? "加入黑名单" : "办理离职"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {step === 3 ? "人员状态已更新" : `将${staffTypeLabel}从正常服务人员中移除`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="p-4 space-y-4">
            {/* 人员信息 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-red-100 text-red-700">{staff.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{staff.name}</span>
                  <Badge variant="outline" className="text-[10px]">{staffTypeLabel}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {staff.id} · {staff.age}岁 · {staff.experience || "暂无经验"} · {staff.orders}单
                </div>
              </div>
            </div>

            {/* 操作类型选择 */}
            <div className="space-y-2">
              <Label className="text-xs">选择操作类型</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType("blacklist")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    actionType === "blacklist" 
                      ? "border-red-500 bg-red-50" 
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Ban className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium">加入黑名单</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">因违规行为永久禁用</p>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("resign")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    actionType === "resign" 
                      ? "border-amber-500 bg-amber-50" 
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserMinus className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium">正常离职</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">正常离职可申请恢复</p>
                </button>
              </div>
            </div>

            {/* 提示信息 */}
            <div className={cn(
              "p-3 rounded-lg border flex items-start gap-2",
              actionType === "blacklist" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
            )}>
              <AlertTriangle className={cn("h-4 w-4 shrink-0 mt-0.5", actionType === "blacklist" ? "text-red-500" : "text-amber-500")} />
              <div className="text-xs">
                {actionType === "blacklist" ? (
                  <>
                    <p className="font-medium text-red-700">黑名单操作不可逆</p>
                    <p className="text-red-600 mt-0.5">该{staffTypeLabel}将被永久禁止接单，且所有进行中的订单需要重新分配。历史跟进记录将保留但标记为黑名单状态。</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-amber-700">离职后可申请恢复</p>
                    <p className="text-amber-600 mt-0.5">该{staffTypeLabel}离职后将无法接单，但保留所有历史数据。如需恢复，可在黑名单管理中申请。</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 space-y-4">
            {/* 原因选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">{actionType === "blacklist" ? "拉黑原因" : "离职原因"} *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择原因" />
                </SelectTrigger>
                <SelectContent>
                  {(actionType === "blacklist" ? blacklistReasons : resignReasons).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 详细说明 */}
            <div className="space-y-1.5">
              <Label className="text-xs">详细说明</Label>
              <Textarea 
                placeholder="请填写详细情况说明，便于后续追溯..."
                className="text-xs min-h-20 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 影响范围 */}
            <div className="space-y-2">
              <Label className="text-xs">操作影响</Label>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">进行中订单: <strong className="text-primary">2单</strong> 需重新分配</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">关联客户: <strong className="text-primary">15位</strong> 将通知母婴顾问跟进</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">历史记录: <strong className="text-green-600">保留</strong> 包含{staff.orders}单服务记录</span>
                </div>
              </div>
            </div>

            {/* 确认信息 */}
            <div className="p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>操作人员的跟进记录将永久保留，确保业务连续性</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 text-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
              actionType === "blacklist" ? "bg-red-100" : "bg-amber-100"
            )}>
              {actionType === "blacklist" ? (
                <Ban className="h-6 w-6 text-red-500" />
              ) : (
                <UserMinus className="h-6 w-6 text-amber-500" />
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {actionType === "blacklist" ? "已加入黑名单" : "离职办理完成"}
            </p>
            <p className="text-xs text-muted-foreground">
              {staff.name}已从正常服务人员中移除
            </p>
          </div>
        )}

        {step !== 3 && (
          <DialogFooter className="px-4 py-2.5 border-t">
            {step === 1 ? (
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={() => setStep(2)}>
                  下一步
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setStep(1)}>
                  上一步
                </Button>
                <Button 
                  size="sm" 
                  className={cn("h-7 text-xs", actionType === "blacklist" && "bg-red-500 hover:bg-red-600")}
                  onClick={handleSubmit}
                  disabled={!reason}
                >
                  {actionType === "blacklist" ? "确认拉黑" : "确认离职"}
                </Button>
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function StaffListView({
  title,
  subtitle,
  staffList,
  statusConfig,
  avatarColor = "bg-primary/10 text-primary",
  detailPath = "/operations/nanny",
  schedulingPath,
  staffType = "nanny",
}: StaffListViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [callStaff, setCallStaff] = useState<StaffForCall | null>(null)

  // 将staff转换为通话所需格式
  const getStaffForCall = (staff: StaffMember): StaffForCall => ({
    id: staff.id,
    name: staff.name,
    phone: (staff.phone || "138****0000").replace(/\*+/g, "1234"), // 模拟完整号码
    maskedPhone: staff.phone || "138****0000",
    role: staff.experience || "未定级",
    status: staff.status,
  })
  
  const filteredStaff = staffList.filter((staff) => {
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter
    const matchesSearch = staff.name.includes(searchQuery) || 
      staff.skills.some(s => s.includes(searchQuery))
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: staffList.length,
    available: staffList.filter(s => s.status === "available").length,
    working: staffList.filter(s => s.status === "working").length,
    vacation: staffList.filter(s => s.status === "vacation").length,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索姓名/技能..." 
              className="pl-8 w-48 h-8 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部 ({statusCounts.all})</SelectItem>
              <SelectItem value="available">待接单 ({statusCounts.available})</SelectItem>
              <SelectItem value="working">服务中 ({statusCounts.working})</SelectItem>
              <SelectItem value="vacation">休假中 ({statusCounts.vacation})</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === "card" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-none border-x"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "table" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent" asChild>
            <Link href="/operations/blacklist">
              <Shield className="h-3.5 w-3.5 mr-1" />
              黑名单
            </Link>
          </Button>
          <Button size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "card" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="hover:shadow-md transition-all hover:border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className={`${avatarColor} text-base font-medium`}>
                      {staff.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`${detailPath}/${staff.id}`} className="font-medium hover:text-primary text-sm">
                        {staff.name}
                      </Link>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-medium">{staff.rating}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${statusConfig[staff.status]?.color} text-[10px] mt-1`}>
                      {statusConfig[staff.status]?.label}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{staff.age}岁 {staff.experience && `· ${staff.experience}`}</span>
                  <span>{staff.orders}单 {staff.price && `· ${staff.price}`}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {staff.skills.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {staff.skills.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      +{staff.skills.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1.5 mt-3 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-7 text-xs bg-transparent"
                    onClick={() => setCallStaff(getStaffForCall(staff))}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    联系
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs bg-transparent" asChild>
                    <Link href={schedulingPath || `${detailPath}/scheduling`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      排班
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${detailPath}/${staff.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AddToBlacklistDialog staff={staff} staffType={staffType} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <Card>
          {/* 表头 */}
          <div className="grid grid-cols-[32px_72px_64px_48px_56px_48px_1fr_72px_120px] gap-2 items-center px-3 py-2 bg-muted/50 text-xs text-muted-foreground font-medium border-b">
            <div /> {/* 头像占位 */}
            <span>姓名</span>
            <span>状态</span>
            <span className="text-center">年龄</span>
            <span className="text-center">评分</span>
            <span className="text-center">订单</span>
            <span>技能标签</span>
            <span className="text-right">价格</span>
            <span className="text-center">操作</span>
          </div>
          <div className="divide-y">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="grid grid-cols-[32px_72px_64px_48px_56px_48px_1fr_72px_120px] gap-2 items-center px-3 py-2 hover:bg-muted/30 transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className={`${avatarColor} text-xs font-medium`}>
                    {staff.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <Link href={`${detailPath}/${staff.id}`} className="font-medium text-sm hover:text-primary truncate">
                  {staff.name}
                </Link>
                <div>
                  <Badge variant="outline" className={`${statusConfig[staff.status]?.color} text-[10px]`}>
                    {statusConfig[staff.status]?.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground text-center">{staff.age}岁</span>
                <div className="flex items-center justify-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs">{staff.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground text-center">{staff.orders}单</span>
                <div className="flex flex-wrap gap-1 overflow-hidden">
                  {staff.skills.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {skill}
                    </Badge>
                  ))}
                  {staff.skills.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{staff.skills.length - 3}</span>
                  )}
                </div>
                <span className="text-xs text-primary font-medium text-right">{staff.price || "-"}</span>
                <div className="flex items-center justify-center gap-0.5">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7"
                    onClick={() => setCallStaff(getStaffForCall(staff))}
                    title="拨打电话"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" asChild title="查看排班">
                    <Link href={schedulingPath || `${detailPath}/scheduling`}>
                      <Calendar className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" asChild title="查看详情">
                    <Link href={`${detailPath}/${staff.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="更多操作">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AddToBlacklistDialog staff={staff} staffType={staffType} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {viewMode === "table" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">姓名</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[60px]">年龄</TableHead>
                <TableHead className="w-[80px]">评分</TableHead>
                <TableHead className="w-[80px]">订单数</TableHead>
                <TableHead>技能标签</TableHead>
                <TableHead className="w-[80px]">价格</TableHead>
                <TableHead className="w-[120px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className={`${avatarColor} text-xs font-medium`}>
                          {staff.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <Link href={`${detailPath}/${staff.id}`} className="font-medium text-sm hover:text-primary">
                        {staff.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusConfig[staff.status]?.color} text-[10px]`}>
                      {statusConfig[staff.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{staff.age}岁</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-sm">{staff.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{staff.orders}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {staff.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {skill}
                        </Badge>
                      ))}
                      {staff.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{staff.skills.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-primary font-medium">{staff.price || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                        <Link href={`${detailPath}/${staff.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`${detailPath}/${staff.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCallStaff(getStaffForCall(staff))}>
                            <Phone className="h-4 w-4 mr-2" />
                            联系
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={schedulingPath || `${detailPath}/scheduling`}>
                              <Calendar className="h-4 w-4 mr-2" />
                              排班
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AddToBlacklistDialog staff={staff} staffType={staffType} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Empty state */}
      {filteredStaff.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无符合条件的人员</p>
        </div>
      )}

      {/* Stats footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <span>显示 {filteredStaff.length} / {staffList.length} 人</span>
        <div className="flex gap-4">
          <span>待接单: {statusCounts.available}</span>
          <span>服务中: {statusCounts.working}</span>
          <span>休假中: {statusCounts.vacation}</span>
        </div>
      </div>

      {/* 电话弹窗 */}
      {callStaff && (
        <StaffCallDialog
          staff={callStaff}
          open={!!callStaff}
          onOpenChange={(open) => !open && setCallStaff(null)}
          staffType={staffType}
        />
      )}
    </div>
  )
}
