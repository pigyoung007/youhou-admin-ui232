"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, Search, Phone, MessageSquare
} from "lucide-react"
import Link from "next/link"

// 保险即将到期数据
const expiringInsuranceData = [
  {
    id: "INS001", name: "王美玲", role: "金牌月嫂", type: "nanny", phone: "138****5678",
    insuranceType: "职业责任险", expiryDate: "2026-03-25", daysRemaining: 6,
    status: "warning", renewDate: "", company: "人保财险"
  },
  {
    id: "INS002", name: "李春华", role: "特级月嫂", type: "nanny", phone: "139****3456",
    insuranceType: "职业责任险", expiryDate: "2026-03-28", daysRemaining: 9,
    status: "warning", renewDate: "", company: "平安保险"
  },
  {
    id: "INS003", name: "陈桂芳", role: "高级育婴师", type: "infant", phone: "137****9012",
    insuranceType: "职业责任险", expiryDate: "2026-03-30", daysRemaining: 11,
    status: "normal", renewDate: "", company: "人保财险"
  },
  {
    id: "INS004", name: "赵丽娜", role: "产康技师", type: "tech", phone: "136****4567",
    insuranceType: "职业责任险", expiryDate: "2026-03-22", daysRemaining: 3,
    status: "urgent", renewDate: "", company: "太平保险"
  },
  {
    id: "INS005", name: "张丽华", role: "特级保姆", type: "nanny", phone: "135****6789",
    insuranceType: "职业责任险", expiryDate: "2026-03-26", daysRemaining: 7,
    status: "warning", renewDate: "", company: "人保财险"
  },
]

export default function ExpiringInsurancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredData = expiringInsuranceData.filter((item) => {
    const matchesSearch = item.name.includes(searchTerm) || item.phone.includes(searchTerm)
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">保险即将到期</h1>
            <p className="text-sm text-muted-foreground mt-1">共 {filteredData.length} 个即将到期的保险</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回工作台
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="搜索姓名或电话..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="筛选类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="nanny">月嫂/保姆</SelectItem>
                    <SelectItem value="infant">育婴师</SelectItem>
                    <SelectItem value="tech">产康技师</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>电话</TableHead>
                      <TableHead>保险类型</TableHead>
                      <TableHead>保险公司</TableHead>
                      <TableHead>到期日期</TableHead>
                      <TableHead>剩余天数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                          暂无数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>{item.insuranceType}</TableCell>
                          <TableCell>{item.company}</TableCell>
                          <TableCell>{item.expiryDate}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === "urgent" ? "destructive" : item.status === "warning" ? "secondary" : "outline"}>
                              {item.daysRemaining}天
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.status === "urgent" ? "destructive" : item.status === "warning" ? "secondary" : "outline"}>
                              {item.status === "urgent" ? "急迫" : item.status === "warning" ? "预警" : "正常"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
