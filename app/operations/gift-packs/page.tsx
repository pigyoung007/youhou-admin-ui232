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
import { Separator } from "@/components/ui/separator"
import {
  Search, Gift, Package, CheckCircle2, Clock, AlertCircle, XCircle,
  Download, Eye, MoreHorizontal, FileText, Calendar, User, Plus, Banknote,
  Printer, ArrowDownToLine, Settings, Truck, Home
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================
interface GiftPackOutbound {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  staffName: string
  staffType: string
  serviceStartDate: string
  serviceAddress: string
  consultantName: string
  items: { name: string; quantity: number; unit: string; price: number }[]
  totalFee: number
  feeStatus: "unpaid" | "paid"
  status: "auto_generated" | "pending_review" | "approved" | "collected" | "cancelled"
  generatedAt: string
  reviewedAt: string | null
  collectedAt: string | null
  reviewerName: string
  note: string
}

interface GiftPackConfig {
  id: string
  name: string
  serviceType: string
  items: { name: string; quantity: number; unit: string; price: number }[]
  totalPrice: number
  status: "active" | "inactive"
}

// ==================== Mock数据 ====================
const outboundRecords: GiftPackOutbound[] = [
  {
    id: "GP-20250201001", orderId: "SO-20250115001", customerName: "张女士", customerPhone: "138****5678",
    staffName: "李春华", staffType: "月嫂", serviceStartDate: "2025-02-15", serviceAddress: "南山区科技园xxx小区",
    consultantName: "周顾问",
    items: [
      { name: "新生儿包被", quantity: 1, unit: "条", price: 128 },
      { name: "产妇护理包", quantity: 1, unit: "套", price: 89 },
      { name: "婴儿洗护套装", quantity: 1, unit: "套", price: 68 },
      { name: "月子帽", quantity: 1, unit: "顶", price: 35 },
    ],
    totalFee: 320, feeStatus: "paid",
    status: "collected", generatedAt: "2025-02-13 09:00", reviewedAt: "2025-02-13 10:30",
    collectedAt: "2025-02-14 14:00", reviewerName: "王库管", note: "家政员已领取并缴费"
  },
  {
    id: "GP-20250201002", orderId: "SO-20250120003", customerName: "李女士", customerPhone: "139****1234",
    staffName: "王秀兰", staffType: "育婴师", serviceStartDate: "2025-02-18", serviceAddress: "福田区华府xxx花园",
    consultantName: "孙顾问",
    items: [
      { name: "婴幼儿玩具礼盒", quantity: 1, unit: "套", price: 98 },
      { name: "育婴工具包", quantity: 1, unit: "套", price: 156 },
    ],
    totalFee: 254, feeStatus: "unpaid",
    status: "approved", generatedAt: "2025-02-16 09:00", reviewedAt: "2025-02-16 11:00",
    collectedAt: null, reviewerName: "王库管", note: ""
  },
  {
    id: "GP-20250201003", orderId: "SO-20250125005", customerName: "王女士", customerPhone: "137****9876",
    staffName: "张美玲", staffType: "月嫂", serviceStartDate: "2025-02-22", serviceAddress: "罗湖区翠竹xxx花园",
    consultantName: "周顾问",
    items: [
      { name: "新生儿包被", quantity: 1, unit: "条", price: 128 },
      { name: "产妇护理包", quantity: 1, unit: "套", price: 89 },
      { name: "婴儿洗护套装", quantity: 1, unit: "套", price: 68 },
      { name: "月子帽", quantity: 1, unit: "顶", price: 35 },
    ],
    totalFee: 320, feeStatus: "unpaid",
    status: "pending_review", generatedAt: "2025-02-20 09:00", reviewedAt: null,
    collectedAt: null, reviewerName: "", note: ""
  },
  {
    id: "GP-20250201004", orderId: "SO-20250128006", customerName: "赵女士", customerPhone: "135****5555",
    staffName: "陈桂芳", staffType: "月嫂", serviceStartDate: "2025-02-25", serviceAddress: "宝安区西乡xxx府",
    consultantName: "孙顾问",
    items: [
      { name: "新生儿包被", quantity: 1, unit: "条", price: 128 },
      { name: "产妇护理包", quantity: 1, unit: "套", price: 89 },
      { name: "婴儿洗护套装", quantity: 1, unit: "套", price: 68 },
      { name: "月子帽", quantity: 1, unit: "顶", price: 35 },
    ],
    totalFee: 320, feeStatus: "unpaid",
    status: "auto_generated", generatedAt: "2025-02-23 09:00", reviewedAt: null,
    collectedAt: null, reviewerName: "", note: ""
  },
]

const giftPackConfigs: GiftPackConfig[] = [
  { id: "GPC001", name: "月嫂上户礼包", serviceType: "月嫂服务", items: [{ name: "新生儿包被", quantity: 1, unit: "条", price: 128 }, { name: "产妇护理包", quantity: 1, unit: "套", price: 89 }, { name: "婴儿洗护套装", quantity: 1, unit: "套", price: 68 }, { name: "月子帽", quantity: 1, unit: "顶", price: 35 }], totalPrice: 320, status: "active" },
  { id: "GPC002", name: "育婴师上户礼包", serviceType: "育婴师服务", items: [{ name: "婴幼儿玩具礼盒", quantity: 1, unit: "套", price: 98 }, { name: "育婴工具包", quantity: 1, unit: "套", price: 156 }], totalPrice: 254, status: "active" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  auto_generated: { label: "系统生成", className: "bg-slate-100 text-slate-700 border-slate-200" },
  pending_review: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200" },
  collected: { label: "已领取", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-700 border-red-200" },
}

// ==================== 页面组件 ====================
export default function GiftPackPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailRecord, setDetailRecord] = useState<GiftPackOutbound | null>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  const filteredRecords = useMemo(() => {
    return outboundRecords.filter(r => {
      const matchSearch = !search || r.customerName.includes(search) || r.staffName.includes(search) || r.id.includes(search)
      const matchStatus = statusFilter === "all" || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    total: outboundRecords.length,
    pending: outboundRecords.filter(r => r.status === "auto_generated" || r.status === "pending_review").length,
    approved: outboundRecords.filter(r => r.status === "approved").length,
    collected: outboundRecords.filter(r => r.status === "collected").length,
    unpaidFee: outboundRecords.filter(r => r.feeStatus === "unpaid" && r.status !== "cancelled").reduce((s, r) => s + r.totalFee, 0),
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">上户礼包领取</h1>
            <p className="text-muted-foreground">家政员初次上户前，系统自动生成上户礼包出库单，领取时需缴纳相关费用</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent" onClick={() => setConfigDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              礼包配置
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Gift className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">出库单总数</p><p className="text-xl font-bold">{stats.total}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-xs text-muted-foreground">待处理</p><p className="text-xl font-bold text-amber-600">{stats.pending}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-xs text-muted-foreground">已审核</p><p className="text-xl font-bold text-blue-600">{stats.approved}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Package className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">已领取</p><p className="text-xl font-bold text-emerald-600">{stats.collected}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center"><Banknote className="h-5 w-5 text-red-600" /></div>
              <div><p className="text-xs text-muted-foreground">待收费用</p><p className="text-xl font-bold text-red-600">¥{stats.unpaidFee.toLocaleString()}</p></div>
            </div>
          </Card>
        </div>

        {/* 筛选 */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索客户/家政员/出库单号..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="auto_generated">系统生成</SelectItem>
                <SelectItem value="pending_review">待审核</SelectItem>
                <SelectItem value="approved">已审核</SelectItem>
                <SelectItem value="collected">已领取</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* 出库单列表 */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">出库单号</TableHead>
                  <TableHead>客户/地址</TableHead>
                  <TableHead>家政员</TableHead>
                  <TableHead className="w-24">上户日期</TableHead>
                  <TableHead>礼包内容</TableHead>
                  <TableHead className="w-20 text-right">费用</TableHead>
                  <TableHead className="w-20">缴费</TableHead>
                  <TableHead className="w-20">状态</TableHead>
                  <TableHead className="w-16 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => {
                  const st = statusConfig[record.status]
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{record.id}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{record.customerName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">{record.serviceAddress}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{record.staffName[0]}</AvatarFallback></Avatar>
                          <div>
                            <div className="text-sm">{record.staffName}</div>
                            <div className="text-xs text-muted-foreground">{record.staffType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.serviceStartDate}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.items.slice(0, 3).map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{item.name}</Badge>
                          ))}
                          {record.items.length > 3 && <Badge variant="secondary" className="text-[10px]">+{record.items.length - 3}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">¥{record.totalFee}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", record.feeStatus === "paid" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200")}>
                          {record.feeStatus === "paid" ? "已缴" : "未缴"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", st.className)}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailRecord(record)}><Eye className="h-3.5 w-3.5 mr-2" />查看详情</DropdownMenuItem>
                            {(record.status === "auto_generated" || record.status === "pending_review") && (
                              <DropdownMenuItem><CheckCircle2 className="h-3.5 w-3.5 mr-2" />审核通过</DropdownMenuItem>
                            )}
                            {record.status === "approved" && (
                              <DropdownMenuItem><Package className="h-3.5 w-3.5 mr-2" />确认领取</DropdownMenuItem>
                            )}
                            {record.feeStatus === "unpaid" && record.status !== "cancelled" && (
                              <DropdownMenuItem><Banknote className="h-3.5 w-3.5 mr-2" />确认缴费</DropdownMenuItem>
                            )}
                            <DropdownMenuItem><Printer className="h-3.5 w-3.5 mr-2" />打印出库单</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 详情弹窗 */}
        <Dialog open={!!detailRecord} onOpenChange={(o) => !o && setDetailRecord(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base">上户礼包出库单详情</DialogTitle>
              <DialogDescription className="text-xs">单号: {detailRecord?.id}</DialogDescription>
            </DialogHeader>
            {detailRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">关联订单：</span><span className="font-mono text-xs">{detailRecord.orderId}</span></div>
                  <div><span className="text-muted-foreground">客户：</span><span className="font-medium">{detailRecord.customerName}</span></div>
                  <div><span className="text-muted-foreground">家政员：</span>{detailRecord.staffName} ({detailRecord.staffType})</div>
                  <div><span className="text-muted-foreground">上户日期：</span>{detailRecord.serviceStartDate}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">服务地址：</span>{detailRecord.serviceAddress}</div>
                  <div><span className="text-muted-foreground">顾问：</span>{detailRecord.consultantName}</div>
                  <div><span className="text-muted-foreground">生成时间：</span>{detailRecord.generatedAt}</div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium mb-2 block">礼包清单</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">物品</TableHead>
                        <TableHead className="text-xs w-14">数量</TableHead>
                        <TableHead className="text-xs w-14">单位</TableHead>
                        <TableHead className="text-xs w-16 text-right">单价</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailRecord.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{item.name}</TableCell>
                          <TableCell className="text-sm">{item.quantity}</TableCell>
                          <TableCell className="text-sm">{item.unit}</TableCell>
                          <TableCell className="text-sm text-right">¥{item.price}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-sm font-medium text-right">合计</TableCell>
                        <TableCell className="text-sm font-bold text-right text-primary">¥{detailRecord.totalFee}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">缴费状态：</span>
                    <Badge variant="outline" className={cn("text-xs ml-1", detailRecord.feeStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                      {detailRecord.feeStatus === "paid" ? "已缴费" : "未缴费"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">出库状态：</span>
                    <Badge variant="outline" className={cn("text-xs ml-1", statusConfig[detailRecord.status].className)}>
                      {statusConfig[detailRecord.status].label}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  流程说明：家政员首次上户前，系统自动生成上户礼包出库单并提交 &rarr; 顾问/库管审核确认 &rarr; 家政员到库管处领取礼包并缴纳费用 &rarr; 库管确认领取完成。
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 礼包配置弹窗 */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base">上户礼包配置</DialogTitle>
              <DialogDescription className="text-xs">配置各服务类型对应的上户礼包内容，系统将按此配置自动生成出库单</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {giftPackConfigs.map(cfg => (
                <Card key={cfg.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{cfg.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{cfg.serviceType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[10px]", cfg.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "")}>
                        {cfg.status === "active" ? "启用" : "停用"}
                      </Badge>
                      <span className="text-sm font-bold text-primary">¥{cfg.totalPrice}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cfg.items.map((item, i) => (
                      <div key={i} className="text-xs px-2 py-1 rounded bg-muted/50 border">
                        {item.name} x{item.quantity}{item.unit} <span className="text-muted-foreground">(¥{item.price})</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setConfigDialogOpen(false)}>关闭</Button>
              <Button><Plus className="h-4 w-4 mr-2" />新增礼包配置</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
