"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Copy,
  Package, Layers, Tag, DollarSign, Settings, ChevronRight, Grid3X3
} from "lucide-react"

// MOCK数据 - 服务项目
const projectsData = [
  {
    id: "PRJ001",
    name: "月嫂服务",
    category: "母婴服务",
    description: "专业月嫂上门服务，照顾产妇和新生儿",
    levels: [
      { level: "普通", price: 15800, unit: "月" },
      { level: "银牌", price: 19800, unit: "月" },
      { level: "金牌", price: 26800, unit: "月" },
      { level: "钻石", price: 36800, unit: "月" },
    ],
    status: "active",
    sort: 1,
  },
  {
    id: "PRJ002",
    name: "育婴服务",
    category: "母婴服务",
    description: "专业育婴师，照顾0-3岁婴幼儿",
    levels: [
      { level: "白班", price: 6800, unit: "月" },
      { level: "住家", price: 9800, unit: "月" },
      { level: "高级住家", price: 12800, unit: "月" },
    ],
    status: "active",
    sort: 2,
  },
  {
    id: "PRJ003",
    name: "产康服务",
    category: "产后恢复",
    description: "产后修复、催乳、骨盆修复等专业服务",
    levels: [
      { level: "单次", price: 280, unit: "次" },
      { level: "10次卡", price: 2500, unit: "套" },
      { level: "20次卡", price: 4500, unit: "套" },
    ],
    status: "active",
    sort: 3,
  },
  {
    id: "PRJ004",
    name: "月嫂培训",
    category: "培训服务",
    description: "月嫂职业技能培训，含证书",
    levels: [
      { level: "初级班", price: 3980, unit: "期" },
      { level: "高级班", price: 5980, unit: "期" },
      { level: "金牌班", price: 8980, unit: "期" },
    ],
    status: "active",
    sort: 4,
  },
]

// MOCK数据 - 套餐
const packagesData = [
  {
    id: "PKG001",
    name: "金牌月嫂套餐",
    description: "金牌月嫂26天服务 + 产康10次",
    originalPrice: 29300,
    salePrice: 27800,
    items: [
      { name: "金牌月嫂服务", quantity: 1, unit: "月" },
      { name: "产康服务", quantity: 10, unit: "次" },
    ],
    validDays: 90,
    status: "active",
    salesCount: 45,
  },
  {
    id: "PKG002",
    name: "新手妈妈套餐",
    description: "银牌月嫂 + 育婴师 + 产康",
    originalPrice: 38400,
    salePrice: 35800,
    items: [
      { name: "银牌月嫂服务", quantity: 1, unit: "月" },
      { name: "育婴师住家", quantity: 2, unit: "月" },
      { name: "产康服务", quantity: 5, unit: "次" },
    ],
    validDays: 120,
    status: "active",
    salesCount: 32,
  },
  {
    id: "PKG003",
    name: "产后修复套餐",
    description: "20次产康服务 + 满月发汗",
    originalPrice: 5080,
    salePrice: 4680,
    items: [
      { name: "产康服务", quantity: 20, unit: "次" },
      { name: "满月发汗", quantity: 1, unit: "次" },
    ],
    validDays: 180,
    status: "active",
    salesCount: 68,
  },
]

