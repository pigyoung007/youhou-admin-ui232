"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  FileText,
  Plus,
  Search,
  Download,
  Settings,
  Building2,
  Receipt,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowRight,
  Send,
  Printer,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// ========== 类型定义 ==========
interface TaxConfig {
  companyName: string
  taxId: string
  address: string
  phone: string
  bankName: string
  bankAccount: string
  invoiceTypes: string[]
  defaultTaxRate: number
}

interface InvoiceApplication {
  id: string
  applicationNo: string
  // 客户信息
  customerName: string
  customerType: "个人" | "企业"
  customerTaxId?: string
  customerAddress?: string
  customerPhone?: string
  customerBank?: string
  customerBankAccount?: string
  // 关联信息
  relatedOrders: { orderId: string; orderName: string; amount: number }[]
  contractNo?: string
  contractName?: string
  contractAmount?: number
  invoicedAmount: number // 已开票金额
  uninvoicedAmount: number // 未开票金额
  // 发票信息
  invoiceType: "增值税普通发票" | "增值税专用发票"
  invoiceAmount: number // 本次开票金额
  taxRate: number
  taxAmount: number
  invoiceContent: string
  invoiceRemark?: string
  // 流程
  applicantId: string
  applicantName: string
  applicantRole: string
  applicationTime: string
  status: "draft" | "pending" | "approved" | "rejected" | "issued"
  reviewerId?: string
  reviewerName?: string
  reviewTime?: string
  reviewComment?: string
  invoiceNo?: string // 发票号
  issueTime?: string // 开票时间
}

// ========== 配置数据 ==========
const defaultTaxConfig: TaxConfig = {
  companyName: "银川优厚母婴服务有限公司",
  taxId: "91640100MA76XXXX0X",
  address: "宁夏银川市兴庆区凤凰北街XX号",
  phone: "0951-XXXXXXX",
  bankName: "中国银行银川市兴庆支行",
  bankAccount: "6217 XXXX XXXX XXXX",
  invoiceTypes: ["增值税普通发票", "增值税专用发票"],
  defaultTaxRate: 6,
}

