"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users, Clock, BookOpen, Plus, Eye, Edit, Trash2, MoreHorizontal, Search, 
  GraduationCap, DollarSign, Calendar, CheckCircle, AlertCircle, Award, FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

// 科目数据结构
interface Subject {
  id: string
  name: string
  category: string
  level: string
  duration: string
  durationDays: number
  sessions: number
  price: number
  teacher: string
  status: "active" | "upcoming" | "paused"
  students: number
  certificates: string[]
  description: string
  outline: string[]
  enrolledStudents?: { id: string; name: string; progress: number }[]
}

// Mock科目数据
const subjects: Subject[] = [
  { id: "SUB001", name: "高级月嫂培训", category: "月嫂", level: "高级", duration: "45天", durationDays: 45, sessions: 45, price: 6800, teacher: "张老师", status: "active", students: 28, certificates: ["高级母婴护理师证"], description: "系统学习月嫂专业技能，包括新生儿护理、产妇护理、月子餐制作等核心内容", outline: ["新生儿护理", "产妇护理", "月子餐制作", "催乳基础", "早教入门"], enrolledStudents: [{ id: "S001", name: "李春华", progress: 85 }, { id: "S006", name: "赵丽娜", progress: 75 }] },
  { id: "SUB002", name: "产康师初级认证", category: "产康", level: "初级", duration: "30天", durationDays: 30, sessions: 30, price: 4500, teacher: "李老师", status: "active", students: 15, certificates: ["产康师初级证"], description: "产后康复基础理论与实操技能培训", outline: ["产后康复理论", "盆底康复", "腹直肌修复"], enrolledStudents: [{ id: "S002", name: "王秀兰", progress: 100 }] },
  { id: "SUB003", name: "育婴师专业培训", category: "育婴", level: "中级", duration: "20天", durationDays: 20, sessions: 20, price: 3200, teacher: "王老师", status: "active", students: 22, certificates: ["育婴师证"], description: "育婴师专业技能培训，含早教、辅食制作等", outline: ["早教基础", "辅食制作", "睡眠训练", "婴儿按摩"], enrolledStudents: [{ id: "S003", name: "张美玲", progress: 60 }] },
  { id: "SUB004", name: "产康师高级进阶", category: "产康", level: "高级", duration: "60天", durationDays: 60, sessions: 60, price: 9800, teacher: "赵老师", status: "upcoming", students: 8, certificates: ["产康师高级证", "康复理疗师证"], description: "产康师高级技能进阶培训", outline: ["骨盆矫正", "体态调整", "中医调理", "徒手产康"], enrolledStudents: [] },
  { id: "SUB005", name: "催乳师专项培训", category: "催乳", level: "专项", duration: "15天", durationDays: 15, sessions: 15, price: 2800, teacher: "孙老师", status: "active", students: 12, certificates: ["催乳师证"], description: "催乳师专项技能培训", outline: ["催乳理论", "中医催乳", "穴位按摩"], enrolledStudents: [] },
  { id: "SUB006", name: "小儿推拿培训", category: "推拿", level: "专项", duration: "25天", durationDays: 25, sessions: 25, price: 3500, teacher: "钱老师", status: "upcoming", students: 10, certificates: ["小儿推拿师证"], description: "小儿推拿专业培训", outline: ["小儿推拿基础", "常见病症推拿", "保健推拿"], enrolledStudents: [] },
]

