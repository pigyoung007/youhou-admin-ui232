"use client"

import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  Building2,
  User,
  Shield,
  Send,
  ExternalLink,
  CreditCard,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { ContractPreviewDialog } from "@/components/contracts/contract-preview-dialog"

const contractData = {
  id: "CT202501008",
  title: "月嫂服务合同",
  type: "maternity_service",
  status: "in_effect",
  company: {
    name: "银川优厚家庭服务有限公司",
    creditCode: "91640100MA76XXXX",
    address: "银川市兴庆区xxx路xxx号",
    contact: "客服热线: 400-xxx-xxxx",
  },
  employer: {
    name: "张女士",
    phone: "138****1234",
    idCard: "640***********1234",
    address: "上海市浦东新区xxx小区xxx室",
    signedAt: "2025-01-22 10:30",
    signMethod: "电子签名",
  },
  caregiver: {
    id: "N001",
    name: "李春华",
    role: "金牌月嫂",
    phone: "139****5678",
    idCard: "640***********5678",
    signedAt: "2025-01-22 14:20",
    signMethod: "电子签名",
  },
  service: {
    type: "月嫂服务",
    duration: "26天",
    startDate: "2025-03-15",
    endDate: "2025-04-10",
    address: "上海市浦东新区xxx小区xxx室",
  },
  amount: {
    total: 18800,
    deposit: 3000,
    balance: 15800,
    serviceFee: 2820,
    caregiverSalary: 15980,
  },
  insurance: {
    status: "valid",
    policyNo: "INS202501001",
    company: "中国人保",
    coverage: 500000,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
  timeline: [
    { time: "2025-01-23 09:00", event: "合同生效", status: "done" },
    { time: "2025-01-22 14:20", event: "服务人员签署完成", status: "done" },
    { time: "2025-01-22 10:30", event: "雇主签署完成", status: "done" },
    { time: "2025-01-22 09:00", event: "合同发送签署", status: "done" },
    { time: "2025-01-21 16:30", event: "合同创建", status: "done" },
  ],
  createdAt: "2025-01-21 16:30",
  createdBy: "张顾问",
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-muted text-muted-foreground" },
  pending_sign: { label: "待签署", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  partially_signed: { label: "部分签署", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  signed: { label: "已签署", className: "bg-green-500/10 text-green-600 border-green-500/30" },
  in_effect: { label: "生效中", className: "bg-primary/10 text-primary border-primary/30" },
  completed: { label: "已完成", className: "bg-muted text-muted-foreground" },
  terminated: { label: "已废止", className: "bg-red-500/10 text-red-600 border-red-500/30" },
}

export default function ContractDetailPage() {
  const params = useParams()
  const id = params.id as string
  const contract = contractData

  const signProgress = contract.status === "in_effect" || contract.status === "completed" ? 100 : 
    contract.status === "partially_signed" ? 50 : 
    contract.status === "pending_sign" ? 0 : 0

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/contracts/list">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{contract.id}</h1>
              <p className="text-sm text-muted-foreground">{contract.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ContractPreviewDialog
              contractId={contract.id}
              contractNo={contract.id}
              title={contract.title}
              type={contract.type}
              typeName={contract.service.type}
              amount={contract.amount.total}
              status={contract.status === "in_effect" || contract.status === "completed" ? "signed" : "pending"}
              signedAt={contract.employer.signedAt}
              company={{ name: contract.company.name, creditCode: contract.company.creditCode }}
              employer={{ name: contract.employer.name, phone: contract.employer.phone, idCard: contract.employer.idCard }}
              caregiver={{ name: contract.caregiver.name, role: contract.caregiver.role, phone: contract.caregiver.phone }}
              serviceStartDate={contract.service.startDate}
              serviceEndDate={contract.service.endDate}
              serviceAddress={contract.service.address}
              trigger={
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Eye className="h-4 w-4 mr-1.5" />
                  预览合同
                </Button>
              }
            />
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-1.5" />
              下载PDF
            </Button>
            {contract.status === "pending_sign" && (
              <Button size="sm">
                <Send className="h-4 w-4 mr-1.5" />
                发送提醒
              </Button>
            )}
          </div>
        </div>

        {/* Status Banner - Compact */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-teal-500/5 border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{contract.title}</span>
                <Badge variant="outline" className={statusConfig[contract.status]?.className}>
                  {statusConfig[contract.status]?.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {contract.service.startDate} 至 {contract.service.endDate} ({contract.service.duration})
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">合同金额</p>
            <p className="text-xl font-bold text-primary">¥{contract.amount.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Left Column - 3/5 width */}
          <div className="lg:col-span-3 space-y-4">
            {/* Signing Status */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">签署状态</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Progress value={signProgress} className="h-1.5 w-16" />
                    <span className="font-medium text-xs">{signProgress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted-foreground leading-none">丙方(公司)</p>
                      <p className="text-xs font-medium truncate mt-0.5">优厚家政</p>
                    </div>
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
                    <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium shrink-0">
                      {contract.employer.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted-foreground leading-none">甲方(雇主)</p>
                      <p className="text-xs font-medium truncate mt-0.5">{contract.employer.name}</p>
                    </div>
                    {contract.employer.signedAt ? <Check className="h-3.5 w-3.5 text-green-500 shrink-0" /> : <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
                    <div className="h-6 w-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-medium shrink-0">
                      {contract.caregiver.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted-foreground leading-none">乙方(月嫂)</p>
                      <p className="text-xs font-medium truncate mt-0.5">{contract.caregiver.name}</p>
                    </div>
                    {contract.caregiver.signedAt ? <Check className="h-3.5 w-3.5 text-green-500 shrink-0" /> : <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Party Details */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">甲方信息</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <span className="text-muted-foreground text-xs">姓名</span><span className="text-xs font-medium">{contract.employer.name}</span>
                    <span className="text-muted-foreground text-xs">电话</span><span className="text-xs">{contract.employer.phone}</span>
                    <span className="text-muted-foreground text-xs">身份证</span><span className="text-xs font-mono">{contract.employer.idCard}</span>
                    <span className="text-muted-foreground text-xs">签署</span><span className="text-xs">{contract.employer.signedAt?.split(" ")[0] || "-"}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <User className="h-4 w-4 text-rose-600" />
                    <span className="font-medium text-sm">乙方信息</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <span className="text-muted-foreground text-xs">姓名</span>
                    <Link href={`/operations/nanny/${contract.caregiver.id}`} className="text-xs font-medium text-primary hover:underline">{contract.caregiver.name}</Link>
                    <span className="text-muted-foreground text-xs">角色</span><span className="text-xs">{contract.caregiver.role}</span>
                    <span className="text-muted-foreground text-xs">电话</span><span className="text-xs">{contract.caregiver.phone}</span>
                    <span className="text-muted-foreground text-xs">签署</span><span className="text-xs">{contract.caregiver.signedAt?.split(" ")[0] || "-"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">时间线</span>
                </div>
                <div className="flex gap-1">
                  {contract.timeline.map((item, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className="flex items-center justify-center mb-1.5">
                        <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-green-500"}`} />
                        {index < contract.timeline.length - 1 && <div className="flex-1 h-px bg-border mx-1" />}
                      </div>
                      <p className="text-[10px] font-medium leading-tight">{item.event}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time.split(" ")[0].slice(5)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 2/5 width */}
          <div className="lg:col-span-2 space-y-4">
            {/* Amount */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">费用明细</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-xs">
                  <span className="text-muted-foreground">合同总额</span><span className="font-bold text-primary text-sm">¥{contract.amount.total.toLocaleString()}</span>
                  <Separator className="col-span-2 my-1" />
                  <span className="text-muted-foreground">定金</span><span>¥{contract.amount.deposit.toLocaleString()}</span>
                  <span className="text-muted-foreground">尾款</span><span>¥{contract.amount.balance.toLocaleString()}</span>
                  <Separator className="col-span-2 my-1" />
                  <span className="text-muted-foreground">服务费(公司)</span><span>¥{contract.amount.serviceFee.toLocaleString()}</span>
                  <span className="text-muted-foreground">薪资(月嫂)</span><span>¥{contract.amount.caregiverSalary.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Insurance */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-600" />
                    <span className="font-medium text-sm">保险</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-[10px] h-5">有效</Badge>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                  <span className="text-muted-foreground">保单号</span><span className="font-mono">{contract.insurance.policyNo}</span>
                  <span className="text-muted-foreground">公司</span><span>{contract.insurance.company}</span>
                  <span className="text-muted-foreground">保额</span><span>¥{(contract.insurance.coverage / 10000)}万</span>
                  <span className="text-muted-foreground">有效期</span><span>{contract.insurance.startDate.slice(5)} ~ {contract.insurance.endDate.slice(5)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Service */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">服务信息</span>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                  <span className="text-muted-foreground">类型</span><span>{contract.service.type}</span>
                  <span className="text-muted-foreground">周期</span><span>{contract.service.duration}</span>
                  <span className="text-muted-foreground">时间</span><span>{contract.service.startDate.slice(5)} ~ {contract.service.endDate.slice(5)}</span>
                  <span className="text-muted-foreground">地址</span><span className="truncate">{contract.service.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
