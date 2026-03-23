"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Shield,
  AlertTriangle,
  RefreshCcw,
  Plus,
  Edit,
  Eye,
  Heart,
  Baby,
  UserCog,
  Bell,
  ShoppingCart,
  Check,
} from "lucide-react"

// 所有家政人员数据
const allStaff = [
  { id: "N001", name: "李春华", role: "金牌月嫂", type: "nanny", phone: "138****1234", level: "金牌", status: "active",
    insurance: { hasInsurance: true, policyNo: "PICC2025010001", insurer: "中国人民财产保险", amount: 1000000, startDate: "2024-06-30", endDate: "2025-06-30", status: "active", daysRemaining: 158 }
  },
  { id: "N002", name: "王秀兰", role: "高级育婴师", type: "infant", phone: "139****5678", level: "高级", status: "active",
    insurance: { hasInsurance: true, policyNo: "PICC2024080002", insurer: "中国人民财产保险", amount: 1000000, startDate: "2024-08-15", endDate: "2025-02-15", status: "expiring", daysRemaining: 23 }
  },
  { id: "N003", name: "张美玲", role: "金牌月嫂", type: "nanny", phone: "137****9012", level: "金牌", status: "active",
    insurance: { hasInsurance: true, policyNo: "CPIC2024050003", insurer: "中国太平洋保险", amount: 500000, startDate: "2024-05-01", endDate: "2025-02-01", status: "expiring", daysRemaining: 9 }
  },
  { id: "N004", name: "陈桂芳", role: "特级月嫂", type: "nanny", phone: "136****3456", level: "特级", status: "active",
    insurance: { hasInsurance: true, policyNo: "PICC2023120004", insurer: "中国人民财产保险", amount: 1000000, startDate: "2023-12-01", endDate: "2024-12-01", status: "expired", daysRemaining: 0 }
  },
  { id: "T001", name: "赵丽娜", role: "产康技师", type: "tech", phone: "138****5678", level: "高级", status: "active",
    insurance: { hasInsurance: false, policyNo: null, insurer: null, amount: 0, startDate: null, endDate: null, status: "none", daysRemaining: null }
  },
  { id: "IC001", name: "刘小燕", role: "育婴师", type: "infant", phone: "135****7890", level: "中级", status: "active",
    insurance: { hasInsurance: false, policyNo: null, insurer: null, amount: 0, startDate: null, endDate: null, status: "none", daysRemaining: null }
  },
  { id: "N005", name: "周红梅", role: "月嫂", type: "nanny", phone: "133****4567", level: "初级", status: "active",
    insurance: { hasInsurance: true, policyNo: "PICC2024090005", insurer: "中国人民财产保险", amount: 500000, startDate: "2024-09-01", endDate: "2025-09-01", status: "active", daysRemaining: 220 }
  },
  { id: "T002", name: "孙秀英", role: "产康技师", type: "tech", phone: "139****2345", level: "中级", status: "active",
    insurance: { hasInsurance: true, policyNo: "CPIC2024060006", insurer: "中国太平洋保险", amount: 1000000, startDate: "2024-06-01", endDate: "2025-06-01", status: "active", daysRemaining: 128 }
  },
]

const insuranceProducts = [
  { id: "P001", name: "家政服务责任险-基础版", insurer: "中国人民财产保险", amount: 500000, price: 200 },
  { id: "P002", name: "家政服务责任险-标准版", insurer: "中国人民财产保险", amount: 1000000, price: 350 },
  { id: "P003", name: "家政服务责任险-尊享版", insurer: "中国人民财产保险", amount: 2000000, price: 580 },
  { id: "P004", name: "家政服务责任险-基础版", insurer: "中国太平洋保险", amount: 500000, price: 180 },
  { id: "P005", name: "家政服务责任险-标准版", insurer: "中国太平洋保险", amount: 1000000, price: 320 },
]

