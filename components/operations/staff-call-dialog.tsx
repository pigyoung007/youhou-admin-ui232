"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Tag,
  Clock,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface StaffForCall {
  id: string
  name: string
  phone: string // 完整手机号（系统内部）
  maskedPhone: string // 脱敏显示的手机号
  role: string
  status?: string
}

interface StaffCallDialogProps {
  staff: StaffForCall
  open: boolean
  onOpenChange: (open: boolean) => void
  staffType?: "nanny" | "infant-care" | "tech"
}

export function StaffCallDialog({ staff, open, onOpenChange, staffType = "nanny" }: StaffCallDialogProps) {
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [callDuration, setCallDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [callNote, setCallNote] = useState("")
  const [showWechatInfo, setShowWechatInfo] = useState(false)
  const [copiedWechat, setCopiedWechat] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("note")

  const staffTypeLabel = staffType === "nanny" ? "月嫂" : staffType === "infant-care" ? "育婴师" : "产康技师"

  const startCall = () => {
    setCallStatus("calling")
    setTimeout(() => setCallStatus("connected"), 2000)
  }

  const endCall = () => {
    setCallStatus("ended")
    // 模拟检测到手机号即微信号
    setShowWechatInfo(true)
  }

  const copyWechat = () => {
    navigator.clipboard.writeText(staff.phone)
    setCopiedWechat(true)
    setTimeout(() => setCopiedWechat(false), 2000)
  }

  const quickTags = ["可接单", "档期已满", "技能提升中", "证书待更新", "表现优秀", "需要培训"]

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClose = () => {
    onOpenChange(false)
    setCallStatus("idle")
    setCallNote("")
    setShowWechatInfo(false)
    setSelectedTags([])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-sm pr-6">
            <Phone className="h-4 w-4 text-primary" />
            <span>联系{staffTypeLabel}</span>
            {isRecording && callStatus === "connected" && (
              <Badge variant="destructive" className="text-[9px] h-4 animate-pulse">录音中</Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs">
            电话号码已隐藏保护隐私
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* 人员信息 */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-rose-100 text-rose-700 text-lg font-medium">
                {staff.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{staff.name}</h3>
                <Badge variant="outline" className="text-[10px]">{staff.role}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{staff.maskedPhone}</p>
            </div>
          </div>

          {callStatus === "idle" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs text-blue-700">
                <span className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  通话将自动录音并AI转写
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] text-blue-600"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? "关闭录音" : "开启录音"}
                </Button>
              </div>
              <Button className="w-full h-12" onClick={startCall}>
                <PhoneCall className="h-5 w-5 mr-2" />
                拨打电话
              </Button>
            </div>
          )}

          {callStatus === "calling" && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">正在呼叫...</p>
              <p className="text-xs text-muted-foreground">{staff.maskedPhone}</p>
              <Button variant="destructive" size="sm" onClick={() => setCallStatus("idle")}>
                取消呼叫
              </Button>
            </div>
          )}

          {callStatus === "connected" && (
            <div className="space-y-4">
              {/* 通话状态 */}
              <div className="text-center py-4 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-7 w-7 text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-600">{formatDuration(callDuration)}</p>
                <p className="text-xs text-muted-foreground">通话中 - {staff.name}</p>
              </div>

              {/* 通话控制 */}
              <div className="flex justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  className={cn("h-12 w-12 rounded-full", !isMuted && "bg-transparent")}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={endCall}
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-transparent">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>

              {/* 快速记录 */}
              <div className="space-y-2">
                <Label className="text-xs">快速记录</Label>
                <Textarea
                  placeholder="记录通话要点..."
                  className="text-xs resize-none"
                  rows={2}
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                />
              </div>
            </div>
          )}

          {callStatus === "ended" && (
            <div className="space-y-4">
              {/* 微信识别提示 */}
              {showWechatInfo && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">检测到微信号</span>
                    <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px]">手机号即微信</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="text-xs text-muted-foreground">微信号</p>
                      <p className="font-medium">{staff.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-transparent"
                        onClick={copyWechat}
                      >
                        {copiedWechat ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {copiedWechat ? "已复制" : "复制"}
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                        <QrCode className="h-3 w-3 mr-1" />
                        二维码
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-green-600 mt-2">可直接添加该微信号联系{staffTypeLabel}</p>
                </Card>
              )}

              {/* 通话记录标签页 */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full h-8">
                  <TabsTrigger value="note" className="flex-1 text-xs h-6">通话记录</TabsTrigger>
                  <TabsTrigger value="transcript" className="flex-1 text-xs h-6">AI转写</TabsTrigger>
                  <TabsTrigger value="tags" className="flex-1 text-xs h-6">快速打标</TabsTrigger>
                </TabsList>

                <TabsContent value="note" className="mt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      通话时长: {formatDuration(callDuration || 185)}
                    </span>
                    <span>2025-01-23 14:30</span>
                  </div>
                  <Textarea
                    placeholder="补充通话详情..."
                    className="text-xs resize-none"
                    rows={3}
                    value={callNote}
                    onChange={(e) => setCallNote(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="transcript" className="mt-3">
                  <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">AI通话摘要</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      与{staff.name}确认了近期档期情况，目前正在服务中的订单预计2月底结束，
                      3月初可以安排新的订单。{staffTypeLabel}表示身体状况良好，可以正常接单。
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs bg-transparent">
                    <Download className="h-3 w-3 mr-1" />
                    下载完整转写
                  </Button>
                </TabsContent>

                <TabsContent value="tags" className="mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">快速打标</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          className={cn("h-6 text-[10px]", !selectedTags.includes(tag) && "bg-transparent")}
                          onClick={() => toggleTag(tag)}
                        >
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* 保存按钮 */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 h-8 text-xs bg-transparent" onClick={handleClose}>
                  关闭
                </Button>
                <Button className="flex-1 h-8 text-xs">
                  保存记录
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
