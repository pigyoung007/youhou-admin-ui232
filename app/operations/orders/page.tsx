"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Plus, FileText, Clock, CheckCircle2, XCircle, TrendingUp, DollarSign,
  Eye, Edit, Phone, MapPin, Star, User, Calendar, UserPlus, FileSignature, Ban, AlertTriangle, MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Order {
  id: string
  customer: string
  phone: string
  address: string
  service: string
  serviceType: string
  amount: number
  paidAmount: number
  status: "pending" | "active" | "completed" | "cancelled"
  payStatus: "unpaid" | "partial" | "paid" | "refunded"
  staff: string
  staffAvatar: string
  staffRating: number
  startDate: string
  endDate: string
  createTime: string
  source: string
  consultant: string
  notes: string
  // 新增字段
  commission: number // 佣金
  paymentTime: string // 收费时间
  paymentType: "全款" | "定金" | "尾款" | "分期" // 收费类型
  orderType: "新签" | "下户" | "续单" // 订单类型
  ownerEmployee: string // 订单归属人
  ownerDepartment: string // 归属部门
  createdBy: string // 订单创建人
  updatedAt: string // 最近更新时间
  actualEndDate: string // 实际服务结束日期
  companyId: string // 分公司ID
  productCategory: string // 产品分类
  productSpecs: string // 规格名称
  customerTags: string[] // 客户标签
  customerProgress: string // 客户进展
  customerCreatedAt: string // 创建客户时间
}

