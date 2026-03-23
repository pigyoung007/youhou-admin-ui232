"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Phone, MessageSquare, Plus, Edit, Calendar,
  FileText, X, ExternalLink, Award, BookOpen, GraduationCap,
  ChevronDown, ChevronRight, Eye, CheckCircle, Clock, ClipboardList,
  User, UserPlus
} from "lucide-react"
import { cn } from "@/lib/utils"

// 学员详情数据接口
export interface StudentDetail {
  id: string
  name: string
  avatar?: string
  phone: string
  gender?: "male" | "female"
  age?: number
  status: "registered" | "studying" | "completed" | "dropout"
  consultant: string
  consultantId?: string
  // 基本信息
  idCard?: string
  birthDate?: string
  nativePlace?: string
  currentAddress?: string
  education?: string
  maritalStatus?: string
  emergencyContact?: string
  emergencyPhone?: string
  registrationDate?: string
  source?: string // 来源渠道
  // 课程信息
  courses?: CourseRecord[]
  // 报名记录
  enrollments?: EnrollmentRecord[]
  // 考试成绩
  exams?: ExamRecord[]
  // 证书信息
  certificates?: CertificateRecord[]
  // 标签
  tags?: { id: string; name: string; color: string }[]
  // 资料完整度
  profileCompleteness?: number
  // 是否已转化为家政员
  convertedToNanny?: boolean
  nannyId?: string
}

// 课程记录
export interface CourseRecord {
  id: string
  courseName: string
  courseType: string
  teacher: string
  startDate: string
  endDate: string
  progress: number
  status: "not_started" | "in_progress" | "completed"
  totalHours: number
  attendedHours: number
}

// 报名记录
export interface EnrollmentRecord {
  id: string
  courseName: string
  enrollDate: string
  amount: number
  paymentStatus: "unpaid" | "partial" | "paid"
  orderNo: string
}

// 考试记录
export interface ExamRecord {
  id: string
  examName: string
  courseName: string
  examDate: string
  score: number
  totalScore: number
  passed: boolean
  rank?: number
}

// 证书记录
export interface CertificateRecord {
  id: string
  certName: string
  certType: "training" | "skill" | "qualification"
  issueDate: string
  certNo: string
  validUntil?: string
  status: "issued" | "pending" | "received" | "pending_upload"
  image?: string
  courseId?: string // 关联的课程ID（已购买课程附带的证书）
}

interface StudentDetailPanelProps {
  student: StudentDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (student: StudentDetail) => void
  onCall?: (student: StudentDetail) => void
  onConvertToNanny?: (student: StudentDetail) => void
}

// 状态配置
const statusConfig: Record<string, { label: string; color: string }> = {
  registered: { label: "已报名", color: "bg-blue-100 text-blue-800" },
  studying: { label: "在读", color: "bg-green-100 text-green-800" },
  completed: { label: "已结业", color: "bg-amber-100 text-amber-800" },
  dropout: { label: "已退学", color: "bg-red-100 text-red-800" },
}

// 信息行组件
function InfoRow({ label, value, editable = false }: { label: string; value: React.ReactNode; editable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed last:border-b-0">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {editable && <Edit className="h-3 w-3 cursor-pointer hover:text-primary" />}
      </span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  )
}

