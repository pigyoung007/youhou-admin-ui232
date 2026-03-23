"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Package, Plus, Search, Filter, Download, Printer, CheckCircle,
  Clock, AlertTriangle, User, Calendar, Box, Gift, BookOpen
} from "lucide-react"

// MOCK数据 - 物料清单
const suppliesList = [
  { id: "M001", name: "新生儿护理包", category: "礼包", unit: "套", stock: 45, price: 288 },
  { id: "M002", name: "月子餐食谱手册", category: "教材", unit: "本", stock: 120, price: 38 },
  { id: "M003", name: "产后恢复指南", category: "教材", unit: "本", stock: 98, price: 28 },
  { id: "M004", name: "婴儿抚触油", category: "用品", unit: "瓶", stock: 56, price: 68 },
  { id: "M005", name: "月嫂工作服(夏)", category: "服装", unit: "套", stock: 32, price: 128 },
  { id: "M006", name: "月嫂工作服(冬)", category: "服装", unit: "套", stock: 28, price: 168 },
  { id: "M007", name: "体温计(电子)", category: "用品", unit: "个", stock: 78, price: 45 },
  { id: "M008", name: "黄疸测试仪", category: "设备", unit: "台", stock: 12, price: 580 },
]

// MOCK数据 - 领取记录
const pickupRecords = [
  {
    id: "PK001",
    staffId: "S001",
    staffName: "王阿姨",
    staffType: "月嫂",
    orderId: "FSO2026031801",
    customerName: "张女士",
    items: [
      { id: "M001", name: "新生儿护理包", quantity: 1 },
      { id: "M002", name: "月子餐食谱手册", quantity: 1 },
      { id: "M005", name: "月嫂工作服(夏)", quantity: 2 },
    ],
    totalAmount: 582,
    status: "picked",
    pickupDate: "2026-03-19",
    operator: "库管员小李",
  },
  {
    id: "PK002",
    staffId: "S003",
    staffName: "张阿姨",
    staffType: "育婴师",
    orderId: "FSO2026031802",
    customerName: "李女士",
    items: [
      { id: "M003", name: "产后恢复指南", quantity: 1 },
      { id: "M004", name: "婴儿抚触油", quantity: 2 },
    ],
    totalAmount: 164,
    status: "pending",
    pickupDate: null,
    operator: null,
  },
  {
    id: "PK003",
    staffId: "S005",
    staffName: "陈技师",
    staffType: "产康技师",
    orderId: "FSO2026031803",
    customerName: "王女士",
    items: [
      { id: "M007", name: "体温计(电子)", quantity: 1 },
    ],
    totalAmount: 45,
    status: "picked",
    pickupDate: "2026-03-18",
    operator: "库管员小张",
  },
]

// MOCK数据 - 待领取订单
const pendingOrders = [
  { orderId: "FSO2026031804", staffName: "待分配", customerName: "赵女士", serviceType: "月嫂服务", startDate: "2026-04-05" },
  { orderId: "FSO2026031805", staffName: "周阿姨", customerName: "钱女士", serviceType: "育婴服务", startDate: "2026-04-10" },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending": { label: "待领取", color: "bg-amber-100 text-amber-700" },
  "picked": { label: "已领取", color: "bg-green-100 text-green-700" },
  "returned": { label: "已归还", color: "bg-blue-100 text-blue-700" },
}

const categoryConfig: Record<string, { label: string; icon: typeof Package }> = {
  "礼包": { label: "礼包", icon: Gift },
  "教材": { label: "教材", icon: BookOpen },
  "用品": { label: "用品", icon: Box },
  "服装": { label: "服装", icon: Package },
  "设备": { label: "设备", icon: Package },
}

