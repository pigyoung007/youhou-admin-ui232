"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Eye, UserX, AlertTriangle, Calendar, Phone, MapPin, Star, FileText,
  Download, ArrowRightLeft, Clock, Shield, Heart, Baby, UserCog, History, RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BlacklistStaff {
  id: string
  name: string
  age: number
  gender: "female" | "male"
  phone: string
  hometown: string
  staffType: "nanny" | "infant_care" | "tech"
  originalId: string // 原始家政员ID
  status: "blacklist" | "resigned"
  reason: string
  reasonDetail?: string
  addedBy: string // 操作人
  addedDate: string
  totalOrders: number
  totalCustomers: number
  rating: number
  lastOrderDate?: string
  followupCount: number // 历史跟进记录数
  canRestore: boolean // 是否可恢复
}

const blacklistStaff: BlacklistStaff[] = [
  { id: "BL001", name: "钱小花", age: 38, gender: "female", phone: "138****1234", hometown: "宁夏固原", staffType: "nanny", originalId: "N009", status: "blacklist", reason: "客户投诉", reasonDetail: "多次迟到、服务态度差，客户多次投诉后未改善", addedBy: "周顾问", addedDate: "2025-01-15", totalOrders: 12, totalCustomers: 10, rating: 3.2, lastOrderDate: "2025-01-10", followupCount: 45, canRestore: false },
  { id: "BL002", name: "孙美玲", age: 42, gender: "female", phone: "139****5678", hometown: "宁夏银川", staffType: "nanny", originalId: "N010", status: "resigned", reason: "主动离职", reasonDetail: "因家庭原因回老家", addedBy: "陈主管", addedDate: "2025-01-08", totalOrders: 28, totalCustomers: 25, rating: 4.7, lastOrderDate: "2025-01-05", followupCount: 89, canRestore: true },
  { id: "BL003", name: "周桂兰", age: 45, gender: "female", phone: "137****9012", hometown: "宁夏吴忠", staffType: "infant_care", originalId: "I005", status: "blacklist", reason: "违规行为", reasonDetail: "私自收取客户红包，违反公司规定", addedBy: "孙顾问", addedDate: "2024-12-20", totalOrders: 8, totalCustomers: 7, rating: 4.1, lastOrderDate: "2024-12-15", followupCount: 32, canRestore: false },
  { id: "BL004", name: "吴小红", age: 36, gender: "female", phone: "136****3456", hometown: "宁夏中卫", staffType: "nanny", originalId: "N011", status: "resigned", reason: "合同到期", reasonDetail: "合同到期后不再续约", addedBy: "周顾问", addedDate: "2024-11-30", totalOrders: 35, totalCustomers: 32, rating: 4.8, lastOrderDate: "2024-11-28", followupCount: 112, canRestore: true },
  { id: "BL005", name: "郑玉华", age: 40, gender: "female", phone: "135****7890", hometown: "宁夏固原", staffType: "tech", originalId: "T003", status: "blacklist", reason: "服务质量", reasonDetail: "技术能力不达标，客户满意度持续偏低", addedBy: "陈主管", addedDate: "2024-10-15", totalOrders: 15, totalCustomers: 14, rating: 3.5, lastOrderDate: "2024-10-10", followupCount: 56, canRestore: false },
  { id: "BL006", name: "王秀珍", age: 48, gender: "female", phone: "138****2345", hometown: "宁夏银川", staffType: "nanny", originalId: "N012", status: "resigned", reason: "身体原因", reasonDetail: "因身体健康问题无法继续工作", addedBy: "周顾问", addedDate: "2024-09-20", totalOrders: 52, totalCustomers: 48, rating: 4.9, lastOrderDate: "2024-09-15", followupCount: 178, canRestore: false },
  { id: "BL007", name: "李春梅", age: 35, gender: "female", phone: "139****6789", hometown: "宁夏吴忠", staffType: "infant_care", originalId: "I006", status: "blacklist", reason: "客户投诉", reasonDetail: "与客户家庭成员发生冲突", addedBy: "孙顾问", addedDate: "2024-08-10", totalOrders: 6, totalCustomers: 5, rating: 3.8, lastOrderDate: "2024-08-05", followupCount: 28, canRestore: false },
  { id: "BL008", name: "张丽萍", age: 39, gender: "female", phone: "137****0123", hometown: "宁夏中卫", staffType: "nanny", originalId: "N013", status: "resigned", reason: "转行发展", reasonDetail: "转行从事其他工作", addedBy: "陈主管", addedDate: "2024-07-15", totalOrders: 22, totalCustomers: 20, rating: 4.5, lastOrderDate: "2024-07-10", followupCount: 67, canRestore: true },
]

