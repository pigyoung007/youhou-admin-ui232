"use client"

import React from "react"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  Search, Plus, FileText, Clock, Users, CheckCircle2, XCircle, AlertCircle, BarChart3, 
  Download, Eye, Edit, Trash2, MoreHorizontal, Play, Square, Monitor
} from "lucide-react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

interface Exam {
  id: string
  name: string
  course: string
  className: string
  date: string
  time: string
  duration: number
  totalStudents: number
  submitted: number
  passed: number
  failed: number
  avgScore: number
  maxScore: number
  minScore: number
  passLine: number
  status: "upcoming" | "ongoing" | "completed"
  results?: { id: string; name: string; score: number; status: "passed" | "failed"; submitTime: string; answers?: { correct: number; wrong: number; total: number } }[]
}

const exams: Exam[] = [
  { id: "EX001", name: "高级月嫂理论考试 - 2024年2月", course: "高级月嫂培训", className: "2024年第3期", date: "2024-02-20", time: "09:00-11:00", duration: 120, totalStudents: 23, submitted: 23, passed: 20, failed: 3, avgScore: 82.5, maxScore: 98, minScore: 52, passLine: 60, status: "completed", results: [
    { id: "S001", name: "李春华", score: 92, status: "passed", submitTime: "10:45", answers: { correct: 46, wrong: 4, total: 50 } },
    { id: "S002", name: "王秀兰", score: 88, status: "passed", submitTime: "10:52", answers: { correct: 44, wrong: 6, total: 50 } },
    { id: "S003", name: "张美玲", score: 56, status: "failed", submitTime: "10:58", answers: { correct: 28, wrong: 22, total: 50 } },
    { id: "S004", name: "陈桂芳", score: 78, status: "passed", submitTime: "10:35", answers: { correct: 39, wrong: 11, total: 50 } },
    { id: "S005", name: "刘芳芳", score: 85, status: "passed", submitTime: "10:48", answers: { correct: 42, wrong: 8, total: 50 } },
    { id: "S006", name: "赵丽娜", score: 98, status: "passed", submitTime: "10:30", answers: { correct: 49, wrong: 1, total: 50 } },
    { id: "S007", name: "孙晓燕", score: 91, status: "passed", submitTime: "10:42", answers: { correct: 45, wrong: 5, total: 50 } },
    { id: "S008", name: "周婷婷", score: 72, status: "passed", submitTime: "10:55", answers: { correct: 36, wrong: 14, total: 50 } },
    { id: "S009", name: "吴美华", score: 95, status: "passed", submitTime: "10:28", answers: { correct: 47, wrong: 3, total: 50 } },
    { id: "S010", name: "郑小红", score: 52, status: "failed", submitTime: "10:59", answers: { correct: 26, wrong: 24, total: 50 } },
  ] },
  { id: "EX002", name: "产康师技能实操考核", course: "产康师初级认证", className: "2024年第2期", date: "2024-02-25", time: "14:00-17:00", duration: 180, totalStudents: 18, submitted: 0, passed: 0, failed: 0, avgScore: 0, maxScore: 0, minScore: 0, passLine: 70, status: "upcoming", results: [] },
  { id: "EX003", name: "育婴师基础知识测试", course: "育婴师专业班", className: "2024年第1期", date: "2024-02-18", time: "09:00-10:30", duration: 90, totalStudents: 20, submitted: 15, passed: 0, failed: 0, avgScore: 0, maxScore: 0, minScore: 0, passLine: 60, status: "ongoing", results: [] },
  { id: "EX004", name: "产康师高级实操考核", course: "产康师高级进阶", className: "2024年第1期", date: "2024-03-15", time: "09:00-12:00", duration: 180, totalStudents: 15, submitted: 0, passed: 0, failed: 0, avgScore: 0, maxScore: 0, minScore: 0, passLine: 75, status: "upcoming", results: [] },
]