export default function SuppliesPage() {
  const [activeTab, setActiveTab] = useState("records")
  const [searchTerm, setSearchTerm] = useState("")
  const [showPickupDialog, setShowPickupDialog] = useState(false)
  const [showInventoryDialog, setShowInventoryDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // 统计数据
  const stats = {
    totalRecords: pickupRecords.length,
    pendingPickup: pickupRecords.filter(r => r.status === "pending").length,
    pickedToday: pickupRecords.filter(r => r.pickupDate === "2026-03-19").length,
    lowStock: suppliesList.filter(s => s.stock < 20).length,
  }

  const filteredRecords = pickupRecords.filter(record => {
    if (searchTerm && !record.staffName.includes(searchTerm) && !record.customerName.includes(searchTerm)) return false
    return true
  })

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <AdminLayout title="上户物料领取">
      <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">管理家政员上户所需物料的领取和归还</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowInventoryDialog(true)}>
            <Package className="h-4 w-4 mr-2" />
            物料库存
          </Button>
          <Button onClick={() => setShowPickupDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建领取单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">领取记录</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待领取</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingPickup}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日领取</p>
                <p className="text-2xl font-bold text-green-600">{stats.pickedToday}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">库存预警</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="records">领取记录</TabsTrigger>
          <TabsTrigger value="pending">待领取订单 <Badge variant="secondary" className="ml-1">{pendingOrders.length}</Badge></TabsTrigger>
        </TabsList>

        {/* 领取记录 */}
        <TabsContent value="records" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索人员或客户..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />导出
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>领取单号</TableHead>
                    <TableHead>服务人员</TableHead>
                    <TableHead>关联订单</TableHead>
                    <TableHead>领取物料</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>领取时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{record.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">{record.staffName.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{record.staffName}</p>
                            <p className="text-xs text-muted-foreground">{record.staffType}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{record.orderId}</p>
                          <p className="text-xs text-muted-foreground">{record.customerName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.items.slice(0, 2).map(item => (
                            <p key={item.id} className="text-xs">{item.name} x{item.quantity}</p>
                          ))}
                          {record.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{record.items.length - 2}项</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">¥{record.totalAmount}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusConfig[record.status].color)}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{record.pickupDate || "-"}</TableCell>
                      <TableCell>
                        {record.status === "pending" ? (
                          <Button size="sm" variant="outline">确认领取</Button>
                        ) : (
                          <Button size="sm" variant="ghost">
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 待领取订单 */}
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {pendingOrders.map(order => (
                  <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.staffName}</span>
                          <Badge variant="outline" className="text-xs">{order.serviceType}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>订单: {order.orderId}</span>
                          <span>客户: {order.customerName}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{order.startDate}上户</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setShowPickupDialog(true)}>创建领取单</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建领取单对话框 */}
      <Dialog open={showPickupDialog} onOpenChange={setShowPickupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建物料领取单</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>服务人员</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择人员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S001">王阿姨 - 月嫂</SelectItem>
                    <SelectItem value="S003">张阿姨 - 育婴师</SelectItem>
                    <SelectItem value="S005">陈技师 - 产康技师</SelectItem>
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
                    <SelectItem value="FSO2026031801">FSO2026031801 - 张女士</SelectItem>
                    <SelectItem value="FSO2026031802">FSO2026031802 - 李女士</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>选择物料</Label>
              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                {suppliesList.map(item => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/30",
                      selectedItems.includes(item.id) && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category} | 库存: {item.stock}{item.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">¥{item.price}/{item.unit}</span>
                      {selectedItems.includes(item.id) && (
                        <Input type="number" className="w-20 h-8" defaultValue="1" min="1" max={item.stock} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <span className="text-sm">已选 {selectedItems.length} 项物料</span>
                <span className="font-medium">
                  预计金额: ¥{suppliesList.filter(s => selectedItems.includes(s.id)).reduce((sum, s) => sum + s.price, 0)}
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPickupDialog(false)}>取消</Button>
            <Button onClick={() => setShowPickupDialog(false)}>创建领取单</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 物料库存对话框 */}
      <Dialog open={showInventoryDialog} onOpenChange={setShowInventoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>物料库存</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>物料编号</TableHead>
                  <TableHead>物料名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">库存</TableHead>
                  <TableHead className="text-right">单价</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliesList.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.stock}{item.unit}</TableCell>
                    <TableCell className="text-right">¥{item.price}</TableCell>
                    <TableCell>
                      {item.stock < 20 ? (
                        <Badge className="text-xs bg-red-100 text-red-700">库存不足</Badge>
                      ) : (
                        <Badge className="text-xs bg-green-100 text-green-700">正常</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInventoryDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}
