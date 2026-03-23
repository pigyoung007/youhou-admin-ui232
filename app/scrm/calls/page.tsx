"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Phone,
  Play,
  Pause,
  Clock,
  FileText,
  Sparkles,
  Tag,
  Calendar,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Download,
  Volume2,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import LoadingComponent from "./loading"

interface CallRecord {
  id: string
  leadName: string
  leadPhone: string
  consultant: string
  duration: string
  durationSeconds: number // 通话时长（秒）
  recordedAt: string
  hasTranscript: boolean
  hasSummary: boolean
  tags: string[]
  notes: string
  status: "transcribed" | "pending" | "processing"
  // 新增字段
  callType: "outbound" | "inbound" // 呼出/呼入
  connected: boolean // 是否接通
  callResult: "成功" | "未接" | "忙音" | "关机" | "空号" | "拒接" // 呼叫结果
}

const mockCalls: CallRecord[] = [
  {
    id: "C001",
    leadName: "张女士",
    leadPhone: "138****1234",
    consultant: "李顾问",
    duration: "8:32",
    durationSeconds: 512,
    recordedAt: "2025-01-23 10:30",
    hasTranscript: true,
    hasSummary: true,
    tags: ["高意向", "月嫂需求", "预产期3月"],
    notes: "客户对金牌月嫂有明确需求，预算充足",
    status: "transcribed",
    callType: "outbound",
    connected: true,
    callResult: "成功",
  },
  {
    id: "C002",
    leadName: "李先生",
    leadPhone: "139****5678",
    consultant: "王顾问",
    duration: "5:15",
    durationSeconds: 315,
    recordedAt: "2025-01-23 09:45",
    hasTranscript: true,
    hasSummary: true,
    tags: ["育婴师", "价格敏感"],
    notes: "需要育婴师，对价格比较关注",
    status: "transcribed",
    callType: "outbound",
    connected: true,
    callResult: "成功",
  },
  {
    id: "C003",
    leadName: "王女士",
    leadPhone: "137****9012",
    consultant: "张顾问",
    duration: "12:48",
    durationSeconds: 768,
    recordedAt: "2025-01-22 16:20",
    hasTranscript: true,
    hasSummary: false,
    tags: ["产康服务"],
    notes: "",
    status: "processing",
    callType: "inbound",
    connected: true,
    callResult: "成功",
  },
  {
    id: "C004",
    leadName: "赵先生",
    leadPhone: "136****3456",
    consultant: "李顾问",
    duration: "0:00",
    durationSeconds: 0,
    recordedAt: "2025-01-22 14:10",
    hasTranscript: false,
    hasSummary: false,
    tags: [],
    notes: "",
    status: "pending",
    callType: "outbound",
    connected: false,
    callResult: "未接",
  },
  {
    id: "C005",
    leadName: "刘女士",
    leadPhone: "135****7890",
    consultant: "李顾问",
    duration: "6:45",
    durationSeconds: 405,
    recordedAt: "2025-01-22 11:20",
    hasTranscript: true,
    hasSummary: true,
    tags: ["月嫂需求", "二胎"],
    notes: "二胎客户，有月嫂使用经验",
    status: "transcribed",
    callType: "outbound",
    connected: true,
    callResult: "成功",
  },
  {
    id: "C006",
    leadName: "陈先生",
    leadPhone: "158****2345",
    consultant: "王顾问",
    duration: "0:00",
    durationSeconds: 0,
    recordedAt: "2025-01-22 10:05",
    hasTranscript: false,
    hasSummary: false,
    tags: [],
    notes: "",
    status: "pending",
    callType: "outbound",
    connected: false,
    callResult: "忙音",
  },
  {
    id: "C007",
    leadName: "周女士",
    leadPhone: "186****6789",
    consultant: "张顾问",
    duration: "4:20",
    durationSeconds: 260,
    recordedAt: "2025-01-21 15:30",
    hasTranscript: true,
    hasSummary: true,
    tags: ["产康服务", "高意向"],
    notes: "对产后修复很感兴趣",
    status: "transcribed",
    callType: "inbound",
    connected: true,
    callResult: "成功",
  },
]

