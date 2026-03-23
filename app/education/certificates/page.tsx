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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  Search, Award, Download, Eye, Plus, CheckCircle2, Clock, XCircle, 
  MoreHorizontal, Edit, Trash2, FileText, Calendar, User, BookOpen, Link, Settings
} from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"
import { cn } from "@/lib/utils"

interface Certificate {
  id: string
  name: string
  studentId: string
  type: string
  certNo: string
  issueDate: string | null
  expireDate: string | null
  status: "valid" | "expiring" | "expired" | "pending"
  course: string
  className: string
  score?: number
}

interface CertificateTemplate {
  id: string
  name: string
  description: string
  validYears: number
  courses: string[]
  issuedCount: number
  status: "active" | "inactive"
}

const certificates: Certificate[] = [
  { id: "CERT202510001", name: "李春华", studentId: "S001", type: "高级母婴护理师证", certNo: "YS-2025-001234", issueDate: "2025-10-15", expireDate: "2028-10-15", status: "valid", course: "高级月嫂培训", className: "2024年第3期", score: 92 },
  { id: "CERT202510002", name: "王秀兰", studentId: "S002", type: "产康师初级证", certNo: "CK-2025-001235", issueDate: "2025-09-20", expireDate: "2028-09-20", status: "valid", course: "产康师初级认证", className: "2024年第2期", score: 88 },
  { id: "CERT202510003", name: "张美玲", studentId: "S003", type: "育婴师证", certNo: "YY-2025-001236", issueDate: "2025-08-10", expireDate: "2028-08-10", status: "valid", course: "育婴师专业班", className: "2024年第1期", score: 78 },
  { id: "CERT202510004", name: "陈桂芳", studentId: "S004", type: "高级母婴护理师证", certNo: "YS-2023-000456", issueDate: "2023-05-15", expireDate: "2026-05-15", status: "expiring", course: "高级月嫂培训", className: "2023年第2期", score: 95 },
  { id: "CERT202510005", name: "刘芳芳", studentId: "S005", type: "产康师高级证", certNo: "", issueDate: null, expireDate: null, status: "pending", course: "产康师高级进阶", className: "2024年第3期", score: 85 },
  { id: "CERT202510006", name: "赵丽娜", studentId: "S006", type: "高级母婴护理师证", certNo: "", issueDate: null, expireDate: null, status: "pending", course: "高级月嫂培训", className: "2024年第3期", score: 91 },
  { id: "CERT202510007", name: "孙晓燕", studentId: "S007", type: "育婴师证", certNo: "YY-2025-001237", issueDate: "2025-07-20", expireDate: "2028-07-20", status: "valid", course: "育婴师专业班", className: "2024年第1期", score: 89 },
  { id: "CERT202510008", name: "吴美华", studentId: "S009", type: "金牌母婴护理师证", certNo: "YS-2025-000123", issueDate: "2025-05-15", expireDate: "2028-05-15", status: "valid", course: "高级月嫂培训", className: "2024年第1期", score: 98 },
  { id: "CERT202510009", name: "周婷婷", studentId: "S008", type: "产康师初级证", certNo: "", issueDate: null, expireDate: null, status: "pending", course: "产康师初级认证", className: "2024年第3期", score: 72 },
]

const certificateTemplates: CertificateTemplate[] = [
  { id: "T001", name: "高级母婴护理师证", description: "高级月嫂培训结业证书", validYears: 3, courses: ["高级月嫂培训"], issuedCount: 256, status: "active" },
  { id: "T002", name: "金牌母婴护理师证", description: "金牌月嫂认证证书", validYears: 3, courses: ["高级月嫂培训"], issuedCount: 58, status: "active" },
  { id: "T003", name: "产康师初级证", description: "产康师初级培训结业证书", validYears: 3, courses: ["产康师初级认证"], issuedCount: 128, status: "active" },
  { id: "T004", name: "产康师高级证", description: "产康师高级培训结业证书", validYears: 3, courses: ["产康师高级进阶"], issuedCount: 45, status: "active" },
  { id: "T005", name: "育婴师证", description: "育婴师专业培训结业证书", validYears: 3, courses: ["育婴师专业班"], issuedCount: 189, status: "active" },
  { id: "T006", name: "催乳师证", description: "催乳师专项培训结业证书", validYears: 3, courses: ["催乳师专项培训"], issuedCount: 76, status: "active" },
]

