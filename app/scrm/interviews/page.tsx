"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Video,
  Play,
  Pause,
  Calendar,
  Clock,
  User,
  Users,
  Copy,
  Check,
  Sparkles,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Monitor,
  Settings,
  MessageSquare,
  Download,
  Volume2,
  Maximize2,
  SkipBack,
  SkipForward,
} from "lucide-react"

interface Interview {
  id: string
  employer: { name: string; phone: string; avatar?: string }
  caregiver: { name: string; role: string; avatar?: string }
  consultant: string
  scheduledAt: string
  duration?: number
  status: "waiting" | "ongoing" | "completed" | "cancelled"
  link: string
  videoUrl?: string
  transcript?: { time: string; speaker: string; text: string }[]
  summary?: { title: string; content: string }[]
}

const mockInterviews: Interview[] = [
  {
    id: "IV001",
    employer: { name: "张女士", phone: "138****1234" },
    caregiver: { name: "李春华", role: "金牌月嫂" },
    consultant: "李顾问",
    scheduledAt: "2025-01-23 14:00",
    status: "waiting",
    link: "https://meet.youhou.com/iv001",
  },
  {
    id: "IV002",
    employer: { name: "刘先生", phone: "139****5678" },
    caregiver: { name: "王秀兰", role: "高级育婴师" },
    consultant: "王顾问",
    scheduledAt: "2025-01-23 10:00",
    duration: 25,
    status: "completed",
    link: "https://meet.youhou.com/iv002",
    videoUrl: "/videos/iv002.mp4",
    summary: [
      { title: "雇主需求", content: "宝宝出生3个月，需要专业育婴师，希望能辅导早教启蒙，工作时间周一到周六8:00-18:00" },
      { title: "阿姨表现", content: "沟通清晰，态度亲和，专业知识扎实，有8年育婴经验，带过双胞胎" },
      { title: "匹配评估", content: "高度匹配 - 阿姨经验丰富，能满足雇主各项需求" },
      { title: "下一步", content: "雇主表示满意，等待最终确认，如确认可安排签约流程" },
    ],
    transcript: [
      { time: "00:00", speaker: "顾问", text: "大家好，今天的面试正式开始。先请刘先生介绍一下您的需求。" },
      { time: "00:15", speaker: "雇主", text: "好的，我们宝宝现在3个月大，想找一位专业的育婴师，主要是白天照顾宝宝。" },
      { time: "00:35", speaker: "顾问", text: "明白了。王姐，请您介绍一下自己的经验和特长。" },
      { time: "00:45", speaker: "阿姨", text: "好的，我从事育婴工作已经8年了，带过很多宝宝，包括双胞胎。我擅长辅食制作、早教互动和睡眠训练。" },
      { time: "01:15", speaker: "雇主", text: "请问您对早教有什么心得吗？我们比较重视宝宝的早期教育。" },
      { time: "01:30", speaker: "阿姨", text: "早教我很有经验，我会根据宝宝月龄制定互动计划，包括大运动、精细运动、语言启蒙等方面..." },
    ],
  },
  {
    id: "IV003",
    employer: { name: "陈女士", phone: "137****9012" },
    caregiver: { name: "张美玲", role: "产康技师" },
    consultant: "张顾问",
    scheduledAt: "2025-01-22 15:30",
    duration: 18,
    status: "completed",
    link: "https://meet.youhou.com/iv003",
    videoUrl: "/videos/iv003.mp4",
    summary: [
      { title: "客户需求", content: "产后42天，需要专业产康服务，重点关注骨盆修复和腹直肌分离" },
      { title: "顾虑点", content: "客户对服务价格有疑虑，建议提供套餐优惠" },
    ],
    transcript: [
      { time: "00:00", speaker: "顾问", text: "陈女士您好，今天我们为您介绍张美玲老师。" },
      { time: "00:10", speaker: "雇主", text: "您好，我想了解一下产康服务的具体内容。" },
    ],
  },
  {
    id: "IV004",
    employer: { name: "王先生", phone: "136****3456" },
    caregiver: { name: "赵丽华", role: "月嫂" },
    consultant: "李顾问",
    scheduledAt: "2025-01-22 09:00",
    status: "cancelled",
    link: "https://meet.youhou.com/iv004",
  },
]

