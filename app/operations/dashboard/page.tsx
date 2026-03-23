"use client"

import React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Calendar,
  Star,
  ChevronUp,
  ChevronDown,
  Download,
  BarChart3,
  Target,
  Clock,
  Phone,
  CheckCircle2,
  Baby,
  GraduationCap,
  Briefcase,
  Home,
  Activity,
  AlertCircle,
  CalendarDays,
  UserPlus,
  PhoneCall,
  Share2,
  Search,
  Filter,
  AlertTriangle,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"


// ==================== 图表数据 ====================
// 业绩分析数据 - 按日/周/月/年
const performanceData = {
  daily: [
    { date: "01-20", maternity: 28800, infant: 15000, postpartum: 4800, training: 6800 },
    { date: "01-21", maternity: 32000, infant: 18000, postpartum: 5200, training: 4500 },
    { date: "01-22", maternity: 26000, infant: 12000, postpartum: 6800, training: 8200 },
    { date: "01-23", maternity: 35000, infant: 22000, postpartum: 4200, training: 5600 },
    { date: "01-24", maternity: 42000, infant: 16000, postpartum: 7500, training: 9800 },
    { date: "01-25", maternity: 38500, infant: 19500, postpartum: 5800, training: 7200 },
  ],
  monthly: [
    { month: "8月", maternity: 186000, infant: 98000, postpartum: 45000, training: 68000 },
    { month: "9月", maternity: 205000, infant: 112000, postpartum: 52000, training: 75000 },
    { month: "10月", maternity: 225000, infant: 125000, postpartum: 58000, training: 82000 },
    { month: "11月", maternity: 248000, infant: 138000, postpartum: 65000, training: 88000 },
    { month: "12月", maternity: 268000, infant: 145000, postpartum: 72000, training: 95000 },
    { month: "1月", maternity: 285000, infant: 156000, postpartum: 78000, training: 102000 },
  ],
}

// 客户数量分析数据 - 各渠道入库及成交
const customerAnalysisData = [
  { month: "8月", referralIn: 45, referralDeal: 18, selfIn: 68, selfDeal: 22, onlineIn: 120, onlineDeal: 28, offlineIn: 35, offlineDeal: 8 },
  { month: "9月", referralIn: 52, referralDeal: 21, selfIn: 75, selfDeal: 26, onlineIn: 135, onlineDeal: 32, offlineIn: 42, offlineDeal: 10 },
  { month: "10月", referralIn: 48, referralDeal: 19, selfIn: 72, selfDeal: 24, onlineIn: 128, onlineDeal: 30, offlineIn: 38, offlineDeal: 9 },
  { month: "11月", referralIn: 55, referralDeal: 23, selfIn: 80, selfDeal: 28, onlineIn: 142, onlineDeal: 35, offlineIn: 45, offlineDeal: 12 },
  { month: "12月", referralIn: 58, referralDeal: 25, selfIn: 85, selfDeal: 30, onlineIn: 155, onlineDeal: 38, offlineIn: 48, offlineDeal: 14 },
  { month: "1月", referralIn: 62, referralDeal: 26, selfIn: 88, selfDeal: 32, onlineIn: 165, onlineDeal: 42, offlineIn: 52, offlineDeal: 15 },
]

// 年度任务完成情况数据
const annualTaskData = [
  { name: "月嫂签约", target: 120, completed: 98, rate: 81.7 },
  { name: "育婴签约", target: 80, completed: 65, rate: 81.3 },
  { name: "产康服务", target: 200, completed: 168, rate: 84.0 },
  { name: "培训招生", target: 150, completed: 128, rate: 85.3 },
  { name: "客户转化", target: 100, completed: 78, rate: 78.0 },
  { name: "渠道拓展", target: 50, completed: 42, rate: 84.0 },
]

// 转介绍及自拓数据入库趋势
const referralTrendData = [
  { month: "8月", referral: 45, self: 68, referralConvert: 18, selfConvert: 22 },
  { month: "9月", referral: 52, self: 75, referralConvert: 21, selfConvert: 26 },
  { month: "10月", referral: 48, self: 72, referralConvert: 19, selfConvert: 24 },
  { month: "11月", referral: 55, self: 80, referralConvert: 23, selfConvert: 28 },
  { month: "12月", referral: 58, self: 85, referralConvert: 25, selfConvert: 30 },
  { month: "1月", referral: 62, self: 88, referralConvert: 26, selfConvert: 32 },
]

// 图表颜色
const CHART_COLORS = {
  maternity: "#f43f5e",  // rose
  infant: "#3b82f6",     // blue
  postpartum: "#14b8a6", // teal
  training: "#8b5cf6",   // purple
  referral: "#f59e0b",   // amber
  self: "#10b981",       // emerald
  online: "#6366f1",     // indigo
  offline: "#64748b",    // slate
}

// ==================== 新增学员表数据 ====================
const newStudentsData = [
  { id: "S001", name: "张小明", phone: "138****1234", course: "月嫂培训", consultant: "李顾问", signDate: "2025-01-25", status: "studying", source: "转介绍" },
  { id: "S002", name: "王丽华", phone: "139****5678", course: "育婴师培训", consultant: "李顾问", signDate: "2025-01-24", status: "studying", source: "自拓" },
  { id: "S003", name: "刘美芳", phone: "137****9012", course: "产康技师培训", consultant: "王顾问", signDate: "2025-01-23", status: "studying", source: "线上" },
  { id: "S004", name: "陈秀英", phone: "136****3456", course: "月嫂培训", consultant: "张顾问", signDate: "2025-01-22", status: "graduated", source: "线下" },
  { id: "S005", name: "赵红梅", phone: "135****7890", course: "育婴师培训", consultant: "李顾问", signDate: "2025-01-21", status: "studying", source: "转介绍" },
]

// ==================== 新增科目表数据 ====================
const newCoursesData = [
  { id: "C001", studentName: "张小明", courseName: "高级月嫂护理", consultant: "李顾问", enrollDate: "2025-01-25", price: 6800, status: "active" },
  { id: "C002", studentName: "王丽华", courseName: "育婴师基础班", consultant: "李顾问", enrollDate: "2025-01-24", price: 4800, status: "active" },
  { id: "C003", studentName: "刘美芳", courseName: "产康理论课程", consultant: "王顾问", enrollDate: "2025-01-23", price: 5200, status: "active" },
  { id: "C004", studentName: "陈秀英", courseName: "月嫂进阶班", consultant: "张顾问", enrollDate: "2025-01-22", price: 3800, status: "completed" },
  { id: "C005", studentName: "赵红梅", courseName: "育婴师提升班", consultant: "李顾问", enrollDate: "2025-01-21", price: 5500, status: "active" },
]

// ==================== 总科目表数据 ====================
const totalCoursesData = [
  { id: "TC001", courseName: "高级月嫂护理", category: "月嫂", studentCount: 28, completedCount: 18, price: 6800, status: "active" },
  { id: "TC002", courseName: "月嫂进阶班", category: "月嫂", studentCount: 22, completedCount: 15, price: 3800, status: "active" },
  { id: "TC003", courseName: "育婴师基础班", category: "育婴师", studentCount: 35, completedCount: 25, price: 4800, status: "active" },
  { id: "TC004", courseName: "育婴师提升班", category: "育婴师", studentCount: 18, completedCount: 12, price: 5500, status: "active" },
  { id: "TC005", courseName: "产康理论课程", category: "产康", studentCount: 15, completedCount: 8, price: 5200, status: "active" },
  { id: "TC006", courseName: "产康实操班", category: "产康", studentCount: 12, completedCount: 6, price: 6500, status: "active" },
]

// ==================== 员工日志提报表数据 ====================
const dailyLogsData = [
  { id: "L001", employee: "李顾问", date: "2025-01-25", callCount: 25, visitCount: 3, signCount: 1, followupCount: 8, remark: "完成3个客户跟进" },
  { id: "L002", employee: "王顾问", date: "2025-01-25", callCount: 22, visitCount: 2, signCount: 0, followupCount: 6, remark: "2个意向客户待跟进" },
  { id: "L003", employee: "张顾问", date: "2025-01-25", callCount: 18, visitCount: 1, signCount: 1, followupCount: 5, remark: "签约1个月嫂学员" },
  { id: "L004", employee: "李顾问", date: "2025-01-24", callCount: 28, visitCount: 4, signCount: 2, followupCount: 10, remark: "业绩突出" },
  { id: "L005", employee: "王顾问", date: "2025-01-24", callCount: 20, visitCount: 2, signCount: 1, followupCount: 7, remark: "正常跟进" },
]

// ==================== 家政人员数据 ====================
const staffListData = [
  { id: "N001", name: "李春华", type: "月嫂", level: "金牌", status: "上户中", currentClient: "张女士", startDate: "2025-01-10", endDate: "2025-02-10", rating: 4.9 },
  { id: "N002", name: "王秀兰", type: "育婴师", level: "高级", status: "空档", currentClient: "-", startDate: "-", endDate: "-", rating: 4.8 },
  { id: "N003", name: "张美玲", type: "月嫂", level: "金牌", status: "上户中", currentClient: "王女士", startDate: "2025-01-15", endDate: "2025-02-15", rating: 4.9 },
  { id: "N004", name: "陈桂芳", type: "月嫂", level: "特级", status: "空档", currentClient: "-", startDate: "-", endDate: "-", rating: 5.0 },
  { id: "N005", name: "赵丽娜", type: "产康技师", level: "高级", status: "上户中", currentClient: "刘女士", startDate: "2025-01-20", endDate: "2025-02-20", rating: 4.8 },
]

// ==================== 空档期月嫂数据（1/2/3月内，空档超过7天） ====================
const nannyGapData = [
  { id: "NG001", name: "王秀兰", type: "月嫂", level: "高级", gapDays: 8, availableDate: "2025-01-28", lastClient: "刘女士", lastEndDate: "2025-01-20", rating: 4.8, monthRange: 1 },
  { id: "NG002", name: "陈桂芳", type: "月嫂", level: "特级", gapDays: 15, availableDate: "2025-02-08", lastClient: "赵女士", lastEndDate: "2025-01-24", rating: 5.0, monthRange: 1 },
  { id: "NG003", name: "周美华", type: "月嫂", level: "金牌", gapDays: 22, availableDate: "2025-02-20", lastClient: "孙女士", lastEndDate: "2025-01-29", rating: 4.7, monthRange: 2 },
  { id: "NG004", name: "吴秀珍", type: "月嫂", level: "高级", gapDays: 35, availableDate: "2025-03-05", lastClient: "李女士", lastEndDate: "2025-01-29", rating: 4.6, monthRange: 2 },
  { id: "NG005", name: "郑桂英", type: "月嫂", level: "金牌", gapDays: 45, availableDate: "2025-03-15", lastClient: "王女士", lastEndDate: "2025-01-29", rating: 4.8, monthRange: 3 },
]