const statusConfig = {
  blacklist: { label: "黑名单", color: "bg-red-100 text-red-700 border-red-200", icon: Shield },
  resigned: { label: "已离职", color: "bg-gray-100 text-gray-600 border-gray-200", icon: UserX },
}

const staffTypeConfig = {
  nanny: { label: "月嫂", color: "bg-rose-100 text-rose-700" },
  infant_care: { label: "育婴师", color: "bg-blue-100 text-blue-700" },
  tech: { label: "产康技师", color: "bg-purple-100 text-purple-700" },
}

const reasonConfig: Record<string, { label: string; color: string }> = {
  "客户投诉": { label: "客户投诉", color: "bg-red-100 text-red-700" },
  "违规行为": { label: "违规行为", color: "bg-red-100 text-red-700" },
  "服务质量": { label: "服务质量", color: "bg-amber-100 text-amber-700" },
  "主动离职": { label: "主动离职", color: "bg-gray-100 text-gray-600" },
  "合同到期": { label: "合同到期", color: "bg-gray-100 text-gray-600" },
  "身体原因": { label: "身体原因", color: "bg-gray-100 text-gray-600" },
  "转行发展": { label: "转行发展", color: "bg-gray-100 text-gray-600" },
}

// 详情弹窗
function BlacklistDetailDialog({ staff, trigger }: { staff: BlacklistStaff; trigger?: React.ReactNode }) {
  const StatusIcon = statusConfig[staff.status].icon

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4 text-red-500" />
              <span>{staff.status === "blacklist" ? "黑名单档案" : "离职档案"}</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[staff.status].color)}>
                {statusConfig[staff.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{staff.originalId}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-gray-100 text-gray-500 text-lg">{staff.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-semibold">{staff.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-[10px]", staffTypeConfig[staff.staffType].color)}>{staffTypeConfig[staff.staffType].label}</Badge>
                <span className="text-xs text-muted-foreground">{staff.age}岁</span>
                <span className="text-xs text-muted-foreground">{staff.hometown}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-2 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />联系电话</p>
            <p className="text-xs font-medium">{staff.phone}</p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">{staff.status === "blacklist" ? "加入黑名单原因" : "离职原因"}</h4>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn("text-[10px]", reasonConfig[staff.reason]?.color || "bg-gray-100 text-gray-600")}>{staff.reason}</Badge>
                <span className="text-[10px] text-muted-foreground">{staff.addedDate} 由 {staff.addedBy} 操作</span>
              </div>
              {staff.reasonDetail && (
                <p className="text-xs text-red-700">{staff.reasonDetail}</p>
              )}
            </div>
          </div>

          {/* Work Stats */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">历史服务数据</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">累计订单</p>
                <p className="text-sm font-bold">{staff.totalOrders}单</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">服务客户</p>
                <p className="text-sm font-bold">{staff.totalCustomers}位</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">综合评分</p>
                <p className="text-sm font-bold flex items-center gap-1">
                  <Star className={cn("h-3 w-3", staff.rating >= 4 ? "text-amber-500 fill-amber-500" : "text-gray-400")} />
                  {staff.rating}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">最后服务</p>
                <p className="text-sm font-bold">{staff.lastOrderDate || "-"}</p>
              </div>
            </div>
          </div>

          {/* Follow Records */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <History className="h-3 w-3" />历史跟进记录
            </h4>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-bold text-blue-700">{staff.followupCount}条跟进记录</p>
              <p className="text-[10px] text-blue-600 mt-1">所有历史跟进记录已保留，可在SCRM中查看完整记录</p>
            </div>
          </div>

          {/* Restore Info */}
          {staff.canRestore && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-start gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-emerald-700">可申请恢复</p>
                  <p className="text-[10px] text-emerald-600">该家政员为正常离职，如需重新合作可申请恢复至正常状态</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><FileText className="h-3 w-3 mr-1" />查看跟进记录</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />导出档案</Button>
          {staff.canRestore && (
            <Button size="sm" className="h-7 text-xs"><RotateCcw className="h-3 w-3 mr-1" />申请恢复</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 加入黑名单弹窗
function AddToBlacklistDialog({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="destructive" size="sm" className="h-7 text-xs"><Shield className="h-3 w-3 mr-1" />加入黑名单</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            加入黑名单
          </DialogTitle>
          <DialogDescription className="text-xs">将家政员加入黑名单后，将无法再为其分配订单和客户</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">选择家政员 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="搜索或选择家政员" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="N001">李春华 - 月嫂</SelectItem>
                <SelectItem value="N002">王秀兰 - 月嫂</SelectItem>
                <SelectItem value="I001">张美玲 - 育婴师</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">操作类型 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择操作类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="blacklist">加入黑名单</SelectItem>
                <SelectItem value="resigned">标记为离职</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">原因分类 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择原因" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="客户投诉">客户投诉</SelectItem>
                <SelectItem value="违规行为">违规行为</SelectItem>
                <SelectItem value="服务质量">服务质量问题</SelectItem>
                <SelectItem value="主动离职">主动离职</SelectItem>
                <SelectItem value="合同到期">合同到期</SelectItem>
                <SelectItem value="身体原因">身体原因</SelectItem>
                <SelectItem value="转行发展">转行发展</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">详细说明 *</Label>
            <Textarea placeholder="请详细描述原因..." className="text-xs min-h-20 resize-none" />
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-1">操作说明</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                  <li>该家政员将从正常名单中移除，不再分配订单</li>
                  <li>所有历史跟进记录、服务数据将保留</li>
                  <li>客户跟进记录中仍可查看该家政员的历史信息</li>
                  <li>黑名单人员需管理层审批后方可恢复</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs"><Shield className="h-3 w-3 mr-1" />确认操作</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function BlacklistPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredStaff = useMemo(() => {
    return blacklistStaff.filter(s => {
      if (activeTab === "blacklist" && s.status !== "blacklist") return false
      if (activeTab === "resigned" && s.status !== "resigned") return false
      if (typeFilter !== "all" && s.staffType !== typeFilter) return false
      if (searchTerm && !s.name.includes(searchTerm) && !s.originalId.includes(searchTerm)) return false
      return true
    })
  }, [activeTab, typeFilter, searchTerm])

  const stats = useMemo(() => ({
    total: blacklistStaff.length,
    blacklist: blacklistStaff.filter(s => s.status === "blacklist").length,
    resigned: blacklistStaff.filter(s => s.status === "resigned").length,
    totalFollowups: blacklistStaff.reduce((sum, s) => sum + s.followupCount, 0),
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">黑名单与离职管理</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><UserX className="h-3 w-3" />{stats.total}人</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-red-500" />{stats.blacklist}黑名单</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-gray-400" />{stats.resigned}已离职</span>
              <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-blue-500" />{stats.totalFollowups}条历史记录</span>
            </div>
          </div>
          <AddToBlacklistDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="blacklist" className="text-xs h-6">黑名单 ({stats.blacklist})</TabsTrigger>
              <TabsTrigger value="resigned" className="text-xs h-6">已离职 ({stats.resigned})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索..." className="pl-7 h-7 w-36 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="nanny">月嫂</SelectItem>
                  <SelectItem value="infant_care">育婴师</SelectItem>
                  <SelectItem value="tech">产康技师</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">家政员</TableHead>
                    <TableHead className="text-xs">类型</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">原因</TableHead>
                    <TableHead className="text-xs">历史订单</TableHead>
                    <TableHead className="text-xs">跟进记录</TableHead>
                    <TableHead className="text-xs">操作日期</TableHead>
                    <TableHead className="text-xs w-28">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-gray-100 text-gray-500 text-[10px]">{staff.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{staff.name}</p>
                            <p className="text-[10px] text-muted-foreground">{staff.age}岁 · {staff.hometown}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", staffTypeConfig[staff.staffType].color)}>{staffTypeConfig[staff.staffType].label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[staff.status].color)}>
                          {statusConfig[staff.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-[10px]", reasonConfig[staff.reason]?.color || "bg-gray-100")}>{staff.reason}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{staff.totalOrders}单</TableCell>
                      <TableCell>
                        <span className="text-xs text-blue-600">{staff.followupCount}条</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{staff.addedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BlacklistDetailDialog staff={staff} />
                          <Button variant="ghost" size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" />记录</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filteredStaff.length} / {stats.total} 条记录
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
