"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StudentDetailPanel } from "@/components/education/student-detail-panel"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, GraduationCap, Clock, Plus, Eye, MoreHorizontal, Phone, MapPin, User, Award, Briefcase, Calendar, FileText, Star, ChevronRight, Edit, Trash2, LayoutGrid, List, Users, CheckCircle, BookOpen, Award as IdCard, Home, Building, Filter, ChevronDown, Tag, X, Check, PhoneCall, PhoneOff, MessageSquare, Send, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

// 可服务时段
interface ServiceAvailability {
  id: string
  startDate: string
  endDate: string
  type: "contract" | "available" | "unavailable" | "rest"
  source: "合同约定" | "个人设置" | "顾问设置"
  note?: string
  contractId?: string
}

// 转化审核状态
type TransferStatus = "not_applied" | "pending" | "approved" | "rejected"

interface Student {
  id: string
  name: string
  age: number
  gender: "female" | "male"
  ethnicity: string
  phone: string
  phone2?: string
  phone3?: string
  wechat?: string
  idCard: string
  birthday: string
  hometown: string
  currentCity: string
  address: string
  education: string
  course: string
  className: string
  progress: number
  status: "training" | "graduated" | "dropped"
  startDate: string
  graduateDate?: string
  level: string
  expectedSalary: string
  experience: string
  skills: string[]
  certificates: { name: string; date: string; status: "valid" | "expiring"; certNo?: string }[]
  workHistory: { company: string; period: string; role: string }[]
  orders: { total: number; completed: number; rating: number }
  // Additional fields for career consultant
  expectedEmployDate?: string
  actualEmployDate?: string
  skillGraduateDate?: string
  employType: string
  hasCertificate: boolean
  // Tracking fields
  consultant: string
  consultantId: string
  source: string
  registerDate: string
  shareDate?: string
  familyIntro?: string
  customerProgress: string
  tags: { id: string; name: string; color: string }[]
  lastContactTime: string
  lastFollowupTime?: string
  lastFollowupRecord?: string
  contactCount: number
  visitCount: number
  totalCallDuration: number
  daysNoContact: number
  firstContactTime?: string
  firstFollowupPerson?: string
  lastContactPerson?: string
  transferReason?: string
  firstTransferTime?: string
  lastTransferTime?: string
  firstAssignTime?: string
  lastAssignTime?: string
  // 可服务时段
  serviceAvailability?: ServiceAvailability[]
  // 转化审核
  transferStatus?: TransferStatus
  transferApplyDate?: string
  transferReviewDate?: string
  transferReviewNote?: string
  examScore?: number
}

