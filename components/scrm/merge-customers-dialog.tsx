"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, ArrowRight, CheckCircle2, Merge } from "lucide-react"

// Generic interface for customer data
export interface MergeableCustomer {
  id: string
  name: string
  phone: string
  source?: string
  tags?: { id?: string; name: string; color?: string }[]
  [key: string]: unknown
}

// Field configuration for merge preview
export interface MergeFieldConfig {
  label: string
  key: string
}

interface MergeCustomersDialogProps {
  customers: MergeableCustomer[]
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: MergeFieldConfig[]
  onConfirm?: (primaryId: string, mergedIds: string[]) => void
}

export function MergeCustomersDialog({
  customers,
  open,
  onOpenChange,
  fields,
  onConfirm,
}: MergeCustomersDialogProps) {
  const [primaryId, setPrimaryId] = useState("")
  const [step, setStep] = useState<"select" | "preview" | "done">("select")

  // Reset primary when customers change or dialog opens
  const actualPrimaryId = primaryId || customers[0]?.id || ""
  const primary = customers.find((c) => c.id === actualPrimaryId)
  const others = customers.filter((c) => c.id !== actualPrimaryId)

  // Early return if no customers
  if (!open || customers.length < 2) {
    return null
  }

  // Merge field: when same field has data in multiple records, join with semicolon
  const mergeField = (key: string) => {
    const values = customers
      .map((c) => String((c as Record<string, unknown>)[key] || ""))
      .filter(Boolean)
    const unique = [...new Set(values)]
    return unique.join("; ")
  }

  // Merge all tags
  const mergedTags = [...new Map(
    customers.flatMap((c) => c.tags || []).map((t) => [t.name, t])
  ).values()]

  const handleConfirm = () => {
    setStep("done")
    onConfirm?.(actualPrimaryId, others.map((c) => c.id))
  }

  const handleClose = () => {
    setStep("select")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-3 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Merge className="h-4 w-4 text-primary" />
            客户信息合并
          </DialogTitle>
          <DialogDescription className="text-xs">
            {"将" + customers.length + "条重复客户记录合并为一条，合并后相同字段数据以分号分隔保留，所有动态信息一同合并"}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {step === "select" && (
              <>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800 space-y-1">
                      <p className="font-medium">合并操作不可撤销，请谨慎操作</p>
                      <p>合并后，被合并客户的全部跟进记录、订单记录、标签等动态信息将归入主客户名下</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">{"选择主客户（合并后保留此客户）"}</label>
                  <div className="space-y-2">
                    {customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setPrimaryId(c.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          actualPrimaryId === c.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={actualPrimaryId === c.id}
                            onChange={() => setPrimaryId(c.id)}
                            className="h-4 w-4 text-primary"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {c.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{c.name}</span>
                              <span className="text-xs text-muted-foreground">{c.phone}</span>
                              {actualPrimaryId === c.id && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                                  主客户
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              {c.source && <span>{String(c.source)}</span>}
                            </div>
                          </div>
                        </div>
                        {c.tags && c.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 ml-14">
                            {c.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === "preview" && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium">字段合并预览</label>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs w-24">字段</TableHead>
                          {customers.map((c) => (
                            <TableHead key={c.id} className="text-xs">
                              {c.name}{" "}
                              {c.id === actualPrimaryId && (
                                <Badge className="text-[10px] ml-1 px-1 py-0 bg-primary/10 text-primary border-primary/20">
                                  主
                                </Badge>
                              )}
                            </TableHead>
                          ))}
                          <TableHead className="text-xs bg-emerald-50 text-emerald-700">合并结果</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field) => {
                          const merged = mergeField(field.key)
                          return (
                            <TableRow key={field.key}>
                              <TableCell className="text-xs font-medium text-muted-foreground">
                                {field.label}
                              </TableCell>
                              {customers.map((c) => (
                                <TableCell key={c.id} className="text-xs">
                                  {String((c as Record<string, unknown>)[field.key] || "-")}
                                </TableCell>
                              ))}
                              <TableCell className="text-xs font-medium bg-emerald-50/50 text-emerald-700">
                                {merged || "-"}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow>
                          <TableCell className="text-xs font-medium text-muted-foreground">标签</TableCell>
                          {customers.map((c) => (
                            <TableCell key={c.id}>
                              <div className="flex flex-wrap gap-0.5">
                                {(c.tags || []).map((t, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                                    {t.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                          <TableCell className="bg-emerald-50/50">
                            <div className="flex flex-wrap gap-0.5">
                              {mergedTags.map((t, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                                  {t.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <h4 className="text-xs font-medium text-blue-800 mb-2">动态信息合并说明</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>{"- 全部跟进记录将合并至主客户名下"}</p>
                    <p>{"- 全部订单记录将合并至主客户名下"}</p>
                    <p>{"- 全部标签（" + mergedTags.length + "个）将合并至主客户名下"}</p>
                    <p>{"- 被合并客户记录将标记为\"已合并\"状态，不再显示在列表中"}</p>
                  </div>
                </div>
              </>
            )}

            {step === "done" && (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">客户合并成功</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {"已将" + others.length + "条记录合并至 "}
                    <span className="font-medium text-foreground">{primary?.name}</span>
                    {" 名下"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        <DialogFooter className="px-5 py-3 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            {step === "select" && (
              <>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={handleClose}>
                  取消
                </Button>
                <Button size="sm" onClick={() => setStep("preview")}>
                  {"下一步：预览合并结果"}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </>
            )}
            {step === "preview" && (
              <>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setStep("select")}>
                  上一步
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirm}>
                  确认合并
                </Button>
              </>
            )}
            {step === "done" && (
              <>
                <div />
                <Button size="sm" onClick={handleClose}>
                  关闭
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
