"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  MessageSquare, 
  FileText, 
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Heart,
  Globe,
  Merge,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  gender: "male" | "female"
  status: "active" | "inactive" | "potential"
  source: "转介绍" | "自拓" | "线上" | "线下" // 一级来源渠道
  sourceSubCategory: string // 二级来源渠道（如：美团/抖音/小红书/官网/百度/老客户推荐/朋友介绍/自己开发/地推/活动等）
  sourceDetail: string // 来源详情/备注
  consultant: string
  orderCount: number
  totalValue: number
  lastOrder: string
  createdAt: string
  tags: string[]
  // 新增字段
  progress: "新线索" | "初次联系" | "需求确认" | "方案报价" | "商务洽谈" | "签约成交" | "流失" // 客户进展
  lastContactTime: string // 最后联系时间
  uncontactedDays: number // 未联系天数
  contactCount: number // 联系次数
  intentionLevel: "A-高意向" | "B-中意向" | "C-低意向" | "D-无意向" // 意向度
  companyId: string // 分公司ID
  belongDepartment: string // 归属部门
}

const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "刘女士",
    phone: "138****5678",
    gender: "female",
    status: "active",
    source: "线上",
    sourceSubCategory: "美团",
    sourceDetail: "美团推广活动引流",
    consultant: "张顾问",
    orderCount: 3,
    totalValue: 28800,
    lastOrder: "2025-01-20",
    createdAt: "2024-10-15",
    tags: ["高净值", "复购客户"],
    progress: "签约成交",
    lastContactTime: "2025-01-20 14:30",
    uncontactedDays: 2,
    contactCount: 15,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C002",
    name: "陈先生",
    phone: "139****1234",
    gender: "male",
    status: "active",
    source: "转介绍",
    sourceSubCategory: "朋友介绍",
    sourceDetail: "老客户刘女士介绍",
    consultant: "李顾问",
    orderCount: 1,
    totalValue: 9600,
    lastOrder: "2025-01-18",
    createdAt: "2025-01-10",
    tags: ["新客户"],
    progress: "签约成交",
    lastContactTime: "2025-01-18 10:00",
    uncontactedDays: 4,
    contactCount: 6,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C003",
    name: "王女士",
    phone: "137****9876",
    gender: "female",
    status: "inactive",
    source: "线上",
    sourceSubCategory: "抖音",
    sourceDetail: "抖音广告投放",
    consultant: "张顾问",
    orderCount: 2,
    totalValue: 18200,
    lastOrder: "2024-08-05",
    createdAt: "2024-06-20",
    tags: ["沉默客户"],
    progress: "签约成交",
    lastContactTime: "2024-08-05 16:00",
    uncontactedDays: 168,
    contactCount: 8,
    intentionLevel: "C-低意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C004",
    name: "赵女士",
    phone: "135****4567",
    gender: "female",
    status: "active",
    source: "线上",
    sourceSubCategory: "小红书",
    sourceDetail: "小红书种草笔记",
    consultant: "王顾问",
    orderCount: 5,
    totalValue: 52000,
    lastOrder: "2025-01-22",
    createdAt: "2024-03-10",
    tags: ["高净值", "VIP", "复购客户"],
    progress: "签约成交",
    lastContactTime: "2025-01-22 09:30",
    uncontactedDays: 0,
    contactCount: 32,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C005",
    name: "孙先生",
    phone: "136****8901",
    gender: "male",
    status: "potential",
    source: "线上",
    sourceSubCategory: "官网",
    sourceDetail: "官网在线咨询",
    consultant: "李顾问",
    orderCount: 0,
    totalValue: 0,
    lastOrder: "-",
    createdAt: "2025-01-22",
    tags: ["潜在客户"],
    progress: "初次联系",
    lastContactTime: "2025-01-22 11:00",
    uncontactedDays: 0,
    contactCount: 2,
    intentionLevel: "B-中意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C006",
    name: "周女士",
    phone: "133****2345",
    gender: "female",
    status: "active",
    source: "线上",
    sourceSubCategory: "百度",
    sourceDetail: "百度SEM推广",
    consultant: "张顾问",
    orderCount: 2,
    totalValue: 22400,
    lastOrder: "2025-01-15",
    createdAt: "2024-11-08",
    tags: ["复购客户"],
    progress: "签约成交",
    lastContactTime: "2025-01-15 15:20",
    uncontactedDays: 7,
    contactCount: 12,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C007",
    name: "钱先生",
    phone: "158****6789",
    gender: "male",
    status: "active",
    source: "自拓",
    sourceSubCategory: "自己开发",
    sourceDetail: "顾问主动开发",
    consultant: "李顾问",
    orderCount: 1,
    totalValue: 15000,
    lastOrder: "2025-01-10",
    createdAt: "2025-01-05",
    tags: ["自拓客户"],
    progress: "签约成交",
    lastContactTime: "2025-01-10 14:00",
    uncontactedDays: 12,
    contactCount: 5,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C008",
    name: "吴女士",
    phone: "186****0123",
    gender: "female",
    status: "potential",
    source: "线下",
    sourceSubCategory: "地推",
    sourceDetail: "社区地推活动",
    consultant: "张顾问",
    orderCount: 0,
    totalValue: 0,
    lastOrder: "-",
    createdAt: "2025-01-20",
    tags: ["潜在客户", "线下"],
    progress: "需求确认",
    lastContactTime: "2025-01-21 10:30",
    uncontactedDays: 1,
    contactCount: 3,
    intentionLevel: "B-中意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C009",
    name: "郑女士",
    phone: "139****4567",
    gender: "female",
    status: "active",
    source: "转介绍",
    sourceSubCategory: "老客户推荐",
    sourceDetail: "赵女士推荐",
    consultant: "王顾问",
    orderCount: 2,
    totalValue: 26000,
    lastOrder: "2025-01-19",
    createdAt: "2024-12-15",
    tags: ["转介绍", "高净值"],
    progress: "签约成交",
    lastContactTime: "2025-01-19 16:00",
    uncontactedDays: 3,
    contactCount: 10,
    intentionLevel: "A-高意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
  {
    id: "C010",
    name: "冯先生",
    phone: "137****8901",
    gender: "male",
    status: "potential",
    source: "线下",
    sourceSubCategory: "活动",
    sourceDetail: "母婴展会",
    consultant: "李顾问",
    orderCount: 0,
    totalValue: 0,
    lastOrder: "-",
    createdAt: "2025-01-18",
    tags: ["潜在客户", "活动"],
    progress: "方案报价",
    lastContactTime: "2025-01-20 11:00",
    uncontactedDays: 2,
    contactCount: 4,
    intentionLevel: "B-中意向",
    companyId: "YC001",
    belongDepartment: "居家服务事业部",
  },
]

