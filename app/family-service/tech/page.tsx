"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Filter, MoreHorizontal, Eye, Edit, Star, Phone, MapPin,
  Calendar, Award, UserCog, Clock, CheckCircle, XCircle, AlertTriangle,
  FileText, Briefcase, GraduationCap, Activity
} from "lucide-react"

// MOCK数据 - 产康技师
const techniciansList = [
  {
    id: "T001",
    name: "陈丽华",
    avatar: null,
    phone: "135****5678",
    idCard: "110101199005****",
    age: 34,
    gender: "female",
    education: "大专",
    level: "高级",
    rating: 4.9,
    serviceCount: 156,
    specialties: ["产后修复", "催乳", "骨盆修复", "腹直肌修复"],
    certificates: ["高级产康师证", "催乳师证", "健康管理师证"],
    status: "available",
    joinDate: "2023-06-15",
    address: "北京市朝阳区",
    bankAccount: "6228****8901",
    emergencyContact: "张先生 138****1234",
  },
  {
    id: "T002",
    name: "王美玲",
    avatar: null,
    phone: "136****6789",
    idCard: "110102198808****",
    age: 38,
    gender: "female",
    education: "本科",
    level: "资深",
    rating: 4.8,
    serviceCount: 238,
    specialties: ["产后修复", "催乳", "满月发汗", "私密修复"],
    certificates: ["资深产康师证", "催乳师证", "营养师证"],
    status: "busy",
    joinDate: "2022-03-10",
    address: "北京市海淀区",
    bankAccount: "6228****8902",
    emergencyContact: "李女士 139****2345",
  },
  {
    id: "T003",
    name: "张晓燕",
    avatar: null,
    phone: "137****7890",
    idCard: "110103199206****",
    age: 32,
    gender: "female",
    education: "大专",
    level: "中级",
    rating: 4.6,
    serviceCount: 89,
    specialties: ["催乳", "通乳", "乳腺疏通"],
    certificates: ["中级催乳师证", "母婴护理证"],
    status: "vacation",
    joinDate: "2024-01-20",
    address: "北京市丰台区",
    bankAccount: "6228****8903",
    emergencyContact: "王先生 137****3456",
  },
  {
    id: "T004",
    name: "李秀英",
    avatar: null,
    phone: "138****8901",
    idCard: "110104199108****",
    age: 33,
    gender: "female",
    education: "本科",
    level: "高级",
    rating: 4.7,
    serviceCount: 112,
    specialties: ["产后修复", "骨盆修复", "腹直肌修复", "体态调整"],
    certificates: ["高级产康师证", "健身教练证", "瑜伽教练证"],
    status: "available",
    joinDate: "2023-09-05",
    address: "北京市西城区",
    bankAccount: "6228****8904",
    emergencyContact: "张女士 136****4567",
  },
]

// MOCK数据 - 服务项目
const serviceItems = [
  { id: "SI001", name: "产后通乳", duration: 60, price: 380, commission: 190 },
  { id: "SI002", name: "骨盆修复", duration: 45, price: 280, commission: 140 },
  { id: "SI003", name: "腹直肌修复", duration: 45, price: 280, commission: 140 },
  { id: "SI004", name: "满月发汗", duration: 90, price: 580, commission: 290 },
  { id: "SI005", name: "产后瑜伽(单次)", duration: 60, price: 198, commission: 99 },
  { id: "SI006", name: "私密修复", duration: 60, price: 480, commission: 240 },
]

// MOCK数据 - 今日预约
const todayAppointments = [
  { id: "APP001", technicianId: "T001", customerName: "张女士", phone: "188****8888", service: "产后通乳", time: "10:00", address: "朝阳区望京SOHO", status: "completed" },
  { id: "APP002", technicianId: "T001", customerName: "李女士", phone: "177****7777", service: "骨盆修复", time: "14:00", address: "海淀区中关村", status: "in-progress" },
  { id: "APP003", technicianId: "T002", customerName: "王女士", phone: "166****6666", service: "满月发汗", time: "09:00", address: "西城区金融街", status: "completed" },
  { id: "APP004", technicianId: "T004", customerName: "赵女士", phone: "155****5555", service: "腹直肌修复", time: "15:30", address: "东城区王府井", status: "scheduled" },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  "available": { label: "空闲", color: "bg-green-100 text-green-700" },
  "busy": { label: "服务中", color: "bg-blue-100 text-blue-700" },
  "vacation": { label: "休假", color: "bg-amber-100 text-amber-700" },
  "training": { label: "培训中", color: "bg-purple-100 text-purple-700" },
  "resigned": { label: "已离职", color: "bg-gray-100 text-gray-700" },
}

