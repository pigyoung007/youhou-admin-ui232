"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Search, UserPlus, Eye, CheckCircle2, Clock, XCircle, 
  Award, User, Phone, MapPin, GraduationCap, Briefcase, Star, Calendar, FileCheck, AlertTriangle, X, Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TransferCandidate {
  id: string
  studentId: string
  name: string
  age: number
  gender: "female" | "male"
  phone: string
  hometown: string
  currentCity: string
  education: string
  course: string
  className: string
  graduateDate: string
  score: number
  level: string
  certificates: { name: string; certNo: string; date: string }[]
  skills: string[]
  experience: string
  expectedSalary: string
  status: "pending" | "approved" | "rejected"
  submitDate: string
  reviewDate?: string
  reviewNote?: string
  tags?: string[]
}

const transferCandidates: TransferCandidate[] = [
  { id: "TR001", studentId: "S002", name: "王秀兰", age: 42, gender: "female", phone: "139****5678", hometown: "宁夏固原", currentCity: "银川市", education: "初中", course: "产康师初级", className: "2024年第2期", graduateDate: "2025-07-15", score: 88, level: "初级", certificates: [{ name: "产康师证", certNo: "CK-2025-001235", date: "2025-07-15" }], skills: ["产后修复", "盆底康复"], experience: "5年", expectedSalary: "8000-10000", status: "pending", submitDate: "2025-07-20", tags: ["耐心细致", "善于沟通"] },
  { id: "TR002", studentId: "S004", name: "陈桂芳", age: 45, gender: "female", phone: "136****3456", hometown: "宁夏吴忠", currentCity: "银川市", education: "高中", course: "高级月嫂", className: "2024年第2期", graduateDate: "2025-06-15", score: 95, level: "金牌", certificates: [{ name: "高级母婴护理师证", certNo: "YS-2025-000456", date: "2025-06-15" }, { name: "催乳师证", certNo: "CR-2022-000123", date: "2022-03-10" }], skills: ["月子餐", "早教", "催乳", "双胞胎护理"], experience: "8年", expectedSalary: "18000-22000", status: "pending", submitDate: "2025-06-20", tags: ["经验丰富", "好评如潮"] },
  { id: "TR003", studentId: "S009", name: "吴美华", age: 48, gender: "female", phone: "136****4567", hometown: "宁夏吴忠", currentCity: "银川市", education: "初中", course: "高级月嫂", className: "2024年第1期", graduateDate: "2025-05-15", score: 98, level: "金牌", certificates: [{ name: "高级母婴护理师证", certNo: "YS-2025-000123", date: "2025-05-15" }, { name: "催乳师证", certNo: "CR-2019-000045", date: "2019-03-10" }, { name: "营养师证", certNo: "YY-2021-000089", date: "2021-08-15" }], skills: ["月子餐", "早教", "催乳", "双胞胎", "早产儿", "高端服务"], experience: "12年", expectedSalary: "20000-25000", status: "approved", submitDate: "2025-05-20", reviewDate: "2025-05-22", reviewNote: "优秀学员，已成功转化为金牌月嫂", tags: ["资深专家", "VIP客户首选"] },
  { id: "TR004", studentId: "S010", name: "郑小红", age: 35, gender: "female", phone: "135****8901", hometown: "宁夏银川", currentCity: "银川市", education: "高中", course: "育婴师", className: "2024年第2期", graduateDate: "2025-07-20", score: 82, level: "中级", certificates: [{ name: "育婴师证", certNo: "YY-2025-001236", date: "2025-07-20" }], skills: ["辅食制作", "婴儿按摩", "早教"], experience: "3年", expectedSalary: "9000-11000", status: "approved", submitDate: "2025-07-25", reviewDate: "2025-07-28", reviewNote: "已安排面试培训", tags: ["细心负责"] },
  { id: "TR005", studentId: "S011", name: "钱小敏", age: 31, gender: "female", phone: "138****3456", hometown: "宁夏固原", currentCity: "银川市", education: "中专", course: "产康师初级", className: "2024年第2期", graduateDate: "2025-06-30", score: 78, level: "初级", certificates: [{ name: "产康师证", certNo: "CK-2025-001234", date: "2025-06-30" }], skills: ["产后修复", "盆底康复", "腹直肌修复"], experience: "2年", expectedSalary: "8000-10000", status: "rejected", submitDate: "2025-07-05", reviewDate: "2025-07-08", reviewNote: "需补充相关健康证明材料", tags: [] },
  { id: "TR006", studentId: "S012", name: "冯雪梅", age: 40, gender: "female", phone: "139****7890", hometown: "宁夏中卫", currentCity: "银川市", education: "高中", course: "高级月嫂", className: "2024年第2期", graduateDate: "2025-06-15", score: 90, level: "高级", certificates: [{ name: "高级母婴护理师证", certNo: "YS-2022-000789", date: "2022-09-15" }, { name: "催乳师证", certNo: "CR-2023-000234", date: "2023-05-10" }], skills: ["月子餐", "早教", "催乳", "新生儿护理"], experience: "6年", expectedSalary: "14000-16000", status: "pending", submitDate: "2025-06-20", tags: ["温柔耐心", "擅长月子餐"] },
  { id: "TR007", studentId: "S014", name: "徐丽萍", age: 37, gender: "female", phone: "136****5678", hometown: "宁夏银川", currentCity: "银川市", education: "大专", course: "产康师高级", className: "2024年第2期", graduateDate: "2025-06-15", score: 94, level: "高级", certificates: [{ name: "高级产康师证", certNo: "CK-2025-000567", date: "2025-06-15" }, { name: "康复理疗师证", certNo: "KF-2024-000123", date: "2024-02-20" }], skills: ["产后修复", "盆底康复", "腹直肌修复", "骨盆矫正", "体态矫正"], experience: "5年", expectedSalary: "15000-18000", status: "approved", submitDate: "2025-06-20", reviewDate: "2025-06-25", reviewNote: "专业能力突出，已入职高端产康中心", tags: ["专业技能强", "学历高"] },
  { id: "TR008", studentId: "S016", name: "朱玉梅", age: 39, gender: "female", phone: "138****0123", hometown: "宁夏固原", currentCity: "银川市", education: "初中", course: "育婴师", className: "2024年第2期", graduateDate: "2025-07-01", score: 85, level: "中级", certificates: [{ name: "育婴师证", certNo: "YY-2025-001237", date: "2025-07-01" }], skills: ["早教", "辅食制作", "婴儿按摩"], experience: "3年", expectedSalary: "8000-10000", status: "pending", submitDate: "2025-07-05", tags: ["有爱心", "喜欢孩子"] },
]