// MOCK数据 - 充值方案
const rechargeData = [
  { id: "RCH001", name: "充1000送50", amount: 1000, gift: 50, points: 100, status: "active" },
  { id: "RCH002", name: "充3000送200", amount: 3000, gift: 200, points: 300, status: "active" },
  { id: "RCH003", name: "充5000送500", amount: 5000, gift: 500, points: 500, status: "active" },
  { id: "RCH004", name: "充10000送1500", amount: 10000, gift: 1500, points: 1000, status: "active" },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  "active": { label: "上架", color: "bg-green-100 text-green-700" },
  "inactive": { label: "下架", color: "bg-gray-100 text-gray-700" },
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("projects")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false)
  const [showAddPackageDialog, setShowAddPackageDialog] = useState(false)
  const [showAddRechargeDialog, setShowAddRechargeDialog] = useState(false)

  // 统计
  const stats = {
    projects: projectsData.length,
    packages: packagesData.length,
    recharges: rechargeData.length,
    totalSales: packagesData.reduce((sum, p) => sum + p.salesCount, 0),
  }

  return (
  <AdminLayout title="产品及服务管理">
  <div className="flex flex-col gap-6">
  {/* 页面标题 */}
  <div className="flex items-center justify-between">
  <div>
  <h1 className="text-2xl font-bold">产品及服务管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理服务项目、套餐组合和充值方案</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">服务项目</p>
                <p className="text-2xl font-bold">{stats.projects}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">套餐组合</p>
                <p className="text-2xl font-bold">{stats.packages}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">充值方案</p>
                <p className="text-2xl font-bold">{stats.recharges}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">套餐销量</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSales}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Grid3X3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">服务项目</TabsTrigger>
          <TabsTrigger value="packages">套餐组合</TabsTrigger>
          <TabsTrigger value="recharge">充值方案</TabsTrigger>
        </TabsList>

        {/* 服务项目 */}
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索项目..." className="pl-9 w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <Button onClick={() => setShowAddProjectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />新增项目
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsData.map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <Badge variant="outline" className="text-xs">{project.category}</Badge>
                            <Badge className={cn("text-xs", statusConfig[project.status].color)}>
                              {statusConfig[project.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.levels.map(level => (
                              <div key={level.level} className="px-3 py-1.5 bg-muted/50 rounded-md text-sm">
                                <span className="text-muted-foreground">{level.level}:</span>
                                <span className="font-medium ml-1">¥{level.price.toLocaleString()}/{level.unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />编辑</DropdownMenuItem>
                            <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />复制</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />删除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 套餐组合 */}
        <TabsContent value="packages" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">套餐列表</CardTitle>
              <Button onClick={() => setShowAddPackageDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />新增套餐
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {packagesData.map(pkg => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{pkg.name}</h4>
                            <Badge className={cn("text-xs", statusConfig[pkg.status].color)}>
                              {statusConfig[pkg.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />编辑</DropdownMenuItem>
                            <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />复制</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />删除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 space-y-1">
                        {pkg.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ChevronRight className="h-3 w-3" />
                            <span>{item.name} x {item.quantity}{item.unit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div>
                          <span className="text-sm text-muted-foreground line-through">¥{pkg.originalPrice.toLocaleString()}</span>
                          <span className="text-lg font-bold text-primary ml-2">¥{pkg.salePrice.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          已售 <span className="font-medium text-foreground">{pkg.salesCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 充值方案 */}
        <TabsContent value="recharge" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">充值方案</CardTitle>
              <Button onClick={() => setShowAddRechargeDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />新增方案
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>方案名称</TableHead>
                    <TableHead className="text-right">充值金额</TableHead>
                    <TableHead className="text-right">赠送金额</TableHead>
                    <TableHead className="text-right">赠送积分</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rechargeData.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">¥{item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">+¥{item.gift}</TableCell>
                      <TableCell className="text-right text-amber-600">+{item.points}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={item.status === "active"} />
                          <span className="text-sm">{item.status === "active" ? "启用" : "禁用"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">编辑</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新增项目对话框 */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增服务项目</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>项目名称</Label>
              <Input placeholder="请输入项目名称" />
            </div>
            <div className="space-y-2">
              <Label>所属分类</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="母婴服务">母婴服务</SelectItem>
                  <SelectItem value="产后恢复">产后恢复</SelectItem>
                  <SelectItem value="培训服务">培训服务</SelectItem>
                  <SelectItem value="养老服务">养老服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>项目描述</Label>
              <Textarea placeholder="请输入项目描述" />
            </div>
            <div className="space-y-2">
              <Label>价格等级</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="等级名称" className="w-24" />
                  <Input placeholder="价格" type="number" className="w-24" />
                  <Select defaultValue="月">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="月">月</SelectItem>
                      <SelectItem value="次">次</SelectItem>
                      <SelectItem value="天">天</SelectItem>
                      <SelectItem value="期">期</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProjectDialog(false)}>取消</Button>
            <Button onClick={() => setShowAddProjectDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增套餐对话框 */}
      <Dialog open={showAddPackageDialog} onOpenChange={setShowAddPackageDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增套餐组合</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>套餐名称</Label>
              <Input placeholder="请输入套餐名称" />
            </div>
            <div className="space-y-2">
              <Label>套餐描述</Label>
              <Textarea placeholder="请输入套餐描述" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>原价</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>售价</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>有效期(天)</Label>
              <Input type="number" placeholder="90" />
            </div>
            <div className="space-y-2">
              <Label>包含项目</Label>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />添加服务项目
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPackageDialog(false)}>取消</Button>
            <Button onClick={() => setShowAddPackageDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增充值方案对话框 */}
      <Dialog open={showAddRechargeDialog} onOpenChange={setShowAddRechargeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增充值方案</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>方案名称</Label>
              <Input placeholder="如：充1000送100" />
            </div>
            <div className="space-y-2">
              <Label>充值金额</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>赠送金额</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>赠送积分</Label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRechargeDialog(false)}>取消</Button>
            <Button onClick={() => setShowAddRechargeDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </AdminLayout>
  )
}
