"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Search, BookOpen, Package, CheckCircle2, Clock, AlertCircle, XCircle,
  Download, Eye, MoreHorizontal, FileText, Calendar, User, Plus,
  ArrowDownToLine, ArrowUpFromLine, BarChart3, Edit, Trash2
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================

// 物料类型
type MaterialCategory = "textbook" | "uniform" | "stationery" | "other"
const materialCategoryConfig: Record<MaterialCategory, { label: string; color: string }> = {
  textbook: { label: "教材", color: "bg-blue-100 text-blue-700" },
  uniform: { label: "校服", color: "bg-purple-100 text-purple-700" },
  stationery: { label: "文具", color: "bg-amber-100 text-amber-700" },
  other: { label: "其他", color: "bg-gray-100 text-gray-700" },
}

interface MaterialOutbound {
  id: string
  studentName: string
  studentPhone: string
  courseName: string
  className: string
  materials: { name: string; quantity: number; unit: string; category: MaterialCategory; isFree: boolean; price: number }[]
  consultantName: string
  courseDate: string
  consumeDate: string | null
  outboundDate: string | null
  status: "pending_consume" | "pending_confirm" | "confirmed" | "cancelled"
  warehouseNote: string
  totalAmount: number
  paymentStatus: "free" | "unpaid" | "paid"
}

interface MaterialConfig {
  id: string
  courseName: string
  materials: { name: string; quantity: number; unit: string; category: MaterialCategory; cost: number; isFree: boolean }[]
  totalCost: number
  status: "active" | "inactive"
  updatedAt: string
}

// ==================== Mock数据 ====================
const outboundRecords: MaterialOutbound[] = [
  {
    id: "TBO-20250201001",
    studentName: "李春华",
    studentPhone: "138****5678",
    courseName: "高级月嫂培训",
    className: "2025年第3期",
    materials: [
      { name: "高级月嫂护理教材", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "月子餐营养指南", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "培训校服（夏装）", quantity: 1, unit: "套", category: "uniform", isFree: false, price: 120 },
      { name: "笔记本", quantity: 2, unit: "本", category: "stationery", isFree: true, price: 0 },
      { name: "签字笔", quantity: 2, unit: "支", category: "stationery", isFree: true, price: 0 },
    ],
    consultantName: "周顾问",
    courseDate: "2025-02-10",
    consumeDate: "2025-02-10",
    outboundDate: "2025-02-10",
    status: "confirmed",
    warehouseNote: "已核对领取",
    totalAmount: 120,
    paymentStatus: "paid",
  },
  {
    id: "TBO-20250201002",
    studentName: "王秀兰",
    studentPhone: "139****1234",
    courseName: "产康师初级认证",
    className: "2025年第2期",
    materials: [
      { name: "产后康复理论与实操", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "经络与穴位图谱", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "培训校服（夏装）", quantity: 1, unit: "套", category: "uniform", isFree: false, price: 120 },
      { name: "笔记本", quantity: 1, unit: "本", category: "stationery", isFree: true, price: 0 },
    ],
    consultantName: "孙顾问",
    courseDate: "2025-02-12",
    consumeDate: "2025-02-12",
    outboundDate: null,
    status: "pending_confirm",
    warehouseNote: "",
    totalAmount: 120,
    paymentStatus: "unpaid",
  },
  {
    id: "TBO-20250201003",
    studentName: "张美玲",
    studentPhone: "137****9876",
    courseName: "育婴师专业班",
    className: "2025年第1期",
    materials: [
      { name: "育婴师专业教材", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "婴幼儿早教指南", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "培训校服（冬装）", quantity: 1, unit: "套", category: "uniform", isFree: false, price: 150 },
      { name: "笔记本", quantity: 2, unit: "本", category: "stationery", isFree: true, price: 0 },
      { name: "签字笔", quantity: 3, unit: "支", category: "stationery", isFree: true, price: 0 },
    ],
    consultantName: "周顾问",
    courseDate: "2025-02-15",
    consumeDate: null,
    outboundDate: null,
    status: "pending_consume",
    warehouseNote: "",
    totalAmount: 150,
    paymentStatus: "unpaid",
  },
  {
    id: "TBO-20250201004",
    studentName: "陈桂芳",
    studentPhone: "135****5555",
    courseName: "高级月嫂培训",
    className: "2025年第3期",
    materials: [
      { name: "高级月嫂护理教材", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "月子餐营养指南", quantity: 1, unit: "本", category: "textbook", isFree: true, price: 0 },
      { name: "笔记本", quantity: 2, unit: "本", category: "stationery", isFree: true, price: 0 },
    ],
    consultantName: "孙顾问",
    courseDate: "2025-02-10",
    consumeDate: "2025-02-10",
    outboundDate: "2025-02-10",
    status: "confirmed",
    warehouseNote: "已核对领取（学员自带校服）",
    totalAmount: 0,
    paymentStatus: "free",
  },
]

