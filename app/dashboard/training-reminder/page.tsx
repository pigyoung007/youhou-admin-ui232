"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft, Search, GraduationCap, BookOpen, Award, 
  Calendar, Clock, MapPin, Users, FileText
} from "lucide-react"
import Link from "next/link"

// 开课提醒数据
const classStartData = [
  { 
    id: "CS001", courseName: "高级月嫂培训班", className: "第18期", 
    startTime: "2026-03-20 09:00", location: "培训中心A教室", 
    studentCount: 15, teacher: "王老师", daysRemaining: 1,
    contractNo: "TC202603001", orderId: "TO202603001"
  },
  { 
    id: "CS002", courseName: "育婴师资格培训", className: "第22期", 
    startTime: "2026-03-21 14:00", location: "培训中心B教室", 
    studentCount: 12, teacher: "李老师", daysRemaining: 2,
    contractNo: "TC202603002", orderId: "TO202603002"
  },
  { 
    id: "CS003", courseName: "产康技师进阶班", className: "第8期", 
    startTime: "2026-03-22 09:00", location: "培训中心C教室", 
    studentCount: 8, teacher: "张老师", daysRemaining: 3,
    contractNo: "TC202603003", orderId: "TO202603003"
  },
]

// 考级提醒数据
const examReminderData = [
  { 
    id: "ER001", examName: "高级月嫂职业资格考试", 
    examDate: "2026-03-27", examLocation: "市人社局考试中心", 
    studentCount: 8, daysRemaining: 7,
    students: ["李小红", "张美华", "王丽娜", "陈秀英", "刘桂芳", "周晓燕", "吴小芳", "钱美玲"]
  },
  { 
    id: "ER002", examName: "育婴师等级考试", 
    examDate: "2026-04-02", examLocation: "区职业技能鉴定中心", 
    studentCount: 12, daysRemaining: 13,
    students: ["赵丽丽", "孙小燕", "杨美华"]
  },
  { 
    id: "ER003", examName: "产康师资格认证", 
    examDate: "2026-03-25", examLocation: "市职业技能中心", 
    studentCount: 5, daysRemaining: 5,
    students: ["郑小红", "黄丽华", "林秀英", "何美玲", "高晓燕"]
  },
]

// 培训人员列表数据
const trainingStudentData = [
  {
    id: "TS001", name: "李小红", phone: "138****1234", courseName: "高级月嫂培训班",
    className: "第18期", startDate: "2026-03-20", endDate: "2026-04-20",
    contractNo: "TC202603001", orderId: "TO202603001", status: "upcoming",
    teacher: "王老师", progress: 0
  },
  {
    id: "TS002", name: "张美华", phone: "139****2345", courseName: "高级月嫂培训班",
    className: "第18期", startDate: "2026-03-20", endDate: "2026-04-20",
    contractNo: "TC202603002", orderId: "TO202603002", status: "upcoming",
    teacher: "王老师", progress: 0
  },
  {
    id: "TS003", name: "王丽娜", phone: "137****3456", courseName: "育婴师资格培训",
    className: "第22期", startDate: "2026-03-21", endDate: "2026-04-21",
    contractNo: "TC202603003", orderId: "TO202603003", status: "upcoming",
    teacher: "李老师", progress: 0
  },
  {
    id: "TS004", name: "赵丽丽", phone: "136****4567", courseName: "产康技师进阶班",
    className: "第8期", startDate: "2026-03-22", endDate: "2026-04-10",
    contractNo: "TC202603004", orderId: "TO202603004", status: "upcoming",
    teacher: "张老师", progress: 0
  },
]

export default function TrainingReminderPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("classes")

  const getDaysColor = (days: number) => {
    if (days <= 1) return "bg-red-100 text-red-700 border-red-200"
    if (days <= 3) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  return (
    <AdminLayout title="培训提醒">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <div>
            <h1 className="text-xl font-semibold">培训提醒</h1>
            <p className="text-sm text-muted-foreground">
              开课提醒、考级提醒及培训人员管理
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-cyan-200 bg-cyan-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">即将开课</p>
                  <p className="text-2xl font-bold text-cyan-600">{classStartData.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">考试安排</p>
                  <p className="text-2xl font-bold text-purple-600">{examReminderData.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">参训人数</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {classStartData.reduce((sum, c) => sum + c.studentCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待考人数</p>
                  <p className="text-2xl font-bold">
                    {examReminderData.reduce((sum, e) => sum + e.studentCount, 0)}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab切换 */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent">
                <TabsTrigger value="classes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <BookOpen className="h-4 w-4 mr-2" />
                  开课提醒
                </TabsTrigger>
                <TabsTrigger value="exams" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Award className="h-4 w-4 mr-2" />
                  考级提醒
                </TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Users className="h-4 w-4 mr-2" />
                  培训人员
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 开课提醒 */}
            <TabsContent value="classes" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>课程名称</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>开课时间</TableHead>
                    <TableHead>上课地点</TableHead>
                    <TableHead>学员人数</TableHead>
                    <TableHead>授课老师</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStartData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.courseName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className={getDaysColor(item.daysRemaining)}>
                            {item.daysRemaining === 1 ? "明天" : `${item.daysRemaining}天后`}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{item.startTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{item.studentCount}人</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.teacher}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/education/courses?id=${item.id}`}>
                              查看详情
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* 考级提醒 */}
            <TabsContent value="exams" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>考试名称</TableHead>
                    <TableHead>考试时间</TableHead>
                    <TableHead>考试地点</TableHead>
                    <TableHead>参考人数</TableHead>
                    <TableHead>参考学员</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examReminderData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.examName}</TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className={getDaysColor(item.daysRemaining)}>
                            {item.daysRemaining}天后
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{item.examDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{item.examLocation}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.studentCount}人</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.students.slice(0, 3).map((name, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{name}</Badge>
                          ))}
                          {item.students.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{item.students.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/education/exams?id=${item.id}`}>
                              查看详情
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* 培训人员 */}
            <TabsContent value="students" className="m-0">
              <div className="p-4 border-b">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="搜索学员姓名或电话..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学员信息</TableHead>
                    <TableHead>课程名称</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>培训时间</TableHead>
                    <TableHead>合同/订单</TableHead>
                    <TableHead>授课老师</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingStudentData
                    .filter(s => !searchTerm || s.name.includes(searchTerm) || s.phone.includes(searchTerm))
                    .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-cyan-100 text-cyan-700">
                              {item.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.courseName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{item.startDate}</p>
                          <p className="text-xs text-muted-foreground">至 {item.endDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {item.contractNo}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{item.teacher}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/education/students?id=${item.id}`}>
                              查看详情
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  )
}
