"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Clock,
  FileText,
  Send,
  Eye,
  User,
  Building2,
  Calendar,
  AlertCircle,
  Check,
  Phone,
  Edit,
  Smartphone,
  Shield,
  Pen,
  MessageSquare,
  RefreshCcw,
  CheckCircle2,
  Copy,
} from "lucide-react"
import { ContractPreviewDialog } from "@/components/contracts/contract-preview-dialog"

interface PendingContract {
  id: string
  contractNo: string
  title: string
  type: string
  employer: { name: string; phone: string; signed: boolean }
  caregiver?: { name: string; role: string; signed: boolean }
  company: { name: string; signed: boolean }
  amount: number
  createdAt: string
  reminderCount: number
  lastReminder?: string
}

// Mock data for pending contracts
const mockPendingContracts: PendingContract[] = [
  {
    id: "1",
    contractNo: "CT202501001",
    title: "月嫂服务合同",
    type: "月嫂服务",
    employer: { name: "张女士", phone: "138****1234", signed: false },
    caregiver: { name: "李春华", role: "金牌月嫂", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 18800,
    createdAt: "2025-01-20",
    reminderCount: 2,
    lastReminder: "2025-01-22 14:30",
  },
  {
    id: "2",
    contractNo: "CT202501002",
    title: "育婴师服务合同",
    type: "育婴服务",
    employer: { name: "刘先生", phone: "139****5678", signed: true },
    caregiver: { name: "王秀兰", role: "高级育婴师", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 12800,
    createdAt: "2025-01-19",
    reminderCount: 1,
    lastReminder: "2025-01-21 10:00",
  },
  {
    id: "3",
    contractNo: "CT202501003",
    title: "产后康复服务合同",
    type: "产康服务",
    employer: { name: "陈女士", phone: "137****9012", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 8800,
    createdAt: "2025-01-18",
    reminderCount: 0,
  },
  {
    id: "4",
    contractNo: "CT202501004",
    title: "月嫂服务合同",
    type: "月嫂服务",
    employer: { name: "王女士", phone: "136****3456", signed: false },
    caregiver: { name: "张美玲", role: "资深月嫂", signed: true },
    company: { name: "优厚家政", signed: true },
    amount: 15800,
    createdAt: "2025-01-17",
    reminderCount: 3,
    lastReminder: "2025-01-23 09:15",
  },
  {
    id: "5",
    contractNo: "CT202501005",
    title: "育婴师服务合同",
    type: "育婴服务",
    employer: { name: "赵先生", phone: "135****7890", signed: true },
    caregiver: { name: "陈淑芬", role: "育婴师", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 10800,
    createdAt: "2025-01-16",
    reminderCount: 1,
    lastReminder: "2025-01-20 16:45",
  },
  {
    id: "6",
    contractNo: "CT202501006",
    title: "月嫂服务合同",
    type: "月嫂服务",
    employer: { name: "孙女士", phone: "134****2345", signed: false },
    caregiver: { name: "周小红", role: "金牌月嫂", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 19800,
    createdAt: "2025-01-15",
    reminderCount: 2,
    lastReminder: "2025-01-22 11:30",
  },
  {
    id: "7",
    contractNo: "CT202501007",
    title: "产后康复服务合同",
    type: "产康服务",
    employer: { name: "吴女士", phone: "133****6789", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 6800,
    createdAt: "2025-01-14",
    reminderCount: 0,
  },
  {
    id: "8",
    contractNo: "CT202501008",
    title: "月嫂服务合同",
    type: "月嫂服务",
    employer: { name: "郑女士", phone: "132****0123", signed: true },
    caregiver: { name: "吴丽萍", role: "高级月嫂", signed: false },
    company: { name: "优厚家政", signed: true },
    amount: 16800,
    createdAt: "2025-01-13",
    reminderCount: 1,
    lastReminder: "2025-01-19 14:00",
  },
]

// 推送到小程序弹窗
function PushToMiniappDialog({ contract }: { contract: PendingContract }) {
  const [pushTarget, setPushTarget] = useState<string[]>(["employer"])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-transparent">
          <Smartphone className="h-3.5 w-3.5 mr-1.5" />
          推送签署
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>推送合同到小程序</DialogTitle>
          <DialogDescription>选择接收方并发送签署邀请</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">合同编号</span>
              <span className="font-mono text-sm">{contract.contractNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">合同金额</span>
              <span className="font-semibold text-primary">
                ¥{contract.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>选择推送对象</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={pushTarget.includes("employer")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPushTarget([...pushTarget, "employer"])
                    } else {
                      setPushTarget(pushTarget.filter((t) => t !== "employer"))
                    }
                  }}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {contract.employer.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{contract.employer.name}</p>
                    <p className="text-xs text-muted-foreground">雇主 (甲方)</p>
                  </div>
                </div>
                {!contract.employer.signed && (
                  <Badge
                    variant="outline"
                    className="ml-auto bg-amber-50 text-amber-600 border-amber-200"
                  >
                    待签署
                  </Badge>
                )}
              </label>

              {contract.caregiver && (
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={pushTarget.includes("caregiver")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPushTarget([...pushTarget, "caregiver"])
                      } else {
                        setPushTarget(pushTarget.filter((t) => t !== "caregiver"))
                      }
                    }}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-rose-100 text-rose-600">
                        {contract.caregiver.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{contract.caregiver.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.caregiver.role} (乙方)
                      </p>
                    </div>
                  </div>
                  {!contract.caregiver.signed && (
                    <Badge
                      variant="outline"
                      className="ml-auto bg-amber-50 text-amber-600 border-amber-200"
                    >
                      待签署
                    </Badge>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>附加消息 (可选)</Label>
            <Textarea placeholder="您好，请查收并签署合同..." rows={3} />
  </div>
  
  <Alert>
    <Smartphone className="h-4 w-4" />
    <AlertDescription className="text-sm">
      推送后，接收方将在小程序收到签署通知，可直接在线完成电子签名
    </AlertDescription>
  </Alert>
  </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent">
            取消
          </Button>
          <Button disabled={pushTarget.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            发送推送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 修改合同内容弹窗
function EditContractDialog({ contract }: { contract: PendingContract }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-transparent">
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          修改
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>修改待签合同</DialogTitle>
          <DialogDescription>修改合同内容、金额或保险信息</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">
              合同内容
            </TabsTrigger>
            <TabsTrigger value="amount" className="flex-1">
              金额调整
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex-1">
              保险信息
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>服务开始日期</Label>
              <Input type="date" defaultValue="2025-03-15" />
            </div>
            <div className="space-y-2">
              <Label>服务结束日期</Label>
              <Input type="date" defaultValue="2025-04-15" />
            </div>
            <div className="space-y-2">
              <Label>服务地址</Label>
              <Input defaultValue="北京市朝阳区xxx小区" />
            </div>
            <div className="space-y-2">
              <Label>特殊条款</Label>
              <Textarea placeholder="添加特殊服务条款..." rows={3} />
            </div>
          </TabsContent>

          <TabsContent value="amount" className="space-y-4 mt-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">当前金额</span>
                <span className="font-semibold">¥{contract.amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>调整后金额</Label>
              <Input type="number" defaultValue={contract.amount} />
            </div>
            <div className="space-y-2">
              <Label>调整原因</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择原因" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extend">服务延期</SelectItem>
                  <SelectItem value="add">增加服务项目</SelectItem>
                  <SelectItem value="discount">优惠折扣</SelectItem>
                  <SelectItem value="other">其他原因</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>备注说明</Label>
              <Textarea placeholder="详细说明金额调整原因..." rows={2} />
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4 mt-4">
            <Alert className="bg-green-50 border-green-200">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700 text-sm">保险状态正常</AlertTitle>
              <AlertDescription className="text-green-600 text-xs">
                服务人员保险有效期至 2025-06-30
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>保险公司</Label>
              <Select defaultValue="picc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="picc">中国人民财产保险</SelectItem>
                  <SelectItem value="cpic">中国太平洋保险</SelectItem>
                  <SelectItem value="pingan">中国平安保险</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>保险金额</Label>
              <Select defaultValue="100">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50万元</SelectItem>
                  <SelectItem value="100">100万元</SelectItem>
                  <SelectItem value="200">200万元</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>受益人</Label>
              <Input defaultValue={contract.employer.name} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" className="bg-transparent">
            取消
          </Button>
          <Button>保存修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 电子签名弹窗
function ElectronicSignDialog({ contract }: { contract: PendingContract }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Pen className="h-3.5 w-3.5 mr-1.5" />
          在线签署
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>电子签名</DialogTitle>
          <DialogDescription>代表公司方 (丙方) 完成电子签名</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">合同编号</span>
              <span className="font-mono">{contract.contractNo}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">合同标题</span>
              <span>{contract.title}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">合同金额</span>
              <span className="font-semibold text-primary">
                ¥{contract.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>签署人</Label>
            <Select defaultValue="manager">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">张经理 (授权签署人)</SelectItem>
                <SelectItem value="director">李总监 (授权签署人)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>签名区域</Label>
            <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center bg-muted/30">
              <div className="text-center text-muted-foreground">
                <Pen className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">点击或拖拽绘制签名</p>
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-sm">
              电子签名具有法律效力，签署后将生成带数字证书的合同文件
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent">
            取消
          </Button>
          <Button>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            确认签署
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 签署状态详情弹窗 - 查看谁未签署并可再次发送
function SignatureStatusDialog({ contract }: { contract: PendingContract }) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const contractLink = `https://sign.youhou.com/c/${contract.contractNo}`

  const handleCopyLink = (target: string) => {
    navigator.clipboard.writeText(contractLink)
    setCopiedLink(target)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const unsignedCount = [
    !contract.employer.signed,
    contract.caregiver && !contract.caregiver.signed,
    !contract.company.signed,
  ].filter(Boolean).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-transparent">
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          签署状态
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            签署状态详情
          </DialogTitle>
          <DialogDescription>
            合同编号: {contract.contractNo} ·{" "}
            {unsignedCount > 0 ? `${unsignedCount}方待签署` : "全部已签署"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Contract Link */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">合同签署链接</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => handleCopyLink("main")}
              >
                {copiedLink === "main" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copiedLink === "main" ? "已复制" : "复制链接"}
              </Button>
            </div>
            <code className="text-xs font-mono text-muted-foreground break-all">
              {contractLink}
            </code>
          </div>

          {/* Signatories Status */}
          <div className="space-y-3">
            {/* Company */}
            <div
              className={`p-3 rounded-lg border ${
                contract.company.signed
                  ? "bg-green-50/50 border-green-200"
                  : "bg-amber-50/50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      contract.company.signed ? "bg-green-100" : "bg-amber-100"
                    }`}
                  >
                    <Building2
                      className={`h-4 w-4 ${
                        contract.company.signed ? "text-green-600" : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">丙方(公司)</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          contract.company.signed
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-amber-100 text-amber-700 border-amber-300"
                        }`}
                      >
                        {contract.company.signed ? "已签署" : "待签署"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{contract.company.name}</p>
                  </div>
                </div>
                {!contract.company.signed && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("company")}
                    >
                      {copiedLink === "company" ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      <Send className="h-3 w-3 mr-1" />
                      推送
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Employer */}
            <div
              className={`p-3 rounded-lg border ${
                contract.employer.signed
                  ? "bg-green-50/50 border-green-200"
                  : "bg-amber-50/50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={
                        contract.employer.signed
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {contract.employer.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">甲方(雇主)</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          contract.employer.signed
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-amber-100 text-amber-700 border-amber-300"
                        }`}
                      >
                        {contract.employer.signed ? "已签署" : "待签署"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {contract.employer.name} · {contract.employer.phone}
                    </p>
                  </div>
                </div>
                {!contract.employer.signed && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("employer")}
                    >
                      {copiedLink === "employer" ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      <Send className="h-3 w-3 mr-1" />
                      推送
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Caregiver */}
            {contract.caregiver && (
              <div
                className={`p-3 rounded-lg border ${
                  contract.caregiver.signed
                    ? "bg-green-50/50 border-green-200"
                    : "bg-amber-50/50 border-amber-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={
                          contract.caregiver.signed
                            ? "bg-green-100 text-green-700"
                            : "bg-rose-100 text-rose-700"
                        }
                      >
                        {contract.caregiver.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">乙方(服务人员)</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            contract.caregiver.signed
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-amber-100 text-amber-700 border-amber-300"
                          }`}
                        >
                          {contract.caregiver.signed ? "已签署" : "待签署"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {contract.caregiver.name} · {contract.caregiver.role}
                      </p>
                    </div>
                  </div>
                  {!contract.caregiver.signed && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => handleCopyLink("caregiver")}
                      >
                        {copiedLink === "caregiver" ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                        <Send className="h-3 w-3 mr-1" />
                        推送
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reminder Info */}
          {contract.reminderCount > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCcw className="h-4 w-4" />
                <span>已提醒 {contract.reminderCount} 次</span>
                {contract.lastReminder && <span>· 最近提醒: {contract.lastReminder}</span>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent">
            关闭
          </Button>
          {unsignedCount > 0 && (
            <Button>
              <Send className="h-4 w-4 mr-2" />
              批量推送未签署方 ({unsignedCount})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PendingContractsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">待签合同</h1>
            <p className="text-muted-foreground mt-1">跟踪合同签署进度，发送签署提醒</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-600 border-amber-500/30 px-3 py-1.5"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {mockPendingContracts.length} 份待签署
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockPendingContracts.length}</p>
                  <p className="text-sm text-muted-foreground">待签合同</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockPendingContracts.filter((c) => !c.employer.signed).length}
                  </p>
                  <p className="text-sm text-muted-foreground">等待雇主签署</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockPendingContracts.filter((c) => c.caregiver && !c.caregiver.signed).length}
                  </p>
                  <p className="text-sm text-muted-foreground">等待服务人员签署</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract List */}
        <div className="space-y-4">
          {mockPendingContracts.map((contract) => {
            const totalParties = contract.caregiver ? 3 : 2
            const signedCount = [
              contract.company.signed,
              contract.employer.signed,
              contract.caregiver?.signed,
            ].filter(Boolean).length
            const progress = Math.round((signedCount / totalParties) * 100)

            return (
              <Card key={contract.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Contract Info */}
                    <div className="lg:w-1/3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-mono text-sm text-muted-foreground">
                          {contract.contractNo}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{contract.title}</h3>
                      <Badge className="mt-2 bg-primary/10 text-primary">{contract.type}</Badge>
                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          创建于 {contract.createdAt}
                        </div>
                        {contract.lastReminder && (
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            已提醒 {contract.reminderCount} 次
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-xl font-bold text-primary">
                        ¥{contract.amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Signature Status */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">签署进度</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress === 100 ? "bg-green-500" : "bg-primary"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {signedCount}/{totalParties}
                          </span>
                        </div>
                      </div>

                      {/* Company */}
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          contract.company.signed
                            ? "bg-muted/30"
                            : "bg-amber-500/5 border border-amber-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              contract.company.signed ? "bg-primary/10" : "bg-amber-100"
                            }`}
                          >
                            <Building2
                              className={`h-4 w-4 ${
                                contract.company.signed ? "text-primary" : "text-amber-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">丙方(公司)</p>
                            <p className="text-xs text-muted-foreground">{contract.company.name}</p>
                          </div>
                        </div>
                        {contract.company.signed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-500/30"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            已签署
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 border-amber-500/30"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            待签署
                          </Badge>
                        )}
                      </div>

                      {/* Employer */}
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          contract.employer.signed
                            ? "bg-muted/30"
                            : "bg-amber-500/5 border border-amber-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {contract.employer.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">甲方(雇主)</p>
                            <p className="text-xs text-muted-foreground">
                              {contract.employer.name} · {contract.employer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.employer.signed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-600 border-green-500/30"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              已签署
                            </Badge>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-600 border-amber-500/30"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                待签署
                              </Badge>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <Phone className="h-3 w-3 mr-1" />
                                提醒
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Caregiver */}
                      {contract.caregiver && (
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            contract.caregiver.signed
                              ? "bg-muted/30"
                              : "bg-amber-500/5 border border-amber-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-rose-500/10 text-rose-600">
                                {contract.caregiver.name.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">乙方(服务人员)</p>
                              <p className="text-xs text-muted-foreground">
                                {contract.caregiver.name} · {contract.caregiver.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {contract.caregiver.signed ? (
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-600 border-green-500/30"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                已签署
                              </Badge>
                            ) : (
                              <>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-500/10 text-amber-600 border-amber-500/30"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  待签署
                                </Badge>
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  <Phone className="h-3 w-3 mr-1" />
                                  提醒
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-52 flex flex-row lg:flex-col gap-2">
                      <div className="flex gap-2 flex-1">
                        <SignatureStatusDialog contract={contract} />
                        <EditContractDialog contract={contract} />
                      </div>
                      <div className="flex gap-2 flex-1">
                        <PushToMiniappDialog contract={contract} />
                        <ContractPreviewDialog
                          contractId={contract.id}
                          contractNo={contract.contractNo}
                          title={contract.title}
                          type="main"
                          typeName={contract.type}
                          amount={contract.amount}
                          status="pending"
                          company={{ name: contract.company.name }}
                          employer={{
                            name: contract.employer.name,
                            phone: contract.employer.phone,
                          }}
                          caregiver={
                            contract.caregiver
                              ? {
                                  name: contract.caregiver.name,
                                  role: contract.caregiver.role,
                                }
                              : undefined
                          }
                          trigger={
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              预览
                            </Button>
                          }
                        />
                      </div>
                      <div className="flex gap-2 flex-1">
                        <ElectronicSignDialog contract={contract} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
