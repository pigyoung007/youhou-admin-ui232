"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, X, UserPlus } from "lucide-react"

interface StudentInfo {
  name: string
  age: number
  certificateId: string
}

interface TransferModalProps {
  student?: StudentInfo
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TransferModal({
  student = { name: "李春华", age: 35, certificateId: "YS202501001" },
  open,
  onOpenChange,
}: TransferModalProps) {
  const [tags, setTags] = useState<string[]>(["耐心细致", "擅长烹饪"])
  const [tagInput, setTagInput] = useState("")
  const [jobStatus, setJobStatus] = useState("available")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          转为家政员
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            转入家政员池
          </DialogTitle>
          <DialogDescription>将学员资料转化为家政员档案，开始接单流程</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Student Info (Read-only) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h4 className="font-medium text-sm">学员信息</h4>
              <Badge variant="secondary" className="text-xs">
                只读
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">姓名</span>
                <span className="text-sm font-medium">{student.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">年龄</span>
                <span className="text-sm font-medium">{student.age} 岁</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">证书编号</span>
                <span className="text-sm font-medium font-mono">{student.certificateId}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Target Profile (Form) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-accent" />
              <h4 className="font-medium text-sm">目标档案</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobStatus">工作状态</Label>
                <Select value={jobStatus} onValueChange={setJobStatus}>
                  <SelectTrigger id="jobStatus">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待上岗</SelectItem>
                    <SelectItem value="available">可接单</SelectItem>
                    <SelectItem value="training">培训中</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">简历标签</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" variant="secondary" onClick={addTag}>
                    添加
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1 gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <Alert className="border-warning/50 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
            <AlertDescription className="text-sm text-warning-foreground">
              注意：此操作将创建新的家政员ID并关联历史培训记录。转化后学员状态将变更为"已转化"。
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto bg-transparent"
            onClick={() => onOpenChange?.(false)}
          >
            取消
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            确认转化
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
