"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  FileText,
  Clock,
  Check,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Calendar,
  Shield,
  FileSignature,
  XCircle,
  FileEdit,
  Phone,
  MapPin,
  CreditCard,
  Copy,
  MessageSquare,
  Send,
  AlertCircle,
  UserPlus,
  Pause,
  StopCircle,
  RefreshCw,
  ArrowRightLeft,
  CalendarRange,
  UserCog,
  Ban,
  CheckCircle2,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"
import { ContractPreviewDialog } from "@/components/contracts/contract-preview-dialog"

interface ContractFile {
  id: string
  type: "main" | "supplement" | "amendment"
  typeName: string
  title: string
  amount: number
  signedAt: string | null
  status: "signed" | "pending"
}

interface Amendment {
  id: string
  type: string
  typeName: string
  reason: string
  originalValue: string
  newValue: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
}

// 服务状态（区别于合同状态）
type ServiceStatus = "not_started" | "in_service" | "paused" | "staff_changed" | "service_ended"

interface ServiceRecord {
  id: string
  caregiverId: string
  caregiverName: string
  actualStartDate: string | null
  actualEndDate: string | null
  status: ServiceStatus
  changeReason?: string
  initiator?: "consultant" | "caregiver"
}

interface Contract {
  id: string
  contractNo: string
  orderId: string
  title: string
  type: "maternity_service" | "infant_care" | "postpartum_recovery" | "domestic_service" | "training"
  status: "draft" | "pending_sign" | "partially_signed" | "signed" | "in_effect" | "completed" | "terminated"
  employer: { name: string; phone: string; idCard?: string }
  caregiver?: { name: string; role: string; phone?: string }
  company: string
  amount: number
  // 合同周期（合同约定时间）
  serviceStartDate: string
  serviceEndDate: string
  // 服务周期（实际上户/下户时间）
  actualServiceStart?: string
  actualServiceEnd?: string
  serviceStatus?: ServiceStatus
  serviceRecords?: ServiceRecord[]
  serviceAddress?: string
  createdAt: string
  signedAt?: string
  contractFiles: ContractFile[]
  amendments: Amendment[]
}