const statusConfig = {
  upcoming: { label: "待开始", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  ongoing: { label: "进行中", color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
  completed: { label: "已结束", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
}

// Create Exam Dialog
function CreateExamDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />创建考试</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />创建考试</DialogTitle>
          <DialogDescription className="text-xs">创建新的培训考试</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">考试名称</Label>
            <Input placeholder="如：高级月嫂理论考试 - 2024年3月" className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">关联课程</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择课程" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yuesao">高级月嫂培训</SelectItem>
                  <SelectItem value="chankang">产康师初级认证</SelectItem>
                  <SelectItem value="yuying">育婴师专业班</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">关联班级</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择班级" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cls1">2024年第3期</SelectItem>
                  <SelectItem value="cls2">2024年第2期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">考试日期</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">开始时间</Label>
              <Input type="time" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">时长(分钟)</Label>
              <Input type="number" placeholder="120" className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">及格分数</Label>
              <Input type="number" placeholder="60" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">满分</Label>
              <Input type="number" placeholder="100" className="h-8 text-xs" />
            </div>
          </div>
        </div>
        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">创建考试</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// View Scores Dialog
function ViewScoresDialog({ exam, trigger }: { exam: Exam; trigger?: React.ReactNode }) {
  const passRate = exam.totalStudents > 0 ? Math.round((exam.passed / exam.totalStudents) * 100) : 0
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-1" />查看成绩</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>成绩查看</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{exam.id}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">{exam.name}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="p-4 bg-muted/30 border-b">
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-primary">{exam.avgScore}</p>
                <p className="text-[10px] text-muted-foreground">平均分</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-green-600">{exam.maxScore}</p>
                <p className="text-[10px] text-muted-foreground">最高分</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-red-600">{exam.minScore}</p>
                <p className="text-[10px] text-muted-foreground">最低分</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-blue-600">{passRate}%</p>
                <p className="text-[10px] text-muted-foreground">通过率</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold">{exam.submitted}/{exam.totalStudents}</p>
                <p className="text-[10px] text-muted-foreground">参考人数</p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs w-12">排名</TableHead>
                  <TableHead className="text-xs">学员</TableHead>
                  <TableHead className="text-xs w-16">分数</TableHead>
                  <TableHead className="text-xs w-20">答题情况</TableHead>
                  <TableHead className="text-xs w-16">状态</TableHead>
                  <TableHead className="text-xs w-16">提交时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exam.results && exam.results.length > 0 ? (
                  [...exam.results].sort((a, b) => b.score - a.score).map((result, index) => (
                    <TableRow key={result.id} className={cn(index === 0 && "bg-amber-50/50")}>
                      <TableCell>
                        <span className={cn(
                          "text-xs font-medium",
                          index === 0 && "text-amber-600",
                          index === 1 && "text-gray-500",
                          index === 2 && "text-amber-700"
                        )}>
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">{result.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{result.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-bold", result.score >= exam.passLine ? "text-green-600" : "text-red-600")}>
                          {result.score}
                        </span>
                      </TableCell>
                      <TableCell>
                        {result.answers && (
                          <div className="text-[10px] text-muted-foreground">
                            <span className="text-green-600">{result.answers.correct}</span>
                            <span>/</span>
                            <span className="text-red-600">{result.answers.wrong}</span>
                            <span>/</span>
                            <span>{result.answers.total}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] h-5", result.status === "passed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                          {result.status === "passed" ? "通过" : "未通过"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{result.submitTime}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">暂无成绩数据</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">
              及格线: {exam.passLine}分 | 通过: {exam.passed}人 | 未通过: {exam.failed}人
            </div>
            <Button size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" />导出成绩</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Loading = () => null

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const matchStatus = statusFilter === "all" || e.status === statusFilter
      const matchSearch = !searchTerm || e.name.includes(searchTerm) || e.course.includes(searchTerm)
      return matchStatus && matchSearch
    })
  }, [statusFilter, searchTerm])

  const stats = useMemo(() => ({
    total: exams.length,
    completed: exams.filter(e => e.status === "completed").length,
    avgPass: Math.round(exams.filter(e => e.status === "completed").reduce((sum, e) => sum + (e.passed / e.totalStudents) * 100, 0) / (exams.filter(e => e.status === "completed").length || 1)),
    participants: exams.reduce((sum, e) => sum + e.submitted, 0),
  }), [])

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">考试管理</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{stats.total}场考试</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />{stats.completed}已完成</span>
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3 text-blue-500" />{stats.avgPass}%通过率</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stats.participants}人次</span>
              </div>
            </div>
            <CreateExamDialog />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索考试..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="upcoming">待开始</SelectItem>
                <SelectItem value="ongoing">进行中</SelectItem>
                <SelectItem value="completed">已结束</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exams List */}
          <div className="grid gap-2">
            {filteredExams.map((exam) => {
              const StatusIcon = statusConfig[exam.status].icon
              const passRate = exam.totalStudents > 0 ? Math.round((exam.passed / exam.totalStudents) * 100) : 0
              
              return (
                <Card key={exam.id} className="p-3 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium truncate">{exam.name}</span>
                        <Badge variant="outline" className={cn("text-[10px] h-4 px-1", statusConfig[exam.status].color)}>
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                          {statusConfig[exam.status].label}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2">{exam.course} | {exam.className}</p>

                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.date} {exam.time}</span>
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{exam.duration}分钟</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{exam.submitted}/{exam.totalStudents}已交卷</span>
                        {exam.status === "completed" && (
                          <>
                            <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />均分{exam.avgScore}</span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />{exam.passed}通过
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3 w-3 text-red-600" />{exam.failed}未通过
                            </span>
                          </>
                        )}
                      </div>

                      {exam.status === "completed" && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-48">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${passRate}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">通过率 {passRate}%</span>
                        </div>
                      )}

                      {exam.status === "ongoing" && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-48">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: `${(exam.submitted / exam.totalStudents) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{exam.submitted}/{exam.totalStudents} 已提交</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {exam.status === "completed" && (
                        <>
                          <ViewScoresDialog exam={exam} trigger={<Button size="sm" className="h-6 text-[10px]"><Eye className="h-3 w-3 mr-1" />查看成绩</Button>} />
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Download className="h-3 w-3 mr-1" />导出</Button>
                        </>
                      )}
                      {exam.status === "upcoming" && (
                        <>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Edit className="h-3 w-3 mr-1" />编辑</Button>
                          <Button size="sm" className="h-6 text-[10px]"><Play className="h-3 w-3 mr-1" />开始</Button>
                        </>
                      )}
                      {exam.status === "ongoing" && (
                        <>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent"><Monitor className="h-3 w-3 mr-1" />监控</Button>
                          <Button variant="destructive" size="sm" className="h-6 text-[10px]"><Square className="h-3 w-3 mr-1" />结束</Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28">
                          <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Stats hint */}
          <div className="text-xs text-muted-foreground text-center">
            显示 {filteredExams.length} / {exams.length} 场考试
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
