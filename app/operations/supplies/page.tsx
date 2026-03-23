"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Package,
  AlertTriangle,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Check,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Supply {
  id: string
  name: string
  category: string
  unit: string
  stock: number
  minStock: number
  maxStock: number
  price: number
  lastRestockDate: string
}

const mockSupplies: Supply[] = [
  {
    id: "S001",
    name: "精油(薰衣草)",
    category: "产康耗材",
    unit: "瓶",
    stock: 15,
    minStock: 10,
    maxStock: 50,
    price: 128,
    lastRestockDate: "2025-01-15",
  },
  {
    id: "S002",
    name: "一次性床单",
    category: "卫生用品",
    unit: "包",
    stock: 8,
    minStock: 20,
    maxStock: 100,
    price: 35,
    lastRestockDate: "2025-01-10",
  },
  {
    id: "S003",
    name: "按摩膏",
    category: "产康耗材",
    unit: "盒",
    stock: 25,
    minStock: 15,
    maxStock: 60,
    price: 68,
    lastRestockDate: "2025-01-18",
  },
  {
    id: "S004",
    name: "消毒湿巾",
    category: "卫生用品",
    unit: "包",
    stock: 5,
    minStock: 30,
    maxStock: 100,
    price: 18,
    lastRestockDate: "2025-01-05",
  },
  {
    id: "S005",
    name: "艾灸条",
    category: "产康耗材",
    unit: "盒",
    stock: 42,
    minStock: 20,
    maxStock: 80,
    price: 45,
    lastRestockDate: "2025-01-20",
  },
  {
    id: "S006",
    name: "一次性手套",
    category: "卫生用品",
    unit: "盒",
    stock: 18,
    minStock: 10,
    maxStock: 50,
    price: 28,
    lastRestockDate: "2025-01-12",
  },
]

function ApplySupplyDialog({ supply }: { supply: Supply }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Minus className="h-3 w-3 mr-1" />
          领用
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>耗材领用</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">物料名称</span>
              <span className="font-medium">{supply.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">当前库存</span>
              <span className="font-medium">{supply.stock} {supply.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">单价</span>
              <span className="font-medium">¥{supply.price}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">领用人</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择领用人" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zhang">张美玲 - 产康技师</SelectItem>
                <SelectItem value="li">李芳芳 - 产康技师</SelectItem>
                <SelectItem value="wang">王美丽 - 产康技师</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">领用数量</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(supply.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground">{supply.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">用途说明</label>
            <Input placeholder="请输入用途说明" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">取消</Button>
          <Button>确认领用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RestockDialog({ supply }: { supply: Supply }) {
  const [quantity, setQuantity] = useState(10)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3 w-3 mr-1" />
          补货
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>库存补货</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">物料名称</span>
              <span className="font-medium">{supply.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">当前库存</span>
              <span className={`font-medium ${supply.stock < supply.minStock ? "text-red-600" : ""}`}>
                {supply.stock} {supply.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">建议补货</span>
              <span className="font-medium text-primary">
                {supply.maxStock - supply.stock} {supply.unit}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">补货数量</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground">{supply.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">供应商</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择供应商" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">银川医疗器械有限公司</SelectItem>
                <SelectItem value="b">宁夏康美医疗用品</SelectItem>
                <SelectItem value="c">其他供应商</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex justify-between text-sm">
              <span>预计费用</span>
              <span className="font-medium text-primary">¥{(quantity * supply.price).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">取消</Button>
          <Button>确认补货</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SuppliesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()

  const lowStockCount = mockSupplies.filter((s) => s.stock < s.minStock).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">耗材管理</h1>
            <p className="text-muted-foreground mt-1">管理产康服务所需耗材的库存和领用</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增耗材
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-amber-700 font-medium">
                  {lowStockCount} 种耗材库存不足，请及时补货
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Package className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">48</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">耗材种类</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 flex-shrink-0">
                  <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">42</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">库存正常</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 flex-shrink-0">
                  <TrendingDown className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{lowStockCount}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">库存不足</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 flex-shrink-0">
                  <Package className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">¥12.8k</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">库存价值</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索耗材名称" className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="health">产康耗材</SelectItem>
                  <SelectItem value="hygiene">卫生用品</SelectItem>
                  <SelectItem value="equipment">设备配件</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="库存状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">库存正常</SelectItem>
                  <SelectItem value="low">库存不足</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Supplies Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>耗材名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>库存状态</TableHead>
                <TableHead>当前库存</TableHead>
                <TableHead>单价</TableHead>
                <TableHead>最后补货</TableHead>
                <TableHead className="w-32">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSupplies.map((supply) => {
                const stockPercent = (supply.stock / supply.maxStock) * 100
                const isLow = supply.stock < supply.minStock

                return (
                  <TableRow key={supply.id}>
                    <TableCell className="font-medium">{supply.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{supply.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={stockPercent} className={`h-2 ${isLow ? "[&>div]:bg-red-500" : ""}`} />
                        {isLow && (
                          <span className="text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            低于安全库存
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={isLow ? "text-red-600 font-medium" : ""}>
                        {supply.stock}
                      </span>
                      <span className="text-muted-foreground"> / {supply.maxStock} {supply.unit}</span>
                    </TableCell>
                    <TableCell>¥{supply.price}</TableCell>
                    <TableCell className="text-muted-foreground">{supply.lastRestockDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ApplySupplyDialog supply={supply} />
                        <RestockDialog supply={supply} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">48</span> 种耗材
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
