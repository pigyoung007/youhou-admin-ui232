"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Search, Plus, Package, CreditCard, TrendingUp, Users, 
  Clock, CheckCircle, AlertTriangle, MoreHorizontal, Eye,
  History, RefreshCw, ChevronLeft, ChevronRight, Download,
  Calendar, DollarSign, Minus
} from "lucide-react"

// 套餐卡类型
interface PackageCard {
  id: string
  cardNo: string // 卡号
  customerId: string
  customerName: string
  customerPhone: string
  packageName: string // 套餐名称
  packageType: "产康套餐" | "月嫂套餐" | "育婴套餐" | "综合套餐" // 套餐类型
  totalTimes: number // 总次数
  usedTimes: number // 已用次数
  remainingTimes: number // 剩余次数
  totalAmount: number // 套餐总价
  paidAmount: number // 已付金额
  purchaseDate: string // 购买日期
  expireDate: string // 到期日期
  status: "正常" | "已用完" | "已过期" | "已退卡"
  consultant: string // 销售顾问
  notes: string
}

// 耗卡记录
interface CardUsageRecord {
  id: string
  cardId: string
  cardNo: string
  customerName: string
  projectName: string // 项目名称
  useTimes: number // 本次耗卡次数
  technician: string // 服务技师
  serviceDate: string // 服务日期
  serviceTime: string // 服务时间
  notes: string
  createdBy: string
  createdAt: string
}

// 模拟套餐卡数据
const mockPackageCards: PackageCard[] = [
  {
    id: "PKG001",
    cardNo: "CK202501001",
    customerId: "C001",
    customerName: "刘女士",
    customerPhone: "138****5678",
    packageName: "产康尊享套餐",
    packageType: "产康套餐",
    totalTimes: 16,
    usedTimes: 8,
    remainingTimes: 8,
    totalAmount: 6800,
    paidAmount: 6800,
    purchaseDate: "2025-01-05",
    expireDate: "2025-07-05",
    status: "正常",
    consultant: "张顾问",
    notes: "VIP客户",
  },
  {
    id: "PKG002",
    cardNo: "CK202501002",
    customerId: "C002",
    customerName: "陈先生",
    customerPhone: "139****1234",
    packageName: "产康基础套餐",
    packageType: "产康套餐",
    totalTimes: 8,
    usedTimes: 8,
    remainingTimes: 0,
    totalAmount: 3800,
    paidAmount: 3800,
    purchaseDate: "2024-12-01",
    expireDate: "2025-06-01",
    status: "已用完",
    consultant: "李顾问",
    notes: "",
  },
  {
    id: "PKG003",
    cardNo: "CK202501003",
    customerId: "C004",
    customerName: "赵女士",
    customerPhone: "135****4567",
    packageName: "产康豪华套餐",
    packageType: "产康套餐",
    totalTimes: 24,
    usedTimes: 12,
    remainingTimes: 12,
    totalAmount: 9800,
    paidAmount: 9800,
    purchaseDate: "2025-01-10",
    expireDate: "2025-10-10",
    status: "正常",
    consultant: "王顾问",
    notes: "VIP客户，需优先安排",
  },
  {
    id: "PKG004",
    cardNo: "CK202501004",
    customerId: "C006",
    customerName: "周女士",
    customerPhone: "133****2345",
    packageName: "产康基础套餐",
    packageType: "产康套餐",
    totalTimes: 8,
    usedTimes: 3,
    remainingTimes: 5,
    totalAmount: 3800,
    paidAmount: 1900,
    purchaseDate: "2025-01-15",
    expireDate: "2025-07-15",
    status: "正常",
    consultant: "张顾问",
    notes: "分期付款客户",
  },
  {
    id: "PKG005",
    cardNo: "CK202412001",
    customerId: "C003",
    customerName: "王女士",
    customerPhone: "137****9876",
    packageName: "产康尊享套餐",
    packageType: "产康套餐",
    totalTimes: 16,
    usedTimes: 16,
    remainingTimes: 0,
    totalAmount: 6800,
    paidAmount: 6800,
    purchaseDate: "2024-06-01",
    expireDate: "2024-12-01",
    status: "已过期",
    consultant: "张顾问",
    notes: "",
  },
]