const statusConfig = {
  valid: { label: "有效", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  expiring: { label: "即将过期", color: "bg-amber-100 text-amber-700 border-amber-200" },
  expired: { label: "已过期", color: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "待颁发", color: "bg-blue-100 text-blue-700 border-blue-200" },
}

// Certificate Preview Dialog
function CertificatePreviewDialog({ cert, trigger }: { cert: Certificate; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            证书预览
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Certificate Preview */}
          <div className="border-4 border-amber-200 rounded-lg p-6 bg-gradient-to-br from-amber-50 to-orange-50 relative">
            <div className="absolute top-2 right-2 flex items-center gap-1 text-amber-700">
              <Award className="h-5 w-5" />
            </div>
            
            <div className="text-center space-y-4">
              <div>
                <h2 className="text-xl font-bold text-amber-800">培训结业证书</h2>
                <p className="text-xs text-amber-600 mt-1">{cert.type}</p>
              </div>
              
              <div className="py-4 border-y border-amber-200">
                <p className="text-sm text-gray-600">兹证明</p>
                <p className="text-2xl font-bold text-gray-800 my-2">{cert.name}</p>
                <p className="text-sm text-gray-600">
                  完成 <span className="font-medium">{cert.course}</span> 培训课程
                </p>
                <p className="text-sm text-gray-600">
                  成绩合格 {cert.score && <span className="font-medium text-green-600">({cert.score}分)</span>}
                </p>
                <p className="text-sm text-gray-600">准予结业</p>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                {cert.certNo && <p>证书编号: <span className="font-mono">{cert.certNo}</span></p>}
                {cert.issueDate && <p>颁发日期: {cert.issueDate}</p>}
                {cert.expireDate && <p>有效期至: {cert.expireDate}</p>}
              </div>
              
              <div className="pt-4">
                <div className="w-20 h-20 mx-auto border-2 border-dashed border-amber-300 rounded-full flex items-center justify-center text-amber-400 text-xs">
                  公章位置
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">证书信息</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">学员姓名</p>
                <p className="text-xs font-medium">{cert.name}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">证书类型</p>
                <p className="text-xs font-medium">{cert.type}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">培训课程</p>
                <p className="text-xs font-medium">{cert.course}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">所在班级</p>
                <p className="text-xs font-medium">{cert.className}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <Badge variant="outline" className={cn("text-[10px]", statusConfig[cert.status].color)}>
              {statusConfig[cert.status].label}
            </Badge>
            <div className="flex gap-1.5">
              {cert.status !== "pending" && (
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />下载</Button>
              )}
              <Button size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" />打印</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Issue Certificate Dialog
function IssueCertificateDialog({ cert, trigger }: { cert?: Certificate; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />颁发证书</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            颁发证书
          </DialogTitle>
          <DialogDescription className="text-xs">{cert ? `为 ${cert.name} 颁发证书` : "为学员颁发培训证书"}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!cert && (
            <div className="space-y-1.5">
              <Label className="text-xs">选择学员</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择待颁发证书的学员" /></SelectTrigger>
                <SelectContent>
                  {certificates.filter(c => c.status === "pending").map(c => (
                    <SelectItem key={c.id} value={c.studentId}>{c.name} - {c.course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {cert && (
            <div className="p-3 rounded-lg bg-muted/30 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-100 text-purple-700">{cert.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.course} | {cert.className}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label className="text-xs">证书类型</Label>
            <Select defaultValue={cert?.type}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择证书类型" /></SelectTrigger>
              <SelectContent>
                {certificateTemplates.map(t => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">证书编号</Label>
            <Input placeholder="自动生成或手动输入" className="h-8 text-xs font-mono" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">颁发日期</Label>
              <Input type="date" className="h-8 text-xs" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">有效期至</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>
          </div>
          
          {cert?.score && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-xs text-green-700">考试成绩: <span className="font-bold">{cert.score}分</span> (合格)</p>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs"><Award className="h-3 w-3 mr-1" />确认颁发</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Certificate Template Config Dialog
function CertificateTemplateConfigDialog({ template, trigger }: { template: CertificateTemplate; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-6 w-6"><Settings className="h-3 w-3" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            证书模板配置
          </DialogTitle>
          <DialogDescription className="text-xs">{template.name}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">证书名称</Label>
            <Input defaultValue={template.name} className="h-8 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">证书描述</Label>
            <Input defaultValue={template.description} className="h-8 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">有效期(年)</Label>
            <Input type="number" defaultValue={template.validYears} className="h-8 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">关联课程</Label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border min-h-16">
              {template.courses.map((course, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {course}
                  <XCircle className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2">
                <Plus className="h-3 w-3 mr-1" />添加课程
              </Button>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">已颁发数量: <span className="font-medium text-foreground">{template.issuedCount}</span> 张</p>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">保存配置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("certificates")

  const filteredCertificates = useMemo(() => {
    return certificates.filter(c => {
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      const matchSearch = !searchTerm || c.name.includes(searchTerm) || c.certNo.includes(searchTerm) || c.type.includes(searchTerm)
      return matchStatus && matchSearch
    })
  }, [statusFilter, searchTerm])

  const stats = useMemo(() => ({
    total: certificates.length,
    valid: certificates.filter(c => c.status === "valid").length,
    pending: certificates.filter(c => c.status === "pending").length,
    expiring: certificates.filter(c => c.status === "expiring").length,
  }), [])

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">证书管理</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Award className="h-3 w-3" />{stats.total}张证书</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />{stats.valid}有效</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-blue-500" />{stats.pending}待颁发</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-amber-500" />{stats.expiring}即将过期</span>
              </div>
            </div>
            <IssueCertificateDialog />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList className="h-8">
                <TabsTrigger value="certificates" className="text-xs h-6">证书列表</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs h-6">证书库</TabsTrigger>
              </TabsList>
              
              {activeTab === "certificates" && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索证书..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="valid">有效</SelectItem>
                      <SelectItem value="pending">待颁发</SelectItem>
                      <SelectItem value="expiring">即将过期</SelectItem>
                      <SelectItem value="expired">已过期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <TabsContent value="certificates" className="mt-3">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">学员</TableHead>
                      <TableHead className="text-xs">证书类型</TableHead>
                      <TableHead className="text-xs">证书编号</TableHead>
                      <TableHead className="text-xs">课程/班级</TableHead>
                      <TableHead className="text-xs">状态</TableHead>
                      <TableHead className="text-xs">有效期</TableHead>
                      <TableHead className="text-xs w-24">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => (
                      <TableRow key={cert.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">{cert.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{cert.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{cert.type}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{cert.certNo || "-"}</TableCell>
                        <TableCell>
                          <p className="text-xs">{cert.course}</p>
                          <p className="text-[10px] text-muted-foreground">{cert.className}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[cert.status].color)}>
                            {statusConfig[cert.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {cert.issueDate ? `${cert.issueDate} ~ ${cert.expireDate}` : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CertificatePreviewDialog cert={cert} />
                            {cert.status === "pending" ? (
                              <IssueCertificateDialog cert={cert} trigger={
                                <Button size="sm" className="h-6 text-[10px]"><Award className="h-3 w-3 mr-1" />颁发</Button>
                              } />
                            ) : (
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              
              <div className="text-xs text-muted-foreground text-center mt-2">
                显示 {filteredCertificates.length} / {certificates.length} 张证书
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
                {certificateTemplates.map((template) => (
                  <Card key={template.id} className="p-3 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-100">
                          <Award className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-[10px] text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                      <Badge variant={template.status === "active" ? "default" : "secondary"} className="text-[10px]">
                        {template.status === "active" ? "启用" : "停用"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />有效期{template.validYears}年</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" />已颁发{template.issuedCount}张</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.courses.map((course, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]"><Link className="h-2.5 w-2.5 mr-0.5" />{course}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1 pt-2 border-t">
                      <CertificateTemplateConfigDialog template={template} trigger={
                        <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 bg-transparent"><Settings className="h-3 w-3 mr-1" />配置</Button>
                      } />
                      <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 bg-transparent"><Eye className="h-3 w-3 mr-1" />预览</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
