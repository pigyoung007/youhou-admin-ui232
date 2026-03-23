"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, TrendingUp, TrendingDown, Award, Target, Users, 
  Calendar, Clock, CheckCircle, AlertCircle, FileText, Download,
  Calculator, ChevronRight, Briefcase, GraduationCap, Baby, Home,
  MessageSquare, Video, ThumbsUp, BookOpen, Star, Info
} from "lucide-react"

// ========== 类型定义 ==========
interface SalaryDetailItem {
  id: string
  category: string
  name: string
  formula?: string
  baseValue?: number
  quantity?: number
  rate?: number
  amount: number
  type: "income" | "deduction" | "bonus" | "penalty"
  remark?: string
}

interface AssessmentItem {
  id: string
  name: string
  icon: typeof Target
  target: number
  actual: number
  unit: string
  status: "exceed" | "pass" | "fail"
  bonus: number
}

interface SalaryRecord {
  id: string
  employeeId: string
  name: string
  avatar?: string
  role: string
  roleType: "consultant" | "maternal_consultant" | "domestic_worker" | "trainer" | "customer_service"
  department: string
  month: string
  baseSalary: number
  totalIncome: number
  totalDeduction: number
  finalSalary: number
  status: "pending" | "approved" | "paid"
  details: SalaryDetailItem[]
  assessments: AssessmentItem[]
  serviceRecords?: ServiceRecord[]
}

interface ServiceRecord {
  id: string
  clientName: string
  serviceType: string
  startDate: string
  endDate: string
  days: number
  amount: number
  commission: number
}

// ========== 示例数据 ==========
const mockSalaryRecord: SalaryRecord = {
  id: "SR001",
  employeeId: "E001",
  name: "陈秀英",
  role: "职业顾问",
  roleType: "consultant",
  department: "销售部",
  month: "2025-01",
  baseSalary: 5000,
  totalIncome: 12850,
  totalDeduction: 650,
  finalSalary: 12200,
  status: "pending",
  details: [
    { id: "d1", category: "基础薪资", name: "底薪", amount: 5000, type: "income" },
    { id: "d2", category: "业绩提成", name: "学员报名提成", formula: "报名金额 × 8%", baseValue: 62500, rate: 0.08, amount: 5000, type: "income", remark: "本月报名5人，总金额¥62,500" },
    { id: "d3", category: "业绩奖励", name: "学员新增考核奖励", formula: "达标3人+超额2人", quantity: 5, amount: 600, type: "bonus", remark: "达标奖励¥300 + 超额2人×¥150" },
    { id: "d4", category: "业绩奖励", name: "面试额外奖励", formula: "面试次数 × ¥100", quantity: 4, amount: 400, type: "bonus", remark: "本月安排4次面试" },
    { id: "d5", category: "业绩奖励", name: "学员连报奖励", formula: "连报人数 × ¥200", quantity: 2, amount: 400, type: "bonus", remark: "2位学员连报2科以上" },
    { id: "d6", category: "业绩奖励", name: "技能类科目新增奖励", formula: "技能类新增 × ¥150", quantity: 3, amount: 450, type: "bonus", remark: "技能类科目新增3人" },
    { id: "d7", category: "考核奖励", name: "工作量达标奖励", amount: 600, type: "bonus", remark: "工作时长超额20小时" },
    { id: "d8", category: "考核奖励", name: "好评奖励", formula: "好评数 × ¥50", quantity: 8, amount: 400, type: "bonus", remark: "获得8条客户好评" },
    { id: "d9", category: "考核扣款", name: "朋友圈未达标", formula: "缺失数 × ¥5", quantity: 6, amount: -30, type: "penalty", remark: "本月少发6条朋友圈" },
    { id: "d10", category: "社保扣款", name: "社保个人部分", amount: -420, type: "deduction" },
    { id: "d11", category: "社保扣款", name: "公积金个人部分", amount: -200, type: "deduction" },
  ],
  assessments: [
    { id: "a1", name: "单日工作量", icon: Clock, target: 160, actual: 180, unit: "小时", status: "exceed", bonus: 600 },
    { id: "a2", name: "朋友圈发布", icon: MessageSquare, target: 40, actual: 34, unit: "条", status: "fail", bonus: -30 },
    { id: "a3", name: "视频号转发", icon: Video, target: 60, actual: 65, unit: "条", status: "exceed", bonus: 40 },
    { id: "a4", name: "客户好评", icon: ThumbsUp, target: 5, actual: 8, unit: "条", status: "exceed", bonus: 400 },
    { id: "a5", name: "小红书内容", icon: BookOpen, target: 20, actual: 22, unit: "篇", status: "exceed", bonus: 40 },
  ],
  serviceRecords: [
    { id: "s1", clientName: "张女士", serviceType: "母婴护理师培训", startDate: "2025-01-05", endDate: "2025-01-20", days: 15, amount: 12800, commission: 1024 },
    { id: "s2", clientName: "李先生", serviceType: "育婴师培训", startDate: "2025-01-08", endDate: "2025-01-25", days: 17, amount: 9800, commission: 686 },
    { id: "s3", clientName: "王女士", serviceType: "产后康复师培训", startDate: "2025-01-10", endDate: "2025-02-05", days: 26, amount: 15800, commission: 1580 },
    { id: "s4", clientName: "赵女士", serviceType: "母婴护理师+育婴师", startDate: "2025-01-12", endDate: "2025-02-10", days: 29, amount: 18500, commission: 1480 },
    { id: "s5", clientName: "刘女士", serviceType: "小儿推拿师培训", startDate: "2025-01-15", endDate: "2025-01-30", days: 15, amount: 5600, commission: 504 },
  ]
}

