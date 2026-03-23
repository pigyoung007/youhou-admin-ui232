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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Search, Plus, Phone, Mail, MoreHorizontal, Shield, Building2, Users, 
  ChevronDown, ChevronRight, User, Edit, Trash2, Key, UserX, UserCheck,
  FolderTree, Calendar, Clock, Eye, AlertTriangle, ArrowRightLeft, FileText, Download
} from "lucide-react"
import { cn } from "@/lib/utils"

// 公司数据 - 按照新组织架构
// 优厚家庭服务总部（总经理）
//   ├── 总经办
//   ├── 银川分公司（总经理）
//   │     ├── 人才孵化事业部：总经理、职业规划一部、职业规划二部、教务部
//   │     ├── 行政人事部
//   │     ├── 养老服务事业部：市场一部、市场二部、健康管理部、售后服务部
//   │     ├── 财务部
//   │     ├── 媒体宣传部
//   │     └── 居家服务事业部：总经理、母婴服务一部、母婴服务二部、产康服务部、上门指导部
//   └── 西安分公司（总经理）：同银川分公司结构

interface Company {
  id: string
  name: string
  shortName: string
  type: "headquarters" | "branch"
  parentId?: string
}

const companies: Company[] = [
  { id: "HQ", name: "优厚家庭服务总部", shortName: "总部", type: "headquarters" },
  { id: "YC", name: "银川分公司", shortName: "银川分公司", type: "branch", parentId: "HQ" },
  { id: "XA", name: "西安分公司", shortName: "西安分公司", type: "branch", parentId: "HQ" },
]

// 部门数据 - 新组织架构
interface Department {
  id: string
  name: string
  companyId: string
  parentId?: string
  level?: number // 层级用于显示
}

