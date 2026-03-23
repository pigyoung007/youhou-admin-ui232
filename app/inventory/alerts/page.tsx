"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, ShoppingCart, Bell, CheckCircle2 } from "lucide-react"

const alerts = [
  { 
    id: 1,
    material: "产康按摩油",
    category: "产康用品",
    currentStock: 8,
    minStock: 15,
    unit: "瓶",
    urgency: "high",
    lastRestockDate: "2025-09-15",
    suggestedOrder: 20
  },
  { 
    id: 2,
    material: "产后收腹带",
    category: "产后护理",
    currentStock: 12,
    minStock: 20,
    unit: "件",
    urgency: "high",
    lastRestockDate: "2025-09-28",
    suggestedOrder: 15
  },
  { 
    id: 3,
    material: "产妇卫生巾",
    category: "产后护理",
    currentStock: 23,
    minStock: 30,
    unit: "包",
    urgency: "medium",
    lastRestockDate: "2025-10-05",
    suggestedOrder: 25
  },
  { 
    id: 4,
    material: "婴儿奶瓶",
    category: "母婴用品",
    currentStock: 18,
    minStock: 25,
    unit: "个",
    urgency: "medium",
    lastRestockDate: "2025-10-10",
    suggestedOrder: 20
  },
  { 
    id: 5,
    material: "哺乳文胸",
    category: "产后护理",
    currentStock: 28,
    minStock: 30,
    unit: "件",
    urgency: "low",
    lastRestockDate: "2025-10-12",
    suggestedOrder: 10
  },
]

const urgencyConfig = {
  high: { label: "紧急", color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
  medium: { label: "警告", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertTriangle },
  low: { label: "提醒", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Bell },
}

export default function InventoryAlertsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">库存预警</h1>
            <p className="text-muted-foreground">低于安全库存的物料提醒</p>
          </div>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            一键补货
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">2</p>
                <p className="text-sm text-red-600">紧急补货</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">2</p>
                <p className="text-sm text-amber-600">库存警告</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-blue-100">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">1</p>
                <p className="text-sm text-blue-600">库存提醒</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">预警明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const urgency = urgencyConfig[alert.urgency as keyof typeof urgencyConfig]
                const stockPercent = Math.round((alert.currentStock / alert.minStock) * 100)
                return (
                  <div 
                    key={alert.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2.5 rounded-lg ${alert.urgency === "high" ? "bg-red-50" : alert.urgency === "medium" ? "bg-amber-50" : "bg-blue-50"}`}>
                        <Package className={`h-5 w-5 ${alert.urgency === "high" ? "text-red-600" : alert.urgency === "medium" ? "text-amber-600" : "text-blue-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{alert.material}</span>
                          <Badge variant="outline" className={urgency.color}>
                            {urgency.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.category}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">库存水平</span>
                            <span className={alert.urgency === "high" ? "text-red-600" : "text-muted-foreground"}>
                              {alert.currentStock}/{alert.minStock} {alert.unit}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                alert.urgency === "high" ? "bg-red-500" : 
                                alert.urgency === "medium" ? "bg-amber-500" : "bg-blue-500"
                              }`} 
                              style={{ width: `${Math.min(stockPercent, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pl-14 sm:pl-0">
                      <div className="text-sm text-right">
                        <p className="text-muted-foreground">建议采购</p>
                        <p className="font-semibold text-foreground">{alert.suggestedOrder} {alert.unit}</p>
                      </div>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        补货
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
