"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, BookCopy, CheckCircle2, Clock, Package, Eye } from "lucide-react"

interface TextbookOutbound {
  id: string
  outboundNo: string
  studentName: string
  studentPhone: string
  courseName: string
  className: string
  items: { name: string; quantity: number; unit: string }[]
  totalItems: number
  status: "pending" | "confirmed" | "completed"
  generatedAt: string
  confirmedAt?: string
  confirmedBy?: string
  operator: string
}

const mockData: TextbookOutbound[] = [
  { id: "TO001", outboundNo: "JC-2025-0001", studentName: "刘芳", studentPhone: "138****1234", courseName: "月嫂培训", className: "月嫂25期", items: [{ name: "月嫂培训教材(上)", quantity: 1, unit: "本" }, { name: "月嫂培训教材(下)", quantity: 1, unit: "本" }, { name: "实操手册", quantity: 1, unit: "本" }], totalItems: 3, status: "completed", generatedAt: "2025-01-20 09:00", confirmedAt: "2025-01-20 10:30", confirmedBy: "李库管", operator: "周顾问" },
  { id: "TO002", outboundNo: "JC-2025-0002", studentName: "赵敏", studentPhone: "139****5678", courseName: "育婴培训", className: "育婴12期", items: [{ name: "育婴师培训教材", quantity: 1, unit: "本" }, { name: "营养搭配手册", quantity: 1, unit: "本" }], totalItems: 2, status: "confirmed", generatedAt: "2025-01-22 09:30", confirmedAt: "2025-01-22 11:00", confirmedBy: "李库管", operator: "孙顾问" },
  { id: "TO003", outboundNo: "JC-2025-0003", studentName: "王丽", studentPhone: "137****9012", courseName: "产康培训", className: "产康8期", items: [{ name: "产康技师培训教材", quantity: 1, unit: "本" }, { name: "实操指南", quantity: 1, unit: "本" }], totalItems: 2, status: "pending", generatedAt: "2025-01-23 14:00", operator: "张顾问" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待确认", className: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "已确认", className: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "已完成", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

export default function TextbookOutboundPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TextbookOutbound | null>(null)

  const filtered = mockData.filter(item => {
    const matchSearch = !search || item.studentName.includes(search) || item.outboundNo.includes(search)
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">教材出库</h1>
            <p className="text-sm text-muted-foreground mt-0.5">管理由销课自动生成的教材出库单</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-4 w-4 text-amber-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">待确认</p>
                  <p className="text-lg font-bold text-amber-600">{mockData.filter(i => i.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">已确认</p>
                  <p className="text-lg font-bold text-blue-600">{mockData.filter(i => i.status === "confirmed").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center"><Package className="h-4 w-4 text-emerald-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">本月出库</p>
                  <p className="text-lg font-bold">{mockData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索学员姓名/出库单号..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">出库单号</TableHead>
                  <TableHead className="text-xs">学员</TableHead>
                  <TableHead className="text-xs">课程/班级</TableHead>
                  <TableHead className="text-xs text-center">教材数</TableHead>
                  <TableHead className="text-xs">生成时间</TableHead>
                  <TableHead className="text-xs">操作人</TableHead>
                  <TableHead className="text-xs text-center">状态</TableHead>
                  <TableHead className="text-xs text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs font-mono">{item.outboundNo}</TableCell>
                    <TableCell className="text-xs">{item.studentName}</TableCell>
                    <TableCell className="text-xs">{item.courseName} / {item.className}</TableCell>
                    <TableCell className="text-xs text-center">{item.totalItems}项</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.generatedAt}</TableCell>
                    <TableCell className="text-xs">{item.operator}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[item.status].className}`}>{statusConfig[item.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => { setSelectedItem(item); setDetailOpen(true) }}>
                          <Eye className="h-3 w-3 mr-1" />详情
                        </Button>
                        {item.status === "pending" && (
                          <Button size="sm" className="h-7 px-2 text-xs">确认出库</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <BookCopy className="h-4 w-4 text-primary" />
                出库单详情
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs">单号</span><p className="font-mono text-xs mt-0.5">{selectedItem.outboundNo}</p></div>
                  <div><span className="text-muted-foreground text-xs">状态</span><p className="mt-0.5"><Badge variant="outline" className={`text-[10px] ${statusConfig[selectedItem.status].className}`}>{statusConfig[selectedItem.status].label}</Badge></p></div>
                  <div><span className="text-muted-foreground text-xs">学员</span><p className="text-xs mt-0.5">{selectedItem.studentName}</p></div>
                  <div><span className="text-muted-foreground text-xs">电话</span><p className="text-xs mt-0.5">{selectedItem.studentPhone}</p></div>
                  <div><span className="text-muted-foreground text-xs">课程</span><p className="text-xs mt-0.5">{selectedItem.courseName}</p></div>
                  <div><span className="text-muted-foreground text-xs">班级</span><p className="text-xs mt-0.5">{selectedItem.className}</p></div>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-2">教材清单</h4>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40"><TableHead className="text-xs">教材名称</TableHead><TableHead className="text-xs text-center">数量</TableHead><TableHead className="text-xs text-center">单位</TableHead></TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItem.items.map((item, i) => (
                          <TableRow key={i}><TableCell className="text-xs">{item.name}</TableCell><TableCell className="text-xs text-center">{item.quantity}</TableCell><TableCell className="text-xs text-center">{item.unit}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">生成时间</span><p className="mt-0.5">{selectedItem.generatedAt}</p></div>
                  <div><span className="text-muted-foreground">操作人(顾问)</span><p className="mt-0.5">{selectedItem.operator}</p></div>
                  {selectedItem.confirmedAt && <div><span className="text-muted-foreground">确认时间</span><p className="mt-0.5">{selectedItem.confirmedAt}</p></div>}
                  {selectedItem.confirmedBy && <div><span className="text-muted-foreground">库管确认</span><p className="mt-0.5">{selectedItem.confirmedBy}</p></div>}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" size="sm" onClick={() => setDetailOpen(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
