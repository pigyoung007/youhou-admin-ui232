"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search, Plus, FileText, Clock, CheckCircle2, XCircle, AlertCircle, BarChart3,
  Download, Eye, Edit, Trash2, MoreHorizontal, Upload, BookOpen, ListChecks,
  SquareCheck, CircleDot, AlignLeft, Settings, Shuffle, Copy
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================
type QuestionType = "single" | "multiple" | "truefalse" | "essay"

interface Question {
  id: string
  type: QuestionType
  course: string
  chapter: string
  content: string
  options?: string[]
  answer: string
  difficulty: "easy" | "medium" | "hard"
  createdAt: string
  usageCount: number
}

interface ExamPaper {
  id: string
  name: string
  course: string
  totalScore: number
  passScore: number
  duration: number
  rules: { type: QuestionType; count: number; scoreEach: number; totalScore: number }[]
  totalQuestions: number
  status: "draft" | "active" | "archived"
  createdAt: string
  usedCount: number
}

// ==================== Mock数据 ====================
const questions: Question[] = [
  { id: "Q001", type: "single", course: "高级月嫂培训", chapter: "新生儿护理", content: "新生儿正常体温范围是多少？", options: ["35.5-36.5°C", "36.5-37.5°C", "37.0-38.0°C", "36.0-37.0°C"], answer: "B", difficulty: "easy", createdAt: "2025-01-10", usageCount: 12 },
  { id: "Q002", type: "single", course: "高级月嫂培训", chapter: "产妇护理", content: "产后多久可以开始做产后恢复操？", options: ["产后1天", "产后3天", "产后7天", "产后42天"], answer: "C", difficulty: "medium", createdAt: "2025-01-10", usageCount: 8 },
  { id: "Q003", type: "multiple", course: "高级月嫂培训", chapter: "月子餐", content: "以下哪些食材适合产后第一周食用？(多选)", options: ["红糖水", "猪蹄汤", "小米粥", "辣椒"], answer: "A,C", difficulty: "medium", createdAt: "2025-01-11", usageCount: 6 },
  { id: "Q004", type: "truefalse", course: "产康师初级认证", chapter: "理论基础", content: "产后42天是产后恢复的黄金期。", answer: "正确", difficulty: "easy", createdAt: "2025-01-12", usageCount: 15 },
  { id: "Q005", type: "essay", course: "产康师初级认证", chapter: "实操技能", content: "请描述产后腹直肌分离的评估方法和恢复训练步骤。", answer: "评估方法：仰卧位，双膝弯曲...", difficulty: "hard", createdAt: "2025-01-12", usageCount: 4 },
  { id: "Q006", type: "single", course: "育婴师专业班", chapter: "婴幼儿喂养", content: "纯母乳喂养建议坚持到宝宝几个月？", options: ["3个月", "4个月", "6个月", "12个月"], answer: "C", difficulty: "easy", createdAt: "2025-01-13", usageCount: 10 },
  { id: "Q007", type: "multiple", course: "育婴师专业班", chapter: "早期教育", content: "以下哪些是0-6个月婴儿的发育里程碑？(多选)", options: ["追视物体", "独坐", "抬头", "翻身"], answer: "A,C,D", difficulty: "medium", createdAt: "2025-01-13", usageCount: 7 },
  { id: "Q008", type: "truefalse", course: "高级月嫂培训", chapter: "新生儿护理", content: "新生儿脐带一般在出生后3-7天脱落。", answer: "错误", difficulty: "medium", createdAt: "2025-01-14", usageCount: 9 },
]

