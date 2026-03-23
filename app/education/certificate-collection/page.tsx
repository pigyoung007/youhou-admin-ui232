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
import { Separator } from "@/components/ui/separator"
import {
  Search, Award, CheckCircle2, Clock, XCircle, AlertCircle,
  Download, Eye, MoreHorizontal, FileText, Upload, Printer,
  GraduationCap, Shield, User, Package
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================
type CertType = "completion" | "skill"
type CollectionStatus = "pending_apply" | "applied" | "outbound_generated" | "warehouse_confirmed" | "student_confirmed" | "cancelled"

interface CertCollectionRecord {
  id: string
  certType: CertType
  studentName: string
  studentPhone: string
  courseName: string
  className: string
  certName: string
  certNo: string
  certFileUrl: string
  outboundId: string
  applicantName: string
  applyDate: string
  warehouseConfirmedBy: string
  warehouseConfirmDate: string | null
  studentConfirmDate: string | null
  status: CollectionStatus
  note: string
}

// ==================== Mock数据 ====================
const collectionRecords: CertCollectionRecord[] = [
  {
    id: "CC001", certType: "completion", studentName: "李春华", studentPhone: "138****5678",
    courseName: "高级月嫂培训", className: "2024年第3期", certName: "优厚家庭服务结业证书",
    certNo: "JY-2025-001234", certFileUrl: "/certs/jy001234.pdf",
    outboundId: "CO-20250201001", applicantName: "教务张老师", applyDate: "2025-02-01",
    warehouseConfirmedBy: "王库管", warehouseConfirmDate: "2025-02-02",
    studentConfirmDate: "2025-02-03", status: "student_confirmed", note: "学员已在小程序确认领取"
  },
  {
    id: "CC002", certType: "skill", studentName: "李春华", studentPhone: "138****5678",
    courseName: "高级月嫂培训", className: "2024年第3期", certName: "高级母婴护理师证",
    certNo: "YS-2025-001234", certFileUrl: "/certs/ys001234.pdf",
    outboundId: "CO-20250205001", applicantName: "周顾问", applyDate: "2025-02-05",
    warehouseConfirmedBy: "王库管", warehouseConfirmDate: "2025-02-06",
    studentConfirmDate: "2025-02-07", status: "student_confirmed", note: ""
  },
  {
    id: "CC003", certType: "completion", studentName: "王秀兰", studentPhone: "139****1234",
    courseName: "产康师初级认证", className: "2024年第2期", certName: "优厚家庭服务结业证书",
    certNo: "JY-2025-001235", certFileUrl: "",
    outboundId: "CO-20250210001", applicantName: "教务张老师", applyDate: "2025-02-10",
    warehouseConfirmedBy: "王库管", warehouseConfirmDate: "2025-02-11",
    studentConfirmDate: null, status: "warehouse_confirmed", note: "待学员小程序确认"
  },
  {
    id: "CC004", certType: "skill", studentName: "王秀兰", studentPhone: "139****1234",
    courseName: "产康师初级认证", className: "2024年第2期", certName: "产康师初级证",
    certNo: "CK-2025-001235", certFileUrl: "",
    outboundId: "CO-20250212001", applicantName: "孙顾问", applyDate: "2025-02-12",
    warehouseConfirmedBy: "", warehouseConfirmDate: null,
    studentConfirmDate: null, status: "outbound_generated", note: ""
  },
  {
    id: "CC005", certType: "skill", studentName: "张美玲", studentPhone: "137****9876",
    courseName: "育婴师专业班", className: "2024年第1期", certName: "育婴师证",
    certNo: "", certFileUrl: "",
    outboundId: "", applicantName: "", applyDate: "",
    warehouseConfirmedBy: "", warehouseConfirmDate: null,
    studentConfirmDate: null, status: "pending_apply", note: "证书制作中"
  },
  {
    id: "CC006", certType: "completion", studentName: "陈桂芳", studentPhone: "135****5555",
    courseName: "高级月嫂培训", className: "2024年第3期", certName: "优厚家庭服务结业证书",
    certNo: "JY-2025-001236", certFileUrl: "/certs/jy001236.pdf",
    outboundId: "CO-20250215001", applicantName: "教务张老师", applyDate: "2025-02-15",
    warehouseConfirmedBy: "", warehouseConfirmDate: null,
    studentConfirmDate: null, status: "applied", note: "已提交申请，待生成出库单"
  },
]

const statusConfig: Record<CollectionStatus, { label: string; className: string; step: number }> = {
  pending_apply: { label: "待申请", className: "bg-slate-100 text-slate-600 border-slate-200", step: 0 },
  applied: { label: "已申请", className: "bg-blue-100 text-blue-700 border-blue-200", step: 1 },
  outbound_generated: { label: "出库单已生成", className: "bg-amber-100 text-amber-700 border-amber-200", step: 2 },
  warehouse_confirmed: { label: "库管已确认", className: "bg-teal-100 text-teal-700 border-teal-200", step: 3 },
  student_confirmed: { label: "学员已确认", className: "bg-emerald-100 text-emerald-700 border-emerald-200", step: 4 },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-700 border-red-200", step: -1 },
}

const certTypeConfig: Record<CertType, { label: string; icon: React.ElementType; className: string }> = {
  completion: { label: "结业证书", icon: GraduationCap, className: "bg-primary/10 text-primary border-primary/20" },
  skill: { label: "技能证书", icon: Shield, className: "bg-violet-100 text-violet-700 border-violet-200" },
}

// ==================== 页面组件 ====================
export default function CertificateCollectionPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailRecord, setDetailRecord] = useState<CertCollectionRecord | null>(null)

  const filteredRecords = useMemo(() => {
    return collectionRecords.filter(r => {
      const matchSearch = !search || r.studentName.includes(search) || r.certName.includes(search) || r.certNo.includes(search)
      const matchType = typeFilter === "all" || r.certType === typeFilter
      const matchStatus = statusFilter === "all" || r.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [search, typeFilter, statusFilter])

  const stats = useMemo(() => ({
    total: collectionRecords.length,
    completion: collectionRecords.filter(r => r.certType === "completion").length,
    skill: collectionRecords.filter(r => r.certType === "skill").length,
    pending: collectionRecords.filter(r => r.status !== "student_confirmed" && r.status !== "cancelled").length,
    confirmed: collectionRecords.filter(r => r.status === "student_confirmed").length,
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">证书领取</h1>
            <p className="text-muted-foreground">管理学员结业证书与技能证书的申请发放与领取确认</p>
          </div>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            导出记录
          </Button>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Award className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">总记录</p><p className="text-xl font-bold">{stats.total}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-xs text-muted-foreground">结业证书</p><p className="text-xl font-bold text-blue-600">{stats.completion}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center"><Shield className="h-5 w-5 text-violet-600" /></div>
              <div><p className="text-xs text-muted-foreground">技能证书</p><p className="text-xl font-bold text-violet-600">{stats.skill}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-xs text-muted-foreground">待处理</p><p className="text-xl font-bold text-amber-600">{stats.pending}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">已完成</p><p className="text-xl font-bold text-emerald-600">{stats.confirmed}</p></div>
            </div>
          </Card>
        </div>

        {/* 筛选 */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索学员/证书名称/证书编号..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28"><SelectValue placeholder="类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="completion">结业证书</SelectItem>
                <SelectItem value="skill">技能证书</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending_apply">待申请</SelectItem>
                <SelectItem value="applied">已申请</SelectItem>
                <SelectItem value="outbound_generated">出库单已生成</SelectItem>
                <SelectItem value="warehouse_confirmed">库管已确认</SelectItem>
                <SelectItem value="student_confirmed">学员已确认</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* 列表 */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">类型</TableHead>
                  <TableHead>学员</TableHead>
                  <TableHead>证书名称</TableHead>
                  <TableHead className="w-28">课程/班级</TableHead>
                  <TableHead className="w-32">证书编号</TableHead>
                  <TableHead className="w-20">申请人</TableHead>
                  <TableHead className="w-24">申请日期</TableHead>
                  <TableHead className="w-28">状态</TableHead>
                  <TableHead className="w-16 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => {
                  const st = statusConfig[record.status]
                  const ct = certTypeConfig[record.certType]
                  const CIcon = ct.icon
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] gap-1", ct.className)}>
                          <CIcon className="h-3 w-3" />{ct.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/10 text-primary text-xs">{record.studentName[0]}</AvatarFallback></Avatar>
                          <div>
                            <div className="text-sm font-medium">{record.studentName}</div>
                            <div className="text-xs text-muted-foreground">{record.studentPhone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.certName}</TableCell>
                      <TableCell>
                        <div className="text-xs">{record.courseName}</div>
                        <div className="text-[10px] text-muted-foreground">{record.className}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{record.certNo || "-"}</TableCell>
                      <TableCell className="text-sm">{record.applicantName || "-"}</TableCell>
                      <TableCell className="text-xs">{record.applyDate || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", st.className)}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailRecord(record)}><Eye className="h-3.5 w-3.5 mr-2" />查看详情</DropdownMenuItem>
                            {record.status === "pending_apply" && (
                              <DropdownMenuItem><Award className="h-3.5 w-3.5 mr-2" />申请发放</DropdownMenuItem>
                            )}
                            {record.status === "applied" && (
                              <DropdownMenuItem><Package className="h-3.5 w-3.5 mr-2" />生成出库单</DropdownMenuItem>
                            )}
                            {record.status === "outbound_generated" && (
                              <DropdownMenuItem><CheckCircle2 className="h-3.5 w-3.5 mr-2" />库管确认</DropdownMenuItem>
                            )}
                            {record.certFileUrl && (
                              <DropdownMenuItem><Download className="h-3.5 w-3.5 mr-2" />下载电子版</DropdownMenuItem>
                            )}
                            {!record.certFileUrl && record.status !== "pending_apply" && (
                              <DropdownMenuItem><Upload className="h-3.5 w-3.5 mr-2" />上传电子版</DropdownMenuItem>
                            )}
                            <DropdownMenuItem><Printer className="h-3.5 w-3.5 mr-2" />打印出库单</DropdownMenuItem>
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

        {/* 详情弹窗 */}
        <Dialog open={!!detailRecord} onOpenChange={(o) => !o && setDetailRecord(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base">证书领取详情</DialogTitle>
              <DialogDescription className="text-xs">
                {detailRecord && <Badge variant="outline" className={cn("text-xs", certTypeConfig[detailRecord.certType].className)}>{certTypeConfig[detailRecord.certType].label}</Badge>}
              </DialogDescription>
            </DialogHeader>
            {detailRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">学员：</span><span className="font-medium">{detailRecord.studentName}</span></div>
                  <div><span className="text-muted-foreground">电话：</span>{detailRecord.studentPhone}</div>
                  <div><span className="text-muted-foreground">课程：</span>{detailRecord.courseName}</div>
                  <div><span className="text-muted-foreground">班级：</span>{detailRecord.className}</div>
                  <div><span className="text-muted-foreground">证书名称：</span><span className="font-medium">{detailRecord.certName}</span></div>
                  <div><span className="text-muted-foreground">证书编号：</span><span className="font-mono text-xs">{detailRecord.certNo || "待编号"}</span></div>
                </div>
                <Separator />
                {/* 流程时间线 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">领取流程</Label>
                  <div className="space-y-3">
                    {[
                      { step: 1, label: "申请发放", detail: detailRecord.applicantName ? `${detailRecord.applicantName} 于 ${detailRecord.applyDate} 提交申请` : "待申请", done: statusConfig[detailRecord.status].step >= 1 },
                      { step: 2, label: "生成出库单", detail: detailRecord.outboundId ? `出库单号: ${detailRecord.outboundId}` : "待生成", done: statusConfig[detailRecord.status].step >= 2 },
                      { step: 3, label: "库管确认发放", detail: detailRecord.warehouseConfirmDate ? `${detailRecord.warehouseConfirmedBy} 于 ${detailRecord.warehouseConfirmDate} 确认` : "待确认", done: statusConfig[detailRecord.status].step >= 3 },
                      { step: 4, label: "学员确认领取", detail: detailRecord.studentConfirmDate ? `学员于 ${detailRecord.studentConfirmDate} 在小程序确认` : "待学员在小程序确认", done: statusConfig[detailRecord.status].step >= 4 },
                    ].map(item => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                          item.done ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                        )}>
                          {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm", item.done ? "font-medium" : "text-muted-foreground")}>{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {detailRecord.note && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">{detailRecord.note}</p>
                )}
                <p className="text-xs text-muted-foreground bg-blue-50 rounded-lg p-3 border border-blue-100">
                  {detailRecord.certType === "completion" 
                    ? "结业证书流程：学员完成岗前培训 -> 教务在学员信息中申请发放 -> 系统生成出库单 -> 库管发放并确认 -> 学员小程序确认领取"
                    : "技能证书流程：证书办理完成 -> 顾问在学员信息中选择证书申请发放 -> 上传电子版 -> 系统生成出库单 -> 库管发放并确认 -> 学员小程序确认领取（需本人签字确认）"
                  }
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
