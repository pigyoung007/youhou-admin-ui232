"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, Edit, Tag, TrendingUp, Award, Star
} from "lucide-react"

interface PriceLevel {
  id: string
  level: string
  project: string
  basePrice: number
  coefficient: number
  description: string
}

const mockPriceLevels: PriceLevel[] = [
  { id: "PL001", level: "初级", project: "月嫂服务", basePrice: 9800, coefficient: 1.0, description: "1-2年经验，基础技能" },
  { id: "PL002", level: "中级", project: "月嫂服务", basePrice: 12800, coefficient: 1.3, description: "2-4年经验，熟练技能" },
  { id: "PL003", level: "高级", project: "月嫂服务", basePrice: 15800, coefficient: 1.6, description: "4-6年经验，精通各项技能" },
  { id: "PL004", level: "金牌", project: "月嫂服务", basePrice: 19800, coefficient: 2.0, description: "6年以上经验，行业专家" },
  { id: "PL005", level: "钻石", project: "月嫂服务", basePrice: 26800, coefficient: 2.7, description: "顶级服务，VIP专属" },
]

const mockYuYingLevels: PriceLevel[] = [
  { id: "YY001", level: "初级", project: "育婴师服务", basePrice: 5800, coefficient: 1.0, description: "基础育婴技能" },
  { id: "YY002", level: "中级", project: "育婴师服务", basePrice: 7800, coefficient: 1.3, description: "熟练育婴技能，早教启蒙" },
  { id: "YY003", level: "高级", project: "育婴师服务", basePrice: 10800, coefficient: 1.9, description: "专业育婴师，全面早教" },
]

export default function PricingPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("yuesao")

  const currentLevels = activeTab === "yuesao" ? mockPriceLevels : mockYuYingLevels

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">价格体系</h1>
            <p className="text-muted-foreground mt-1">配置各服务的等级价格体系</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增等级
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">价格等级</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">¥15,800</p>
                  <p className="text-sm text-muted-foreground">月嫂均价</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">金牌</p>
                  <p className="text-sm text-muted-foreground">热门等级</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.7x</p>
                  <p className="text-sm text-muted-foreground">最高系数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Table */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-0">
              <TabsList>
                <TabsTrigger value="yuesao">月嫂服务</TabsTrigger>
                <TabsTrigger value="yuying">育婴师服务</TabsTrigger>
                <TabsTrigger value="chankang">产康服务</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>等级名称</TableHead>
                    <TableHead>价格系数</TableHead>
                    <TableHead className="text-right">基准价格(26天)</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLevels.map((level, index) => (
                    <TableRow key={level.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              index === currentLevels.length - 1 ? "bg-purple-50 text-purple-600 border-purple-200" :
                              index === currentLevels.length - 2 ? "bg-amber-50 text-amber-600 border-amber-200" :
                              "bg-gray-50 text-gray-600 border-gray-200"
                            }
                          >
                            {level.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{level.coefficient}x</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-primary">¥{level.basePrice.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{level.description}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增价格等级</DialogTitle>
            <DialogDescription>添加新的服务等级定价</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>所属项目 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yuesao">月嫂服务</SelectItem>
                  <SelectItem value="yuying">育婴师服务</SelectItem>
                  <SelectItem value="chankang">产康服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>等级名称 *</Label>
                <Input placeholder="如: 金牌" />
              </div>
              <div className="space-y-2">
                <Label>价格系数 *</Label>
                <Input type="number" placeholder="如: 2.0" step="0.1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>基准价格 *</Label>
              <Input type="number" placeholder="26天基准价格" />
            </div>
            <div className="space-y-2">
              <Label>等级说明</Label>
              <Input placeholder="如: 6年以上经验，行业专家" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
