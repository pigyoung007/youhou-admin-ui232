"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, Search, Home, Phone, FileText, Shield, 
  Calendar, MapPin, User, Clock, CheckCircle, AlertTriangle
} from "lucide-react"
import Link from "next/link"

// 上户提醒数据
const upcomingServiceData = [
  { 
    id: "SS001", 
    staffName: "李春华", staffRole: "金牌月嫂", staffPhone: "138****5678",
    customerName: "张女士", customerPhone: "139****1234",
    serviceStartDate: "2026-03-22", daysRemaining: 3, 
    contractNo: "HT202603001", orderId: "ORD202603001",
    address: "浦东新区xxx小区12号楼1501",
    insuranceStatus: "valid", insuranceExpiry: "2026-12-31",
    contractStatus: "signed",
    serviceType: "月嫂服务", serviceDuration: "26天",
    checkItems: { materials: true, uniform: true, contract: true, insurance: true }
  },
  { 
    id: "SS002", 
    staffName: "王美玲", staffRole: "特级月嫂", staffPhone: "139****3456",
    customerName: "刘女士", customerPhone: "137****5678",
    serviceStartDate: "2026-03-21", daysRemaining: 2, 
    contractNo: "HT202603005", orderId: "ORD202603005",
    address: "静安区xxx公寓8号楼2301",
    insuranceStatus: "valid", insuranceExpiry: "2026-08-15",
    contractStatus: "signed",
    serviceType: "月嫂服务", serviceDuration: "42天",
    checkItems: { materials: true, uniform: false, contract: true, insurance: true }
  },
  { 
    id: "SS003", 
    staffName: "陈桂芳", staffRole: "高级育婴师", staffPhone: "137****9012",
    customerName: "赵女士", customerPhone: "135****9012",
    serviceStartDate: "2026-03-20", daysRemaining: 1, 
    contractNo: "HT202603008", orderId: "ORD202603008",
    address: "徐汇区xxx小区3号楼801",
    insuranceStatus: "expiring", insuranceExpiry: "2026-04-05",
    contractStatus: "signed",
    serviceType: "育婴服务", serviceDuration: "3个月",
    checkItems: { materials: true, uniform: true, contract: true, insurance: false }
  },
  { 
    id: "SS004", 
    staffName: "周丽华", staffRole: "金牌月嫂", staffPhone: "136****2345",
    customerName: "孙女士", customerPhone: "138****3456",
    serviceStartDate: "2026-03-20", daysRemaining: 1, 
    contractNo: "HT202603010", orderId: "ORD202603010",
    address: "黄浦区xxx大厦15楼",
    insuranceStatus: "valid", insuranceExpiry: "2026-10-20",
    contractStatus: "pending",
    serviceType: "月嫂服务", serviceDuration: "26天",
    checkItems: { materials: false, uniform: true, contract: false, insurance: true }
  },
]

export default function UpcomingServicePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [daysFilter, setDaysFilter] = useState("all")

  const filteredData = upcomingServiceData.filter(item => {
    if (searchTerm && 
        !item.staffName.includes(searchTerm) && 
        !item.customerName.includes(searchTerm) &&
        !item.contractNo.includes(searchTerm)) return false
    if (daysFilter !== "all" && item.daysRemaining.toString() !== daysFilter) return false
    return true
  })

  const getDaysColor = (days: number) => {
    if (days <= 1) return "bg-red-100 text-red-700 border-red-200"
    if (days <= 2) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  const getInsuranceColor = (status: string) => {
    if (status === "valid") return "bg-green-100 text-green-700"
    if (status === "expiring") return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  const getContractColor = (status: string) => {
    if (status === "signed") return "bg-green-100 text-green-700"
    return "bg-amber-100 text-amber-700"
  }

  const getCheckStatus = (items: typeof upcomingServiceData[0]['checkItems']) => {
    const total = Object.keys(items).length
    const checked = Object.values(items).filter(Boolean).length
    return { total, checked, complete: total === checked }
  }

  return (
    <AdminLayout title="上户提醒">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <div>
            <h1 className="text-xl font-semibold">上户提醒列表</h1>
            <p className="text-sm text-muted-foreground">
              共 {filteredData.length} 位家政员即将上户，请确认准备工作
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">明天上户</p>
                  <p className="text-2xl font-bold text-red-600">
                    {upcomingServiceData.filter(s => s.daysRemaining === 1).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">后天上户</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {upcomingServiceData.filter(s => s.daysRemaining === 2).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">3天后上户</p>
                  <p className="text-2xl font-bold text-green-600">
                    {upcomingServiceData.filter(s => s.daysRemaining === 3).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">准备未完成</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {upcomingServiceData.filter(s => !getCheckStatus(s.checkItems).complete).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索人员、客户或合同号..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={daysFilter} onValueChange={setDaysFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="上户时间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="1">明天</SelectItem>
                  <SelectItem value="2">后天</SelectItem>
                  <SelectItem value="3">3天后</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 人员列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">家政员</TableHead>
                <TableHead>上户时间</TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>服务地址</TableHead>
                <TableHead>保险状态</TableHead>
                <TableHead>合同状态</TableHead>
                <TableHead>准备情况</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const checkStatus = getCheckStatus(item.checkItems)
                return (
                  <TableRow key={item.id} className={item.daysRemaining <= 1 ? "bg-red-50/30" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {item.staffName.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.staffName}</p>
                          <p className="text-xs text-muted-foreground">{item.staffRole}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className={getDaysColor(item.daysRemaining)}>
                          {item.daysRemaining === 1 ? "明天" : item.daysRemaining === 2 ? "后天" : `${item.daysRemaining}天后`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{item.serviceStartDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{item.customerName}</p>
                        <p className="text-xs text-muted-foreground">{item.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1 max-w-[200px]">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{item.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getInsuranceColor(item.insuranceStatus)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {item.insuranceStatus === "valid" ? "有效" : item.insuranceStatus === "expiring" ? "即将到期" : "已过期"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getContractColor(item.contractStatus)}>
                        <FileText className="h-3 w-3 mr-1" />
                        {item.contractStatus === "signed" ? "已签署" : "待签署"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${checkStatus.complete ? "text-green-600" : "text-amber-600"}`}>
                          {checkStatus.checked}/{checkStatus.total}
                        </div>
                        {!checkStatus.complete && (
                          <span className="text-xs text-amber-600">
                            {!item.checkItems.materials && "物料"}
                            {!item.checkItems.uniform && " 工服"}
                            {!item.checkItems.contract && " 合同"}
                            {!item.checkItems.insurance && " 保险"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" title="拨打家政员电话">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/family-service/orders?id=${item.orderId}`}>
                            查看订单
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/contracts/list?id=${item.contractNo}`}>
                            查看合同
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
