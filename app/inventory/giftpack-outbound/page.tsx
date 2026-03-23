"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Gift, CheckCircle2, Clock, Package, Eye, Banknote } from "lucide-react"

interface GiftPackOutbound {
  id: string
  outboundNo: string
  staffName: string
  staffType: string
  customerName: string
  orderNo: string
  items: { name: string; quantity: number; unit: string; price: number }[]
  totalFee: number
  feePaid: boolean
  status: "auto_generated" | "approved" | "collected" | "completed"
  generatedAt: string
  approvedAt?: string
  approvedBy?: string
  collectedAt?: string
}

const mockData: GiftPackOutbound[] = [
  { id: "GP001", outboundNo: "LB-2025-0001", staffName: "李春华", staffType: "月嫂", customerName: "张女士", orderNo: "FW-2025-0012", items: [{ name: "婴儿纱布浴巾", quantity: 2, unit: "条", price: 35 }, { name: "新生儿帽子", quantity: 2, unit: "顶", price: 15 }, { name: "婴儿湿巾", quantity: 3, unit: "包", price: 12 }, { name: "月子餐调料包", quantity: 1, unit: "套", price: 68 }], totalFee: 184, feePaid: true, status: "completed", generatedAt: "2025-01-18 08:00", approvedAt: "2025-01-18 09:30", approvedBy: "周顾问", collectedAt: "2025-01-18 14:00" },
  { id: "GP002", outboundNo: "LB-2025-0002", staffName: "王美玲", staffType: "育婴师", customerName: "李女士", orderNo: "FW-2025-0015", items: [{ name: "婴儿纱布浴巾", quantity: 2, unit: "条", price: 35 }, { name: "玩具礼盒", quantity: 1, unit: "套", price: 88 }], totalFee: 158, feePaid: false, status: "approved", generatedAt: "2025-01-22 08:00", approvedAt: "2025-01-22 10:00", approvedBy: "孙顾问" },
  { id: "GP003", outboundNo: "LB-2025-0003", staffName: "陈兰", staffType: "月嫂", customerName: "赵女士", orderNo: "FW-2025-0018", items: [{ name: "婴儿纱布浴巾", quantity: 2, unit: "条", price: 35 }, { name: "新生儿帽子", quantity: 2, unit: "顶", price: 15 }], totalFee: 100, feePaid: false, status: "auto_generated", generatedAt: "2025-01-23 08:00" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  auto_generated: { label: "待审核", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "已审核", className: "bg-blue-100 text-blue-700 border-blue-200" },
  collected: { label: "已领取", className: "bg-teal-100 text-teal-700 border-teal-200" },
  completed: { label: "已完成", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function GiftPackOutboundPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GiftPackOutbound | null>(null)

  const filtered = mockData.filter(item => {
    const matchSearch = !search || item.staffName.includes(search) || item.outboundNo.includes(search) || item.customerName.includes(search)
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">礼包出库</h1>
            <p className="text-sm text-muted-foreground mt-0.5">管理家政员上户礼包出库单，系统根据订单自动生成</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-4 w-4 text-amber-600" /></div>
                <div><p className="text-xs text-muted-foreground">待审核</p><p className="text-lg font-bold text-amber-600">{mockData.filter(i => i.status === "auto_generated").length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-blue-600" /></div>
                <div><p className="text-xs text-muted-foreground">待领取</p><p className="text-lg font-bold text-blue-600">{mockData.filter(i => i.status === "approved").length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center"><Package className="h-4 w-4 text-emerald-600" /></div>
                <div><p className="text-xs text-muted-foreground">本月出库</p><p className="text-lg font-bold">{mockData.length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center"><Banknote className="h-4 w-4 text-rose-600" /></div>
                <div><p className="text-xs text-muted-foreground">待缴费</p><p className="text-lg font-bold text-rose-600">{mockData.filter(i => !i.feePaid && i.status !== "auto_generated").length}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索家政员/客户/出库单号..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="auto_generated">待审核</SelectItem>
                  <SelectItem value="approved">已审核</SelectItem>
                  <SelectItem value="collected">已领取</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
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
                  <TableHead className="text-xs">出库单号</TableHead>
                  <TableHead className="text-xs">家政员</TableHead>
                  <TableHead className="text-xs">类型</TableHead>
                  <TableHead className="text-xs">客户</TableHead>
                  <TableHead className="text-xs">关联订单</TableHead>
                  <TableHead className="text-xs text-right">费用</TableHead>
                  <TableHead className="text-xs text-center">缴费</TableHead>
                  <TableHead className="text-xs text-center">状态</TableHead>
                  <TableHead className="text-xs text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs font-mono">{item.outboundNo}</TableCell>
                    <TableCell className="text-xs font-medium">{item.staffName}</TableCell>
                    <TableCell className="text-xs">{item.staffType}</TableCell>
                    <TableCell className="text-xs">{item.customerName}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.orderNo}</TableCell>
                    <TableCell className="text-xs text-right font-medium">¥{item.totalFee}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${item.feePaid ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                        {item.feePaid ? "已缴" : "未缴"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[item.status].className}`}>{statusConfig[item.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => { setSelectedItem(item); setDetailOpen(true) }}>
                          <Eye className="h-3 w-3 mr-1" />详情
                        </Button>
                        {item.status === "auto_generated" && (
                          <Button size="sm" className="h-7 px-2 text-xs">审核</Button>
                        )}
                        {item.status === "approved" && !item.feePaid && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-transparent">确认缴费</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Gift className="h-4 w-4 text-primary" />
                礼包出库单详情
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs">单号</span><p className="font-mono text-xs mt-0.5">{selectedItem.outboundNo}</p></div>
                  <div><span className="text-muted-foreground text-xs">状态</span><p className="mt-0.5"><Badge variant="outline" className={`text-[10px] ${statusConfig[selectedItem.status].className}`}>{statusConfig[selectedItem.status].label}</Badge></p></div>
                  <div><span className="text-muted-foreground text-xs">家政员</span><p className="text-xs mt-0.5">{selectedItem.staffName} ({selectedItem.staffType})</p></div>
                  <div><span className="text-muted-foreground text-xs">客户</span><p className="text-xs mt-0.5">{selectedItem.customerName}</p></div>
                  <div><span className="text-muted-foreground text-xs">关联订单</span><p className="text-xs font-mono mt-0.5">{selectedItem.orderNo}</p></div>
                  <div><span className="text-muted-foreground text-xs">生成时间</span><p className="text-xs mt-0.5">{selectedItem.generatedAt}</p></div>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-2">礼包清单</h4>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs">物品名称</TableHead>
                          <TableHead className="text-xs text-center">数量</TableHead>
                          <TableHead className="text-xs text-right">单价</TableHead>
                          <TableHead className="text-xs text-right">小计</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItem.items.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs">{item.name}</TableCell>
                            <TableCell className="text-xs text-center">{item.quantity}{item.unit}</TableCell>
                            <TableCell className="text-xs text-right">¥{item.price}</TableCell>
                            <TableCell className="text-xs text-right font-medium">¥{item.price * item.quantity}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/20">
                          <TableCell colSpan={3} className="text-xs font-medium text-right">合计</TableCell>
                          <TableCell className="text-xs font-bold text-right text-primary">¥{selectedItem.totalFee}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground">缴费状态</span>
                  <Badge variant="outline" className={`text-[10px] ${selectedItem.feePaid ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {selectedItem.feePaid ? "已缴纳" : "待缴纳"}
                  </Badge>
                </div>
                {selectedItem.approvedAt && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">审核时间</span><p className="mt-0.5">{selectedItem.approvedAt}</p></div>
                    <div><span className="text-muted-foreground">审核人</span><p className="mt-0.5">{selectedItem.approvedBy}</p></div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" size="sm" onClick={() => setDetailOpen(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
