"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Download, Eye, Package, Truck, CheckCircle, Clock,
  User, Calendar, FileText, Gift, ShoppingBag, Link2, QrCode, Upload
} from "lucide-react"

// ==================== 类型定义 ====================

// 物料类型
type MaterialType = "service_material" | "visit_gift" | "marketing_gift"
const materialTypeConfig: Record<MaterialType, { label: string; color: string; icon: React.ElementType }> = {
  service_material: { label: "上户物料", color: "bg-blue-100 text-blue-700", icon: Package },
  visit_gift: { label: "回访礼品", color: "bg-purple-100 text-purple-700", icon: Gift },
  marketing_gift: { label: "营销礼包", color: "bg-orange-100 text-orange-700", icon: ShoppingBag },
}

// 出库状态
type OutboundStatus = "pending" | "confirmed" | "issued"
const statusConfig: Record<OutboundStatus, { label: string; color: string }> = {
  pending: { label: "待确认", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "已确认", color: "bg-blue-100 text-blue-700" },
  issued: { label: "已领取", color: "bg-green-100 text-green-700" },
}

// 物料项
interface MaterialItem {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  isFree: boolean
}

// 出库单
interface OutboundOrder {
  id: string
  orderNo: string
  type: MaterialType
  relatedOrderNo: string
  relatedOrderId: string
  // 上户物料：家政员信息
  staffId?: string
  staffName?: string
  staffType?: string
  // 回访礼品/营销礼包：顾问信息
  counselorId?: string
  counselorName?: string
  // 客户信息
  customerName: string
  customerPhone?: string
  serviceAddress?: string
  // 物料
  items: MaterialItem[]
  totalAmount: number
  // 状态
  status: OutboundStatus
  paymentStatus: "free" | "unpaid" | "paid"
  paymentMethod?: "offline" | "online"
  paymentVoucher?: string
  // 审核与发放
  createdBy: string
  warehouseConfirmedBy?: string
  warehouseConfirmedAt?: string
  issuedBy?: string
  issuedAt?: string
  notes?: string
  createTime: string
}

// ==================== Mock数据 ====================

// 上户物料配置
const serviceMaterialCatalog = [
  { id: "sm1", name: "工作服（夏装）", price: 80, unit: "套" },
  { id: "sm2", name: "工作服（冬装）", price: 120, unit: "套" },
  { id: "sm3", name: "工作鞋", price: 50, unit: "双" },
  { id: "sm4", name: "护理帽", price: 15, unit: "个" },
  { id: "sm5", name: "口罩（50只装）", price: 25, unit: "盒" },
  { id: "sm6", name: "一次性手套", price: 20, unit: "盒" },
  { id: "sm7", name: "服务手册", price: 0, unit: "本", isFree: true },
]

// 回访礼品配置
const visitGiftCatalog = [
  { id: "vg1", name: "婴儿用品礼盒", price: 0, unit: "套", isFree: true },
  { id: "vg2", name: "产妇营养品", price: 0, unit: "份", isFree: true },
  { id: "vg3", name: "新生儿纪念册", price: 0, unit: "本", isFree: true },
  { id: "vg4", name: "满月蛋糕券", price: 0, unit: "张", isFree: true },
]

// 营销礼包配置
const marketingGiftCatalog = [
  { id: "mg1", name: "新客户礼包", price: 0, unit: "套", isFree: true },
  { id: "mg2", name: "老客户转介绍礼品", price: 0, unit: "份", isFree: true },
  { id: "mg3", name: "节日促销礼盒", price: 0, unit: "套", isFree: true },
]

