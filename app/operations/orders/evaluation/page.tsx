"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Star, Search, Plus, Eye, MessageSquare, ThumbsUp, ThumbsDown,
  TrendingUp, Users, Award, AlertTriangle, Heart, Clock, CheckCircle2, Flag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Evaluation {
  id: string
  orderId: string
  customer: string
  phone: string
  staff: string
  serviceType: string
  service: string
  overallRating: number
  attitudeRating: number
  skillRating: number
  timeRating: number
  communicationRating: number
  tags: string[]
  comment: string
  reply: string
  status: "pending" | "replied" | "flagged"
  evaluateTime: string
  replyTime: string
  source: "客户评价" | "回访评价" | "系统自动"
}

const evaluations: Evaluation[] = [
  {
    id: "EVL001", orderId: "ORD202501003", customer: "王女士", phone: "137****9876",
    staff: "张美玲", serviceType: "育婴服务", service: "育婴师月度",
    overallRating: 5, attitudeRating: 5, skillRating: 5, timeRating: 5, communicationRating: 5,
    tags: ["非常专业", "细心耐心", "推荐"],
    comment: "张阿姨非常专业，对宝宝照顾得特别细心，全家都非常满意！强烈推荐给其他家庭！",
    reply: "感谢您的认可，我们会继续保持优质服务！",
    status: "replied", evaluateTime: "2025-01-02 10:30", replyTime: "2025-01-02 14:00",
    source: "客户评价",
  },
  {
    id: "EVL002", orderId: "ORD202501009", customer: "钱先生", phone: "136****4567",
    staff: "赵小燕", serviceType: "育婴服务", service: "育婴师月度",
    overallRating: 4, attitudeRating: 4, skillRating: 5, timeRating: 4, communicationRating: 3,
    tags: ["技能专业", "准时"],
    comment: "整体满意，技能方面很专业，但沟通上有时不够主动。",
    reply: "",
    status: "pending", evaluateTime: "2024-12-16 11:00", replyTime: "",
    source: "回访评价",
  },
  {
    id: "EVL003", orderId: "ORD202501012", customer: "徐先生", phone: "137****6789",
    staff: "周小芳", serviceType: "育婴服务", service: "育婴师月度",
    overallRating: 5, attitudeRating: 5, skillRating: 5, timeRating: 5, communicationRating: 5,
    tags: ["非常满意", "细心", "强烈推荐"],
    comment: "周阿姨各方面都很棒，孩子也很喜欢她，下次还会选择。",
    reply: "非常感谢您的好评，期待再次为您服务！",
    status: "replied", evaluateTime: "2025-01-11 09:00", replyTime: "2025-01-11 10:30",
    source: "客户评价",
  },
  {
    id: "EVL004", orderId: "ORD202501015", customer: "高先生", phone: "159****8901",
    staff: "陈小玲", serviceType: "育婴服务", service: "育婴师月度",
    overallRating: 5, attitudeRating: 5, skillRating: 5, timeRating: 5, communicationRating: 5,
    tags: ["完美", "专业", "贴心"],
    comment: "完美的服务体验，陈阿姨非常专业和贴心！",
    reply: "谢谢您的信任与支持！",
    status: "replied", evaluateTime: "2024-12-21 15:00", replyTime: "2024-12-21 17:00",
    source: "客户评价",
  },
  {
    id: "EVL005", orderId: "ORD202501017", customer: "梁女士", phone: "188****6789",
    staff: "孙小红", serviceType: "产康服务", service: "产康套餐8次",
    overallRating: 4, attitudeRating: 5, skillRating: 4, timeRating: 4, communicationRating: 5,
    tags: ["态度好", "效果不错"],
    comment: "产康师态度很好，手法也不错，效果可以感受到。",
    reply: "",
    status: "pending", evaluateTime: "2025-01-16 14:00", replyTime: "",
    source: "回访评价",
  },
  {
    id: "EVL006", orderId: "ORD202501001", customer: "刘女士", phone: "138****5678",
    staff: "李春华", serviceType: "月嫂服务", service: "金牌月嫂26天",
    overallRating: 2, attitudeRating: 3, skillRating: 2, timeRating: 2, communicationRating: 3,
    tags: ["不够专业", "需改进"],
    comment: "对月嫂的专业度有些失望，煮饭不太好吃，夜间反应也不够及时。",
    reply: "",
    status: "flagged", evaluateTime: "2025-02-11 09:00", replyTime: "",
    source: "客户评价",
  },
  {
    id: "EVL007", orderId: "ORD202501004", customer: "赵女士", phone: "136****5432",
    staff: "陈桂芳", serviceType: "月嫂服务", service: "金牌月嫂42天",
    overallRating: 5, attitudeRating: 5, skillRating: 5, timeRating: 5, communicationRating: 5,
    tags: ["金牌月嫂", "VIP服务", "无可挑剔"],
    comment: "陈阿姨是我们遇到最好的月嫂，各方面都无可挑剔，非常专业，VIP级的体验！",
    reply: "感谢赵女士的高度认可，陈桂芳老师将继续为更多家庭提供优质服务！",
    status: "replied", evaluateTime: "2025-02-12 10:00", replyTime: "2025-02-12 11:30",
    source: "客户评价",
  },
  {
    id: "EVL008", orderId: "ORD202501010", customer: "冯女士", phone: "188****8901",
    staff: "孙美华", serviceType: "月嫂服务", service: "金牌月嫂26天",
    overallRating: 5, attitudeRating: 5, skillRating: 4, timeRating: 5, communicationRating: 5,
    tags: ["认真负责", "态度好"],
    comment: "孙阿姨很认真负责，态度很好，照顾宝宝和月子餐都不错。",
    reply: "",
    status: "pending", evaluateTime: "2025-02-08 16:00", replyTime: "",
    source: "系统自动",
  },
]