// ==================== 空档期育婴师数据（1月内） ====================
const infantGapData = [
  { id: "IG001", name: "林小红", type: "育婴师", level: "高级", gapDays: 5, availableDate: "2025-01-30", lastClient: "陈女士", lastEndDate: "2025-01-25", rating: 4.7 },
  { id: "IG002", name: "何美丽", type: "育婴师", level: "中级", gapDays: 8, availableDate: "2025-02-02", lastClient: "张女士", lastEndDate: "2025-01-25", rating: 4.5 },
  { id: "IG003", name: "黄秀芳", type: "育婴师", level: "高级", gapDays: 12, availableDate: "2025-02-06", lastClient: "刘女士", lastEndDate: "2025-01-25", rating: 4.8 },
]

// ==================== 电话呼出统计数据 ====================
const callStatsData = [
  { id: "CS001", employee: "李顾问", date: "2025-01-25", callCount: 25, totalDuration: 128, avgDuration: 5.1, connectedCount: 22, connectedRate: 88 },
  { id: "CS002", employee: "王顾问", date: "2025-01-25", callCount: 22, totalDuration: 98, avgDuration: 4.5, connectedCount: 18, connectedRate: 82 },
  { id: "CS003", employee: "张顾问", date: "2025-01-25", callCount: 18, totalDuration: 85, avgDuration: 4.7, connectedCount: 15, connectedRate: 83 },
  { id: "CS004", employee: "李顾问", date: "2025-01-24", callCount: 28, totalDuration: 145, avgDuration: 5.2, connectedCount: 25, connectedRate: 89 },
  { id: "CS005", employee: "王顾问", date: "2025-01-24", callCount: 20, totalDuration: 92, avgDuration: 4.6, connectedCount: 17, connectedRate: 85 },
]

// ==================== 各渠道转化率数据 ====================
const channelConversionData = [
  { id: "CC001", channel: "转介绍", leads: 45, conversions: 18, rate: 40.0, revenue: 156800, avgOrderValue: 8711 },
  { id: "CC002", channel: "自拓", leads: 68, conversions: 22, rate: 32.4, revenue: 186500, avgOrderValue: 8477 },
  { id: "CC003", channel: "线上（抖音）", leads: 120, conversions: 28, rate: 23.3, revenue: 225600, avgOrderValue: 8057 },
  { id: "CC004", channel: "线上（小红书）", leads: 85, conversions: 18, rate: 21.2, revenue: 142800, avgOrderValue: 7933 },
  { id: "CC005", channel: "线下活动", leads: 35, conversions: 8, rate: 22.9, revenue: 68500, avgOrderValue: 8563 },
]

// ==================== 订单分析表数据（完整字段） ====================
const orderAnalysisData = [
  { 
    id: "ORD202501001", 
    orderName: "金牌月嫂26天服务", 
    paymentTime: "2025-01-10 15:00",
    serviceType: "月嫂服务",
    paidAmount: 18800,
    commission: 1880,
    paymentType: "全款",
    notes: "客户要求提前上户",
    customerName: "刘女士",
    tags: ["高意向", "二胎"],
    consultant: "张顾问",
    customerProgress: "服务中",
    customerCreatedAt: "2025-01-08",
    phone: "138****5678",
    orderStatus: "active",
    productName: "金牌月嫂26天",
    ownerEmployee: "张顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "张顾问",
    updatedAt: "2025-01-15 09:00",
    createdAt: "2025-01-10 14:30",
    productCategory: "月嫂服务",
    productSpecs: "金牌26天"
  },
  { 
    id: "ORD202501002", 
    orderName: "产康套餐8次", 
    paymentTime: "2025-01-18 10:00",
    serviceType: "产康服务",
    paidAmount: 1900,
    commission: 380,
    paymentType: "定金",
    notes: "",
    customerName: "陈先生",
    tags: ["价格敏感"],
    consultant: "李顾问",
    customerProgress: "待服务",
    customerCreatedAt: "2025-01-17",
    phone: "139****1234",
    orderStatus: "pending",
    productName: "产康套餐8次",
    ownerEmployee: "李顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "李顾问",
    updatedAt: "2025-01-18 10:00",
    createdAt: "2025-01-18 09:15",
    productCategory: "产康服务",
    productSpecs: "套餐8次"
  },
  { 
    id: "ORD202501003", 
    orderName: "育婴师月度服务", 
    paymentTime: "2024-11-25 17:00",
    serviceType: "育婴服务",
    paidAmount: 7600,
    commission: 760,
    paymentType: "全款",
    notes: "客户非常满意，已申请续单",
    customerName: "王女士",
    tags: ["转介绍", "老客户"],
    consultant: "王顾问",
    customerProgress: "已完成",
    customerCreatedAt: "2024-10-15",
    phone: "137****9876",
    orderStatus: "completed",
    productName: "育婴师月度",
    ownerEmployee: "王顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "王顾问",
    updatedAt: "2025-01-02 10:00",
    createdAt: "2024-11-25 16:45",
    productCategory: "育婴服务",
    productSpecs: "月度服务"
  },
  { 
    id: "ORD202501004", 
    orderName: "金牌月嫂42天服务", 
    paymentTime: "2024-12-20 12:00",
    serviceType: "月嫂服务",
    paidAmount: 32000,
    commission: 3200,
    paymentType: "全款",
    notes: "VIP客户，需特别关注",
    customerName: "赵女士",
    tags: ["VIP", "高消费"],
    consultant: "张顾问",
    customerProgress: "服务中",
    customerCreatedAt: "2024-12-18",
    phone: "136****5432",
    orderStatus: "active",
    productName: "金牌月嫂42天",
    ownerEmployee: "张顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "张顾问",
    updatedAt: "2025-01-01 08:00",
    createdAt: "2024-12-20 11:20",
    productCategory: "月嫂服务",
    productSpecs: "金牌42天"
  },
  { 
    id: "ORD202501005", 
    orderName: "高级月嫂26天服务", 
    paymentTime: "",
    serviceType: "月嫂服务",
    paidAmount: 0,
    commission: 0,
    paymentType: "全款",
    notes: "客户取消，原因：计划变更",
    customerName: "孙女士",
    tags: ["线上"],
    consultant: "李顾问",
    customerProgress: "已取消",
    customerCreatedAt: "2025-01-04",
    phone: "135****7890",
    orderStatus: "cancelled",
    productName: "高级月嫂26天",
    ownerEmployee: "李顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "李顾问",
    updatedAt: "2025-01-08 16:00",
    createdAt: "2025-01-05 10:30",
    productCategory: "月嫂服务",
    productSpecs: "高级26天"
  },
  { 
    id: "ORD202501006", 
    orderName: "育婴师月度服务", 
    paymentTime: "2025-01-05 16:00",
    serviceType: "育婴服务",
    paidAmount: 7600,
    commission: 760,
    paymentType: "全款",
    notes: "",
    customerName: "周先生",
    tags: ["转介绍"],
    consultant: "张顾问",
    customerProgress: "服务中",
    customerCreatedAt: "2025-01-03",
    phone: "158****2345",
    orderStatus: "active",
    productName: "育婴师月度",
    ownerEmployee: "张顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "张顾问",
    updatedAt: "2025-01-10 08:00",
    createdAt: "2025-01-05 15:20",
    productCategory: "育婴服务",
    productSpecs: "月度服务"
  },
  { 
    id: "ORD202501007", 
    orderName: "产康套餐12次", 
    paymentTime: "2025-01-03 11:00",
    serviceType: "产康服务",
    paidAmount: 5200,
    commission: 520,
    paymentType: "全款",
    notes: "",
    customerName: "吴女士",
    tags: ["线上"],
    consultant: "李顾问",
    customerProgress: "服务中",
    customerCreatedAt: "2025-01-02",
    phone: "186****6789",
    orderStatus: "active",
    productName: "产康套餐12次",
    ownerEmployee: "李顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "李顾问",
    updatedAt: "2025-01-08 09:00",
    createdAt: "2025-01-03 10:00",
    productCategory: "产康服务",
    productSpecs: "套餐12次"
  },
  { 
    id: "ORD202501008", 
    orderName: "高级月嫂26天服务", 
    paymentTime: "2025-01-16 15:00",
    serviceType: "月嫂服务",
    paidAmount: 5000,
    commission: 1500,
    paymentType: "定金",
    notes: "预产期2月初",
    customerName: "郑女士",
    tags: ["线上", "待跟进"],
    consultant: "王顾问",
    customerProgress: "待服务",
    customerCreatedAt: "2025-01-15",
    phone: "139****0123",
    orderStatus: "pending",
    productName: "高级月嫂26天",
    ownerEmployee: "王顾问",
    ownerDepartment: "居家服务事业部",
    createdBy: "王顾问",
    updatedAt: "2025-01-16 15:00",
    createdAt: "2025-01-16 14:00",
    productCategory: "月嫂服务",
    productSpecs: "高级26天"
  },
]

// ==================== 个人渠道转化数据 ====================
const personalChannelData = [
  { id: "PC001", employee: "李顾问", referralLeads: 15, referralConversions: 6, selfLeads: 22, selfConversions: 8, onlineLeads: 35, onlineConversions: 10, offlineLeads: 8, offlineConversions: 2 },
  { id: "PC002", employee: "王顾问", referralLeads: 12, referralConversions: 5, selfLeads: 18, selfConversions: 6, onlineLeads: 28, onlineConversions: 7, offlineLeads: 6, offlineConversions: 1 },
  { id: "PC003", employee: "张顾问", referralLeads: 8, referralConversions: 3, selfLeads: 15, selfConversions: 4, onlineLeads: 22, onlineConversions: 5, offlineLeads: 5, offlineConversions: 1 },
]