const statusConfig = {
  pending: { label: "待审核", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  approved: { label: "已转化", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { label: "已驳回", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
}

// Transfer Review Dialog
function TransferReviewDialog({ candidate, trigger }: { candidate: TransferCandidate; trigger?: React.ReactNode }) {
  const [tags, setTags] = useState<string[]>(candidate.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [jobStatus, setJobStatus] = useState("available")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            转化审核
          </DialogTitle>
          <DialogDescription className="text-xs">审核学员转化申请并录入家政员档案</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Candidate Info Header */}
          <div className="p-4 bg-muted/30 border-b">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-purple-100 text-purple-700">{candidate.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{candidate.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{candidate.level}</Badge>
                  <Badge variant="outline" className={cn("text-[10px]", statusConfig[candidate.status].color)}>
                    {statusConfig[candidate.status].label}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{candidate.age}岁/{candidate.gender === "female" ? "女" : "男"}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{candidate.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.hometown}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Study Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />学习信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">培训课程</p>
                  <p className="text-xs font-medium">{candidate.course}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">所在班级</p>
                  <p className="text-xs font-medium">{candidate.className}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">结业日期</p>
                  <p className="text-xs font-medium">{candidate.graduateDate}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">结业成绩</p>
                  <p className="text-xs font-medium text-green-600">{candidate.score}分</p>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />持有证书
              </h4>
              <div className="space-y-1.5">
                {candidate.certificates.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border text-xs">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{cert.certNo}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-primary" />技能标签
              </h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Experience & Salary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Briefcase className="h-3 w-3" />从业经验</p>
                <p className="text-xs font-medium">{candidate.experience}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">期望薪资</p>
                <p className="text-xs font-medium text-primary">{candidate.expectedSalary}元/月</p>
              </div>
            </div>

            <Separator />

            {/* Transfer Form */}
            {candidate.status === "pending" && (
              <div className="space-y-3">
                <h4 className="text-xs font-medium flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-primary" />转化设置
                </h4>
                
                <div className="space-y-1.5">
                  <Label className="text-xs">工作状态</Label>
                  <Select value={jobStatus} onValueChange={setJobStatus}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待上岗</SelectItem>
                      <SelectItem value="available">可接单</SelectItem>
                      <SelectItem value="training">培训中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">简历标签</Label>
                  <div className="flex gap-1.5">
                    <Input placeholder="输入标签后回车添加" className="h-8 text-xs" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                    <Button variant="secondary" size="sm" className="h-8 text-xs" onClick={addTag}><Plus className="h-3 w-3" /></Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] gap-0.5">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">审核备注</Label>
                  <Textarea placeholder="填写审核意见或备注信息" className="text-xs min-h-16 resize-none" />
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">此操作将创建新的家政员ID并关联历史培训记录。转化后学员状态将变更为"已转化"。</p>
                  </div>
                </div>
              </div>
            )}

            {/* Review Result for approved/rejected */}
            {candidate.status !== "pending" && candidate.reviewDate && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium">审核结果</h4>
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={cn("text-[10px]", statusConfig[candidate.status].color)}>
                      {statusConfig[candidate.status].label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{candidate.reviewDate}</span>
                  </div>
                  {candidate.reviewNote && (
                    <p className="text-xs text-muted-foreground">{candidate.reviewNote}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          {candidate.status === "pending" ? (
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <XCircle className="h-3 w-3 mr-1" />驳回
              </Button>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
                <Button size="sm" className="h-7 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />确认转化</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">关闭</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TransferPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")

  const filteredCandidates = useMemo(() => {
    return transferCandidates.filter(c => {
      const matchStatus = activeTab === "all" || c.status === activeTab
      const matchCourse = courseFilter === "all" || c.course === courseFilter
      const matchSearch = !searchTerm || c.name.includes(searchTerm) || c.studentId.includes(searchTerm) || c.course.includes(searchTerm)
      return matchStatus && matchCourse && matchSearch
    })
  }, [activeTab, courseFilter, searchTerm])

  const stats = useMemo(() => ({
    total: transferCandidates.length,
    pending: transferCandidates.filter(c => c.status === "pending").length,
    approved: transferCandidates.filter(c => c.status === "approved").length,
    rejected: transferCandidates.filter(c => c.status === "rejected").length,
  }), [])

  const courses = useMemo(() => {
    return Array.from(new Set(transferCandidates.map(c => c.course)))
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">学员转化</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" />{stats.total}人申请</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />{stats.pending}待审核</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />{stats.approved}已转化</span>
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" />{stats.rejected}已驳回</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="pending" className="text-xs h-6">待审核 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs h-6">已转化 ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs h-6">已驳回 ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索学员..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部课程</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">学员</TableHead>
                    <TableHead className="text-xs">培训课程/班级</TableHead>
                    <TableHead className="text-xs">结业成绩</TableHead>
                    <TableHead className="text-xs">持有证书</TableHead>
                    <TableHead className="text-xs">从业经验</TableHead>
                    <TableHead className="text-xs">期望薪资</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">申请日期</TableHead>
                    <TableHead className="text-xs w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">{candidate.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{candidate.name}</p>
                            <p className="text-[10px] text-muted-foreground">{candidate.age}岁 · {candidate.hometown}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">{candidate.course}</p>
                        <p className="text-[10px] text-muted-foreground">{candidate.className}</p>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-medium", candidate.score >= 90 ? "text-green-600" : candidate.score >= 80 ? "text-blue-600" : "text-muted-foreground")}>
                          {candidate.score}分
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-amber-500" />
                          <span className="text-xs">{candidate.certificates.length}项</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{candidate.experience}</TableCell>
                      <TableCell className="text-xs text-primary">{candidate.expectedSalary}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[candidate.status].color)}>
                          {statusConfig[candidate.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{candidate.submitDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TransferReviewDialog candidate={candidate} />
                          {candidate.status === "pending" && (
                            <TransferReviewDialog candidate={candidate} trigger={
                              <Button size="sm" className="h-6 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />审核</Button>
                            } />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            
            <div className="text-xs text-muted-foreground text-center mt-2">
              显示 {filteredCandidates.length} / {transferCandidates.length} 条记录
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
