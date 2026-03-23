"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft, Search, ShoppingCart, Phone, MessageSquare, 
  Eye, FileText, Calendar, Clock
} from "lucide-react"

// 新订单数据
const newOrdersData = [
  {
    id: "ORD001", customerName: "王女士", customerPhone: "138****1234",
    serviceType: "月嫂服务", serviceLevel: "金牌", startDate: "2026-04-01",
    duration: 31, totalAmount: 26800, status: "pending", createdAt: "2026-03-19",
    consultant: "李顾问", address: "浦东新区"
  },
  {
    id: "ORD002", customerName: "张先生", customerPhone: "139****2345",
    serviceType: "育婴师", serviceLevel: "特级", startDate: "2026-03-25",
    duration: 30, totalAmount: 15000, status: "confirmed", createdAt: "2026-03-19",
    consultant: "王顾问", address: "静安区"
  },
  {
    id: "ORD003", customerName: "李女士", customerPhone: "137****3456",
    serviceType: "产康服务", serviceLevel: "高级", startDate: "2026-03-20",
    duration: 20, totalAmount: 12000, status: "pending", createdAt: "2026-03-19",
    consultant: "陈顾问", address: "黄浦区"
  },
  {
    id: "ORD004", customerName: "刘女士", customerPhone: "136****4567",
    serviceType: "保姆服务", serviceLevel: "标准", startDate: "2026-04-05",
    duration: 180, totalAmount: 36000, status: "pending", createdAt: "2026-03-18",
    consultant: "张顾问", address: "徐汇区"
  },
  {
    id: "ORD005", customerName: "赵女士", customerPhone: "135****5678",
    serviceType: "月嫂服务", serviceLevel: "标准", startDate: "2026-03-22",
    duration: 28, totalAmount: 18000, status: "confirmed", createdAt: "2026-03-18",
    consultant: "周顾问", address: "长宁区"
  },
]

export default function NewOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = newOrdersData.filter(item => {
    if (searchTerm && !item.customerName.includes(searchTerm) && !item.customerPhone.includes(searchTerm)) return false
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    return true
  })

  return (
    <AdminLayout title="新订单">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div>
              <h1 className="text-xl font-semibold">新订单列表</h1>
              <p className="text-sm text-muted-foreground">
                共 {filteredData.length} 个新订单待处理
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/family-service/orders?action=create">
              <ShoppingCart className="h-4 w-4 mr-2" />
              新建订单
            </Link>
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">新增订单</p>
                  <p className="text-2xl font-bold text-green-600">{newOrdersData.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待确认</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {newOrdersData.filter(o => o.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已确认</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {newOrdersData.filter(o => o.status === "confirmed").length}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总金额</p>
                  <p className="text-2xl font-bold">
                    ¥{(newOrdersData.reduce((sum, o) => sum + o.totalAmount, 0) / 10000).toFixed(1)}万
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
                  placeholder="搜索客户名或电话..." 
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
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href="/family-service/orders">
                  <FileText className="h-4 w-4 mr-2" />
                  订单管理
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 订单列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>服务类型</TableHead>
                <TableHead>等级</TableHead>
                <TableHead>开始日期</TableHead>
                <TableHead>时长</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>负责顾问</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-primary">{item.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.customerName}</p>
                        <p className="text-xs text-muted-foreground">{item.customerPhone}</p>
                        <p className="text-xs text-muted-foreground">{item.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.serviceLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{item.startDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.duration}天</span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ¥{item.totalAmount}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.consultant}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "pending" ? "secondary" : "outline"}>
                        {item.status === "pending" ? "待确认" : "已确认"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" title="查看详情" asChild>
                          <Link href={`/family-service/orders/${item.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" title="生成合同">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="拨打电话">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
