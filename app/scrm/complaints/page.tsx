"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Filter, Download, Eye, Edit, Archive, MoreHorizontal,
  AlertTriangle, Clock, CheckCircle, FileText, User, Phone, Calendar,
  MessageSquare, Image, Video, Link2, Building2, ChevronRight
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// 客诉状态配置
const statusConfig = {
  pending: { label: "未处理", color: "bg-red-100 text-red-700 border-red-200" },
  processing: { label: "处理中", color: "bg-amber-100 text-amber-700 border-amber-200" },
  resolved: { label: "已处理", color: "bg-green-100 text-green-700 border-green-200" },
  archived: { label: "已归档", color: "bg-gray-100 text-gray-700 border-gray-200" },
}

// 客诉等级配置
const levelConfig = {
  minor: { label: "轻微", color: "bg-gray-100 text-gray-600" },
  general: { label: "一般", color: "bg-blue-100 text-blue-600" },
  serious: { label: "严重", color: "bg-amber-100 text-amber-600" },
  major: { label: "重大", color: "bg-red-100 text-red-600" },
}

// 客诉来源配置
const sourceConfig = {
  consultant: { label: "顾问录入", icon: User },
  employer_app: { label: "雇主小程序", icon: Phone },
  student_app: { label: "学员小程序", icon: MessageSquare },
}

// 责任归属配置
const responsibilityConfig = {
  nanny: "月嫂/家政员",
  consultant: "顾问",
  company: "公司管理",
  customer: "客户原因",
  other: "其他",
}

// Mock数据
const mockComplaints = [
  {
    id: "KS202603001",
    title: "月嫂服务技能不达标",
    category: "服务技能",
    level: "serious" as const,
    status: "pending" as const,
    source: "employer_app" as const,
    customerName: "张女士",
    customerPhone: "138****5678",
    nannyName: "李阿姨",
    nannyId: "NY001",
    orderId: "DD202603001",
    consultant: "王顾问",
    responsibility: "nanny" as const,
    content: "月嫂在护理宝宝时操作不规范，宝宝洗澡时水温控制不当，导致宝宝皮肤发红。",
    createTime: "2026-03-18 10:30",
    updateTime: "2026-03-18 10:30",
    attachments: [{ type: "image", url: "/placeholder.jpg", name: "现场照片1" }],
    handlePlan: "",
    handleResult: "",
  },
  {
    id: "KS202603002",
    title: "服务态度问题",
    category: "职业素养",
    level: "general" as const,
    status: "processing" as const,
    source: "consultant" as const,
    customerName: "李先生",
    customerPhone: "139****1234",
    nannyName: "张阿姨",
    nannyId: "NY002",
    orderId: "DD202603002",
    consultant: "刘顾问",
    responsibility: "nanny" as const,
    content: "月嫂在工作期间看手机，被客户发现后态度不好，与客户发生口角。",
    createTime: "2026-03-17 14:20",
    updateTime: "2026-03-18 09:15",
    attachments: [],
    handlePlan: "已约谈月嫂，进行批评教育",
    handleResult: "",
  },
  {
    id: "KS202603003",
    title: "宝宝安全问题",
    category: "安全卫生",
    level: "major" as const,
    status: "resolved" as const,
    source: "employer_app" as const,
    customerName: "王女士",
    customerPhone: "137****9876",
    nannyName: "赵阿姨",
    nannyId: "NY003",
    orderId: "DD202602015",
    consultant: "陈顾问",
    responsibility: "nanny" as const,
    content: "月嫂看护期间，因疏忽导致宝宝从婴儿床摔落，幸好检查后无大碍。",
    createTime: "2026-03-15 08:45",
    updateTime: "2026-03-17 16:30",
    attachments: [
      { type: "image", url: "/placeholder.jpg", name: "医院检查报告" },
      { type: "video", url: "/placeholder.mp4", name: "监控录像" },
    ],
    handlePlan: "1. 立即带宝宝就医检查；2. 安排顾问上门慰问；3. 月嫂下户重新培训",
    handleResult: "宝宝检查无恙，客户接受处理方案，月嫂已下户并重新参加岗前培训",
  },
  {
    id: "KS202603004",
    title: "合同违约纠纷",
    category: "合同违约",
    level: "serious" as const,
    status: "archived" as const,
    source: "consultant" as const,
    customerName: "赵先生",
    customerPhone: "136****5432",
    nannyName: "-",
    nannyId: "-",
    orderId: "DD202601008",
    consultant: "张顾问",
    responsibility: "customer" as const,
    content: "客户预定月嫂后通过其他渠道低价签约同一人员，要求全额退费。",
    createTime: "2026-03-10 11:00",
    updateTime: "2026-03-14 15:20",
    attachments: [{ type: "file", url: "/contract.pdf", name: "合同文件" }],
    handlePlan: "依据合同条款，拒绝退还20%违约金",
    handleResult: "客户最终接受合同约定，完成扣除定金后的退费",
  },
]