const statusConfig = {
  active: { label: "活跃", className: "bg-green-50 text-green-600 border-green-200" },
  inactive: { label: "沉默", className: "bg-gray-50 text-gray-600 border-gray-200" },
  potential: { label: "潜在", className: "bg-blue-50 text-blue-600 border-blue-200" },
}

// ==================== 客户合并弹窗 ====================
function MergeCustomersDialog({ 
  customers, 
  open, 
  onOpenChange 
}: { 
  customers: Customer[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [primaryId, setPrimaryId] = useState(customers[0]?.id || "")
  const [step, setStep] = useState<"select" | "preview" | "done">("select")

  const primary = customers.find(c => c.id === primaryId)
  const others = customers.filter(c => c.id !== primaryId)

  // 合并字段逻辑：相同字段都有数据时用分号分隔
  const mergeField = (field: keyof Customer) => {
    const values = customers.map(c => String(c[field] || "")).filter(Boolean)
    const unique = [...new Set(values)]
    return unique.join("; ")
  }

  const mergedPreview = primary ? {
    name: primary.name,
    phone: mergeField("phone"),
    source: mergeField("source"),
    sourceSubCategory: mergeField("sourceSubCategory"),
    consultant: mergeField("consultant"),
    tags: [...new Set(customers.flatMap(c => c.tags))],
    orderCount: customers.reduce((sum, c) => sum + c.orderCount, 0),
    totalValue: customers.reduce((sum, c) => sum + c.totalValue, 0),
    contactCount: customers.reduce((sum, c) => sum + c.contactCount, 0),
    belongDepartment: mergeField("belongDepartment"),
  } : null

  const mergeFields: { label: string; key: keyof Customer }[] = [
    { label: "手机号", key: "phone" },
    { label: "一级来源", key: "source" },
    { label: "二级渠道", key: "sourceSubCategory" },
    { label: "来源详情", key: "sourceDetail" },
    { label: "顾问", key: "consultant" },
    { label: "归属部门", key: "belongDepartment" },
    { label: "意向等级", key: "intentionLevel" },
    { label: "客户进展", key: "progress" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-3 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Merge className="h-4 w-4 text-primary" />
            客户信息合并
          </DialogTitle>
          <DialogDescription className="text-xs">
            将{customers.length}条重复客户记录合并为一条，合并后相同字段数据以分号分隔保留，所有动态信息一同合并
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {step === "select" && (
              <>
                {/* 警告提示 */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800 space-y-1">
                      <p className="font-medium">合并操作不可撤销，请谨慎操作</p>
                      <p>合并后，被合并客户的全部跟进记录、订单记录、标签等动态信息将归入主客户名下</p>
                    </div>
                  </div>
                </div>

                {/* 选择主客户 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">选择主客户（合并后保留此客户）</Label>
                  <div className="space-y-2">
                    {customers.map(c => (
                      <div 
                        key={c.id}
                        onClick={() => setPrimaryId(c.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          primaryId === c.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            checked={primaryId === c.id} 
                            onChange={() => setPrimaryId(c.id)} 
                            className="h-4 w-4 text-primary"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {c.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{c.name}</span>
                              <span className="text-xs text-muted-foreground">{c.phone}</span>
                              {primaryId === c.id && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">主客户</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span>{c.consultant}</span>
                              <span>{c.source}-{c.sourceSubCategory}</span>
                              <span>{c.orderCount}单 / ¥{c.totalValue.toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${statusConfig[c.status].className}`}>
                            {statusConfig[c.status].label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2 ml-14">
                          {c.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === "preview" && mergedPreview && (
              <>
                {/* 合并前后对比 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">字段合并预览</Label>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs w-24">字段</TableHead>
                          {customers.map(c => (
                            <TableHead key={c.id} className="text-xs">
                              {c.name} {c.id === primaryId && <Badge className="text-[10px] ml-1 px-1 py-0 bg-primary/10 text-primary border-primary/20">主</Badge>}
                            </TableHead>
                          ))}
                          <TableHead className="text-xs bg-emerald-50 text-emerald-700">合并结果</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mergeFields.map(field => {
                          const merged = mergeField(field.key)
                          return (
                            <TableRow key={field.key}>
                              <TableCell className="text-xs font-medium text-muted-foreground">{field.label}</TableCell>
                              {customers.map(c => (
                                <TableCell key={c.id} className="text-xs">{String(c[field.key] || "-")}</TableCell>
                              ))}
                              <TableCell className="text-xs font-medium bg-emerald-50/50 text-emerald-700">{merged || "-"}</TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow>
                          <TableCell className="text-xs font-medium text-muted-foreground">标签</TableCell>
                          {customers.map(c => (
                            <TableCell key={c.id}>
                              <div className="flex flex-wrap gap-0.5">{c.tags.map((t, i) => <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">{t}</Badge>)}</div>
                            </TableCell>
                          ))}
                          <TableCell className="bg-emerald-50/50">
                            <div className="flex flex-wrap gap-0.5">{mergedPreview.tags.map((t, i) => <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">{t}</Badge>)}</div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium text-muted-foreground">累计订单</TableCell>
                          {customers.map(c => (
                            <TableCell key={c.id} className="text-xs">{c.orderCount}单</TableCell>
                          ))}
                          <TableCell className="text-xs font-medium bg-emerald-50/50 text-emerald-700">{mergedPreview.orderCount}单</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium text-muted-foreground">累计消费</TableCell>
                          {customers.map(c => (
                            <TableCell key={c.id} className="text-xs">¥{c.totalValue.toLocaleString()}</TableCell>
                          ))}
                          <TableCell className="text-xs font-medium bg-emerald-50/50 text-primary">¥{mergedPreview.totalValue.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 动态信息汇总 */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <h4 className="text-xs font-medium text-blue-800 mb-2">动态信息合并说明</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>- 全部跟进记录（{customers.reduce((s, c) => s + c.contactCount, 0)}条）将合并至主客户名下</p>
                    <p>- 全部订单记录（{mergedPreview.orderCount}单）将合并至主客户名下</p>
                    <p>- 全部标签（{mergedPreview.tags.length}个）将合并至主客户名下</p>
                    <p>- 被合并客户记录将标记为"已合并"状态，不再显示在列表中</p>
                  </div>
                </div>
              </>
            )}

            {step === "done" && (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">客户合并成功</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    已将{others.length}条记录合并至 <span className="font-medium text-foreground">{primary?.name}</span> 名下
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        <DialogFooter className="px-5 py-3 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            {step === "select" && (
              <>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
                <Button size="sm" onClick={() => setStep("preview")}>
                  下一步：预览合并结果
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </>
            )}
            {step === "preview" && (
              <>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setStep("select")}>上一步</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setStep("done")}>
                  确认合并
                </Button>
              </>
            )}
            {step === "done" && (
              <>
                <div />
                <Button size="sm" onClick={() => onOpenChange(false)}>关闭</Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)

  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter(c => c.status === "active").length,
    totalValue: mockCustomers.reduce((sum, c) => sum + c.totalValue, 0),
    avgValue: Math.round(mockCustomers.reduce((sum, c) => sum + c.totalValue, 0) / mockCustomers.length),
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.length === mockCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(mockCustomers.map(c => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">客户管理</h1>
            <p className="text-muted-foreground mt-1">管理全部客户信息与跟进</p>
          </div>
          <div className="flex gap-2">
            {selectedCustomers.length >= 2 && (
              <Button variant="outline" className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setMergeDialogOpen(true)}>
                <Merge className="h-4 w-4 mr-2" />
                合并客户 ({selectedCustomers.length})
              </Button>
            )}
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增客户
            </Button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/scrm/customers/sea">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">公海客户</h3>
                    <p className="text-sm text-muted-foreground">被销售顾问放弃的客户，可领取跟进</p>
                  </div>
                  <Badge variant="secondary">15</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/scrm/customers/team">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">团队客户</h3>
                    <p className="text-sm text-muted-foreground">团队渠道获取的客户资源</p>
                  </div>
                  <Badge variant="secondary">32</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/scrm/customers/mine">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">我的客户</h3>
                    <p className="text-sm text-muted-foreground">自己分配、跟进、获取的客户</p>
                  </div>
                  <Badge variant="secondary">28</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{stats.total}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">全部客户</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                  <UserCheck className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{stats.active}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">活跃客户</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                  <DollarSign className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">¥{(stats.totalValue / 10000).toFixed(1)}万</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">累计成交</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">¥{(stats.avgValue / 1000).toFixed(1)}千</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">客单均价</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索姓名/手机号" className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">沉默</SelectItem>
                  <SelectItem value="potential">潜在</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="一级来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  <SelectItem value="转介绍">转介绍</SelectItem>
                  <SelectItem value="自拓">自拓</SelectItem>
                  <SelectItem value="线上">线上</SelectItem>
                  <SelectItem value="线下">线下</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="二级渠道" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部渠道</SelectItem>
                  <SelectItem value="美团">美团</SelectItem>
                  <SelectItem value="抖音">抖音</SelectItem>
                  <SelectItem value="小红书">小红书</SelectItem>
                  <SelectItem value="官网">官网</SelectItem>
                  <SelectItem value="百度">百度</SelectItem>
                  <SelectItem value="老客户推荐">老客户推荐</SelectItem>
                  <SelectItem value="朋友介绍">朋友介绍</SelectItem>
                  <SelectItem value="自己开发">自己开发</SelectItem>
                  <SelectItem value="地推">地推</SelectItem>
                  <SelectItem value="活动">活动</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="顾问" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部顾问</SelectItem>
                  <SelectItem value="zhang">张顾问</SelectItem>
                  <SelectItem value="li">李顾问</SelectItem>
                  <SelectItem value="wang">王顾问</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Selection Action Bar */}
        {selectedCustomers.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-amber-700 font-medium">
                    已选择 {selectedCustomers.length} 位客户
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => setSelectedCustomers([])}>
                    取消选择
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCustomers.length >= 2 && (
                    <Button size="sm" variant="outline" className="bg-transparent border-amber-400 text-amber-700 hover:bg-amber-100" onClick={() => setMergeDialogOpen(true)}>
                      <Merge className="h-3.5 w-3.5 mr-1.5" />
                      合并客户
                    </Button>
                  )}
                  {selectedCustomers.length < 2 && (
                    <span className="text-xs text-muted-foreground">再选择 {2 - selectedCustomers.length} 位客户即可合并</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === mockCustomers.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>来源/顾问</TableHead>
                <TableHead className="text-right">订单数</TableHead>
                <TableHead className="text-right">累计消费</TableHead>
                <TableHead>最近订单</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id} className="group">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleSelect(customer.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {customer.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          href={`/scrm/customers/${customer.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {customer.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={statusConfig[customer.status].className}>
                        {statusConfig[customer.status].label}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{customer.source}</p>
                      <p className="text-muted-foreground">{customer.sourceSubCategory}</p>
                      <p className="text-muted-foreground text-xs">{customer.consultant}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{customer.orderCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-primary">¥{customer.totalValue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{customer.lastOrder}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/scrm/customers/${customer.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          拨打电话
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          发送消息
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          创建订单
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">共 {mockCustomers.length} 条记录</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="h-8 w-8">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
        {/* 客户合并弹窗 */}
        <MergeCustomersDialog
          customers={mockCustomers.filter(c => selectedCustomers.includes(c.id))}
          open={mergeDialogOpen}
          onOpenChange={setMergeDialogOpen}
        />
      </div>
    </AdminLayout>
  )
}