const orders: Order[] = [
  { id: "ORD202501001", customer: "刘女士", phone: "138****5678", address: "银川市兴庆区凤凰北街", service: "金牌月嫂26天", serviceType: "月嫂服务", amount: 18800, paidAmount: 18800, status: "active", payStatus: "paid", staff: "李春华", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-15", endDate: "2025-02-10", createTime: "2025-01-10 14:30", source: "官网下单", consultant: "张顾问", notes: "客户要求提前上户", commission: 1880, paymentTime: "2025-01-10 15:00", paymentType: "全款", orderType: "新签", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-15 09:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "金牌26天", customerTags: ["高意向", "二胎"], customerProgress: "服务中", customerCreatedAt: "2025-01-08" },
  { id: "ORD202501002", customer: "陈先生", phone: "139****1234", address: "银川市金凤区万达广场", service: "产康套餐8次", serviceType: "产康服务", amount: 3800, paidAmount: 1900, status: "pending", payStatus: "partial", staff: "待分配", staffAvatar: "", staffRating: 0, startDate: "2025-01-25", endDate: "2025-02-25", createTime: "2025-01-18 09:15", source: "电话咨询", consultant: "李顾问", notes: "", commission: 380, paymentTime: "2025-01-18 10:00", paymentType: "定金", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-18 10:00", actualEndDate: "", companyId: "YC001", productCategory: "产康服务", productSpecs: "套餐8次", customerTags: ["价格敏感"], customerProgress: "待服务", customerCreatedAt: "2025-01-17" },
  { id: "ORD202501003", customer: "王女士", phone: "137****9876", address: "银川市西夏区怀远路", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "张美玲", staffAvatar: "", staffRating: 4.8, startDate: "2024-12-01", endDate: "2024-12-31", createTime: "2024-11-25 16:45", source: "老客户转介", consultant: "王顾问", notes: "客户非常满意，已申请续单", commission: 760, paymentTime: "2024-11-25 17:00", paymentType: "全款", orderType: "下户", ownerEmployee: "王顾问", ownerDepartment: "居家服务事业部", createdBy: "王顾问", updatedAt: "2025-01-02 10:00", actualEndDate: "2024-12-31", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: ["转介绍", "老客户"], customerProgress: "已完成", customerCreatedAt: "2024-10-15" },
  { id: "ORD202501004", customer: "赵女士", phone: "136****5432", address: "银川市兴庆区民族街", service: "金牌月嫂42天", serviceType: "月嫂服务", amount: 32000, paidAmount: 32000, status: "active", payStatus: "paid", staff: "陈桂芳", staffAvatar: "", staffRating: 5.0, startDate: "2025-01-01", endDate: "2025-02-11", createTime: "2024-12-20 11:20", source: "小红书", consultant: "张顾问", notes: "VIP客户，需特别关注", commission: 3200, paymentTime: "2024-12-20 12:00", paymentType: "全款", orderType: "新签", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-01 08:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "金牌42天", customerTags: ["VIP", "高消费"], customerProgress: "服务中", customerCreatedAt: "2024-12-18" },
  { id: "ORD202501005", customer: "孙女士", phone: "135****7890", address: "银川市金凤区正源街", service: "高级月嫂26天", serviceType: "月嫂服务", amount: 15000, paidAmount: 0, status: "cancelled", payStatus: "refunded", staff: "-", staffAvatar: "", staffRating: 0, startDate: "2025-01-20", endDate: "2025-02-15", createTime: "2025-01-05 10:30", source: "抖音", consultant: "李顾问", notes: "客户取消，原因：计划变更", commission: 0, paymentTime: "", paymentType: "全款", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-08 16:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "高级26天", customerTags: ["线上"], customerProgress: "已取消", customerCreatedAt: "2025-01-04" },
  { id: "ORD202501006", customer: "周先生", phone: "158****2345", address: "银川市兴庆区解放街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "active", payStatus: "paid", staff: "刘小红", staffAvatar: "", staffRating: 4.7, startDate: "2025-01-10", endDate: "2025-02-09", createTime: "2025-01-05 15:20", source: "朋友推荐", consultant: "张顾问", notes: "", commission: 760, paymentTime: "2025-01-05 16:00", paymentType: "全款", orderType: "新签", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-10 08:00", actualEndDate: "", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: ["转介绍"], customerProgress: "服务中", customerCreatedAt: "2025-01-03" },
  { id: "ORD202501007", customer: "吴女士", phone: "186****6789", address: "银川市西夏区贺兰山路", service: "产康套餐12次", serviceType: "产康服务", amount: 5200, paidAmount: 5200, status: "active", payStatus: "paid", staff: "王秀兰", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-08", endDate: "2025-03-08", createTime: "2025-01-03 10:00", source: "官网下单", consultant: "李顾问", notes: "", commission: 520, paymentTime: "2025-01-03 11:00", paymentType: "全款", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-08 09:00", actualEndDate: "", companyId: "YC001", productCategory: "产康服务", productSpecs: "套餐12次", customerTags: ["线上"], customerProgress: "服务中", customerCreatedAt: "2025-01-02" },
  { id: "ORD202501008", customer: "郑女士", phone: "139****0123", address: "银川市金凤区阅海万家", service: "高级月嫂26天", serviceType: "月嫂服务", amount: 15000, paidAmount: 5000, status: "pending", payStatus: "partial", staff: "待分配", staffAvatar: "", staffRating: 0, startDate: "2025-02-01", endDate: "2025-02-27", createTime: "2025-01-16 14:00", source: "微信公众号", consultant: "王顾问", notes: "预产期2月初", commission: 1500, paymentTime: "2025-01-16 15:00", paymentType: "定金", orderType: "新签", ownerEmployee: "王顾问", ownerDepartment: "居家服务事业部", createdBy: "王顾问", updatedAt: "2025-01-16 15:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "高级26天", customerTags: ["线上", "待跟进"], customerProgress: "待服务", customerCreatedAt: "2025-01-15" },
  { id: "ORD202501009", customer: "钱先生", phone: "136****4567", address: "银川市兴庆区北京路", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "赵小燕", staffAvatar: "", staffRating: 4.6, startDate: "2024-11-15", endDate: "2024-12-15", createTime: "2024-11-10 09:30", source: "电话咨询", consultant: "张顾问", notes: "", commission: 760, paymentTime: "2024-11-10 10:00", paymentType: "全款", orderType: "下户", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2024-12-16 10:00", actualEndDate: "2024-12-15", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: [], customerProgress: "已完成", customerCreatedAt: "2024-11-08" },
  { id: "ORD202501010", customer: "冯女士", phone: "188****8901", address: "银川市西夏区同心路", service: "金牌月嫂26天", serviceType: "月嫂服务", amount: 18800, paidAmount: 18800, status: "active", payStatus: "paid", staff: "孙美华", staffAvatar: "", staffRating: 4.8, startDate: "2025-01-12", endDate: "2025-02-07", createTime: "2025-01-08 16:45", source: "老客户转介", consultant: "李顾问", notes: "二胎客户", commission: 1880, paymentTime: "2025-01-08 17:00", paymentType: "全款", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-12 08:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "金牌26天", customerTags: ["转介绍", "二胎"], customerProgress: "服务中", customerCreatedAt: "2025-01-06" },
  { id: "ORD202501011", customer: "杨女士", phone: "159****2345", address: "银川市金凤区宝湖路", service: "产康套餐8次", serviceType: "产康服务", amount: 3800, paidAmount: 0, status: "pending", payStatus: "unpaid", staff: "待分配", staffAvatar: "", staffRating: 0, startDate: "2025-01-28", endDate: "2025-02-28", createTime: "2025-01-19 11:00", source: "小红书", consultant: "张顾问", notes: "新客户咨询", commission: 380, paymentTime: "", paymentType: "全款", orderType: "新签", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-19 11:00", actualEndDate: "", companyId: "YC001", productCategory: "产康服务", productSpecs: "套餐8次", customerTags: ["线上", "新客户"], customerProgress: "待签约", customerCreatedAt: "2025-01-19" },
  { id: "ORD202501012", customer: "徐先生", phone: "137****6789", address: "银川市兴庆区中山街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "周小芳", staffAvatar: "", staffRating: 4.9, startDate: "2024-12-10", endDate: "2025-01-10", createTime: "2024-12-05 14:20", source: "朋友推荐", consultant: "王顾问", notes: "服务完成，好评", commission: 760, paymentTime: "2024-12-05 15:00", paymentType: "全款", orderType: "下户", ownerEmployee: "王顾问", ownerDepartment: "居家服务事业部", createdBy: "王顾问", updatedAt: "2025-01-11 10:00", actualEndDate: "2025-01-10", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: ["转介绍", "好评"], customerProgress: "已完成", customerCreatedAt: "2024-12-01" },
  { id: "ORD202501013", customer: "朱女士", phone: "138****0123", address: "银川市西夏区文昌路", service: "高级月嫂42天", serviceType: "月嫂服务", amount: 22000, paidAmount: 22000, status: "active", payStatus: "paid", staff: "吴桂兰", staffAvatar: "", staffRating: 4.7, startDate: "2025-01-05", endDate: "2025-02-16", createTime: "2024-12-28 10:15", source: "官网下单", consultant: "李顾问", notes: "", commission: 2200, paymentTime: "2024-12-28 11:00", paymentType: "全款", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-05 08:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "高级42天", customerTags: ["线上"], customerProgress: "服务中", customerCreatedAt: "2024-12-26" },
  { id: "ORD202501014", customer: "何女士", phone: "186****4567", address: "银川市金凤区长城路", service: "产康套餐16次", serviceType: "产康服务", amount: 6800, paidAmount: 3400, status: "active", payStatus: "partial", staff: "郑小梅", staffAvatar: "", staffRating: 4.8, startDate: "2025-01-10", endDate: "2025-04-10", createTime: "2025-01-06 09:00", source: "抖音", consultant: "张顾问", notes: "分期付款", commission: 680, paymentTime: "2025-01-06 10:00", paymentType: "分期", orderType: "新签", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-10 09:00", actualEndDate: "", companyId: "YC001", productCategory: "产康服务", productSpecs: "套餐16次", customerTags: ["线上", "分期"], customerProgress: "服务中", customerCreatedAt: "2025-01-05" },
  { id: "ORD202501015", customer: "高先生", phone: "159****8901", address: "银川市兴庆区胜利街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 7600, status: "completed", payStatus: "paid", staff: "陈小玲", staffAvatar: "", staffRating: 5.0, startDate: "2024-11-20", endDate: "2024-12-20", createTime: "2024-11-15 15:30", source: "电话咨询", consultant: "王顾问", notes: "优质客户", commission: 760, paymentTime: "2024-11-15 16:00", paymentType: "全款", orderType: "下户", ownerEmployee: "王顾问", ownerDepartment: "居家服务事业部", createdBy: "王顾问", updatedAt: "2024-12-21 10:00", actualEndDate: "2024-12-20", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: ["优质"], customerProgress: "已完成", customerCreatedAt: "2024-11-10" },
  { id: "ORD202501016", customer: "林女士", phone: "136****2345", address: "银川市西夏区学院路", service: "金牌月嫂26天", serviceType: "月嫂服务", amount: 18800, paidAmount: 18800, status: "active", payStatus: "paid", staff: "钱秀英", staffAvatar: "", staffRating: 4.9, startDate: "2025-01-18", endDate: "2025-02-13", createTime: "2025-01-12 11:45", source: "微信公众号", consultant: "李顾问", notes: "", commission: 1880, paymentTime: "2025-01-12 12:00", paymentType: "全款", orderType: "新签", ownerEmployee: "李顾问", ownerDepartment: "居家服务事业部", createdBy: "李顾问", updatedAt: "2025-01-18 08:00", actualEndDate: "", companyId: "YC001", productCategory: "月嫂服务", productSpecs: "金牌26天", customerTags: ["线上"], customerProgress: "服务中", customerCreatedAt: "2025-01-10" },
  { id: "ORD202501017", customer: "梁女士", phone: "188****6789", address: "银川市金凤区满城街", service: "产康套餐8次", serviceType: "产康服务", amount: 3800, paidAmount: 3800, status: "completed", payStatus: "paid", staff: "孙小红", staffAvatar: "", staffRating: 4.7, startDate: "2024-12-15", endDate: "2025-01-15", createTime: "2024-12-10 16:00", source: "老客户转介", consultant: "张顾问", notes: "服务完成", commission: 380, paymentTime: "2024-12-10 17:00", paymentType: "全款", orderType: "下户", ownerEmployee: "张顾问", ownerDepartment: "居家服务事业部", createdBy: "张顾问", updatedAt: "2025-01-16 10:00", actualEndDate: "2025-01-15", companyId: "YC001", productCategory: "产康服务", productSpecs: "套餐8次", customerTags: ["转介绍"], customerProgress: "已完成", customerCreatedAt: "2024-12-08" },
  { id: "ORD202501018", customer: "谢先生", phone: "137****0123", address: "银川市兴庆区清和街", service: "育婴师月度", serviceType: "育婴服务", amount: 7600, paidAmount: 0, status: "cancelled", payStatus: "refunded", staff: "-", staffAvatar: "", staffRating: 0, startDate: "2025-01-15", endDate: "2025-02-15", createTime: "2025-01-08 10:20", source: "小红书", consultant: "王顾问", notes: "客户取消", commission: 0, paymentTime: "", paymentType: "全款", orderType: "新签", ownerEmployee: "王顾问", ownerDepartment: "居家服务事业部", createdBy: "王顾问", updatedAt: "2025-01-10 14:00", actualEndDate: "", companyId: "YC001", productCategory: "育婴服务", productSpecs: "月度服务", customerTags: ["线上"], customerProgress: "已取消", customerCreatedAt: "2025-01-07" },
]

const statusConfig = {
  pending: { label: "待服务", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  active: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
  completed: { label: "已完成", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const payStatusConfig = {
  unpaid: { label: "未支付", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "部分付", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "已付清", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// 新建服务订单弹窗
function CreateServiceOrderDialog() {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    // 客户信息
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerSource: "",
    customerTags: [] as string[],
    // 服务信息
    serviceType: "",
    serviceName: "",
    staffId: "",
    startDate: "",
    endDate: "",
    // 价格与付款
    totalAmount: 0,
    depositAmount: 0,
    depositPaid: false,
    paymentType: "全款",
    // 合同信息
    contractNo: "",
    contractSigned: false,
    contractFile: "",
    // 订单归属
    ownerEmployee: "",
    ownerDepartment: "居家服务事业部",
    orderType: "新签",
    notes: "",
  })

  const serviceTypes = [
    { value: "月嫂服务", label: "月嫂服务" },
    { value: "育婴服务", label: "育婴服务" },
    { value: "产康服务", label: "产康服务" },
  ]

  const serviceOptions: Record<string, { value: string; label: string; price: number }[]> = {
    "月嫂服务": [
      { value: "金牌月嫂26天", label: "金牌月嫂26天", price: 18800 },
      { value: "金牌月嫂42天", label: "金牌月嫂42天", price: 28800 },
      { value: "高级月嫂26天", label: "高级月嫂26天", price: 15000 },
      { value: "高级月嫂42天", label: "高级月嫂42天", price: 22000 },
      { value: "特级月嫂26天", label: "特级月嫂26天", price: 22800 },
      { value: "特级月嫂42天", label: "特级月嫂42天", price: 32000 },
    ],
    "育婴服务": [
      { value: "育婴师月度", label: "育婴师月度", price: 7600 },
      { value: "育婴师季度", label: "育婴师季度", price: 21000 },
      { value: "高级育婴师月度", label: "高级育婴师月度", price: 9800 },
    ],
    "产康服务": [
      { value: "产康套餐8次", label: "产康套餐8次", price: 3800 },
      { value: "产康套餐12次", label: "产康套餐12次", price: 5200 },
      { value: "产康套餐16次", label: "产康套餐16次", price: 6800 },
    ],
  }

  const consultants = [
    { value: "张顾问", label: "张顾问" },
    { value: "李顾问", label: "李顾问" },
    { value: "王顾问", label: "王顾问" },
  ]

  const handleServiceChange = (serviceName: string) => {
    const options = serviceOptions[formData.serviceType] || []
    const selected = options.find(o => o.value === serviceName)
    setFormData({
      ...formData,
      serviceName,
      totalAmount: selected?.price || 0,
      depositAmount: Math.round((selected?.price || 0) * 0.3), // 默认30%定金
    })
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-3 border-b bg-muted/20">
      {[
        { num: 1, label: "客户信息" },
        { num: 2, label: "服务选择" },
        { num: 3, label: "付款信息" },
        { num: 4, label: "合同签约" },
      ].map((s, i) => (
        <React.Fragment key={s.num}>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
            step === s.num ? "bg-primary text-primary-foreground" : step > s.num ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
          )}>
            {step > s.num ? <CheckCircle2 className="h-3 w-3" /> : <span className="w-4 text-center">{s.num}</span>}
            <span>{s.label}</span>
          </div>
          {i < 3 && <div className={cn("w-6 h-0.5", step > s.num ? "bg-emerald-300" : "bg-muted")} />}
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建订单</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileSignature className="h-4 w-4 text-primary" />
            新建服务订单
          </DialogTitle>
          <DialogDescription className="text-xs">请按步骤填写订单信息，确保信息完整准确</DialogDescription>
        </DialogHeader>

        {renderStepIndicator()}

        <div className="flex-1 overflow-y-auto p-4">
          {/* Step 1: 客户信息 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">客户姓名 <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="请输入客户姓名" 
                    className="h-8 text-xs"
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">联系电话 <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="请输入联系电话" 
                    className="h-8 text-xs"
                    value={formData.customerPhone}
                    onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">服务地址 <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="请输入详细服务地址" 
                  className="h-8 text-xs"
                  value={formData.customerAddress}
                  onChange={e => setFormData({...formData, customerAddress: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">客户来源</Label>
                  <Select value={formData.customerSource} onValueChange={v => setFormData({...formData, customerSource: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择来源渠道" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="转介绍">转介绍</SelectItem>
                      <SelectItem value="自拓">自拓</SelectItem>
                      <SelectItem value="线上-抖音">线上-抖音</SelectItem>
                      <SelectItem value="线上-小红书">线上-小红书</SelectItem>
                      <SelectItem value="线上-官网">线上-官网</SelectItem>
                      <SelectItem value="线下-活动">线下-活动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">订单归属人 <span className="text-red-500">*</span></Label>
                  <Select value={formData.ownerEmployee} onValueChange={v => setFormData({...formData, ownerEmployee: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择归属顾问" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultants.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  提示：可从SCRM客户库中选择已有客户，自动填充信息
                </p>
              </div>
            </div>
          )}

          {/* Step 2: 服务选择 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">服务类型 <span className="text-red-500">*</span></Label>
                  <Select value={formData.serviceType} onValueChange={v => setFormData({...formData, serviceType: v, serviceName: "", totalAmount: 0})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择服务类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">服务项目 <span className="text-red-500">*</span></Label>
                  <Select value={formData.serviceName} onValueChange={handleServiceChange} disabled={!formData.serviceType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择服务项目" />
                    </SelectTrigger>
                    <SelectContent>
                      {(serviceOptions[formData.serviceType] || []).map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label} - ¥{s.price.toLocaleString()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">服务开始日期 <span className="text-red-500">*</span></Label>
                  <Input 
                    type="date" 
                    className="h-8 text-xs"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">服务结束日期</Label>
                  <Input 
                    type="date" 
                    className="h-8 text-xs"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">分配服务人员</Label>
                <Select value={formData.staffId} onValueChange={v => setFormData({...formData, staffId: v})}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择服务人员（可稍后分配）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="待分配">待分配</SelectItem>
                    <SelectItem value="李春华">李春华 - 金牌月嫂</SelectItem>
                    <SelectItem value="王秀兰">王秀兰 - 高级月嫂</SelectItem>
                    <SelectItem value="张美玲">张美玲 - 金牌月嫂</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">订单类型</Label>
                  <Select value={formData.orderType} onValueChange={v => setFormData({...formData, orderType: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="新签">新签</SelectItem>
                      <SelectItem value="续单">续单</SelectItem>
                      <SelectItem value="下户">下户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">订单金额</Label>
                  <div className="h-8 px-3 flex items-center rounded-md border bg-muted/30 text-xs font-medium">
                    ¥{formData.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 付款信息 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">订单总金额</span>
                  <span className="text-lg font-bold text-primary">¥{formData.totalAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">收费类型 <span className="text-red-500">*</span></Label>
                  <Select value={formData.paymentType} onValueChange={v => setFormData({...formData, paymentType: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全款">全款支付</SelectItem>
                      <SelectItem value="定金">定金+尾款</SelectItem>
                      <SelectItem value="分期">分期付款</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.paymentType === "定金" && (
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 space-y-3">
                  <h4 className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    定金信息
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">定金金额 <span className="text-red-500">*</span></Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs"
                        value={formData.depositAmount}
                        onChange={e => setFormData({...formData, depositAmount: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">尾款金额</Label>
                      <div className="h-8 px-3 flex items-center rounded-md border bg-muted/30 text-xs">
                        ¥{(formData.totalAmount - formData.depositAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="depositPaid" 
                      className="rounded"
                      checked={formData.depositPaid}
                      onChange={e => setFormData({...formData, depositPaid: e.target.checked})}
                    />
                    <Label htmlFor="depositPaid" className="text-xs text-amber-800">定金已收取</Label>
                  </div>
                </div>
              )}

              {formData.paymentType === "分期" && (
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 space-y-3">
                  <h4 className="text-xs font-medium text-purple-800 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    分期付款计划
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-white">
                      <span>首期（30%）</span>
                      <span className="font-medium">¥{Math.round(formData.totalAmount * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-white">
                      <span>二期（40%）- 服务中期</span>
                      <span className="font-medium">¥{Math.round(formData.totalAmount * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-white">
                      <span>尾款（30%）- 服务结束</span>
                      <span className="font-medium">¥{Math.round(formData.totalAmount * 0.3).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs">备注</Label>
                <Textarea 
                  placeholder="请输入订单备注信息..." 
                  className="text-xs min-h-[60px] resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Step 4: 合同签约 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
                <h4 className="text-xs font-medium flex items-center gap-1.5">
                  <FileSignature className="h-3.5 w-3.5 text-primary" />
                  合同信息
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">合同编号</Label>
                    <Input 
                      placeholder="系统自动生成或手动输入" 
                      className="h-8 text-xs"
                      value={formData.contractNo}
                      onChange={e => setFormData({...formData, contractNo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">合同状态</Label>
                    <Select value={formData.contractSigned ? "signed" : "unsigned"} onValueChange={v => setFormData({...formData, contractSigned: v === "signed"})}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unsigned">待签约</SelectItem>
                        <SelectItem value="signed">已签约</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">上传合同附件</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">点击或拖拽上传合同文件</p>
                    <p className="text-[10px] text-muted-foreground mt-1">支持 PDF、Word、图片格式</p>
                  </div>
                </div>
              </div>

              {/* 订单汇总 */}
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 space-y-3">
                <h4 className="text-xs font-medium text-emerald-800">订单信息汇总</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">客户姓名</span>
                    <span className="font-medium">{formData.customerName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">联系电话</span>
                    <span className="font-medium">{formData.customerPhone || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务项目</span>
                    <span className="font-medium">{formData.serviceName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">订单金额</span>
                    <span className="font-medium text-primary">¥{formData.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">收费类型</span>
                    <span className="font-medium">{formData.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">订单归属</span>
                    <span className="font-medium">{formData.ownerEmployee || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-3 border-t flex-shrink-0 bg-background">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
            >
              上一步
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">保存草稿</Button>
              {step < 4 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>下一步</Button>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  提交订单
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Order Detail Dialog
function OrderDetailDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>订单详情</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Customer Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />客户信息
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">客户姓名</p>
                <p className="text-xs font-medium">{order.customer}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">联系电话</p>
                <p className="text-xs font-medium">{order.phone}</p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground">服务地址</p>
              <p className="text-xs font-medium">{order.address}</p>
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />服务信息
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">服务类型</p>
                <p className="text-xs font-medium">{order.serviceType}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">服务内容</p>
                <p className="text-xs font-medium">{order.service}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">开始日期</p>
                <p className="text-xs font-medium">{order.startDate}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">结束日期</p>
                <p className="text-xs font-medium">{order.endDate}</p>
              </div>
            </div>
          </div>

          {/* Staff Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-primary" />服务人员
            </h4>
            {order.staff !== "待分配" && order.staff !== "-" ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{order.staff.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{order.staff}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>{order.staffRating}分</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />暂未分配服务人员
                </p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-primary" />费用信息
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">订单金额</p>
                <p className="text-xs font-bold text-primary">¥{order.amount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">已支付</p>
                <p className="text-xs font-medium text-emerald-600">¥{order.paidAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">待支付</p>
                <p className={cn("text-xs font-medium", order.amount - order.paidAmount > 0 ? "text-red-600" : "")}>
                  ¥{(order.amount - order.paidAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Other Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">其他信息</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">订单来源</p>
                <p className="text-xs font-medium">{order.source}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">销售顾问</p>
                <p className="text-xs font-medium">{order.consultant}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">创建时间</p>
                <p className="text-xs font-medium">{order.createTime.split(" ")[0]}</p>
              </div>
            </div>
            {order.notes && (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-[10px] text-amber-600 mb-0.5">备注</p>
                <p className="text-xs text-amber-800">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" asChild>
              <Link href={`/orders/${order.id}`}><Eye className="h-3 w-3 mr-1" />查看完整</Link>
            </Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Edit className="h-3 w-3 mr-1" />编辑</Button>
              <Button size="sm" className="h-7 text-xs"><FileSignature className="h-3 w-3 mr-1" />生成合同</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Assign Staff Dialog
function AssignStaffDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><UserPlus className="h-3 w-3 mr-1" />分配</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            分配服务人员
          </DialogTitle>
          <DialogDescription className="text-xs">为订单 {order.id} 分配服务人员</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 space-y-3">
          <div className="p-2 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground">服务内容</p>
            <p className="text-xs font-medium">{order.service}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{order.startDate} ~ {order.endDate}</p>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">选择服务人员</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择服务人员" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">李春华 - 金牌月嫂 (4.9分)</SelectItem>
                <SelectItem value="2">张美玲 - 高级月嫂 (4.8分)</SelectItem>
                <SelectItem value="3">陈桂芳 - 金牌月嫂 (5.0分)</SelectItem>
                <SelectItem value="4">王秀兰 - 高级产康师 (4.9分)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">备注说明</Label>
            <Textarea placeholder="填写分配备注..." className="text-xs min-h-16 resize-none" />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><UserPlus className="h-3 w-3 mr-1" />确认分配</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Cancel Order Dialog
function CancelOrderDialog({ order, trigger }: { order: Order; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50"><Ban className="h-3 w-3 mr-1" />取消</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm flex items-center gap-2 text-red-600">
            <Ban className="h-4 w-4" />
            取消订单
          </DialogTitle>
          <DialogDescription className="text-xs">确定要取消订单 {order.id} 吗？</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700">
                <p className="font-medium mb-1">取消订单将产生以下影响：</p>
                <ul className="list-disc list-inside space-y-0.5 text-red-600">
                  <li>订单状态变更为"已取消"</li>
                  <li>已分配的服务人员将被释放</li>
                  <li>如有预付款项需要处理退款</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">取消原因</Label>
            <Select>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="请选择取消原因" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">客户主动取消</SelectItem>
                <SelectItem value="2">无法安排服务人员</SelectItem>
                <SelectItem value="3">客户联系不上</SelectItem>
                <SelectItem value="4">其他原因</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">详细说明</Label>
            <Textarea placeholder="填写取消原因详情..." className="text-xs min-h-16 resize-none" />
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">返回</Button>
          <Button variant="destructive" size="sm" className="h-7 text-xs"><Ban className="h-3 w-3 mr-1" />确认取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [payFilter, setPayFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = activeTab === "all" || o.status === activeTab
      const matchService = serviceFilter === "all" || o.serviceType === serviceFilter
      const matchPay = payFilter === "all" || o.payStatus === payFilter
      const matchSearch = !searchTerm || o.id.includes(searchTerm) || o.customer.includes(searchTerm) || o.service.includes(searchTerm)
      return matchStatus && matchService && matchPay && matchSearch
    })
  }, [activeTab, serviceFilter, payFilter, searchTerm])

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => o.status === "active").length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0),
    paidAmount: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.paidAmount, 0),
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">服务订单</h1>
            <p className="text-xs text-muted-foreground">管理月嫂、育婴师、产康等家庭服务订单</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{stats.total}订单</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-blue-500" />{stats.active}服务中</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />{stats.pending}待服务</span>
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-emerald-500" />¥{(stats.totalAmount / 10000).toFixed(1)}万</span>
            </div>
          </div>
<CreateServiceOrderDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-2">
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10"><FileText className="h-3.5 w-3.5 text-primary" /></div>
              <div>
                <p className="text-sm font-bold">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">全部订单</p>
              </div>
            </div>
          </Card>
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /></div>
              <div>
                <p className="text-sm font-bold">{stats.active}</p>
                <p className="text-[10px] text-muted-foreground">服务中</p>
              </div>
            </div>
          </Card>
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div>
              <div>
                <p className="text-sm font-bold">{stats.pending}</p>
                <p className="text-[10px] text-muted-foreground">待服务</p>
              </div>
            </div>
          </Card>
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div>
              <div>
                <p className="text-sm font-bold">{stats.completed}</p>
                <p className="text-[10px] text-muted-foreground">已完成</p>
              </div>
            </div>
          </Card>
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
              <div>
                <p className="text-sm font-bold">¥{(stats.totalAmount / 10000).toFixed(1)}万</p>
                <p className="text-[10px] text-muted-foreground">订单总额</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="active" className="text-xs h-6">服务中 ({stats.active})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待服务 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs h-6">已完成 ({stats.completed})</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs h-6">已取消 ({stats.cancelled})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索订单..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="月嫂服务">月嫂服务</SelectItem>
                  <SelectItem value="产康服务">产康服务</SelectItem>
                  <SelectItem value="育婴服务">育婴服务</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payFilter} onValueChange={setPayFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">支付状态</SelectItem>
                  <SelectItem value="unpaid">未支付</SelectItem>
                  <SelectItem value="partial">部分付</SelectItem>
                  <SelectItem value="paid">已付清</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-28">订单号</TableHead>
                    <TableHead className="text-xs">客户/服务</TableHead>
                    <TableHead className="text-xs w-20">服务类型</TableHead>
                    <TableHead className="text-xs">服务人员</TableHead>
                    <TableHead className="text-xs">服务周期</TableHead>
                    <TableHead className="text-xs">金额/支付</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs w-56">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-mono text-[10px] text-muted-foreground">{order.id}</p>
                          <p className="text-[10px] text-muted-foreground">{order.createTime.split(" ")[0]}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{order.customer.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium">{order.customer}</p>
                              <p className="text-[10px] text-muted-foreground">{order.service}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", 
                            order.serviceType === "月嫂服务" ? "bg-rose-50 text-rose-700 border-rose-200" :
                            order.serviceType === "产康服务" ? "bg-teal-50 text-teal-700 border-teal-200" :
                            "bg-cyan-50 text-cyan-700 border-cyan-200"
                          )}>
                            {order.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.staff !== "待分配" && order.staff !== "-" ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px]">{order.staff.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs">{order.staff}</p>
                                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />{order.staffRating}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">
                              待分配
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">{order.startDate}</p>
                          <p className="text-[10px] text-muted-foreground">至 {order.endDate}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-bold text-primary">¥{order.amount.toLocaleString()}</p>
                          <Badge variant="outline" className={cn("text-[10px] h-4", payStatusConfig[order.payStatus].color)}>
                            {payStatusConfig[order.payStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* Always visible: View Detail */}
                            <OrderDetailDialog order={order} trigger={
                              <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-1" />详情</Button>
                            } />
                            
                            {/* Key actions based on status */}
                            {order.status === "pending" && order.staff === "待分配" && (
                              <AssignStaffDialog order={order} trigger={
                                <Button size="sm" className="h-6 text-[10px]"><UserPlus className="h-3 w-3 mr-1" />分配人员</Button>
                              } />
                            )}
                            
                            {order.status === "pending" && order.staff !== "待分配" && (
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><FileSignature className="h-3 w-3 mr-1" />生成合同</Button>
                            )}
                            
                            {order.status === "active" && (
                              <>
                                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Phone className="h-3 w-3 mr-1" />联系</Button>
                                <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><MessageSquare className="h-3 w-3 mr-1" />回访</Button>
                              </>
                            )}
                            
                            {order.status === "completed" && (
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Star className="h-3 w-3 mr-1" />查看评价</Button>
                            )}
                            
                            {(order.status === "pending" || order.status === "active") && (
                              <>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Edit className="h-3 w-3 mr-1" />编辑</Button>
                                <CancelOrderDialog order={order} />
                              </>
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
              显示 {filteredOrders.length} / {orders.length} 条订单
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
