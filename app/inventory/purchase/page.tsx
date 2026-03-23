"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Search, FileText, Check, X, Clock, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

// MOCK数据
const purchaseRequests = [
  { id: "PUR202403001", title: "月嫂培训教材采购", category: "培训物料", quantity: 100, unitPrice: 45, totalAmount: 4500, applicant: "张经理", applyDate: "2024-03-15", status: "pending", urgency: "normal", remark: "下月培训班使用" },
  { id: "PUR202403002", title: "上户礼包补货", category: "上户物料", quantity: 50, unitPrice: 120, totalAmount: 6000, applicant: "李主管", applyDate: "2024-03-14", status: "approved", urgency: "urgent", remark: "库存告急，需紧急补货" },
  { id: "PUR202403003", title: "办公用品采购", category: "办公用品", quantity: 200, unitPrice: 15, totalAmount: 3000, applicant: "王助理", applyDate: "2024-03-13", status: "completed", urgency: "normal", remark: "季度办公用品补充" },
  { id: "PUR202403004", title: "产康设备配件", category: "设备配件", quantity: 10, unitPrice: 350, totalAmount: 3500, applicant: "陈技师", applyDate: "2024-03-12", status: "rejected", urgency: "normal", remark: "设备维护配件", rejectReason: "预算超标，需重新评估" },
  { id: "PUR202403005", title: "清洁用品采购", category: "日常耗材", quantity: 300, unitPrice: 8, totalAmount: 2400, applicant: "刘经理", applyDate: "2024-03-11", status: "approved", urgency: "normal", remark: "各门店清洁用品" },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "待审批", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "已批准", color: "bg-green-100 text-green-800" },
  rejected: { label: "已驳回", color: "bg-red-100 text-red-800" },
  completed: { label: "已完成", color: "bg-blue-100 text-blue-800" },
}

const urgencyConfig: Record<string, { label: string; color: string }> = {
  normal: { label: "普通", color: "bg-gray-100 text-gray-800" },
  urgent: { label: "紧急", color: "bg-orange-100 text-orange-800" },
}

export default function PurchasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<typeof purchaseRequests[0] | null>(null)

  const filteredRequests = purchaseRequests.filter(req => {
    const matchesSearch = req.title.includes(searchTerm) || req.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: purchaseRequests.length,
    pending: purchaseRequests.filter(r => r.status === "pending").length,
    approved: purchaseRequests.filter(r => r.status === "approved").length,
    totalAmount: purchaseRequests.filter(r => r.status !== "rejected").reduce((sum, r) => sum + r.totalAmount, 0),
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">采购申请</h1>
          <p className="text-muted-foreground">管理物料采购申请和审批流程</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新建采购申请
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">申请总数</div>
            <div className="text-2xl font-bold tabular-nums">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">待审批</div>
            <div className="text-2xl font-bold tabular-nums text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">已批准</div>
            <div className="text-2xl font-bold tabular-nums text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">采购总金额</div>
            <div className="text-2xl font-bold tabular-nums">¥{stats.totalAmount.toLocaleString()}</div>
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
                placeholder="搜索申请单号或标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审批</SelectItem>
                <SelectItem value="approved">已批准</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 采购申请列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">采购申请列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>申请单号</TableHead>
                <TableHead>采购标题</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>申请人</TableHead>
                <TableHead>申请日期</TableHead>
                <TableHead>紧急程度</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono tabular-nums">{req.id}</TableCell>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell>{req.category}</TableCell>
                  <TableCell className="tabular-nums">{req.quantity}</TableCell>
                  <TableCell className="tabular-nums font-medium">¥{req.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{req.applicant}</TableCell>
                  <TableCell className="tabular-nums">{req.applyDate}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", urgencyConfig[req.urgency].color)}>{urgencyConfig[req.urgency].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusConfig[req.status].color)}>{statusConfig[req.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedRequest(req); setShowDetailDialog(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {req.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新建采购申请对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建采购申请</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>采购标题</Label>
              <Input placeholder="请输入采购标题" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>物料类别</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择类别" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">培训物料</SelectItem>
                    <SelectItem value="service">上户物料</SelectItem>
                    <SelectItem value="office">办公用品</SelectItem>
                    <SelectItem value="equipment">设备配件</SelectItem>
                    <SelectItem value="consumable">日常耗材</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>紧急程度</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择紧急程度" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>采购数量</Label>
                <Input type="number" placeholder="数量" />
              </div>
              <div className="grid gap-2">
                <Label>单价（元）</Label>
                <Input type="number" placeholder="单价" />
              </div>
              <div className="grid gap-2">
                <Label>总金额（元）</Label>
                <Input type="number" placeholder="自动计算" disabled />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>采购说明</Label>
              <Textarea placeholder="请输入采购原因和用途说明" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button onClick={() => setShowCreateDialog(false)}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 采购详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>采购申请详情</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">申请单号</span>
                <span className="font-mono tabular-nums">{selectedRequest.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">采购标题</span>
                <span className="font-medium">{selectedRequest.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">物料类别</span>
                <span>{selectedRequest.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">采购数量</span>
                <span className="tabular-nums">{selectedRequest.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">单价</span>
                <span className="tabular-nums">¥{selectedRequest.unitPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">总金额</span>
                <span className="tabular-nums font-bold">¥{selectedRequest.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">申请人</span>
                <span>{selectedRequest.applicant}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">申请日期</span>
                <span className="tabular-nums">{selectedRequest.applyDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">状态</span>
                <Badge className={cn("text-xs", statusConfig[selectedRequest.status].color)}>{statusConfig[selectedRequest.status].label}</Badge>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-muted-foreground">采购说明</span>
                <p className="mt-1 text-sm">{selectedRequest.remark}</p>
              </div>
              {selectedRequest.rejectReason && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-red-600">驳回原因</span>
                  <p className="mt-1 text-sm text-red-600">{selectedRequest.rejectReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