export function StudentDetailPanel({
  student,
  open,
  onOpenChange,
  onEdit,
  onCall,
  onConvertToNanny,
}: StudentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("courses")
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [contactInfoOpen, setContactInfoOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
        {/* 顶部标题栏 */}
        <SheetHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base font-medium">学员档案</SheetTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-8" onClick={() => window.open(`/education/students/${student.id}`, '_blank')}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {/* 主内容区 - 左右分栏 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧：基本信息区 */}
          <div className="w-[320px] border-r flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* 头像和基本信息 */}
                <div className="flex flex-col items-center">
                  {/* 快捷操作按钮 */}
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      size="sm"
                      className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600"
                      onClick={() => onCall?.(student)}
                      title="拨打电话"
                    >
                      <Phone className="h-4 w-4 text-white" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 w-9 rounded-full" title="发消息">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 w-9 rounded-full" title="查看课程">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                    {!student.convertedToNanny && (
                      <Button size="sm" variant="outline" className="h-9 w-9 rounded-full" title="转为家政员" onClick={() => onConvertToNanny?.(student)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* 头像 */}
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">{student.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>

                  {/* 姓名和职位 */}
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.consultant} 跟进</p>
                  </div>

                  {/* 状态标签 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn("text-xs", statusConfig[student.status]?.color)}>
                      {statusConfig[student.status]?.label}
                    </Badge>
                    {student.convertedToNanny && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">已转家政员</Badge>
                    )}
                  </div>

                  {/* 标签 */}
                  {student.tags && student.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {student.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                        <Plus className="h-3 w-3" /> 标签
                      </Button>
                    </div>
                  )}
                </div>

                {/* 资料完整度 */}
                <div className="flex items-center gap-2 py-2 px-3 bg-muted/30 rounded-lg mb-4">
                  <span className="text-sm">资料完整度</span>
                  <Progress value={student.profileCompleteness || 0} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{student.profileCompleteness || 0}%</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(student)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>

                <Separator className="my-3" />

                {/* 基本信息折叠区 */}
                <Collapsible open={basicInfoOpen} onOpenChange={setBasicInfoOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                    <span className="text-sm font-medium">基本信息</span>
                    {basicInfoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-0 mt-2">
                      <InfoRow label="姓名" value={student.name} editable />
                      <InfoRow label="手机号" value={<span className="tabular-nums">{student.phone}</span>} editable />
                      <InfoRow label="性别" value={student.gender === "female" ? "女" : "男"} />
                      <InfoRow label="年龄" value={student.age ? `${student.age}岁` : undefined} />
                      <InfoRow label="籍贯" value={student.nativePlace} editable />
                      <InfoRow label="学历" value={student.education} />
                      <InfoRow label="婚姻状况" value={student.maritalStatus} />
                      <InfoRow label="报名日期" value={student.registrationDate} />
                      <InfoRow label="来源渠道" value={student.source} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-3" />

                {/* 联系信息折叠区 */}
                <Collapsible open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                    <span className="text-sm font-medium">联系信息</span>
                    {contactInfoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-0 mt-2">
                      <InfoRow label="现住地址" value={student.currentAddress} editable />
                      <InfoRow label="紧急联系人" value={student.emergencyContact} editable />
                      <InfoRow label="紧急联系电话" value={<span className="tabular-nums">{student.emergencyPhone}</span>} editable />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </div>

          {/* 右侧主Tab区域 - 课程/报名/考试/证书 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start h-10 px-4 rounded-none border-b bg-transparent">
              <TabsTrigger value="courses" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                课程信息
              </TabsTrigger>
              <TabsTrigger value="enrollments" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                报名记录
              </TabsTrigger>
              <TabsTrigger value="exams" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                考试成绩
              </TabsTrigger>
              <TabsTrigger value="certificates" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                证书信息
              </TabsTrigger>
            </TabsList>

            {/* 课程信息Tab */}
            <TabsContent value="courses" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">已报课程</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />添加课程
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {(student.courses || [
                    { id: "1", courseName: "高级月嫂培训班", courseType: "技能培训", teacher: "张老师", startDate: "2025-03-01", endDate: "2025-03-15", progress: 80, status: "in_progress" as const, totalHours: 40, attendedHours: 32 },
                    { id: "2", courseName: "母乳喂养指导", courseType: "专项技能", teacher: "李老师", startDate: "2025-03-10", endDate: "2025-03-12", progress: 100, status: "completed" as const, totalHours: 8, attendedHours: 8 },
                    { id: "3", courseName: "新生儿护理实操", courseType: "专项技能", teacher: "王老师", startDate: "2025-03-20", endDate: "2025-03-22", progress: 0, status: "not_started" as const, totalHours: 12, attendedHours: 0 },
                  ]).map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{course.courseName}</span>
                        </div>
                        <Badge className={cn("text-xs", 
                          course.status === "completed" ? "bg-green-100 text-green-800" :
                          course.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {course.status === "completed" ? "已完成" : course.status === "in_progress" ? "进行中" : "未开始"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <span>授课老师：{course.teacher}</span>
                        <span>课程类型：{course.courseType}</span>
                        <span>开课日期：{course.startDate}</span>
                        <span>结束日期：{course.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">学习进度</span>
                        <Progress value={course.progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium">{course.attendedHours}/{course.totalHours}课时</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 报名记录Tab */}
            <TabsContent value="enrollments" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">报名记录</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />新增报名
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>课程名称</TableHead>
                        <TableHead>报名日期</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>付款状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(student.enrollments || [
                        { id: "1", courseName: "高级月嫂培训班", enrollDate: "2025-02-25", amount: 3980, paymentStatus: "paid" as const, orderNo: "EDU2025022500001" },
                        { id: "2", courseName: "母乳喂养指导", enrollDate: "2025-03-05", amount: 680, paymentStatus: "paid" as const, orderNo: "EDU2025030500002" },
                        { id: "3", courseName: "新生儿护理实操", enrollDate: "2025-03-15", amount: 880, paymentStatus: "partial" as const, orderNo: "EDU2025031500003" },
                      ]).map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="tabular-nums">{enrollment.orderNo}</TableCell>
                          <TableCell className="font-medium">{enrollment.courseName}</TableCell>
                          <TableCell>{enrollment.enrollDate}</TableCell>
                          <TableCell className="tabular-nums">¥{enrollment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs",
                              enrollment.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
                              enrollment.paymentStatus === "partial" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            )}>
                              {enrollment.paymentStatus === "paid" ? "已付款" : enrollment.paymentStatus === "partial" ? "部分付款" : "未付款"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">查看</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 考试成绩Tab */}
            <TabsContent value="exams" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">考试成绩</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>考试名称</TableHead>
                        <TableHead>关联课程</TableHead>
                        <TableHead>考试日期</TableHead>
                        <TableHead>成绩</TableHead>
                        <TableHead>排名</TableHead>
                        <TableHead>结果</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(student.exams || [
                        { id: "1", examName: "母乳喂养理论考试", courseName: "母乳喂养指导", examDate: "2025-03-12", score: 92, totalScore: 100, passed: true, rank: 3 },
                        { id: "2", examName: "月嫂理论考试", courseName: "高级月嫂培训班", examDate: "2025-03-15", score: 85, totalScore: 100, passed: true, rank: 8 },
                      ]).map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell className="font-medium">{exam.examName}</TableCell>
                          <TableCell>{exam.courseName}</TableCell>
                          <TableCell>{exam.examDate}</TableCell>
                          <TableCell>
                            <span className={cn("tabular-nums font-medium", exam.passed ? "text-green-600" : "text-red-600")}>
                              {exam.score}/{exam.totalScore}
                            </span>
                          </TableCell>
                          <TableCell className="tabular-nums">{exam.rank ? `第${exam.rank}名` : "-"}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", exam.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                              {exam.passed ? "通过" : "未通过"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 证书信息Tab */}
            <TabsContent value="certificates" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">证书信息</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />添加证书
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {(student.certificates || [
                    { id: "1", certName: "高级母婴护理师结业证书", certType: "training" as const, issueDate: "2025-03-15", certNo: "CERT2025031500001", status: "received" as const },
                    { id: "2", certName: "母乳喂养指导师证书", certType: "skill" as const, issueDate: "2025-03-12", certNo: "CERT2025031200002", status: "issued" as const },
                    { id: "3", certName: "育婴师资格证（高级）", certType: "qualification" as const, issueDate: "", certNo: "", status: "pending" as const },
                    { id: "4", certName: "新生儿护理实操证书", certType: "training" as const, issueDate: "", certNo: "", status: "pending_upload" as const, courseId: "C003" },
                    { id: "5", certName: "产后康复师证书", certType: "skill" as const, issueDate: "", certNo: "", status: "pending_upload" as const, courseId: "C004" },
                  ]).map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Award className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{cert.certName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {cert.certType === "training" ? "培训证书" : cert.certType === "skill" ? "技能证书" : "资格证书"}
                            </Badge>
                            {cert.certNo && <span className="tabular-nums">证书号：{cert.certNo}</span>}
                            {cert.issueDate && <span>发证日期：{cert.issueDate}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs",
                          cert.status === "received" ? "bg-green-100 text-green-800" :
                          cert.status === "issued" ? "bg-blue-100 text-blue-800" :
                          cert.status === "pending_upload" ? "bg-amber-100 text-amber-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {cert.status === "received" ? "已领取" : cert.status === "issued" ? "待领取" : cert.status === "pending_upload" ? "待上传" : "待颁发"}
                        </Badge>
                        {cert.status === "pending_upload" ? (
                          <Button variant="outline" size="sm" className="text-xs">
                            <Plus className="h-3 w-3 mr-1" />上传证书
                          </Button>
                        ) : cert.status !== "pending" && <Button variant="ghost" size="sm">查看</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
