"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, Plus, Tag, Tags, FolderTree, Edit, Trash2, MoreHorizontal, 
  ChevronRight, ChevronDown, Users, Baby, Heart, UserCog, GraduationCap,
  Eye, Copy, Palette, Check, X, AlertTriangle, Layers
} from "lucide-react"
import { cn } from "@/lib/utils"

// 标签分类
type TagCategory = "customer" | "employer" | "staff" | "student"

// 标签组
interface TagGroup {
  id: string
  name: string
  category: TagCategory
  description: string
  color: string
  icon: string
  parentId: string | null
  level: number
  order: number
  isSystem: boolean
  isEnabled: boolean
  createdAt: string
  updatedAt: string
  tags: TagItem[]
  children?: TagGroup[]
}

// 标签项
interface TagItem {
  id: string
  name: string
  color: string
  groupId: string
  usageCount: number
  isEnabled: boolean
  createdAt: string
}

// 模拟标签组数据
const tagGroups: TagGroup[] = [
  // 客户/雇主标签
  { id: "G001", name: "客户来源", category: "customer", description: "记录客户获取渠道", color: "blue", icon: "target", parentId: null, level: 1, order: 1, isSystem: true, isEnabled: true, createdAt: "2024-01-01", updatedAt: "2025-01-15", tags: [
    { id: "T001", name: "线上咨询", color: "blue", groupId: "G001", usageCount: 156, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T002", name: "老客户推荐", color: "green", groupId: "G001", usageCount: 89, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T003", name: "线下活动", color: "purple", groupId: "G001", usageCount: 45, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T004", name: "广告投放", color: "orange", groupId: "G001", usageCount: 78, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T005", name: "合作渠道", color: "cyan", groupId: "G001", usageCount: 34, isEnabled: true, createdAt: "2024-01-01" },
  ]},
  { id: "G002", name: "客户意向", category: "customer", description: "客户购买意向程度", color: "amber", icon: "star", parentId: null, level: 1, order: 2, isSystem: true, isEnabled: true, createdAt: "2024-01-01", updatedAt: "2025-01-15", tags: [
    { id: "T006", name: "高意向", color: "red", groupId: "G002", usageCount: 67, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T007", name: "中意向", color: "amber", groupId: "G002", usageCount: 123, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T008", name: "低意向", color: "gray", groupId: "G002", usageCount: 89, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T009", name: "待跟进", color: "blue", groupId: "G002", usageCount: 156, isEnabled: true, createdAt: "2024-01-01" },
  ]},
  { id: "G003", name: "服务需求", category: "customer", description: "客户所需服务类型", color: "rose", icon: "heart", parentId: null, level: 1, order: 3, isSystem: false, isEnabled: true, createdAt: "2024-02-01", updatedAt: "2025-01-10", tags: [
    { id: "T010", name: "月嫂服务", color: "rose", groupId: "G003", usageCount: 234, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T011", name: "育婴服务", color: "cyan", groupId: "G003", usageCount: 189, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T012", name: "产康服务", color: "teal", groupId: "G003", usageCount: 145, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T013", name: "家政保洁", color: "emerald", groupId: "G003", usageCount: 78, isEnabled: true, createdAt: "2024-02-01" },
  ]},
  { id: "G004", name: "预算范围", category: "customer", description: "客户预算区间", color: "emerald", icon: "wallet", parentId: null, level: 1, order: 4, isSystem: false, isEnabled: true, createdAt: "2024-02-01", updatedAt: "2025-01-10", tags: [
    { id: "T014", name: "高端客户", color: "amber", groupId: "G004", usageCount: 45, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T015", name: "中端客户", color: "blue", groupId: "G004", usageCount: 167, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T016", name: "经济型", color: "gray", groupId: "G004", usageCount: 89, isEnabled: true, createdAt: "2024-02-01" },
  ]},
  { id: "G005", name: "客户特征", category: "customer", description: "客户特殊标记", color: "purple", icon: "user", parentId: null, level: 1, order: 5, isSystem: false, isEnabled: true, createdAt: "2024-03-01", updatedAt: "2025-01-08", tags: [
    { id: "T017", name: "VIP客户", color: "amber", groupId: "G005", usageCount: 23, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T018", name: "二胎妈妈", color: "pink", groupId: "G005", usageCount: 56, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T019", name: "高龄产妇", color: "purple", groupId: "G005", usageCount: 34, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T020", name: "双胞胎", color: "cyan", groupId: "G005", usageCount: 12, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T021", name: "早产儿", color: "red", groupId: "G005", usageCount: 8, isEnabled: true, createdAt: "2024-03-01" },
  ]},
  
  // 雇主标签
  { id: "G006", name: "雇主类型", category: "employer", description: "雇主家庭类型", color: "indigo", icon: "home", parentId: null, level: 1, order: 1, isSystem: true, isEnabled: true, createdAt: "2024-01-01", updatedAt: "2025-01-15", tags: [
    { id: "T022", name: "新手妈妈", color: "pink", groupId: "G006", usageCount: 189, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T023", name: "职场妈妈", color: "blue", groupId: "G006", usageCount: 145, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T024", name: "全职妈妈", color: "emerald", groupId: "G006", usageCount: 78, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T025", name: "单亲家庭", color: "purple", groupId: "G006", usageCount: 23, isEnabled: true, createdAt: "2024-01-01" },
  ]},
  { id: "G007", name: "服务偏好", category: "employer", description: "雇主服务偏好", color: "teal", icon: "settings", parentId: null, level: 1, order: 2, isSystem: false, isEnabled: true, createdAt: "2024-02-01", updatedAt: "2025-01-10", tags: [
    { id: "T026", name: "注重经验", color: "amber", groupId: "G007", usageCount: 134, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T027", name: "注重学历", color: "blue", groupId: "G007", usageCount: 67, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T028", name: "注重年龄", color: "purple", groupId: "G007", usageCount: 89, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T029", name: "注重性格", color: "pink", groupId: "G007", usageCount: 112, isEnabled: true, createdAt: "2024-02-01" },
  ]},
  { id: "G008", name: "合作评价", category: "employer", description: "雇主合作情况", color: "orange", icon: "star", parentId: null, level: 1, order: 3, isSystem: false, isEnabled: true, createdAt: "2024-03-01", updatedAt: "2025-01-08", tags: [
    { id: "T030", name: "优质雇主", color: "emerald", groupId: "G008", usageCount: 89, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T031", name: "普通雇主", color: "gray", groupId: "G008", usageCount: 234, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T032", name: "难沟通", color: "orange", groupId: "G008", usageCount: 23, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T033", name: "有投诉", color: "red", groupId: "G008", usageCount: 12, isEnabled: true, createdAt: "2024-03-01" },
  ]},

  // 员工/家政员标签
  { id: "G009", name: "技能等级", category: "staff", description: "家政员技能水平", color: "violet", icon: "award", parentId: null, level: 1, order: 1, isSystem: true, isEnabled: true, createdAt: "2024-01-01", updatedAt: "2025-01-15", tags: [
    { id: "T034", name: "金牌", color: "amber", groupId: "G009", usageCount: 23, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T035", name: "银牌", color: "gray", groupId: "G009", usageCount: 45, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T036", name: "铜牌", color: "orange", groupId: "G009", usageCount: 67, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T037", name: "初级", color: "blue", groupId: "G009", usageCount: 89, isEnabled: true, createdAt: "2024-01-01" },
  ]},
  { id: "G010", name: "专业技能", category: "staff", description: "家政员专业技能", color: "cyan", icon: "tool", parentId: null, level: 1, order: 2, isSystem: false, isEnabled: true, createdAt: "2024-02-01", updatedAt: "2025-01-10", tags: [
    { id: "T038", name: "催乳师", color: "pink", groupId: "G010", usageCount: 34, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T039", name: "营养师", color: "emerald", groupId: "G010", usageCount: 23, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T040", name: "早教师", color: "cyan", groupId: "G010", usageCount: 45, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T041", name: "小儿推拿", color: "purple", groupId: "G010", usageCount: 28, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T042", name: "产后修复", color: "rose", groupId: "G010", usageCount: 56, isEnabled: true, createdAt: "2024-02-01" },
  ]},
  { id: "G011", name: "工作特点", category: "staff", description: "家政员工作特点", color: "pink", icon: "sparkle", parentId: null, level: 1, order: 3, isSystem: false, isEnabled: true, createdAt: "2024-03-01", updatedAt: "2025-01-08", tags: [
    { id: "T043", name: "性格开朗", color: "amber", groupId: "G011", usageCount: 78, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T044", name: "细心耐心", color: "blue", groupId: "G011", usageCount: 112, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T045", name: "勤快利索", color: "emerald", groupId: "G011", usageCount: 89, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T046", name: "善于沟通", color: "purple", groupId: "G011", usageCount: 67, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T047", name: "经验丰富", color: "orange", groupId: "G011", usageCount: 45, isEnabled: true, createdAt: "2024-03-01" },
  ]},
  { id: "G012", name: "服务能力", category: "staff", description: "家政员特殊服务能力", color: "rose", icon: "star", parentId: null, level: 1, order: 4, isSystem: false, isEnabled: true, createdAt: "2024-04-01", updatedAt: "2025-01-05", tags: [
    { id: "T048", name: "双胞胎护理", color: "cyan", groupId: "G012", usageCount: 12, isEnabled: true, createdAt: "2024-04-01" },
    { id: "T049", name: "早产儿护理", color: "red", groupId: "G012", usageCount: 8, isEnabled: true, createdAt: "2024-04-01" },
    { id: "T050", name: "高端服务", color: "amber", groupId: "G012", usageCount: 23, isEnabled: true, createdAt: "2024-04-01" },
    { id: "T051", name: "涉外服务", color: "indigo", groupId: "G012", usageCount: 5, isEnabled: true, createdAt: "2024-04-01" },
  ]},

  // 学员标签
  { id: "G013", name: "学习状态", category: "student", description: "学员学习状态", color: "sky", icon: "book", parentId: null, level: 1, order: 1, isSystem: true, isEnabled: true, createdAt: "2024-01-01", updatedAt: "2025-01-15", tags: [
    { id: "T052", name: "学习积极", color: "emerald", groupId: "G013", usageCount: 89, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T053", name: "进步明显", color: "blue", groupId: "G013", usageCount: 67, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T054", name: "需要辅导", color: "amber", groupId: "G013", usageCount: 34, isEnabled: true, createdAt: "2024-01-01" },
    { id: "T055", name: "出勤不佳", color: "red", groupId: "G013", usageCount: 12, isEnabled: true, createdAt: "2024-01-01" },
  ]},
  { id: "G014", name: "就业意向", category: "student", description: "学员就业意向", color: "lime", icon: "briefcase", parentId: null, level: 1, order: 2, isSystem: false, isEnabled: true, createdAt: "2024-02-01", updatedAt: "2025-01-10", tags: [
    { id: "T056", name: "急需就业", color: "red", groupId: "G014", usageCount: 45, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T057", name: "观望中", color: "amber", groupId: "G014", usageCount: 78, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T058", name: "已有意向", color: "blue", groupId: "G014", usageCount: 56, isEnabled: true, createdAt: "2024-02-01" },
    { id: "T059", name: "暂不考虑", color: "gray", groupId: "G014", usageCount: 23, isEnabled: true, createdAt: "2024-02-01" },
  ]},
  { id: "G015", name: "学员来源", category: "student", description: "学员报名来源", color: "fuchsia", icon: "megaphone", parentId: null, level: 1, order: 3, isSystem: false, isEnabled: true, createdAt: "2024-03-01", updatedAt: "2025-01-08", tags: [
    { id: "T060", name: "自主报名", color: "blue", groupId: "G015", usageCount: 134, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T061", name: "学员推荐", color: "emerald", groupId: "G015", usageCount: 67, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T062", name: "企业合作", color: "purple", groupId: "G015", usageCount: 45, isEnabled: true, createdAt: "2024-03-01" },
    { id: "T063", name: "政府项目", color: "amber", groupId: "G015", usageCount: 89, isEnabled: true, createdAt: "2024-03-01" },
  ]},
]

const categoryConfig = {
  customer: { label: "客户标签", icon: Users, color: "bg-blue-100 text-blue-700", description: "用于客户分类和跟进管理" },
  employer: { label: "雇主标签", icon: Heart, color: "bg-rose-100 text-rose-700", description: "用于雇主特征和偏好管理" },
  staff: { label: "家政员标签", icon: UserCog, color: "bg-emerald-100 text-emerald-700", description: "用于家政员技能和特点标记" },
  student: { label: "学员标签", icon: GraduationCap, color: "bg-purple-100 text-purple-700", description: "用于学员状态和就业管理" },
}

const colorOptions = [
  { value: "gray", label: "灰色", class: "bg-gray-500" },
  { value: "red", label: "红色", class: "bg-red-500" },
  { value: "orange", label: "橙色", class: "bg-orange-500" },
  { value: "amber", label: "琥珀", class: "bg-amber-500" },
  { value: "yellow", label: "黄色", class: "bg-yellow-500" },
  { value: "lime", label: "青柠", class: "bg-lime-500" },
  { value: "green", label: "绿色", class: "bg-green-500" },
  { value: "emerald", label: "翠绿", class: "bg-emerald-500" },
  { value: "teal", label: "青色", class: "bg-teal-500" },
  { value: "cyan", label: "蓝绿", class: "bg-cyan-500" },
  { value: "sky", label: "天蓝", class: "bg-sky-500" },
  { value: "blue", label: "蓝色", class: "bg-blue-500" },
  { value: "indigo", label: "靛蓝", class: "bg-indigo-500" },
  { value: "violet", label: "紫罗兰", class: "bg-violet-500" },
  { value: "purple", label: "紫色", class: "bg-purple-500" },
  { value: "fuchsia", label: "品红", class: "bg-fuchsia-500" },
  { value: "pink", label: "粉色", class: "bg-pink-500" },
  { value: "rose", label: "玫瑰", class: "bg-rose-500" },
]

// 新建/编辑标签组弹窗
function TagGroupDialog({ group, category, trigger }: { group?: TagGroup; category: TagCategory; trigger: React.ReactNode }) {
  const isEdit = !!group

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <FolderTree className="h-4 w-4 text-primary" />
            {isEdit ? "编辑标签组" : "新建标签组"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit ? "修改标签组信息" : `在"${categoryConfig[category].label}"下创建新的标签组`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">标签组名称 *</Label>
            <Input placeholder="输入标签组名称" className="h-8 text-xs" defaultValue={group?.name} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">描述说明</Label>
            <Textarea placeholder="描述该标签组的用途" className="text-xs min-h-16 resize-none" defaultValue={group?.description} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">标签组颜色</Label>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                    color.class,
                    group?.color === color.value && "ring-2 ring-offset-2 ring-primary"
                  )}
                >
                  {group?.color === color.value && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">启用状态</Label>
              <p className="text-[10px] text-muted-foreground">关闭后该组标签将不可使用</p>
            </div>
            <Switch defaultChecked={group?.isEnabled ?? true} />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">{isEdit ? "保存修改" : "创建标签组"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 新建/编辑标签弹窗
function TagDialog({ tag, groupId, trigger }: { tag?: TagItem; groupId: string; trigger: React.ReactNode }) {
  const isEdit = !!tag

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <Tag className="h-4 w-4 text-primary" />
            {isEdit ? "编辑标签" : "新建标签"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">标签名称 *</Label>
            <Input placeholder="输入标签名称" className="h-8 text-xs" defaultValue={tag?.name} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">标签颜色</Label>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                    color.class,
                    tag?.color === color.value && "ring-2 ring-offset-2 ring-primary"
                  )}
                >
                  {tag?.color === color.value && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">启用状态</Label>
              <p className="text-[10px] text-muted-foreground">关闭后该标签将不可使用</p>
            </div>
            <Switch defaultChecked={tag?.isEnabled ?? true} />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">{isEdit ? "保存" : "创建"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 删除确认弹窗
function DeleteConfirmDialog({ type, name, trigger }: { type: "group" | "tag"; name: string; trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            确认删除
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            确定要删除{type === "group" ? "标签组" : "标签"} <span className="font-medium text-foreground">"{name}"</span> 吗？
            {type === "group" && "该操作将同时删除组内所有标签。"}此操作不可撤销。
          </p>
        </div>
        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs">确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 标签组卡片
function TagGroupCard({ group, category }: { group: TagGroup; category: TagCategory }) {
  const [expanded, setExpanded] = useState(true)
  const colorClass = colorOptions.find(c => c.value === group.color)?.class || "bg-gray-500"

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <button type="button" onClick={() => setExpanded(!expanded)} className="p-0.5 hover:bg-muted rounded">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <div className={cn("w-2 h-2 rounded-full shrink-0", colorClass)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium truncate">{group.name}</span>
            {group.isSystem && <Badge variant="outline" className="text-[9px] h-4 px-1">系统</Badge>}
            {!group.isEnabled && <Badge variant="outline" className="text-[9px] h-4 px-1 text-muted-foreground">已禁用</Badge>}
          </div>
          <p className="text-[10px] text-muted-foreground truncate">{group.description}</p>
        </div>
        <Badge variant="secondary" className="text-[10px] h-5 shrink-0">{group.tags.length}个标签</Badge>
        <div className="flex items-center gap-1">
          <TagGroupDialog group={group} category={category} trigger={
            <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3 w-3" /></Button>
          } />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem className="text-xs"><Copy className="h-3 w-3 mr-2" />复制</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">{group.isEnabled ? <X className="h-3 w-3 mr-2" /> : <Check className="h-3 w-3 mr-2" />}{group.isEnabled ? "禁用" : "启用"}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirmDialog type="group" name={group.name} trigger={
                <DropdownMenuItem className="text-xs text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
              } />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && (
        <div className="p-3">
          <div className="flex flex-wrap gap-1.5">
            {group.tags.map((tag) => {
              const tagColorClass = colorOptions.find(c => c.value === tag.color)?.class || "bg-gray-500"
              return (
                <div key={tag.id} className="group flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", tagColorClass)} />
                  <span className="text-[11px]">{tag.name}</span>
                  <span className="text-[10px] text-muted-foreground">({tag.usageCount})</span>
                  <div className="flex items-center gap-0.5">
                    <TagDialog tag={tag} groupId={group.id} trigger={
                      <button type="button" className="p-0.5 hover:bg-background rounded"><Edit className="h-2.5 w-2.5 text-muted-foreground" /></button>
                    } />
                    <DeleteConfirmDialog type="tag" name={tag.name} trigger={
                      <button type="button" className="p-0.5 hover:bg-background rounded"><X className="h-2.5 w-2.5 text-muted-foreground" /></button>
                    } />
                  </div>
                </div>
              )
            })}
            <TagDialog groupId={group.id} trigger={
              <button type="button" className="flex items-center gap-1 px-2 py-1 rounded-full border border-dashed hover:bg-muted/50 transition-colors">
                <Plus className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">添加标签</span>
              </button>
            } />
          </div>
        </div>
      )}
    </Card>
  )
}

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState<TagCategory>("customer")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGroups = useMemo(() => {
    return tagGroups.filter(g => {
      const matchCategory = g.category === activeTab
      const matchSearch = !searchTerm || g.name.includes(searchTerm) || g.tags.some(t => t.name.includes(searchTerm))
      return matchCategory && matchSearch
    })
  }, [activeTab, searchTerm])

  const stats = useMemo(() => {
    const categoryGroups = tagGroups.filter(g => g.category === activeTab)
    return {
      groupCount: categoryGroups.length,
      tagCount: categoryGroups.reduce((sum, g) => sum + g.tags.length, 0),
      usageCount: categoryGroups.reduce((sum, g) => sum + g.tags.reduce((s, t) => s + t.usageCount, 0), 0),
    }
  }, [activeTab])

  const CategoryIcon = categoryConfig[activeTab].icon

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">标签组管理</h1>
            <p className="text-xs text-muted-foreground mt-0.5">管理客户、雇主、家政员、学员的分类标签</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TagCategory)}>
          <div className="flex items-center justify-between gap-4">
            <TabsList className="h-8">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const Icon = config.icon
                const count = tagGroups.filter(g => g.category === key).length
                return (
                  <TabsTrigger key={key} value={key} className="text-xs h-6 gap-1.5">
                    <Icon className="h-3 w-3" />
                    {config.label}
                    <Badge variant="secondary" className="text-[9px] h-4 px-1 ml-0.5">{count}</Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索标签..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <TagGroupDialog category={activeTab} trigger={
                <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建标签组</Button>
              } />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3 space-y-3">
            {/* Category Info */}
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", categoryConfig[activeTab].color)}>
                  <CategoryIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{categoryConfig[activeTab].label}</h3>
                  <p className="text-[10px] text-muted-foreground">{categoryConfig[activeTab].description}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-bold text-primary">{stats.groupCount}</p>
                    <p className="text-[10px] text-muted-foreground">标签组</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{stats.tagCount}</p>
                    <p className="text-[10px] text-muted-foreground">标签数</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-emerald-600">{stats.usageCount}</p>
                    <p className="text-[10px] text-muted-foreground">使用次数</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tag Groups */}
            <div className="space-y-2">
              {filteredGroups.map((group) => (
                <TagGroupCard key={group.id} group={group} category={activeTab} />
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <Card className="p-8 text-center">
                <Tags className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">暂无标签组</p>
                <TagGroupDialog category={activeTab} trigger={
                  <Button variant="outline" size="sm" className="mt-3 h-7 text-xs bg-transparent"><Plus className="h-3 w-3 mr-1" />创建第一个标签组</Button>
                } />
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
