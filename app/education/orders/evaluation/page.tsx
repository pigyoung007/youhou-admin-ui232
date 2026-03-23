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
  Star, Search, Eye, MessageSquare, ThumbsUp,
  Clock, CheckCircle2, AlertTriangle, Flag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Evaluation {
  id: string
  orderId: string
  student: string
  phone: string
  instructor: string
  courseName: string
  className: string
  overallRating: number
  teachingRating: number
  contentRating: number
  environmentRating: number
  serviceRating: number
  tags: string[]
  comment: string
  reply: string
  status: "pending" | "replied" | "flagged"
  evaluateTime: string
  replyTime: string
}

const evaluations: Evaluation[] = [
  {
    id: "EEVL001", orderId: "EDU202501001", student: "李春华", phone: "138****1234",
    instructor: "王老师", courseName: "高级月嫂培训", className: "2025年第1期",
    overallRating: 5, teachingRating: 5, contentRating: 5, environmentRating: 4, serviceRating: 5,
    tags: ["讲解清晰", "实操丰富", "推荐"],
    comment: "王老师讲课非常清晰，实操环节也很充足，学到了很多实用技能！",
    reply: "感谢您的好评，祝您事业顺利！",
    status: "replied", evaluateTime: "2025-02-28 10:00", replyTime: "2025-02-28 14:00",
  },
  {
    id: "EEVL002", orderId: "EDU202501002", student: "王秀兰", phone: "139****5678",
    instructor: "李老师", courseName: "产康师初级培训", className: "2024年第4期",
    overallRating: 5, teachingRating: 5, contentRating: 4, environmentRating: 5, serviceRating: 5,
    tags: ["专业", "耐心", "实用"],
    comment: "李老师很专业也很耐心，产康知识讲得很透彻，考试也顺利通过了。",
    reply: "恭喜结业！期待你在产康领域的发展！",
    status: "replied", evaluateTime: "2025-01-16 09:00", replyTime: "2025-01-16 11:00",
  },
  {
    id: "EEVL003", orderId: "EDU202501003", student: "张美玲", phone: "137****9012",
    instructor: "陈老师", courseName: "育婴师培训", className: "2025年第1期",
    overallRating: 4, teachingRating: 4, contentRating: 4, environmentRating: 3, serviceRating: 4,
    tags: ["内容不错", "环境待改善"],
    comment: "课程内容不错，但教室有点小，建议改善下教学环境。",
    reply: "",
    status: "pending", evaluateTime: "2025-03-10 15:00", replyTime: "",
  },
  {
    id: "EEVL004", orderId: "EDU202501006", student: "陈丽", phone: "158****3456",
    instructor: "王老师", courseName: "高级月嫂培训", className: "2024年第4期",
    overallRating: 2, teachingRating: 3, contentRating: 2, environmentRating: 2, serviceRating: 2,
    tags: ["内容过时", "需更新"],
    comment: "感觉部分教学内容比较陈旧，实际操作中用不上，希望能更新课程。",
    reply: "",
    status: "flagged", evaluateTime: "2025-01-20 11:00", replyTime: "",
  },
  {
    id: "EEVL005", orderId: "EDU202501007", student: "刘芳", phone: "136****7890",
    instructor: "李老师", courseName: "产康师初级培训", className: "2025年第1期",
    overallRating: 5, teachingRating: 5, contentRating: 5, environmentRating: 5, serviceRating: 5,
    tags: ["非常满意", "学有所获"],
    comment: "非常满意的学习体验，老师认真负责，课后还有答疑，真的学有所获。",
    reply: "",
    status: "pending", evaluateTime: "2025-02-15 16:00", replyTime: "",
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
          <DialogTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />培训评价详情</DialogTitle>
          <DialogDescription className="text-xs">订单 {evaluation.orderId}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{evaluation.student[0]}</AvatarFallback></Avatar>
              <div><p className="text-sm font-medium">{evaluation.student}</p><p className="text-[10px] text-muted-foreground">{evaluation.phone}</p></div>
            </div>
            <Badge variant="outline" className={cn("text-[10px]", statusConfig[evaluation.status].color)}>{statusConfig[evaluation.status].label}</Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">课程：</span>{evaluation.courseName}</div>
            <div><span className="text-muted-foreground">班级：</span>{evaluation.className}</div>
            <div><span className="text-muted-foreground">讲师：</span>{evaluation.instructor}</div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">综合评分</span>
              <div className="flex items-center gap-2"><StarRating rating={evaluation.overallRating} size="md" /><span className="text-sm font-bold text-amber-600">{evaluation.overallRating}.0</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "教学质量", rating: evaluation.teachingRating },
                { label: "课程内容", rating: evaluation.contentRating },
                { label: "教学环境", rating: evaluation.environmentRating },
                { label: "综合服务", rating: evaluation.serviceRating },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-muted/30 rounded-md px-2 py-1.5">
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-1"><StarRating rating={item.rating} /><span className="text-[10px] font-medium">{item.rating}.0</span></div>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {evaluation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {evaluation.tags.map(tag => (<Badge key={tag} variant="outline" className="text-[10px] h-5 bg-primary/5 border-primary/20 text-primary">{tag}</Badge>))}
            </div>
          )}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground mb-1">学员评价</p>
            <p className="text-xs leading-relaxed">{evaluation.comment}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{evaluation.evaluateTime}</p>
          </div>
          {evaluation.reply ? (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-[10px] text-emerald-600 mb-1">机构回复</p>
              <p className="text-xs leading-relaxed text-emerald-800">{evaluation.reply}</p>
              <p className="text-[10px] text-emerald-500 mt-2">{evaluation.replyTime}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs">回复评价</Label>
              <Textarea placeholder="请输入回复..." className="text-xs min-h-[80px]" value={replyText} onChange={e => setReplyText(e.target.value)} />
              <div className="flex justify-end"><Button size="sm" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" />提交回复</Button></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EduEvaluationPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")

  const stats = useMemo(() => {
    const total = evaluations.length
    const avgRating = (evaluations.reduce((s, e) => s + e.overallRating, 0) / total).toFixed(1)
    const fiveStarRate = ((evaluations.filter(e => e.overallRating === 5).length / total) * 100).toFixed(0)
    const pending = evaluations.filter(e => e.status === "pending").length
    const flagged = evaluations.filter(e => e.status === "flagged").length
    const replied = evaluations.filter(e => e.status === "replied").length
    return { total, avgRating, fiveStarRate, pending, flagged, replied }
  }, [])

  const filtered = useMemo(() => {
    return evaluations.filter(e => {
      const matchTab = activeTab === "all" || e.status === activeTab
      const matchSearch = !searchTerm || e.student.includes(searchTerm) || e.instructor.includes(searchTerm)
      const matchRating = ratingFilter === "all" || (ratingFilter === "good" && e.overallRating >= 4) || (ratingFilter === "bad" && e.overallRating <= 3)
      return matchTab && matchSearch && matchRating
    })
  }, [activeTab, searchTerm, ratingFilter])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div><h1 className="text-lg font-bold">培训评价</h1><p className="text-xs text-muted-foreground">管理学员对培训课程的评价与反馈</p></div>

        <div className="grid grid-cols-6 gap-3">
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-amber-100"><Star className="h-3.5 w-3.5 text-amber-600" /></div><span className="text-[10px] text-muted-foreground">平均评分</span></div><p className="text-lg font-bold text-amber-600">{stats.avgRating}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-emerald-100"><ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /></div><span className="text-[10px] text-muted-foreground">好评率</span></div><p className="text-lg font-bold text-emerald-600">{stats.fiveStarRate}%</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-muted"><MessageSquare className="h-3.5 w-3.5" /></div><span className="text-[10px] text-muted-foreground">总评价</span></div><p className="text-lg font-bold">{stats.total}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-amber-100"><Clock className="h-3.5 w-3.5 text-amber-600" /></div><span className="text-[10px] text-muted-foreground">待回复</span></div><p className="text-lg font-bold">{stats.pending}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div><span className="text-[10px] text-muted-foreground">已回复</span></div><p className="text-lg font-bold">{stats.replied}</p></Card>
          <Card className="p-3"><div className="flex items-center gap-2 mb-1"><div className="p-1.5 rounded-md bg-red-100"><AlertTriangle className="h-3.5 w-3.5 text-red-600" /></div><span className="text-[10px] text-muted-foreground">需关注</span></div><p className="text-lg font-bold text-red-600">{stats.flagged}</p></Card>
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
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className={cn("h-full rounded-full", rating >= 4 ? "bg-amber-500" : rating === 3 ? "bg-gray-400" : "bg-red-400")} style={{ width: `${percentage}%` }} /></div>
                    <span className="text-[10px] text-muted-foreground w-8">{count}条</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部 ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6">待回复 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="replied" className="text-xs h-6">已回复 ({stats.replied})</TabsTrigger>
              <TabsTrigger value="flagged" className="text-xs h-6">需关注 ({stats.flagged})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="搜索学员/讲师..." className="pl-7 h-7 w-48 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}><SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">全部评分</SelectItem><SelectItem value="good">好评</SelectItem><SelectItem value="bad">差评</SelectItem></SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">订单号</TableHead>
                    <TableHead className="text-xs">学员</TableHead>
                    <TableHead className="text-xs">讲师</TableHead>
                    <TableHead className="text-xs">课程</TableHead>
                    <TableHead className="text-xs">评分</TableHead>
                    <TableHead className="text-xs">标签</TableHead>
                    <TableHead className="text-xs max-w-[150px]">评价内容</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(e => {
                    const StatusIcon = statusConfig[e.status].icon
                    return (
                      <TableRow key={e.id} className={cn(e.status === "flagged" && "bg-red-50/50")}>
                        <TableCell className="font-mono text-[10px] text-muted-foreground">{e.orderId}</TableCell>
                        <TableCell className="text-xs">{e.student}</TableCell>
                        <TableCell className="text-xs">{e.instructor}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] h-5">{e.courseName}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1"><StarRating rating={e.overallRating} /><span className={cn("text-xs font-bold", e.overallRating >= 4 ? "text-amber-600" : "text-red-500")}>{e.overallRating}.0</span></div></TableCell>
                        <TableCell><div className="flex flex-wrap gap-0.5 max-w-[100px]">{e.tags.slice(0, 2).map(t => (<Badge key={t} variant="outline" className="text-[9px] h-4 px-1">{t}</Badge>))}</div></TableCell>
                        <TableCell className="max-w-[150px]"><p className="text-[10px] text-muted-foreground truncate">{e.comment}</p></TableCell>
                        <TableCell><Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[e.status].color)}><StatusIcon className="h-3 w-3 mr-0.5" />{statusConfig[e.status].label}</Badge></TableCell>
                        <TableCell>
                          <EvaluationDetailDialog evaluation={e} trigger={
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-0.5" />{e.status === "pending" ? "回复" : "查看"}</Button>
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
            <div className="text-xs text-muted-foreground text-center mt-2">显示 {filtered.length} / {evaluations.length} 条评价</div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
