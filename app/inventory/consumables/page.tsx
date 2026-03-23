"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, Package, AlertTriangle, TrendingDown, TrendingUp, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// MOCK数据
const consumables = [
  { id: "CON001", name: "一次性手套（盒）", category: "防护用品", unit: "盒", stock: 150, minStock: 50, maxStock: 300, unitPrice: 25, lastInDate: "2024-03-10", lastOutDate: "2024-03-15", monthlyUsage: 80 },
  { id: "CON002", name: "消毒湿巾", category: "清洁用品", unit: "包", stock: 30, minStock: 50, maxStock: 200, unitPrice: 15, lastInDate: "2024-03-08", lastOutDate: "2024-03-14", monthlyUsage: 60 },
  { id: "CON003", name: "垃圾袋（大号）", category: "清洁用品", unit: "卷", stock: 200, minStock: 100, maxStock: 500, unitPrice: 8, lastInDate: "2024-03-12", lastOutDate: "2024-03-15", monthlyUsage: 120 },
  { id: "CON004", name: "洗手液", category: "清洁用品", unit: "瓶", stock: 45, minStock: 30, maxStock: 150, unitPrice: 18, lastInDate: "2024-03-05", lastOutDate: "2024-03-13", monthlyUsage: 35 },
  { id: "CON005", name: "护理垫", category: "护理用品", unit: "包", stock: 80, minStock: 40, maxStock: 200, unitPrice: 35, lastInDate: "2024-03-11", lastOutDate: "2024-03-14", monthlyUsage: 50 },
  { id: "CON006", name: "医用口罩", category: "防护用品", unit: "盒", stock: 25, minStock: 50, maxStock: 200, unitPrice: 30, lastInDate: "2024-03-01", lastOutDate: "2024-03-15", monthlyUsage: 70 },
  { id: "CON007", name: "擦手纸", category: "清洁用品", unit: "包", stock: 100, minStock: 60, maxStock: 300, unitPrice: 12, lastInDate: "2024-03-09", lastOutDate: "2024-03-14", monthlyUsage: 90 },
  { id: "CON008", name: "婴儿湿巾", category: "护理用品", unit: "包", stock: 120, minStock: 80, maxStock: 400, unitPrice: 22, lastInDate: "2024-03-13", lastOutDate: "2024-03-15", monthlyUsage: 100 },
]

const getStockStatus = (stock: number, minStock: number) => {
  if (stock <= minStock * 0.5) return { label: "严重不足", color: "bg-red-100 text-red-800" }
  if (stock <= minStock) return { label: "库存预警", color: "bg-yellow-100 text-yellow-800" }
  return { label: "库存正常", color: "bg-green-100 text-green-800" }
}

export default function ConsumablesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showInOutDialog, setShowInOutDialog] = useState(false)
  const [inOutType, setInOutType] = useState<"in" | "out">("in")
  const [selectedItem, setSelectedItem] = useState<typeof consumables[0] | null>(null)

  const filteredConsumables = consumables.filter(item => {
    const matchesSearch = item.name.includes(searchTerm) || item.id.includes(searchTerm)
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: consumables.length,
    lowStock: consumables.filter(c => c.stock <= c.minStock).length,
    totalValue: consumables.reduce((sum, c) => sum + c.stock * c.unitPrice, 0),
    monthlyUsage: consumables.reduce((sum, c) => sum + c.monthlyUsage * c.unitPrice, 0),
  }

  const handleInOut = (item: typeof consumables[0], type: "in" | "out") => {
    setSelectedItem(item)
    setInOutType(type)
    setShowInOutDialog(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">耗材管理</h1>
          <p className="text-muted-foreground">管理日常消耗性物料的库存和使用情况</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增耗材
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">耗材种类</span>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">库存预警</span>
            </div>
            <div className="text-2xl font-bold tabular-nums text-yellow-600 mt-1">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">库存总值</span>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-1">¥{stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">月均消耗</span>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-1">¥{stats.monthlyUsage.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索耗材名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="类别筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
                <SelectItem value="清洁用品">清洁用品</SelectItem>
                <SelectItem value="防护用品">防护用品</SelectItem>
                <SelectItem value="护理用品">护理用品</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 耗材列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">耗材列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>耗材编号</TableHead>
                <TableHead>耗材名称</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>单位</TableHead>
                <TableHead>当前库存</TableHead>
                <TableHead>安全库存</TableHead>
                <TableHead>单价</TableHead>
                <TableHead>库存状态</TableHead>
                <TableHead>月均用量</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsumables.map(item => {
                const status = getStockStatus(item.stock, item.minStock)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono tabular-nums">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="tabular-nums font-medium">{item.stock}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{item.minStock}</TableCell>
                    <TableCell className="tabular-nums">¥{item.unitPrice}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">{item.monthlyUsage}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleInOut(item, "in")}>
                          <TrendingUp className="h-3 w-3 mr-1" />入库
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleInOut(item, "out")}>
                          <TrendingDown className="h-3 w-3 mr-1" />出库
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增耗材对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增耗材</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>耗材名称</Label>
              <Input placeholder="请输入耗材名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>耗材类别</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择类别" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="清洁用品">清洁用品</SelectItem>
                    <SelectItem value="防护用品">防护用品</SelectItem>
                    <SelectItem value="护理用品">护理用品</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>计量单位</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择单位" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="盒">盒</SelectItem>
                    <SelectItem value="包">包</SelectItem>
                    <SelectItem value="瓶">瓶</SelectItem>
                    <SelectItem value="卷">卷</SelectItem>
                    <SelectItem value="个">个</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>单价（元）</Label>
                <Input type="number" placeholder="单价" />
              </div>
              <div className="grid gap-2">
                <Label>安全库存</Label>
                <Input type="number" placeholder="最低库存" />
              </div>
              <div className="grid gap-2">
                <Label>最大库存</Label>
                <Input type="number" placeholder="最大库存" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>初始库存</Label>
              <Input type="number" placeholder="当前库存数量" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button onClick={() => setShowCreateDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 入库/出库对话框 */}
      <Dialog open={showInOutDialog} onOpenChange={setShowInOutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{inOutType === "in" ? "耗材入库" : "耗材出库"}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{selectedItem.name}</div>
                  <div className="text-sm text-muted-foreground">当前库存: {selectedItem.stock} {selectedItem.unit}</div>
                </div>
                <Badge variant="outline">{selectedItem.category}</Badge>
              </div>
              <div className="grid gap-2">
                <Label>{inOutType === "in" ? "入库数量" : "出库数量"}</Label>
                <Input type="number" placeholder="请输入数量" />
              </div>
              <div className="grid gap-2">
                <Label>备注说明</Label>
                <Input placeholder={inOutType === "in" ? "如：采购补货" : "如：门店领用"} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInOutDialog(false)}>取消</Button>
            <Button onClick={() => setShowInOutDialog(false)}>
              {inOutType === "in" ? "确认入库" : "确认出库"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