// Mock出库单数据
const mockOutbounds: OutboundOrder[] = [
  {
    id: "1",
    orderNo: "WL202603001",
    type: "service_material",
    relatedOrderNo: "DD202603001",
    relatedOrderId: "O001",
    staffId: "NY001",
    staffName: "李秀英",
    staffType: "月嫂",
    customerName: "张女士",
    serviceAddress: "宁夏银川市兴庆区解放西街168号国贸中心A座1201",
    items: [
      { id: "sm1", name: "工作服（夏装）", quantity: 2, unit: "套", price: 80, isFree: false },
      { id: "sm3", name: "工作鞋", quantity: 1, unit: "双", price: 50, isFree: false },
      { id: "sm7", name: "服务手册", quantity: 1, unit: "本", price: 0, isFree: true },
    ],
    totalAmount: 210,
    status: "issued",
    paymentStatus: "paid",
    paymentMethod: "online",
    createdBy: "系统自动",
    warehouseConfirmedBy: "仓管员小王",
    warehouseConfirmedAt: "2026-03-18 08:30",
    issuedBy: "仓管员小王",
    issuedAt: "2026-03-18 09:00",
    createTime: "2026-03-17 14:30",
  },
  {
    id: "2",
    orderNo: "WL202603002",
    type: "service_material",
    relatedOrderNo: "DD202603005",
    relatedOrderId: "O002",
    staffId: "YY001",
    staffName: "王秀芳",
    staffType: "育婴师",
    customerName: "李女士",
    serviceAddress: "宁夏银川市金凤区正源北街与贺兰山路交汇处万达广场3号楼2301",
    items: [
      { id: "sm1", name: "工作服（夏装）", quantity: 2, unit: "套", price: 80, isFree: false },
      { id: "sm7", name: "服务手册", quantity: 1, unit: "本", price: 0, isFree: true },
    ],
    totalAmount: 160,
    status: "pending",
    paymentStatus: "unpaid",
    createdBy: "系统自动",
    createTime: "2026-03-19 09:15",
  },
  {
    id: "3",
    orderNo: "WL202603003",
    type: "visit_gift",
    relatedOrderNo: "DD202603001",
    relatedOrderId: "O001",
    counselorId: "CS001",
    counselorName: "张顾问",
    customerName: "张女士",
    serviceAddress: "宁夏银川市兴庆区解放西街168号国贸中心A座1201",
    items: [
      { id: "vg1", name: "婴儿用品礼盒", quantity: 1, unit: "套", price: 0, isFree: true },
      { id: "vg3", name: "新生儿纪念册", quantity: 1, unit: "本", price: 0, isFree: true },
    ],
    totalAmount: 0,
    status: "confirmed",
    paymentStatus: "free",
    createdBy: "张顾问",
    warehouseConfirmedBy: "仓管员小李",
    warehouseConfirmedAt: "2026-03-20 10:00",
    createTime: "2026-03-20 09:00",
  },
  {
    id: "4",
    orderNo: "WL202603004",
    type: "marketing_gift",
    relatedOrderNo: "DD202603008",
    relatedOrderId: "O003",
    counselorId: "CS002",
    counselorName: "李顾问",
    customerName: "王女士",
    serviceAddress: "宁夏石嘴山市大武口区朝阳西街119号阳光城小区8栋501",
    items: [
      { id: "mg1", name: "新客户礼包", quantity: 1, unit: "套", price: 0, isFree: true },
    ],
    totalAmount: 0,
    status: "issued",
    paymentStatus: "free",
    createdBy: "李顾问",
    warehouseConfirmedBy: "仓管员小王",
    warehouseConfirmedAt: "2026-03-19 14:00",
    issuedBy: "李顾问",
    issuedAt: "2026-03-19 15:30",
    createTime: "2026-03-19 11:00",
  },
]