const examPapers: ExamPaper[] = [
  { id: "EP001", name: "高级月嫂理论考试", course: "高级月嫂培训", totalScore: 100, passScore: 60, duration: 120, rules: [{ type: "single", count: 30, scoreEach: 2, totalScore: 60 }, { type: "multiple", count: 10, scoreEach: 3, totalScore: 30 }, { type: "truefalse", count: 10, scoreEach: 1, totalScore: 10 }], totalQuestions: 50, status: "active", createdAt: "2025-01-15", usedCount: 5 },
  { id: "EP002", name: "产康师初级认证考试", course: "产康师初级认证", totalScore: 100, passScore: 60, duration: 90, rules: [{ type: "single", count: 25, scoreEach: 2, totalScore: 50 }, { type: "multiple", count: 5, scoreEach: 4, totalScore: 20 }, { type: "truefalse", count: 10, scoreEach: 1, totalScore: 10 }, { type: "essay", count: 2, scoreEach: 10, totalScore: 20 }], totalQuestions: 42, status: "active", createdAt: "2025-01-16", usedCount: 3 },
  { id: "EP003", name: "育婴师技能考核", course: "育婴师专业班", totalScore: 100, passScore: 60, duration: 90, rules: [{ type: "single", count: 20, scoreEach: 2, totalScore: 40 }, { type: "multiple", count: 10, scoreEach: 3, totalScore: 30 }, { type: "truefalse", count: 15, scoreEach: 1, totalScore: 15 }, { type: "essay", count: 1, scoreEach: 15, totalScore: 15 }], totalQuestions: 46, status: "draft", createdAt: "2025-01-20", usedCount: 0 },
]

