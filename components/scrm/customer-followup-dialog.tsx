"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Phone, MessageSquare, User, Video, Clock, Plus, Play, Pause, FileText,
  ChevronRight, Mic, Edit, Download, Eye, MoreHorizontal, UserX, ArrowRightLeft, History
} from "lucide-react"
import { cn } from "@/lib/utils"

// 跟进记录类型
export interface FollowupRecord {
  id: string
  type: "phone" | "wechat" | "meeting" | "video" | "visit" | "interview" | "other"
  content: string
  time: string
  duration?: string
  consultantId: string
  consultantName: string
  consultantStatus: "active" | "resigned"
  handoverTo?: string
  hasRecording?: boolean
  recordingUrl?: string
  transcription?: string
}

// 客户信息（通用接口）
export interface CustomerForFollowup {
  id: string
  name: string
  phone: string
  intention?: "high" | "medium" | "low"
  serviceType?: string
  currentConsultantName?: string
  tags?: { id: string; name: string; color: string }[]
  followups: FollowupRecord[]
}

const intentionConfig = {
  high: { label: "高意向", className: "bg-green-100 text-green-700 border-green-200" },
  medium: { label: "中意向", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "低意向", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

const typeConfig: Record<string, { label: string; icon: typeof Phone; color: string }> = {
  phone: { label: "电话", icon: Phone, color: "bg-blue-100 text-blue-700" },
  wechat: { label: "微信", icon: MessageSquare, color: "bg-green-100 text-green-700" },
  meeting: { label: "到店", icon: User, color: "bg-purple-100 text-purple-700" },
  video: { label: "视频", icon: Video, color: "bg-rose-100 text-rose-700" },
  visit: { label: "上门", icon: User, color: "bg-amber-100 text-amber-700" },
  interview: { label: "面试", icon: User, color: "bg-indigo-100 text-indigo-700" },
  other: { label: "其他", icon: Clock, color: "bg-gray-100 text-gray-700" },
}

// 录音播放器组件
function RecordingPlayer({ record }: { record: FollowupRecord }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  if (!record.hasRecording) return null

  return (
    <div className="mt-2 p-2 bg-muted/30 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full" />
        </div>
        <span className="text-[10px] text-muted-foreground">{record.duration}</span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Download className="h-3 w-3 mr-1" />下载</Button>
      </div>
      {record.transcription && (
        <>
          <Button variant="ghost" size="sm" className="w-full justify-between text-[10px] h-6" onClick={() => setShowTranscript(!showTranscript)}>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />通话转写</span>
            <ChevronRight className={`h-3 w-3 transition-transform ${showTranscript ? "rotate-90" : ""}`} />
          </Button>
          {showTranscript && (
            <div className="p-2 bg-background rounded border text-[10px] whitespace-pre-wrap max-h-32 overflow-y-auto">
              {record.transcription}
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface CustomerFollowupDialogProps {
  customer: CustomerForFollowup | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerFollowupDialog({ customer, open, onOpenChange }: CustomerFollowupDialogProps) {
  const [showAddFollowup, setShowAddFollowup] = useState(false)
  const [newFollowupType, setNewFollowupType] = useState("phone")
  const [newFollowupContent, setNewFollowupContent] = useState("")
  
  // 顾问统计
  const consultantStats = useMemo(() => {
    const stats: Record<string, { name: string; count: number; status: string }> = {}
    if (customer) {
      customer.followups.forEach(f => {
        if (!stats[f.consultantId]) {
          stats[f.consultantId] = { name: f.consultantName, count: 0, status: f.consultantStatus }
        }
        stats[f.consultantId].count++
      })
    }
    return Object.entries(stats)
  }, [customer])

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2 pr-6">
            <History className="h-4 w-4 text-primary" />
            客户跟进记录
          </DialogTitle>
          <DialogDescription className="text-xs">查看完整跟进历史，包括离职顾问的记录</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col">
          {/* 客户信息头部 */}
          <div className="p-3 bg-muted/30 border-b shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">{customer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{customer.name}</h3>
                    {customer.intention && (
                      <Badge variant="outline" className={cn("text-[10px]", intentionConfig[customer.intention].className)}>
                        {intentionConfig[customer.intention].label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                    <span>{customer.phone}</span>
                    {customer.serviceType && <span>需求: {customer.serviceType}</span>}
                    {customer.currentConsultantName && <span>当前顾问: {customer.currentConsultantName}</span>}
                  </div>
                </div>
              </div>
              <Button size="sm" className="h-7 text-xs" onClick={() => setShowAddFollowup(true)}>
                <Plus className="h-3 w-3 mr-1" />新增跟进
              </Button>
            </div>

            {/* 顾问历史统计 */}
            {consultantStats.length > 1 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-[10px] text-muted-foreground mb-2">跟进顾问历史</p>
                <div className="flex flex-wrap gap-2">
                  {consultantStats.map(([id, stat]) => (
                    <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-background rounded border">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className={cn("text-[8px]", stat.status === "resigned" ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>
                          {stat.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px]">{stat.name}</span>
                      <Badge variant="secondary" className="text-[8px] h-4">{stat.count}条</Badge>
                      {stat.status === "resigned" && (
                        <Badge variant="outline" className="text-[8px] h-4 bg-gray-100 text-gray-500">已离职</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 跟进记录时间线 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-3 p-3">
              {customer.followups.length > 0 ? (
                customer.followups.map((record, index) => {
                  const config = typeConfig[record.type] || typeConfig.other
                  const TypeIcon = config.icon
                  const isResigned = record.consultantStatus === "resigned"
                  return (
                    <div key={record.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full shrink-0", config.color)}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        {index < customer.followups.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className={cn("flex-1 pb-3", isResigned && "opacity-80")}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] h-5">{config.label}</Badge>
                              <span className="text-[10px] text-muted-foreground">{record.time}</span>
                              {record.duration && <span className="text-[10px] text-muted-foreground">· {record.duration}</span>}
                            </div>
                            {/* 顾问信息 */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className={cn("text-[6px]", isResigned ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary")}>
                                  {record.consultantName.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-muted-foreground">{record.consultantName}</span>
                              {isResigned && (
                                <>
                                  <Badge variant="outline" className="text-[8px] h-4 bg-gray-100 text-gray-500 border-gray-200">
                                    <UserX className="h-2 w-2 mr-0.5" />已离职
                                  </Badge>
                                  {record.handoverTo && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <ArrowRightLeft className="h-2.5 w-2.5" />已交接给{record.handoverTo}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <p className="text-xs mt-1.5 leading-relaxed">{record.content}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-28">
                              <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />查看</DropdownMenuItem>
                              {!isResigned && <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>}
                              {record.hasRecording && <DropdownMenuItem className="text-xs"><Download className="h-3 w-3 mr-2" />下载录音</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <RecordingPlayer record={record} />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">暂无跟进记录</p>
                </div>
              )}
            </div>
          </div>

          {/* 新增跟进表单 */}
          {showAddFollowup && (
            <div className="border-t p-3 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">新增跟进记录</h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowAddFollowup(false)}>取消</Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={newFollowupType} onValueChange={setNewFollowupType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="跟进方式" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">电话</SelectItem>
                    <SelectItem value="wechat">微信</SelectItem>
                    <SelectItem value="meeting">到店</SelectItem>
                    <SelectItem value="video">视频</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="datetime-local" className="h-8 text-xs" defaultValue="2025-01-23T15:00" />
              </div>
              <Textarea 
                placeholder="请输入跟进内容..." 
                className="text-xs min-h-16 resize-none" 
                value={newFollowupContent}
                onChange={e => setNewFollowupContent(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1 h-8 text-xs bg-transparent"><Mic className="h-3 w-3 mr-1" />上传录音</Button>
                <Button className="flex-1 h-8 text-xs" onClick={() => { setShowAddFollowup(false); setNewFollowupContent("") }}>保存记录</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
