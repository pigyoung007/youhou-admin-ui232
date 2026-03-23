"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Search, Plus, Building2, MapPin, Phone, Users, CheckCircle2, XCircle, Clock,
  MoreHorizontal, Edit, Eye, Trash2, BarChart3, Shield, Settings, Globe,
  CreditCard, FileText, AlertTriangle, TrendingUp, Key
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================
interface Store {
  id: string
  name: string
  type: "direct" | "tenant"
  address: string
  phone: string
  manager: string
  managerPhone: string
  licenseNo: string
  employeeCount: number
  monthlyRevenue: number
  status: "active" | "inactive" | "pending"
  createdAt: string
  // 租户专属
  companyName?: string
  tenantPlan?: string
  userLimit?: number
  billAmount?: number
  billStatus?: "paid" | "unpaid" | "overdue"
  expireDate?: string
}

// ==================== Mock数据 ====================
const stores: Store[] = [
  { id: "ST001", name: "南山科技园旗舰店", type: "direct", address: "深圳市南山区科技园科苑路xxx号", phone: "0755-86001234", manager: "张经理", managerPhone: "138****5678", licenseNo: "91440300****1234", employeeCount: 25, monthlyRevenue: 385000, status: "active", createdAt: "2023-03-15" },
  { id: "ST002", name: "福田CBD体验店", type: "direct", address: "深圳市福田区福华三路xxx大厦", phone: "0755-83005678", manager: "李经理", managerPhone: "139****1234", licenseNo: "91440300****5678", employeeCount: 18, monthlyRevenue: 268000, status: "active", createdAt: "2023-06-20" },
  { id: "ST003", name: "罗湖翠竹社区店", type: "direct", address: "深圳市罗湖区翠竹路xxx号", phone: "0755-82009876", manager: "王经理", managerPhone: "137****9876", licenseNo: "91440300****9876", employeeCount: 12, monthlyRevenue: 156000, status: "active", createdAt: "2024-01-10" },
  { id: "ST004", name: "温馨家政服务公司", type: "tenant", address: "深圳市宝安区西乡街道xxx楼", phone: "0755-29001111", manager: "赵总", managerPhone: "135****5555", licenseNo: "91440306****1111", employeeCount: 8, monthlyRevenue: 120000, status: "active", createdAt: "2024-06-01", companyName: "深圳市温馨家政服务有限公司", tenantPlan: "标准版", userLimit: 20, billAmount: 2980, billStatus: "paid", expireDate: "2026-06-01" },
  { id: "ST005", name: "爱心月嫂服务中心", type: "tenant", address: "深圳市龙华区民治街道xxx座", phone: "0755-28002222", manager: "孙总", managerPhone: "136****6666", licenseNo: "91440311****2222", employeeCount: 15, monthlyRevenue: 198000, status: "active", createdAt: "2024-09-15", companyName: "深圳市爱心月嫂服务有限公司", tenantPlan: "专业版", userLimit: 50, billAmount: 5980, billStatus: "paid", expireDate: "2026-09-15" },
  { id: "ST006", name: "好孕家政", type: "tenant", address: "东莞市南城区xxx路", phone: "0769-22003333", manager: "周总", managerPhone: "133****7777", licenseNo: "91441900****3333", employeeCount: 6, monthlyRevenue: 0, status: "pending", createdAt: "2025-02-10", companyName: "东莞市好孕家政服务有限公司", tenantPlan: "基础版", userLimit: 10, billAmount: 1280, billStatus: "unpaid", expireDate: "2026-02-10" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "运营中", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactive: { label: "已停用", className: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
}

// ==================== 新增门店弹窗 ====================
function AddStoreDialog({ open, onOpenChange, type }: { open: boolean; onOpenChange: (v: boolean) => void; type: "direct" | "tenant" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base">{type === "direct" ? "新增直营门店" : "新增租户"}</DialogTitle>
          <DialogDescription className="text-xs">
            {type === "direct" ? "创建新的直营门店，配置基础信息和负责人" : "注册新租户，配置企业资质和计费信息"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{type === "direct" ? "门店名称" : "租户名称"}</Label>
              <Input placeholder={type === "direct" ? "如: 南山旗舰店" : "如: 温馨家政服务公司"} className="h-9" />
            </div>
            {type === "tenant" && (
              <div className="space-y-1.5">
                <Label className="text-xs">企业全称</Label>
                <Input placeholder="营业执照上的企业名称" className="h-9" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">负责人</Label>
              <Input placeholder="姓名" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">负责人电话</Label>
              <Input placeholder="手机号" className="h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">地址</Label>
            <Input placeholder="详细地址" className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">联系电话</Label>
              <Input placeholder="座机或手机" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">营业执照号</Label>
              <Input placeholder="统一社会信用代码" className="h-9" />
            </div>
          </div>
          {type === "tenant" && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">套餐版本</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">基础版 (¥1,280/年)</SelectItem>
                      <SelectItem value="standard">标准版 (¥2,980/年)</SelectItem>
                      <SelectItem value="professional">专业版 (¥5,980/年)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">用户数上限</Label>
                  <Input type="number" defaultValue={20} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">有效期(年)</Label>
                  <Input type="number" defaultValue={1} className="h-9" />
                </div>
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">备注</Label>
            <Textarea placeholder="备注信息..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onOpenChange(false)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 页面组件 ====================
export default function StoreManagementPage() {
  const [search, setSearch] = useState("")
  const [addDirectOpen, setAddDirectOpen] = useState(false)
  const [addTenantOpen, setAddTenantOpen] = useState(false)
  const [detailStore, setDetailStore] = useState<Store | null>(null)

  const directStores = useMemo(() => stores.filter(s => s.type === "direct" && (!search || s.name.includes(search) || s.manager.includes(search))), [search])
  const tenantStores = useMemo(() => stores.filter(s => s.type === "tenant" && (!search || s.name.includes(search) || s.manager.includes(search) || (s.companyName || "").includes(search))), [search])

  const stats = useMemo(() => ({
    directCount: stores.filter(s => s.type === "direct").length,
    tenantCount: stores.filter(s => s.type === "tenant").length,
    totalEmployees: stores.reduce((s, st) => s + st.employeeCount, 0),
    totalRevenue: stores.filter(s => s.status === "active").reduce((s, st) => s + st.monthlyRevenue, 0),
    pendingTenants: stores.filter(s => s.type === "tenant" && s.status === "pending").length,
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">门店管理</h1>
            <p className="text-muted-foreground">管理直营门店与租户，支持多门店独立运营</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索门店/负责人..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">直营店</p><p className="text-xl font-bold">{stats.directCount}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><Globe className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-xs text-muted-foreground">租户</p><p className="text-xl font-bold text-blue-600">{stats.tenantCount}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center"><Users className="h-5 w-5 text-violet-600" /></div>
              <div><p className="text-xs text-muted-foreground">总人数</p><p className="text-xl font-bold text-violet-600">{stats.totalEmployees}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">月总营收</p><p className="text-xl font-bold text-emerald-600">¥{(stats.totalRevenue / 10000).toFixed(1)}万</p></div>
            </div>
          </Card>
          {stats.pendingTenants > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
                <div><p className="text-xs text-muted-foreground">待审核租户</p><p className="text-xl font-bold text-amber-600">{stats.pendingTenants}</p></div>
              </div>
            </Card>
          )}
        </div>

        <Tabs defaultValue="direct">
          <TabsList>
            <TabsTrigger value="direct">直营门店 ({directStores.length})</TabsTrigger>
            <TabsTrigger value="tenant">租户管理 ({tenantStores.length})</TabsTrigger>
          </TabsList>

          {/* ========== 直营门店 ========== */}
          <TabsContent value="direct" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddDirectOpen(true)}><Plus className="h-4 w-4 mr-2" />新增直营店</Button>
            </div>
            <div className="grid gap-4">
              {directStores.map(store => (
                <Card key={store.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{store.name}</h3>
                          <Badge variant="outline" className={cn("text-[10px]", statusConfig[store.status].className)}>{statusConfig[store.status].label}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{store.address}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{store.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                          <span>负责人: <span className="text-foreground font-medium">{store.manager}</span></span>
                          <span>员工: <span className="text-foreground font-medium">{store.employeeCount}人</span></span>
                          <span>月营收: <span className="text-primary font-medium">¥{store.monthlyRevenue.toLocaleString()}</span></span>
                          <span>开业: {store.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailStore(store)}><Eye className="h-3.5 w-3.5 mr-2" />查看详情</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />编辑信息</DropdownMenuItem>
                        <DropdownMenuItem><Users className="h-3.5 w-3.5 mr-2" />人员配置</DropdownMenuItem>
                        <DropdownMenuItem><BarChart3 className="h-3.5 w-3.5 mr-2" />业绩监控</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><XCircle className="h-3.5 w-3.5 mr-2" />停用门店</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ========== 租户管理 ========== */}
          <TabsContent value="tenant" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddTenantOpen(true)}><Plus className="h-4 w-4 mr-2" />新增租户</Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>租户名称</TableHead>
                      <TableHead>企业名称</TableHead>
                      <TableHead className="w-20">负责人</TableHead>
                      <TableHead className="w-20">套餐</TableHead>
                      <TableHead className="w-20">用户数</TableHead>
                      <TableHead className="w-24">月费/年费</TableHead>
                      <TableHead className="w-20">缴费</TableHead>
                      <TableHead className="w-24">到期日</TableHead>
                      <TableHead className="w-20">状态</TableHead>
                      <TableHead className="w-16 text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenantStores.map(store => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium text-sm">{store.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{store.companyName}</TableCell>
                        <TableCell className="text-sm">{store.manager}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{store.tenantPlan}</Badge></TableCell>
                        <TableCell className="text-sm">{store.employeeCount}/{store.userLimit}</TableCell>
                        <TableCell className="text-sm font-medium">¥{store.billAmount?.toLocaleString()}/年</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px]",
                            store.billStatus === "paid" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            store.billStatus === "overdue" ? "bg-red-100 text-red-700 border-red-200" :
                            "bg-amber-100 text-amber-700 border-amber-200"
                          )}>
                            {store.billStatus === "paid" ? "已缴" : store.billStatus === "overdue" ? "逾期" : "未缴"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{store.expireDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px]", statusConfig[store.status].className)}>{statusConfig[store.status].label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetailStore(store)}><Eye className="h-3.5 w-3.5 mr-2" />查看详情</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />编辑信息</DropdownMenuItem>
                              {store.status === "pending" && (<DropdownMenuItem><CheckCircle2 className="h-3.5 w-3.5 mr-2" />审核通过</DropdownMenuItem>)}
                              <DropdownMenuItem><Key className="h-3.5 w-3.5 mr-2" />权限配置</DropdownMenuItem>
                              <DropdownMenuItem><CreditCard className="h-3.5 w-3.5 mr-2" />计费管理</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600"><XCircle className="h-3.5 w-3.5 mr-2" />停用租户</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <AddStoreDialog open={addDirectOpen} onOpenChange={setAddDirectOpen} type="direct" />
        <AddStoreDialog open={addTenantOpen} onOpenChange={setAddTenantOpen} type="tenant" />

        {/* 详情弹窗 */}
        <Dialog open={!!detailStore} onOpenChange={(o) => !o && setDetailStore(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base">{detailStore?.type === "direct" ? "直营店详情" : "租户详情"}</DialogTitle>
            </DialogHeader>
            {detailStore && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">名称：</span><span className="font-medium">{detailStore.name}</span></div>
                  <div><span className="text-muted-foreground">状态：</span><Badge variant="outline" className={cn("text-xs ml-1", statusConfig[detailStore.status].className)}>{statusConfig[detailStore.status].label}</Badge></div>
                  {detailStore.companyName && <div className="col-span-2"><span className="text-muted-foreground">企业名称：</span>{detailStore.companyName}</div>}
                  <div className="col-span-2"><span className="text-muted-foreground">地址：</span>{detailStore.address}</div>
                  <div><span className="text-muted-foreground">电话：</span>{detailStore.phone}</div>
                  <div><span className="text-muted-foreground">营业执照：</span><span className="font-mono text-xs">{detailStore.licenseNo}</span></div>
                  <div><span className="text-muted-foreground">负责人：</span>{detailStore.manager}</div>
                  <div><span className="text-muted-foreground">员工数：</span>{detailStore.employeeCount}人</div>
                  <div><span className="text-muted-foreground">月营收：</span><span className="font-medium text-primary">¥{detailStore.monthlyRevenue.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">创建日期：</span>{detailStore.createdAt}</div>
                  {detailStore.type === "tenant" && (
                    <>
                      <div><span className="text-muted-foreground">套餐版本：</span>{detailStore.tenantPlan}</div>
                      <div><span className="text-muted-foreground">用户限额：</span>{detailStore.userLimit}人</div>
                      <div><span className="text-muted-foreground">年费：</span>¥{detailStore.billAmount?.toLocaleString()}</div>
                      <div><span className="text-muted-foreground">到期日：</span>{detailStore.expireDate}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