// ========== 主组件 ==========
interface SalaryDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: SalaryRecord
}

export function SalaryDetailDialog({ open, onOpenChange, record = mockSalaryRecord }: SalaryDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // 计算各类金额汇总
  const incomeItems = record.details.filter(d => d.type === "income")
  const bonusItems = record.details.filter(d => d.type === "bonus")
  const penaltyItems = record.details.filter(d => d.type === "penalty")
  const deductionItems = record.details.filter(d => d.type === "deduction")

  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0)
  const totalBonus = bonusItems.reduce((sum, item) => sum + item.amount, 0)
  const totalPenalty = Math.abs(penaltyItems.reduce((sum, item) => sum + item.amount, 0))
  const totalDeduction = Math.abs(deductionItems.reduce((sum, item) => sum + item.amount, 0))

  const roleIcons = {
    consultant: GraduationCap,
    maternal_consultant: Baby,
    domestic_worker: Home,
    trainer: BookOpen,
    customer_service: MessageSquare,
  }

  const RoleIcon = roleIcons[record.roleType]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <RoleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">{record.name} - {record.month} 薪资明细</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <span>{record.role}</span>
                  <span className="text-muted-foreground">|</span>
                  <span>{record.department}</span>
                  <Badge variant="outline" className={
                    record.status === "paid" ? "bg-success/15 text-success border-success/30" :
                    record.status === "approved" ? "bg-info/15 text-info border-info/30" :
                    "bg-warning/15 text-warning-foreground border-warning/30"
                  }>
                    {record.status === "paid" ? "已发放" : record.status === "approved" ? "已审核" : "待审核"}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">实发工资</div>
              <div className="text-2xl font-bold text-primary">¥{record.finalSalary.toLocaleString()}</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b px-6">
            <TabsList className="bg-transparent h-12 p-0 gap-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3">
                薪资总览
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3">
                计算明细
              </TabsTrigger>
              <TabsTrigger value="assessment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3">
                考核记录
              </TabsTrigger>
              <TabsTrigger value="service" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3">
                业绩明细
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[55vh]">
            {/* 薪资总览 */}
            <TabsContent value="overview" className="p-6 mt-0">
              <div className="space-y-6">
                {/* 汇总卡片 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs font-medium">基础收入</span>
                      </div>
                      <div className="text-xl font-bold text-blue-700">¥{totalIncome.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-emerald-50/50 border-emerald-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Award className="h-4 w-4" />
                        <span className="text-xs font-medium">奖励收入</span>
                      </div>
                      <div className="text-xl font-bold text-emerald-700">+¥{totalBonus.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50/50 border-amber-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">考核扣款</span>
                      </div>
                      <div className="text-xl font-bold text-amber-700">-¥{totalPenalty.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-rose-50/50 border-rose-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-xs font-medium">社保扣款</span>
                      </div>
                      <div className="text-xl font-bold text-rose-700">-¥{totalDeduction.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* 薪资构成图示 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">薪资构成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-20">底薪</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(record.baseSalary / record.finalSalary) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24 text-right">¥{record.baseSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-20">提成</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${((totalIncome - record.baseSalary) / record.finalSalary) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24 text-right">¥{(totalIncome - record.baseSalary).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-20">奖励</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(totalBonus / record.finalSalary) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24 text-right">¥{totalBonus.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-20">扣款</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${((totalPenalty + totalDeduction) / record.finalSalary) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24 text-right text-destructive">-¥{(totalPenalty + totalDeduction).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 快速摘要 */}
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        本月亮点
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        <span>学员新增5人，超额完成考核</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        <span>工作时长超额20小时</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        <span>获得8条客户好评</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-warning-foreground" />
                        待改进项
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-warning-foreground shrink-0" />
                        <span>朋友圈发布未达标，少发6条</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 计算明细 */}
            <TabsContent value="details" className="p-6 mt-0">
              <div className="space-y-6">
                {/* 基础薪资 */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    基础薪资
                  </h3>
                  <div className="space-y-2">
                    {incomeItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          {item.formula && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              计算公式: {item.formula}
                            </div>
                          )}
                          {item.remark && (
                            <div className="text-xs text-muted-foreground mt-0.5">{item.remark}</div>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="font-semibold text-primary">¥{item.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 奖励收入 */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" />
                    奖励收入
                  </h3>
                  <div className="space-y-2">
                    {bonusItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/10">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          {item.formula && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              计算公式: {item.formula}
                            </div>
                          )}
                          {item.remark && (
                            <div className="text-xs text-muted-foreground mt-0.5">{item.remark}</div>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="font-semibold text-success">+¥{item.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 考核扣款 */}
                {penaltyItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-warning-foreground" />
                      考核扣款
                    </h3>
                    <div className="space-y-2">
                      {penaltyItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{item.name}</div>
                            {item.formula && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                计算公式: {item.formula}
                              </div>
                            )}
                            {item.remark && (
                              <div className="text-xs text-muted-foreground mt-0.5">{item.remark}</div>
                            )}
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <span className="font-semibold text-warning-foreground">¥{item.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 社保扣款 */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    社保扣款
                  </h3>
                  <div className="space-y-2">
                    {deductionItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="font-semibold text-destructive">¥{item.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 汇总 */}
                <Separator />
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="font-medium">实发工资合计</span>
                  <span className="text-2xl font-bold text-primary">¥{record.finalSalary.toLocaleString()}</span>
                </div>
              </div>
            </TabsContent>

            {/* 考核记录 */}
            <TabsContent value="assessment" className="p-6 mt-0">
              <div className="space-y-4">
                {record.assessments.map((item) => {
                  const Icon = item.icon
                  const progress = (item.actual / item.target) * 100
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-lg shrink-0 ${
                            item.status === "exceed" ? "bg-success/10" :
                            item.status === "pass" ? "bg-primary/10" : "bg-destructive/10"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              item.status === "exceed" ? "text-success" :
                              item.status === "pass" ? "text-primary" : "text-destructive"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{item.name}</span>
                              <Badge variant="outline" className={
                                item.status === "exceed" ? "bg-success/15 text-success border-success/30" :
                                item.status === "pass" ? "bg-primary/15 text-primary border-primary/30" :
                                "bg-destructive/15 text-destructive border-destructive/30"
                              }>
                                {item.status === "exceed" ? "超额达标" : item.status === "pass" ? "达标" : "未完成"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Progress 
                                value={Math.min(progress, 100)} 
                                className={`h-2 flex-1 ${
                                  item.status === "exceed" ? "[&>div]:bg-success" :
                                  item.status === "pass" ? "[&>div]:bg-primary" : "[&>div]:bg-destructive"
                                }`}
                              />
                              <span className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                                {item.actual} / {item.target} {item.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">完成率: {progress.toFixed(0)}%</span>
                              <span className={`font-medium ${item.bonus >= 0 ? "text-success" : "text-destructive"}`}>
                                {item.bonus >= 0 ? "+" : ""}¥{item.bonus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* 考核汇总 */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">考核奖惩合计</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          达标项: {record.assessments.filter(a => a.status !== "fail").length} | 
                          未完成: {record.assessments.filter(a => a.status === "fail").length}
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${
                        record.assessments.reduce((sum, a) => sum + a.bonus, 0) >= 0 ? "text-success" : "text-destructive"
                      }`}>
                        {record.assessments.reduce((sum, a) => sum + a.bonus, 0) >= 0 ? "+" : ""}
                        ¥{record.assessments.reduce((sum, a) => sum + a.bonus, 0).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 业绩明细 */}
            <TabsContent value="service" className="p-6 mt-0">
              <div className="space-y-4">
                {record.serviceRecords?.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{service.clientName}</span>
                            <Badge variant="outline" className="text-xs">{service.serviceType}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            服务周期: {service.startDate} ~ {service.endDate} ({service.days}天)
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-sm text-muted-foreground">成交金额</div>
                          <div className="font-semibold">¥{service.amount.toLocaleString()}</div>
                          <div className="text-xs text-success mt-1">提成: +¥{service.commission.toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* 业绩汇总 */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">成交客户</div>
                        <div className="text-lg font-bold">{record.serviceRecords?.length || 0} 位</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">成交总额</div>
                        <div className="text-lg font-bold">
                          ¥{(record.serviceRecords?.reduce((sum, s) => sum + s.amount, 0) || 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">提成合计</div>
                        <div className="text-lg font-bold text-success">
                          +¥{(record.serviceRecords?.reduce((sum, s) => sum + s.commission, 0) || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            打印工资条
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出明细
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