// 统计数据
const statsData = {
  total: 156,
  pending: 12,
  processing: 8,
  resolved: 98,
  archived: 38,
  thisMonth: 15,
  avgHandleTime: "2.3天",
}

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<typeof mockComplaints[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showHandleDialog, setShowHandleDialog] = useState(false)

  const filteredComplaints = mockComplaints.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false
    if (levelFilter !== "all" && c.level !== levelFilter) return false
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false
    if (searchTerm && !c.title.includes(searchTerm) && !c.customerName.includes(searchTerm) && !c.id.includes(searchTerm)) return false
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">客诉库</h1>
            <p className="text-sm text-muted-foreground mt-1">
              记录家政员、顾问相关客诉，作为培训经验库、话术与处理办法
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />导出
            </Button>
            <Button size="sm" className="h-8" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />录入客诉
            </Button>
          </div>
        </div>

        {/* 筛选区域 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索客诉编号、标题、客户姓名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="处理状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">未处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="resolved">已处理</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="客诉等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="minor">轻微</SelectItem>
                  <SelectItem value="general">一般</SelectItem>
                  <SelectItem value="serious">严重</SelectItem>
                  <SelectItem value="major">重大</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="来源渠道" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  <SelectItem value="consultant">顾问录入</SelectItem>
                  <SelectItem value="employer_app">雇主小程序</SelectItem>
                  <SelectItem value="student_app">学员小程序</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />更多筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 客诉列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">客诉编号</TableHead>
                <TableHead className="min-w-[200px]">客诉标题</TableHead>
                <TableHead className="w-[80px]">等级</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[100px]">来源</TableHead>
                <TableHead className="w-[100px]">客户</TableHead>
                <TableHead className="w-[100px]">家政员</TableHead>
                <TableHead className="w-[100px]">责任人</TableHead>
                <TableHead className="w-[140px]">创建时间</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedComplaint(complaint); setShowDetailDialog(true); }}>
                  <TableCell className="font-mono text-xs">{complaint.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate max-w-[180px]">{complaint.title}</span>
                      {complaint.attachments.length > 0 && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                          {complaint.attachments.length}附件
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{complaint.content}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", levelConfig[complaint.level].color)}>
                      {levelConfig[complaint.level].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", statusConfig[complaint.status].color)}>
                      {statusConfig[complaint.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {(() => { const Icon = sourceConfig[complaint.source].icon; return <Icon className="h-3 w-3" />; })()}
                      <span>{sourceConfig[complaint.source].label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{complaint.customerName}</div>
                    <div className="text-xs text-muted-foreground">{complaint.customerPhone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{complaint.nannyName}</div>
                    <div className="text-xs text-muted-foreground">{complaint.nannyId}</div>
                  </TableCell>
                  <TableCell className="text-sm">{responsibilityConfig[complaint.responsibility]}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{complaint.createTime}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedComplaint(complaint); setShowDetailDialog(true); }}>
                          <Eye className="h-4 w-4 mr-2" />查看详情
                        </DropdownMenuItem>
                        {complaint.status !== "archived" && (
                          <DropdownMenuItem onClick={() => { setSelectedComplaint(complaint); setShowHandleDialog(true); }}>
                            <Edit className="h-4 w-4 mr-2" />处理反馈
                          </DropdownMenuItem>
                        )}
                        {complaint.status === "resolved" && (
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />归档
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 录入客诉对话框 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                录入客诉
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客诉标题 *</Label>
                  <Input placeholder="请输入客诉标题" />
                </div>
                <div className="space-y-2">
                  <Label>客诉分类 *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="请选择分类" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skill">服务技能不达标</SelectItem>
                      <SelectItem value="safety">安全与卫生问题</SelectItem>
                      <SelectItem value="attitude">服务态度与职业素养</SelectItem>
                      <SelectItem value="contract">合同与违约纠纷</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客诉等级 *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="请选择等级" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">轻微</SelectItem>
                      <SelectItem value="general">一般</SelectItem>
                      <SelectItem value="serious">严重</SelectItem>
                      <SelectItem value="major">重大</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>责任归属</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="请选择责任方" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nanny">月嫂/家政员</SelectItem>
                      <SelectItem value="consultant">顾问</SelectItem>
                      <SelectItem value="company">公司管理</SelectItem>
                      <SelectItem value="customer">客户原因</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>关联订单</Label>
                  <Input placeholder="请输入订单编号" />
                </div>
                <div className="space-y-2">
                  <Label>涉及家政员</Label>
                  <Input placeholder="请输入家政员姓名或编号" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客户姓名 *</Label>
                  <Input placeholder="请输入客户姓名" />
                </div>
                <div className="space-y-2">
                  <Label>客户电话</Label>
                  <Input placeholder="请输入客户电话" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>客诉内容 *</Label>
                <Textarea placeholder="请详细描述客诉情况..." className="min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label>附件上传</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-muted-foreground">
                    <div className="flex flex-col items-center cursor-pointer hover:text-primary">
                      <Image className="h-8 w-8 mb-1" />
                      <span className="text-xs">上传图片</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer hover:text-primary">
                      <Video className="h-8 w-8 mb-1" />
                      <span className="text-xs">上传视频</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer hover:text-primary">
                      <FileText className="h-8 w-8 mb-1" />
                      <span className="text-xs">上传文档</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">支持jpg、png、mp4、pdf格式，单个文件不超过50MB</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
              <Button onClick={() => setShowCreateDialog(false)}>提交</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 客诉详情对话框 */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                客诉详情
                {selectedComplaint && (
                  <Badge variant="outline" className={cn("ml-2", statusConfig[selectedComplaint.status].color)}>
                    {statusConfig[selectedComplaint.status].label}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedComplaint && (
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">客诉编号：</span>
                    <span className="font-mono">{selectedComplaint.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">客诉等级：</span>
                    <Badge variant="outline" className={cn("ml-1", levelConfig[selectedComplaint.level].color)}>
                      {levelConfig[selectedComplaint.level].label}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">来源：</span>
                    <span>{sourceConfig[selectedComplaint.source].label}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">客户：</span>
                    <span>{selectedComplaint.customerName} ({selectedComplaint.customerPhone})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">家政员：</span>
                    <span>{selectedComplaint.nannyName} ({selectedComplaint.nannyId})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">责任归属：</span>
                    <span>{responsibilityConfig[selectedComplaint.responsibility]}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">关联订单：</span>
                    <Button variant="link" className="h-auto p-0 text-primary">{selectedComplaint.orderId}</Button>
                  </div>
                  <div>
                    <span className="text-muted-foreground">负责顾问：</span>
                    <span>{selectedComplaint.consultant}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">创建时间：</span>
                    <span>{selectedComplaint.createTime}</span>
                  </div>
                </div>

                <Separator />

                {/* 客诉内容 */}
                <div>
                  <h4 className="font-medium mb-2">客诉标题</h4>
                  <p className="text-lg font-semibold">{selectedComplaint.title}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">客诉内容</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">
                    {selectedComplaint.content}
                  </p>
                </div>

                {/* 附件 */}
                {selectedComplaint.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">附件 ({selectedComplaint.attachments.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComplaint.attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-sm">
                          {att.type === "image" && <Image className="h-4 w-4 text-blue-500" />}
                          {att.type === "video" && <Video className="h-4 w-4 text-purple-500" />}
                          {att.type === "file" && <FileText className="h-4 w-4 text-amber-500" />}
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* 处理方案 */}
                <div>
                  <h4 className="font-medium mb-2">处理方案</h4>
                  {selectedComplaint.handlePlan ? (
                    <p className="text-sm text-muted-foreground leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                      {selectedComplaint.handlePlan}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">暂无处理方案</p>
                  )}
                </div>

                {/* 处理结果 */}
                <div>
                  <h4 className="font-medium mb-2">处理结果</h4>
                  {selectedComplaint.handleResult ? (
                    <p className="text-sm text-muted-foreground leading-relaxed bg-green-50 p-3 rounded-lg border border-green-100">
                      {selectedComplaint.handleResult}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">暂无处理结果</p>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>关闭</Button>
              {selectedComplaint && selectedComplaint.status !== "archived" && (
                <Button onClick={() => { setShowDetailDialog(false); setShowHandleDialog(true); }}>
                  处理反馈
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 处理反馈对话框 */}
        <Dialog open={showHandleDialog} onOpenChange={setShowHandleDialog}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>处理反馈</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>处理状态 *</Label>
                <Select defaultValue={selectedComplaint?.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="resolved">已处理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>处理方案 *</Label>
                <Textarea placeholder="请输入处理方案..." className="min-h-[100px]" defaultValue={selectedComplaint?.handlePlan} />
              </div>
              <div className="space-y-2">
                <Label>处理结果</Label>
                <Textarea placeholder="请输入处理结果..." className="min-h-[100px]" defaultValue={selectedComplaint?.handleResult} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowHandleDialog(false)}>取消</Button>
              <Button onClick={() => setShowHandleDialog(false)}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
