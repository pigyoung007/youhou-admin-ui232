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
import { 
  ArrowLeft, Search, FileText, Phone, Send, 
  Clock, AlertTriangle, CheckCircle, User
} from "lucide-react"
import Link from "next/link"

// 待签合同数据
const pendingContractsData = [
  {
    id: "CT001", contractNo: "HT202603001", 
    customerName: "张女士", customerPhone: "138****1234",
    contractType: "月嫂服务合同", amount: 18000,
    createdAt: "2026-03-15", expiredAt: "2026-03-22",
    daysRemaining: 3, status: "pending",
    staffName: "李春华", staffRole: "金牌月嫂",
    consultant: "张顾问"
  },
  {
    id: "CT002", contractNo: "HT202603002", 
    customerName: "刘女士", customerPhone: "139****2345",
    contractType: "育婴服务合同", amount: 12000,
    createdAt: "2026-03-14", expiredAt: "2026-03-21",
    daysRemaining: 2, status: "pending",
    staffName: "王美玲", staffRole: "高级育婴师",
    consultant: "李顾问"
  },
  {
    id: "CT003", contractNo: "HT202603003", 
    customerName: "赵女士", customerPhone: "137****3456",
    contractType: "月嫂服务合同", amount: 22000,
    createdAt: "2026-03-16", expiredAt: "2026-03-23",
    daysRemaining: 4, status: "pending",
    staffName: "陈桂芳", staffRole: "特级月嫂",
    consultant: "张顾问"
  },
  {
    id: "CT004", contractNo: "HT202603004", 
    customerName: "孙女士", customerPhone: "136****4567",
    contractType: "产康服务合同", amount: 6800,
    createdAt: "2026-03-12", expiredAt: "2026-03-19",
    daysRemaining: 0, status: "expired",
    staffName: "周丽华", staffRole: "产康技师",
    consultant: "王顾问"
  },
  {
    id: "CT005", contractNo: "HT202603005", 
    customerName: "王先生", customerPhone: "135****5678",
    contractType: "月嫂服务合同", amount: 20000,
    createdAt: "2026-03-17", expiredAt: "2026-03-24",
    daysRemaining: 5, status: "pending",
    staffName: "郑美玲", staffRole: "金牌月嫂",
    consultant: "李顾问"
  },
]

export default function PendingContractsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = pendingContractsData.filter(item => {
    if (searchTerm && 
        !item.customerName.includes(searchTerm) && 
        !item.contractNo.includes(searchTerm)) return false
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    return true
  })

  const getDaysColor = (days: number) => {
    if (days <= 0) return "bg-red-100 text-red-700 border-red-200"
    if (days <= 2) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  return (
    <AdminLayout title="待签合同">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div>
              <h1 className="text-xl font-semibold">待签合同列表</h1>
              <p className="text-sm text-muted-foreground">
                共 {filteredData.length} 份合同待签署
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/contracts/list?action=create">
              <FileText className="h-4 w-4 mr-2" />
              新建合同
            </Link>
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已超期</p>
                  <p className="text-2xl font-bold text-red-600">
                    {pendingContractsData.filter(c => c.daysRemaining <= 0).length}
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
                  <p className="text-sm text-muted-foreground">即将到期（2天内）</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {pendingContractsData.filter(c => c.daysRemaining > 0 && c.daysRemaining <= 2).length}
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
                  <p className="text-sm text-muted-foreground">正常待签</p>
                  <p className="text-2xl font-bold text-green-600">
                    {pendingContractsData.filter(c => c.daysRemaining > 2).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合同总额</p>
                  <p className="text-2xl font-bold">
                    ¥{(pendingContractsData.reduce((sum, c) => sum + c.amount, 0) / 10000).toFixed(1)}万
                  </p>
                </div>
                <FileText className="h-8 w-8 text-primary/60" />
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
                  placeholder="搜索客户姓名或合同号..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待签署</SelectItem>
                  <SelectItem value="expired">已超期</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href="/contracts/pending">
                  <FileText className="h-4 w-4 mr-2" />
                  合同管理
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 合同列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>合同编号</TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>合同类型</TableHead>
                <TableHead>合同金额</TableHead>
                <TableHead>服务人员</TableHead>
                <TableHead>签署期限</TableHead>
                <TableHead>负责顾问</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className={item.daysRemaining <= 0 ? "bg-red-50/30" : ""}>
                  <TableCell>
                    <span className="font-medium text-primary">{item.contractNo}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.customerName}</p>
                      <p className="text-xs text-muted-foreground">{item.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.contractType}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">¥{item.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{item.staffName}</p>
                        <p className="text-xs text-muted-foreground">{item.staffRole}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className={getDaysColor(item.daysRemaining)}>
                        {item.daysRemaining <= 0 ? "已超期" : `${item.daysRemaining}天后到期`}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{item.expiredAt}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.consultant}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" title="拨打电话">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="发送签署链接">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/contracts/list?id=${item.contractNo}`}>
                          查看
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