const departments: Department[] = [
  // 总部部门
  { id: "HQ_CEO", name: "总经办", companyId: "HQ" },
  
  // ==================== 银川分公司部门 ====================
  // 人才孵化事业部及其子部门
  { id: "YC_TALENT", name: "人才孵化事业部", companyId: "YC" },
  { id: "YC_TALENT_GM", name: "总经理", companyId: "YC", parentId: "YC_TALENT" },
  { id: "YC_TALENT_CP1", name: "职业规划一部", companyId: "YC", parentId: "YC_TALENT" },
  { id: "YC_TALENT_CP2", name: "职业规划二部", companyId: "YC", parentId: "YC_TALENT" },
  { id: "YC_TALENT_EDU", name: "教务部", companyId: "YC", parentId: "YC_TALENT" },
  
  // 行政人事部
  { id: "YC_HR", name: "行政人事部", companyId: "YC" },
  
  // 养老服务事业部及其子部门
  { id: "YC_ELDERLY", name: "养老服务事业部", companyId: "YC" },
  { id: "YC_ELDERLY_MK1", name: "市场一部", companyId: "YC", parentId: "YC_ELDERLY" },
  { id: "YC_ELDERLY_MK2", name: "市场二部", companyId: "YC", parentId: "YC_ELDERLY" },
  { id: "YC_ELDERLY_HEALTH", name: "健康管理部", companyId: "YC", parentId: "YC_ELDERLY" },
  { id: "YC_ELDERLY_SERVICE", name: "售后服务部", companyId: "YC", parentId: "YC_ELDERLY" },
  
  // 财务部
  { id: "YC_FINANCE", name: "财务部", companyId: "YC" },
  
  // 媒体宣传部
  { id: "YC_MEDIA", name: "媒体宣传部", companyId: "YC" },
  
  // 居家服务事业部及其子部门
  { id: "YC_HOME", name: "居家服务事业部", companyId: "YC" },
  { id: "YC_HOME_GM", name: "总经理", companyId: "YC", parentId: "YC_HOME" },
  { id: "YC_HOME_MB1", name: "母婴服务一部", companyId: "YC", parentId: "YC_HOME" },
  { id: "YC_HOME_MB2", name: "母婴服务二部", companyId: "YC", parentId: "YC_HOME" },
  { id: "YC_HOME_PP", name: "产康服务部", companyId: "YC", parentId: "YC_HOME" },
  { id: "YC_HOME_VISIT", name: "上门指导部", companyId: "YC", parentId: "YC_HOME" },
  
  // ==================== 西安分公司部门 ====================
  // 人才孵化事业部及其子部门
  { id: "XA_TALENT", name: "人才孵化事业部", companyId: "XA" },
  { id: "XA_TALENT_GM", name: "总经理", companyId: "XA", parentId: "XA_TALENT" },
  { id: "XA_TALENT_CP1", name: "职业规划一部", companyId: "XA", parentId: "XA_TALENT" },
  { id: "XA_TALENT_CP2", name: "职业规划二部", companyId: "XA", parentId: "XA_TALENT" },
  { id: "XA_TALENT_EDU", name: "教务部", companyId: "XA", parentId: "XA_TALENT" },
  
  // 行政人事部
  { id: "XA_HR", name: "行政人事部", companyId: "XA" },
  
  // 养老服务事业部及其子部门
  { id: "XA_ELDERLY", name: "养老服务事业部", companyId: "XA" },
  { id: "XA_ELDERLY_MK1", name: "市场一部", companyId: "XA", parentId: "XA_ELDERLY" },
  { id: "XA_ELDERLY_MK2", name: "市场二部", companyId: "XA", parentId: "XA_ELDERLY" },
  { id: "XA_ELDERLY_HEALTH", name: "健康管理部", companyId: "XA", parentId: "XA_ELDERLY" },
  { id: "XA_ELDERLY_SERVICE", name: "售后服务部", companyId: "XA", parentId: "XA_ELDERLY" },
  
  // 财务部
  { id: "XA_FINANCE", name: "财务部", companyId: "XA" },
  
  // 媒体宣传部
  { id: "XA_MEDIA", name: "媒体宣传部", companyId: "XA" },
  
  // 居家服务事业部及其子部门
  { id: "XA_HOME", name: "居家服务事业部", companyId: "XA" },
  { id: "XA_HOME_GM", name: "总经理", companyId: "XA", parentId: "XA_HOME" },
  { id: "XA_HOME_MB1", name: "母婴服务一部", companyId: "XA", parentId: "XA_HOME" },
  { id: "XA_HOME_MB2", name: "母婴服务二部", companyId: "XA", parentId: "XA_HOME" },
  { id: "XA_HOME_PP", name: "产康服务部", companyId: "XA", parentId: "XA_HOME" },
  { id: "XA_HOME_VISIT", name: "上门指导部", companyId: "XA", parentId: "XA_HOME" },
]

// 员工数据
interface Employee {
  id: string
  name: string
  gender: "male" | "female"
  phone: string
  email: string
  role: string
  roleType: "career_consultant" | "maternity_consultant" | "customer_service" | "trainer" | "manager" | "finance" | "hr" | "other"
  departmentId: string
  companyId: string
  status: "active" | "resigned" | "probation"
  joinDate: string
  resignDate?: string
  resignReason?: string
  permissions: string[]
  handoverTo?: string // 交接给谁
  handoverDate?: string
  followupCount?: number // 跟进记录数
  customerCount?: number // 管理的客户数
}