const typeConfig: Record<QuestionType, { label: string; icon: React.ElementType; className: string }> = {
  single: { label: "单选题", icon: CircleDot, className: "bg-blue-100 text-blue-700 border-blue-200" },
  multiple: { label: "多选题", icon: SquareCheck, className: "bg-violet-100 text-violet-700 border-violet-200" },
  truefalse: { label: "判断题", icon: ListChecks, className: "bg-amber-100 text-amber-700 border-amber-200" },
  essay: { label: "简答题", icon: AlignLeft, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
}

const difficultyConfig: Record<string, { label: string; className: string }> = {
  easy: { label: "简单", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { label: "中等", className: "bg-amber-100 text-amber-700 border-amber-200" },
  hard: { label: "困难", className: "bg-red-100 text-red-700 border-red-200" },
}

// ==================== 新增试题弹窗 ====================
function AddQuestionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [qType, setQType] = useState<QuestionType>("single")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base">新增试题</DialogTitle>
          <DialogDescription className="text-xs">录入试题信息，支持单选、多选、判断、简答题型</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">题型</Label>
              <Select value={qType} onValueChange={(v) => setQType(v as QuestionType)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">单选题</SelectItem>
                  <SelectItem value="multiple">多选题</SelectItem>
                  <SelectItem value="truefalse">判断题</SelectItem>
                  <SelectItem value="essay">简答题</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">所属课程</Label>
              <Select defaultValue="高级月嫂培训">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="高级月嫂培训">高级月嫂培训</SelectItem>
                  <SelectItem value="产康师初级认证">产康师初级认证</SelectItem>
                  <SelectItem value="育婴师专业班">育婴师专业班</SelectItem>
                  <SelectItem value="催乳师培训">催乳师培训</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">章节</Label>
              <Input placeholder="如: 新生儿护理" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">难度</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">简单</SelectItem>
                  <SelectItem value="medium">中等</SelectItem>
                  <SelectItem value="hard">困难</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">题目内容</Label>
            <Textarea placeholder="请输入题目内容..." rows={3} />
          </div>
          {(qType === "single" || qType === "multiple") && (
            <div className="space-y-2">
              <Label className="text-xs">选项</Label>
              {["A", "B", "C", "D"].map(opt => (
                <div key={opt} className="flex items-center gap-2">
                  <Badge variant="outline" className="w-7 h-7 flex items-center justify-center text-xs shrink-0">{opt}</Badge>
                  <Input placeholder={`选项${opt}内容`} className="h-8 text-sm flex-1" />
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">正确答案</Label>
            {qType === "truefalse" ? (
              <Select defaultValue="正确">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="正确">正确</SelectItem>
                  <SelectItem value="错误">错误</SelectItem>
                </SelectContent>
              </Select>
            ) : qType === "essay" ? (
              <Textarea placeholder="参考答案..." rows={3} />
            ) : (
              <Input placeholder={qType === "multiple" ? "如: A,C" : "如: B"} className="h-9" />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onOpenChange(false)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 新增试卷弹窗 ====================
function AddPaperDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base">创建试卷规则</DialogTitle>
          <DialogDescription className="text-xs">配置试卷的题型、题量、分值，考试时系统将从题库中随机抽题组卷</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">试卷名称</Label>
              <Input placeholder="如: 高级月嫂理论考试" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">考试科目</Label>
              <Select defaultValue="高级月嫂培训">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="高级月嫂培训">高级月嫂培训</SelectItem>
                  <SelectItem value="产康师初级认证">产康师初级认证</SelectItem>
                  <SelectItem value="育婴师专业班">育婴师专业班</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">总分</Label>
              <Input type="number" defaultValue={100} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">合格分数</Label>
              <Input type="number" defaultValue={60} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">考试时长(分钟)</Label>
              <Input type="number" defaultValue={120} className="h-9" />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium">题型配置</Label>
            <p className="text-xs text-muted-foreground">配置各题型的题量和每题分值，考试时从对应题库中随机抽取</p>
            {(["single", "multiple", "truefalse", "essay"] as const).map(type => {
              const cfg = typeConfig[type]
              const TypeIcon = cfg.icon
              return (
                <div key={type} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border">
                  <Badge variant="outline" className={cn("text-[10px] gap-1", cfg.className)}>
                    <TypeIcon className="h-3 w-3" />{cfg.label}
                  </Badge>
                  <div className="flex items-center gap-2 flex-1">
                    <Label className="text-xs text-muted-foreground w-12 shrink-0">题量</Label>
                    <Input type="number" defaultValue={type === "single" ? 30 : type === "multiple" ? 10 : type === "truefalse" ? 10 : 0} className="h-7 text-xs w-16" />
                    <Label className="text-xs text-muted-foreground w-16 shrink-0">每题分值</Label>
                    <Input type="number" defaultValue={type === "single" ? 2 : type === "multiple" ? 3 : type === "truefalse" ? 1 : 10} className="h-7 text-xs w-16" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onOpenChange(false)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 页面组件 ====================
export default function QuestionBankPage() {
  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)
  const [addPaperOpen, setAddPaperOpen] = useState(false)

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = !search || q.content.includes(search) || q.course.includes(search)
      const matchCourse = courseFilter === "all" || q.course === courseFilter
      const matchType = typeFilter === "all" || q.type === typeFilter
      return matchSearch && matchCourse && matchType
    })
  }, [search, courseFilter, typeFilter])

  const stats = useMemo(() => ({
    total: questions.length,
    single: questions.filter(q => q.type === "single").length,
    multiple: questions.filter(q => q.type === "multiple").length,
    truefalse: questions.filter(q => q.type === "truefalse").length,
    essay: questions.filter(q => q.type === "essay").length,
    papers: examPapers.length,
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">题库管理</h1>
            <p className="text-muted-foreground">管理考试试题与试卷规则，支持随机组卷</p>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">试题总数</p>
            <p className="text-xl font-bold mt-1">{stats.total}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">单选题</p>
            <p className="text-xl font-bold mt-1 text-blue-600">{stats.single}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">多选题</p>
            <p className="text-xl font-bold mt-1 text-violet-600">{stats.multiple}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">判断题</p>
            <p className="text-xl font-bold mt-1 text-amber-600">{stats.truefalse}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">简答题</p>
            <p className="text-xl font-bold mt-1 text-emerald-600">{stats.essay}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">试卷规则</p>
            <p className="text-xl font-bold mt-1 text-primary">{stats.papers}</p>
          </Card>
        </div>

        <Tabs defaultValue="questions">
          <TabsList>
            <TabsTrigger value="questions">试题管理</TabsTrigger>
            <TabsTrigger value="papers">试卷管理</TabsTrigger>
          </TabsList>

          {/* ========== 试题管理 ========== */}
          <TabsContent value="questions" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-1 w-full sm:w-auto">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="搜索题目内容..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="课程" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部课程</SelectItem>
                      <SelectItem value="高级月嫂培训">高级月嫂培训</SelectItem>
                      <SelectItem value="产康师初级认证">产康师初级认证</SelectItem>
                      <SelectItem value="育婴师专业班">育婴师专业班</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-28"><SelectValue placeholder="题型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部题型</SelectItem>
                      <SelectItem value="single">单选题</SelectItem>
                      <SelectItem value="multiple">多选题</SelectItem>
                      <SelectItem value="truefalse">判断题</SelectItem>
                      <SelectItem value="essay">简答题</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-transparent"><Upload className="h-4 w-4 mr-2" />批量导入</Button>
                  <Button onClick={() => setAddQuestionOpen(true)}><Plus className="h-4 w-4 mr-2" />新增试题</Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">编号</TableHead>
                      <TableHead className="w-20">题型</TableHead>
                      <TableHead>题目内容</TableHead>
                      <TableHead className="w-28">课程</TableHead>
                      <TableHead className="w-24">章节</TableHead>
                      <TableHead className="w-16">难度</TableHead>
                      <TableHead className="w-16">答案</TableHead>
                      <TableHead className="w-16">使用次</TableHead>
                      <TableHead className="w-16 text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map(q => {
                      const tc = typeConfig[q.type]
                      const dc = difficultyConfig[q.difficulty]
                      const TIcon = tc.icon
                      return (
                        <TableRow key={q.id}>
                          <TableCell className="font-mono text-xs">{q.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[10px] gap-1", tc.className)}>
                              <TIcon className="h-3 w-3" />{tc.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">{q.content}</TableCell>
                          <TableCell className="text-xs">{q.course}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{q.chapter}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[10px]", dc.className)}>{dc.label}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{q.answer}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{q.usageCount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" />查看详情</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />编辑</DropdownMenuItem>
                                <DropdownMenuItem><Copy className="h-3.5 w-3.5 mr-2" />复制</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"><Trash2 className="h-3.5 w-3.5 mr-2" />删除</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ========== 试卷管理 ========== */}
          <TabsContent value="papers" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddPaperOpen(true)}><Plus className="h-4 w-4 mr-2" />创建试卷规则</Button>
            </div>

            <div className="grid gap-4">
              {examPapers.map(paper => (
                <Card key={paper.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-sm">{paper.name}</h3>
                        <Badge variant="outline" className={cn("text-[10px]",
                          paper.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                          paper.status === "draft" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {paper.status === "active" ? "已启用" : paper.status === "draft" ? "草稿" : "已归档"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>科目: {paper.course}</span>
                        <span>总分: {paper.totalScore}分</span>
                        <span>合格: {paper.passScore}分</span>
                        <span>时长: {paper.duration}分钟</span>
                        <span>总题量: {paper.totalQuestions}题</span>
                        <span>使用: {paper.usedCount}次</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {paper.rules.map((rule, i) => {
                          const tc = typeConfig[rule.type]
                          const TIcon = tc.icon
                          return (
                            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border text-xs">
                              <TIcon className="h-3 w-3" />
                              <span className="font-medium">{tc.label}</span>
                              <span className="text-muted-foreground">{rule.count}题</span>
                              <span className="text-muted-foreground">x</span>
                              <span className="text-muted-foreground">{rule.scoreEach}分</span>
                              <span className="font-medium text-primary">= {rule.totalScore}分</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" />预览试卷</DropdownMenuItem>
                        <DropdownMenuItem><Shuffle className="h-3.5 w-3.5 mr-2" />随机生成一份</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />编辑规则</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><Trash2 className="h-3.5 w-3.5 mr-2" />删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AddQuestionDialog open={addQuestionOpen} onOpenChange={setAddQuestionOpen} />
        <AddPaperDialog open={addPaperOpen} onOpenChange={setAddPaperOpen} />
      </div>
    </AdminLayout>
  )
}