const statusConfig = {
  waiting: { label: "待进行", className: "bg-blue-50 text-blue-600 border-blue-200" },
  ongoing: { label: "进行中", className: "bg-green-50 text-green-600 border-green-200 animate-pulse" },
  completed: { label: "已完成", className: "bg-gray-50 text-gray-600 border-gray-200" },
  cancelled: { label: "已取消", className: "bg-red-50 text-red-600 border-red-200" },
}

function InterviewWindow({ interview, onClose }: { interview: Interview; onClose: () => void }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isRecording, setIsRecording] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(125) // 2:05

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gray-800/90 backdrop-blur flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500 text-white border-0">
            <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse" />
            录制中
          </Badge>
          <span className="text-white/80 text-sm">{formatTime(elapsedTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">{interview.employer.name} & {interview.caregiver.name}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={onClose}>
          结束面试
        </Button>
      </div>

      {/* Main Video Grid */}
      <div className="h-full pt-14 pb-24 px-4 flex gap-4">
        {/* Main Video */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Employer Video */}
            <div className="bg-gray-800 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                    {interview.employer.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/50 px-2 py-1 rounded text-white text-sm">
                {interview.employer.name} (雇主)
              </div>
            </div>
            {/* Caregiver Video */}
            <div className="bg-gray-800 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-rose-500/20 text-rose-500 text-3xl">
                    {interview.caregiver.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/50 px-2 py-1 rounded text-white text-sm">
                {interview.caregiver.name} ({interview.caregiver.role})
              </div>
            </div>
          </div>
          {/* Self View */}
          <div className="h-32 bg-gray-800 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-teal-500/20 text-teal-500 text-xl">
                  {interview.consultant.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-white text-xs">
              {interview.consultant} (顾问)
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 rounded-xl flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-medium text-sm">实时记录</h3>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              <div className="text-xs text-gray-400">系统自动记录面试内容</div>
              <div className="space-y-2">
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-teal-400">顾问</span>
                    <span className="text-xs text-gray-500">00:00</span>
                  </div>
                  <p className="text-sm text-gray-300">大家好，今天的面试正式开始。</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-blue-400">雇主</span>
                    <span className="text-xs text-gray-500">00:15</span>
                  </div>
                  <p className="text-sm text-gray-300">好的，我们宝宝现在3个月大...</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-rose-400">阿姨</span>
                    <span className="text-xs text-gray-500">00:45</span>
                  </div>
                  <p className="text-sm text-gray-300">我从事育婴工作已经8年了...</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-800/90 backdrop-blur flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="lg"
          className={`rounded-full h-14 w-14 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className={`rounded-full h-14 w-14 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={() => setIsVideoOff(!isVideoOff)}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <Video className="h-6 w-6 text-white" />}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-14 w-14 bg-gray-700 hover:bg-gray-600"
        >
          <Monitor className="h-6 w-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600"
          onClick={onClose}
        >
          <PhoneOff className="h-7 w-7 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-14 w-14 bg-gray-700 hover:bg-gray-600"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-14 w-14 bg-gray-700 hover:bg-gray-600"
        >
          <Settings className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  )
}

function InterviewReplayDialog({ interview, open, onOpenChange }: { interview: Interview; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const totalDuration = (interview.duration || 25) * 60

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <Video className="h-5 w-5 text-primary" />
              面试回放 - {interview.employer.name} & {interview.caregiver.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {interview.scheduledAt} · 时长 {interview.duration}分钟
            </p>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Video Section */}
            <div className="flex-1 flex flex-col bg-gray-900 min-w-0">
              {/* Video Player */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">面试录像</p>
                </div>
              </div>
              {/* Video Controls */}
              <div className="p-4 bg-gray-800 shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-400 w-12">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12">{formatTime(totalDuration)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="ml-4 flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Summary & Transcript */}
            <div className="w-80 lg:w-96 border-l flex flex-col shrink-0 min-h-0 overflow-hidden">
              <Tabs defaultValue="summary" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <TabsList className="w-full rounded-none border-b bg-transparent p-0 h-auto shrink-0">
                  <TabsTrigger value="summary" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-sm">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    AI摘要
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-sm">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    对话转写
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="flex-1 m-0 min-h-0 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {interview.summary?.map((item, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{item.title}</span>
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="transcript" className="flex-1 m-0 min-h-0 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {interview.transcript?.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="text-xs text-muted-foreground w-10 shrink-0 pt-0.5 tabular-nums">{item.time}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-medium ${
                            item.speaker === '顾问' ? 'text-teal-600' :
                            item.speaker === '雇主' ? 'text-blue-600' : 'text-rose-600'
                          }`}>
                            {item.speaker}
                          </span>
                          <p className="text-sm text-foreground mt-1 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CreateInterviewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>创建面试</DialogTitle>
          <DialogDescription>安排雇主与服务人员的视频面试</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">选择雇主</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="搜索或选择雇主" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zhang">张女士 (138****1234)</SelectItem>
                <SelectItem value="liu">刘先生 (139****5678)</SelectItem>
                <SelectItem value="chen">陈女士 (137****9012)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">选择服务人员</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="搜索或选择服务人员" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="li">李春华 - 金牌月嫂</SelectItem>
                <SelectItem value="wang">王秀兰 - 高级育婴师</SelectItem>
                <SelectItem value="zhang">张美玲 - 产康技师</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">面试时间</label>
            <Input type="datetime-local" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">备注</label>
            <Textarea placeholder="填写面试备注..." className="resize-none" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button>生成面试链接</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function InterviewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null)
  const [replayInterview, setReplayInterview] = useState<Interview | null>(null)

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const todayInterviews = mockInterviews.filter((i) => i.scheduledAt.includes("2025-01-23"))

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">面试管理</h1>
            <p className="text-muted-foreground mt-1">管理雇主与服务人员的视频面试</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建面试
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                  <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold tabular-nums truncate">{todayInterviews.length}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">今日面试</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold tabular-nums truncate">5</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">待进行</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
                  <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold tabular-nums truncate">42</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">本月完成</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 flex-shrink-0">
                  <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold tabular-nums truncate">78%</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">匹配成功率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索雇主/服务人员" className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="waiting">待进行</SelectItem>
                  <SelectItem value="ongoing">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="顾问" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部顾问</SelectItem>
                  <SelectItem value="li">李顾问</SelectItem>
                  <SelectItem value="wang">王顾问</SelectItem>
                  <SelectItem value="zhang">张顾问</SelectItem>
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
                <TableHead>参与方</TableHead>
                <TableHead>顾问</TableHead>
                <TableHead>面试时间</TableHead>
                <TableHead>时长</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInterviews.map((interview) => (
                <TableRow key={interview.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {interview.employer.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{interview.employer.name}</p>
                          <p className="text-xs text-muted-foreground">雇主</p>
                        </div>
                      </div>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-rose-50 text-rose-600 text-sm">
                            {interview.caregiver.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{interview.caregiver.name}</p>
                          <p className="text-xs text-muted-foreground">{interview.caregiver.role}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{interview.consultant}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{interview.scheduledAt}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {interview.duration ? `${interview.duration}分钟` : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[interview.status].className}>
                      {statusConfig[interview.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {interview.status === "waiting" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyLink(interview.id, interview.link)}
                          >
                            {copied === interview.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" onClick={() => setActiveInterview(interview)}>
                            <Video className="h-3 w-3 mr-1" />
                            开始
                          </Button>
                        </>
                      )}
                      {interview.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => setReplayInterview(interview)}>
                          <Play className="h-3 w-3 mr-1" />
                          回放
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">共 48 条记录</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateInterviewDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      
      {activeInterview && (
        <InterviewWindow interview={activeInterview} onClose={() => setActiveInterview(null)} />
      )}

      {replayInterview && (
        <InterviewReplayDialog 
          interview={replayInterview} 
          open={!!replayInterview} 
          onOpenChange={(open) => !open && setReplayInterview(null)} 
        />
      )}
    </AdminLayout>
  )
}
