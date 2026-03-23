"use client"

import React from "react"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  Search, Plus, Users, Calendar, Clock, BookOpen, GraduationCap, MoreHorizontal, MapPin, 
  Eye, Edit, Trash2, UserPlus, FileText, CheckCircle, AlertCircle
} from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  name: string
  course: string
  teacher: string
  startDate: string
  endDate: string
  schedule: string
  location: string
  totalStudents: number
  activeStudents: number
  completedLessons: number
  totalLessons: number
  status: "active" | "upcoming" | "completed"
  progress: number
  fee: string
  description?: string
  students?: { id: string; name: string; progress: number; status: string }[]
}

const classes: ClassItem[] = [
  { id: "CLS001", name: "高级月嫂培训班 - 2024年第3期", course: "高级月嫂培训", teacher: "张老师", startDate: "2024-02-01", endDate: "2024-03-15", schedule: "每周一至五 09:00-17:00", location: "银川培训中心 A101", totalStudents: 25, activeStudents: 23, completedLessons: 28, totalLessons: 45, status: "active", progress: 62, fee: "6800", description: "系统学习月嫂专业技能，包括新生儿护理、产妇护理、月子餐制作等", students: [{ id: "S001", name: "李春华", progress: 85, status: "training" }, { id: "S006", name: "赵丽娜", progress: 75, status: "training" }] },
  { id: "CLS002", name: "产康师初级认证班 - 2024年第2期", course: "产康师初级认证", teacher: "李老师", startDate: "2024-01-15", endDate: "2024-02-28", schedule: "每周一三五 09:00-17:00", location: "银川培训中心 B203", totalStudents: 18, activeStudents: 18, completedLessons: 20, totalLessons: 30, status: "active", progress: 67, fee: "4500", description: "产后康复基础理论与实操技能培训" },
  { id: "CLS003", name: "育婴师专业班 - 2024年第1期", course: "育婴师专业班", teacher: "王老师", startDate: "2024-03-01", endDate: "2024-03-20", schedule: "每周二四六 09:00-17:00", location: "银川培训中心 C105", totalStudents: 20, activeStudents: 0, completedLessons: 0, totalLessons: 20, status: "upcoming", progress: 0, fee: "3200", description: "育婴师专业技能培训，含早教、辅食制作等" },
  { id: "CLS004", name: "高级月嫂培训班 - 2024年第2期", course: "高级月嫂培训", teacher: "张老师", startDate: "2023-12-01", endDate: "2024-01-15", schedule: "每周一至五 09:00-17:00", location: "银川培训中心 A101", totalStudents: 22, activeStudents: 0, completedLessons: 45, totalLessons: 45, status: "completed", progress: 100, fee: "6800" },
  { id: "CLS005", name: "产康师高级进阶班 - 2024年第1期", course: "产康师高级进阶", teacher: "赵老师", startDate: "2024-03-10", endDate: "2024-05-10", schedule: "每周一三五 09:00-17:00", location: "银川培训中心 B201", totalStudents: 15, activeStudents: 0, completedLessons: 0, totalLessons: 60, status: "upcoming", progress: 0, fee: "9800", description: "产康师高级技能进阶培训" },
]

