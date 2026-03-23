"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft, Search, Filter, Calendar, Phone, MessageSquare, 
  UserPlus, Clock, AlertTriangle, ChevronRight
} from "lucide-react"
import Link from "next/link"

// 空档期家政员数据
const gapStaffData = [
  { 
    id: "N001", name: "张美玲", role: "金牌月嫂", type: "nanny", 
    gapDays: 8, lastServiceEnd: "2026-03-15", nextServiceStart: "暂无", 
    phone: "137****9012", level: "金牌", experience: "8年",
    lastCustomer: "王女士", lastServiceType: "月嫂服务",
    reason: "客户提前下户"
  },
  { 
    id: "N002", name: "陈桂芳", role: "特级月嫂", type: "nanny", 
    gapDays: 22, lastServiceEnd: "2026-03-01", nextServiceStart: "暂无", 
    phone: "136****3456", level: "特级", experience: "12年",
    lastCustomer: "李女士", lastServiceType: "月嫂服务",
    reason: "正常下户待派单"
  },
  { 
    id: "IC001", name: "吴丽丽", role: "金牌育婴师", type: "infant", 
    gapDays: 12, lastServiceEnd: "2026-03-10", nextServiceStart: "暂无", 
    phone: "139****3456", level: "金牌", experience: "6年",
    lastCustomer: "张女士", lastServiceType: "育婴服务",
    reason: "正常下户待派单"
  },
  { 
    id: "IC002", name: "钱小燕", role: "高级育婴师", type: "infant", 
    gapDays: 18, lastServiceEnd: "2026-03-04", nextServiceStart: "暂无", 
    phone: "135****6789", level: "高级", experience: "4年",
    lastCustomer: "赵女士", lastServiceType: "育婴服务",
    reason: "休假结束待派单"
  },
  { 
    id: "T001", name: "赵丽娜", role: "产康技师", type: "tech", 
    gapDays: 5, lastServiceEnd: "2026-03-17", nextServiceStart: "暂无", 
    phone: "138****5678", level: "高级", experience: "5年",
    lastCustomer: "刘女士", lastServiceType: "产康服务",
    reason: "正常下户待派单"
  },
]

const typeOptions = [
  { value: "all", label: "全部类型" },
  { value: "nanny", label: "月嫂" },
  { value: "infant", label: "育婴师" },
  { value: "tech", label: "产康技师" },
  { value: "elderly", label: "养老护理" },
]

export default function GapStaffPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("gapDays")

  const filteredData = gapStaffData
    .filter(staff => {
      if (searchTerm && !staff.name.includes(searchTerm) && !staff.phone.includes(searchTerm)) return false
      if (typeFilter !== "all" && staff.type !== typeFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "gapDays") return b.gapDays - a.gapDays
      return 0
    })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "nanny": return "bg-rose-100 text-rose-700"
      case "infant": return "bg-cyan-100 text-cyan-700"
      case "tech": return "bg-teal-100 text-teal-700"
      case "elderly": return "bg-purple-100 text-purple-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getGapBadgeColor = (days: number) => {
    if (days >= 14) return "bg-red-100 text-red-700 border-red-200"
    if (days >= 7) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  return (
    <AdminLayout title="空档期人员">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <div>
            <h1 className="text-xl font-semibold">空档期人员列表</h1>
            <p className="text-sm text-muted-foreground">
              共 {filteredData.length} 位家政员处于空档期，请及时安排派单
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">空档14天+</p>
                  <p className="text-2xl font-bold text-red-600">
                    {gapStaffData.filter(s => s.gapDays >= 14).length}
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
                  <p className="text-sm text-muted-foreground">空档7-14天</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {gapStaffData.filter(s => s.gapDays >= 7 && s.gapDays < 14).length}
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
                  <p className="text-sm text-muted-foreground">空档7天内</p>
                  <p className="text-2xl font-bold text-green-600">
                    {gapStaffData.filter(s => s.gapDays < 7).length}
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
                  <p className="text-sm text-muted-foreground">总空档人数</p>
                  <p className="text-2xl font-bold">{gapStaffData.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-primary/60" />
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
                  placeholder="搜索姓名或电话..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="人员类型" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gapDays">空档天数</SelectItem>
                  <SelectItem value="name">姓名</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href="/family-service/scheduling">
                  <Calendar className="h-4 w-4 mr-2" />
                  查看排班
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 人员列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">人员信息</TableHead>
                <TableHead>类型/等级</TableHead>
                <TableHead>空档天数</TableHead>
                <TableHead>上次服务</TableHead>
                <TableHead>下次预约</TableHead>
                <TableHead>空档原因</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-amber-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={getTypeColor(staff.type)}>
                          {staff.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className={getTypeColor(staff.type)}>
                        {staff.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{staff.experience}经验</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getGapBadgeColor(staff.gapDays)}>
                      {staff.gapDays} 天
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{staff.lastServiceEnd}</p>
                      <p className="text-xs text-muted-foreground">{staff.lastCustomer} · {staff.lastServiceType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={staff.nextServiceStart === "暂无" ? "text-muted-foreground" : ""}>
                      {staff.nextServiceStart}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{staff.reason}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" title="拨打电话">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="发送消息">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/family-service/scheduling?staffId=${staff.id}`}>
                          派单
                          <ChevronRight className="h-4 w-4 ml-1" />
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
