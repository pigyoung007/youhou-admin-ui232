"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Clock,
  CalendarCheck,
  CalendarX,
  Coffee,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface ServicePeriod {
  id: string
  startDate: string
  endDate: string
  type: "contract" | "available" | "unavailable" | "rest"
  source: "合同约定" | "排班系统" | "个人设置" | "顾问设置"
  contractId?: string
  note?: string
}

interface ServiceAvailabilityProps {
  periods: ServicePeriod[]
  onAddPeriod?: (period: Omit<ServicePeriod, "id">) => void
  onEditPeriod?: (period: ServicePeriod) => void
  onDeletePeriod?: (id: string) => void
  readonly?: boolean
}

const typeConfig = {
  contract: { label: "合同服务", icon: FileText, color: "bg-blue-100 text-blue-700 border-blue-200" },
  available: { label: "可接单", icon: CalendarCheck, color: "bg-green-100 text-green-700 border-green-200" },
  unavailable: { label: "不接单", icon: CalendarX, color: "bg-red-100 text-red-700 border-red-200" },
  rest: { label: "休息", icon: Coffee, color: "bg-amber-100 text-amber-700 border-amber-200" },
}

export function ServiceAvailability({
  periods,
  onAddPeriod,
  onEditPeriod,
  onDeletePeriod,
  readonly = false,
}: ServiceAvailabilityProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<ServicePeriod | null>(null)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "available" as ServicePeriod["type"],
    source: "顾问设置" as ServicePeriod["source"],
    note: "",
  })

  const handleAdd = () => {
    if (onAddPeriod && formData.startDate && formData.endDate) {
      onAddPeriod({
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        source: formData.source,
        note: formData.note || undefined,
      })
      setShowAddDialog(false)
      resetForm()
    }
  }

  const handleEdit = () => {
    if (onEditPeriod && editingPeriod) {
      onEditPeriod({
        ...editingPeriod,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        source: formData.source,
        note: formData.note || undefined,
      })
      setEditingPeriod(null)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      type: "available",
      source: "顾问设置",
      note: "",
    })
  }

  const openEditDialog = (period: ServicePeriod) => {
    setFormData({
      startDate: period.startDate,
      endDate: period.endDate,
      type: period.type,
      source: period.source,
      note: period.note || "",
    })
    setEditingPeriod(period)
  }

  // 按时间排序
  const sortedPeriods = [...periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  // 计算当前状态
  const today = new Date().toISOString().split("T")[0]
  const currentPeriod = periods.find(
    (p) => p.startDate <= today && p.endDate >= today
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            可服务时段
          </CardTitle>
          {!readonly && (
            <Button size="sm" className="h-7 text-xs" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3 w-3 mr-1" />
              添加时段
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 当前状态 */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">当前状态</span>
            {currentPeriod ? (
              <Badge variant="outline" className={cn("text-xs", typeConfig[currentPeriod.type].color)}>
                {typeConfig[currentPeriod.type].label}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                未设置
              </Badge>
            )}
          </div>
          {currentPeriod && (
            <p className="text-xs text-muted-foreground mt-1">
              {currentPeriod.startDate} ~ {currentPeriod.endDate}
              {currentPeriod.source && (
                <span className="ml-2 text-[10px]">({currentPeriod.source})</span>
              )}
            </p>
          )}
        </div>

        {/* 时段列表 */}
        <div className="space-y-2">
          {sortedPeriods.length > 0 ? (
            sortedPeriods.map((period) => {
              const config = typeConfig[period.type]
              const Icon = config.icon
              const isPast = new Date(period.endDate) < new Date(today)
              const isCurrent = period.startDate <= today && period.endDate >= today

              return (
                <div
                  key={period.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    isPast && "opacity-50",
                    isCurrent && "ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded", config.color.split(" ")[0])}>
                      <Icon className={cn("h-3.5 w-3.5", config.color.split(" ")[1])} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px] h-5", config.color)}>
                          {config.label}
                        </Badge>
                        {isCurrent && (
                          <Badge className="text-[9px] h-4 bg-primary">当前</Badge>
                        )}
                        {period.source === "合同约定" && (
                          <Badge variant="outline" className="text-[9px] h-4">
                            合同
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1">
                        {period.startDate} ~ {period.endDate}
                      </p>
                      {period.note && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{period.note}</p>
                      )}
                    </div>
                  </div>
                  {!readonly && period.source !== "合同约定" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => openEditDialog(period)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => onDeletePeriod?.(period.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>暂无服务时段记录</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* 添加/编辑弹窗 */}
      <Dialog open={showAddDialog || !!editingPeriod} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setEditingPeriod(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editingPeriod ? "编辑时段" : "添加服务时段"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">开始日期</Label>
                <Input
                  type="date"
                  className="h-8 text-xs"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">结束日期</Label>
                <Input
                  type="date"
                  className="h-8 text-xs"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">时段类型</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as ServicePeriod["type"] })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">可接单</SelectItem>
                  <SelectItem value="unavailable">不接单</SelectItem>
                  <SelectItem value="rest">休息</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">备注</Label>
              <Textarea
                placeholder="可选填写备注信息..."
                className="text-xs resize-none"
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              onClick={() => {
                setShowAddDialog(false)
                setEditingPeriod(null)
                resetForm()
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={editingPeriod ? handleEdit : handleAdd}
              disabled={!formData.startDate || !formData.endDate}
            >
              {editingPeriod ? "保存" : "添加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