// 模拟耗卡记录
const mockUsageRecords: CardUsageRecord[] = [
  {
    id: "USE001",
    cardId: "PKG001",
    cardNo: "CK202501001",
    customerName: "刘女士",
    projectName: "腹直肌修复",
    useTimes: 1,
    technician: "王秀兰",
    serviceDate: "2025-01-20",
    serviceTime: "14:00-15:00",
    notes: "",
    createdBy: "张顾问",
    createdAt: "2025-01-20 15:10",
  },
  {
    id: "USE002",
    cardId: "PKG001",
    cardNo: "CK202501001",
    customerName: "刘女士",
    projectName: "骨盆修复",
    useTimes: 1,
    technician: "王秀兰",
    serviceDate: "2025-01-18",
    serviceTime: "10:00-11:00",
    notes: "",
    createdBy: "张顾问",
    createdAt: "2025-01-18 11:15",
  },
  {
    id: "USE003",
    cardId: "PKG003",
    cardNo: "CK202501003",
    customerName: "赵女士",
    projectName: "满月发汗",
    useTimes: 1,
    technician: "郑小梅",
    serviceDate: "2025-01-19",
    serviceTime: "15:00-16:30",
    notes: "客户非常满意",
    createdBy: "王顾问",
    createdAt: "2025-01-19 16:45",
  },
  {
    id: "USE004",
    cardId: "PKG004",
    cardNo: "CK202501004",
    customerName: "周女士",
    projectName: "催乳通乳",
    useTimes: 1,
    technician: "孙小红",
    serviceDate: "2025-01-17",
    serviceTime: "09:00-10:00",
    notes: "",
    createdBy: "张顾问",
    createdAt: "2025-01-17 10:20",
  },
  {
    id: "USE005",
    cardId: "PKG003",
    cardNo: "CK202501003",
    customerName: "赵女士",
    projectName: "产后塑形",
    useTimes: 2,
    technician: "郑小梅",
    serviceDate: "2025-01-15",
    serviceTime: "14:00-16:00",
    notes: "双倍耗卡",
    createdBy: "王顾问",
    createdAt: "2025-01-15 16:10",
  },
]

const statusConfig = {
  "正常": { className: "bg-green-50 text-green-600 border-green-200" },
  "已用完": { className: "bg-gray-50 text-gray-600 border-gray-200" },
  "已过期": { className: "bg-red-50 text-red-600 border-red-200" },
  "已退卡": { className: "bg-amber-50 text-amber-600 border-amber-200" },
}

function PackagesContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showNewCardDialog, setShowNewCardDialog] = useState(false)
  const [showUsageDialog, setShowUsageDialog] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PackageCard | null>(null)

  // 统计数据
  const stats = {
    totalCards: mockPackageCards.length,
    activeCards: mockPackageCards.filter(c => c.status === "正常").length,
    totalRemaining: mockPackageCards.filter(c => c.status === "正常").reduce((sum, c) => sum + c.remainingTimes, 0),
    totalRevenue: mockPackageCards.reduce((sum, c) => sum + c.paidAmount, 0),
  }

  // 筛选套餐卡
  const filteredCards = mockPackageCards.filter(card => {
    const matchSearch = card.customerName.includes(searchTerm) || card.cardNo.includes(searchTerm)
    const matchStatus = statusFilter === "all" || card.status === statusFilter
    const matchType = typeFilter === "all" || card.packageType === typeFilter
    return matchSearch && matchStatus && matchType
  })

  // 筛选耗卡记录
  const filteredRecords = mockUsageRecords.filter(record => {
    return record.customerName.includes(searchTerm) || record.cardNo.includes(searchTerm)
  })

  const handleUseCard = (card: PackageCard) => {
    setSelectedCard(card)
    setShowUsageDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">套餐卡管理</h1>
          <p className="text-muted-foreground mt-1">管理客户套餐卡及耗卡记录</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建套餐卡
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新建套餐卡</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>客户姓名</Label>
                    <Input placeholder="请选择客户" />
                  </div>
                  <div className="space-y-2">
                    <Label>联系电话</Label>
                    <Input placeholder="自动填充" disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>套餐类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="产康套餐">产康套餐</SelectItem>
                        <SelectItem value="月嫂套餐">月嫂套餐</SelectItem>
                        <SelectItem value="育婴套餐">育婴套餐</SelectItem>
                        <SelectItem value="综合套餐">综合套餐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>套餐名称</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择套餐" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="基础">产康基础套餐</SelectItem>
                        <SelectItem value="尊享">产康尊享套餐</SelectItem>
                        <SelectItem value="豪华">产康豪华套餐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>总次数</Label>
                    <Input type="number" placeholder="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>套餐总价</Label>
                    <Input type="number" placeholder="3800" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>实付金额</Label>
                    <Input type="number" placeholder="3800" />
                  </div>
                  <div className="space-y-2">
                    <Label>有效期至</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Textarea placeholder="请输入备注信息" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="bg-transparent" onClick={() => setShowNewCardDialog(false)}>
                  取消
                </Button>
                <Button onClick={() => setShowNewCardDialog(false)}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                <CreditCard className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg lg:text-2xl font-bold truncate">{stats.totalCards}</p>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">套餐卡总数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg lg:text-2xl font-bold truncate">{stats.activeCards}</p>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">正常使用中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg lg:text-2xl font-bold truncate">{stats.totalRemaining}次</p>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">剩余服务次数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 flex-shrink-0">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg lg:text-2xl font-bold truncate">¥{(stats.totalRevenue / 10000).toFixed(1)}万</p>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">套餐卡收入</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cards">
            <CreditCard className="h-4 w-4 mr-2" />
            套餐卡列表
          </TabsTrigger>
          <TabsTrigger value="records">
            <History className="h-4 w-4 mr-2" />
            耗卡记录
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="搜索客户姓名/卡号" 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="正常">正常</SelectItem>
                    <SelectItem value="已用完">已用完</SelectItem>
                    <SelectItem value="已过期">已过期</SelectItem>
                    <SelectItem value="已退卡">已退卡</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="产康套餐">产康套餐</SelectItem>
                    <SelectItem value="月嫂套餐">月嫂套餐</SelectItem>
                    <SelectItem value="育婴套餐">育婴套餐</SelectItem>
                    <SelectItem value="综合套餐">综合套餐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cards Table */}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>卡号/客户</TableHead>
                  <TableHead>套餐信息</TableHead>
                  <TableHead>使用情况</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>有效期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {card.customerName.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{card.customerName}</p>
                          <p className="text-sm text-muted-foreground">{card.cardNo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{card.packageName}</p>
                        <Badge variant="outline" className="mt-1">{card.packageType}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">已用</span>
                          <span className="font-medium">{card.usedTimes}/{card.totalTimes}次</span>
                        </div>
                        <Progress value={(card.usedTimes / card.totalTimes) * 100} className="h-1.5 w-24" />
                        <p className="text-xs text-muted-foreground">剩余 {card.remainingTimes} 次</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">¥{card.totalAmount.toLocaleString()}</p>
                        <p className="text-muted-foreground">已付 ¥{card.paidAmount.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{card.purchaseDate}</p>
                        <p className="text-muted-foreground">至 {card.expireDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[card.status].className}>
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={card.status !== "正常"}
                          onClick={() => handleUseCard(card)}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          耗卡
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-muted-foreground">共 {filteredCards.length} 条记录</span>
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
        </TabsContent>

        <TabsContent value="records" className="mt-4 space-y-4">
          {/* Usage Records Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="搜索客户姓名/卡号" 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Input type="date" className="w-full sm:w-40" placeholder="开始日期" />
                <Input type="date" className="w-full sm:w-40" placeholder="结束日期" />
              </div>
            </CardContent>
          </Card>

          {/* Usage Records Table */}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>客户/卡号</TableHead>
                  <TableHead>服务项目</TableHead>
                  <TableHead>耗卡次数</TableHead>
                  <TableHead>服务技师</TableHead>
                  <TableHead>服务时间</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.customerName}</p>
                        <p className="text-sm text-muted-foreground">{record.cardNo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{record.projectName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.useTimes}次</Badge>
                    </TableCell>
                    <TableCell>{record.technician}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{record.serviceDate}</p>
                        <p className="text-muted-foreground">{record.serviceTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{record.createdBy}</p>
                        <p className="text-muted-foreground">{record.createdAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{record.notes || "-"}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-muted-foreground">共 {filteredRecords.length} 条记录</span>
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
        </TabsContent>
      </Tabs>

      {/* 耗卡对话框 */}
      <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>耗卡操作</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">客户</span>
                  <span className="font-medium">{selectedCard.customerName}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">卡号</span>
                  <span className="font-medium">{selectedCard.cardNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">剩余次数</span>
                  <span className="font-medium text-primary">{selectedCard.remainingTimes}次</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>服务项目</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择服务项目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="腹直肌修复">腹直肌修复</SelectItem>
                    <SelectItem value="骨盆修复">骨盆修复</SelectItem>
                    <SelectItem value="满月发汗">满月发汗</SelectItem>
                    <SelectItem value="催乳通乳">催乳通乳</SelectItem>
                    <SelectItem value="产后塑形">产后塑形</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>耗卡次数</Label>
                  <Input type="number" defaultValue="1" min="1" max={selectedCard.remainingTimes} />
                </div>
                <div className="space-y-2">
                  <Label>服务技师</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择技师" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="王秀兰">王秀兰</SelectItem>
                      <SelectItem value="郑小梅">郑小梅</SelectItem>
                      <SelectItem value="孙小红">孙小红</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>服务日期</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>服务时间</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>备注</Label>
                <Textarea placeholder="请输入备注信息" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setShowUsageDialog(false)}>
              取消
            </Button>
            <Button onClick={() => setShowUsageDialog(false)}>确认耗卡</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={null}>
        <PackagesContent />
      </Suspense>
    </AdminLayout>
  )
}