const levelConfig: Record<string, { label: string; color: string }> = {
  "初级": { label: "初级", color: "bg-gray-100 text-gray-700" },
  "中级": { label: "中级", color: "bg-blue-100 text-blue-700" },
  "高级": { label: "高级", color: "bg-amber-100 text-amber-700" },
  "资深": { label: "资深", color: "bg-purple-100 text-purple-700" },
}

const appointmentStatusConfig: Record<string, { label: string; color: string }> = {
  "scheduled": { label: "待服务", color: "bg-amber-100 text-amber-700" },
  "in-progress": { label: "服务中", color: "bg-blue-100 text-blue-700" },
  "completed": { label: "已完成", color: "bg-green-100 text-green-700" },
  "cancelled": { label: "已取消", color: "bg-red-100 text-red-700" },
}

export default function TechPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<typeof techniciansList[0] | null>(null)

  // 筛选数据
  const filteredTechnicians = techniciansList.filter(tech => {
    if (searchTerm && !tech.name.includes(searchTerm) && !tech.phone.includes(searchTerm)) return false
    if (filterLevel !== "all" && tech.level !== filterLevel) return false
    if (filterStatus !== "all" && tech.status !== filterStatus) return false
    return true
  })

  // 统计数据
  const stats = {
    total: techniciansList.length,
    available: techniciansList.filter(t => t.status === "available").length,
    busy: techniciansList.filter(t => t.status === "busy").length,
    todayAppointments: todayAppointments.length,
    completedToday: todayAppointments.filter(a => a.status === "completed").length,
  }

  const handleViewDetail = (tech: typeof techniciansList[0]) => {
    setSelectedTechnician(tech)
    setShowDetailDialog(true)
  }

  return (
    <AdminLayout title="产康技师">
      <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">管理产康技师档案、排班和服务记录</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增技师
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">技师总数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">空闲中</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">服务中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.busy}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日预约</p>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日完成</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">技师列表</TabsTrigger>
          <TabsTrigger value="appointments">今日预约 <Badge variant="secondary" className="ml-1">{todayAppointments.length}</Badge></TabsTrigger>
          <TabsTrigger value="services">服务项目</TabsTrigger>
        </TabsList>

        {/* 技师列表 */}
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索姓名或手机号..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等级</SelectItem>
                    <SelectItem value="初级">初级</SelectItem>
                    <SelectItem value="中级">中级</SelectItem>
                    <SelectItem value="高级">高级</SelectItem>
                    <SelectItem value="资深">资深</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="available">空闲</SelectItem>
                    <SelectItem value="busy">服务中</SelectItem>
                    <SelectItem value="vacation">休假</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {filteredTechnicians.map(tech => (
                  <Card key={tech.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg bg-primary/10 text-primary">{tech.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{tech.name}</span>
                              <Badge className={cn("text-xs", levelConfig[tech.level].color)}>{tech.level}</Badge>
                              <Badge className={cn("text-xs", statusConfig[tech.status].color)}>{statusConfig[tech.status].label}</Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetail(tech)}>
                                  <Eye className="h-4 w-4 mr-2" />查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />编辑信息
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />排班管理
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />服务记录
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{tech.phone}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{tech.rating}</span>
                            <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{tech.serviceCount}单</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tech.specialties.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                            {tech.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{tech.specialties.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 今日预约 */}
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>预约编号</TableHead>
                    <TableHead>技师</TableHead>
                    <TableHead>客户信息</TableHead>
                    <TableHead>服务项目</TableHead>
                    <TableHead>预约时间</TableHead>
                    <TableHead>服务地址</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map(apt => {
                    const tech = techniciansList.find(t => t.id === apt.technicianId)
                    return (
                      <TableRow key={apt.id}>
                        <TableCell className="font-mono text-xs">{apt.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">{tech?.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{tech?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{apt.customerName}</p>
                            <p className="text-xs text-muted-foreground">{apt.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{apt.service}</TableCell>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={apt.address}>{apt.address}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", appointmentStatusConfig[apt.status].color)}>
                            {appointmentStatusConfig[apt.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">详情</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 服务项目 */}
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">服务项目价目表</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />添加项目
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>项目编号</TableHead>
                    <TableHead>项目名称</TableHead>
                    <TableHead className="text-right">时长(分钟)</TableHead>
                    <TableHead className="text-right">价格</TableHead>
                    <TableHead className="text-right">技师提成</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.duration}</TableCell>
                      <TableCell className="text-right font-medium">¥{item.price}</TableCell>
                      <TableCell className="text-right text-green-600">¥{item.commission}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">编辑</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新增技师对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增产康技师</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名 *</Label>
                  <Input placeholder="请输入姓名" />
                </div>
                <div className="space-y-2">
                  <Label>手机号 *</Label>
                  <Input placeholder="请输入手机号" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>身份证号 *</Label>
                  <Input placeholder="请输入身份证号" />
                </div>
                <div className="space-y-2">
                  <Label>技师等级</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="初级">初级</SelectItem>
                      <SelectItem value="中级">中级</SelectItem>
                      <SelectItem value="高级">高级</SelectItem>
                      <SelectItem value="资深">资深</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>学历</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择学历" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="高中">高中</SelectItem>
                      <SelectItem value="大专">大专</SelectItem>
                      <SelectItem value="本科">本科</SelectItem>
                      <SelectItem value="硕士">硕士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>入职日期</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>居住地址</Label>
                <Input placeholder="请输入居住地址" />
              </div>
              <div className="space-y-2">
                <Label>擅长项目</Label>
                <Textarea placeholder="请输入擅长的服务项目，用逗号分隔" />
              </div>
              <div className="space-y-2">
                <Label>持有证书</Label>
                <Textarea placeholder="请输入持有的证书，用逗号分隔" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>银行账号</Label>
                  <Input placeholder="请输入银行账号" />
                </div>
                <div className="space-y-2">
                  <Label>紧急联系人</Label>
                  <Input placeholder="姓名 + 电话" />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button onClick={() => setShowAddDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 技师详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>技师详情</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4 pr-4">
                {/* 基本信息 */}
                <div className="flex gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">{selectedTechnician.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selectedTechnician.name}</h3>
                      <Badge className={cn("text-xs", levelConfig[selectedTechnician.level].color)}>{selectedTechnician.level}</Badge>
                      <Badge className={cn("text-xs", statusConfig[selectedTechnician.status].color)}>{statusConfig[selectedTechnician.status].label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{selectedTechnician.rating}分</span>
                      <span className="flex items-center gap-1"><Activity className="h-4 w-4" />{selectedTechnician.serviceCount}单</span>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />入职: {selectedTechnician.joinDate}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 详细信息 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2"><Briefcase className="h-4 w-4" />个人信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">手机号:</span><span>{selectedTechnician.phone}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">身份证:</span><span>{selectedTechnician.idCard}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">年龄:</span><span>{selectedTechnician.age}岁</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">学历:</span><span>{selectedTechnician.education}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">地址:</span><span>{selectedTechnician.address}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2"><GraduationCap className="h-4 w-4" />专业资质</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">擅长项目:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTechnician.specialties.map(s => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">持有证书:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTechnician.certificates.map(c => (
                          <Badge key={c} className="text-xs bg-green-100 text-green-700">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 其他信息 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">银行账号:</span><span>{selectedTechnician.bankAccount}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">紧急联系人:</span><span>{selectedTechnician.emergencyContact}</span></div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>关闭</Button>
            <Button variant="outline">编辑信息</Button>
            <Button>排班管理</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}
