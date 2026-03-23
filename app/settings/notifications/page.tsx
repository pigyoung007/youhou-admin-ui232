"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, Mail, MessageSquare, Smartphone, Save, Plus, Search, Settings, Edit, Trash2, MoreHorizontal,
  Clock, Users, ShoppingCart, FileText, AlertTriangle, CheckCircle2, XCircle, Copy, Eye, Zap, Briefcase, Baby, GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationRule {
  id: string
  name: string
  description: string
  category: "order" | "customer" | "training" | "operation" | "system" | "training"
  role?: "职业顾问" | "母婴顾问" | "通用"
  event: string
  enabled: boolean
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    wechat: boolean
  }
  frequency: "realtime" | "hourly" | "daily" | "weekly" | "2hours" | "3days" | "7days" | "30days" | "custom"
  frequencyDesc?: string
  recipients: string[]
  conditions?: string
  template?: string
  createdAt: string
  updatedAt: string
}

// 职业顾问提醒
const careerConsultantRules: NotificationRule[] = [
  { id: "CC001", name: "新数据未完成呼出提醒", description: "新分配数据未联系时，每隔两小时提醒联系，联系后则不做提醒", category: "customer", role: "职业顾问", event: "lead.uncalled", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "2hours", frequencyDesc: "每隔2小时", recipients: ["职业顾问"], conditions: "新分配数据未联系", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "CC002", name: "订单支付提醒", description: "分期回款订单提醒需与家政员签订服务合同相关联，服务结束后结算工资前一天提醒", category: "order", role: "职业顾问", event: "order.payment_due", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "服务结束前1天", recipients: ["职业顾问", "财务部"], conditions: "分期回款订单", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "CC003", name: "公海客户重新导入提醒", description: "公海客户重新导入后通知顾问及时跟进", category: "customer", role: "职业顾问", event: "sea.reimported", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["职业顾问"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "CC004", name: "家政员体检报告到期提醒", description: "家政员体检报告即将到期时提前一个月提醒", category: "operation", role: "职业顾问", event: "health_report.expiring", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "30days", frequencyDesc: "提前30天", recipients: ["职业顾问", "家政员"], conditions: "体检报告到期前30天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "CC005", name: "家政员生日提醒", description: "家政员生日当天发送提醒，方便送上祝福", category: "customer", role: "职业顾问", event: "staff.birthday", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "当天提醒1次", recipients: ["职业顾问"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "CC006", name: "课程尾款结清后办理证书提醒", description: "学员课程尾款结清后提醒办理相关证书", category: "order", role: "职业顾问", event: "course.balance_paid", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["职业顾问", "培训部"], conditions: "课程尾款结清", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
]

// 母婴顾问提醒
const maternityConsultantRules: NotificationRule[] = [
  { id: "MC001", name: "新数据未完成呼出提醒", description: "新分配数据未联系时，每隔两小时提醒联系，联系后则不做提醒", category: "customer", role: "母婴顾问", event: "lead.uncalled", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "2hours", frequencyDesc: "每隔2小时", recipients: ["母婴顾问"], conditions: "新分配数据未联系", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC002", name: "合同签订提醒", description: "合同未签定的客户每周进行提醒", category: "order", role: "母婴顾问", event: "contract.unsigned", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "weekly", frequencyDesc: "每周提醒", recipients: ["母婴顾问"], conditions: "合同未签定", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC003", name: "订单支付提醒", description: "每笔订单支付前提醒顾问跟进催款", category: "order", role: "母婴顾问", event: "order.payment_due", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "支付前提醒", recipients: ["母婴顾问", "财务部"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC004", name: "家政员保险购买提醒", description: "提醒为家政员购买相关保险", category: "operation", role: "母婴顾问", event: "insurance.purchase", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["母婴顾问"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC005", name: "家政员保险到期提醒", description: "家政员保险即将到期时提前提醒续保", category: "operation", role: "母婴顾问", event: "insurance.expiring", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "30days", frequencyDesc: "提前30天", recipients: ["母婴顾问", "家政员"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC006", name: "雇主生日提醒", description: "雇主生日当天发送提醒，系统可自动发送祝福语", category: "customer", role: "母婴顾问", event: "employer.birthday", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "当天提醒1次", recipients: ["母婴顾问"], template: "生日祝福模板", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC007", name: "雇主宝宝生日提醒", description: "雇主宝宝生日当天发送提醒，系统可自动发送祝福语", category: "customer", role: "母婴顾问", event: "baby.birthday", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "当天提醒1次", recipients: ["母婴顾问"], template: "宝宝生日祝福模板", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC008", name: "家政员服务结束前提醒", description: "家政员服务即将结束时提前两天提醒", category: "operation", role: "母婴顾问", event: "service.ending", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "custom", frequencyDesc: "服务结束前2天", recipients: ["母婴顾问", "家政员", "雇主"], conditions: "服务结束前2天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC009", name: "公海客户重新导入提醒", description: "公海客户重新导入后通知顾问及时跟进", category: "customer", role: "母婴顾问", event: "sea.reimported", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["母婴顾问"], createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC010", name: "家政员体检报告到期提醒", description: "家政员体检报告即将到期时提前一个月提醒", category: "operation", role: "母婴顾问", event: "health_report.expiring", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "30days", frequencyDesc: "提前30天", recipients: ["母婴顾问", "家政员"], conditions: "体检报告到期前30天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC011", name: "产后护理节点提醒", description: "选择剖腹产/顺产后，系统在第3天、第7天、第30天三个时间节点提醒", category: "customer", role: "母婴顾问", event: "postpartum.milestone", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "custom", frequencyDesc: "第3/7/30天", recipients: ["母婴顾问"], conditions: "剖腹产/顺产后第3、7、30天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "MC012", name: "家政员上户提醒", description: "合同服务开始前3天起，每天提醒家政员准备上户", category: "operation", role: "母婴顾问", event: "service.start_reminder", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "custom", frequencyDesc: "服务前3天/2天/1天", recipients: ["家政员", "母婴顾问"], conditions: "服务开始前3天起每天提醒，共提醒3次", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
]

// 通用提醒
// 培训提醒规则
const trainingRules: NotificationRule[] = [
  { id: "TR001", name: "开课提醒", description: "课程开始前提醒学员和讲师准时参加", category: "training", role: "通用", event: "class.start", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "daily", frequencyDesc: "开课前1天", recipients: ["学员", "讲师", "培训部"], conditions: "开课前1天提醒", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "TR002", name: "消课提醒", description: "课程消耗后通知学员剩余课时情况", category: "training", role: "通用", event: "class.consumed", enabled: true, channels: { email: false, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["学员"], conditions: "每次消课后", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "TR003", name: "考级提醒", description: "考试/考级前提醒学员做好准备", category: "training", role: "通用", event: "exam.upcoming", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "7days", frequencyDesc: "考试前7天/1天", recipients: ["学员", "培训部"], conditions: "考试前7天首次提醒，考试前1天再次提醒", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "TR004", name: "结业提醒", description: "学员即将结业时提醒办理相关手续", category: "training", role: "通用", event: "graduation.upcoming", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "3days", frequencyDesc: "结业前3天", recipients: ["学员", "职业顾问", "培训部"], conditions: "结业前3天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "TR005", name: "证书到期提醒", description: "证书即将到期时提醒学员续期", category: "training", role: "通用", event: "certificate.expiring", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "30days", frequencyDesc: "到期前30天", recipients: ["学员", "培训部"], conditions: "证书到期前30天", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
  { id: "TR006", name: "课时不足提醒", description: "学员剩余课时不足时提醒续费", category: "training", role: "通用", event: "class.low_balance", enabled: true, channels: { email: false, sms: true, push: true, wechat: true }, frequency: "realtime", recipients: ["学员", "职业顾问"], conditions: "剩余课时 <= 3", createdAt: "2025-01-10", updatedAt: "2025-01-20" },
]

const generalRules: NotificationRule[] = [
  { id: "NR001", name: "新订单提醒", description: "有新订单创建时发送通知给相关人员", category: "order", role: "通用", event: "order.created", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "realtime", recipients: ["销售部", "运营部"], conditions: "订单金额 >= 1000", createdAt: "2025-01-10", updatedAt: "2025-01-15" },
  { id: "NR002", name: "订单支付成功", description: "客户完成支付后通知相关人员", category: "order", role: "通用", event: "order.paid", enabled: true, channels: { email: true, sms: false, push: true, wechat: true }, frequency: "realtime", recipients: ["财务部", "运营部"], createdAt: "2025-01-10", updatedAt: "2025-01-12" },
  { id: "NR003", name: "排班变更通知", description: "服务人员排班变更时通知", category: "operation", role: "通用", event: "schedule.changed", enabled: true, channels: { email: true, sms: true, push: true, wechat: true }, frequency: "realtime", recipients: ["服务人员"], createdAt: "2025-01-10", updatedAt: "2025-01-10" },
  { id: "NR004", name: "异常登录提醒", description: "检测到异常登录时发送通知", category: "system", role: "通用", event: "security.abnormal_login", enabled: true, channels: { email: true, sms: true, push: true, wechat: false }, frequency: "realtime", recipients: ["账户所有者", "管理员"], createdAt: "2025-01-10", updatedAt: "2025-01-10" },
  { id: "NR005", name: "周报推送", description: "每周业务数据汇总报告", category: "system", role: "通用", event: "report.weekly", enabled: true, channels: { email: true, sms: false, push: false, wechat: false }, frequency: "weekly", recipients: ["管理层"], conditions: "每周一上午9点", createdAt: "2025-01-10", updatedAt: "2025-01-10" },
]

const allRules = [...careerConsultantRules, ...maternityConsultantRules, ...trainingRules, ...generalRules]

const categoryConfig = {
  order: { label: "订单通知", icon: ShoppingCart, color: "bg-blue-100 text-blue-700 border-blue-200" },
  customer: { label: "客户通知", icon: Users, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  training: { label: "培训提醒", icon: GraduationCap, color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  operation: { label: "运营通知", icon: Settings, color: "bg-amber-100 text-amber-700 border-amber-200" },
  system: { label: "系统通知", icon: Bell, color: "bg-purple-100 text-purple-700 border-purple-200" },
}

const roleConfig = {
  "职业顾问": { label: "职业顾问", icon: Briefcase, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "母婴顾问": { label: "母婴顾问", icon: Baby, color: "bg-pink-100 text-pink-700 border-pink-200" },
  "通用": { label: "通用", icon: Users, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

const frequencyConfig: Record<string, { label: string; color: string }> = {
  realtime: { label: "实时", color: "text-green-600" },
  "2hours": { label: "每2小时", color: "text-blue-600" },
  hourly: { label: "每小时", color: "text-blue-600" },
  daily: { label: "每天", color: "text-amber-600" },
  "3days": { label: "每3天", color: "text-amber-600" },
  "7days": { label: "每7天", color: "text-orange-600" },
  weekly: { label: "每周", color: "text-purple-600" },
  "30days": { label: "提前30天", color: "text-red-600" },
  custom: { label: "自定义", color: "text-gray-600" },
}

// Edit Rule Dialog
function EditRuleDialog({ rule, trigger, isNew = false }: { rule?: NotificationRule; trigger?: React.ReactNode; isNew?: boolean }) {
  const [channels, setChannels] = useState(rule?.channels || { email: true, sms: false, push: true, wechat: false })
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            {isNew ? <Plus className="h-4 w-4 text-primary" /> : <Edit className="h-4 w-4 text-primary" />}
            {isNew ? "新建通知规则" : "编辑通知规则"}
          </DialogTitle>
          <DialogDescription className="text-xs">{isNew ? "创建新的通知规则，配置触发条件和通知方式" : "修改通知规则的配置信息"}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-primary" />基本信息
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">规则名称</Label>
                <Input placeholder="输入规则名称" className="h-8 text-xs" defaultValue={rule?.name} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">适用角色</Label>
                <Select defaultValue={rule?.role || "通用"}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="职业顾问">职业顾问</SelectItem>
                    <SelectItem value="母婴顾问">母婴顾问</SelectItem>
                    <SelectItem value="通用">通用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">通知分类</Label>
                <Select defaultValue={rule?.category || "order"}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">订单通知</SelectItem>
                    <SelectItem value="customer">客户通知</SelectItem>
                    <SelectItem value="operation">运营通知</SelectItem>
                    <SelectItem value="system">系统通知</SelectItem>
                    <SelectItem value="training">培训提醒</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">规则描述</Label>
                <Textarea placeholder="输入规则描述" className="text-xs min-h-14 resize-none" defaultValue={rule?.description} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />通知渠道
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">邮件通知</span>
                </div>
                <Switch checked={channels.email} onCheckedChange={(v) => setChannels({...channels, email: v})} />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">短信通知</span>
                </div>
                <Switch checked={channels.sms} onCheckedChange={(v) => setChannels({...channels, sms: v})} />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">站内推送</span>
                </div>
                <Switch checked={channels.push} onCheckedChange={(v) => setChannels({...channels, push: v})} />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">微信通知</span>
                </div>
                <Switch checked={channels.wechat} onCheckedChange={(v) => setChannels({...channels, wechat: v})} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Frequency & Recipients */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />发送设置
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">发送频率</Label>
                <Select defaultValue={rule?.frequency || "realtime"}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">实时发送</SelectItem>
                    <SelectItem value="2hours">每2小时</SelectItem>
                    <SelectItem value="hourly">每小时汇总</SelectItem>
                    <SelectItem value="daily">每天汇总</SelectItem>
                    <SelectItem value="weekly">每周汇总</SelectItem>
                    <SelectItem value="30days">提前30天</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">通知模板</Label>
                <Select defaultValue="default">
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认模板</SelectItem>
                    <SelectItem value="birthday">生日祝福模板</SelectItem>
                    <SelectItem value="baby_birthday">宝宝生日祝福模板</SelectItem>
                    <SelectItem value="reminder">提醒模板</SelectItem>
                    <SelectItem value="custom">自定义模板</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">通知接收人</Label>
              <div className="grid grid-cols-4 gap-2">
                {["职业顾问", "母婴顾问", "财务部", "培训部", "服务人员", "家政员", "雇主", "管理层"].map((dept) => (
                  <div key={dept} className="flex items-center gap-1.5">
                    <Checkbox id={dept} defaultChecked={rule?.recipients?.includes(dept)} className="h-3.5 w-3.5" />
                    <Label htmlFor={dept} className="text-[10px] cursor-pointer">{dept}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">触发条件（可选）</Label>
              <Input placeholder="如：订单金额 >= 1000" className="h-8 text-xs" defaultValue={rule?.conditions} />
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-xs font-medium">启用此规则</p>
              <p className="text-[10px] text-muted-foreground">关闭后将暂停发送此类通知</p>
            </div>
            <Switch defaultChecked={rule?.enabled ?? true} />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><Save className="h-3 w-3 mr-1" />保存规则</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirm Dialog
function DeleteRuleDialog({ rule, trigger }: { rule: NotificationRule; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            删除通知规则
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-3">确定要删除以下通知规则吗？此操作不可恢复。</p>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs font-medium">{rule.name}</p>
            <p className="text-[10px] text-muted-foreground">{rule.description}</p>
          </div>
        </div>
        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs"><Trash2 className="h-3 w-3 mr-1" />确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [rules, setRules] = useState(allRules)

  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchCategory = activeTab === "all" || r.category === activeTab
      const matchRole = roleFilter === "all" || r.role === roleFilter
      const matchSearch = !searchTerm || r.name.includes(searchTerm) || r.description.includes(searchTerm) || r.event.includes(searchTerm)
      return matchCategory && matchRole && matchSearch
    })
  }, [rules, activeTab, roleFilter, searchTerm])

  const stats = useMemo(() => ({
    total: rules.length,
    enabled: rules.filter(r => r.enabled).length,
    disabled: rules.filter(r => !r.enabled).length,
    order: rules.filter(r => r.category === "order").length,
    customer: rules.filter(r => r.category === "customer").length,
    operation: rules.filter(r => r.category === "operation").length,
    system: rules.filter(r => r.category === "system").length,
    training: rules.filter(r => r.category === "training").length,
    career: rules.filter(r => r.role === "职业顾问").length,
    maternity: rules.filter(r => r.role === "母婴顾问").length,
  }), [rules])

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? {...r, enabled: !r.enabled} : r))
  }

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">通知设置</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Bell className="h-3 w-3" />{stats.total}条规则</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />{stats.enabled}已启用</span>
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-gray-400" />{stats.disabled}已停用</span>
            </div>
          </div>
          <EditRuleDialog isNew trigger={<Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建规则</Button>} />
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-5 gap-2">
          <Card className={cn("p-2.5 cursor-pointer transition-all hover:shadow-sm", roleFilter === "all" && "ring-1 ring-primary")} onClick={() => setRoleFilter("all")}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-gray-100">
                <Users className="h-3.5 w-3.5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-bold">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">全部规则</p>
              </div>
            </div>
          </Card>
          <Card className={cn("p-2.5 cursor-pointer transition-all hover:shadow-sm", roleFilter === "职业顾问" && "ring-1 ring-primary")} onClick={() => setRoleFilter("职业顾问")}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-indigo-100">
                <Briefcase className="h-3.5 w-3.5 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm font-bold">{stats.career}</p>
                <p className="text-[10px] text-muted-foreground">职业顾问</p>
              </div>
            </div>
          </Card>
          <Card className={cn("p-2.5 cursor-pointer transition-all hover:shadow-sm", roleFilter === "母婴顾问" && "ring-1 ring-primary")} onClick={() => setRoleFilter("母婴顾问")}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-pink-100">
                <Baby className="h-3.5 w-3.5 text-pink-700" />
              </div>
              <div>
                <p className="text-sm font-bold">{stats.maternity}</p>
                <p className="text-[10px] text-muted-foreground">母婴顾问</p>
              </div>
            </div>
          </Card>
          <Card className={cn("p-2.5 cursor-pointer transition-all hover:shadow-sm", roleFilter === "通用" && "ring-1 ring-primary")} onClick={() => setRoleFilter("通用")}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-100">
                <Settings className="h-3.5 w-3.5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-bold">{rules.filter(r => r.role === "通用").length}</p>
                <p className="text-[10px] text-muted-foreground">通用规则</p>
              </div>
            </div>
          </Card>
          <Card className="p-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-green-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-bold">{stats.enabled}</p>
                <p className="text-[10px] text-muted-foreground">已启用</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
              <TabsTrigger value="order" className="text-xs h-6">订单</TabsTrigger>
              <TabsTrigger value="customer" className="text-xs h-6">客户</TabsTrigger>
              <TabsTrigger value="operation" className="text-xs h-6">运营</TabsTrigger>
              <TabsTrigger value="system" className="text-xs h-6">系统</TabsTrigger>
              <TabsTrigger value="training" className="text-xs h-6">培训</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索规则..." className="pl-7 h-7 w-44 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-10">状态</TableHead>
                    <TableHead className="text-xs">规则名称</TableHead>
                    <TableHead className="text-xs w-20">适用角色</TableHead>
                    <TableHead className="text-xs w-20">分类</TableHead>
                    <TableHead className="text-xs w-20">通知渠道</TableHead>
                    <TableHead className="text-xs w-20">频率</TableHead>
                    <TableHead className="text-xs">接收人</TableHead>
                    <TableHead className="text-xs w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => {
                    const CategoryIcon = categoryConfig[rule.category].icon
                    const RoleIcon = rule.role ? roleConfig[rule.role].icon : Users
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} className="scale-75" />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium">{rule.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-56">{rule.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {rule.role && (
                            <Badge variant="outline" className={cn("text-[10px] h-5", roleConfig[rule.role].color)}>
                              <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                              {rule.role}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", categoryConfig[rule.category].color)}>
                            <CategoryIcon className="h-2.5 w-2.5 mr-0.5" />
                            {categoryConfig[rule.category].label.replace("通知", "")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {rule.channels.email && <Mail className="h-3 w-3 text-blue-500" title="邮件" />}
                            {rule.channels.sms && <Smartphone className="h-3 w-3 text-green-500" title="短信" />}
                            {rule.channels.push && <Bell className="h-3 w-3 text-amber-500" title="推送" />}
                            {rule.channels.wechat && <MessageSquare className="h-3 w-3 text-emerald-500" title="微信" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn("text-[10px]", frequencyConfig[rule.frequency]?.color || "text-gray-600")}>
                            {rule.frequencyDesc || frequencyConfig[rule.frequency]?.label || rule.frequency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {rule.recipients.slice(0, 2).map((r, i) => (
                              <Badge key={i} variant="secondary" className="text-[9px] h-4 px-1">{r}</Badge>
                            ))}
                            {rule.recipients.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">+{rule.recipients.length - 2}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <EditRuleDialog rule={rule} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem className="text-xs"><Copy className="h-3 w-3 mr-2" />复制规则</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />测试发送</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteRuleDialog rule={rule} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
            
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filteredRules.length} / {rules.length} 条规则
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