// ==================== 客户活跃度监控数据 ====================
const customerActivityData = [
  { id: "CA001", customerName: "张先生", consultant: "李顾问", lastContact: "2025-01-25", daysSinceContact: 0, contactCount: 5, status: "active", intent: "高" },
  { id: "CA002", customerName: "王女士", consultant: "李顾问", lastContact: "2025-01-23", daysSinceContact: 2, contactCount: 3, status: "active", intent: "中" },
  { id: "CA003", customerName: "刘先生", consultant: "王顾问", lastContact: "2025-01-20", daysSinceContact: 5, contactCount: 2, status: "warning", intent: "中" },
  { id: "CA004", customerName: "陈女士", consultant: "张顾问", lastContact: "2025-01-15", daysSinceContact: 10, contactCount: 1, status: "alert", intent: "高" },
  { id: "CA005", customerName: "赵先生", consultant: "王顾问", lastContact: "2025-01-10", daysSinceContact: 15, contactCount: 4, status: "alert", intent: "低" },
]

// ==================== 母婴顾问-新签佣金及单量数据 ====================
const newSignCommissionData = [
  { id: "NSC001", consultant: "陈主管", date: "2025-01-25", clientName: "张女士", serviceType: "月嫂服务", orderAmount: 28800, commission: 2880, staffName: "李春华" },
  { id: "NSC002", consultant: "周顾问", date: "2025-01-24", clientName: "王女士", serviceType: "育婴服务", orderAmount: 18000, commission: 1800, staffName: "王秀兰" },
  { id: "NSC003", consultant: "陈主管", date: "2025-01-23", clientName: "刘女士", serviceType: "月嫂服务", orderAmount: 32000, commission: 3200, staffName: "张美玲" },
  { id: "NSC004", consultant: "吴顾问", date: "2025-01-22", clientName: "陈女士", serviceType: "产康服务", orderAmount: 9600, commission: 960, staffName: "赵丽娜" },
  { id: "NSC005", consultant: "周顾问", date: "2025-01-21", clientName: "赵女士", serviceType: "月嫂服务", orderAmount: 26000, commission: 2600, staffName: "陈桂芳" },
]

// ==================== 母婴顾问-下户佣金及单量数据 ====================
const serviceCommissionData = [
  { id: "SC001", consultant: "陈主管", date: "2025-01-25", clientName: "李女士", serviceType: "月嫂服务", orderAmount: 28800, commission: 1440, staffName: "周美华", serviceDays: 30 },
  { id: "SC002", consultant: "周顾问", date: "2025-01-20", clientName: "孙女士", serviceType: "育婴服务", orderAmount: 15000, commission: 750, staffName: "林小红", serviceDays: 28 },
  { id: "SC003", consultant: "陈主管", date: "2025-01-15", clientName: "钱女士", serviceType: "月嫂服务", orderAmount: 32000, commission: 1600, staffName: "吴秀珍", serviceDays: 42 },
]

// ==================== 当月在户人数数据 ====================
const activeStaffData = [
  { id: "AS001", name: "李春华", type: "月嫂", level: "金牌", client: "张女士", startDate: "2025-01-10", endDate: "2025-02-10", consultant: "陈主管" },
  { id: "AS002", name: "张美玲", type: "月嫂", level: "金牌", client: "王女士", startDate: "2025-01-15", endDate: "2025-02-15", consultant: "陈主管" },
  { id: "AS003", name: "王秀兰", type: "育婴师", level: "高级", client: "刘女士", startDate: "2025-01-18", endDate: "2025-02-18", consultant: "周顾问" },
  { id: "AS004", name: "林小红", type: "育婴师", level: "高级", client: "陈女士", startDate: "2025-01-20", endDate: "2025-02-20", consultant: "吴顾问" },
  { id: "AS005", name: "赵丽娜", type: "产康技师", level: "高级", client: "赵女士", startDate: "2025-01-22", endDate: "2025-02-22", consultant: "陈主管" },
]

// ==================== 产康转化率数据 ====================
const postpartumConversionData = [
  { id: "PPC001", consultant: "陈主管", newSignClients: 12, postpartumConversions: 5, newSignRate: 41.7, serviceClients: 8, serviceConversions: 4, serviceRate: 50.0 },
  { id: "PPC002", consultant: "周顾问", newSignClients: 8, postpartumConversions: 3, newSignRate: 37.5, serviceClients: 6, serviceConversions: 2, serviceRate: 33.3 },
  { id: "PPC003", consultant: "吴顾问", newSignClients: 6, postpartumConversions: 2, newSignRate: 33.3, serviceClients: 4, serviceConversions: 1, serviceRate: 25.0 },
]

// ==================== 产康看板数据 ====================
const postpartumServiceData = [
  { id: "PS001", technician: "赵丽娜", date: "2025-01-25", client: "张女士", project: "产后修复", sessions: 2, cardUsed: 2, amount: 1200 },
  { id: "PS002", technician: "赵丽娜", date: "2025-01-24", client: "王女士", project: "盆底修复", sessions: 1, cardUsed: 1, amount: 800 },
  { id: "PS003", technician: "孙技师", date: "2025-01-25", client: "刘女士", project: "产后修复", sessions: 2, cardUsed: 2, amount: 1200 },
  { id: "PS004", technician: "孙技师", date: "2025-01-23", client: "陈女士", project: "腹直肌修复", sessions: 1, cardUsed: 1, amount: 600 },
]

