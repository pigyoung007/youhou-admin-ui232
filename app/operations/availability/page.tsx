"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  CalendarDays, Search, Download, Filter, Clock, User, Star, 
  AlertTriangle, CheckCircle, Phone, MapPin, ChevronRight, Edit,
  Calendar as CalendarIcon, Users, TrendingUp, Home, Baby
} from "lucide-react"

// 家政人员档期接口
interface StaffAvailability {
  id: string
  name: string
  type: "月嫂" | "育婴师" | "产康师"
  level: string
  phone: string
  rating: number
  status: "上户中" | "空档" | "培训中" | "休假"
  // 当前服务信息
  currentClient: string
  currentClientPhone: string
  currentAddress: string
  serviceStartDate: string
  serviceEndDate: string
  // 档期信息
  availableDate: string // 可接单日期
  gapDays: number // 空档天数
  // 历史订单
  lastClient: string
  lastEndDate: string
  lastOrderId: string
  // 关联顾问
  consultant: string
  consultantId: string
  // 其他
  totalOrders: number
  monthRange: number // 几个月内（用于筛选）
  notes: string
}

// 模拟数据 - 月嫂
const nannyData: StaffAvailability[] = [
  { id: "N001", name: "李春华", type: "月嫂", level: "金牌", phone: "138****1234", rating: 4.9, status: "上户中", currentClient: "刘女士", currentClientPhone: "138****5678", currentAddress: "银川市兴庆区凤凰北街", serviceStartDate: "2025-01-15", serviceEndDate: "2025-02-10", availableDate: "2025-02-11", gapDays: 0, lastClient: "张女士", lastEndDate: "2025-01-14", lastOrderId: "ORD202412001", consultant: "张顾问", consultantId: "E001", totalOrders: 48, monthRange: 1, notes: "" },
  { id: "N002", name: "陈桂芳", type: "月嫂", level: "金牌", phone: "139****5678", rating: 5.0, status: "上户中", currentClient: "赵女士", currentClientPhone: "136****5432", currentAddress: "银川市兴庆区民族街", serviceStartDate: "2025-01-01", serviceEndDate: "2025-02-11", availableDate: "2025-02-12", gapDays: 0, lastClient: "李女士", lastEndDate: "2024-12-30", lastOrderId: "ORD202412002", consultant: "张顾问", consultantId: "E001", totalOrders: 52, monthRange: 1, notes: "VIP客户指定" },
  { id: "N003", name: "吴桂兰", type: "月嫂", level: "高级", phone: "137****9012", rating: 4.7, status: "上户中", currentClient: "朱女士", currentClientPhone: "138****0123", currentAddress: "银川市西夏区文昌路", serviceStartDate: "2025-01-05", serviceEndDate: "2025-02-16", availableDate: "2025-02-17", gapDays: 0, lastClient: "王女士", lastEndDate: "2025-01-04", lastOrderId: "ORD202501003", consultant: "李顾问", consultantId: "E002", totalOrders: 35, monthRange: 1, notes: "" },
  { id: "N004", name: "孙美华", type: "月嫂", level: "金牌", phone: "136****3456", rating: 4.8, status: "上户中", currentClient: "冯女士", currentClientPhone: "188****8901", currentAddress: "银川市西夏区同心路", serviceStartDate: "2025-01-12", serviceEndDate: "2025-02-07", availableDate: "2025-02-08", gapDays: 0, lastClient: "陈女士", lastEndDate: "2025-01-10", lastOrderId: "ORD202501001", consultant: "李顾问", consultantId: "E002", totalOrders: 41, monthRange: 1, notes: "" },
  { id: "N005", name: "钱秀英", type: "月嫂", level: "金牌", phone: "135****7890", rating: 4.9, status: "上户中", currentClient: "林女士", currentClientPhone: "136****2345", currentAddress: "银川市西夏区学院路", serviceStartDate: "2025-01-18", serviceEndDate: "2025-02-13", availableDate: "2025-02-14", gapDays: 0, lastClient: "赵女士", lastEndDate: "2025-01-16", lastOrderId: "ORD202501002", consultant: "李顾问", consultantId: "E002", totalOrders: 38, monthRange: 1, notes: "" },
  { id: "N006", name: "周小芬", type: "月嫂", level: "高级", phone: "158****2345", rating: 4.6, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-01-26", gapDays: 8, lastClient: "孙女士", lastEndDate: "2025-01-18", lastOrderId: "ORD202501003", consultant: "王顾问", consultantId: "E003", totalOrders: 28, monthRange: 1, notes: "需关注" },
  { id: "N007", name: "郑秀兰", type: "月嫂", level: "金牌", phone: "186****6789", rating: 4.8, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-02-01", gapDays: 15, lastClient: "周女士", lastEndDate: "2025-01-17", lastOrderId: "ORD202501004", consultant: "张顾问", consultantId: "E001", totalOrders: 45, monthRange: 1, notes: "重点跟进" },
  { id: "N008", name: "王美玲", type: "月嫂", level: "普通", phone: "139****0123", rating: 4.5, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-02-05", gapDays: 20, lastClient: "钱女士", lastEndDate: "2025-01-16", lastOrderId: "ORD202501005", consultant: "王顾问", consultantId: "E003", totalOrders: 18, monthRange: 1, notes: "培训期后" },
  { id: "N009", name: "刘桂华", type: "月嫂", level: "高级", phone: "136****4567", rating: 4.7, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-02-15", gapDays: 12, lastClient: "吴女士", lastEndDate: "2025-02-03", lastOrderId: "ORD202501006", consultant: "李顾问", consultantId: "E002", totalOrders: 32, monthRange: 2, notes: "" },
  { id: "N010", name: "张桂英", type: "月嫂", level: "金牌", phone: "188****8901", rating: 4.9, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-03-01", gapDays: 18, lastClient: "郑女士", lastEndDate: "2025-02-11", lastOrderId: "ORD202501007", consultant: "张顾问", consultantId: "E001", totalOrders: 50, monthRange: 2, notes: "" },
]

// 模拟数据 - 育婴师
const infantCareData: StaffAvailability[] = [
  { id: "I001", name: "张美玲", type: "育婴师", level: "高级", phone: "137****9876", rating: 4.8, status: "上户中", currentClient: "王女士", currentClientPhone: "137****9876", currentAddress: "银川市西夏区怀远路", serviceStartDate: "2024-12-01", serviceEndDate: "2025-01-31", availableDate: "2025-02-01", gapDays: 0, lastClient: "李女士", lastEndDate: "2024-11-30", lastOrderId: "ORD202411001", consultant: "王顾问", consultantId: "E003", totalOrders: 24, monthRange: 1, notes: "" },
  { id: "I002", name: "刘小红", type: "育婴师", level: "金牌", phone: "158****2345", rating: 4.7, status: "上户中", currentClient: "周先生", currentClientPhone: "158****2345", currentAddress: "银川市兴庆区解放街", serviceStartDate: "2025-01-10", serviceEndDate: "2025-02-09", availableDate: "2025-02-10", gapDays: 0, lastClient: "赵女士", lastEndDate: "2025-01-08", lastOrderId: "ORD202501008", consultant: "张顾问", consultantId: "E001", totalOrders: 30, monthRange: 1, notes: "" },
  { id: "I003", name: "赵小燕", type: "育婴师", level: "高级", phone: "136****4567", rating: 4.6, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-01-26", gapDays: 10, lastClient: "钱先生", lastEndDate: "2025-01-16", lastOrderId: "ORD202501009", consultant: "张顾问", consultantId: "E001", totalOrders: 22, monthRange: 1, notes: "需跟进" },
  { id: "I004", name: "周小芳", type: "育婴师", level: "金牌", phone: "137****6789", rating: 4.9, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-01-28", gapDays: 7, lastClient: "徐先生", lastEndDate: "2025-01-21", lastOrderId: "ORD202501010", consultant: "王顾问", consultantId: "E003", totalOrders: 28, monthRange: 1, notes: "" },
  { id: "I005", name: "陈小玲", type: "育婴师", level: "金牌", phone: "159****8901", rating: 5.0, status: "空档", currentClient: "-", currentClientPhone: "", currentAddress: "", serviceStartDate: "", serviceEndDate: "", availableDate: "2025-02-01", gapDays: 12, lastClient: "高先生", lastEndDate: "2025-01-20", lastOrderId: "ORD202501011", consultant: "王顾问", consultantId: "E003", totalOrders: 35, monthRange: 1, notes: "" },
]

// 获取统计数据
function getStats(data: StaffAvailability[]) {
  const total = data.length
  const working = data.filter(d => d.status === "上户中").length
  const available = data.filter(d => d.status === "空档").length
  const gapOver7 = data.filter(d => d.status === "空档" && d.gapDays > 7).length
  const gapOver14 = data.filter(d => d.status === "空档" && d.gapDays > 14).length
  
  return { total, working, available, gapOver7, gapOver14 }
}

export default function AvailabilityPage() {
  const [activeTab, setActiveTab] = useState("nanny")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterMonth, setFilterMonth] = useState("all")
  const [filterConsultant, setFilterConsultant] = useState("all")
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffAvailability | null>(null)
  
  // 当前数据
  const currentData = activeTab === "nanny" ? nannyData : infantCareData
  const stats = useMemo(() => getStats(currentData), [currentData])
  
  // 获取顾问列表
  const consultants = [...new Set(currentData.map(d => d.consultant))]
  
  // 筛选数据
  const filteredData = useMemo(() => {
    return currentData.filter(item => {
      const matchSearch = item.name.includes(searchTerm) || item.phone.includes(searchTerm)
      const matchStatus = filterStatus === "all" || item.status === filterStatus
      const matchLevel = filterLevel === "all" || item.level === filterLevel
      const matchMonth = filterMonth === "all" || item.monthRange <= Number.parseInt(filterMonth)
      const matchConsultant = filterConsultant === "all" || item.consultant === filterConsultant
      return matchSearch && matchStatus && matchLevel && matchMonth && matchConsultant
    })
  }, [currentData, searchTerm, filterStatus, filterLevel, filterMonth, filterConsultant])
  
  // 空档期人员（空档超过7天）
  const gapStaff = useMemo(() => {
    return currentData.filter(d => d.status === "空档" && d.gapDays >= 7)
      .sort((a, b) => b.gapDays - a.gapDays)
  }, [currentData])
  
  // 打开更新档期对话框
  const handleUpdateAvailability = (staff: StaffAvailability) => {
    setSelectedStaff(staff)
    setShowUpdateDialog(true)
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-primary" />
                档期管理
              </h1>
              <p className="text-sm text-muted-foreground mt-1">管理月嫂、育婴师的服务档期，及时发现空档人员</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                导出报表
              </Button>
            </div>
          </div>

          {/* 标签页切换 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="nanny" className="gap-2">
                <Home className="h-4 w-4" />
                月嫂档期
              </TabsTrigger>
              <TabsTrigger value="infant" className="gap-2">
                <Baby className="h-4 w-4" />
                育婴师档期
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {/* 统计卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">总人数</p>
                        <p className="text-xl font-bold">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">上户中</p>
                        <p className="text-xl font-bold">{stats.working}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">空档</p>
                        <p className="text-xl font-bold">{stats.available}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">空档超7天</p>
                        <p className="text-xl font-bold text-orange-600">{stats.gapOver7}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">空档超14天</p>
                        <p className="text-xl font-bold text-red-600">{stats.gapOver14}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 空档期预警 */}
              {gapStaff.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      空档期预警（空档超过7天，需重点关注）
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {gapStaff.map(staff => (
                        <Badge 
                          key={staff.id} 
                          variant="outline" 
                          className={`cursor-pointer ${staff.gapDays > 14 ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}
                          onClick={() => handleUpdateAvailability(staff)}
                        >
                          {staff.name} ({staff.level}) - 空档{staff.gapDays}天
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 筛选栏 */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="搜索姓名、电话..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="上户中">上户中</SelectItem>
                        <SelectItem value="空档">空档</SelectItem>
                        <SelectItem value="培训中">培训中</SelectItem>
                        <SelectItem value="休假">休假</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="等级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部等级</SelectItem>
                        <SelectItem value="金牌">金牌</SelectItem>
                        <SelectItem value="高级">高级</SelectItem>
                        <SelectItem value="普通">普通</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="月份范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="1">1个月内</SelectItem>
                        <SelectItem value="2">2个月内</SelectItem>
                        <SelectItem value="3">3个月内</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterConsultant} onValueChange={setFilterConsultant}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="顾问" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部顾问</SelectItem>
                        {consultants.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* 档期列表 */}
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>姓名</TableHead>
                          <TableHead>等级</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>当前客户</TableHead>
                          <TableHead>服务周期</TableHead>
                          <TableHead>可接单日期</TableHead>
                          <TableHead>空档天数</TableHead>
                          <TableHead>上一客户</TableHead>
                          <TableHead>评分</TableHead>
                          <TableHead>跟进顾问</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map(staff => (
                          <TableRow key={staff.id} className={staff.status === "空档" && staff.gapDays > 7 ? "bg-amber-50/50" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{staff.name.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-xs text-muted-foreground">{staff.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                staff.level === "金牌" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                staff.level === "高级" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                "bg-gray-50 text-gray-700 border-gray-200"
                              }>
                                {staff.level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                staff.status === "上户中" ? "bg-green-50 text-green-700 border-green-200" :
                                staff.status === "空档" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                staff.status === "培训中" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                "bg-gray-50 text-gray-700 border-gray-200"
                              }>
                                {staff.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {staff.currentClient !== "-" ? (
                                <div>
                                  <div className="font-medium">{staff.currentClient}</div>
                                  <div className="text-xs text-muted-foreground">{staff.currentAddress?.slice(0, 15)}...</div>
                                </div>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {staff.serviceStartDate ? (
                                <div className="text-xs">
                                  <div>{staff.serviceStartDate}</div>
                                  <div className="text-muted-foreground">~ {staff.serviceEndDate}</div>
                                </div>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-primary">{staff.availableDate}</div>
                            </TableCell>
                            <TableCell>
                              {staff.status === "空档" ? (
                                <Badge className={
                                  staff.gapDays > 14 ? "bg-red-100 text-red-700" :
                                  staff.gapDays > 7 ? "bg-amber-100 text-amber-700" :
                                  "bg-green-100 text-green-700"
                                }>
                                  {staff.gapDays}天
                                </Badge>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{staff.lastClient}</div>
                              <div className="text-xs text-muted-foreground">{staff.lastEndDate}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span>{staff.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell>{staff.consultant}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => handleUpdateAvailability(staff)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  更新
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 更新档期对话框 */}
          <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>更新档期 - {selectedStaff?.name}</DialogTitle>
              </DialogHeader>
              {selectedStaff && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">{selectedStaff.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedStaff.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedStaff.level}{selectedStaff.type}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {selectedStaff.rating} | {selectedStaff.totalOrders}单
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>当前状态</Label>
                      <Select defaultValue={selectedStaff.status}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="上户中">上户中</SelectItem>
                          <SelectItem value="空档">空档</SelectItem>
                          <SelectItem value="培训中">培训中</SelectItem>
                          <SelectItem value="休假">休假</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>可接单日期</Label>
                      <Input type="date" defaultValue={selectedStaff.availableDate} />
                    </div>
                  </div>
                  
                  {selectedStaff.status === "上户中" && (
                    <>
                      <div className="space-y-2">
                        <Label>当前客户</Label>
                        <Input defaultValue={selectedStaff.currentClient} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>服务开始</Label>
                          <Input type="date" defaultValue={selectedStaff.serviceStartDate} />
                        </div>
                        <div className="space-y-2">
                          <Label>服务结束</Label>
                          <Input type="date" defaultValue={selectedStaff.serviceEndDate} />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label>跟进顾问</Label>
                    <Select defaultValue={selectedStaff.consultant}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {consultants.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>备注</Label>
                    <Input placeholder="备注信息" defaultValue={selectedStaff.notes} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUpdateDialog(false)} className="bg-transparent">取消</Button>
                <Button onClick={() => setShowUpdateDialog(false)}>保存</Button>
              </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </AdminLayout>
  )
}