const materialConfigs: MaterialConfig[] = [
  { 
    id: "TC001", 
    courseName: "高级月嫂培训", 
    materials: [
      { name: "高级月嫂护理教材", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "月子餐营养指南", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "新生儿护理手册", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "培训校服（夏装）", quantity: 1, unit: "套", category: "uniform", cost: 120, isFree: false },
      { name: "笔记本", quantity: 2, unit: "本", category: "stationery", cost: 0, isFree: true },
      { name: "签字笔", quantity: 2, unit: "支", category: "stationery", cost: 0, isFree: true },
    ], 
    totalCost: 120, 
    status: "active", 
    updatedAt: "2025-01-15" 
  },
  { 
    id: "TC002", 
    courseName: "产康师初级认证", 
    materials: [
      { name: "产后康复理论与实操", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "经络与穴位图谱", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "培训校服（夏装）", quantity: 1, unit: "套", category: "uniform", cost: 120, isFree: false },
      { name: "笔记本", quantity: 1, unit: "本", category: "stationery", cost: 0, isFree: true },
    ], 
    totalCost: 120, 
    status: "active", 
    updatedAt: "2025-01-15" 
  },
  { 
    id: "TC003", 
    courseName: "育婴师专业班", 
    materials: [
      { name: "育婴师专业教材", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "婴幼儿早教指南", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "培训校服（冬装）", quantity: 1, unit: "套", category: "uniform", cost: 150, isFree: false },
      { name: "笔记本", quantity: 2, unit: "本", category: "stationery", cost: 0, isFree: true },
    ], 
    totalCost: 150, 
    status: "active", 
    updatedAt: "2025-01-15" 
  },
  { 
    id: "TC004", 
    courseName: "催乳师培训", 
    materials: [
      { name: "催乳师基础教程", quantity: 1, unit: "本", category: "textbook", cost: 0, isFree: true },
      { name: "笔记本", quantity: 1, unit: "本", category: "stationery", cost: 0, isFree: true },
    ], 
    totalCost: 0, 
    status: "active", 
    updatedAt: "2025-01-15" 
  },
]

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending_consume: { label: "待销课", className: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  pending_confirm: { label: "待库管确认", className: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
  confirmed: { label: "已确认", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
}

// ==================== 页面组件 ====================
export default function MaterialCollectionPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailRecord, setDetailRecord] = useState<MaterialOutbound | null>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<MaterialConfig | null>(null)
  const [editConfigDialogOpen, setEditConfigDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<{
    courseName: string
    materials: { name: string; quantity: number; unit: string; category: MaterialCategory; cost: number; isFree: boolean }[]
    status: "active" | "inactive"
  }>({ courseName: "", materials: [], status: "active" })

  // 打开编辑配置对话框
  const handleEditConfig = (config: MaterialConfig) => {
    setEditingConfig(config)
    setEditFormData({
      courseName: config.courseName,
      materials: [...config.materials],
      status: config.status,
    })
    setEditConfigDialogOpen(true)
  }

  // 添加物料项
  const handleAddMaterial = () => {
    setEditFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: "", quantity: 1, unit: "个", category: "other", cost: 0, isFree: true }]
    }))
  }

  // 删除物料项
  const handleRemoveMaterial = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  // 更新物料项
  const handleUpdateMaterial = (index: number, field: string, value: string | number | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      materials: prev.materials.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }))
  }

  const filteredRecords = useMemo(() => {
    return outboundRecords.filter(r => {
      const matchSearch = !search || r.studentName.includes(search) || r.id.includes(search) || r.courseName.includes(search)
      const matchStatus = statusFilter === "all" || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">培训物料领取</h1>
            <p className="text-muted-foreground">学员培训物料出库与领取管理（教材、校服、笔记本、笔等），销课后自动生成出库单</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent" onClick={() => setConfigDialogOpen(true)}>
              <Package className="h-4 w-4 mr-2" />
              物料配置
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* 筛选 */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索学员姓名 / 出库单号 / 课程..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending_consume">待销课</SelectItem>
                <SelectItem value="pending_confirm">待库管确认</SelectItem>
                <SelectItem value="confirmed">已确认</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* 出库单列表 */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">出库单号</TableHead>
                  <TableHead>学员</TableHead>
                  <TableHead>课程/班级</TableHead>
                  <TableHead>物料清单</TableHead>
                  <TableHead className="w-24">费用</TableHead>
                  <TableHead className="w-28">上课日期</TableHead>
                  <TableHead className="w-24">状态</TableHead>
                  <TableHead className="w-20 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => {
                  const st = statusConfig[record.status]
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{record.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{record.studentName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{record.studentName}</div>
                            <div className="text-xs text-muted-foreground">{record.studentPhone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{record.courseName}</div>
                        <div className="text-xs text-muted-foreground">{record.className}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {record.materials.slice(0, 3).map((m, i) => (
                            <Badge key={i} variant="secondary" className={cn("text-[10px]", materialCategoryConfig[m.category].color)}>
                              {m.name} x{m.quantity}
                            </Badge>
                          ))}
                          {record.materials.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">+{record.materials.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.totalAmount > 0 ? (
                          <div>
                            <div className="text-sm font-medium">¥{record.totalAmount}</div>
                            <Badge variant="outline" className={cn("text-[10px]", 
                              record.paymentStatus === "paid" ? "bg-green-50 text-green-700" : 
                              record.paymentStatus === "unpaid" ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-600"
                            )}>
                              {record.paymentStatus === "paid" ? "已付" : record.paymentStatus === "unpaid" ? "待付" : "免费"}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600">免费</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{record.courseDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", st.className)}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailRecord(record)}>
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                            {record.status === "pending_confirm" && (
                              <DropdownMenuItem>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                确认出库
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 出库单详情弹窗 */}
        <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base">出库单详情</DialogTitle>
              <DialogDescription className="text-xs">单号: {detailRecord?.id}</DialogDescription>
            </DialogHeader>
            {detailRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">学员：</span><span className="font-medium">{detailRecord.studentName}</span></div>
                  <div><span className="text-muted-foreground">电话：</span>{detailRecord.studentPhone}</div>
                  <div><span className="text-muted-foreground">课程：</span>{detailRecord.courseName}</div>
                  <div><span className="text-muted-foreground">班级：</span>{detailRecord.className}</div>
                  <div><span className="text-muted-foreground">顾问：</span>{detailRecord.consultantName}</div>
                  <div><span className="text-muted-foreground">上课日期：</span>{detailRecord.courseDate}</div>
                  <div><span className="text-muted-foreground">销课日期：</span>{detailRecord.consumeDate || "待销课"}</div>
                  <div><span className="text-muted-foreground">出库日期：</span>{detailRecord.outboundDate || "未出库"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">物料清单</Label>
                  <Table>
                    <TableHeader><TableRow><TableHead className="text-xs">物料名称</TableHead><TableHead className="text-xs w-16">类型</TableHead><TableHead className="text-xs w-16">数量</TableHead><TableHead className="text-xs w-16">费用</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {detailRecord.materials.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{m.name}</TableCell>
                          <TableCell><Badge variant="secondary" className={cn("text-[10px]", materialCategoryConfig[m.category].color)}>{materialCategoryConfig[m.category].label}</Badge></TableCell>
                          <TableCell className="text-sm">{m.quantity}{m.unit}</TableCell>
                          <TableCell className="text-sm">{m.isFree ? "免费" : `¥${m.price}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs text-muted-foreground">状态</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={cn("text-xs", statusConfig[detailRecord.status].className)}>{statusConfig[detailRecord.status].label}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs text-muted-foreground">费用合计</Label>
                    <div className="mt-1">
                      {detailRecord.totalAmount > 0 ? (
                        <span className="font-bold text-primary">¥{detailRecord.totalAmount}</span>
                      ) : (
                        <span className="text-muted-foreground">全部免费</span>
                      )}
                      {detailRecord.totalAmount > 0 && (
                        <Badge variant="outline" className={cn("ml-2 text-[10px]", 
                          detailRecord.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {detailRecord.paymentStatus === "paid" ? "已付款" : "待付款"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  流程说明：学员完成首日课程 &rarr; 顾问在系统中销课 &rarr; 系统自动生成物料出库单 &rarr; 库管核对后确认出库。教材费用已包含在培训订单中，校服等收费物料需单独付款。
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 物料配置弹窗 */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-base">物料配置</DialogTitle>
              <DialogDescription className="text-xs">配置各课程对应的物料清单（教材、校服、笔记本、笔等），销课后系统将按此配置自动生成出库单</DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>课程名称</TableHead>
                    <TableHead>物料清单</TableHead>
                    <TableHead className="w-24 text-right">收费金额</TableHead>
                    <TableHead className="w-16">状态</TableHead>
                    <TableHead className="w-24">更新时间</TableHead>
                    <TableHead className="w-20 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialConfigs.map(cfg => (
                    <TableRow key={cfg.id}>
                      <TableCell className="font-medium text-sm">{cfg.courseName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cfg.materials.map((m, i) => (
                            <Badge key={i} variant="secondary" className={cn("text-[10px]", materialCategoryConfig[m.category].color)}>
                              {m.name} {m.isFree ? "(免费)" : `(¥${m.cost})`}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {cfg.totalCost > 0 ? `¥${cfg.totalCost}` : "全部免费"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]" : "text-[10px]"}>
                          {cfg.status === "active" ? "启用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{cfg.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditConfig(cfg)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setConfigDialogOpen(false)}>关闭</Button>
              <Button onClick={() => {
                setEditingConfig(null)
                setEditFormData({ courseName: "", materials: [], status: "active" })
                setEditConfigDialogOpen(true)
              }}><Plus className="h-4 w-4 mr-2" />新增配置</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 编辑/新增配置对话框 */}
        <Dialog open={editConfigDialogOpen} onOpenChange={setEditConfigDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-base">{editingConfig ? "编辑物料配置" : "新增物料配置"}</DialogTitle>
              <DialogDescription className="text-xs">
                {editingConfig ? `编辑【${editingConfig.courseName}】的物料清单配置` : "为课程配置物料清单，销课后系统将自动生成出库单"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              {/* 课程名称 */}
              <div className="space-y-2">
                <Label className="text-sm">课程名称</Label>
                <Input
                  value={editFormData.courseName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  placeholder="请输入课程名称"
                  disabled={!!editingConfig}
                />
              </div>

              {/* 状态开关 */}
              <div className="flex items-center justify-between">
                <Label className="text-sm">启用状态</Label>
                <Switch
                  checked={editFormData.status === "active"}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, status: checked ? "active" : "inactive" }))}
                />
              </div>

              {/* 物料清单 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">物料清单</Label>
                  <Button variant="outline" size="sm" onClick={handleAddMaterial}>
                    <Plus className="h-3.5 w-3.5 mr-1" />添加物料
                  </Button>
                </div>
                
                {editFormData.materials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg bg-muted/30">
                    暂无物料，点击"添加物料"开始配置
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editFormData.materials.map((material, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/20">
                        <div className="flex-1 grid grid-cols-6 gap-2">
                          <div className="col-span-2">
                            <Input
                              value={material.name}
                              onChange={(e) => handleUpdateMaterial(index, "name", e.target.value)}
                              placeholder="物料名称"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="col-span-1">
                            <Select
                              value={material.category}
                              onValueChange={(v) => handleUpdateMaterial(index, "category", v as MaterialCategory)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="textbook">教材</SelectItem>
                                <SelectItem value="uniform">校服</SelectItem>
                                <SelectItem value="stationery">文具</SelectItem>
                                <SelectItem value="other">其他</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1 flex items-center gap-1">
                            <Input
                              type="number"
                              value={material.quantity}
                              onChange={(e) => handleUpdateMaterial(index, "quantity", parseInt(e.target.value) || 1)}
                              className="h-8 text-sm w-14"
                              min={1}
                            />
                            <Input
                              value={material.unit}
                              onChange={(e) => handleUpdateMaterial(index, "unit", e.target.value)}
                              className="h-8 text-sm w-12"
                              placeholder="单位"
                            />
                          </div>
                          <div className="col-span-1 flex items-center gap-2">
                            <Checkbox
                              id={`free-${index}`}
                              checked={material.isFree}
                              onCheckedChange={(checked) => {
                                handleUpdateMaterial(index, "isFree", !!checked)
                                if (checked) handleUpdateMaterial(index, "cost", 0)
                              }}
                            />
                            <Label htmlFor={`free-${index}`} className="text-xs">免费</Label>
                          </div>
                          <div className="col-span-1">
                            {!material.isFree && (
                              <Input
                                type="number"
                                value={material.cost}
                                onChange={(e) => handleUpdateMaterial(index, "cost", parseFloat(e.target.value) || 0)}
                                className="h-8 text-sm"
                                placeholder="价格"
                                min={0}
                              />
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 费用汇总 */}
              {editFormData.materials.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">收费物料合计</span>
                  <span className="font-bold text-primary">
                    ¥{editFormData.materials.filter(m => !m.isFree).reduce((sum, m) => sum + m.cost * m.quantity, 0)}
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setEditConfigDialogOpen(false)}>取消</Button>
              <Button onClick={() => {
                // TODO: 保存配置
                console.log("[v0] Saving config:", editFormData)
                setEditConfigDialogOpen(false)
              }}>
                {editingConfig ? "保存修改" : "创建配置"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