const students: Student[] = [
  { id: "S001", name: "李春华", age: 35, gender: "female", ethnicity: "汉族", phone: "138****1234", phone2: "139****0001", wechat: "lichunhua_wx", idCard: "640***********1234", birthday: "1989-05-15", hometown: "宁夏银川", currentCity: "银川市", address: "金凤区某小区", education: "高中", course: "高级月嫂", className: "2024年第3期", progress: 85, status: "training", startDate: "2025-08-01", level: "高级", expectedSalary: "12000-15000", experience: "3年", skills: ["月子餐", "早教", "催乳", "新生儿护理"], certificates: [{ name: "母婴护理师证", date: "2024-06", status: "valid", certNo: "MY-2024-001234" }], workHistory: [{ company: "某月子中心", period: "2022-2024", role: "月嫂" }], orders: { total: 28, completed: 26, rating: 4.9 }, expectedEmployDate: "2025-10-01", actualEmployDate: "", skillGraduateDate: "2025-09-15", employType: "月嫂", hasCertificate: true, consultant: "张顾问", consultantId: "E001", source: "线上咨询", registerDate: "2025-07-15", customerProgress: "培训中", tags: [{ id: "T1", name: "高潜力", color: "amber" }], lastContactTime: "2025-01-23", contactCount: 15, visitCount: 2, totalCallDuration: 45, daysNoContact: 2, transferStatus: "not_applied", serviceAvailability: [{ id: "SA001", startDate: "2025-10-01", endDate: "2025-12-31", type: "available", source: "个人设置", note: "可接单" }] },
  { id: "S002", name: "王秀兰", age: 42, gender: "female", ethnicity: "回族", phone: "139****5678", idCard: "640***********5678", birthday: "1982-08-20", hometown: "宁夏固原", currentCity: "银川市", address: "兴庆区某小区", education: "初中", course: "产康师初级", className: "2024年第2期", progress: 100, status: "graduated", startDate: "2025-06-15", graduateDate: "2025-07-15", level: "初级", expectedSalary: "8000-10000", experience: "5年", skills: ["产后修复", "盆底康复"], certificates: [{ name: "产康师证", date: "2025-07", status: "valid", certNo: "CK-2025-001235" }], workHistory: [{ company: "某家政公司", period: "2020-2025", role: "家政服务员" }], orders: { total: 45, completed: 43, rating: 4.8 }, expectedEmployDate: "2025-08-01", actualEmployDate: "2025-07-20", skillGraduateDate: "2025-07-15", employType: "产康师", hasCertificate: true, consultant: "李顾问", consultantId: "E002", source: "老学员介绍", registerDate: "2025-06-01", customerProgress: "已就业", tags: [{ id: "T2", name: "已就业", color: "green" }], lastContactTime: "2025-01-20", contactCount: 22, visitCount: 3, totalCallDuration: 68, daysNoContact: 5, transferStatus: "pending", transferApplyDate: "2025-07-20", examScore: 88, serviceAvailability: [{ id: "SA002", startDate: "2025-08-01", endDate: "2025-08-15", type: "contract", source: "合同约定", contractId: "CT001" }, { id: "SA003", startDate: "2025-08-20", endDate: "2025-12-31", type: "available", source: "个人设置" }] },
  { id: "S003", name: "张美玲", age: 38, gender: "female", ethnicity: "汉族", phone: "137****9012", wechat: "zhangmeiling", idCard: "640***********9012", birthday: "1986-03-10", hometown: "宁夏中卫", currentCity: "银川市", address: "西夏区某小区", education: "中专", course: "育婴师", className: "2024年第1期", progress: 60, status: "training", startDate: "2025-09-01", level: "中级", expectedSalary: "9000-11000", experience: "2年", skills: ["早教", "辅食制作", "睡眠训练"], certificates: [], workHistory: [], orders: { total: 32, completed: 30, rating: 4.7 }, expectedEmployDate: "2025-11-01", skillGraduateDate: "", employType: "育婴师", hasCertificate: false, consultant: "张顾问", consultantId: "E001", source: "线下活动", registerDate: "2025-08-20", customerProgress: "培训中", tags: [{ id: "T3", name: "待考证", color: "amber" }], lastContactTime: "2025-01-22", contactCount: 8, visitCount: 1, totalCallDuration: 25, daysNoContact: 3 },
  { id: "S004", name: "陈桂芳", age: 45, gender: "female", ethnicity: "汉族", phone: "136****3456", phone2: "138****9999", idCard: "640***********3456", birthday: "1979-11-25", hometown: "宁夏吴忠", currentCity: "银川市", address: "金凤区某小区", education: "高中", course: "高级月嫂", className: "2024年第2期", progress: 100, status: "graduated", startDate: "2025-05-01", graduateDate: "2025-06-15", level: "金牌", expectedSalary: "18000-22000", experience: "8年", skills: ["月子餐", "早教", "催乳", "双胞胎护理", "早产儿护理"], certificates: [{ name: "高级母婴护理师证", date: "2023-05", status: "valid" }, { name: "催乳师证", date: "2022-03", status: "valid" }], workHistory: [{ company: "某高端月子会所", period: "2018-2025", role: "金牌月嫂" }], orders: { total: 58, completed: 58, rating: 4.9 }, expectedEmployDate: "2025-07-01", actualEmployDate: "2025-06-20", skillGraduateDate: "2025-06-15", employType: "月嫂", hasCertificate: true, consultant: "王顾问", consultantId: "E003", source: "官网报名", registerDate: "2025-04-15", customerProgress: "已就业", tags: [{ id: "T2", name: "已就业", color: "green" }, { id: "T4", name: "金牌", color: "amber" }], lastContactTime: "2025-01-18", contactCount: 35, visitCount: 5, totalCallDuration: 120, daysNoContact: 7 },
  { id: "S005", name: "刘芳芳", age: 33, gender: "female", ethnicity: "汉族", phone: "135****7890", wechat: "liufangfang33", idCard: "640***********7890", birthday: "1991-07-08", hometown: "宁夏石嘴山", currentCity: "银川市", address: "兴庆区某小区", education: "大专", course: "产康师高级", className: "2024年第3期", progress: 30, status: "training", startDate: "2025-10-01", level: "初级", expectedSalary: "10000-12000", experience: "1年", skills: ["产后塑形", "中医调理"], certificates: [], workHistory: [], orders: { total: 8, completed: 8, rating: 4.5 }, expectedEmployDate: "2025-12-01", skillGraduateDate: "", employType: "产康师", hasCertificate: false, consultant: "张顾问", consultantId: "E001", source: "抖音推广", registerDate: "2025-09-20", customerProgress: "培训中", tags: [{ id: "T5", name: "新学员", color: "blue" }], lastContactTime: "2025-01-23", contactCount: 5, visitCount: 0, totalCallDuration: 15, daysNoContact: 2 },
  { id: "S006", name: "赵丽娜", age: 36, gender: "female", ethnicity: "汉族", phone: "138****2345", idCard: "640***********2345", birthday: "1988-12-03", hometown: "宁夏银川", currentCity: "银川市", address: "金凤区某小区", education: "高中", course: "高级月嫂", className: "2024年第3期", progress: 75, status: "training", startDate: "2025-08-15", level: "中级", expectedSalary: "11000-13000", experience: "2年", skills: ["月子餐", "新生儿护理"], certificates: [{ name: "母婴护理师证", date: "2024-03", status: "valid" }], workHistory: [{ company: "某月嫂公司", period: "2023-2025", role: "月嫂" }], orders: { total: 15, completed: 14, rating: 4.6 }, expectedEmployDate: "2025-10-15", skillGraduateDate: "2025-10-01", employType: "月嫂", hasCertificate: true, consultant: "李顾问", consultantId: "E002", source: "老学员介绍", registerDate: "2025-08-01", customerProgress: "培训中", tags: [{ id: "T1", name: "高潜力", color: "amber" }], lastContactTime: "2025-01-21", contactCount: 12, visitCount: 2, totalCallDuration: 38, daysNoContact: 4 },
]