const mockApplications: InvoiceApplication[] = [
  {
    id: "INV001",
    applicationNo: "FP2025012301",
    customerName: "赵女士",
    customerType: "个人",
    relatedOrders: [
      { orderId: "ORD001", orderName: "金牌月嫂26天", amount: 18800 },
    ],
    contractNo: "HT2025001",
    contractName: "月嫂服务合同",
    contractAmount: 18800,
    invoicedAmount: 0,
    uninvoicedAmount: 18800,
    invoiceType: "增值税普通发票",
    invoiceAmount: 18800,
    taxRate: 6,
    taxAmount: 1064.15,
    invoiceContent: "家政服务费",
    applicantId: "E001",
    applicantName: "张顾问",
    applicantRole: "顾问",
    applicationTime: "2025-01-23 10:30",
    status: "approved",
    reviewerId: "E020",
    reviewerName: "财务李主管",
    reviewTime: "2025-01-23 14:00",
    invoiceNo: "01234567",
    issueTime: "2025-01-23 15:00",
  },
  {
    id: "INV002",
    applicationNo: "FP2025012302",
    customerName: "银川某某月子中心",
    customerType: "企业",
    customerTaxId: "91640100XXXXXXXX",
    customerAddress: "银川市金凤区XX路XX号",
    customerPhone: "0951-XXXXXXX",
    customerBank: "建设银行银川分行",
    customerBankAccount: "6402 XXXX XXXX XXXX",
    relatedOrders: [
      { orderId: "ORD010", orderName: "高级月嫂培训课程", amount: 3800 },
      { orderId: "ORD011", orderName: "育婴师培训课程", amount: 2500 },
    ],
    contractNo: "HT2025010",
    contractName: "培训服务合同",
    contractAmount: 6300,
    invoicedAmount: 0,
    uninvoicedAmount: 6300,
    invoiceType: "增值税专用发票",
    invoiceAmount: 6300,
    taxRate: 6,
    taxAmount: 356.60,
    invoiceContent: "培训服务费",
    applicantId: "E010",
    applicantName: "孙顾问",
    applicantRole: "顾问",
    applicationTime: "2025-01-23 11:00",
    status: "pending",
  },
  {
    id: "INV003",
    applicationNo: "FP2025012201",
    customerName: "刘女士",
    customerType: "个人",
    relatedOrders: [
      { orderId: "ORD005", orderName: "产康套餐12次", amount: 5200 },
    ],
    contractNo: "HT2025005",
    contractName: "产康服务合同",
    contractAmount: 5200,
    invoicedAmount: 0,
    uninvoicedAmount: 5200,
    invoiceType: "增值税普通发票",
    invoiceAmount: 5200,
    taxRate: 6,
    taxAmount: 294.34,
    invoiceContent: "健康服务费",
    applicantId: "E008",
    applicantName: "周顾问",
    applicantRole: "产康前台",
    applicationTime: "2025-01-22 16:30",
    status: "rejected",
    reviewerId: "E020",
    reviewerName: "财务李主管",
    reviewTime: "2025-01-22 17:00",
    reviewComment: "开票内容有误，请修改为'家政服务费'后重新提交",
  },
  {
    id: "INV004",
    applicationNo: "FP2025012001",
    customerName: "陈先生",
    customerType: "个人",
    relatedOrders: [
      { orderId: "ORD003", orderName: "育婴师月度服务", amount: 7600 },
    ],
    contractNo: "HT2025003",
    contractName: "育婴服务合同",
    contractAmount: 7600,
    invoicedAmount: 7600,
    uninvoicedAmount: 0,
    invoiceType: "增值税普通发票",
    invoiceAmount: 7600,
    taxRate: 6,
    taxAmount: 430.19,
    invoiceContent: "家政服务费",
    applicantId: "E001",
    applicantName: "张顾问",
    applicantRole: "顾问",
    applicationTime: "2025-01-20 09:00",
    status: "issued",
    reviewerId: "E020",
    reviewerName: "财务李主管",
    reviewTime: "2025-01-20 10:00",
    invoiceNo: "01234560",
    issueTime: "2025-01-20 11:00",
  },
  {
    id: "INV005",
    applicationNo: "FP2025011501",
    customerName: "周女士",
    customerType: "个人",
    relatedOrders: [
      { orderId: "ORD008", orderName: "金牌月嫂42天", amount: 28800 },
      { orderId: "ORD009", orderName: "产康套餐8次", amount: 3800 },
    ],
    contractNo: "HT2025008",
    contractName: "月嫂服务+产康合同",
    contractAmount: 32600,
    invoicedAmount: 28800,
    uninvoicedAmount: 3800,
    invoiceType: "增值税普通发票",
    invoiceAmount: 3800,
    taxRate: 6,
    taxAmount: 215.09,
    invoiceContent: "健康服务费",
    invoiceRemark: "剩余产康部分开票",
    applicantId: "E001",
    applicantName: "张顾问",
    applicantRole: "顾问",
    applicationTime: "2025-01-15 14:00",
    status: "draft",
  },
]

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-700 border-gray-200", icon: Edit },
  pending: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  issued: { label: "已开票", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Receipt },
}

