"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
  Video,
  Calendar,
  Clock,
  User,
  Users,
  Copy,
  Check,
  Send,
  Link2,
  MessageSquare,
  Phone,
  QrCode,
  ExternalLink,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 客户信息接口
export interface CustomerForInterview {
  id: string
  name: string
  phone: string
  serviceType?: string
}

// 服务人员接口
export interface CaregiverForInterview {
  id: string
  name: string
  role: string
  avatar?: string
}

// 面试链接接口
export interface InterviewLink {
  role: "employer" | "caregiver" | "consultant"
  name: string
  link: string
  qrCode?: string
}

// 创建面试弹窗
export function CreateInterviewDialog({ 
  customer,
  open, 
  onOpenChange,
  caregivers = []
}: { 
  customer?: CustomerForInterview
  open: boolean
  onOpenChange: (open: boolean) => void
  caregivers?: CaregiverForInterview[]
}) {
  const [step, setStep] = useState<"form" | "links">("form")
  const [selectedCaregiver, setSelectedCaregiver] = useState<string>("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [notes, setNotes] = useState("")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  // 模拟服务人员列表
  const defaultCaregivers: CaregiverForInterview[] = caregivers.length > 0 ? caregivers : [
    { id: "N001", name: "李春华", role: "金牌月嫂" },
    { id: "N002", name: "王秀兰", role: "高级育婴师" },
    { id: "N003", name: "张美玲", role: "产康技师" },
  ]

  // 生成的面试链接
  const generatedLinks: InterviewLink[] = [
    { role: "employer", name: customer?.name || "雇主", link: `https://meet.youhou.com/iv-${Date.now()}-employer` },
    { role: "caregiver", name: defaultCaregivers.find(c => c.id === selectedCaregiver)?.name || "服务人员", link: `https://meet.youhou.com/iv-${Date.now()}-caregiver` },
    { role: "consultant", name: "顾问", link: `https://meet.youhou.com/iv-${Date.now()}-consultant` },
  ]

  const copyLink = (link: string, role: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(role)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleCreate = () => {
    if (selectedCaregiver && interviewDate && interviewTime) {
      setStep("links")
    }
  }

  const handleClose = () => {
    setStep("form")
    setSelectedCaregiver("")
    setInterviewDate("")
    setInterviewTime("")
    setNotes("")
    onOpenChange(false)
  }

  const roleConfig = {
    employer: { label: "雇主", icon: User, color: "text-blue-600 bg-blue-50" },
    caregiver: { label: "服务人员", icon: Heart, color: "text-rose-600 bg-rose-50" },
    consultant: { label: "顾问", icon: Users, color: "text-teal-600 bg-teal-50" },
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Video className="h-4 w-4 text-primary" />
            {step === "form" ? "发起视频面试" : "面试链接已生成"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {step === "form" 
              ? "安排雇主与服务人员的视频面试" 
              : "请将链接发送给对应的参与人员"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 py-2">
            {/* 雇主信息 */}
            {customer && (
              <div className="p-3 rounded-lg bg-muted/50">
                <Label className="text-xs text-muted-foreground">雇主</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {customer.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 选择服务人员 */}
            <div className="space-y-1.5">
              <Label className="text-xs">选择服务人员</Label>
              <Select value={selectedCaregiver} onValueChange={setSelectedCaregiver}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="选择参与面试的服务人员" />
                </SelectTrigger>
                <SelectContent>
                  {defaultCaregivers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <span>{c.name}</span>
                        <Badge variant="outline" className="text-[9px] h-4">{c.role}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 面试时间 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">面试日期</Label>
                <Input 
                  type="date" 
                  className="h-9 text-sm"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">面试时间</Label>
                <Input 
                  type="time" 
                  className="h-9 text-sm"
                  value={interviewTime}
                  onChange={e => setInterviewTime(e.target.value)}
                />
              </div>
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <Label className="text-xs">面试备注 (可选)</Label>
              <Textarea 
                placeholder="如有特殊说明请填写..."
                className="text-sm resize-none"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={handleClose}>
                取消
              </Button>
              <Button 
                size="sm" 
                className="h-8 text-xs"
                disabled={!selectedCaregiver || !interviewDate || !interviewTime}
                onClick={handleCreate}
              >
                <Video className="h-3 w-3 mr-1" />
                生成面试链接
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* 面试信息 */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{interviewDate}</span>
                <Clock className="h-4 w-4 text-primary ml-2" />
                <span className="font-medium">{interviewTime}</span>
              </div>
            </div>

            {/* 面试链接列表 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">面试链接（点击复制）</Label>
              {generatedLinks.map(link => {
                const config = roleConfig[link.role]
                const Icon = config.icon
                return (
                  <Card key={link.role} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded", config.color)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{config.label}: {link.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{link.link}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyLink(link.link, link.role)}
                        >
                          {copiedLink === link.role ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* 快捷发送 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">快捷发送</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 bg-transparent">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  发送短信
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 bg-transparent">
                  <Phone className="h-3 w-3 mr-1" />
                  微信通知
                </Button>
              </div>
            </div>

            {/* 打开面试小程序 */}
            <Button className="w-full h-9 text-sm" onClick={() => window.open(generatedLinks[2].link, '_blank')}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              打开面试小程序
            </Button>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={handleClose}>
                完成
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// 面试记录查看弹窗
export function InterviewHistoryDialog({
  customer,
  open,
  onOpenChange
}: {
  customer: CustomerForInterview
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const mockInterviews = [
    { id: "IV001", caregiver: "李春华", role: "金牌月嫂", date: "2025-01-22 14:00", status: "completed", duration: 25 },
    { id: "IV002", caregiver: "王秀兰", role: "育婴师", date: "2025-01-20 10:00", status: "cancelled" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Video className="h-4 w-4 text-primary" />
            面试记录 - {customer.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
          {mockInterviews.map(interview => (
            <Card key={interview.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-rose-100 text-rose-600">
                      {interview.caregiver.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{interview.caregiver}</p>
                    <p className="text-xs text-muted-foreground">{interview.role}</p>
                  </div>
                </div>
                <Badge variant={interview.status === "completed" ? "secondary" : "outline"} className="text-[10px]">
                  {interview.status === "completed" ? `已完成 ${interview.duration}分钟` : "已取消"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{interview.date}</span>
              </div>
              {interview.status === "completed" && (
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 bg-transparent">
                    查看回放
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 bg-transparent">
                    AI摘要
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
