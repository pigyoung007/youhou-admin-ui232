"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Filter, Eye, Edit, Building2, Users, MapPin,
  Phone, Mail, Calendar, CheckCircle, XCircle, MoreHorizontal, Settings
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// 租户状态
type TenantStatus = "active" | "trial" | "expired" | "disabled"
const statusConfig: Record<TenantStatus, { label: string; color: string }> = {
  active: { label: "正常", color: "bg-green-100 text-green-700" },
  trial: { label: "试用", color: "bg-blue-100 text-blue-700" },
  expired: { label: "已过期", color: "bg-amber-100 text-amber-700" },
  disabled: { label: "已停用", color: "bg-red-100 text-red-700" },
}

// Mock数据
const mockTenants = [
  {
    id: "T001",
    name: "优厚家庭服务（北京）",
    shortName: "优厚北京",
    status: "active" as TenantStatus,
    contact: "张经理",
    phone: "138****5678",
    email: "beijing@youhou.com",
    address: "北京市朝阳区望京SOHO",
    employeeCount: 156,
    customerCount: 2340,
    orderCount: 892,
    createDate: "2024-01-15",
    expireDate: "2027-01-14",
    modules: ["SCRM", "培训学院", "家庭服务", "财务管理", "库存管理"],
  },
  {
    id: "T002",
    name: "优厚家庭服务（上海）",
    shortName: "优厚上海",
    status: "active" as TenantStatus,
    contact: "李总",
    phone: "139****1234",
    email: "shanghai@youhou.com",
    address: "上海市浦东新区陆家嘴",
    employeeCount: 98,
    customerCount: 1560,
    orderCount: 534,
    createDate: "2024-06-01",
    expireDate: "2026-05-31",
    modules: ["SCRM", "培训学院", "家庭服务", "财务管理"],
  },
  {
    id: "T003",
    name: "爱月宝月子中心",
    shortName: "爱月宝",
    status: "trial" as TenantStatus,
    contact: "王女士",
    phone: "137****9876",
    email: "contact@aiyuebao.com",
    address: "深圳市南山区科技园",
    employeeCount: 45,
    customerCount: 320,
    orderCount: 86,
    createDate: "2026-03-01",
    expireDate: "2026-04-01",
    modules: ["SCRM", "家庭服务"],
  },
  {
    id: "T004",
    name: "家和家政服务",
    shortName: "家和",
    status: "expired" as TenantStatus,
    contact: "陈经理",
    phone: "136****5432",
    email: "admin@jiahe.com",
    address: "广州市天河区珠江新城",
    employeeCount: 32,
    customerCount: 456,
    orderCount: 128,
    createDate: "2024-03-15",
    expireDate: "2026-03-14",
    modules: ["SCRM", "培训学院"],
  },
]

// 统计数据
const statsData = {
  total: 12,
  active: 8,
  trial: 2,
  expired: 1,
  disabled: 1,
  totalEmployees: 520,
  totalCustomers: 8650,
}