export default function OperationsDashboardPage() {
  const [activeTab, setActiveTab] = useState("career")
  const [roleView, setRoleView] = useState("personal") // personal | manager | analyst
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-01-25")
  const [searchTerm, setSearchTerm] = useState("")

  // 导出Excel功能
  const handleExport = (tableName: string) => {
    alert(`正在导出 ${tableName} 数据为Excel文件...`)
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">数据看板</h1>
            <p className="text-sm text-muted-foreground">运营数据统计与分析 - 部门经理只看本部门，总经理可视全部</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={roleView} onValueChange={setRoleView}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">个人视图</SelectItem>
                <SelectItem value="manager">部长视图</SelectItem>
                <SelectItem value="analyst">数据专员</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  {startDate} 至 {endDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">开始日期</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">结束日期</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent" onClick={() => { setStartDate("2025-01-25"); setEndDate("2025-01-25"); }}>今日</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent" onClick={() => { setStartDate("2025-01-20"); setEndDate("2025-01-25"); }}>本周</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent" onClick={() => { setStartDate("2025-01-01"); setEndDate("2025-01-25"); }}>本月</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-9">
            <TabsTrigger value="career" className="gap-1.5 text-xs">
              <Briefcase className="h-3.5 w-3.5" />
              职业顾问看板
            </TabsTrigger>
            <TabsTrigger value="maternity" className="gap-1.5 text-xs">
              <Baby className="h-3.5 w-3.5" />
              母婴顾问看板
            </TabsTrigger>
            <TabsTrigger value="postpartum" className="gap-1.5 text-xs">
              <Activity className="h-3.5 w-3.5" />
              产康看板
            </TabsTrigger>
          </TabsList>

          {/* ==================== 职业顾问看板 ==================== */}
          <TabsContent value="career" className="mt-4 space-y-4">
            {/* 个人视图 */}
            {roleView === "personal" && (
              <CareerPersonalView 
                startDate={startDate} 
                endDate={endDate} 
                onExport={handleExport}
              />
            )}

            {/* 部长视图 */}
            {roleView === "manager" && (
              <CareerManagerView 
                startDate={startDate} 
                endDate={endDate} 
                onExport={handleExport}
              />
            )}

            {/* 数据专员视图 */}
            {roleView === "analyst" && (
              <CareerAnalystView 
                startDate={startDate} 
                endDate={endDate} 
                onExport={handleExport}
              />
            )}
          </TabsContent>

          {/* ==================== 母婴顾问看板 ==================== */}
          <TabsContent value="maternity" className="mt-4 space-y-4">
            {/* 母婴顾问视图 */}
            {(roleView === "personal" || roleView === "manager") && (
              <MaternityConsultantView 
                startDate={startDate} 
                endDate={endDate} 
                onExport={handleExport}
                isManager={roleView === "manager"}
              />
            )}

            {/* 数据专员视图 */}
            {roleView === "analyst" && (
              <MaternityAnalystView 
                startDate={startDate} 
                endDate={endDate} 
                onExport={handleExport}
              />
            )}
          </TabsContent>

          {/* ==================== 产康看板 ==================== */}
          <TabsContent value="postpartum" className="mt-4 space-y-4">
            <PostpartumView 
              startDate={startDate} 
              endDate={endDate} 
              onExport={handleExport}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

// ==================== 职业顾问 - 个人视图 ====================
function CareerPersonalView({ startDate, endDate, onExport }: { startDate: string; endDate: string; onExport: (name: string) => void }) {
  // 表格导航定义
  const careerPersonalTables = [
    { id: "career-new-students", name: "新增学员", icon: <UserPlus className="h-3 w-3" /> },
    { id: "career-new-courses", name: "新增科目", icon: <GraduationCap className="h-3 w-3" /> },
    { id: "career-total-courses", name: "总科目", icon: <FileText className="h-3 w-3" /> },
    { id: "career-staff-list", name: "家政人员", icon: <Users className="h-3 w-3" /> },
    { id: "career-channel-rate", name: "渠道转化率", icon: <Target className="h-3 w-3" /> },
    { id: "career-commission-rate", name: "佣金目标完成率", icon: <DollarSign className="h-3 w-3" /> },
    { id: "career-referral", name: "自拓/转介绍", icon: <Share2 className="h-3 w-3" /> },
    { id: "career-nanny-gap", name: "空档期月嫂", icon: <CalendarDays className="h-3 w-3" /> },
    { id: "career-infant-gap", name: "空档期育婴师", icon: <CalendarDays className="h-3 w-3" /> },
    { id: "career-call-stats", name: "电话呼出", icon: <PhoneCall className="h-3 w-3" /> },
  ]

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-4">
      {/* 快速导航 */}
      <TableNavigation tables={careerPersonalTables} onNavigate={handleNavigate} />

      {/* 新增学员表 */}
      <DataTable
        id="career-new-students"
        title="新增学员"
        icon={<UserPlus className="h-4 w-4 text-blue-500" />}
        count={newStudentsData.length}
        onExport={() => onExport("新增学员")}
        clickable
        onRowClick={(index) => alert(`查看学员详情: ${newStudentsData[index].name}`)}
        columns={["学员姓名", "联系电话", "报名课程", "跟进顾问", "签约日期", "状态", "来源渠道"]}
        data={newStudentsData.map(s => [
          <span key={s.id} className="text-blue-600 cursor-pointer hover:underline">{s.name}</span>,
          s.phone,
          s.course,
          s.consultant,
          s.signDate,
          <Badge key={`${s.id}-badge`} variant="outline" className={`text-[10px] ${s.status === "studying" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
            {s.status === "studying" ? "在读" : "已毕业"}
          </Badge>,
          s.source
        ])}
      />

      {/* 新增科目表 */}
      <DataTable
        id="career-new-courses"
        title="新增科目"
        icon={<GraduationCap className="h-4 w-4 text-purple-500" />}
        count={newCoursesData.length}
        onExport={() => onExport("新增科目")}
        clickable
        onRowClick={(index) => alert(`查看科目详情: ${newCoursesData[index].courseName}`)}
        columns={["学员姓名", "科目名称", "跟进顾问", "报名日期", "价格", "状态"]}
        data={newCoursesData.map(c => [
          c.studentName,
          <span key={c.id} className="text-purple-600 cursor-pointer hover:underline">{c.courseName}</span>,
          c.consultant,
          c.enrollDate,
          `¥${c.price.toLocaleString()}`,
          <Badge key={`${c.id}-badge`} variant="outline" className={`text-[10px] ${c.status === "active" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
            {c.status === "active" ? "进行中" : "已完成"}
          </Badge>
        ])}
      />

      {/* 总科目表 */}
      <DataTable
        id="career-total-courses"
        title="总科目（班级课程）"
        icon={<FileText className="h-4 w-4 text-emerald-500" />}
        count={totalCoursesData.length}
        onExport={() => onExport("总科目")}
        columns={["科目名称", "分类", "学员总数", "已结业", "价格", "状态"]}
        data={totalCoursesData.map(c => [
          c.courseName,
          c.category,
          <span key={c.id} className="text-blue-600 cursor-pointer hover:underline">{c.studentCount}</span>,
          c.completedCount,
          `¥${c.price.toLocaleString()}`,
          <Badge key={`${c.id}-badge`} variant="outline" className="text-[10px] bg-green-50 text-green-700">
            {c.status === "active" ? "开课中" : "已结束"}
          </Badge>
        ])}
      />

      {/* 家政人总数 */}
      <DataTable
        id="career-staff-list"
        title="家政人员列表"
        icon={<Users className="h-4 w-4 text-rose-500" />}
        count={staffListData.length}
        onExport={() => onExport("家政人员")}
        columns={["姓名", "类型", "等级", "状态", "当前客户", "服务开始", "服务结束", "评分"]}
        data={staffListData.map(s => [
          s.name,
          s.type,
          <Badge key={s.id} variant="outline" className="text-[10px]">{s.level}</Badge>,
          <Badge key={`${s.id}-status`} variant="outline" className={`text-[10px] ${s.status === "上户中" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {s.status}
          </Badge>,
          s.currentClient,
          s.startDate,
          s.endDate,
          <div key={`${s.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{s.rating}</div>
        ])}
      />

      {/* 各渠道转化率 */}
      <DataTable
        id="career-channel-rate"
        title="各渠道转化率"
        icon={<Target className="h-4 w-4 text-indigo-500" />}
        count={channelConversionData.length}
        onExport={() => onExport("渠道转化率")}
        columns={["渠道", "线索数", "成交数", "转化率", "成交金额", "平均客单价"]}
        data={channelConversionData.map(c => [
          c.channel,
          c.leads,
          c.conversions,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.rate >= 30 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {c.rate}%
          </Badge>,
          `¥${c.revenue.toLocaleString()}`,
          `¥${c.avgOrderValue.toLocaleString()}`
        ])}
      />

      {/* 佣金目标完成率 */}
      <Card id="career-commission-rate">
        <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            佣金目标完成率
          </CardTitle>
          <div className="flex items-center gap-2">
            <DateRangePicker 
              startDate="2025-01-01" 
              endDate="2025-01-25"
              onStartChange={() => {}}
              onEndChange={() => {}}
            />
            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("佣金目标完成率")}>
              <Download className="h-3 w-3 mr-1" />导出
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">月度佣金目标</span>
              <span className="font-bold">¥50,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">已完成佣金</span>
              <span className="font-bold text-emerald-600">¥39,000</span>
            </div>
            <Progress value={78} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">完成率</span>
              <Badge className="bg-emerald-100 text-emerald-700">78%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自拓/转介绍数量 */}
      <DataTable
        id="career-referral"
        title="自拓/转介绍数量"
        icon={<Share2 className="h-4 w-4 text-amber-500" />}
        count={personalChannelData.length}
        onExport={() => onExport("自拓转介绍")}
        columns={["员工", "转介绍线索", "转介绍成交", "自拓线索", "自拓成交", "转介绍转化率", "自拓转化率"]}
        data={personalChannelData.map(p => [
          p.employee,
          p.referralLeads,
          p.referralConversions,
          p.selfLeads,
          p.selfConversions,
          <Badge key={p.id} variant="outline" className="text-[10px] bg-amber-50 text-amber-700">
            {((p.referralConversions / p.referralLeads) * 100).toFixed(1)}%
          </Badge>,
          <Badge key={`${p.id}-self`} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
            {((p.selfConversions / p.selfLeads) * 100).toFixed(1)}%
          </Badge>
        ])}
      />

      {/* 空档期月嫂展示（1/2/3月内，空档超过7天） */}
      <DataTable
        id="career-nanny-gap"
        title="空档期月嫂展示（今日之后1/2/3月内，空档超7天）"
        icon={<CalendarDays className="h-4 w-4 text-orange-500" />}
        count={nannyGapData.length}
        badge={<Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">需关注</Badge>}
        onExport={() => onExport("空档期月嫂")}
        columns={["姓名", "类型", "等级", "空档天数", "可接单日期", "上一客户", "上单结束", "评分", "月份范围"]}
        data={nannyGapData.map(n => [
          n.name,
          n.type,
          <Badge key={n.id} variant="outline" className="text-[10px]">{n.level}</Badge>,
          <Badge key={`${n.id}-gap`} className={`text-[10px] ${n.gapDays > 14 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
            {n.gapDays}天
          </Badge>,
          n.availableDate,
          n.lastClient,
          n.lastEndDate,
          <div key={`${n.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{n.rating}</div>,
          `${n.monthRange}月内`
        ])}
      />

      {/* 空档期育婴师展示（1月内） */}
      <DataTable
        id="career-infant-gap"
        title="空档期育婴师展示（今日之后1月内）"
        icon={<CalendarDays className="h-4 w-4 text-blue-500" />}
        count={infantGapData.length}
        onExport={() => onExport("空档期育婴师")}
        columns={["姓名", "类型", "等级", "空档天数", "可接单日期", "上一客户", "上单结束", "评分"]}
        data={infantGapData.map(i => [
          i.name,
          i.type,
          <Badge key={i.id} variant="outline" className="text-[10px]">{i.level}</Badge>,
          <Badge key={`${i.id}-gap`} className="text-[10px] bg-amber-100 text-amber-700">{i.gapDays}天</Badge>,
          i.availableDate,
          i.lastClient,
          i.lastEndDate,
          <div key={`${i.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{i.rating}</div>
        ])}
      />

      {/* 电话呼出量及时长 */}
      <DataTable
        id="career-call-stats"
        title="电话呼出量及时长"
        icon={<PhoneCall className="h-4 w-4 text-teal-500" />}
        count={callStatsData.length}
        onExport={() => onExport("电话呼出统计")}
        columns={["员工", "日期", "呼出次数", "总时长(分钟)", "平均时长", "接通数", "接通率"]}
        data={callStatsData.map(c => [
          c.employee,
          c.date,
          c.callCount,
          c.totalDuration,
          `${c.avgDuration}分钟`,
          c.connectedCount,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.connectedRate >= 85 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {c.connectedRate}%
          </Badge>
        ])}
      />
    </div>
  )
}

// ==================== 职业顾问 - 部长视图（个人+团队） ====================
function CareerManagerView({ startDate, endDate, onExport }: { startDate: string; endDate: string; onExport: (name: string) => void }) {
  return (
    <div className="space-y-4">
      {/* 统计概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard title="新增学员" value="58" subValue="团队" icon={<UserPlus className="h-3.5 w-3.5 text-blue-600" />} bgColor="bg-blue-100" />
        <StatCard title="新增科目" value="35" subValue="团队" icon={<GraduationCap className="h-3.5 w-3.5 text-purple-600" />} bgColor="bg-purple-100" />
        <StatCard title="总科目" value="186" subValue="团队" icon={<FileText className="h-3.5 w-3.5 text-emerald-600" />} bgColor="bg-emerald-100" />
        <StatCard title="正在上户中" value="45" subValue="团队" icon={<Home className="h-3.5 w-3.5 text-amber-600" />} bgColor="bg-amber-100" />
        <StatCard title="月/季度下户" value="24/72" subValue="团队" icon={<CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />} bgColor="bg-cyan-100" />
        <StatCard title="佣金目标完成" value="78%" subValue="团队" icon={<Target className="h-3.5 w-3.5 text-rose-600" />} bgColor="bg-rose-100" />
      </div>

      {/* 所有个人视图的表格 */}
      <CareerPersonalView startDate={startDate} endDate={endDate} onExport={onExport} />

      {/* 日志提报表 */}
      <DataTable
        title="员工日志提报"
        icon={<FileText className="h-4 w-4 text-slate-500" />}
        count={dailyLogsData.length}
        onExport={() => onExport("员工日志提报")}
        columns={["员工", "日期", "电话量", "拜访量", "签约量", "跟进量", "备注"]}
        data={dailyLogsData.map(l => [
          l.employee,
          l.date,
          l.callCount,
          l.visitCount,
          l.signCount,
          l.followupCount,
          l.remark
        ])}
      />
    </div>
  )
}

// ==================== 职业顾问 - 数据专员视图 ====================
function CareerAnalystView({ startDate, endDate, onExport }: { startDate: string; endDate: string; onExport: (name: string) => void }) {
  // 表格导航定义
  const analystTables = [
    { id: "analyst-new-students", name: "新增学员", icon: <UserPlus className="h-3 w-3" /> },
    { id: "analyst-new-courses", name: "新增科目", icon: <GraduationCap className="h-3 w-3" /> },
    { id: "analyst-total-courses", name: "总科目", icon: <FileText className="h-3 w-3" /> },
    { id: "analyst-daily-logs", name: "员工日志", icon: <FileText className="h-3 w-3" /> },
    { id: "analyst-performance", name: "业绩分析", icon: <BarChart3 className="h-3 w-3" /> },
    { id: "analyst-orders", name: "订单分析", icon: <TrendingUp className="h-3 w-3" /> },
    { id: "analyst-customer", name: "客户数量", icon: <Users className="h-3 w-3" /> },
    { id: "analyst-activity", name: "客户活跃度", icon: <AlertTriangle className="h-3 w-3" /> },
    { id: "analyst-channel", name: "渠道转化", icon: <Target className="h-3 w-3" /> },
    { id: "analyst-personal", name: "个人渠道", icon: <Share2 className="h-3 w-3" /> },
    { id: "analyst-annual", name: "年度任务", icon: <Target className="h-3 w-3" /> },
    { id: "analyst-referral", name: "入库趋势", icon: <TrendingUp className="h-3 w-3" /> },
  ]

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-4">
      {/* 快速导航 */}
      <TableNavigation tables={analystTables} onNavigate={handleNavigate} />

      {/* 新增学员表 */}
      <DataTable
        id="analyst-new-students"
        title="新增学员表"
        icon={<UserPlus className="h-4 w-4 text-blue-500" />}
        count={newStudentsData.length}
        onExport={() => onExport("新增学员表")}
        clickable
        onRowClick={(index) => alert(`查看学员详情: ${newStudentsData[index].name}`)}
        columns={["学员姓名", "联系电话", "报名课程", "跟进顾问", "签约日期", "状态", "来源渠道"]}
        data={newStudentsData.map(s => [
          <span key={s.id} className="text-blue-600 cursor-pointer hover:underline">{s.name}</span>,
          s.phone, s.course, s.consultant, s.signDate,
          <Badge key={`${s.id}-badge`} variant="outline" className={`text-[10px] ${s.status === "studying" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
            {s.status === "studying" ? "在读" : "已毕业"}
          </Badge>,
          s.source
        ])}
      />

      {/* 新增科目表 */}
      <DataTable
        id="analyst-new-courses"
        title="新增科目表"
        icon={<GraduationCap className="h-4 w-4 text-purple-500" />}
        count={newCoursesData.length}
        onExport={() => onExport("新增科目表")}
        clickable
        onRowClick={(index) => alert(`查看科目详情: ${newCoursesData[index].courseName}`)}
        columns={["学员姓名", "科目名称", "跟进顾问", "报名日期", "价格", "状态"]}
        data={newCoursesData.map(c => [
          c.studentName,
          <span key={c.id} className="text-purple-600 cursor-pointer hover:underline">{c.courseName}</span>,
          c.consultant, c.enrollDate, `¥${c.price.toLocaleString()}`,
          <Badge key={`${c.id}-badge`} variant="outline" className={`text-[10px] ${c.status === "active" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
            {c.status === "active" ? "进行中" : "已完成"}
          </Badge>
        ])}
      />

      {/* 总科目表 */}
      <DataTable
        id="analyst-total-courses"
        title="总科目（班级课程）表"
        icon={<FileText className="h-4 w-4 text-emerald-500" />}
        count={totalCoursesData.length}
        onExport={() => onExport("总科目表")}
        columns={["科目名称", "分类", "学员总数", "已结业", "价格", "状态"]}
        data={totalCoursesData.map(c => [
          c.courseName, c.category, c.studentCount, c.completedCount, `¥${c.price.toLocaleString()}`,
          <Badge key={c.id} variant="outline" className="text-[10px] bg-green-50 text-green-700">{c.status === "active" ? "开课中" : "已结束"}</Badge>
        ])}
      />

      {/* 员工日志提报表 */}
      <DataTable
        id="analyst-daily-logs"
        title="员工日志提报表"
        icon={<FileText className="h-4 w-4 text-slate-500" />}
        count={dailyLogsData.length}
        onExport={() => onExport("员工日志提报表")}
        columns={["员工", "日期", "分配数据量", "通话时长", "接通次数", "微信联系", "面试量", "新签量", "业绩完成", "明日计划"]}
        data={dailyLogsData.map(l => [l.employee, l.date, "12", `${l.callCount * 5}分钟`, l.callCount, l.visitCount, l.signCount, l.followupCount, "¥8,500", l.remark])}
      />

      {/* 业绩分析图表区域 */}
      <div id="analyst-performance">
        <PerformanceAnalysisChart onExport={onExport} />
      </div>

      {/* 订单分析（完整字段表格） */}
      <OrderAnalysisTable
        id="analyst-orders"
        onExport={() => onExport("订单分析")}
      />

      {/* 客户数量分析 */}
      <div id="analyst-customer">
        <CustomerAnalysisChart onExport={onExport} />
      </div>

      {/* 客户活跃度监控 */}
      <DataTable
        id="analyst-activity"
        title="客户活跃度（销售人员联系情况实时监控，预警展示）"
        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        count={customerActivityData.length}
        badge={<Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">{customerActivityData.filter(c => c.status === "alert").length}个预警</Badge>}
        onExport={() => onExport("客户活跃度")}
        columns={["客户姓名", "跟进顾问", "最后联系", "未联系天数", "联系次数", "状态", "意向度"]}
        data={customerActivityData.map(c => [
          c.customerName, c.consultant, c.lastContact, 
          <Badge key={c.id} className={`text-[10px] ${c.daysSinceContact >= 7 ? "bg-red-100 text-red-700" : c.daysSinceContact >= 3 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
            {c.daysSinceContact}天
          </Badge>,
          c.contactCount,
          <Badge key={`${c.id}-status`} variant="outline" className={`text-[10px] ${c.status === "alert" ? "bg-red-50 text-red-700" : c.status === "warning" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
            {c.status === "alert" ? "预警" : c.status === "warning" ? "注意" : "正常"}
          </Badge>,
          c.intent
        ])}
      />

      {/* 各渠道转化情况 */}
      <DataTable
        id="analyst-channel"
        title="各渠道转化情况"
        icon={<Target className="h-4 w-4 text-indigo-500" />}
        count={channelConversionData.length}
        onExport={() => onExport("各渠道转化情况")}
        columns={["渠道", "线索数", "成交数", "转化率", "成交金额", "平均客单价"]}
        data={channelConversionData.map(c => [
          c.channel, c.leads, c.conversions,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.rate >= 30 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{c.rate}%</Badge>,
          `¥${c.revenue.toLocaleString()}`, `¥${c.avgOrderValue.toLocaleString()}`
        ])}
      />

      {/* 个人渠道转化情况 */}
      <DataTable
        id="analyst-personal"
        title="个人渠道转化情况"
        icon={<Share2 className="h-4 w-4 text-pink-500" />}
        count={personalChannelData.length}
        onExport={() => onExport("个人渠道转化情况")}
        columns={["员工", "转介绍线索", "转介绍成交", "自拓线索", "自拓成交", "线上线索", "线上成交", "线下线索", "线下成交"]}
        data={personalChannelData.map(p => [
          p.employee, p.referralLeads, p.referralConversions, p.selfLeads, p.selfConversions, p.onlineLeads, p.onlineConversions, p.offlineLeads, p.offlineConversions
        ])}
      />

      {/* 年度任务完成情况 */}
      <div id="analyst-annual">
        <AnnualTaskChart onExport={onExport} />
      </div>

      {/* 转介绍及自拓数据入库趋势 */}
      <div id="analyst-referral">
        <ReferralTrendChart onExport={onExport} />
      </div>
    </div>
  )
}

// ==================== 母婴顾问视图 ====================
function MaternityConsultantView({ startDate, endDate, onExport, isManager }: { startDate: string; endDate: string; onExport: (name: string) => void; isManager: boolean }) {
  // 表格导航定义
  const maternityTables = [
    { id: "maternity-new-sign", name: "新签佣金", icon: <DollarSign className="h-3 w-3" /> },
    { id: "maternity-service", name: "下户佣金", icon: <Home className="h-3 w-3" /> },
    { id: "maternity-active", name: "当月在户", icon: <Users className="h-3 w-3" /> },
    { id: "maternity-staff", name: "家政人员", icon: <Users className="h-3 w-3" /> },
    { id: "maternity-channel", name: "渠道转化率", icon: <Target className="h-3 w-3" /> },
    { id: "maternity-commission", name: "佣金目标", icon: <DollarSign className="h-3 w-3" /> },
    { id: "maternity-referral", name: "自拓/转介绍", icon: <Share2 className="h-3 w-3" /> },
    { id: "maternity-nanny-gap", name: "空档期月嫂", icon: <CalendarDays className="h-3 w-3" /> },
    { id: "maternity-infant-gap", name: "空档期育婴师", icon: <CalendarDays className="h-3 w-3" /> },
    { id: "maternity-postpartum", name: "产康转化率", icon: <Activity className="h-3 w-3" /> },
    { id: "maternity-call-stats", name: "电话呼出", icon: <PhoneCall className="h-3 w-3" /> },
  ]

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-4">
      {/* 快速导航 */}
      <TableNavigation tables={maternityTables} onNavigate={handleNavigate} />

      {/* 新签佣金及单量表 */}
      <DataTable
        id="maternity-new-sign"
        title="新签佣金及单量"
        icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
        count={newSignCommissionData.length}
        onExport={() => onExport("新签佣金及单量")}
        columns={["顾问", "日期", "客户", "服务类型", "订单金额", "佣金", "服务人员"]}
        data={newSignCommissionData.map(n => [
          n.consultant, n.date, n.clientName, n.serviceType,
          `¥${n.orderAmount.toLocaleString()}`,
          <span key={n.id} className="font-medium text-emerald-600">¥{n.commission.toLocaleString()}</span>,
          n.staffName
        ])}
      />

      {/* 下户佣金及单量表 */}
      <DataTable
        id="maternity-service"
        title="下户佣金及单量"
        icon={<Home className="h-4 w-4 text-blue-500" />}
        count={serviceCommissionData.length}
        onExport={() => onExport("下户佣金及单量")}
        clickable
        onRowClick={(index) => alert(`查看订单详情: ${serviceCommissionData[index].clientName}`)}
        columns={["顾问", "日期", "客户", "服务类型", "订单金额", "佣金", "服务人员", "服务天数"]}
        data={serviceCommissionData.map(s => [
          s.consultant, s.date, 
          <span key={s.id} className="text-blue-600 cursor-pointer hover:underline">{s.clientName}</span>,
          s.serviceType,
          `¥${s.orderAmount.toLocaleString()}`,
          <span key={`${s.id}-commission`} className="font-medium text-blue-600">¥{s.commission.toLocaleString()}</span>,
          s.staffName, `${s.serviceDays}天`
        ])}
      />

      {/* 当月在户人数（母婴、育婴分开） */}
      <DataTable
        id="maternity-active"
        title="当月在户人数（母婴、育婴分开）"
        icon={<Users className="h-4 w-4 text-rose-500" />}
        count={activeStaffData.length}
        badge={
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-[10px] bg-rose-100 text-rose-700">月嫂: {activeStaffData.filter(s => s.type === "月嫂").length}</Badge>
            <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">育婴师: {activeStaffData.filter(s => s.type === "育婴师").length}</Badge>
          </div>
        }
        onExport={() => onExport("当月在户人数")}
        columns={["姓名", "类型", "等级", "客户", "服务开始", "服务结束", "跟进顾问"]}
        data={activeStaffData.map(a => [
          a.name,
          <Badge key={a.id} variant="outline" className={`text-[10px] ${a.type === "月嫂" ? "bg-rose-50 text-rose-700" : a.type === "育婴师" ? "bg-blue-50 text-blue-700" : "bg-teal-50 text-teal-700"}`}>
            {a.type}
          </Badge>,
          a.level, a.client, a.startDate, a.endDate, a.consultant
        ])}
      />

      {/* 家政人总数 */}
      <DataTable
        id="maternity-staff"
        title="家政人员列表"
        icon={<Users className="h-4 w-4 text-purple-500" />}
        count={staffListData.length}
        onExport={() => onExport("家政人员")}
        columns={["姓名", "类型", "等级", "状态", "当前客户", "服务开始", "服务结束", "评分"]}
        data={staffListData.map(s => [
          s.name, s.type,
          <Badge key={s.id} variant="outline" className="text-[10px]">{s.level}</Badge>,
          <Badge key={`${s.id}-status`} variant="outline" className={`text-[10px] ${s.status === "上户中" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{s.status}</Badge>,
          s.currentClient, s.startDate, s.endDate,
          <div key={`${s.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{s.rating}</div>
        ])}
      />

      {/* 各渠道转化率 */}
      <DataTable
        id="maternity-channel"
        title="各渠道转化率"
        icon={<Target className="h-4 w-4 text-indigo-500" />}
        count={channelConversionData.length}
        onExport={() => onExport("渠道转化率")}
        columns={["渠道", "线索数", "成交数", "转化率", "成交金额", "平均客单价"]}
        data={channelConversionData.map(c => [
          c.channel, c.leads, c.conversions,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.rate >= 30 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{c.rate}%</Badge>,
          `¥${c.revenue.toLocaleString()}`, `¥${c.avgOrderValue.toLocaleString()}`
        ])}
      />

      {/* 佣金目标完成率 */}
      <Card id="maternity-commission">
        <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            佣金目标完成率
          </CardTitle>
          <div className="flex items-center gap-2">
            <DateRangePicker 
              startDate="2025-01-01" 
              endDate="2025-01-25"
              onStartChange={() => {}}
              onEndChange={() => {}}
            />
            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("佣金目标完成率")}>
              <Download className="h-3 w-3 mr-1" />导出
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">月度佣金目标</span>
              <span className="font-bold">¥60,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">已完成佣金</span>
              <span className="font-bold text-emerald-600">¥48,500</span>
            </div>
            <Progress value={80.8} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">完成率</span>
              <Badge className="bg-emerald-100 text-emerald-700">80.8%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自拓/转介绍数量 */}
      <DataTable
        id="maternity-referral"
        title="自拓/转介绍数量"
        icon={<Share2 className="h-4 w-4 text-amber-500" />}
        count={personalChannelData.length}
        onExport={() => onExport("自拓转介绍")}
        columns={["员工", "转介绍线索", "转介绍成交", "自拓线索", "自拓成交", "转介绍转化率", "自拓转化率"]}
        data={personalChannelData.map(p => [
          p.employee,
          p.referralLeads,
          p.referralConversions,
          p.selfLeads,
          p.selfConversions,
          <Badge key={p.id} variant="outline" className="text-[10px] bg-amber-50 text-amber-700">
            {((p.referralConversions / p.referralLeads) * 100).toFixed(1)}%
          </Badge>,
          <Badge key={`${p.id}-self`} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
            {((p.selfConversions / p.selfLeads) * 100).toFixed(1)}%
          </Badge>
        ])}
      />

      {/* 空档期月嫂展示 */}
      <DataTable
        id="maternity-nanny-gap"
        title="空档期月嫂展示（今日之后1/2/3月内，空档超7天）"
        icon={<CalendarDays className="h-4 w-4 text-orange-500" />}
        count={nannyGapData.length}
        badge={<Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">需关注</Badge>}
        onExport={() => onExport("空档期月嫂")}
        columns={["姓名", "类型", "等级", "空档天数", "可接单日期", "上一客户", "上单结束", "评分", "月份范围"]}
        data={nannyGapData.map(n => [
          n.name, n.type,
          <Badge key={n.id} variant="outline" className="text-[10px]">{n.level}</Badge>,
          <Badge key={`${n.id}-gap`} className={`text-[10px] ${n.gapDays > 14 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{n.gapDays}天</Badge>,
          n.availableDate, n.lastClient, n.lastEndDate,
          <div key={`${n.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{n.rating}</div>,
          `${n.monthRange}月内`
        ])}
      />

      {/* 空档期育婴师展示 */}
      <DataTable
        id="maternity-infant-gap"
        title="空档期育婴师展示（今日之后1月内）"
        icon={<CalendarDays className="h-4 w-4 text-blue-500" />}
        count={infantGapData.length}
        onExport={() => onExport("空档期育婴师")}
        columns={["姓名", "类型", "等级", "空档天数", "可接单日期", "上一客户", "上单结束", "评分"]}
        data={infantGapData.map(i => [
          i.name, i.type,
          <Badge key={i.id} variant="outline" className="text-[10px]">{i.level}</Badge>,
          <Badge key={`${i.id}-gap`} className="text-[10px] bg-amber-100 text-amber-700">{i.gapDays}天</Badge>,
          i.availableDate, i.lastClient, i.lastEndDate,
          <div key={`${i.id}-rating`} className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{i.rating}</div>
        ])}
      />

      {/* 产康转化率 */}
      <DataTable
        id="maternity-postpartum"
        title="新签/下户雇主产康转化率"
        icon={<Activity className="h-4 w-4 text-teal-500" />}
        count={postpartumConversionData.length}
        onExport={() => onExport("产康转化率")}
        columns={["顾问", "新签客户数", "产康转化", "新签转化率", "下户客户数", "产康转化", "下户转化率"]}
        data={postpartumConversionData.map(p => [
          p.consultant, p.newSignClients, p.postpartumConversions,
          <Badge key={p.id} variant="outline" className="text-[10px] bg-teal-50 text-teal-700">{p.newSignRate}%</Badge>,
          p.serviceClients, p.serviceConversions,
          <Badge key={`${p.id}-service`} variant="outline" className="text-[10px] bg-teal-50 text-teal-700">{p.serviceRate}%</Badge>
        ])}
      />

      {/* 电话呼出量及时长 */}
      <DataTable
        id="maternity-call-stats"
        title="电话呼出量及时长"
        icon={<PhoneCall className="h-4 w-4 text-slate-500" />}
        count={callStatsData.length}
        onExport={() => onExport("电话呼出统计")}
        columns={["员工", "日期", "呼出次数", "总时长(分钟)", "平均时长", "接通数", "接通率"]}
        data={callStatsData.map(c => [
          c.employee, c.date, c.callCount, c.totalDuration, `${c.avgDuration}分钟`, c.connectedCount,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.connectedRate >= 85 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{c.connectedRate}%</Badge>
        ])}
      />
    </div>
  )
}

// ==================== 母婴顾问 - 数据专员视图 ====================
function MaternityAnalystView({ startDate, endDate, onExport }: { startDate: string; endDate: string; onExport: (name: string) => void }) {
  return (
    <div className="space-y-4">
      {/* 新签佣金及单量 */}
      <DataTable
        title="新签佣金及单量"
        icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
        count={newSignCommissionData.length}
        onExport={() => onExport("新签佣金及单量")}
        columns={["顾问", "日期", "客户", "服务类型", "订单金额", "佣金", "服务人员"]}
        data={newSignCommissionData.map(n => [
          n.consultant, n.date, n.clientName, n.serviceType,
          `¥${n.orderAmount.toLocaleString()}`,
          <span key={n.id} className="font-medium text-emerald-600">¥{n.commission.toLocaleString()}</span>,
          n.staffName
        ])}
      />

      {/* 下户佣金及单量 */}
      <DataTable
        title="下户佣金及单量"
        icon={<Home className="h-4 w-4 text-blue-500" />}
        count={serviceCommissionData.length}
        onExport={() => onExport("下户佣金及单量")}
        columns={["顾问", "日期", "客户", "服务类型", "订单金额", "佣金", "服务人员", "服务天数"]}
        data={serviceCommissionData.map(s => [
          s.consultant, s.date, s.clientName, s.serviceType,
          `¥${s.orderAmount.toLocaleString()}`,
          <span key={s.id} className="font-medium text-blue-600">¥{s.commission.toLocaleString()}</span>,
          s.staffName, `${s.serviceDays}天`
        ])}
      />

      {/* 员工日志提报表 */}
      <DataTable
        title="日志提报"
        icon={<FileText className="h-4 w-4 text-slate-500" />}
        count={dailyLogsData.length}
        onExport={() => onExport("日志提报")}
        columns={["员工", "日期", "电话量", "拜访量", "签约量", "跟进量", "备注"]}
        data={dailyLogsData.map(l => [l.employee, l.date, l.callCount, l.visitCount, l.signCount, l.followupCount, l.remark])}
      />

      {/* 业绩分析图表 */}
      <PerformanceAnalysisChart onExport={onExport} />

      {/* 订单分析（完整字段表格） */}
      <OrderAnalysisTable
        onExport={() => onExport("订单分析")}
      />

      {/* 客户数量分析 */}
      <CustomerAnalysisChart onExport={onExport} />

      {/* 客户活跃度监控 */}
      <DataTable
        title="客户活跃度（销售人员联系情况实时监控，预警展示）"
        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        count={customerActivityData.length}
        badge={<Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700">{customerActivityData.filter(c => c.status === "alert").length}个预警</Badge>}
        onExport={() => onExport("客户活跃度")}
        columns={["客户姓名", "跟进顾问", "最后联系", "未联系天数", "联系次数", "状态", "意向度"]}
        data={customerActivityData.map(c => [
          c.customerName, c.consultant, c.lastContact, 
          <Badge key={c.id} className={`text-[10px] ${c.daysSinceContact >= 7 ? "bg-red-100 text-red-700" : c.daysSinceContact >= 3 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
            {c.daysSinceContact}天
          </Badge>,
          c.contactCount,
          <Badge key={`${c.id}-status`} variant="outline" className={`text-[10px] ${c.status === "alert" ? "bg-red-50 text-red-700" : c.status === "warning" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
            {c.status === "alert" ? "预警" : c.status === "warning" ? "注意" : "正常"}
          </Badge>,
          c.intent
        ])}
      />

      {/* 渠道转化 & 个人渠道转化 */}
      <DataTable
        title="渠道转化情况"
        icon={<Target className="h-4 w-4 text-indigo-500" />}
        count={channelConversionData.length}
        onExport={() => onExport("渠道转化情况")}
        columns={["渠道", "线索数", "成交数", "转化率", "成交金额", "平均客单价"]}
        data={channelConversionData.map(c => [
          c.channel, c.leads, c.conversions,
          <Badge key={c.id} variant="outline" className={`text-[10px] ${c.rate >= 30 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{c.rate}%</Badge>,
          `¥${c.revenue.toLocaleString()}`, `¥${c.avgOrderValue.toLocaleString()}`
        ])}
      />

      <DataTable
        title="个人渠道转化情况"
        icon={<Share2 className="h-4 w-4 text-pink-500" />}
        count={personalChannelData.length}
        onExport={() => onExport("个人渠道转化情况")}
        columns={["员工", "转介绍线索", "转介绍成交", "自拓线索", "自拓成交", "线上线索", "线上成交", "线下线索", "线下成交"]}
        data={personalChannelData.map(p => [
          p.employee, p.referralLeads, p.referralConversions, p.selfLeads, p.selfConversions, p.onlineLeads, p.onlineConversions, p.offlineLeads, p.offlineConversions
        ])}
      />

      {/* 年度任务完成情况 */}
      <AnnualTaskChart onExport={onExport} />

      {/* 转介绍及自拓数据入库趋势 */}
      <ReferralTrendChart onExport={onExport} />
    </div>
  )
}

// ==================== 产康看板视图 ====================
function PostpartumView({ startDate, endDate, onExport }: { startDate: string; endDate: string; onExport: (name: string) => void }) {
  // 表格导航定义
  const postpartumTables = [
    { id: "postpartum-service", name: "服务记录", icon: <Activity className="h-3 w-3" /> },
    { id: "postpartum-reminder", name: "服务提醒", icon: <AlertCircle className="h-3 w-3" /> },
    { id: "postpartum-upgrade", name: "升单率", icon: <TrendingUp className="h-3 w-3" /> },
    { id: "postpartum-referral", name: "转介绍/自拓", icon: <Share2 className="h-3 w-3" /> },
    { id: "postpartum-card", name: "项目耗卡", icon: <FileText className="h-3 w-3" /> },
    { id: "postpartum-target", name: "目标达成", icon: <Target className="h-3 w-3" /> },
  ]

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-4">
      {/* 快速导航 */}
      <TableNavigation tables={postpartumTables} onNavigate={handleNavigate} />

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <StatCard title="本周服务数" value="18" icon={<Calendar className="h-3.5 w-3.5 text-purple-600" />} bgColor="bg-purple-100" />
        <StatCard title="月上户服务数" value="65" icon={<CalendarDays className="h-3.5 w-3.5 text-blue-600" />} bgColor="bg-blue-100" />
        <StatCard title="服务提醒" value="3" subValue="合同开始前1天" icon={<AlertCircle className="h-3.5 w-3.5 text-amber-600" />} bgColor="bg-amber-100" />
        <StatCard title="升单率" value="42.5%" icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-600" />} bgColor="bg-emerald-100" />
        <StatCard title="目标达成" value="78%" icon={<Target className="h-3.5 w-3.5 text-rose-600" />} bgColor="bg-rose-100" />
      </div>

      {/* 服务记录表 */}
      <DataTable
        id="postpartum-service"
        title="本周/月上户服务数"
        icon={<Activity className="h-4 w-4 text-teal-500" />}
        count={postpartumServiceData.length}
        onExport={() => onExport("服务记录")}
        columns={["技师", "日期", "客户", "项目", "次数", "耗卡", "金额"]}
        data={postpartumServiceData.map(p => [
          p.technician, p.date, p.client, p.project, p.sessions, p.cardUsed,
          `¥${p.amount.toLocaleString()}`
        ])}
      />

      {/* 母婴客户合同开始服务前一天提醒 */}
      <DataTable
        id="postpartum-reminder"
        title="母婴客户合同开始服务前一天提醒"
        icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
        count={3}
        badge={<Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700">待服务</Badge>}
        onExport={() => onExport("服务提醒")}
        columns={["客户姓名", "服务类型", "合同开始", "预计服务", "负责技师", "联系电话", "备注"]}
        data={[
          ["张女士", "开奶服务", "2025-01-26", "2025-01-27", "赵丽娜", "138****1234", "初产妇，注意沟通"],
          ["王女士", "产后修复", "2025-01-27", "2025-01-28", "孙技师", "139****5678", "二胎，骨盆问题"],
          ["刘女士", "盆底修复", "2025-01-28", "2025-01-29", "李技师", "137****9012", "顺产，恢复良好"],
        ]}
      />

      {/* 升单率 */}
      <DataTable
        id="postpartum-upgrade"
        title="升单率（由低阶服务升为高阶服务）"
        icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
        count={3}
        onExport={() => onExport("升单率")}
        columns={["技师", "低阶服务数", "升单数", "升单率", "升单金额", "常升项目"]}
        data={[
          ["赵丽娜", "25", "12", <Badge key="1" variant="outline" className="text-[10px] bg-green-50 text-green-700">48.0%</Badge>, "¥28,800", "盆底修复->全套修复"],
          ["孙技师", "20", "8", <Badge key="2" variant="outline" className="text-[10px] bg-green-50 text-green-700">40.0%</Badge>, "¥19,200", "单项->套餐"],
          ["李技师", "18", "6", <Badge key="3" variant="outline" className="text-[10px] bg-amber-50 text-amber-700">33.3%</Badge>, "¥14,400", "基础->进阶"],
        ]}
      />

      {/* 转介绍/自拓数量 */}
      <DataTable
        id="postpartum-referral"
        title="转介绍/自拓数量及转化率"
        icon={<Share2 className="h-4 w-4 text-pink-500" />}
        count={3}
        onExport={() => onExport("转介绍自拓")}
        columns={["技师", "转介绍数", "转介绍转化率", "自拓数", "自拓转化率"]}
        data={[
          ["赵丽娜", "8", <Badge key="1" variant="outline" className="text-[10px] bg-green-50 text-green-700">38.2%</Badge>, "5", <Badge key="2" variant="outline" className="text-[10px] bg-amber-50 text-amber-700">25.6%</Badge>],
          ["孙技师", "6", <Badge key="3" variant="outline" className="text-[10px] bg-green-50 text-green-700">35.0%</Badge>, "4", <Badge key="4" variant="outline" className="text-[10px] bg-amber-50 text-amber-700">22.5%</Badge>],
          ["李技师", "5", <Badge key="5" variant="outline" className="text-[10px] bg-amber-50 text-amber-700">28.0%</Badge>, "3", <Badge key="6" variant="outline" className="text-[10px] bg-amber-50 text-amber-700">20.0%</Badge>],
        ]}
      />

      {/* 服务项目耗卡次数 */}
      <DataTable
        id="postpartum-card"
        title="服务项目耗卡次数"
        icon={<FileText className="h-4 w-4 text-indigo-500" />}
        count={4}
        onExport={() => onExport("项目耗卡")}
        columns={["项目名称", "总耗卡次数", "本月耗卡", "客户数", "平均耗卡"]}
        data={[
          ["产后修复", "68", "18", "25", "2.7"],
          ["盆底修复", "52", "15", "22", "2.4"],
          ["腹直肌修复", "36", "12", "18", "2.0"],
          ["骨盆矫正", "28", "8", "15", "1.9"],
        ]}
      />

      {/* 目标达成度 */}
      <Card id="postpartum-target">
        <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" />
            目标达成度
          </CardTitle>
          <div className="flex items-center gap-2">
            <DateRangePicker 
              startDate="2025-01-01" 
              endDate="2025-01-25"
              onStartChange={() => {}}
              onEndChange={() => {}}
            />
            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("目标达成度")}>
              <Download className="h-3 w-3 mr-1" />导出
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "赵丽娜", target: 50000, achieved: 42500, rate: 85 },
              { name: "孙技师", target: 45000, achieved: 35200, rate: 78 },
              { name: "李技师", target: 40000, achieved: 28800, rate: 72 },
            ].map(t => (
              <div key={t.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{t.name}</span>
                  <span className="text-muted-foreground">¥{t.achieved.toLocaleString()} / ¥{t.target.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={t.rate} className="h-2 flex-1" />
                  <Badge variant="outline" className={`text-[10px] ${t.rate >= 80 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {t.rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== 表格快速导航组件 ====================
function TableNavigation({ tables, onNavigate }: { tables: { id: string; name: string; icon: React.ReactNode }[]; onNavigate: (id: string) => void }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          快速导航
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tables.map((table) => (
            <Button
              key={table.id}
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 bg-transparent hover:bg-primary hover:text-primary-foreground"
              onClick={() => onNavigate(table.id)}
            >
              {table.icon}
              {table.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 独立日期选择器组件 ====================
function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartChange, 
  onEndChange 
}: { 
  startDate: string
  endDate: string
  onStartChange: (date: string) => void
  onEndChange: (date: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[10px] bg-transparent">
          <CalendarDays className="h-3 w-3 mr-1" />
          {startDate.slice(5)} ~ {endDate.slice(5)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px]">开始</Label>
              <Input type="date" value={startDate} onChange={(e) => onStartChange(e.target.value)} className="h-7 text-[10px]" />
            </div>
            <div>
              <Label className="text-[10px]">结束</Label>
              <Input type="date" value={endDate} onChange={(e) => onEndChange(e.target.value)} className="h-7 text-[10px]" />
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 bg-transparent" onClick={() => { onStartChange("2025-01-25"); onEndChange("2025-01-25"); }}>今日</Button>
            <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 bg-transparent" onClick={() => { onStartChange("2025-01-20"); onEndChange("2025-01-25"); }}>本周</Button>
            <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 bg-transparent" onClick={() => { onStartChange("2025-01-01"); onEndChange("2025-01-25"); }}>本月</Button>
            <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 bg-transparent" onClick={() => { onStartChange("2025-01-01"); onEndChange("2025-12-31"); }}>本年</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ==================== 通用数据表格组件（带独立日期选择） ====================
function DataTable({ 
  id,
  title, 
  icon, 
  count, 
  badge,
  onExport, 
  columns, 
  data,
  clickable,
  onRowClick
}: { 
  id?: string
  title: string
  icon: React.ReactNode
  count: number
  badge?: React.ReactNode
  onExport: () => void
  columns: string[]
  data: React.ReactNode[][]
  clickable?: boolean
  onRowClick?: (index: number) => void
}) {
  const [localStartDate, setLocalStartDate] = useState("2025-01-01")
  const [localEndDate, setLocalEndDate] = useState("2025-01-25")

  return (
    <Card id={id}>
      <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary" className="text-[10px]">{count}条</Badge>
          {badge}
        </CardTitle>
        <div className="flex items-center gap-2">
          <DateRangePicker 
            startDate={localStartDate} 
            endDate={localEndDate}
            onStartChange={setLocalStartDate}
            onEndChange={setLocalEndDate}
          />
          <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={onExport}>
            <Download className="h-3 w-3 mr-1" />导出
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((col, i) => (
                  <TableHead key={i} className="text-xs whitespace-nowrap">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow 
                  key={i} 
                  className={clickable ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => clickable && onRowClick?.(i)}
                >
                  {row.map((cell, j) => (
                    <TableCell key={j} className="text-xs whitespace-nowrap">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ==================== 订单分析表格组件（完整字段） ====================
function OrderAnalysisTable({ 
  id,
  onExport 
}: { 
  id?: string
  onExport: () => void
}) {
  const [localStartDate, setLocalStartDate] = useState("2025-01-01")
  const [localEndDate, setLocalEndDate] = useState("2025-01-25")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  const filteredData = orderAnalysisData.filter(order => {
    if (statusFilter !== "all" && order.orderStatus !== statusFilter) return false
    if (serviceFilter !== "all" && order.serviceType !== serviceFilter) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">服务中</Badge>
      case "pending": return <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">待服务</Badge>
      case "completed": return <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">已完成</Badge>
      case "cancelled": return <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700">已取消</Badge>
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>
    }
  }

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case "全款": return <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">全款</Badge>
      case "定金": return <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">定金</Badge>
      case "尾款": return <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">尾款</Badge>
      case "分期": return <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700">分期</Badge>
      default: return <Badge variant="outline" className="text-[10px]">{type}</Badge>
    }
  }

  return (
    <Card id={id}>
      <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          订单分析表
          <Badge variant="secondary" className="text-[10px]">{filteredData.length}条</Badge>
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 text-xs w-24">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">服务中</SelectItem>
              <SelectItem value="pending">待服务</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="h-7 text-xs w-24">
              <SelectValue placeholder="服务类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="月嫂服务">月嫂服务</SelectItem>
              <SelectItem value="育婴服务">育婴服务</SelectItem>
              <SelectItem value="产康服务">产康服务</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker 
            startDate={localStartDate} 
            endDate={localEndDate}
            onStartChange={setLocalStartDate}
            onEndChange={setLocalEndDate}
          />
          <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={onExport}>
            <Download className="h-3 w-3 mr-1" />导出
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[2000px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs whitespace-nowrap sticky left-0 bg-background z-10">订单编号</TableHead>
                <TableHead className="text-xs whitespace-nowrap">订单名称</TableHead>
                <TableHead className="text-xs whitespace-nowrap">收费时间</TableHead>
                <TableHead className="text-xs whitespace-nowrap">服务类型</TableHead>
                <TableHead className="text-xs whitespace-nowrap text-right">实收金额</TableHead>
                <TableHead className="text-xs whitespace-nowrap text-right">佣金</TableHead>
                <TableHead className="text-xs whitespace-nowrap">收费类型</TableHead>
                <TableHead className="text-xs whitespace-nowrap">备注</TableHead>
                <TableHead className="text-xs whitespace-nowrap">客户全名</TableHead>
                <TableHead className="text-xs whitespace-nowrap">标签</TableHead>
                <TableHead className="text-xs whitespace-nowrap">客户跟进人</TableHead>
                <TableHead className="text-xs whitespace-nowrap">客户进展</TableHead>
                <TableHead className="text-xs whitespace-nowrap">创建客户时间</TableHead>
                <TableHead className="text-xs whitespace-nowrap">手机</TableHead>
                <TableHead className="text-xs whitespace-nowrap">订单状态</TableHead>
                <TableHead className="text-xs whitespace-nowrap">产品名称</TableHead>
                <TableHead className="text-xs whitespace-nowrap">订单归属人</TableHead>
                <TableHead className="text-xs whitespace-nowrap">归属部门</TableHead>
                <TableHead className="text-xs whitespace-nowrap">订单创建人</TableHead>
                <TableHead className="text-xs whitespace-nowrap">最近更新时间</TableHead>
                <TableHead className="text-xs whitespace-nowrap">订单创建时间</TableHead>
                <TableHead className="text-xs whitespace-nowrap">产品分类</TableHead>
                <TableHead className="text-xs whitespace-nowrap">规格名称</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs whitespace-nowrap sticky left-0 bg-background z-10 font-medium text-blue-600">{order.id}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.orderName}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{order.paymentTime || "-"}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.serviceType}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-right font-medium">¥{order.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-right text-primary">¥{order.commission.toLocaleString()}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{getPaymentTypeBadge(order.paymentType)}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap max-w-[150px] truncate" title={order.notes}>{order.notes || "-"}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap font-medium">{order.customerName}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap max-w-[120px]">
                      {order.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                      {order.tags.length > 2 && <Badge variant="secondary" className="text-[10px]">+{order.tags.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.consultant}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    <Badge variant="outline" className="text-[10px]">{order.customerProgress}</Badge>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{order.customerCreatedAt}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.phone}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{getStatusBadge(order.orderStatus)}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.productName}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.ownerEmployee}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.ownerDepartment}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.createdBy}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{order.updatedAt}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{order.createdAt}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.productCategory}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.productSpecs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 统计卡片组件 ====================
function StatCard({ 
  title, 
  value, 
  subValue,
  icon, 
  bgColor 
}: { 
  title: string
  value: string
  subValue?: string
  icon: React.ReactNode
  bgColor: string
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded ${bgColor}`}>{icon}</div>
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <p className="text-xl font-bold">{value}</p>
        {subValue && <p className="text-[10px] text-muted-foreground">{subValue}</p>}
      </CardContent>
    </Card>
  )
}

// ==================== 业绩分析图表组件 ====================
function PerformanceAnalysisChart({ onExport }: { onExport: (name: string) => void }) {
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly")
  const data = period === "daily" ? performanceData.daily : performanceData.monthly
  const xKey = period === "daily" ? "date" : "month"

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          业绩分析（各业务板块业绩趋势）
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex border rounded overflow-hidden">
            {(["daily", "monthly"] as const).map(p => (
              <button
                key={p}
                type="button"
                className={`px-2 py-1 text-[10px] ${period === p ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
                onClick={() => setPeriod(p)}
              >
                {p === "daily" ? "按日" : "按月"}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("业绩分析")}>
            <Download className="h-3 w-3 mr-1" />导出
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
              <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="maternity" name="月嫂服务" stackId="1" stroke={CHART_COLORS.maternity} fill={CHART_COLORS.maternity} fillOpacity={0.6} />
              <Area type="monotone" dataKey="infant" name="育婴服务" stackId="1" stroke={CHART_COLORS.infant} fill={CHART_COLORS.infant} fillOpacity={0.6} />
              <Area type="monotone" dataKey="postpartum" name="产康服务" stackId="1" stroke={CHART_COLORS.postpartum} fill={CHART_COLORS.postpartum} fillOpacity={0.6} />
              <Area type="monotone" dataKey="training" name="培训收入" stackId="1" stroke={CHART_COLORS.training} fill={CHART_COLORS.training} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 客户数量分析图表组件 ====================
function CustomerAnalysisChart({ onExport }: { onExport: (name: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          客户数量分析（逐月各渠道入库及成交）
        </CardTitle>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("客户数量分析")}>
          <Download className="h-3 w-3 mr-1" />导出
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerAnalysisData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value}人`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="referralIn" name="转介绍入库" fill={CHART_COLORS.referral} />
              <Bar dataKey="referralDeal" name="转介绍成交" fill="#d97706" />
              <Bar dataKey="selfIn" name="自拓入库" fill={CHART_COLORS.self} />
              <Bar dataKey="selfDeal" name="自拓成交" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 年度任务完成情况图表组件 ====================
function AnnualTaskChart({ onExport }: { onExport: (name: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-500" />
          年度任务完成情况
        </CardTitle>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("年度任务完成情况")}>
          <Download className="h-3 w-3 mr-1" />导出
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualTaskData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
              <Tooltip formatter={(value: number) => `${value}个`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="target" name="目标" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              <Bar dataKey="completed" name="已完成" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {annualTaskData.map(task => (
            <div key={task.name} className="flex items-center justify-between text-[10px] p-2 bg-muted/30 rounded">
              <span>{task.name}</span>
              <Badge variant="outline" className={`text-[10px] ${task.rate >= 80 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                {task.rate}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 转介绍及自拓数据入库趋势图表组件 ====================
function ReferralTrendChart({ onExport }: { onExport: (name: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          转介绍及自拓数据入库趋势
        </CardTitle>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent" onClick={() => onExport("转介绍及自拓数据入库趋势")}>
          <Download className="h-3 w-3 mr-1" />导出
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={referralTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value}人`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="referral" name="转介绍入库" stroke={CHART_COLORS.referral} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="self" name="自拓入库" stroke={CHART_COLORS.self} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="referralConvert" name="转介绍成交" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="selfConvert" name="自拓成交" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