const statusConfig = {
  pending: { label: "待回复", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  replied: { label: "已回复", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  flagged: { label: "需关注", color: "bg-red-100 text-red-700 border-red-200", icon: Flag },
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn(sizeClass, i <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")} />
      ))}
    </div>
  )
}

function EvaluationDetailDialog({ evaluation, trigger }: { evaluation: Evaluation; trigger: React.ReactNode }) {
  const [replyText, setReplyText] = useState(evaluation.reply)

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />评价详情</DialogTitle>
          <DialogDescription className="text-xs">订单 {evaluation.orderId} 的服务评价</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Customer & Staff Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{evaluation.customer[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{evaluation.customer}</p>
                <p className="text-[10px] text-muted-foreground">{evaluation.phone}</p>
              </div>
            </div>
            <Badge variant="outline" className={cn("text-[10px]", statusConfig[evaluation.status].color)}>
              {statusConfig[evaluation.status].label}
            </Badge>
          </div>

          <Separator />

          {/* Service Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">服务类型：</span>{evaluation.serviceType}</div>
            <div><span className="text-muted-foreground">服务内容：</span>{evaluation.service}</div>
            <div><span className="text-muted-foreground">服务人员：</span>{evaluation.staff}</div>
            <div><span className="text-muted-foreground">评价来源：</span>{evaluation.source}</div>
          </div>

          <Separator />

          {/* Ratings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">综合评分</span>
              <div className="flex items-center gap-2">
                <StarRating rating={evaluation.overallRating} size="md" />
                <span className="text-sm font-bold text-amber-600">{evaluation.overallRating}.0</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "服务态度", rating: evaluation.attitudeRating },
                { label: "专业技能", rating: evaluation.skillRating },
                { label: "时间观念", rating: evaluation.timeRating },
                { label: "沟通能力", rating: evaluation.communicationRating },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-muted/30 rounded-md px-2 py-1.5">
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={item.rating} />
                    <span className="text-[10px] font-medium">{item.rating}.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {evaluation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {evaluation.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px] h-5 bg-primary/5 border-primary/20 text-primary">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Comment */}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground mb-1">客户评价</p>
            <p className="text-xs leading-relaxed">{evaluation.comment}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{evaluation.evaluateTime}</p>
          </div>

          {/* Reply */}
          {evaluation.reply ? (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-[10px] text-emerald-600 mb-1">商家回复</p>
              <p className="text-xs leading-relaxed text-emerald-800">{evaluation.reply}</p>
              <p className="text-[10px] text-emerald-500 mt-2">{evaluation.replyTime}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs">回复评价</Label>
              <Textarea
                placeholder="请输入回复内容..."
                className="text-xs min-h-[80px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" />提交回复</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ServiceEvaluationPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")

  const stats = useMemo(() => {
    const total = evaluations.length
    const avgRating = (evaluations.reduce((s, e) => s + e.overallRating, 0) / total).toFixed(1)
    const fiveStarCount = evaluations.filter(e => e.overallRating === 5).length
    const fiveStarRate = ((fiveStarCount / total) * 100).toFixed(0)
    const pending = evaluations.filter(e => e.status === "pending").length
    const flagged = evaluations.filter(e => e.status === "flagged").length
    const replied = evaluations.filter(e => e.status === "replied").length
    return { total, avgRating, fiveStarRate, fiveStarCount, pending, flagged, replied }
  }, [])

  const filtered = useMemo(() => {
    return evaluations.filter(e => {
      const matchTab = activeTab === "all" || e.status === activeTab
      const matchSearch = !searchTerm || e.customer.includes(searchTerm) || e.staff.includes(searchTerm) || e.orderId.includes(searchTerm)
      const matchRating = ratingFilter === "all" || (ratingFilter === "good" && e.overallRating >= 4) || (ratingFilter === "bad" && e.overallRating <= 3)
      return matchTab && matchSearch && matchRating
    })
  }, [activeTab, searchTerm, ratingFilter])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold">服务评价</h1>
          <p className="text-xs text-muted-foreground">管理客户对服务的评价与反馈，及时跟进处理</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-6 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-amber-100"><Star className="h-3.5 w-3.5 text-amber-600" /></div>
              <span className="text-[10px] text-muted-foreground">平均评分</span>
            </div>
            <p className="text-lg font-bold text-amber-600">{stats.avgRating}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-emerald-100"><ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-[10px] text-muted-foreground">好评率</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">{stats.fiveStarRate}%</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-muted"><MessageSquare className="h-3.5 w-3.5" /></div>
              <span className="text-[10px] text-muted-foreground">总评价</span>
            </div>
            <p className="text-lg font-bold">{stats.total}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div>
              <span className="text-[10px] text-muted-foreground">待回复</span>
            </div>
            <p className="text-lg font-bold">{stats.pending}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-[10px] text-muted-foreground">已回复</span>
            </div>
            <p className="text-lg font-bold">{stats.replied}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-red-100"><AlertTriangle className="h-3.5 w-3.5 text-red-600" /></div>
              <span className="text-[10px] text-muted-foreground">需关注</span>
            </div>
            <p className="text-lg font-bold text-red-600">{stats.flagged}</p>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="p-3">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.avgRating}</p>
              <StarRating rating={Math.round(Number(stats.avgRating))} size="md" />
              <p className="text-[10px] text-muted-foreground mt-1">综合评分</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = evaluations.filter(e => e.overallRating === rating).length
                const percentage = (count / evaluations.length * 100)
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-[10px] w-8 text-right">{rating}星</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", rating >= 4 ? "bg-amber-500" : rating === 3 ? "bg-gray-400" : "bg-red-400")} style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{count}条</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Evaluation List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待回复 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="replied" className="text-xs h-6">已回复 ({stats.replied})</TabsTrigger>
              <TabsTrigger value="flagged" className="text-xs h-6">需关注 ({stats.flagged})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索客户/人员/订单..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部评分</SelectItem>
                  <SelectItem value="good">好评(4-5星)</SelectItem>
                  <SelectItem value="bad">差评(1-3星)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-24">订单号</TableHead>
                    <TableHead className="text-xs">客户</TableHead>
                    <TableHead className="text-xs">服务人员</TableHead>
                    <TableHead className="text-xs">服务类型</TableHead>
                    <TableHead className="text-xs">综合评分</TableHead>
                    <TableHead className="text-xs">评价标签</TableHead>
                    <TableHead className="text-xs max-w-[180px]">评价内容</TableHead>
                    <TableHead className="text-xs">来源</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(evaluation => {
                    const StatusIcon = statusConfig[evaluation.status].icon
                    return (
                      <TableRow key={evaluation.id} className={cn(evaluation.status === "flagged" && "bg-red-50/50")}>
                        <TableCell className="font-mono text-[10px] text-muted-foreground">{evaluation.orderId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{evaluation.customer[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{evaluation.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px]">{evaluation.staff[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{evaluation.staff}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5",
                            evaluation.serviceType === "月嫂服务" ? "bg-rose-50 text-rose-700 border-rose-200" :
                            evaluation.serviceType === "产康服务" ? "bg-teal-50 text-teal-700 border-teal-200" :
                            "bg-cyan-50 text-cyan-700 border-cyan-200"
                          )}>
                            {evaluation.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <StarRating rating={evaluation.overallRating} />
                            <span className={cn("text-xs font-bold", evaluation.overallRating >= 4 ? "text-amber-600" : evaluation.overallRating === 3 ? "text-gray-500" : "text-red-500")}>
                              {evaluation.overallRating}.0
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                            {evaluation.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1">{tag}</Badge>
                            ))}
                            {evaluation.tags.length > 2 && <span className="text-[9px] text-muted-foreground">+{evaluation.tags.length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <p className="text-[10px] text-muted-foreground truncate">{evaluation.comment}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] h-5">{evaluation.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[evaluation.status].color)}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {statusConfig[evaluation.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <EvaluationDetailDialog evaluation={evaluation} trigger={
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                              <Eye className="h-3 w-3 mr-0.5" />{evaluation.status === "pending" ? "回复" : "查看"}
                            </Button>
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filtered.length} / {evaluations.length} 条评价
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