const availableTags = [
  { id: "T1", name: "高潜力", color: "amber", group: "潜力" },
  { id: "T2", name: "已就业", color: "green", group: "状态" },
  { id: "T3", name: "待考证", color: "amber", group: "状态" },
  { id: "T4", name: "金牌", color: "amber", group: "等级" },
  { id: "T5", name: "新学员", color: "blue", group: "状态" },
  { id: "T6", name: "优秀学员", color: "green", group: "评价" },
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

const statusMap = {
  training: { label: "培训中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  graduated: { label: "已结业", color: "bg-green-100 text-green-700 border-green-200" },
  dropped: { label: "已退学", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Student Detail Dialog with all required fields
// 转化审核弹窗
function TransferReviewDialog({ student, open, onOpenChange }: { student: Student; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    healthCheck: false,
    certificateCheck: false,
    availabilityDate: "",
    courseCompleted: false,
    examScore: student.examScore || 0,
    note: "",
  })

  const transferStatusConfig = {
    not_applied: { label: "未申请", color: "bg-gray-100 text-gray-600" },
    pending: { label: "审核中", color: "bg-amber-100 text-amber-700" },
    approved: { label: "已通过", color: "bg-green-100 text-green-700" },
    rejected: { label: "已拒绝", color: "bg-red-100 text-red-700" },
  }

  const currentStatus = student.transferStatus || "not_applied"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Award className="h-4 w-4 text-primary" />
            学员转化审核 - {student.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 当前状态 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-xs text-muted-foreground">当前状态</p>
              <p className="font-medium text-sm">{student.course} / {student.className}</p>
            </div>
            <Badge variant="outline" className={cn("text-xs", transferStatusConfig[currentStatus].color)}>
              {transferStatusConfig[currentStatus].label}
            </Badge>
          </div>

          {/* 审核项目 */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">审核项目</h4>
            
            {/* 体检 */}
            <div className="flex items-center justify-between p-2.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="healthCheck" 
                  checked={formData.healthCheck}
                  onCheckedChange={(checked) => setFormData({...formData, healthCheck: !!checked})}
                />
                <label htmlFor="healthCheck" className="text-xs font-medium cursor-pointer">体检合格</label>
              </div>
              <Badge variant={formData.healthCheck ? "default" : "outline"} className="text-[10px]">
                {formData.healthCheck ? "已通过" : "未确认"}
              </Badge>
            </div>

            {/* 证书 */}
            <div className="flex items-center justify-between p-2.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="certificateCheck" 
                  checked={formData.certificateCheck}
                  onCheckedChange={(checked) => setFormData({...formData, certificateCheck: !!checked})}
                />
                <label htmlFor="certificateCheck" className="text-xs font-medium cursor-pointer">证书完整</label>
              </div>
              <div className="flex items-center gap-1">
                {student.certificates.length > 0 ? (
                  student.certificates.map((cert, i) => (
                    <Badge key={i} variant="outline" className="text-[9px]">{cert.name}</Badge>
                  ))
                ) : (
                  <span className="text-[10px] text-muted-foreground">暂无证书</span>
                )}
              </div>
            </div>

            {/* 考试成绩 */}
            <div className="flex items-center justify-between p-2.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">考试成绩</span>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  className="h-7 w-16 text-xs text-center" 
                  value={formData.examScore}
                  onChange={(e) => setFormData({...formData, examScore: parseInt(e.target.value) || 0})}
                  min={0}
                  max={100}
                />
                <span className="text-xs text-muted-foreground">分</span>
                <Badge variant={formData.examScore >= 60 ? "default" : "destructive"} className="text-[10px]">
                  {formData.examScore >= 60 ? "合格" : "不合格"}
                </Badge>
              </div>
            </div>

            {/* 档期/可上户时间 */}
            <div className="flex items-center justify-between p-2.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">可上户时间</span>
              </div>
              <Input 
                type="date" 
                className="h-7 w-32 text-xs" 
                value={formData.availabilityDate}
                onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})}
              />
            </div>

            {/* 课程完成 */}
            <div className="flex items-center justify-between p-2.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="courseCompleted" 
                  checked={formData.courseCompleted}
                  onCheckedChange={(checked) => setFormData({...formData, courseCompleted: !!checked})}
                />
                <label htmlFor="courseCompleted" className="text-xs font-medium cursor-pointer">课程已完成</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">进度</span>
                <Badge variant="outline" className="text-[10px]">{student.progress}%</Badge>
              </div>
            </div>
          </div>

          {/* 审核备注 */}
          <div className="space-y-1.5">
            <Label className="text-xs">审核备注</Label>
            <Textarea 
              placeholder="填写审核意见..." 
              className="text-xs resize-none" 
              rows={2}
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:text-destructive bg-transparent">
            拒绝转化
          </Button>
          <Button size="sm" className="h-7 text-xs">
            审核通过
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 服务时段管理弹窗
function ServiceAvailabilityDialog({ student, open, onOpenChange }: { student: Student; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPeriod, setNewPeriod] = useState({
    startDate: "",
    endDate: "",
    type: "available" as ServiceAvailability["type"],
    note: "",
  })

  const periods = student.serviceAvailability || []

  const typeConfig = {
    contract: { label: "合同服务", color: "bg-blue-100 text-blue-700" },
    available: { label: "可接单", color: "bg-green-100 text-green-700" },
    unavailable: { label: "不接单", color: "bg-red-100 text-red-700" },
    rest: { label: "休息", color: "bg-amber-100 text-amber-700" },
  }

  const today = new Date().toISOString().split("T")[0]
  const currentPeriod = periods.find(p => p.startDate <= today && p.endDate >= today)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Calendar className="h-4 w-4 text-primary" />
            可服务时段 - {student.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 当前状态 */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">当前状态</span>
              {currentPeriod ? (
                <Badge variant="outline" className={cn("text-xs", typeConfig[currentPeriod.type].color)}>
                  {typeConfig[currentPeriod.type].label}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">未设置</Badge>
              )}
            </div>
            {currentPeriod && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentPeriod.startDate} ~ {currentPeriod.endDate}
              </p>
            )}
          </div>

          {/* 添加时段表单 */}
          {showAddForm && (
            <div className="p-3 border rounded-lg space-y-3 bg-muted/20">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">开始日期</Label>
                  <Input 
                    type="date" 
                    className="h-7 text-xs" 
                    value={newPeriod.startDate}
                    onChange={(e) => setNewPeriod({...newPeriod, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">结束日期</Label>
                  <Input 
                    type="date" 
                    className="h-7 text-xs" 
                    value={newPeriod.endDate}
                    onChange={(e) => setNewPeriod({...newPeriod, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">类型</Label>
                <Select value={newPeriod.type} onValueChange={(v) => setNewPeriod({...newPeriod, type: v as ServiceAvailability["type"]})}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">可接单</SelectItem>
                    <SelectItem value="unavailable">不接单</SelectItem>
                    <SelectItem value="rest">休息</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">备注</Label>
                <Input 
                  placeholder="可选填写备注..." 
                  className="h-7 text-xs" 
                  value={newPeriod.note}
                  onChange={(e) => setNewPeriod({...newPeriod, note: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent" onClick={() => setShowAddForm(false)}>
                  取消
                </Button>
                <Button size="sm" className="h-6 text-[10px]">
                  添加
                </Button>
              </div>
            </div>
          )}

          {/* 时段列表 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium">时段列表</h4>
              {!showAddForm && (
                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-3 w-3 mr-1" />添加时段
                </Button>
              )}
            </div>
            {periods.length > 0 ? (
              <div className="space-y-2">
                {periods.map((period) => {
                  const isPast = new Date(period.endDate) < new Date(today)
                  const isCurrent = period.startDate <= today && period.endDate >= today
                  return (
                    <div 
                      key={period.id} 
                      className={cn(
                        "flex items-center justify-between p-2.5 border rounded-lg",
                        isPast && "opacity-50",
                        isCurrent && "ring-2 ring-primary/20"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[9px]", typeConfig[period.type].color)}>
                            {typeConfig[period.type].label}
                          </Badge>
                          {isCurrent && <Badge className="text-[8px] h-4">当前</Badge>}
                          {period.source === "合同约定" && (
                            <Badge variant="outline" className="text-[8px]">合同</Badge>
                          )}
                        </div>
                        <p className="text-xs mt-1">{period.startDate} ~ {period.endDate}</p>
                        {period.note && <p className="text-[10px] text-muted-foreground">{period.note}</p>}
                      </div>
                      {period.source !== "合同约定" && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-xs">
                暂无服务时段记录
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StudentDetailDialog({ student, trigger }: { student: Student; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>学员档案</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusMap[student.status].color)}>
                {statusMap[student.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{student.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Basic Info Header */}
          <div className="p-4 bg-muted/30 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">{student.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{student.level}</Badge>
                  {student.tags.map(tag => (
                    <Badge key={tag.id} variant="outline" className={cn("text-[10px]", tagColorMap[tag.color])}>{tag.name}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{student.age}岁/{student.gender === "female" ? "女" : "男"}/{student.ethnicity}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{student.phone}</span>
                  <span className="flex items-center gap-1"><Home className="h-3 w-3" />{student.hometown}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{student.education}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-9 px-4">
              <TabsTrigger value="profile" className="text-xs h-7">基本信息</TabsTrigger>
              <TabsTrigger value="employ" className="text-xs h-7">就业信息</TabsTrigger>
              <TabsTrigger value="study" className="text-xs h-7">学习情况</TabsTrigger>
              <TabsTrigger value="track" className="text-xs h-7">跟进信息</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs h-7">统计数据</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-4 space-y-3 mt-0">
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">客户全名</p><p className="text-xs font-medium">{student.name}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">手机</p><p className="text-xs font-medium">{student.phone}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">手机2</p><p className="text-xs">{student.phone2 || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">手机3</p><p className="text-xs">{student.phone3 || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">性别</p><p className="text-xs">{student.gender === "female" ? "女" : "男"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">年龄</p><p className="text-xs">{student.age}岁</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">民族</p><p className="text-xs">{student.ethnicity}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">生日</p><p className="text-xs">{student.birthday}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">微信</p><p className="text-xs">{student.wechat || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">学历</p><p className="text-xs">{student.education}</p></div>
                <div className="p-2 rounded bg-muted/30 col-span-2"><p className="text-[9px] text-muted-foreground">地址</p><p className="text-xs">{student.currentCity} {student.address}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">来源</p><p className="text-xs">{student.source}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">所属顾问</p><p className="text-xs">{student.consultant}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">登记时间</p><p className="text-xs">{student.registerDate}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">客户进展</p><p className="text-xs">{student.customerProgress}</p></div>
              </div>
              <div className="p-2 rounded bg-muted/30">
                <p className="text-[9px] text-muted-foreground mb-1">家庭介绍</p>
                <p className="text-xs">{student.familyIntro || "暂无"}</p>
              </div>
            </TabsContent>

            <TabsContent value="employ" className="p-4 space-y-3 mt-0">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">就业类型</p><p className="text-xs font-medium">{student.employType}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">预计就业时间</p><p className="text-xs">{student.expectedEmployDate || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">实际就业时间</p><p className="text-xs">{student.actualEmployDate || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">技能岗毕业时间</p><p className="text-xs">{student.skillGraduateDate || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">有无证书</p><p className="text-xs">{student.hasCertificate ? "有" : "无"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">期望薪资</p><p className="text-xs text-primary">{student.expectedSalary}元/月</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">从业经验</p><p className="text-xs">{student.experience}</p></div>
              </div>
              <div className="p-2 rounded bg-muted/30">
                <p className="text-[9px] text-muted-foreground mb-2">技能标签</p>
                <div className="flex flex-wrap gap-1">
                  {student.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-muted-foreground">证书资质</p>
                {student.certificates.length > 0 ? student.certificates.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs font-medium">{cert.name}</p>
                        <p className="text-[10px] text-muted-foreground">获取: {cert.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cert.status === "valid" ? "bg-green-50 text-green-700 text-[10px]" : "bg-amber-50 text-amber-700 text-[10px]"}>
                      {cert.status === "valid" ? "有效" : "即将过期"}
                    </Badge>
                  </div>
                )) : <p className="text-xs text-muted-foreground">暂无证书</p>}
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-muted-foreground">工作经历</p>
                {student.workHistory.length > 0 ? student.workHistory.map((work, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded border">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs font-medium">{work.company}</p>
                      <p className="text-[10px] text-muted-foreground">{work.role} | {work.period}</p>
                    </div>
                  </div>
                )) : <p className="text-xs text-muted-foreground">暂无工作经历</p>}
              </div>
            </TabsContent>

            <TabsContent value="study" className="p-4 space-y-3 mt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">培训课程</p><p className="text-xs font-medium">{student.course}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">所在班级</p><p className="text-xs font-medium">{student.className}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">入学日期</p><p className="text-xs">{student.startDate}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">结业日期</p><p className="text-xs">{student.graduateDate || "在读中"}</p></div>
              </div>
              <div className="p-3 rounded bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground">学习进度</p>
                  <p className="text-xs font-medium">{student.progress}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-2 text-center"><p className="text-lg font-bold text-primary">{student.orders.total}</p><p className="text-[10px] text-muted-foreground">总接单</p></Card>
                <Card className="p-2 text-center"><p className="text-lg font-bold text-green-600">{student.orders.completed}</p><p className="text-[10px] text-muted-foreground">已完成</p></Card>
                <Card className="p-2 text-center"><p className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1"><Star className="h-4 w-4 fill-amber-500" />{student.orders.rating || "-"}</p><p className="text-[10px] text-muted-foreground">评分</p></Card>
              </div>
            </TabsContent>

            <TabsContent value="track" className="p-4 space-y-3 mt-0">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">客户跟进人</p><p className="text-xs">{student.consultant}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">最后联系时间</p><p className="text-xs">{student.lastContactTime}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">最后跟进时间</p><p className="text-xs">{student.lastFollowupTime || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">首次联系时间</p><p className="text-xs">{student.firstContactTime || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">首个跟进人</p><p className="text-xs">{student.firstFollowupPerson || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">最后联系人</p><p className="text-xs">{student.lastContactPerson || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">首次分配时间</p><p className="text-xs">{student.firstAssignTime || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">最后分配时间</p><p className="text-xs">{student.lastAssignTime || "-"}</p></div>
                <div className="p-2 rounded bg-muted/30"><p className="text-[9px] text-muted-foreground">流转原因</p><p className="text-xs">{student.transferReason || "-"}</p></div>
              </div>
              <div className="p-2 rounded bg-muted/30">
                <p className="text-[9px] text-muted-foreground mb-1">最后跟进记录</p>
                <p className="text-xs">{student.lastFollowupRecord || "暂无"}</p>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="p-4 mt-0">
              <div className="grid grid-cols-4 gap-2">
                <Card className="p-2 text-center"><p className="text-lg font-bold">{student.contactCount}</p><p className="text-[10px] text-muted-foreground">电话联系次数</p></Card>
                <Card className="p-2 text-center"><p className="text-lg font-bold">{student.visitCount}</p><p className="text-[10px] text-muted-foreground">拜访次数</p></Card>
                <Card className="p-2 text-center"><p className="text-lg font-bold">{student.totalCallDuration}分钟</p><p className="text-[10px] text-muted-foreground">总通话时长</p></Card>
                <Card className="p-2 text-center"><p className="text-lg font-bold text-amber-600">{student.daysNoContact}天</p><p className="text-[10px] text-muted-foreground">未联系天数</p></Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Phone className="h-3 w-3 mr-1" />联系学员</Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Edit className="h-3 w-3 mr-1" />编辑</Button>
              <Button size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" />导出简历</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add Student Dialog
function AddStudentDialog({ trigger }: { trigger: React.ReactNode }) {
  const [step, setStep] = useState(1)
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Plus className="h-4 w-4 text-primary" />新增学员
            <Badge variant="outline" className="text-[10px]">步骤 {step}/3</Badge>
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">基本信息</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-[10px]">客户全名 *</Label><Input className="h-8 text-xs" placeholder="请输入姓名" /></div>
              <div className="space-y-1"><Label className="text-[10px]">手机 *</Label><Input className="h-8 text-xs" placeholder="请输入手机号" /></div>
              <div className="space-y-1"><Label className="text-[10px]">性别 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择性别" /></SelectTrigger>
                  <SelectContent><SelectItem value="female">女</SelectItem><SelectItem value="male">男</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">手机2</Label><Input className="h-8 text-xs" placeholder="备用手机" /></div>
              <div className="space-y-1"><Label className="text-[10px]">手机3</Label><Input className="h-8 text-xs" placeholder="备用手机" /></div>
              <div className="space-y-1"><Label className="text-[10px]">微信</Label><Input className="h-8 text-xs" placeholder="微信号" /></div>
              <div className="space-y-1"><Label className="text-[10px]">年龄 *</Label><Input className="h-8 text-xs" type="number" placeholder="年龄" /></div>
              <div className="space-y-1"><Label className="text-[10px]">民族 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择民族" /></SelectTrigger>
                  <SelectContent><SelectItem value="汉族">汉族</SelectItem><SelectItem value="回族">回族</SelectItem><SelectItem value="其他">其他</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">生日</Label><Input className="h-8 text-xs" type="date" /></div>
              <div className="space-y-1"><Label className="text-[10px]">学历 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择学历" /></SelectTrigger>
                  <SelectContent><SelectItem value="初中">初中</SelectItem><SelectItem value="高中">高中</SelectItem><SelectItem value="中专">中专</SelectItem><SelectItem value="大专">大专</SelectItem><SelectItem value="本科">本科</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2"><Label className="text-[10px]">地址</Label><Input className="h-8 text-xs" placeholder="详细地址" /></div>
              <div className="space-y-1"><Label className="text-[10px]">来源 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择来源" /></SelectTrigger>
                  <SelectContent><SelectItem value="线上咨询">线上咨询</SelectItem><SelectItem value="线下活动">线下活动</SelectItem><SelectItem value="老学员介绍">老学员介绍</SelectItem><SelectItem value="抖音推广">抖音推广</SelectItem><SelectItem value="官网报名">官网报名</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">所属顾问 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择顾问" /></SelectTrigger>
                  <SelectContent><SelectItem value="E001">张顾问</SelectItem><SelectItem value="E002">李顾问</SelectItem><SelectItem value="E003">王顾问</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">备注</Label><Textarea className="text-xs min-h-16" placeholder="备注信息" /></div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">就业信息（职业顾问专用）</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-[10px]">就业类型 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择类型" /></SelectTrigger>
                  <SelectContent><SelectItem value="月嫂">月嫂</SelectItem><SelectItem value="育婴师">育婴师</SelectItem><SelectItem value="保姆">保姆</SelectItem><SelectItem value="护工">护工</SelectItem><SelectItem value="收纳师">收纳师</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">预计就业时间</Label><Input className="h-8 text-xs" type="date" /></div>
              <div className="space-y-1"><Label className="text-[10px]">实际就业时间</Label><Input className="h-8 text-xs" type="date" /></div>
              <div className="space-y-1"><Label className="text-[10px]">技能岗毕业时间</Label><Input className="h-8 text-xs" type="date" /></div>
              <div className="space-y-1"><Label className="text-[10px]">有无证书</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">有</SelectItem><SelectItem value="no">无</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">期望薪资</Label><Input className="h-8 text-xs" placeholder="如: 10000-12000" /></div>
              <div className="space-y-1"><Label className="text-[10px]">从业经验</Label><Input className="h-8 text-xs" placeholder="如: 3年" /></div>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">工作经历</Label><Textarea className="text-xs min-h-16" placeholder="请描述工作经历..." /></div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">培训信息</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-[10px]">培训课程 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择课程" /></SelectTrigger>
                  <SelectContent><SelectItem value="高级月嫂">高级月嫂</SelectItem><SelectItem value="育婴师">育婴师</SelectItem><SelectItem value="产康师初级">产康师初级</SelectItem><SelectItem value="产康师高级">产康师高级</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">所在班级 *</Label>
                <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择班级" /></SelectTrigger>
                  <SelectContent><SelectItem value="2024年第3期">2024年第3期</SelectItem><SelectItem value="2024年第2期">2024年第2期</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px]">入学日期</Label><Input className="h-8 text-xs" type="date" /></div>
              <div className="space-y-1"><Label className="text-[10px]">家庭介绍</Label><Textarea className="text-xs min-h-16" placeholder="家庭情况介绍..." /></div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {step > 1 && <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => setStep(step - 1)}>上一步</Button>}
          {step < 3 ? (
            <Button size="sm" className="h-8 text-xs" onClick={() => setStep(step + 1)}>下一步</Button>
          ) : (
            <Button size="sm" className="h-8 text-xs"><Check className="h-3 w-3 mr-1" />提交</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Tag Dialog
function TagDialog({ student, trigger }: { student: Student; trigger: React.ReactNode }) {
  const [studentTags, setStudentTags] = useState(student.tags)
  
  const toggleTag = (tag: typeof availableTags[0]) => {
    const exists = studentTags.some(t => t.id === tag.id)
    if (exists) {
      setStudentTags(studentTags.filter(t => t.id !== tag.id))
    } else {
      setStudentTags([...studentTags, { id: tag.id, name: tag.name, color: tag.color }])
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
              {studentTags.length > 0 ? studentTags.map(tag => (
                <Badge key={tag.id} variant="outline" className={cn("text-[10px] gap-1", tagColorMap[tag.color])}>
                  {tag.name}
                  <button type="button" onClick={() => toggleTag(tag as typeof availableTags[0])} className="hover:bg-black/10 rounded-full"><X className="h-2.5 w-2.5" /></button>
                </Badge>
              )) : <span className="text-xs text-muted-foreground">暂无标签</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">可用标签</Label>
            {["潜力", "状态", "等级", "评价"].map(group => {
              const groupTags = availableTags.filter(t => t.group === group)
              if (groupTags.length === 0) return null
              return (
                <div key={group}>
                  <p className="text-[10px] text-muted-foreground mb-1">{group}</p>
                  <div className="flex flex-wrap gap-1">
                    {groupTags.map(tag => {
                      const isSelected = studentTags.some(t => t.id === tag.id)
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

export default function StudentsPage() {
  const [viewMode, setViewMode] = useState<"card" | "table">("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  
  // Advanced filters for career consultant
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ethnicityFilter, setEthnicityFilter] = useState("all")
  const [lastContactDays, setLastContactDays] = useState("all")
  const [employTypeFilter, setEmployTypeFilter] = useState("all")
  const [hasCertFilter, setHasCertFilter] = useState("all")
  const [transferStudent, setTransferStudent] = useState<Student | null>(null)
  const [availabilityStudent, setAvailabilityStudent] = useState<Student | null>(null)
  const [educationFilter, setEducationFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailPanel(true)
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (courseFilter !== "all" && !s.course.includes(courseFilter)) return false
      if (searchTerm && !s.name.includes(searchTerm) && !s.phone.includes(searchTerm)) return false
      if (selectedTags.length > 0 && !selectedTags.some(tagId => s.tags.some(t => t.id === tagId))) return false
      if (ageMin && s.age < parseInt(ageMin)) return false
      if (ageMax && s.age > parseInt(ageMax)) return false
      if (genderFilter !== "all" && s.gender !== genderFilter) return false
      if (ethnicityFilter !== "all" && s.ethnicity !== ethnicityFilter) return false
      if (employTypeFilter !== "all" && s.employType !== employTypeFilter) return false
      if (hasCertFilter !== "all" && (hasCertFilter === "yes" ? !s.hasCertificate : s.hasCertificate)) return false
      if (educationFilter !== "all" && s.education !== educationFilter) return false
      return true
    })
  }, [statusFilter, courseFilter, searchTerm, selectedTags, ageMin, ageMax, genderFilter, ethnicityFilter, employTypeFilter, hasCertFilter, educationFilter])

  const stats = useMemo(() => ({
    total: students.length,
    training: students.filter(s => s.status === "training").length,
    graduated: students.filter(s => s.status === "graduated").length,
  }), [])

  const resetFilters = () => {
    setAgeMin(""); setAgeMax(""); setGenderFilter("all"); setEthnicityFilter("all")
    setLastContactDays("all"); setEmployTypeFilter("all"); setHasCertFilter("all"); setEducationFilter("all")
  }

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">学员管理</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stats.total}人</span>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-blue-500" />{stats.training}培训中</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />{stats.graduated}已结业</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-lg p-0.5">
              <Button variant={viewMode === "card" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("card")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("table")}>
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
            <AddStudentDialog trigger={<Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />添加学员</Button>} />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索学员..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="training">培训中</SelectItem>
                <SelectItem value="graduated">已结业</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部课程</SelectItem>
                <SelectItem value="月嫂">月嫂</SelectItem>
                <SelectItem value="育婴">育婴师</SelectItem>
                <SelectItem value="产康">产康师</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Tag filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Tag className="h-3 w-3 mr-1" />标签
                  {selectedTags.length > 0 && <Badge variant="secondary" className="ml-1 h-4 text-[9px]">{selectedTags.length}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">按标签筛选</span>
                    {selectedTags.length > 0 && <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => setSelectedTags([])}>清空</Button>}
                  </div>
                  {["潜力", "状态", "等级"].map(group => {
                    const groupTags = availableTags.filter(t => t.group === group)
                    if (groupTags.length === 0) return null
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

            {/* Advanced filter toggle */}
            <Collapsible open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Filter className="h-3 w-3 mr-1" />高级筛选
                  <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvancedFilter && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* Advanced Filters Panel - Career Consultant specific */}
          <Collapsible open={showAdvancedFilter}>
            <CollapsibleContent>
              <Card className="p-4 mt-2">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="w-36">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">年龄区间</Label>
                    <div className="flex items-center gap-1.5">
                      <Input className="h-8 text-xs w-14" placeholder="最小" value={ageMin} onChange={e => setAgeMin(e.target.value)} />
                      <span className="text-xs text-muted-foreground">-</span>
                      <Input className="h-8 text-xs w-14" placeholder="最大" value={ageMax} onChange={e => setAgeMax(e.target.value)} />
                    </div>
                  </div>
                  <div className="w-20">
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
                  <div className="w-20">
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
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">就业类型</Label>
                    <Select value={employTypeFilter} onValueChange={setEmployTypeFilter}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="月嫂">月嫂</SelectItem>
                        <SelectItem value="育婴师">育婴师</SelectItem>
                        <SelectItem value="保姆">保姆</SelectItem>
                        <SelectItem value="护工">护工</SelectItem>
                        <SelectItem value="收纳师">收纳师</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">有无证书</Label>
                    <Select value={hasCertFilter} onValueChange={setHasCertFilter}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="yes">有</SelectItem>
                        <SelectItem value="no">无</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">学历</Label>
                    <Select value={educationFilter} onValueChange={setEducationFilter}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="初中">初中</SelectItem>
                        <SelectItem value="高中">高中</SelectItem>
                        <SelectItem value="中专">中专</SelectItem>
                        <SelectItem value="大专">大专</SelectItem>
                        <SelectItem value="本科">本科</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={resetFilters}>重置筛选</Button>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

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
                    <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-black/10 rounded-full"><X className="h-2.5 w-2.5" /></button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Card View */}
        {viewMode === "card" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-3 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">{student.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">{student.name}</span>
                      <Badge variant="outline" className={cn("text-[10px] h-4 px-1", statusMap[student.status].color)}>
                        {statusMap[student.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                      <span>{student.age}岁</span>
                      <span>{student.course}</span>
                      <span>{student.className}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8">{student.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StudentDetailDialog student={student} />
                    <TagDialog student={student} trigger={<Button variant="ghost" size="icon" className="h-7 w-7"><Tag className="h-3.5 w-3.5" /></Button>} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem className="text-xs"><Phone className="h-3 w-3 mr-2" />联系</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs" onClick={() => setTransferStudent(student)}>
                          <Award className="h-3 w-3 mr-2" />发起转化
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onClick={() => setAvailabilityStudent(student)}>
                          <Calendar className="h-3 w-3 mr-2" />服务时段
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">学员</TableHead>
                  <TableHead className="text-xs">课程/班级</TableHead>
                  <TableHead className="text-xs">状态</TableHead>
                  <TableHead className="text-xs">标签</TableHead>
                  <TableHead className="text-xs">就业类型</TableHead>
                  <TableHead className="text-xs">进度</TableHead>
                  <TableHead className="text-xs">所属顾问</TableHead>
                  <TableHead className="text-xs w-28">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">{student.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">{student.name}</p>
                          <p className="text-[10px] text-muted-foreground">{student.age}岁/{student.ethnicity}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{student.course}</p>
                      <p className="text-[10px] text-muted-foreground">{student.className}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] h-5", statusMap[student.status].color)}>
                        {statusMap[student.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-0.5 max-w-24">
                        {student.tags.slice(0, 2).map(tag => (
                          <Badge key={tag.id} variant="outline" className={cn("text-[9px] h-4 px-1", tagColorMap[tag.color])}>{tag.name}</Badge>
                        ))}
                        {student.tags.length > 2 && <Badge variant="secondary" className="text-[9px] h-4 px-1">+{student.tags.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{student.employType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 w-20">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-[10px] w-7">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{student.consultant}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="查看详情" onClick={() => handleViewDetail(student)}><Eye className="h-3 w-3" /></Button>
                        <TagDialog student={student} trigger={<Button variant="ghost" size="icon" className="h-6 w-6" title="打标签"><Tag className="h-3 w-3" /></Button>} />
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="联系"><Phone className="h-3 w-3" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs"><FileText className="h-3 w-3 mr-2" />跟进记录</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs" onClick={() => setTransferStudent(student)}>
                              <Award className="h-3 w-3 mr-2" />发起转化
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs" onClick={() => setAvailabilityStudent(student)}>
                              <Calendar className="h-3 w-3 mr-2" />服务时段
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
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

        {/* Pagination hint */}
        <div className="text-xs text-muted-foreground text-center">
          显示 {filteredStudents.length} / {students.length} 条记录
        </div>

        {/* Dialogs */}
        {transferStudent && (
          <TransferReviewDialog 
            student={transferStudent} 
            open={!!transferStudent} 
            onOpenChange={(open) => !open && setTransferStudent(null)} 
          />
        )}
        {availabilityStudent && (
          <ServiceAvailabilityDialog 
            student={availabilityStudent} 
            open={!!availabilityStudent} 
            onOpenChange={(open) => !open && setAvailabilityStudent(null)} 
          />
        )}

        {/* 学员详情侧边面板 */}
        {selectedStudent && (
          <StudentDetailPanel
            student={selectedStudent}
            open={showDetailPanel}
            onOpenChange={setShowDetailPanel}
          />
        )}
      </div>
    </AdminLayout>
  )
}