export default function InsurancePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const stats = {
    total: allStaff.length,
    insured: allStaff.filter(s => s.insurance.hasInsurance).length,
    noInsurance: allStaff.filter(s => !s.insurance.hasInsurance).length,
    expiring: allStaff.filter(s => s.insurance.status === "expiring").length,
    expired: allStaff.filter(s => s.insurance.status === "expired").length,
  }

  const alertStaff = allStaff.filter(s => 
    s.insurance.status === "expired" || s.insurance.status === "expiring" || s.insurance.status === "none"
  )

  const filteredStaff = allStaff.filter(s => {
    if (filterStatus !== "all" && s.insurance.status !== filterStatus) return false
    if (filterType !== "all" && s.type !== filterType) return false
    return true
  })

  const selectedStaff = allStaff.filter(s => selectedIds.includes(s.id))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">正常</Badge>
      case "expiring":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">即将到期</Badge>
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">已过期</Badge>
      case "none":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">未配置</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nanny":
        return <Heart className="h-4 w-4 text-rose-500" />
      case "infant":
        return <Baby className="h-4 w-4 text-cyan-500" />
      case "tech":
        return <UserCog className="h-4 w-4 text-teal-500" />
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">保险管理</h1>
            <p className="text-muted-foreground">管理所有家政人员的服务责任保险</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索人员..." className="pl-9 w-full sm:w-48" />
            </div>
            {selectedIds.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    批量购买 ({selectedIds.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>批量购买保险</DialogTitle>
                    <DialogDescription>为 {selectedIds.length} 位家政人员购买保险</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                      {selectedStaff.map(s => (
                        <Badge key={s.id} variant="secondary">{s.name}</Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>选择保险产品</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择保险产品" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceProducts.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} - ¥{p.price}/人
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">取消</Button>
                    <Button>确认购买</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Alert Banner */}
        {alertStaff.length > 0 && (
          <Alert className="bg-amber-50 border-amber-200">
            <Bell className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700">保险预警提醒</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex flex-wrap gap-2">
                {alertStaff.map(s => (
                  <Badge
                    key={s.id}
                    variant="outline"
                    className={
                      s.insurance.status === "expired" ? "bg-red-100 text-red-700 border-red-200" :
                      s.insurance.status === "expiring" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  >
                    {getTypeIcon(s.type)}
                    <span className="ml-1">{s.name}</span>
                    <span className="ml-1 text-xs">
                      ({s.insurance.status === "expired" ? "已过期" : 
                        s.insurance.status === "expiring" ? `${s.insurance.daysRemaining}天后到期` : 
                        "未配置"})
                    </span>
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("all")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">总人数</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("active")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.insured}</p>
              <p className="text-sm text-muted-foreground">已投保</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("none")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{stats.noInsurance}</p>
              <p className="text-sm text-muted-foreground">未配置</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("expiring")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
              <p className="text-sm text-muted-foreground">即将到期</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setFilterStatus("expired")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              <p className="text-sm text-muted-foreground">已过期</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="nanny">月嫂</SelectItem>
                  <SelectItem value="infant">育婴师</SelectItem>
                  <SelectItem value="tech">产康师</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="expiring">即将到期</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                  <SelectItem value="none">未配置</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredStaff.length && filteredStaff.length > 0}
                      onCheckedChange={(checked) => {
                        setSelectedIds(checked ? filteredStaff.map(s => s.id) : [])
                      }}
                    />
                  </TableHead>
                  <TableHead>人员信息</TableHead>
                  <TableHead>类型/级别</TableHead>
                  <TableHead>保险状态</TableHead>
                  <TableHead>保险公司</TableHead>
                  <TableHead>保额</TableHead>
                  <TableHead>到期日期</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(staff.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(prev => 
                            checked ? [...prev, staff.id] : prev.filter(id => id !== staff.id)
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className={
                            staff.type === "nanny" ? "bg-rose-100 text-rose-700" :
                            staff.type === "infant" ? "bg-cyan-100 text-cyan-700" :
                            "bg-teal-100 text-teal-700"
                          }>
                            {staff.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-muted-foreground">{staff.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(staff.type)}
                        <span>{staff.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(staff.insurance.status)}</TableCell>
                    <TableCell>{staff.insurance.insurer || "-"}</TableCell>
                    <TableCell>
                      {staff.insurance.amount > 0 ? `${(staff.insurance.amount / 10000)}万` : "-"}
                    </TableCell>
                    <TableCell>
                      {staff.insurance.endDate ? (
                        <span className={
                          staff.insurance.status === "expired" ? "text-red-600" :
                          staff.insurance.status === "expiring" ? "text-amber-600" : ""
                        }>
                          {staff.insurance.endDate}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {staff.insurance.hasInsurance ? (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>保险详情 - {staff.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 py-4">
                                  <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">保单号</span>
                                    <span className="font-mono">{staff.insurance.policyNo}</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">保险公司</span>
                                    <span>{staff.insurance.insurer}</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">保额</span>
                                    <span>¥{(staff.insurance.amount / 10000)}万</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">生效日期</span>
                                    <span>{staff.insurance.startDate}</span>
                                  </div>
                                  <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">到期日期</span>
                                    <span>{staff.insurance.endDate}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>编辑保险 - {staff.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>保险公司</Label>
                                    <Select defaultValue={staff.insurance.insurer || ""}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="中国人民财产保险">中国人民财产保险</SelectItem>
                                        <SelectItem value="中国太平洋保险">中国太平洋保险</SelectItem>
                                        <SelectItem value="中国平安保险">中国平安保险</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>保单号</Label>
                                    <Input defaultValue={staff.insurance.policyNo || ""} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>生效日期</Label>
                                      <Input type="date" defaultValue={staff.insurance.startDate || ""} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>到期日期</Label>
                                      <Input type="date" defaultValue={staff.insurance.endDate || ""} />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button>保存修改</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {(staff.insurance.status === "expiring" || staff.insurance.status === "expired") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost"><RefreshCcw className="h-4 w-4" /></Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>续保 - {staff.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>选择保险产品</Label>
                                      <Select>
                                        <SelectTrigger><SelectValue placeholder="选择保险产品" /></SelectTrigger>
                                        <SelectContent>
                                          {insuranceProducts.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                              {p.name} - ¥{p.price}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button>确认续保</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm"><ShoppingCart className="h-4 w-4 mr-1" /> 购买</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>购买保险 - {staff.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>选择保险产品</Label>
                                  <Select>
                                    <SelectTrigger><SelectValue placeholder="选择保险产品" /></SelectTrigger>
                                    <SelectContent>
                                      {insuranceProducts.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                          {p.name} - ¥{p.price}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button>确认购买</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
