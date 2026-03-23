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
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, Search, Clock, Phone, MessageSquare, 
  AlertTriangle, Calendar, GraduationCap, FileText
} from "lucide-react"
import Link from "next/link"

// 课时不足学员数据
const lowHoursData = [
  {
    id: "LH001", name: "刘小芳", phone: "138****1234",
    courseName: "产康技师培训", totalHours: 60, remainingHours: 2,
    lastClassDate: "2026-03-18", expiryDate: "2026-03-25",
    contractNo: "TC202603001", orderId: "TO202603001",
    status: "critical", // critical: <3小时, warning: 3-5小时, normal: >5小时
    consultant: "张顾问"
  },
  {
    id: "LH002", name: "张丽华", phone: "139****2345",
    courseName: "高级月嫂培训", totalHours: 80, remainingHours: 5,
    lastClassDate: "2026-03-17", expiryDate: "2026-04-01",
    contractNo: "TC202603002", orderId: "TO202603002",
    status: "warning",
    consultant: "李顾问"
  },
  {
    id: "LH003", name: "陈美玲", phone: "137****3456",
    courseName: "育婴师培训", totalHours: 40, remainingHours: 3,
    lastClassDate: "2026-03-16", expiryDate: "2026-03-28",
    contractNo: "TC202603003", orderId: "TO202603003",
    status: "critical",
    consultant: "张顾问"
  },
  {
    id: "LH004", name: "王秀英", phone: "136****4567",
    courseName: "催乳师培训", totalHours: 30, remainingHours: 4,
    lastClassDate: "2026-03-15", expiryDate: "2026-03-30",
    contractNo: "TC202603004", orderId: "TO202603004",
    status: "warning",
    consultant: "王顾问"
  },
  {
    id: "LH005", name: "赵丽娜", phone: "135****5678",
    courseName: "高级月嫂培训", totalHours: 80, remainingHours: 8,
    lastClassDate: "2026-03-14", expiryDate: "2026-04-10",
    contractNo: "TC202603005", orderId: "TO202603005",
    status: "normal",
    consultant: "李顾问"
  },
]

export default function LowHoursPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = lowHoursData.filter(item => {
    if (searchTerm && !item.name.includes(searchTerm) && !item.phone.includes(searchTerm)) return false
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    return true
  })

  const getStatusColor = (status: string) => {
    if (status === "critical") return "bg-red-100 text-red-700 border-red-200"
    if (status === "warning") return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  const getStatusText = (status: string) => {
    if (status === "critical") return "紧急"
    if (status === "warning") return "注意"
    return "正常"
  }

  const getProgressColor = (remaining: number, total: number) => {
    const percent = (remaining / total) * 100
    if (percent <= 5) return "bg-red-500"
    if (percent <= 10) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <AdminLayout title="课时不足学员">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <div>
            <h1 className="text-xl font-semibold">课时不足学员列表</h1>
            <p className="text-sm text-muted-foreground">
              共 {filteredData.length} 名学员课时不足，请及时提醒续费
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">紧急（3课时内）</p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowHoursData.filter(s => s.status === "critical").length}
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
                  <p className="text-sm text-muted-foreground">注意（3-5课时）</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {lowHoursData.filter(s => s.status === "warning").length}
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
                  <p className="text-sm text-muted-foreground">正常（5课时+）</p>
                  <p className="text-2xl font-bold text-green-600">
                    {lowHoursData.filter(s => s.status === "normal").length}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总计</p>
                  <p className="text-2xl font-bold">{lowHoursData.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-primary/60" />
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
                  placeholder="搜索学员姓名或电话..." 
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
                  <SelectItem value="critical">紧急</SelectItem>
                  <SelectItem value="warning">注意</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href="/education/students">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  学员管理
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 学员列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">学员信息</TableHead>
                <TableHead>课程名称</TableHead>
                <TableHead>剩余课时</TableHead>
                <TableHead>课时进度</TableHead>
                <TableHead>最后上课</TableHead>
                <TableHead>到期时间</TableHead>
                <TableHead>负责顾问</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className={item.status === "critical" ? "bg-red-50/30" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-cyan-100 text-cyan-700">
                          {item.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.courseName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.remainingHours}课时
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        / {item.totalHours}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress 
                        value={(item.remainingHours / item.totalHours) * 100} 
                        className={`h-2 ${getProgressColor(item.remainingHours, item.totalHours)}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        已用 {item.totalHours - item.remainingHours} 课时
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.lastClassDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{item.expiryDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.consultant}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" title="拨打电话">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="发送消息">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/education/orders?action=renew&studentId=${item.id}`}>
                          续费
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