// ==================== 页面组件 ====================

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [issueOpen, setIssueOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OutboundOrder | null>(null)

  // 统计数据
  const stats = {
    total: mockOutbounds.length,
    pending: mockOutbounds.filter(o => o.status === "pending").length,
    confirmed: mockOutbounds.filter(o => o.status === "confirmed").length,
    issued: mockOutbounds.filter(o => o.status === "issued").length,
    serviceMaterial: mockOutbounds.filter(o => o.type === "service_material").length,
    visitGift: mockOutbounds.filter(o => o.type === "visit_gift").length,
    marketingGift: mockOutbounds.filter(o => o.type === "marketing_gift").length,
  }

  // 筛选
  const filteredOrders = mockOutbounds.filter(order => {
    if (searchTerm && !order.orderNo.includes(searchTerm) && 
        !(order.staffName?.includes(searchTerm)) && 
        !(order.counselorName?.includes(searchTerm)) &&
        !order.customerName.includes(searchTerm)) return false
    if (typeFilter !== "all" && order.type !== typeFilter) return false
    if (statusFilter !== "all" && order.status !== statusFilter) return false
    if (activeTab === "pending" && order.status !== "pending") return false
    if (activeTab === "confirmed" && order.status !== "confirmed") return false
    if (activeTab === "issued" && order.status !== "issued") return false
    return true
  })

  return (
    <AdminLayout title="上户物料领取">
      <div className="space-y-4">
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList>
                <TabsTrigger value="all">
                  全部
                  <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  待确认
                  {stats.pending > 0 && <Badge className="ml-1 bg-amber-100 text-amber-700">{stats.pending}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  已确认
                  {stats.confirmed > 0 && <Badge className="ml-1 bg-blue-100 text-blue-700">{stats.confirmed}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="issued">已领取</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />导出
                </Button>
                <Button size="sm" onClick={() => setConfigOpen(true)}>
                  <Link2 className="h-4 w-4 mr-1" />配置物料
                </Button>
              </div>
            </div>

            {/* 筛选栏 */}
            <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索单号/人员/客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="物料类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="service_material">上户物料</SelectItem>
                  <SelectItem value="visit_gift">回访礼品</SelectItem>
                  <SelectItem value="marketing_gift">营销礼包</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="issued">已领取</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">出库单号</TableHead>
                    <TableHead className="w-[100px]">物料类型</TableHead>
                    <TableHead className="w-[100px]">关联订单</TableHead>
                    <TableHead className="min-w-[120px]">领取人</TableHead>
                    <TableHead className="min-w-[120px]">客户/地址</TableHead>
                    <TableHead className="w-[150px]">物料清单</TableHead>
                    <TableHead className="w-[80px]">费用</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => {
                    const typeInfo = materialTypeConfig[order.type]
                    const TypeIcon = typeInfo.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.orderNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs gap-1", typeInfo.color)}>
                            <TypeIcon className="h-3 w-3" />
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-primary">{order.relatedOrderNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-primary/10">
                                {(order.staffName || order.counselorName || "?").slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{order.staffName || order.counselorName}</div>
                              <div className="text-xs text-muted-foreground">
                                {order.type === "service_material" ? order.staffType : "母婴顾问"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{order.customerName}</div>
                          {order.serviceAddress && (
                            <div className="text-xs text-muted-foreground truncate max-w-[180px]">{order.serviceAddress}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {order.items.slice(0, 2).map(item => (
                              <Badge key={item.id} variant="outline" className="text-xs">
                                {item.name}
                              </Badge>
                            ))}
                            {order.items.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{order.items.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.paymentStatus === "free" ? (
                            <span className="text-xs text-muted-foreground">免费</span>
                          ) : order.paymentStatus === "paid" ? (
                            <span className="text-xs text-green-600">¥{order.totalAmount}</span>
                          ) : (
                            <span className="text-xs text-amber-600">¥{order.totalAmount}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", statusConfig[order.status].color)}>
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => { setSelectedOrder(order); setDetailOpen(true) }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {order.status === "pending" && (
                              <>
                                {order.paymentStatus === "unpaid" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-amber-600"
                                    title="收款确认"
                                    onClick={() => { setSelectedOrder(order); setPaymentOpen(true) }}
                                  >
                                    <Upload className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-blue-600"
                                  title="库管确认"
                                  onClick={() => { setSelectedOrder(order); setConfirmOpen(true) }}
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                            {order.status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600"
                                title="确认领取"
                                onClick={() => { setSelectedOrder(order); setIssueOpen(true) }}
                              >
                                <Truck className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-50" />
                  <p>暂无物料记录</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* 详情对话框 */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                出库单详情
              </DialogTitle>
              <DialogDescription>{selectedOrder?.orderNo}</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", materialTypeConfig[selectedOrder.type].color)}>
                    {materialTypeConfig[selectedOrder.type].label}
                  </Badge>
                  <Badge className={cn("text-xs", statusConfig[selectedOrder.status].color)}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">关联订单：</span>
                    <span className="font-medium ml-1 text-primary">{selectedOrder.relatedOrderNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">领取人：</span>
                    <span className="font-medium ml-1">{selectedOrder.staffName || selectedOrder.counselorName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">客户：</span>
                    <span className="ml-1">{selectedOrder.customerName}</span>
                  </div>
                  {selectedOrder.serviceAddress && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">服务地址：</span>
                      <span className="ml-1">{selectedOrder.serviceAddress}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">创建人：</span>
                    <span className="ml-1">{selectedOrder.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">创建时间：</span>
                    <span className="ml-1">{selectedOrder.createTime}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">物料清单</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}{item.unit}</span>
                        </div>
                        <span>{item.isFree ? "免费" : `¥${item.price}`}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between text-sm">
                    <span className="font-medium">合计</span>
                    <span className="font-medium">
                      {selectedOrder.paymentStatus === "free" ? "免费" : `¥${selectedOrder.totalAmount}`}
                    </span>
                  </div>
                </div>

                {selectedOrder.warehouseConfirmedBy && (
                  <div className="text-xs text-muted-foreground">
                    库管确认：{selectedOrder.warehouseConfirmedBy}（{selectedOrder.warehouseConfirmedAt}）
                  </div>
                )}
                {selectedOrder.issuedBy && (
                  <div className="text-xs text-muted-foreground">
                    领取确认：{selectedOrder.issuedBy}（{selectedOrder.issuedAt}）
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-1" />打印
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 库管确认对话框 */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>库管确认</DialogTitle>
              <DialogDescription>
                确认出库单 {selectedOrder?.orderNo} 的物料准备完毕
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedOrder.staffName || selectedOrder.counselorName}</span>
                    <Badge variant="outline" className={cn("text-xs", materialTypeConfig[selectedOrder.type].color)}>
                      {materialTypeConfig[selectedOrder.type].label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <Checkbox defaultChecked />
                        <span>{item.name} x{item.quantity}{item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Textarea placeholder="如有问题请备注说明..." rows={2} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>取消</Button>
              <Button onClick={() => setConfirmOpen(false)}>
                <CheckCircle className="h-4 w-4 mr-1" />确认
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 领取确认对话框 */}
        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>确认领取</DialogTitle>
              <DialogDescription>
                {selectedOrder?.type === "marketing_gift" ? "顾问" : "家政员"}领取物料后点击确认
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="border rounded-lg p-3 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{selectedOrder.staffName || selectedOrder.counselorName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedOrder.items.map(i => `${i.name}x${i.quantity}`).join("、")}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  请确认已当面领取以上物料
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIssueOpen(false)}>取消</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIssueOpen(false)}>
                <Truck className="h-4 w-4 mr-1" />确认领取
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 收款确认对话框 */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>收款确认</DialogTitle>
              <DialogDescription>
                确认收款后可进行物料发放
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="border rounded-lg p-3 bg-amber-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{selectedOrder.staffName || selectedOrder.counselorName}</span>
                    <span className="text-lg font-bold text-amber-600">¥{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedOrder.items.map(i => `${i.name}x${i.quantity}`).join("、")}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>收款方式</Label>
                  <Select defaultValue="offline">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">线下收款</SelectItem>
                      <SelectItem value="online">在线支付</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>上传票据凭证</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">点击上传收款凭证</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentOpen(false)}>取消</Button>
              <Button onClick={() => setPaymentOpen(false)}>
                <CheckCircle className="h-4 w-4 mr-1" />确认收款
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 配置物料对话框 */}
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>配置物料并生成购买链接</DialogTitle>
              <DialogDescription>
                为家政员配置上户物料，生成购买链接后家政员支付
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>物料类型</Label>
                  <Select defaultValue="service_material">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service_material">上户物料</SelectItem>
                      <SelectItem value="visit_gift">回访礼品</SelectItem>
                      <SelectItem value="marketing_gift">营销礼包</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>关联订单</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择订单" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="o1">DD202603001 - 张女士</SelectItem>
                      <SelectItem value="o2">DD202603005 - 李女士</SelectItem>
                      <SelectItem value="o3">DD202603008 - 王女士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>选择家政员</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择家政员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">李秀英 - 月嫂</SelectItem>
                    <SelectItem value="s2">王秀芳 - 育婴师</SelectItem>
                    <SelectItem value="s3">张玉兰 - 月嫂</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>配置物料</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                  {serviceMaterialCatalog.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.isFree ? "免费" : `¥${item.price}/${item.unit}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">合计金额</span>
                <span className="text-lg font-bold text-primary">¥0</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigOpen(false)}>取消</Button>
              <Button>
                <QrCode className="h-4 w-4 mr-1" />生成购买链接
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