const employees: Employee[] = [
  // ==================== 总部员工 ====================
  { id: "E001", name: "李总", gender: "male", phone: "138****0001", email: "lizong@youhou.com", role: "总经理", roleType: "manager", departmentId: "HQ_CEO", companyId: "HQ", status: "active", joinDate: "2020-01-01", permissions: ["admin"], followupCount: 0, customerCount: 0 },
  
  // ==================== 银川分公司员工 ====================
  // 银川-人才孵化事业部
  { id: "E002", name: "张总", gender: "male", phone: "138****5678", email: "zhang@youhou.com", role: "事业部总经理", roleType: "manager", departmentId: "YC_TALENT_GM", companyId: "YC", status: "active", joinDate: "2023-03-15", permissions: ["operation", "staff"], followupCount: 56, customerCount: 12 },
  { id: "E003", name: "王主管", gender: "female", phone: "139****2345", email: "wang@youhou.com", role: "职业规划一部主管", roleType: "career_consultant", departmentId: "YC_TALENT_CP1", companyId: "YC", status: "active", joinDate: "2023-05-01", permissions: ["career"], followupCount: 234, customerCount: 45 },
  { id: "E004", name: "李顾问", gender: "female", phone: "139****1234", email: "li@youhou.com", role: "职业顾问", roleType: "career_consultant", departmentId: "YC_TALENT_CP1", companyId: "YC", status: "active", joinDate: "2023-06-20", permissions: ["career"], followupCount: 189, customerCount: 38 },
  { id: "E005", name: "刘顾问", gender: "female", phone: "138****3456", email: "liu@youhou.com", role: "职业顾问", roleType: "career_consultant", departmentId: "YC_TALENT_CP2", companyId: "YC", status: "active", joinDate: "2024-01-15", permissions: ["career"], followupCount: 145, customerCount: 28 },
  { id: "E006", name: "郑顾问", gender: "male", phone: "137****4567", email: "zheng@youhou.com", role: "职业顾问", roleType: "career_consultant", departmentId: "YC_TALENT_CP2", companyId: "YC", status: "active", joinDate: "2024-02-20", permissions: ["career"], followupCount: 112, customerCount: 22 },
  { id: "E024", name: "赵教务", gender: "female", phone: "135****4567", email: "zhaojw@youhou.com", role: "教务主管", roleType: "trainer", departmentId: "YC_TALENT_EDU", companyId: "YC", status: "active", joinDate: "2024-02-01", permissions: ["training"], followupCount: 45, customerCount: 120 },
  
  // 银川-行政人事部
  { id: "E015", name: "钱人事", gender: "female", phone: "135****1098", email: "qian@youhou.com", role: "人事专员", roleType: "hr", departmentId: "YC_HR", companyId: "YC", status: "active", joinDate: "2024-03-01", permissions: ["hr"], followupCount: 0, customerCount: 0 },
  
  // 银川-养老服务事业部
  { id: "E025", name: "孙经理", gender: "male", phone: "138****1111", email: "sunyl@youhou.com", role: "市场一部经理", roleType: "manager", departmentId: "YC_ELDERLY_MK1", companyId: "YC", status: "active", joinDate: "2024-01-01", permissions: ["operation"], followupCount: 68, customerCount: 25 },
  { id: "E026", name: "周专员", gender: "female", phone: "138****2222", email: "zhouyl@youhou.com", role: "健康管理专员", roleType: "other", departmentId: "YC_ELDERLY_HEALTH", companyId: "YC", status: "active", joinDate: "2024-03-01", permissions: ["service"], followupCount: 45, customerCount: 18 },
  
  // 银川-财务部
  { id: "E013", name: "王财务", gender: "female", phone: "137****9876", email: "wangcw@youhou.com", role: "财务主管", roleType: "finance", departmentId: "YC_FINANCE", companyId: "YC", status: "active", joinDate: "2023-01-10", permissions: ["finance"], followupCount: 0, customerCount: 0 },
  { id: "E014", name: "赵会计", gender: "female", phone: "136****0987", email: "zhao@youhou.com", role: "会计", roleType: "finance", departmentId: "YC_FINANCE", companyId: "YC", status: "active", joinDate: "2024-02-01", permissions: ["finance"], followupCount: 0, customerCount: 0 },
  
  // 银川-媒体宣传部
  { id: "E027", name: "吴媒体", gender: "female", phone: "138****3333", email: "wumedia@youhou.com", role: "媒体运营", roleType: "other", departmentId: "YC_MEDIA", companyId: "YC", status: "active", joinDate: "2024-05-01", permissions: ["operation"], followupCount: 0, customerCount: 0 },
  
  // 银川-居家服务事业部
  { id: "E007", name: "陈总", gender: "female", phone: "136****5678", email: "chen@youhou.com", role: "事业部总经理", roleType: "manager", departmentId: "YC_HOME_GM", companyId: "YC", status: "active", joinDate: "2023-04-01", permissions: ["service"], followupCount: 312, customerCount: 65 },
  { id: "E008", name: "周顾问", gender: "female", phone: "135****2345", email: "zhou@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "YC_HOME_MB1", companyId: "YC", status: "active", joinDate: "2024-01-10", permissions: ["service"], followupCount: 178, customerCount: 42 },
  { id: "E009", name: "吴顾问", gender: "female", phone: "136****3456", email: "wu@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "YC_HOME_MB1", companyId: "YC", status: "probation", joinDate: "2025-01-05", permissions: ["service"], followupCount: 23, customerCount: 8 },
  { id: "E010", name: "孙顾问", gender: "female", phone: "137****6789", email: "sun@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "YC_HOME_MB2", companyId: "YC", status: "active", joinDate: "2024-03-15", permissions: ["service"], followupCount: 156, customerCount: 35 },
  { id: "E028", name: "郑技师", gender: "female", phone: "138****4444", email: "zhengpp@youhou.com", role: "产康技师", roleType: "other", departmentId: "YC_HOME_PP", companyId: "YC", status: "active", joinDate: "2024-06-01", permissions: ["service"], followupCount: 89, customerCount: 32 },
  { id: "E011", name: "马客服", gender: "female", phone: "138****7890", email: "ma@youhou.com", role: "上门指导专员", roleType: "customer_service", departmentId: "YC_HOME_VISIT", companyId: "YC", status: "active", joinDate: "2024-05-01", permissions: ["service"], followupCount: 89, customerCount: 0 },
  // 银川-离职员工
  { id: "E012", name: "杨顾问", gender: "female", phone: "139****8901", email: "yang@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "YC_HOME_MB1", companyId: "YC", status: "resigned", joinDate: "2023-08-01", resignDate: "2025-01-10", resignReason: "个人原因", permissions: ["service"], handoverTo: "E008", handoverDate: "2025-01-08", followupCount: 267, customerCount: 0 },
  
  // ==================== 西安分公司员工 ====================
  // 西安-人才孵化事业部
  { id: "E016", name: "秦经理", gender: "male", phone: "186****1234", email: "qin@youhou.com", role: "事业部总经理", roleType: "manager", departmentId: "XA_TALENT_GM", companyId: "XA", status: "active", joinDate: "2024-06-01", permissions: ["branch"], followupCount: 78, customerCount: 15 },
  { id: "E029", name: "林顾问", gender: "female", phone: "186****5555", email: "linxa@youhou.com", role: "职业顾问", roleType: "career_consultant", departmentId: "XA_TALENT_CP1", companyId: "XA", status: "active", joinDate: "2024-07-01", permissions: ["career"], followupCount: 67, customerCount: 22 },
  
  // 西安-居家服务事业部
  { id: "E030", name: "何总", gender: "female", phone: "186****6666", email: "hexa@youhou.com", role: "事业部总经理", roleType: "manager", departmentId: "XA_HOME_GM", companyId: "XA", status: "active", joinDate: "2024-06-15", permissions: ["service"], followupCount: 125, customerCount: 38 },
  { id: "E017", name: "韩顾问", gender: "female", phone: "186****2345", email: "han@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "XA_HOME_MB1", companyId: "XA", status: "active", joinDate: "2024-07-15", permissions: ["service"], followupCount: 92, customerCount: 23 },
  { id: "E018", name: "唐客服", gender: "female", phone: "186****3456", email: "tang@youhou.com", role: "上门指导专员", roleType: "customer_service", departmentId: "XA_HOME_VISIT", companyId: "XA", status: "active", joinDate: "2024-08-01", permissions: ["service"], followupCount: 45, customerCount: 0 },
  // 西安-离职员工
  { id: "E019", name: "冯顾问", gender: "female", phone: "186****4567", email: "feng@youhou.com", role: "母婴顾问", roleType: "maternity_consultant", departmentId: "XA_HOME_MB1", companyId: "XA", status: "resigned", joinDate: "2024-06-15", resignDate: "2024-12-31", resignReason: "回老家发展", permissions: ["service"], handoverTo: "E017", handoverDate: "2024-12-28", followupCount: 134, customerCount: 0 },
]

const statusConfig = {
  active: { label: "在职", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  resigned: { label: "已离职", color: "bg-gray-100 text-gray-600 border-gray-200" },
  probation: { label: "试用期", color: "bg-amber-100 text-amber-700 border-amber-200" },
}

const roleTypeConfig = {
  career_consultant: { label: "职业顾问", description: "负责学员管理与跟踪" },
  maternity_consultant: { label: "母婴顾问", description: "负责家政员管理与跟踪" },
  customer_service: { label: "客服", description: "客户服务支持" },
  trainer: { label: "培训讲师", description: "培训教学" },
  manager: { label: "管理层", description: "部门/公司管理" },
  finance: { label: "财务", description: "财务管理" },
  hr: { label: "人事", description: "人力资源管理" },
  other: { label: "其他", description: "其他岗位" },
}

// 员工详情弹窗
function EmployeeDetailDialog({ employee, trigger }: { employee: Employee; trigger?: React.ReactNode }) {
  const dept = departments.find(d => d.id === employee.departmentId)
  const company = companies.find(c => c.id === employee.companyId)
  const handoverEmployee = employee.handoverTo ? employees.find(e => e.id === employee.handoverTo) : null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>员工档案</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[employee.status].color)}>
                {statusConfig[employee.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{employee.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className={cn("text-lg", employee.status === "resigned" ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>{employee.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-semibold">{employee.name}</h3>
              <p className="text-xs text-muted-foreground">{employee.role} · {roleTypeConfig[employee.roleType].label}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{company?.shortName}</Badge>
                <Badge variant="secondary" className="text-[10px]">{dept?.name}</Badge>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">联系方式</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />手机</p>
                <p className="text-xs font-medium">{employee.phone}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />邮箱</p>
                <p className="text-xs font-medium truncate">{employee.email}</p>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">工作信息</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />入职日期</p>
                <p className="text-xs font-medium">{employee.joinDate}</p>
              </div>
              {employee.status === "resigned" && employee.resignDate && (
                <div className="p-2 rounded-lg bg-red-50">
                  <p className="text-[10px] text-red-600 flex items-center gap-1"><Calendar className="h-3 w-3" />离职日期</p>
                  <p className="text-xs font-medium text-red-700">{employee.resignDate}</p>
                </div>
              )}
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />跟进记录</p>
                <p className="text-xs font-medium">{employee.followupCount || 0}条</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />管理客户</p>
                <p className="text-xs font-medium">{employee.customerCount || 0}位</p>
              </div>
            </div>
          </div>

          {/* Handover Info (for resigned employees) */}
          {employee.status === "resigned" && handoverEmployee && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3" />工作交接
              </h4>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">{handoverEmployee.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">交接给：{handoverEmployee.name}</p>
                    <p className="text-[10px] text-muted-foreground">{handoverEmployee.role}</p>
                  </div>
                </div>
                <p className="text-[10px] text-amber-700">交接日期：{employee.handoverDate}</p>
                {employee.resignReason && (
                  <p className="text-[10px] text-muted-foreground mt-1">离职原因：{employee.resignReason}</p>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                * 该员工的所有跟进记录已保留，可在跟进记录中查看历史数据
              </p>
            </div>
          )}

          {/* Permissions */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">系统权限</h4>
            <div className="flex flex-wrap gap-1">
              {employee.permissions.map((perm, i) => (
                <Badge key={i} variant="outline" className="text-[10px]">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  {perm === "admin" ? "超级管理员" : 
                   perm === "operation" ? "运营管理" :
                   perm === "career" ? "职业发展" :
                   perm === "service" ? "家政服务" :
                   perm === "finance" ? "财务管理" :
                   perm === "hr" ? "人事管理" :
                   perm === "training" ? "培训管理" :
                   perm === "branch" ? "分公司管理" :
                   perm === "enroll" ? "招生管理" : perm}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          {employee.status === "resigned" ? (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><FileText className="h-3 w-3 mr-1" />查看跟进记录</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />导出数据</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Key className="h-3 w-3 mr-1" />重置密码</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Shield className="h-3 w-3 mr-1" />权限设置</Button>
              <Button size="sm" className="h-7 text-xs"><Edit className="h-3 w-3 mr-1" />编辑</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 员工离职交接弹窗
function ResignHandoverDialog({ employee, trigger }: { employee: Employee; trigger?: React.ReactNode }) {
  const activeEmployees = employees.filter(e => e.status === "active" && e.id !== employee.id && e.companyId === employee.companyId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600"><UserX className="h-3 w-3 mr-1" />办理离职</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-500" />
            员工离职交接
          </DialogTitle>
          <DialogDescription className="text-xs">办理员工离职并完成工作交接，确保跟进记录连续性</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">{employee.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{employee.name}</p>
              <p className="text-xs text-muted-foreground">{employee.role}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-[10px] text-blue-600">跟进记录</p>
              <p className="text-sm font-bold text-blue-700">{employee.followupCount || 0}条</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-[10px] text-purple-600">管理客户</p>
              <p className="text-sm font-bold text-purple-700">{employee.customerCount || 0}位</p>
            </div>
          </div>

          {/* Handover Settings */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">离职日期 *</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">离职原因</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择离职原因" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">个人原因</SelectItem>
                  <SelectItem value="family">家庭原因</SelectItem>
                  <SelectItem value="career">职业发展</SelectItem>
                  <SelectItem value="relocation">异地搬迁</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">工作交接给 *</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择交接人员" /></SelectTrigger>
                <SelectContent>
                  {activeEmployees.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name} - {e.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">交接备注</Label>
              <Textarea placeholder="填写交接注意事项..." className="text-xs min-h-16 resize-none" />
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-1">交接说明</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                  <li>离职员工的所有跟进记录将保留，不会被删除</li>
                  <li>跟进记录中会保留原顾问姓名，确保历史可追溯</li>
                  <li>客户将自动分配给交接人员继续跟进</li>
                  <li>通话录音等资料可继续查看和下载</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs"><UserX className="h-3 w-3 mr-1" />确认离职</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 新增员工弹窗
function AddEmployeeDialog({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />添加员工</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            添加员工
          </DialogTitle>
          <DialogDescription className="text-xs">填写新员工的基本信息和权限设置</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">姓名 *</Label>
              <Input placeholder="输入姓名" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">性别</Label>
              <Select defaultValue="female">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="male">男</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">手机号码 *</Label>
              <Input placeholder="输入手机号" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">邮箱</Label>
              <Input placeholder="输入邮箱" className="h-8 text-xs" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">岗位类型 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择岗位类型" /></SelectTrigger>
              <SelectContent>
                {Object.entries(roleTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <span>{config.label}</span>
                      <span className="text-muted-foreground ml-2 text-[10px]">{config.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">所属公司 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择公司" /></SelectTrigger>
              <SelectContent>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.shortName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">所属部门 *</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择部门" /></SelectTrigger>
              <SelectContent>
                {departments.filter(d => !d.parentId).map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">职位名称 *</Label>
              <Input placeholder="输入职位" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">入职日期</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">系统权限</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "operation", label: "运营管理" },
                { id: "career", label: "职业发展" },
                { id: "service", label: "家政服务" },
                { id: "finance", label: "财务管理" },
                { id: "hr", label: "人事管理" },
                { id: "training", label: "培训管理" },
              ].map(perm => (
                <div key={perm.id} className="flex items-center gap-2">
                  <Checkbox id={perm.id} />
                  <label htmlFor={perm.id} className="text-xs">{perm.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 组织树节点 - 支持新的层级组织架构
function OrgTreeNode({ 
  company, 
  selectedOrg, 
  onSelectOrg 
}: { 
  company: Company
  selectedOrg: string
  onSelectOrg: (orgId: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set())
  
  // 获取该公司的顶级部门（没有parentId的部门）
  const companyDepts = departments.filter(d => d.companyId === company.id && !d.parentId)
  const companyEmployeeCount = employees.filter(e => e.companyId === company.id && e.status !== "resigned").length

  const toggleDept = (deptId: string) => {
    setExpandedDepts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(deptId)) {
        newSet.delete(deptId)
      } else {
        newSet.add(deptId)
      }
      return newSet
    })
  }

  const renderDeptNode = (dept: Department, level: number = 0) => {
    const childDepts = departments.filter(d => d.parentId === dept.id)
    // 统计该部门及其所有子部门的员工数
    const getAllDeptIds = (deptId: string): string[] => {
      const children = departments.filter(d => d.parentId === deptId)
      return [deptId, ...children.flatMap(c => getAllDeptIds(c.id))]
    }
    const allDeptIds = getAllDeptIds(dept.id)
    const deptEmployeeCount = employees.filter(e => allDeptIds.includes(e.departmentId) && e.status !== "resigned").length
    const hasChildren = childDepts.length > 0
    const isExpanded = expandedDepts.has(dept.id)

    return (
      <div key={dept.id}>
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-1.5 px-2 py-1 rounded text-[11px] hover:bg-muted/50",
            selectedOrg === dept.id && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleDept(dept.id)
            }
            onSelectOrg(dept.id)
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />
          ) : (
            <span className="w-2.5" />
          )}
          <FolderTree className="h-3 w-3" />
          <span className="flex-1 text-left truncate">{dept.name}</span>
          {deptEmployeeCount > 0 && <span className="text-muted-foreground">{deptEmployeeCount}</span>}
        </button>
        {hasChildren && isExpanded && childDepts.map(child => renderDeptNode(child, level + 1))}
      </div>
    )
  }

  // 如果是分公司，检查是否有子公司
  const childCompanies = companies.filter(c => c.parentId === company.id)

  return (
    <div className="space-y-0.5">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs hover:bg-muted/50",
              selectedOrg === company.id && "bg-primary/10 text-primary"
            )}
            onClick={() => onSelectOrg(company.id)}
          >
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <Building2 className="h-3.5 w-3.5" />
            <span className="flex-1 text-left truncate font-medium">{company.shortName}</span>
            <span className="text-muted-foreground">{companyEmployeeCount}</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* 渲染子公司 */}
          {childCompanies.map(childCompany => (
            <OrgTreeNode 
              key={childCompany.id} 
              company={childCompany} 
              selectedOrg={selectedOrg} 
              onSelectOrg={onSelectOrg} 
            />
          ))}
          {/* 渲染部门 */}
          {companyDepts.map(dept => renderDeptNode(dept))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrg, setSelectedOrg] = useState("all")
  const [activeTab, setActiveTab] = useState("active")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredEmployees = useMemo(() => {
    // 获取某个部门及其所有子部门的ID列表
    const getAllDeptIds = (deptId: string): string[] => {
      const children = departments.filter(d => d.parentId === deptId)
      return [deptId, ...children.flatMap(c => getAllDeptIds(c.id))]
    }

    // 获取某个公司及其所有子公司的ID列表
    const getAllCompanyIds = (companyId: string): string[] => {
      const children = companies.filter(c => c.parentId === companyId)
      return [companyId, ...children.flatMap(c => getAllCompanyIds(c.id))]
    }

    return employees.filter(e => {
      // Status filter
      if (activeTab === "active" && e.status === "resigned") return false
      if (activeTab === "resigned" && e.status !== "resigned") return false
      
      // Organization filter - 支持新的组织ID格式
      if (selectedOrg !== "all") {
        // 检查是否是公司ID (HQ, YC, XA)
        const isCompany = companies.some(c => c.id === selectedOrg)
        if (isCompany) {
          // 获取该公司及其所有子公司
          const companyIds = getAllCompanyIds(selectedOrg)
          if (!companyIds.includes(e.companyId)) return false
        } else {
          // 是部门ID，获取该部门及其所有子部门
          const deptIds = getAllDeptIds(selectedOrg)
          if (!deptIds.includes(e.departmentId)) return false
        }
      }

      // Role type filter
      if (roleFilter !== "all" && e.roleType !== roleFilter) return false

      // Search
      if (searchTerm && !e.name.includes(searchTerm) && !e.role.includes(searchTerm)) return false

      return true
    })
  }, [activeTab, selectedOrg, roleFilter, searchTerm])

  const stats = useMemo(() => ({
    total: employees.filter(e => e.status !== "resigned").length,
    active: employees.filter(e => e.status === "active").length,
    probation: employees.filter(e => e.status === "probation").length,
    resigned: employees.filter(e => e.status === "resigned").length,
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">员工管理</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stats.total}人在职</span>
              <span className="flex items-center gap-1"><UserCheck className="h-3 w-3 text-green-500" />{stats.active}正式</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />{stats.probation}试用</span>
              <span className="flex items-center gap-1"><UserX className="h-3 w-3 text-gray-400" />{stats.resigned}离职</span>
            </div>
          </div>
          <AddEmployeeDialog />
        </div>

        {/* Main Content */}
        <div className="flex gap-3">
          {/* Left: Organization Tree */}
          <Card className="w-52 shrink-0 p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-medium">组织架构</span>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1">
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs hover:bg-muted/50",
                    selectedOrg === "all" && "bg-primary/10 text-primary"
                  )}
                  onClick={() => setSelectedOrg("all")}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="flex-1 text-left">全部公司</span>
                  <span className="text-muted-foreground">{stats.total}</span>
                </button>
                {companies.map(company => (
                  <OrgTreeNode 
                    key={company.id} 
                    company={company} 
                    selectedOrg={selectedOrg}
                    onSelectOrg={setSelectedOrg}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Right: Employee List */}
          <div className="flex-1 space-y-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="h-8">
                  <TabsTrigger value="active" className="text-xs h-6">在职员工 ({stats.active + stats.probation})</TabsTrigger>
                  <TabsTrigger value="resigned" className="text-xs h-6">离职员工 ({stats.resigned})</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索员工..." className="pl-7 h-7 w-36 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部岗位</SelectItem>
                      <SelectItem value="career_consultant">职业顾问</SelectItem>
                      <SelectItem value="maternity_consultant">母婴顾问</SelectItem>
                      <SelectItem value="customer_service">客服</SelectItem>
                      <SelectItem value="trainer">培训讲师</SelectItem>
                      <SelectItem value="manager">管理层</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-3">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">员工</TableHead>
                        <TableHead className="text-xs">岗位类型</TableHead>
                        <TableHead className="text-xs">部门</TableHead>
                        <TableHead className="text-xs">状态</TableHead>
                        <TableHead className="text-xs">跟进记录</TableHead>
                        <TableHead className="text-xs">{activeTab === "resigned" ? "离职日期" : "入职日期"}</TableHead>
                        <TableHead className="text-xs w-32">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => {
                        const dept = departments.find(d => d.id === employee.departmentId)
                        const company = companies.find(c => c.id === employee.companyId)
                        return (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className={cn("text-[10px]", employee.status === "resigned" ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>{employee.name.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-medium">{employee.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{employee.role}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[10px]">{roleTypeConfig[employee.roleType].label}</Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-xs">{dept?.name}</p>
                                <p className="text-[10px] text-muted-foreground">{company?.shortName}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[employee.status].color)}>
                                {statusConfig[employee.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs">{employee.followupCount || 0}条</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {activeTab === "resigned" ? employee.resignDate : employee.joinDate}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <EmployeeDetailDialog employee={employee} />
                                {employee.status !== "resigned" ? (
                                  <>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Shield className="h-3.5 w-3.5" /></Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-32">
                                        <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs"><Key className="h-3 w-3 mr-2" />重置密码</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <ResignHandoverDialog employee={employee} trigger={
                                          <DropdownMenuItem className="text-xs text-red-600" onSelect={e => e.preventDefault()}>
                                            <UserX className="h-3 w-3 mr-2" />办理离职
                                          </DropdownMenuItem>
                                        } />
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                ) : (
                                  <Button variant="ghost" size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" />查看记录</Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Card>
                
                <div className="text-xs text-muted-foreground text-center mt-2">
                  显示 {filteredEmployees.length} / {activeTab === "resigned" ? stats.resigned : stats.active + stats.probation} 名员工
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