const mockTranscript = `
[00:00] 顾问：您好，这里是优厚家庭服务，请问是张女士吗？
[00:05] 客户：是的，我是。
[00:08] 顾问：张女士您好，我是您的专属顾问小李。之前看到您在我们平台咨询过月嫂服务，想了解一下您的具体需求。
[00:18] 客户：对的，我预产期是3月中旬，想找一个经验丰富的月嫂。
[00:25] 顾问：好的，请问您对月嫂有什么特别的要求吗？比如技能方面或者性格方面？
[00:32] 客户：希望有5年以上经验的，最好是金牌月嫂。性格要温和一点，因为我们家老人也会帮忙带。
[00:45] 顾问：明白了。我们有几位非常优秀的金牌月嫂，都有8年以上的经验，之前服务的客户评价都很好。
[00:58] 客户：那价格大概是多少？
[01:02] 顾问：金牌月嫂的价格在15800到19800之间，根据具体的服务内容和时长会有所不同。
[01:15] 客户：嗯，这个价格可以接受。能给我推荐几个合适的吗？
[01:22] 顾问：当然可以。我今天就给您整理几份简历发过去，您看完之后我们可以安排视频面试。
...
`

const mockSummary = `
## 通话摘要

### 客户信息
- 姓名：张女士
- 预产期：2025年3月中旬
- 需求：金牌月嫂

### 核心诉求
1. 希望找5年以上经验的金牌月嫂
2. 性格温和，能与家中老人配合
3. 预算充足，15800-19800可接受

### 下一步行动
- 整理3份金牌月嫂简历发送给客户
- 等待客户反馈后安排视频面试

### 意向评估
**高意向** - 需求明确，预算充足，时间紧迫
`

function CallDetailDialog({ call }: { call: CallRecord }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("transcript")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          查看详情
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-primary" />
            通话详情 - {call.leadName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Call Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{call.leadPhone}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{call.consultant}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{call.recordedAt}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{call.duration}</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-transparent flex-shrink-0"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>02:45</span>
                <span>{call.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="summary" className="text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI摘要
              </TabsTrigger>
              <TabsTrigger value="transcript" className="text-xs gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                对话转写
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                标签备注
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-3">
              <div className="border rounded-lg p-3">
                {call.hasSummary ? (
                  <ScrollArea className="h-[220px]">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{mockSummary}</pre>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">AI摘要生成中...</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-3">
              <div className="border rounded-lg p-3">
                <ScrollArea className="h-[220px]">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{mockTranscript}</pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-3">
              <div className="border rounded-lg p-3 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">标签</label>
                  <div className="flex flex-wrap gap-1.5">
                    {call.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                      + 添加
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">备注</label>
                  <textarea
                    className="w-full h-24 p-2.5 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="添加备注..."
                    defaultValue={call.notes}
                  />
                </div>
                <Button size="sm" className="w-full">保存备注</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CallsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()

  const statusConfig = {
    transcribed: { label: "已转写", className: "bg-green-500/10 text-green-600 border-green-500/30" },
    processing: { label: "处理中", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    pending: { label: "待处理", className: "bg-muted text-muted-foreground" },
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">通话录音</h1>
          <p className="text-muted-foreground mt-1">管理客户通话录音、AI转写和摘要</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">156</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">本月通话</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 flex-shrink-0">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">142</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">已转写</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 flex-shrink-0">
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">128</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">AI摘要</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 flex-shrink-0">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">6:45</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">平均时长</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索客户姓名/电话" className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="顾问" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部顾问</SelectItem>
                  <SelectItem value="li">李顾问</SelectItem>
                  <SelectItem value="wang">王顾问</SelectItem>
                  <SelectItem value="zhang">张顾问</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="transcribed">已转写</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Call Records List */}
        <div className="space-y-3">
          {mockCalls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {call.leadName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{call.leadName}</span>
                        <span className="text-sm text-muted-foreground">{call.leadPhone}</span>
                        <Badge variant="outline" className={statusConfig[call.status].className}>
                          {statusConfig[call.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {call.consultant}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {call.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {call.recordedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {call.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {call.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      播放
                    </Button>
                    <CallDetailDialog call={call} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">156</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
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
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export { LoadingComponent }