export default function TenantInstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTenant, setSelectedTenant] = useState<typeof mockTenants[0] | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredTenants = mockTenants.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (searchTerm && !t.name.includes(searchTerm) && !t.shortName.includes(searchTerm) && !t.id.includes(searchTerm)) return false
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">机构租户管理</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理系统中的机构租户、授权模块和使用情况
            </p>
          </div>
          <Button size="sm" className="h-8" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />新增机构
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-700">{statsData.total}</div>
              <div className="text-xs text-blue-600/70">总机构数</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-700">{statsData.active}</div>
              <div className="text-xs text-green-600/70">正常使用</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-700">{statsData.trial}</div>
              <div className="text-xs text-purple-600/70">试用中</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-700">{statsData.expired}</div>
              <div className="text-xs text-amber-600/70">已过期</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-700">{statsData.disabled}</div>
              <div className="text-xs text-red-600/70">已停用</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-teal-700">{statsData.totalEmployees}</div>
              <div className="text-xs text-teal-600/70">总员工数</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-700">{statsData.totalCustomers}</div>
              <div className="text-xs text-indigo-600/70">总客户数</div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选区域 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索机构名称、简称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="trial">试用</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                  <SelectItem value="disabled">已停用</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />更多筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 机构列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">编号</TableHead>
                <TableHead className="min-w-[180px]">机构名称</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[100px]">联系人</TableHead>
                <TableHead className="w-[80px]">员工数</TableHead>
                <TableHead className="w-[80px]">客户数</TableHead>
                <TableHead className="w-[80px]">订单数</TableHead>
                <TableHead className="w-[100px]">到期时间</TableHead>
                <TableHead className="w-[80px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedTenant(tenant); setShowDetailDialog(true); }}>
                  <TableCell className="font-mono text-xs">{tenant.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{tenant.shortName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-xs text-muted-foreground">{tenant.shortName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", statusConfig[tenant.status].color)}>
                      {statusConfig[tenant.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{tenant.contact}</div>
                    <div className="text-xs text-muted-foreground">{tenant.phone}</div>
                  </TableCell>
                  <TableCell className="text-center">{tenant.employeeCount}</TableCell>
                  <TableCell className="text-center">{tenant.customerCount}</TableCell>
                  <TableCell className="text-center">{tenant.orderCount}</TableCell>
                  <TableCell className="text-sm">
                    <span className={cn(
                      tenant.status === "expired" && "text-red-500",
                      tenant.status === "trial" && "text-amber-500"
                    )}>
                      {tenant.expireDate}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedTenant(tenant); setShowDetailDialog(true); }}>
                          <Eye className="h-4 w-4 mr-2" />查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />编辑信息
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />模块配置
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {tenant.status === "active" ? (
                          <DropdownMenuItem className="text-red-500">
                            <XCircle className="h-4 w-4 mr-2" />停用
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-500">
                            <CheckCircle className="h-4 w-4 mr-2" />启用
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 机构详情对话框 */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                机构详情
              </DialogTitle>
            </DialogHeader>
            {selectedTenant && (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">{selectedTenant.shortName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{selectedTenant.name}</h3>
                      <Badge variant="outline" className={cn(statusConfig[selectedTenant.status].color)}>
                        {statusConfig[selectedTenant.status].label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedTenant.shortName} · {selectedTenant.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">联系人：</span>
                    <span>{selectedTenant.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">电话：</span>
                    <span>{selectedTenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">邮箱：</span>
                    <span>{selectedTenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">创建日期：</span>
                    <span>{selectedTenant.createDate}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">地址：</span>
                    <span>{selectedTenant.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{selectedTenant.employeeCount}</div>
                    <div className="text-xs text-blue-600/70">员工数量</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{selectedTenant.customerCount}</div>
                    <div className="text-xs text-green-600/70">客户数量</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">{selectedTenant.orderCount}</div>
                    <div className="text-xs text-purple-600/70">订单数量</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">授权模块</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTenant.modules.map((module, i) => (
                      <Badge key={i} variant="secondary">{module}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-700">服务到期时间</span>
                    <span className="font-medium text-amber-800">{selectedTenant.expireDate}</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>关闭</Button>
              <Button>编辑信息</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 新增机构对话框 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>新增机构</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>机构全称 *</Label>
                  <Input placeholder="请输入机构全称" />
                </div>
                <div className="space-y-2">
                  <Label>机构简称 *</Label>
                  <Input placeholder="请输入机构简称" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>联系人 *</Label>
                  <Input placeholder="请输入联系人姓名" />
                </div>
                <div className="space-y-2">
                  <Label>联系电话 *</Label>
                  <Input placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input type="email" placeholder="请输入邮箱地址" />
              </div>
              <div className="space-y-2">
                <Label>地址</Label>
                <Input placeholder="请输入详细地址" />
              </div>
              <div className="space-y-2">
                <Label>服务期限</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="请选择服务期限" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">试用30天</SelectItem>
                    <SelectItem value="1year">1年</SelectItem>
                    <SelectItem value="2year">2年</SelectItem>
                    <SelectItem value="3year">3年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>授权模块</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["SCRM客户管理", "培训学院", "家庭服务", "财务管理", "库存管理", "运营中心"].map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <Switch id={module} />
                      <Label htmlFor={module} className="text-sm">{module}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
              <Button onClick={() => setShowCreateDialog(false)}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