const mockContracts: Contract[] = [
  {
    id: "1",
    contractNo: "CT202501008",
    orderId: "ORD202501008",
    title: "月嫂服务合同",
    type: "maternity_service",
    status: "pending_sign",
    employer: { name: "张女士", phone: "138****1234", idCard: "640104****1234" },
    caregiver: { name: "李春华", role: "金牌月嫂", phone: "139****5678" },
    company: "银川优厚家庭服务有限公司",
    amount: 18800,
    serviceStartDate: "2025-03-15",
    serviceEndDate: "2025-04-15",
    serviceAddress: "银川市兴庆区丽景街XXX号",
    createdAt: "2025-01-23 10:30",
    contractFiles: [
      { id: "CF001", type: "main", typeName: "主合同", title: "月嫂服务合同", amount: 18800, signedAt: null, status: "pending" },
    ],
    amendments: [],
  },
  {
    id: "2",
    contractNo: "CT202501007",
    orderId: "ORD202501007",
    title: "育婴师服务合同",
    type: "infant_care",
    status: "in_effect",
    employer: { name: "刘先生", phone: "139****5678", idCard: "640104****5678" },
    caregiver: { name: "王秀兰", role: "高级育婴师", phone: "138****9012" },
    company: "银川优厚家庭服务有限公司",
    amount: 11800,
    serviceStartDate: "2025-02-01",
    serviceEndDate: "2025-05-01",
    actualServiceStart: "2025-02-01",
    serviceStatus: "in_service",
    serviceRecords: [
      { id: "SR001", caregiverId: "N002", caregiverName: "王秀兰", actualStartDate: "2025-02-01", actualEndDate: null, status: "in_service" },
    ],
    serviceAddress: "银川市金凤区正源街XXX号",
    createdAt: "2025-01-22 15:45",
    signedAt: "2025-01-22 18:30",
    contractFiles: [
      { id: "CF002", type: "main", typeName: "主合同", title: "育婴师服务合同", amount: 10800, signedAt: "2025-01-22", status: "signed" },
      { id: "CF002-A1", type: "supplement", typeName: "增补合同", title: "服务延期补充协议", amount: 1000, signedAt: "2025-01-25", status: "signed" },
    ],
    amendments: [
      { id: "AM001", type: "extend", typeName: "服务延期", reason: "客户申请延长2周服务", originalValue: "2025-04-15", newValue: "2025-05-01", status: "approved", createdAt: "2025-01-24", approvedAt: "2025-01-24" },
    ],
  },
  {
    id: "3",
    contractNo: "CT202501006",
    orderId: "ORD202501006",
    title: "产后康复服务合同",
    type: "postpartum_recovery",
    status: "in_effect",
    employer: { name: "陈女士", phone: "137****9012", idCard: "640104****9012" },
    caregiver: { name: "张美玲", role: "产康技师", phone: "136****3456" },
    company: "银川优厚母婴护理有限公司",
    amount: 5600,
    serviceStartDate: "2025-01-15",
    serviceEndDate: "2025-02-28",
    actualServiceStart: "2025-01-15",
    serviceStatus: "staff_changed",
    serviceRecords: [
      { id: "SR002", caregiverId: "T001", caregiverName: "刘小燕", actualStartDate: "2025-01-15", actualEndDate: "2025-01-20", status: "service_ended", changeReason: "个人原因无法继续服务", initiator: "caregiver" },
      { id: "SR003", caregiverId: "T002", caregiverName: "张美玲", actualStartDate: "2025-01-21", actualEndDate: null, status: "in_service" },
    ],
    serviceAddress: "银川市西夏区学院路XXX号",
    createdAt: "2025-01-10 11:20",
    signedAt: "2025-01-12 09:00",
    contractFiles: [
      { id: "CF003", type: "main", typeName: "主合同", title: "产后康复服务合同", amount: 5600, signedAt: "2025-01-12", status: "signed" },
    ],
    amendments: [
      { id: "AM002", type: "change_staff", typeName: "更换人员", reason: "原服务人员因故无法继续服务", originalValue: "刘小燕", newValue: "张美玲", status: "pending", createdAt: "2025-01-20" },
    ],
  },
  {
    id: "4",
    contractNo: "CT202501005",
    orderId: "ORD202501005",
    title: "培训服务合同",
    type: "training",
    status: "completed",
    employer: { name: "赵丽华", phone: "136****3456", idCard: "640104****3456" },
    company: "银川优厚职业培训学校",
    amount: 3980,
    serviceStartDate: "2024-12-01",
    serviceEndDate: "2025-01-15",
    createdAt: "2024-11-28 14:10",
    signedAt: "2024-11-29 10:00",
    contractFiles: [
      { id: "CF004", type: "main", typeName: "主合同", title: "培训服务合同", amount: 3980, signedAt: "2024-11-29", status: "signed" },
    ],
    amendments: [],
  },
  {
    id: "5",
    contractNo: "CT202501004",
    orderId: "ORD202501004",
    title: "月嫂服务合同",
    type: "maternity_service",
    status: "terminated",
    employer: { name: "王先生", phone: "135****7890", idCard: "640104****7890" },
    caregiver: { name: "周小红", role: "月嫂", phone: "137****1234" },
    company: "银川优厚家庭服务有限公司",
    amount: 15800,
    serviceStartDate: "2025-01-01",
    serviceEndDate: "2025-02-01",
    serviceAddress: "银川市兴庆区解放街XXX号",
    createdAt: "2024-12-20 09:30",
    signedAt: "2024-12-22 14:00",
    contractFiles: [
      { id: "CF005", type: "main", typeName: "主合同", title: "月嫂服务合同", amount: 15800, signedAt: "2024-12-22", status: "signed" },
    ],
    amendments: [
      { id: "AM003", type: "early_termination", typeName: "提前终止", reason: "客户因个人原因申请提前终止服务", originalValue: "2025-02-01", newValue: "2025-01-15", status: "approved", createdAt: "2025-01-10", approvedAt: "2025-01-11" },
    ],
  },
  {
    id: "6",
    contractNo: "CT202501009",
    orderId: "ORD202501009",
    title: "育婴师服务合同",
    type: "infant_care",
    status: "partially_signed",
    employer: { name: "孙女士", phone: "134****2345", idCard: "640104****2345" },
    caregiver: { name: "陈淑芬", role: "育婴师", phone: "133****6789" },
    company: "银川优厚家庭服务有限公司",
    amount: 10800,
    serviceStartDate: "2025-03-01",
    serviceEndDate: "2025-06-01",
    serviceAddress: "银川市金凤区万寿路XXX号",
    createdAt: "2025-01-24 09:15",
    contractFiles: [
      { id: "CF006", type: "main", typeName: "主合同", title: "育婴师服务合同", amount: 10800, signedAt: null, status: "pending" },
    ],
    amendments: [],
  },
  {
    id: "7",
    contractNo: "CT202501010",
    orderId: "ORD202501010",
    title: "月嫂服务合同",
    type: "maternity_service",
    status: "pending_sign",
    employer: { name: "吴女士", phone: "132****0123", idCard: "640104****0123" },
    caregiver: { name: "吴丽萍", role: "高级月嫂", phone: "131****4567" },
    company: "银川优厚家庭服务有限公司",
    amount: 16800,
    serviceStartDate: "2025-04-01",
    serviceEndDate: "2025-05-01",
    serviceAddress: "银川市兴庆区北京路XXX号",
    createdAt: "2025-01-25 11:30",
    contractFiles: [
      { id: "CF007", type: "main", typeName: "主合同", title: "月嫂服务合同", amount: 16800, signedAt: null, status: "pending" },
    ],
    amendments: [],
  },
  {
    id: "8",
    contractNo: "CT202501011",
    orderId: "ORD202501011",
    title: "产后康复服务合同",
    type: "postpartum_recovery",
    status: "pending_sign",
    employer: { name: "郑女士", phone: "130****8901", idCard: "640104****8901" },
    company: "银川优厚母婴护理有限公司",
    amount: 6800,
    serviceStartDate: "2025-02-15",
    serviceEndDate: "2025-03-15",
    serviceAddress: "银川市西夏区怀远路XXX号",
    createdAt: "2025-01-26 14:45",
    contractFiles: [
      { id: "CF008", type: "main", typeName: "主合同", title: "产后康复服务合同", amount: 6800, signedAt: null, status: "pending" },
    ],
    amendments: [],
  },
]

const typeConfig = {
  maternity_service: { label: "月嫂服务", color: "bg-rose-500/10 text-rose-600" },
  infant_care: { label: "育婴师服务", color: "bg-blue-500/10 text-blue-600" },
  postpartum_recovery: { label: "产后康复", color: "bg-teal-500/10 text-teal-600" },
  domestic_service: { label: "家政服务", color: "bg-amber-500/10 text-amber-600" },
  training: { label: "培训服务", color: "bg-purple-500/10 text-purple-600" },
}