// ========== 基础设置Tab ==========
function InvoiceSettingsTab() {
  const [config, setConfig] = useState<TaxConfig>(defaultTaxConfig)
  const [editing, setEditing] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">企业税务信息</h3>
          <p className="text-xs text-muted-foreground mt-0.5">配置开票基础信息，设置后所有发票申请将自动引用</p>
        </div>
        <Button size="sm" className="h-7 text-xs" variant={editing ? "default" : "outline"} onClick={() => setEditing(!editing)}>
          {editing ? "保存设置" : (<><Edit className="h-3 w-3 mr-1" />编辑</>)}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">企业名称</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.companyName} onChange={e => setConfig({...config, companyName: e.target.value})} />
              ) : (
                <p className="text-sm font-medium">{config.companyName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">纳税人识别号</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.taxId} onChange={e => setConfig({...config, taxId: e.target.value})} />
              ) : (
                <p className="text-sm font-medium font-mono">{config.taxId}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">注册地址</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} />
              ) : (
                <p className="text-sm">{config.address}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">企业电话</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.phone} onChange={e => setConfig({...config, phone: e.target.value})} />
              ) : (
                <p className="text-sm">{config.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">开户银行</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.bankName} onChange={e => setConfig({...config, bankName: e.target.value})} />
              ) : (
                <p className="text-sm">{config.bankName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">银行账号</Label>
              {editing ? (
                <Input className="h-8 text-xs" value={config.bankAccount} onChange={e => setConfig({...config, bankAccount: e.target.value})} />
              ) : (
                <p className="text-sm font-mono">{config.bankAccount}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h4 className="text-sm font-medium">发票类型与税率</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">支持的发票类型</Label>
              <div className="flex gap-2">
                {config.invoiceTypes.map(t => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">默认税率</Label>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input type="number" className="h-8 text-xs w-20" value={config.defaultTaxRate} onChange={e => setConfig({...config, defaultTaxRate: Number(e.target.value)})} />
                  <span className="text-xs">%</span>
                </div>
              ) : (
                <p className="text-sm font-medium">{config.defaultTaxRate}%</p>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-700">
              家政服务适用税率为6%（增值税一般纳税人）或3%（小规模纳税人）。具体税率请咨询企业财务人员。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== 新建开票申请弹窗 ==========
function CreateInvoiceDialog() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerType: "个人" as "个人" | "企业",
    customerTaxId: "",
    customerAddress: "",
    customerPhone: "",
    customerBank: "",
    customerBankAccount: "",
    selectedOrders: [] as string[],
    invoiceType: "增值税普通发票",
    invoiceAmount: 0,
    taxRate: 6,
    invoiceContent: "家政服务费",
    invoiceRemark: "",
  })

  const availableOrders = [
    { id: "ORD020", name: "金牌月嫂26天 - 张女士", amount: 18800, invoiced: 0 },
    { id: "ORD021", name: "育婴师季度 - 李先生", amount: 21000, invoiced: 0 },
    { id: "ORD022", name: "产康套餐12次 - 王女士", amount: 5200, invoiced: 0 },
    { id: "ORD023", name: "高级月嫂培训 - 赵先生", amount: 3800, invoiced: 0 },
  ]

  const selectedTotal = availableOrders
    .filter(o => formData.selectedOrders.includes(o.id))
    .reduce((sum, o) => sum + (o.amount - o.invoiced), 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建开票申请</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Receipt className="h-4 w-4 text-primary" />
            新建开票申请
          </DialogTitle>
          <DialogDescription className="text-xs">选择订单并填写开票信息，提交后由财务审核开票</DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-2.5 border-b bg-muted/20">
          {[
            { num: 1, label: "选择订单" },
            { num: 2, label: "客户抬头" },
            { num: 3, label: "开票信息" },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                step === s.num ? "bg-primary text-primary-foreground" : step > s.num ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
              )}>
                {step > s.num ? <CheckCircle2 className="h-3 w-3" /> : <span className="w-4 text-center">{s.num}</span>}
                <span>{s.label}</span>
              </div>
              {i < 2 && <div className={cn("w-8 h-0.5", step > s.num ? "bg-emerald-300" : "bg-muted")} />}
            </React.Fragment>
          ))}
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Step 1: 选择订单 */}
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">选择需要开票的订单（可多选合并开票）</Label>
                  <div className="space-y-2">
                    {availableOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => {
                          const selected = formData.selectedOrders.includes(order.id)
                            ? formData.selectedOrders.filter(id => id !== order.id)
                            : [...formData.selectedOrders, order.id]
                          setFormData({...formData, selectedOrders: selected})
                        }}
                        className={cn(
                          "p-3 rounded-lg border-2 cursor-pointer transition-all",
                          formData.selectedOrders.includes(order.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={formData.selectedOrders.includes(order.id)}
                              readOnly
                              className="h-4 w-4 rounded"
                            />
                            <div>
                              <p className="text-xs font-medium">{order.name}</p>
                              <p className="text-[10px] text-muted-foreground">订单编号: {order.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">¥{order.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">已开票: ¥{order.invoiced.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.selectedOrders.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-700">已选 {formData.selectedOrders.length} 个订单，合计可开票金额</span>
                      <span className="text-sm font-bold text-emerald-700">¥{selectedTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: 客户抬头 */}
            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">客户类型</Label>
                  <Select value={formData.customerType} onValueChange={v => setFormData({...formData, customerType: v as "个人" | "企业"})}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="个人">个人</SelectItem>
                      <SelectItem value="企业">企业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    {formData.customerType === "企业" ? "企业名称" : "个人姓名"} <span className="text-red-500">*</span>
                  </Label>
                  <Input className="h-8 text-xs" placeholder={formData.customerType === "企业" ? "请输入企业全称" : "请输入个人姓名"} value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
                </div>
                {formData.customerType === "企业" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">纳税人识别号 <span className="text-red-500">*</span></Label>
                        <Input className="h-8 text-xs" placeholder="请输入纳税人识别号" value={formData.customerTaxId} onChange={e => setFormData({...formData, customerTaxId: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">联系电话</Label>
                        <Input className="h-8 text-xs" placeholder="请输入联系电话" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">注册地址</Label>
                      <Input className="h-8 text-xs" placeholder="请输入注册地址" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">开户银行</Label>
                        <Input className="h-8 text-xs" placeholder="请输入开户银行" value={formData.customerBank} onChange={e => setFormData({...formData, customerBank: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">银行账号</Label>
                        <Input className="h-8 text-xs" placeholder="请输入银行账号" value={formData.customerBankAccount} onChange={e => setFormData({...formData, customerBankAccount: e.target.value})} />
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                        开具增值税专用发票需要完整填写以上全部信息
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 3: 开票信息 */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">发票类型 <span className="text-red-500">*</span></Label>
                    <Select value={formData.invoiceType} onValueChange={v => setFormData({...formData, invoiceType: v})}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="增值税普通发票">增值税普通发票</SelectItem>
                        <SelectItem value="增值税专用发票">增值税专用发票</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">开票金额</Label>
                    <Input type="number" className="h-8 text-xs" value={selectedTotal || formData.invoiceAmount} onChange={e => setFormData({...formData, invoiceAmount: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">税率</Label>
                    <Select value={String(formData.taxRate)} onValueChange={v => setFormData({...formData, taxRate: Number(v)})}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3%（小规模纳税人）</SelectItem>
                        <SelectItem value="6">6%（一般纳税人）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">税额（自动计算）</Label>
                    <div className="h-8 px-3 flex items-center rounded-md border bg-muted/30 text-xs">
                      ¥{((selectedTotal || formData.invoiceAmount) * formData.taxRate / (100 + formData.taxRate)).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">开票内容 <span className="text-red-500">*</span></Label>
                  <Select value={formData.invoiceContent} onValueChange={v => setFormData({...formData, invoiceContent: v})}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="家政服务费">家政服务费</SelectItem>
                      <SelectItem value="健康服务费">健康服务费</SelectItem>
                      <SelectItem value="培训服务费">培训服务费</SelectItem>
                      <SelectItem value="咨询服务费">咨询服务费</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">备注</Label>
                  <Textarea className="text-xs min-h-[60px] resize-none" placeholder="请输入发票备注..." value={formData.invoiceRemark} onChange={e => setFormData({...formData, invoiceRemark: e.target.value})} />
                </div>

                {/* Summary */}
                <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
                  <h4 className="text-xs font-medium">开票信息汇总</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">购方名称</span><span className="font-medium">{formData.customerName || "-"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">客户类型</span><span className="font-medium">{formData.customerType}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">发票类型</span><span className="font-medium">{formData.invoiceType}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">开票金额</span><span className="font-medium text-primary">¥{(selectedTotal || formData.invoiceAmount).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">开票内容</span><span className="font-medium">{formData.invoiceContent}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">关联订单</span><span className="font-medium">{formData.selectedOrders.length}个</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 py-3 border-t flex-shrink-0 bg-background">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>上一步</Button>
            <div className="flex gap-2">
              {step < 3 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>下一步</Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="bg-transparent">保存草稿</Button>
                  <Button size="sm"><Send className="h-3.5 w-3.5 mr-1" />提交审核</Button>
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ========== 发票详情弹窗 ==========
function InvoiceDetailDialog({ invoice }: { invoice: InvoiceApplication }) {
  const StatusIcon = statusConfig[invoice.status].icon
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-1" />详情</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            发票申请详情 - {invoice.applicationNo}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", statusConfig[invoice.status].className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[invoice.status].label}
            </Badge>
            {invoice.invoiceNo && <Badge variant="secondary" className="text-xs">发票号: {invoice.invoiceNo}</Badge>}
          </div>

          {/* 客户信息 */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <h4 className="text-xs font-medium">购方信息</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">名称: </span>{invoice.customerName}</div>
              <div><span className="text-muted-foreground">类型: </span>{invoice.customerType}</div>
              {invoice.customerTaxId && <div><span className="text-muted-foreground">税号: </span>{invoice.customerTaxId}</div>}
            </div>
          </div>

          {/* 关联订单 */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <h4 className="text-xs font-medium">关联订单</h4>
            {invoice.relatedOrders.map(o => (
              <div key={o.orderId} className="flex items-center justify-between text-xs">
                <span>{o.orderName} <span className="text-muted-foreground">({o.orderId})</span></span>
                <span className="font-medium">¥{o.amount.toLocaleString()}</span>
              </div>
            ))}
            {invoice.contractNo && (
              <div className="text-xs pt-1 border-t">
                <span className="text-muted-foreground">合同: </span>{invoice.contractName} ({invoice.contractNo})
              </div>
            )}
          </div>

          {/* 开票信息 */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <h4 className="text-xs font-medium">开票信息</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">发票类型: </span>{invoice.invoiceType}</div>
              <div><span className="text-muted-foreground">开票金额: </span><span className="font-medium text-primary">¥{invoice.invoiceAmount.toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">税率: </span>{invoice.taxRate}%</div>
              <div><span className="text-muted-foreground">税额: </span>¥{invoice.taxAmount.toFixed(2)}</div>
              <div><span className="text-muted-foreground">开票内容: </span>{invoice.invoiceContent}</div>
              {invoice.invoiceRemark && <div><span className="text-muted-foreground">备注: </span>{invoice.invoiceRemark}</div>}
            </div>
          </div>

          {/* 流程信息 */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <h4 className="text-xs font-medium">流程记录</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[9px] h-4">申请</Badge>
                <span>{invoice.applicantName}（{invoice.applicantRole}）</span>
                <span className="text-muted-foreground">{invoice.applicationTime}</span>
              </div>
              {invoice.reviewerName && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[9px] h-4">审核</Badge>
                  <span>{invoice.reviewerName}</span>
                  <span className="text-muted-foreground">{invoice.reviewTime}</span>
                </div>
              )}
              {invoice.reviewComment && (
                <div className="text-xs p-2 bg-red-50 rounded border border-red-100 text-red-700">
                  驳回原因: {invoice.reviewComment}
                </div>
              )}
              {invoice.issueTime && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[9px] h-4">开票</Badge>
                  <span>发票号: {invoice.invoiceNo}</span>
                  <span className="text-muted-foreground">{invoice.issueTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          {invoice.status === "pending" && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent text-red-600 border-red-200 hover:bg-red-50">驳回</Button>
              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">审核通过</Button>
            </div>
          )}
          {invoice.status === "approved" && (
            <Button size="sm" className="w-full"><Printer className="h-3.5 w-3.5 mr-1" />确认开票</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ========== 开票申请管理Tab ==========
function InvoiceApplicationsTab() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = useMemo(() => {
    return mockApplications.filter(inv => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false
      if (searchTerm && !inv.customerName.includes(searchTerm) && !inv.applicationNo.includes(searchTerm)) return false
      return true
    })
  }, [statusFilter, searchTerm])

  const stats = useMemo(() => ({
    total: mockApplications.length,
    pending: mockApplications.filter(i => i.status === "pending").length,
    issued: mockApplications.filter(i => i.status === "issued").length,
    totalAmount: mockApplications.filter(i => i.status === "issued" || i.status === "approved").reduce((s, i) => s + i.invoiceAmount, 0),
  }), [])

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><FileText className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">全部申请</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><Clock className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">{stats.pending}</p>
                <p className="text-[10px] text-muted-foreground">待审核</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Receipt className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">{stats.issued}</p>
                <p className="text-[10px] text-muted-foreground">已开票</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary"><DollarSign className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">¥{(stats.totalAmount / 10000).toFixed(1)}万</p>
                <p className="text-[10px] text-muted-foreground">开票总额</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索客户/申请号..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="approved">已审核</SelectItem>
              <SelectItem value="rejected">已驳回</SelectItem>
              <SelectItem value="issued">已开票</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateInvoiceDialog />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs">申请编号</TableHead>
              <TableHead className="text-xs">客户</TableHead>
              <TableHead className="text-xs">发票类型</TableHead>
              <TableHead className="text-xs text-right">开票金额</TableHead>
              <TableHead className="text-xs">开票内容</TableHead>
              <TableHead className="text-xs">申请人</TableHead>
              <TableHead className="text-xs">申请时间</TableHead>
              <TableHead className="text-xs">状态</TableHead>
              <TableHead className="text-xs w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(inv => {
              const StatusIcon = statusConfig[inv.status].icon
              return (
                <TableRow key={inv.id}>
                  <TableCell className="text-xs font-mono">{inv.applicationNo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium">{inv.customerName}</p>
                      <Badge variant="secondary" className="text-[9px] h-3.5 px-1 mt-0.5">{inv.customerType}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{inv.invoiceType === "增值税专用发票" ? "专票" : "普票"}</TableCell>
                  <TableCell className="text-xs text-right font-medium text-primary">¥{inv.invoiceAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{inv.invoiceContent}</TableCell>
                  <TableCell className="text-xs">{inv.applicantName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.applicationTime.split(" ")[0]}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px]", statusConfig[inv.status].className)}>
                      <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                      {statusConfig[inv.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <InvoiceDetailDialog invoice={inv} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// ========== 发票查询与统计Tab ==========
function InvoiceStatsTab() {
  const issuedInvoices = mockApplications.filter(i => i.status === "issued" || i.status === "approved")
  const totalIssued = issuedInvoices.reduce((s, i) => s + i.invoiceAmount, 0)
  const normalCount = issuedInvoices.filter(i => i.invoiceType === "增值税普通发票").length
  const specialCount = issuedInvoices.filter(i => i.invoiceType === "增值税专用发票").length

  const monthlyData = [
    { month: "2025-01", count: 12, amount: 86400 },
    { month: "2024-12", count: 18, amount: 124000 },
    { month: "2024-11", count: 15, amount: 98500 },
    { month: "2024-10", count: 20, amount: 132000 },
  ]

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Receipt className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">¥{(totalIssued / 10000).toFixed(1)}万</p>
                <p className="text-[10px] text-muted-foreground">累计开票金额</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><FileText className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">{normalCount}</p>
                <p className="text-[10px] text-muted-foreground">普通发票</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><FileText className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">{specialCount}</p>
                <p className="text-[10px] text-muted-foreground">专用发票</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><TrendingUp className="h-4 w-4" /></div>
              <div>
                <p className="text-lg font-bold">¥8.6万</p>
                <p className="text-[10px] text-muted-foreground">本月开票</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部门店</SelectItem>
              <SelectItem value="yc">银川总店</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="2025">
            <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025年</SelectItem>
              <SelectItem value="2024">2024年</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="normal">普通发票</SelectItem>
              <SelectItem value="special">专用发票</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
          <Download className="h-3 w-3 mr-1" />导出报表
        </Button>
      </div>

      {/* Monthly Table */}
      <Card className="overflow-hidden">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm">月度开票统计</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs">月份</TableHead>
                <TableHead className="text-xs text-right">开票数量</TableHead>
                <TableHead className="text-xs text-right">开票金额</TableHead>
                <TableHead className="text-xs text-right">环比变化</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((row, i) => {
                const prev = monthlyData[i + 1]
                const change = prev ? ((row.amount - prev.amount) / prev.amount * 100).toFixed(1) : "-"
                return (
                  <TableRow key={row.month}>
                    <TableCell className="text-xs font-medium">{row.month}</TableCell>
                    <TableCell className="text-xs text-right">{row.count}张</TableCell>
                    <TableCell className="text-xs text-right font-medium text-primary">¥{row.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">
                      {change !== "-" && (
                        <span className={Number(change) >= 0 ? "text-red-600" : "text-emerald-600"}>
                          {Number(change) >= 0 ? "+" : ""}{change}%
                        </span>
                      )}
                      {change === "-" && <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Issued Invoice List */}
      <Card className="overflow-hidden">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm">已开票记录</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs">发票号</TableHead>
                <TableHead className="text-xs">客户</TableHead>
                <TableHead className="text-xs">发票类型</TableHead>
                <TableHead className="text-xs text-right">金额</TableHead>
                <TableHead className="text-xs">内容</TableHead>
                <TableHead className="text-xs">开票日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApplications.filter(i => i.invoiceNo).map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="text-xs font-mono">{inv.invoiceNo}</TableCell>
                  <TableCell className="text-xs">{inv.customerName}</TableCell>
                  <TableCell className="text-xs">{inv.invoiceType === "增值税专用发票" ? "专票" : "普票"}</TableCell>
                  <TableCell className="text-xs text-right font-medium text-primary">¥{inv.invoiceAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{inv.invoiceContent}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.issueTime?.split(" ")[0]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== 主页面 ==========
export default function InvoicesPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">发票管理</h1>
            <p className="text-xs text-muted-foreground mt-0.5">管理开票申请、发票查询与基础设置</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="applications">
          <TabsList className="h-8">
            <TabsTrigger value="applications" className="text-xs h-6 gap-1">
              <Receipt className="h-3 w-3" />
              开票申请管理
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs h-6 gap-1">
              <BarChart3 className="h-3 w-3" />
              发票查询与统计
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs h-6 gap-1">
              <Settings className="h-3 w-3" />
              基础设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-4">
            <InvoiceApplicationsTab />
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <InvoiceStatsTab />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <InvoiceSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