const statusConfig = {
  active: { label: "进行中", color: "bg-green-100 text-green-700 border-green-200" },
  upcoming: { label: "即将开班", color: "bg-amber-100 text-amber-700 border-amber-200" },
  completed: { label: "已结束", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Create Class Dialog
function CreateClassDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建班级</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />新建班级
          </DialogTitle>
          <DialogDescription className="text-xs">创建新的培训班级</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">班级名称</Label>
            <Input placeholder="如：高级月嫂培训班 - 2024年第4期" className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">关联课程</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择课程" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yuesao">高级月嫂培训</SelectItem>
                  <SelectItem value="chankang1">产康师初级认证</SelectItem>
                  <SelectItem value="chankang2">产康师高级进阶</SelectItem>
                  <SelectItem value="yuying">育婴师专业班</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">授课老师</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择老师" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zhang">张老师</SelectItem>
                  <SelectItem value="li">李老师</SelectItem>
                  <SelectItem value="wang">王老师</SelectItem>
                  <SelectItem value="zhao">赵老师</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">开班日期</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">结业日期</Label>
              <Input type="date" className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">上课时间</Label>
              <Input placeholder="如：每周一至五 09:00-17:00" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">上课地点</Label>
              <Input placeholder="如：银川培训中心 A101" className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">招生人数</Label>
              <Input type="number" placeholder="25" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">学费(元)</Label>
              <Input type="number" placeholder="6800" className="h-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">班级简介</Label>
            <Input placeholder="班级介绍及培训内容概述" className="h-8 text-xs" />
          </div>
        </div>
        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">创建班级</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Class Detail Dialog
function ClassDetailDialog({ cls, trigger }: { cls: ClassItem; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm pr-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>班级详情</span>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[cls.status].color)}>
                {statusConfig[cls.status].label}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{cls.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Header Info */}
          <div className="p-4 bg-muted/30 border-b">
            <h3 className="font-semibold mb-2">{cls.name}</h3>
            <p className="text-xs text-muted-foreground">{cls.description || cls.course}</p>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-9 px-4">
              <TabsTrigger value="info" className="text-xs h-7">基本信息</TabsTrigger>
              <TabsTrigger value="students" className="text-xs h-7">学员列表</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs h-7">课程安排</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-4 space-y-3 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">关联课程</p>
                  <p className="text-xs font-medium">{cls.course}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">授课老师</p>
                  <p className="text-xs font-medium">{cls.teacher}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">开班日期</p>
                  <p className="text-xs font-medium">{cls.startDate}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">结业日期</p>
                  <p className="text-xs font-medium">{cls.endDate}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">上课时间</p>
                  <p className="text-xs font-medium">{cls.schedule}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground mb-1">上课地点</p>
                  <p className="text-xs font-medium">{cls.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-lg font-bold text-primary">{cls.activeStudents}/{cls.totalStudents}</p>
                  <p className="text-[10px] text-muted-foreground">学员人数</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-lg font-bold text-green-600">{cls.completedLessons}/{cls.totalLessons}</p>
                  <p className="text-[10px] text-muted-foreground">课时进度</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-lg font-bold text-amber-500">¥{cls.fee}</p>
                  <p className="text-[10px] text-muted-foreground">学费</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground">教学进度</p>
                  <p className="text-xs font-medium">{cls.progress}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${cls.progress}%` }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="p-4 space-y-2 mt-0">
              {cls.students && cls.students.length > 0 ? cls.students.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">{s.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">进度: {s.progress}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">培训中</Badge>
                </div>
              )) : (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  {cls.status === "upcoming" ? "班级尚未开班，暂无学员" : "暂无学员数据"}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="p-4 mt-0">
              <div className="text-center py-6 text-muted-foreground text-xs">
                课程安排功能开发中...
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><UserPlus className="h-3 w-3 mr-1" />添加学员</Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Edit className="h-3 w-3 mr-1" />编辑</Button>
              <Button size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" />导出报告</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      const matchCourse = courseFilter === "all" || c.course.includes(courseFilter)
      const matchSearch = !searchTerm || c.name.includes(searchTerm) || c.teacher.includes(searchTerm)
      return matchStatus && matchCourse && matchSearch
    })
  }, [statusFilter, courseFilter, searchTerm])

  const stats = useMemo(() => ({
    total: classes.length,
    active: classes.filter(c => c.status === "active").length,
    upcoming: classes.filter(c => c.status === "upcoming").length,
    students: classes.reduce((sum, c) => sum + c.activeStudents, 0),
  }), [])

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">班级管理</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{stats.total}个班级</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />{stats.active}进行中</span>
                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-amber-500" />{stats.upcoming}待开班</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3 text-blue-500" />{stats.students}在读</span>
              </div>
            </div>
            <CreateClassDialog />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索班级..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">进行中</SelectItem>
                <SelectItem value="upcoming">即将开班</SelectItem>
                <SelectItem value="completed">已结束</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部课程</SelectItem>
                <SelectItem value="月嫂">月嫂</SelectItem>
                <SelectItem value="育婴">育婴师</SelectItem>
                <SelectItem value="产康">产康师</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classes Grid */}
          <div className="grid md:grid-cols-2 gap-2">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="p-3 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium truncate">{cls.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[10px] h-4 px-1", statusConfig[cls.status].color)}>
                        {statusConfig[cls.status].label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{cls.course}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClassDetailDialog cls={cls} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs"><UserPlus className="h-3 w-3 mr-2" />添加学员</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cls.activeStudents}/{cls.totalStudents}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{cls.completedLessons}/{cls.totalLessons}课</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cls.startDate.slice(5)}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cls.location.split(" ")[1]}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-[8px]">{cls.teacher.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] text-muted-foreground">{cls.teacher}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cls.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8">{cls.progress}%</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats hint */}
          <div className="text-xs text-muted-foreground text-center">
            显示 {filteredClasses.length} / {classes.length} 个班级
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