const statusConfig = {
  draft: { label: "草稿", color: "bg-muted text-muted-foreground" },
  pending_sign: { label: "待签署", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  partially_signed: { label: "部分签署", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  signed: { label: "已签署", color: "bg-green-500/10 text-green-600 border-green-500/30" },
  in_effect: { label: "生效中", color: "bg-primary/10 text-primary border-primary/30" },
  completed: { label: "已完成", color: "bg-muted text-muted-foreground" },
  terminated: { label: "已废止", color: "bg-red-500/10 text-red-600 border-red-500/30" },
}

// 服务状态配置
const serviceStatusConfig = {
  not_started: { label: "未开始", color: "bg-muted text-muted-foreground" },
  in_service: { label: "服务中", color: "bg-green-500/10 text-green-600 border-green-500/30" },
  paused: { label: "已暂停", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  staff_changed: { label: "人员变更", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  service_ended: { label: "服务终止", color: "bg-red-500/10 text-red-600 border-red-500/30" },
}

const fileTypeColors: Record<string, string> = {
  main: "bg-blue-50 text-blue-700 border-blue-200",
  supplement: "bg-green-50 text-green-700 border-green-200",
  amendment: "bg-purple-50 text-purple-700 border-purple-200",
}

const amendmentTypeColors: Record<string, string> = {
  extend: "bg-blue-50 text-blue-700 border-blue-200",
  change_staff: "bg-purple-50 text-purple-700 border-purple-200",
  price_adjust: "bg-amber-50 text-amber-700 border-amber-200",
  early_termination: "bg-red-50 text-red-700 border-red-200",
}

const amendmentStatusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
}

function CreateContractDialog() {
  const [step, setStep] = useState(1)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [sendTargets, setSendTargets] = useState<string[]>(["employer", "caregiver", "company"])
  
  // Mock contract link
  const contractLink = "https://sign.youhou.com/c/CT202501011"
  
  const handleCopyLink = (target: string) => {
    navigator.clipboard.writeText(contractLink)
    setCopiedLink(target)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新建合同
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新建合同</DialogTitle>
          <DialogDescription>
            步骤 {step}/4: {step === 1 ? "选择合同模板" : step === 2 ? "填写签约信息" : step === 3 ? "确认合同内容" : "生成签署链接"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.entries(typeConfig).map(([key, config]) => (
              <button
                key={key}
                className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                onClick={() => setStep(2)}
              >
                <Badge className={config.color}>{config.label}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  标准{config.label}合同模板
                </p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">签约公司</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择公司主体" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yhjs">银川优厚家庭服务有限公司</SelectItem>
                    <SelectItem value="yhmy">银川优厚母婴护理有限公司</SelectItem>
                    <SelectItem value="yhpx">银川优厚职业培训学校</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">合同金额</label>
                <Input type="number" placeholder="请输入金额" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">雇主(甲方)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="搜索或选择雇主" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zhang">张女士 (138****1234)</SelectItem>
                  <SelectItem value="liu">刘先生 (139****5678)</SelectItem>
                  <SelectItem value="chen">陈女士 (137****9012)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">服务人员(乙方)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="搜索或选择服务人员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="li">李春华 - 金牌月嫂</SelectItem>
                  <SelectItem value="wang">王秀兰 - 高级育婴师</SelectItem>
                  <SelectItem value="zhangm">张美玲 - 产康技师</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">服务开始日期</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">服务结束日期</label>
                <Input type="date" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">合同类型</span>
                <span className="font-medium">月嫂服务合同</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">签约公司</span>
                <span className="font-medium">银川优厚家庭服务有限公司</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">雇主</span>
                <span className="font-medium">张女士</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">服务人员</span>
                <span className="font-medium">李春华</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">合同金额</span>
                <span className="font-medium text-primary">¥18,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">服务周期</span>
                <span className="font-medium">2025-03-15 至 2025-04-15</span>
              </div>
            </div>

            </div>
        )}

        {step === 4 && (
          <div className="py-4 space-y-4">
            {/* Contract Link */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <FileSignature className="h-5 w-5 text-primary" />
                <span className="font-medium">合同签署链接已生成</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  value={contractLink} 
                  readOnly 
                  className="font-mono text-sm bg-background"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCopyLink("main")}
                >
                  {copiedLink === "main" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Signatories List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">签约方人员确认</label>
                <Badge variant="outline" className="text-xs">共3方需签署</Badge>
              </div>
              
              {/* Employer */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={sendTargets.includes("employer")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSendTargets([...sendTargets, "employer"])
                        } else {
                          setSendTargets(sendTargets.filter(t => t !== "employer"))
                        }
                      }}
                      className="rounded"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">张</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">张女士</p>
                      <p className="text-xs text-muted-foreground">甲方(雇主) · 138****1234</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("employer")}
                    >
                      {copiedLink === "employer" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      复制链接
                    </Button>
                  </div>
                </div>
              </div>

              {/* Caregiver */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={sendTargets.includes("caregiver")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSendTargets([...sendTargets, "caregiver"])
                        } else {
                          setSendTargets(sendTargets.filter(t => t !== "caregiver"))
                        }
                      }}
                      className="rounded"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-rose-100 text-rose-600 text-xs">李</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">李春华</p>
                      <p className="text-xs text-muted-foreground">乙方(服务人员) · 139****5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("caregiver")}
                    >
                      {copiedLink === "caregiver" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      复制链接
                    </Button>
                  </div>
                </div>
              </div>

              {/* Company */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={sendTargets.includes("company")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSendTargets([...sendTargets, "company"])
                        } else {
                          setSendTargets(sendTargets.filter(t => t !== "company"))
                        }
                      }}
                      className="rounded"
                    />
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">银川优厚家庭服务有限公司</p>
                      <p className="text-xs text-muted-foreground">丙方(公司) · 张经理签署</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("company")}
                    >
                      {copiedLink === "company" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      复制链接
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Options */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">发送方式</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={sendTargets.length === 0}>
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  推送系统消息 ({sendTargets.length})
                </Button>
                <Button size="sm" variant="outline" disabled={sendTargets.length === 0}>
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  发送短信 ({sendTargets.length})
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              上一步
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>
              {step === 3 ? "生成签署链接" : "下一步"}
            </Button>
          ) : (
            <Button disabled={sendTargets.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              确认发送 ({sendTargets.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 签署状态与链接分享弹窗 - 用于待签署合同
function SignatureShareDialog({ contract }: { contract: Contract }) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [sendTargets, setSendTargets] = useState<string[]>(["employer", "caregiver", "company"])
  const contractLink = `https://sign.youhou.com/c/${contract.contractNo}`
  
  const handleCopyLink = (target: string) => {
    navigator.clipboard.writeText(contractLink)
    setCopiedLink(target)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  // Mock signature status
  const signatureStatus = {
    company: { signed: true, signedAt: "2025-01-23 11:00" },
    employer: { signed: false },
    caregiver: contract.caregiver ? { signed: false } : null
  }
  
  const unsignedCount = [
    !signatureStatus.company.signed,
    !signatureStatus.employer.signed,
    signatureStatus.caregiver && !signatureStatus.caregiver.signed
  ].filter(Boolean).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="查看签署状态">
          <FileSignature className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            签署状态与分享
          </DialogTitle>
          <DialogDescription>
            合同编号: {contract.contractNo} · {unsignedCount > 0 ? `${unsignedCount}方待签署` : "全部已签署"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Contract Link */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">合同签署链接</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-xs"
                onClick={() => handleCopyLink("main")}
              >
                {copiedLink === "main" ? <Check className="h-3.5 w-3.5 mr-1 text-green-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copiedLink === "main" ? "已复制" : "复制链接"}
              </Button>
            </div>
            <code className="text-xs font-mono text-muted-foreground break-all">{contractLink}</code>
          </div>

          {/* Signatories Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">签约方状态</span>
              <Badge variant="outline" className="text-xs">
                {3 - unsignedCount}/3 已签署
              </Badge>
            </div>
            
            {/* Company */}
            <div className={`p-3 rounded-lg border ${signatureStatus.company.signed ? "bg-green-50/50 border-green-200" : "bg-amber-50/50 border-amber-200"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={sendTargets.includes("company")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSendTargets([...sendTargets, "company"])
                      } else {
                        setSendTargets(sendTargets.filter(t => t !== "company"))
                      }
                    }}
                    className="rounded"
                    disabled={signatureStatus.company.signed}
                  />
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${signatureStatus.company.signed ? "bg-green-100" : "bg-amber-100"}`}>
                    <Building2 className={`h-4 w-4 ${signatureStatus.company.signed ? "text-green-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">丙方(公司)</p>
                      <Badge variant="outline" className={`text-[10px] ${signatureStatus.company.signed ? "bg-green-100 text-green-700 border-green-300" : "bg-amber-100 text-amber-700 border-amber-300"}`}>
                        {signatureStatus.company.signed ? "已签署" : "待签署"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{contract.company}</p>
                  </div>
                </div>
                {!signatureStatus.company.signed && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleCopyLink("company")}>
                    {copiedLink === "company" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Employer */}
            <div className={`p-3 rounded-lg border ${signatureStatus.employer.signed ? "bg-green-50/50 border-green-200" : "bg-amber-50/50 border-amber-200"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={sendTargets.includes("employer")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSendTargets([...sendTargets, "employer"])
                      } else {
                        setSendTargets(sendTargets.filter(t => t !== "employer"))
                      }
                    }}
                    className="rounded"
                    disabled={signatureStatus.employer.signed}
                  />
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={signatureStatus.employer.signed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                      {contract.employer.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">甲方(雇主)</p>
                      <Badge variant="outline" className={`text-[10px] ${signatureStatus.employer.signed ? "bg-green-100 text-green-700 border-green-300" : "bg-amber-100 text-amber-700 border-amber-300"}`}>
                        {signatureStatus.employer.signed ? "已签署" : "待签署"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{contract.employer.name} · {contract.employer.phone}</p>
                  </div>
                </div>
                {!signatureStatus.employer.signed && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleCopyLink("employer")}>
                    {copiedLink === "employer" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Caregiver */}
            {contract.caregiver && signatureStatus.caregiver && (
              <div className={`p-3 rounded-lg border ${signatureStatus.caregiver.signed ? "bg-green-50/50 border-green-200" : "bg-amber-50/50 border-amber-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={sendTargets.includes("caregiver")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSendTargets([...sendTargets, "caregiver"])
                        } else {
                          setSendTargets(sendTargets.filter(t => t !== "caregiver"))
                        }
                      }}
                      className="rounded"
                      disabled={signatureStatus.caregiver.signed}
                    />
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={signatureStatus.caregiver.signed ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}>
                        {contract.caregiver.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">乙方(服务人员)</p>
                        <Badge variant="outline" className={`text-[10px] ${signatureStatus.caregiver.signed ? "bg-green-100 text-green-700 border-green-300" : "bg-amber-100 text-amber-700 border-amber-300"}`}>
                          {signatureStatus.caregiver.signed ? "已签署" : "待签署"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{contract.caregiver.name} · {contract.caregiver.role}</p>
                    </div>
                  </div>
                  {!signatureStatus.caregiver.signed && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleCopyLink("caregiver")}>
                      {copiedLink === "caregiver" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Send Options */}
          {unsignedCount > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">发送方式（勾选未签署方后发送）</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={sendTargets.filter(t => {
                  if (t === "company") return !signatureStatus.company.signed
                  if (t === "employer") return !signatureStatus.employer.signed
                  if (t === "caregiver") return signatureStatus.caregiver && !signatureStatus.caregiver.signed
                  return false
                }).length === 0} className="bg-transparent">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  推送系统消息
                </Button>
                <Button size="sm" variant="outline" disabled={sendTargets.filter(t => {
                  if (t === "company") return !signatureStatus.company.signed
                  if (t === "employer") return !signatureStatus.employer.signed
                  if (t === "caregiver") return signatureStatus.caregiver && !signatureStatus.caregiver.signed
                  return false
                }).length === 0} className="bg-transparent">
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  发送短信
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent">关闭</Button>
          {unsignedCount > 0 && (
            <Button>
              <Send className="h-4 w-4 mr-2" />
              批量推送 ({sendTargets.filter(t => {
                if (t === "company") return !signatureStatus.company.signed
                if (t === "employer") return !signatureStatus.employer.signed
                if (t === "caregiver") return signatureStatus.caregiver && !signatureStatus.caregiver.signed
                return false
              }).length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 合同变更弹窗
function ContractAmendmentDialog({ contract }: { contract: Contract }) {
  const [open, setOpen] = useState(false)
  const [amendmentType, setAmendmentType] = useState<string>("")
  const [formData, setFormData] = useState({
    // 服务终止
    terminationReason: "",
    terminationDate: "",
    terminationInitiator: "consultant" as "consultant" | "caregiver" | "employer",
    refundAmount: "",
    // 人员变更
    newCaregiverId: "",
    newCaregiverName: "",
    changeReason: "",
    effectiveDate: "",
    // 服务周期调整
    newStartDate: "",
    newEndDate: "",
    periodChangeReason: "",
    // 金额调整
    newAmount: "",
    amountChangeReason: "",
    // 服务暂停
    pauseStartDate: "",
    pauseEndDate: "",
    pauseReason: "",
    // 通用
    remark: "",
  })

  const amendmentTypes = [
    { id: "terminate", label: "服务终止", icon: Ban, color: "text-red-600 bg-red-50 border-red-200", desc: "终止当前服务合同" },
    { id: "staff_change", label: "人员变更", icon: UserCog, color: "text-purple-600 bg-purple-50 border-purple-200", desc: "更换服务人员" },
    { id: "period_adjust", label: "服务周期调整", icon: CalendarRange, color: "text-blue-600 bg-blue-50 border-blue-200", desc: "调整服务开始/结束时间" },
    { id: "amount_adjust", label: "金额调整", icon: CreditCard, color: "text-emerald-600 bg-emerald-50 border-emerald-200", desc: "调整合同金额" },
    { id: "pause", label: "服务暂停", icon: Pause, color: "text-amber-600 bg-amber-50 border-amber-200", desc: "暂停服务一段时间" },
    { id: "other", label: "其他变更", icon: FileEdit, color: "text-gray-600 bg-gray-50 border-gray-200", desc: "其他合同条款变更" },
  ]

  const initiatorOptions = [
    { value: "consultant", label: "顾问发起" },
    { value: "caregiver", label: "家政员发起" },
    { value: "employer", label: "雇主发起" },
  ]

  const resetForm = () => {
    setAmendmentType("")
    setFormData({
      terminationReason: "",
      terminationDate: "",
      terminationInitiator: "consultant",
      refundAmount: "",
      newCaregiverId: "",
      newCaregiverName: "",
      changeReason: "",
      effectiveDate: "",
      newStartDate: "",
      newEndDate: "",
      periodChangeReason: "",
      newAmount: "",
      amountChangeReason: "",
      pauseStartDate: "",
      pauseEndDate: "",
      pauseReason: "",
      remark: "",
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="合同变更">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-4 w-4 text-primary" />
            合同变更 - {contract.contractNo}
          </DialogTitle>
          <DialogDescription className="text-xs">
            当前状态: {statusConfig[contract.status].label} · 服务周期: {contract.serviceStartDate} ~ {contract.serviceEndDate}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* 变更类型选择 */}
          {!amendmentType ? (
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">请选择变更类型</Label>
              <div className="grid grid-cols-2 gap-2">
                {amendmentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${type.color}`}
                      onClick={() => setAmendmentType(type.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{type.label}</span>
                      </div>
                      <p className="text-[10px] opacity-70">{type.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              {/* 返回按钮 */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs -ml-2 bg-transparent" 
                onClick={() => setAmendmentType("")}
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                返回选择变更类型
              </Button>

              {/* 当前合同信息 */}
              <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">合同信息</span>
                  <Badge variant="outline" className={`text-[10px] ${statusConfig[contract.status].color}`}>
                    {statusConfig[contract.status].label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">雇主: </span>
                    <span className="font-medium">{contract.employer.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">服务人员: </span>
                    <span className="font-medium">{contract.caregiver?.name || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">合同周期: </span>
                    <span>{contract.serviceStartDate} ~ {contract.serviceEndDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">合同金额: </span>
                    <span className="font-medium text-primary">¥{contract.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 服务终止表单 */}
              {amendmentType === "terminate" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                    <Ban className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">服务终止</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">终止发起方</Label>
                      <RadioGroup 
                        value={formData.terminationInitiator} 
                        onValueChange={(v) => setFormData({...formData, terminationInitiator: v as typeof formData.terminationInitiator})}
                        className="flex gap-4"
                      >
                        {initiatorOptions.map(opt => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`initiator-${opt.value}`} />
                            <Label htmlFor={`initiator-${opt.value}`} className="text-xs cursor-pointer">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">终止日期</Label>
                        <Input 
                          type="date" 
                          className="h-8 text-xs" 
                          value={formData.terminationDate}
                          onChange={(e) => setFormData({...formData, terminationDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">退款金额 (元)</Label>
                        <Input 
                          type="number" 
                          className="h-8 text-xs" 
                          placeholder="0"
                          value={formData.refundAmount}
                          onChange={(e) => setFormData({...formData, refundAmount: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">终止原因</Label>
                      <Select value={formData.terminationReason} onValueChange={(v) => setFormData({...formData, terminationReason: v})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="请选择终止原因" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employer_request">雇主主动解约</SelectItem>
                          <SelectItem value="caregiver_request">服务人员主动解约</SelectItem>
                          <SelectItem value="service_issue">服务问题</SelectItem>
                          <SelectItem value="health_issue">健康原因</SelectItem>
                          <SelectItem value="family_reason">家庭原因</SelectItem>
                          <SelectItem value="mutual_agreement">双方协商一致</SelectItem>
                          <SelectItem value="other">其他原因</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 人员变更表单 */}
              {amendmentType === "staff_change" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
                    <UserCog className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">人员变更</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">当前服务人员</span>
                        <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm mt-1">{contract.caregiver?.name || "未分配"} <span className="text-xs text-muted-foreground font-normal">({contract.caregiver?.role || "-"})</span></p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">新服务人员</Label>
                      <Select value={formData.newCaregiverId} onValueChange={(v) => setFormData({...formData, newCaregiverId: v, newCaregiverName: v === "N001" ? "李美华" : v === "N002" ? "王桂芳" : "陈晓燕"})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="选择新的服务人员" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N001">李美华 - 金牌月嫂 (待接单)</SelectItem>
                          <SelectItem value="N002">王桂芳 - 特级月嫂 (待接单)</SelectItem>
                          <SelectItem value="N003">陈晓燕 - 高级育婴师 (待接单)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">生效日期</Label>
                      <Input 
                        type="date" 
                        className="h-8 text-xs" 
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">变更原因</Label>
                      <Select value={formData.changeReason} onValueChange={(v) => setFormData({...formData, changeReason: v})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="请选择变更原因" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="caregiver_leave">服务人员请假</SelectItem>
                          <SelectItem value="caregiver_resign">服务人员离职</SelectItem>
                          <SelectItem value="employer_request">雇主要求更换</SelectItem>
                          <SelectItem value="skill_mismatch">技能不匹配</SelectItem>
                          <SelectItem value="schedule_conflict">档期冲突</SelectItem>
                          <SelectItem value="other">其他原因</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 服务周期调整表单 */}
              {amendmentType === "period_adjust" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <CalendarRange className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">服务周期调整</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <span className="text-xs text-muted-foreground">当前服务周期</span>
                      <p className="font-medium text-sm mt-1">{contract.serviceStartDate} ~ {contract.serviceEndDate}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">新开始日期</Label>
                        <Input 
                          type="date" 
                          className="h-8 text-xs" 
                          value={formData.newStartDate}
                          onChange={(e) => setFormData({...formData, newStartDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">新结束日期</Label>
                        <Input 
                          type="date" 
                          className="h-8 text-xs" 
                          value={formData.newEndDate}
                          onChange={(e) => setFormData({...formData, newEndDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">调整原因</Label>
                      <Select value={formData.periodChangeReason} onValueChange={(v) => setFormData({...formData, periodChangeReason: v})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="请选择调整原因" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="early_start">提前开始服务</SelectItem>
                          <SelectItem value="delay_start">推迟开始服务</SelectItem>
                          <SelectItem value="extend">服务延期</SelectItem>
                          <SelectItem value="shorten">服务缩短</SelectItem>
                          <SelectItem value="employer_request">雇主要求</SelectItem>
                          <SelectItem value="other">其他原因</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 金额调整表单 */}
              {amendmentType === "amount_adjust" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">金额调整</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <span className="text-xs text-muted-foreground">当前合同金额</span>
                      <p className="font-medium text-sm mt-1 text-primary">¥{contract.amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">新合同金额 (元)</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs" 
                        placeholder="输入调整后的金额"
                        value={formData.newAmount}
                        onChange={(e) => setFormData({...formData, newAmount: e.target.value})}
                      />
                      {formData.newAmount && (
                        <p className="text-[10px] text-muted-foreground">
                          差额: <span className={Number(formData.newAmount) > contract.amount ? "text-green-600" : "text-red-600"}>
                            {Number(formData.newAmount) > contract.amount ? "+" : ""}{(Number(formData.newAmount) - contract.amount).toLocaleString()} 元
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">调整原因</Label>
                      <Select value={formData.amountChangeReason} onValueChange={(v) => setFormData({...formData, amountChangeReason: v})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="请选择调整原因" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service_upgrade">服务升级</SelectItem>
                          <SelectItem value="service_downgrade">服务降级</SelectItem>
                          <SelectItem value="period_change">周期变更</SelectItem>
                          <SelectItem value="discount">优惠减免</SelectItem>
                          <SelectItem value="additional_service">增值服务</SelectItem>
                          <SelectItem value="other">其他原因</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 服务暂停表单 */}
              {amendmentType === "pause" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <Pause className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">服务暂停</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">暂停开始日期</Label>
                        <Input 
                          type="date" 
                          className="h-8 text-xs" 
                          value={formData.pauseStartDate}
                          onChange={(e) => setFormData({...formData, pauseStartDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">预计恢复日期</Label>
                        <Input 
                          type="date" 
                          className="h-8 text-xs" 
                          value={formData.pauseEndDate}
                          onChange={(e) => setFormData({...formData, pauseEndDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">暂停原因</Label>
                      <Select value={formData.pauseReason} onValueChange={(v) => setFormData({...formData, pauseReason: v})}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="请选择暂停原因" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employer_travel">雇主外出</SelectItem>
                          <SelectItem value="employer_hospital">雇主住院</SelectItem>
                          <SelectItem value="caregiver_leave">服务人员请假</SelectItem>
                          <SelectItem value="holiday">节假日休息</SelectItem>
                          <SelectItem value="other">其他原因</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 其他变更表单 */}
              {amendmentType === "other" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <FileEdit className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">其他变更</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">变更内容描述</Label>
                      <Textarea 
                        className="text-xs resize-none" 
                        rows={4}
                        placeholder="请详细描述需要变更的内容..."
                        value={formData.remark}
                        onChange={(e) => setFormData({...formData, remark: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 通用备注 */}
              {amendmentType && amendmentType !== "other" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">备注 (选填)</Label>
                  <Textarea 
                    className="text-xs resize-none" 
                    rows={2}
                    placeholder="补充说明..."
                    value={formData.remark}
                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {amendmentType && (
          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => handleOpenChange(false)}>
              取消
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              提交变更申请
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ContractDetailDialog({ contract }: { contract: Contract }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            合同详情 - {contract.contractNo}
          </DialogTitle>
        </DialogHeader>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${statusConfig[contract.status].color}`}>
              {statusConfig[contract.status].label}
            </Badge>
            <Badge className={`text-xs ${typeConfig[contract.type].color}`}>
              {typeConfig[contract.type].label}
            </Badge>
            <span className="text-xs text-muted-foreground">订单: {contract.orderId}</span>
          </div>
          <div className="text-lg font-bold text-primary">
            ¥{contract.amount.toLocaleString()}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="files" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="files" className="flex-1 text-xs">合同文件</TabsTrigger>
            <TabsTrigger value="service" className="flex-1 text-xs">服务记录</TabsTrigger>
            <TabsTrigger value="amendments" className="flex-1 text-xs">变更记录</TabsTrigger>
            <TabsTrigger value="info" className="flex-1 text-xs">订单详情</TabsTrigger>
          </TabsList>

          {/* Contract Files Tab */}
          <TabsContent value="files" className="flex-1 overflow-y-auto mt-3 space-y-2">
            {contract.contractFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={`text-[10px] ${fileTypeColors[file.type]}`}>{file.typeName}</Badge>
                      <span className="text-xs text-muted-foreground">¥{file.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="outline" className={file.status === "signed" ? "bg-green-50 text-green-700 border-green-200 text-[10px]" : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"}>
                    {file.status === "signed" ? "已签署" : "待签署"}
                  </Badge>
                  <ContractPreviewDialog
                    contractId={file.id}
                    contractNo={contract.contractNo}
                    title={file.title}
                    type={file.type}
                    typeName={file.typeName}
                    amount={file.amount}
                    status={file.status}
                    signedAt={file.signedAt}
                    company={{ name: contract.company }}
                    employer={contract.employer}
                    caregiver={contract.caregiver}
                    serviceStartDate={contract.serviceStartDate}
                    serviceEndDate={contract.serviceEndDate}
                    serviceAddress={contract.serviceAddress}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {contract.contractFiles.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-sm">暂无合同文件</div>
            )}
          </TabsContent>

          {/* Service Records Tab */}
          <TabsContent value="service" className="flex-1 overflow-y-auto mt-3 space-y-3">
            {/* 合同周期 vs 服务周期 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border bg-blue-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">合同周期</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-blue-100 text-blue-700 border-blue-200">合同约定</Badge>
                </div>
                <p className="text-sm font-medium">{contract.serviceStartDate} ~ {contract.serviceEndDate}</p>
                <p className="text-[10px] text-muted-foreground mt-1">合同终止由顾问发起</p>
              </div>
              <div className="p-3 rounded-lg border bg-green-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-700">服务周期</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${
                    contract.serviceStatus === "in_service" ? "bg-green-100 text-green-700 border-green-200" :
                    contract.serviceStatus === "paused" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    contract.serviceStatus === "staff_changed" ? "bg-purple-100 text-purple-700 border-purple-200" :
                    contract.serviceStatus === "service_ended" ? "bg-gray-100 text-gray-700 border-gray-200" :
                    "bg-blue-100 text-blue-700 border-blue-200"
                  }`}>
                    {contract.serviceStatus === "in_service" ? "服务中" :
                     contract.serviceStatus === "paused" ? "暂停中" :
                     contract.serviceStatus === "staff_changed" ? "已换人" :
                     contract.serviceStatus === "service_ended" ? "已结束" : "未开始"}
                  </Badge>
                </div>
                <p className="text-sm font-medium">
                  {contract.actualServiceStart || "待上户"} ~ {contract.actualServiceEnd || "服务中"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">服务终止由家政员发起</p>
              </div>
            </div>

            {/* 服务记录时间线 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">服务记录</h4>
                <span className="text-[10px] text-muted-foreground">
                  {contract.serviceRecords?.length || 0} 条记录
                </span>
              </div>
              {contract.serviceRecords && contract.serviceRecords.length > 0 ? (
                <div className="space-y-2">
                  {contract.serviceRecords.map((record, index) => (
                    <div key={record.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        record.status === "in_service" ? "bg-green-100 text-green-600" :
                        record.status === "service_ended" ? "bg-gray-100 text-gray-600" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{record.caregiverName}</p>
                          <Badge variant="outline" className={`text-[9px] ${
                            record.status === "in_service" ? "bg-green-50 text-green-600 border-green-200" :
                            record.status === "service_ended" ? "bg-gray-50 text-gray-600 border-gray-200" :
                            "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>
                            {record.status === "in_service" ? "服务中" :
                             record.status === "service_ended" ? "已结束" :
                             record.status === "paused" ? "暂停中" : "状态变更"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {record.actualStartDate || "待定"} ~ {record.actualEndDate || "进行中"}
                        </p>
                        {record.changeReason && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {record.changeReason}
                            {record.initiator === "caregiver" && <Badge variant="outline" className="text-[8px] ml-1">家政员发起</Badge>}
                            {record.initiator === "consultant" && <Badge variant="outline" className="text-[8px] ml-1">顾问发起</Badge>}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6 text-sm border rounded-lg">
                  暂无服务记录
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            {contract.status === "in_effect" && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  人员调整
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Pause className="h-3.5 w-3.5 mr-1.5" />
                  服务暂停
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive bg-transparent">
                  <StopCircle className="h-3.5 w-3.5 mr-1.5" />
                  终止服务
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Amendments Tab */}
          <TabsContent value="amendments" className="flex-1 overflow-y-auto mt-3 space-y-2">
            {contract.amendments.map(am => (
              <div key={am.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`text-[10px] ${amendmentTypeColors[am.type] || "bg-gray-50 text-gray-700"}`}>{am.typeName}</Badge>
                  <Badge variant="outline" className={`text-[10px] ${amendmentStatusColors[am.status]}`}>
                    {am.status === "pending" ? "待审批" : am.status === "approved" ? "已通过" : "已拒绝"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{am.reason}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through">{am.originalValue}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{am.newValue}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  申请时间: {am.createdAt} {am.approvedAt && `| 审批时间: ${am.approvedAt}`}
                </p>
              </div>
            ))}
            {contract.amendments.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-sm">暂无变更记录</div>
            )}
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <FileEdit className="h-3.5 w-3.5 mr-1.5" />
                发起变更
              </Button>
            </div>
          </TabsContent>

          {/* Order Info Tab */}
          <TabsContent value="info" className="flex-1 overflow-y-auto mt-3 space-y-3">
            {/* Parties */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">丙方(公司)</span>
                </div>
                <p className="text-xs font-medium">优厚家政</p>
              </div>
              <div className="p-2.5 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-[10px] text-muted-foreground">甲方(雇主)</span>
                </div>
                <p className="text-xs font-medium">{contract.employer.name}</p>
                <p className="text-[10px] text-muted-foreground">{contract.employer.phone}</p>
              </div>
              {contract.caregiver && (
                <div className="p-2.5 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="h-3.5 w-3.5 text-rose-600" />
                    <span className="text-[10px] text-muted-foreground">乙方(服务人员)</span>
                  </div>
                  <p className="text-xs font-medium">{contract.caregiver.name}</p>
                  <p className="text-[10px] text-muted-foreground">{contract.caregiver.role}</p>
                </div>
              )}
            </div>

{/* Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-[10px] text-blue-600 font-medium">合同周期</span>
                </div>
                <p className="text-xs font-medium">{contract.serviceStartDate} ~ {contract.serviceEndDate}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-green-50/50 border border-green-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-[10px] text-green-600 font-medium">服务周期</span>
                </div>
                <p className="text-xs font-medium">
                  {contract.actualServiceStart || "待上户"} ~ {contract.actualServiceEnd || "服务中"}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">合同金额</span>
                </div>
                <p className="text-xs font-medium text-primary">¥{contract.amount.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileSignature className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">签署时间</span>
                </div>
                <p className="text-xs font-medium">{contract.signedAt || "-"}</p>
              </div>
            </div>

            {contract.serviceAddress && (
              <div className="p-2.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">服务地址</span>
                </div>
                <p className="text-xs font-medium">{contract.serviceAddress}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-3 border-t shrink-0">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            下载全部
          </Button>
          {contract.status === "pending_sign" && (
            <Button size="sm">
              <FileSignature className="h-3.5 w-3.5 mr-1.5" />
              发送签署提醒
            </Button>
          )}
          {contract.status === "in_effect" && (
            <>
              <Button variant="outline" size="sm">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                发起变更
              </Button>
              <Button variant="destructive" size="sm">
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                废止合同
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ContractsListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const searchParams = useSearchParams()

  const filteredContracts = mockContracts.filter((c) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["pending_sign", "partially_signed", "signed", "in_effect"].includes(c.status)
    if (activeTab === "completed") return c.status === "completed"
    if (activeTab === "terminated") return c.status === "terminated"
    return true
  })

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">合同管理</h1>
              <p className="text-muted-foreground mt-1">管理所有服务合同的签订、变更和废止</p>
            </div>
            <CreateContractDialog />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <Card>
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg lg:text-2xl font-bold truncate">156</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">全部合同</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 flex-shrink-0">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg lg:text-2xl font-bold truncate">8</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">待签署</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600 flex-shrink-0">
                    <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg lg:text-2xl font-bold truncate">45</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">生效中</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground flex-shrink-0">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg lg:text-2xl font-bold truncate">98</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">已完成</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 lg:col-span-1">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-600 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg lg:text-2xl font-bold truncate">5</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">已废止</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                  <TabsList>
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="active">进行中</TabsTrigger>
                    <TabsTrigger value="completed">已完成</TabsTrigger>
                    <TabsTrigger value="terminated">已废止</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索合同号/客户" className="pl-9 w-full lg:w-60" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full lg:w-36">
                      <SelectValue placeholder="合同类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="maternity">月嫂服务</SelectItem>
                      <SelectItem value="infant">育婴师服务</SelectItem>
                      <SelectItem value="postpartum">产后康复</SelectItem>
                      <SelectItem value="training">培训服务</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-32">合同编号</TableHead>
                  <TableHead>合同类型</TableHead>
                  <TableHead>雇主</TableHead>
                  <TableHead>服务人员</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>服务周期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id} className="group">
                    <TableCell className="font-mono text-sm">{contract.contractNo}</TableCell>
                    <TableCell>
                      <Badge className={typeConfig[contract.type].color}>
                        {typeConfig[contract.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {contract.employer.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contract.employer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.caregiver ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-rose-500/10 text-rose-600 text-xs">
                              {contract.caregiver.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{contract.caregiver.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">¥{contract.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contract.serviceStartDate} ~ {contract.serviceEndDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[contract.status].color}>
                        {statusConfig[contract.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ContractDetailDialog contract={contract} />
                        {(contract.status === "pending_sign" || contract.status === "partially_signed") && (
                          <SignatureShareDialog contract={contract} />
                        )}
                        {(contract.status === "signed" || contract.status === "in_effect") && (
                          <ContractAmendmentDialog contract={contract} />
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">156</span> 条记录
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
