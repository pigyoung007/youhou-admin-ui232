"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package, AlertTriangle, Plus, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

const categories = [
  { name: "母婴用品", count: 45, value: "¥28,500" },
  { name: "产后护理", count: 32, value: "¥15,600" },
  { name: "产康用品", count: 28, value: "¥22,400" },
  { name: "营养食材", count: 56, value: "¥18,200" },
]

const inventory = [
  { id: "INV001", name: "婴儿纸尿裤(M)", category: "母婴用品", stock: 156, minStock: 50, unit: "包", price: "¥68", trend: "up" },
  { id: "INV002", name: "产妇卫生巾", category: "产后护理", stock: 23, minStock: 30, unit: "包", price: "¥35", trend: "down" },
  { id: "INV003", name: "吸奶器配件", category: "母婴用品", stock: 45, minStock: 20, unit: "套", price: "¥128", trend: "up" },
  { id: "INV004", name: "产康按摩油", category: "产康用品", stock: 8, minStock: 15, unit: "瓶", price: "¥98", trend: "down" },
  { id: "INV005", name: "月子餐食材包", category: "营养食材", stock: 62, minStock: 40, unit: "份", price: "¥156", trend: "up" },
  { id: "INV006", name: "婴儿湿巾", category: "母婴用品", stock: 89, minStock: 60, unit: "包", price: "¥28", trend: "up" },
  { id: "INV007", name: "产后收腹带", category: "产后护理", stock: 12, minStock: 20, unit: "件", price: "¥168", trend: "down" },
]

export default function MaterialsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">物料库存</h1>
              <p className="text-muted-foreground">管理物料库存信息</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索物料..." className="pl-9" />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                入库
              </Button>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Card key={index} className="hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{cat.name}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-2xl font-bold text-foreground">{cat.count}</p>
                    <p className="text-sm font-medium text-primary">{cat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Inventory List */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">库存明细</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/inventory/alerts">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    库存预警
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/inventory/records">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    出入库记录
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventory.map((item) => {
                  const isLowStock = item.stock < item.minStock
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className={`p-2.5 rounded-lg ${isLowStock ? "bg-red-50" : "bg-muted"}`}>
                        {isLowStock ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{item.name}</span>
                          {isLowStock && (
                            <Badge variant="destructive" className="text-xs">库存不足</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {item.category} · {item.price}/{item.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 text-sm">
                          {item.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${isLowStock ? "text-red-600" : "text-foreground"}`}>
                            {item.stock}
                            <span className="text-sm font-normal text-muted-foreground ml-1">{item.unit}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">最低库存: {item.minStock}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </Suspense>
  )
}
