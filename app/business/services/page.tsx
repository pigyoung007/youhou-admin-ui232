"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal, Wrench, ChevronLeft, ChevronRight
} from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Service {
  id: string
  name: string
  code: string
  project: string
  unit: string
  duration: string
  basePrice: number
  status: "active" | "inactive"
  description: string
}

const mockServices: Service[] = [
  { id: "S001", name: "金牌月嫂26天", code: "YS-JP-26", project: "月嫂服务", unit: "单", duration: "26天", basePrice: 19800, status: "active", description: "金牌月嫂提供26天全程护理服务" },
  { id: "S002", name: "高级月嫂26天", code: "YS-GJ-26", project: "月嫂服务", unit: "单", duration: "26天", basePrice: 15800, status: "active", description: "高级月嫂提供26天全程护理服务" },
  { id: "S003", name: "育婴师月度服务", code: "YY-YD", project: "育婴师服务", unit: "月", duration: "30天", basePrice: 8800, status: "active", description: "育婴师月度照护服务" },
  { id: "S004", name: "骨盆修复套餐", code: "CK-GP-10", project: "产康服务", unit: "套", duration: "10次", basePrice: 3980, status: "active", description: "产后骨盆修复10次疗程" },
  { id: "S005", name: "腹直肌修复套餐", code: "CK-FZ-10", project: "产康服务", unit: "套", duration: "10次", basePrice: 4580, status: "active", description: "腹直肌分离修复10次疗程" },
  { id: "S006", name: "产康单次体验", code: "CK-TY", project: "产康服务", unit: "次", duration: "60分钟", basePrice: 298, status: "active", description: "产康项目单次体验" },
  { id: "S007", name: "月嫂培训初级班", code: "PX-YS-CJ", project: "培训课程", unit: "期", duration: "15天", basePrice: 3980, status: "active", description: "月嫂初级技能培训课程" },
  { id: "S008", name: "育婴师培训班", code: "PX-YY", project: "培训课程", unit: "期", duration: "12天", basePrice: 2980, status: "active", description: "育婴师专业技能培训" },
]

export default function ServicesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">服务内容</h1>
            <p className="text-muted-foreground mt-1">管理各项目下的具体服务内容</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增服务
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索服务名称或编码" className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="所属项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部项目</SelectItem>
                  <SelectItem value="yuesao">月嫂服务</SelectItem>
                  <SelectItem value="yuying">育婴师服务</SelectItem>
                  <SelectItem value="chankang">产康服务</SelectItem>
                  <SelectItem value="peixun">培训课程</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">已启用</SelectItem>
                  <SelectItem value="inactive">已停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>服务名称</TableHead>
                <TableHead>所属项目</TableHead>
                <TableHead>计量单位</TableHead>
                <TableHead>服务时长</TableHead>
                <TableHead className="text-right">基准价格</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockServices.map((service) => (
                <TableRow key={service.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.project}</Badge>
                  </TableCell>
                  <TableCell>{service.unit}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    ¥{service.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Switch checked={service.status === "active"} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">共 {mockServices.length} 条记录</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="h-8 w-8">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增服务</DialogTitle>
            <DialogDescription>添加新的服务内容</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>服务名称 *</Label>
                <Input placeholder="如: 金牌月嫂26天" />
              </div>
              <div className="space-y-2">
                <Label>服务编码 *</Label>
                <Input placeholder="如: YS-JP-26" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="peixun">培训课程</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>计量单位</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dan">单</SelectItem>
                    <SelectItem value="ci">次</SelectItem>
                    <SelectItem value="tao">套</SelectItem>
                    <SelectItem value="yue">月</SelectItem>
                    <SelectItem value="qi">期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>服务时长</Label>
                <Input placeholder="如: 26天、10次" />
              </div>
              <div className="space-y-2">
                <Label>基准价格 *</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>服务描述</Label>
              <Textarea placeholder="输入服务描述..." className="resize-none" rows={3} />
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