const statusConfig = {
  active: { label: "开课中", color: "bg-green-100 text-green-700 border-green-200" },
  upcoming: { label: "即将开课", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paused: { label: "已暂停", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// 创建/编辑科目对话框
function SubjectFormDialog({ subject, trigger }: { subject?: Subject; trigger?: React.ReactNode }) {
  const isEdit = !!subject
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm"><Plus className="h-4 w-4 mr-1" />新建科目</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            {isEdit ? "编辑科目" : "新建科目"}
          </DialogTitle>
          <DialogDescription className="text-xs">{isEdit ? "修改科目信息" : "创建新的培训科目"}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <Label>科目名称</Label>
            <Input defaultValue={subject?.name} placeholder="如：高级月嫂培训" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>科目分类</Label>
              <Select defaultValue={subject?.category}>
                <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="月嫂">月嫂培训</SelectItem>
                  <SelectItem value="产康">产康师培训</SelectItem>
                  <SelectItem value="育婴">育婴师培训</SelectItem>
                  <SelectItem value="催乳">催乳师培训</SelectItem>
                  <SelectItem value="推拿">小儿推拿</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>科目等级</Label>
              <Select defaultValue={subject?.level}>
                <SelectTrigger><SelectValue placeholder="选择等级" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="初级">初级</SelectItem>
                  <SelectItem value="中级">中级</SelectItem>
                  <SelectItem value="高级">高级</SelectItem>
                  <SelectItem value="专项">专项</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>培训天数</Label>
              <Input type="number" defaultValue={subject?.durationDays} placeholder="45" />
            </div>
            <div className="space-y-2">
              <Label>课时数</Label>
              <Input type="number" defaultValue={subject?.sessions} placeholder="45" />
            </div>
            <div className="space-y-2">
              <Label>学费(元)</Label>
              <Input type="number" defaultValue={subject?.price} placeholder="6800" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>授课老师</Label>
            <Select defaultValue={subject?.teacher}>
              <SelectTrigger><SelectValue placeholder="选择老师" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="张老师">张老师</SelectItem>
                <SelectItem value="李老师">李老师</SelectItem>
                <SelectItem value="王老师">王老师</SelectItem>
                <SelectItem value="赵老师">赵老师</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>颁发证书</Label>
            <Input defaultValue={subject?.certificates?.join(", ")} placeholder="如：高级母婴护理师证" />
          </div>
          <div className="space-y-2">
            <Label>科目简介</Label>
            <Textarea defaultValue={subject?.description} placeholder="科目介绍及培训内容概述" className="min-h-20" />
          </div>
          <div className="space-y-2">
            <Label>科目大纲</Label>
            <Textarea defaultValue={subject?.outline?.join("\n")} placeholder="每行一个主题" className="min-h-24" />
          </div>
        </div>
        <DialogFooter className="px-4 py-3 border-t shrink-0">
          <Button variant="outline">取消</Button>
          <Button>{isEdit ? "保存修改" : "创建科目"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 科目详情对话框
function SubjectDetailDialog({ subject, trigger }: { subject: Subject; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>科目详情</span>
              <Badge variant="outline" className={cn("text-xs", statusConfig[subject.status].color)}>
                {statusConfig[subject.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{subject.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-muted/30 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{subject.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{subject.category}</Badge>
                  <Badge variant="outline" className="text-xs">{subject.level}</Badge>
                </div>
              </div>
              <span className="text-lg font-bold text-primary">¥{subject.price.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{subject.description}</p>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10 px-4">
              <TabsTrigger value="info" className="text-sm">基本信息</TabsTrigger>
              <TabsTrigger value="outline" className="text-sm">科目大纲</TabsTrigger>
              <TabsTrigger value="students" className="text-sm">学员({subject.students})</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-4 space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xl font-bold text-primary">{subject.durationDays}</p>
                  <p className="text-xs text-muted-foreground">培训天数</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xl font-bold text-green-600">{subject.sessions}</p>
                  <p className="text-xs text-muted-foreground">总课时</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xl font-bold text-blue-600">{subject.students}</p>
                  <p className="text-xs text-muted-foreground">在读学员</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">授课老师</p>
                  <p className="font-medium">{subject.teacher}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">科目状态</p>
                  <p className="font-medium">{statusConfig[subject.status].label}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">颁发证书</p>
                <div className="flex flex-wrap gap-2">
                  {subject.certificates.map((cert, i) => (
                    <Badge key={i} variant="secondary"><Award className="h-3 w-3 mr-1" />{cert}</Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outline" className="p-4 mt-0">
              <div className="space-y-2">
                {subject.outline.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">{i + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="p-4 space-y-2 mt-0">
              {subject.enrolledStudents && subject.enrolledStudents.length > 0 ? (
                subject.enrolledStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">{student.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{student.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-sm w-10">{student.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无学员</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-4 py-3 border-t shrink-0">
          <SubjectFormDialog subject={subject} trigger={<Button><Edit className="h-4 w-4 mr-1" />编辑科目</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Mock待拉取学员数据
const availableStudents = [
  { id: "STU001", name: "陈小红", phone: "138****1234", source: "线上报名", status: "待分配", regDate: "2025-01-18" },
  { id: "STU002", name: "刘美华", phone: "139****5678", source: "老学员介绍", status: "待分配", regDate: "2025-01-17" },
  { id: "STU003", name: "王秀芳", phone: "137****9012", source: "抖音推广", status: "待分配", regDate: "2025-01-16" },
  { id: "STU004", name: "李桂兰", phone: "136****3456", source: "线下咨询", status: "待分配", regDate: "2025-01-15" },
  { id: "STU005", name: "张春花", phone: "158****7890", source: "小红书", status: "待分配", regDate: "2025-01-14" },
]

// 拉取学员对话框
function PullStudentsDialog({ subject, trigger }: { subject: Subject; trigger?: React.ReactNode }) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredStudents = availableStudents.filter(s => 
    s.name.includes(searchTerm) || s.phone.includes(searchTerm)
  )
  
  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }
  
  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7" title="拉取学员"><Users className="h-4 w-4" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            拉取学员到科目
          </DialogTitle>
          <DialogDescription className="text-xs">
            将待分配学员拉取到【{subject.name}】
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索学员姓名或手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm text-muted-foreground">全选</span>
              </div>
              <span className="text-sm text-muted-foreground">
                已选择 {selectedStudents.length} / {filteredStudents.length} 人
              </span>
            </div>
            
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <div
                  key={student.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedStudents.includes(student.id) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => toggleStudent(student.id)}
                >
                  <Checkbox checked={selectedStudents.includes(student.id)} />
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                      {student.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>来源: {student.source}</span>
                      <span>·</span>
                      <span>报名: {student.regDate}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    {student.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无待分配学员
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="px-4 py-3 border-t shrink-0">
          <Button variant="outline">取消</Button>
          <Button disabled={selectedStudents.length === 0}>
            <Users className="h-4 w-4 mr-1" />
            拉取 {selectedStudents.length} 名学员
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter
      const matchCategory = categoryFilter === "all" || s.category === categoryFilter
      const matchSearch = !searchTerm || s.name.includes(searchTerm) || s.id.includes(searchTerm)
      return matchStatus && matchCategory && matchSearch
    })
  }, [statusFilter, categoryFilter, searchTerm])

  const stats = useMemo(() => ({
    total: subjects.length,
    active: subjects.filter(s => s.status === "active").length,
    students: subjects.reduce((sum, s) => sum + s.students, 0),
  }), [])

  const toggleSelectAll = () => {
    if (selectedSubjects.length === filteredSubjects.length) {
      setSelectedSubjects([])
    } else {
      setSelectedSubjects(filteredSubjects.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <AdminLayout title="科目管理">
      <div className="space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总科目数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </Card>
          <Card className="p-4 border-green-200 bg-green-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">开课中</p>
                <p className="text-2xl font-bold text-green-700">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-4 border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">在读学员</p>
                <p className="text-2xl font-bold text-blue-700">{stats.students}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
          <Card className="p-4 border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">即将开课</p>
                <p className="text-2xl font-bold text-amber-700">{subjects.filter(s => s.status === "upcoming").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-400" />
            </div>
          </Card>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索科目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">开课中</SelectItem>
                <SelectItem value="upcoming">即将开课</SelectItem>
                <SelectItem value="paused">已暂停</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="月嫂">月嫂</SelectItem>
                <SelectItem value="产康">产康师</SelectItem>
                <SelectItem value="育婴">育婴师</SelectItem>
                <SelectItem value="催乳">催乳师</SelectItem>
                <SelectItem value="推拿">小儿推拿</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SubjectFormDialog />
        </div>

        {/* 科目列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedSubjects.length === filteredSubjects.length && filteredSubjects.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">编号</TableHead>
                <TableHead className="min-w-[150px]">科目名称</TableHead>
                <TableHead className="w-[80px]">分类</TableHead>
                <TableHead className="w-[60px]">等级</TableHead>
                <TableHead className="w-[80px]">培训周期</TableHead>
                <TableHead className="w-[60px]">课时</TableHead>
                <TableHead className="w-[80px]">学费</TableHead>
                <TableHead className="w-[80px]">授课老师</TableHead>
                <TableHead className="w-[60px]">学员</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => toggleSelect(subject.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{subject.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{subject.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{subject.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{subject.level}</TableCell>
                  <TableCell className="text-sm">{subject.duration}</TableCell>
                  <TableCell className="text-sm">{subject.sessions}</TableCell>
                  <TableCell className="font-medium text-primary">¥{subject.price.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{subject.teacher}</TableCell>
                  <TableCell className="text-sm">{subject.students}人</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusConfig[subject.status].color)}>
                      {statusConfig[subject.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <SubjectDetailDialog subject={subject} trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="查看详情"><Eye className="h-4 w-4" /></Button>
                      } />
                      <SubjectFormDialog subject={subject} trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="编辑"><Edit className="h-4 w-4" /></Button>
                      } />
                      <PullStudentsDialog subject={subject} trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="拉取学员"><Users className="h-4 w-4" /></Button>
                      } />
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" title="删除">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 底部统计 */}
        <div className="text-sm text-muted-foreground text-center">
          显示 {filteredSubjects.length} / {subjects.length} 个科目
          {selectedSubjects.length > 0 && <span className="ml-4">已选择 {selectedSubjects.length} 个</span>}
        </div>
      </div>
    </AdminLayout>
  )
}
