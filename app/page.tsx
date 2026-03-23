"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  Calendar,
  Bell,
  GraduationCap,
  Home,
  X,
  ChevronRight,
  Plus,
  FileSignature,
  Heart,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null) // 订单/合同的子类型
  const [formStep, setFormStep] = useState(1)

  // 核心统计数据
  const coreStats = [
    {
      title: "新线索",
      value: "28",
      change: "+12%",
      trend: "up" as const,
      icon: Users,
      iconClassName: "stat-icon-blue",
      href: "/dashboard/new-leads",
    },
    {
      title: "待签合同",
      value: "8",
      change: "-2",
      trend: "down" as const,
      icon: FileText,
      iconClassName: "stat-icon-orange",
      href: "/dashboard/pending-contracts",
    },
    {
      title: "进行中服务",
      value: "45",
      change: "+8%",
      trend: "up" as const,
      icon: Heart,
      iconClassName: "stat-icon-rose",
      href: "/family-service/orders",
    },
    {
      title: "保险即将到期",
      value: "3",
      change: "+1",
      trend: "up" as const,
      icon: AlertTriangle,
      iconClassName: "stat-icon-red",
      href: "/dashboard/expiring-insurance",
    },
  ]

  // 待处理提醒数据
  const pendingAlerts = [
    {
      id: "gap",
      title: "空档期",
      count: 5,
      desc: "5位家政员待安排工作",
      href: "/dashboard/gap-staff",
      icon: Calendar,
      color: "amber",
    },
    {
      id: "service",
      title: "上户提醒",
      count: 3,
      desc: "1人明天上户",
      href: "/dashboard/upcoming-service",
      icon: Home,
      color: "orange",
    },
    {
      id: "training",
      title: "培训提醒",
      count: 4,
      desc: "2门课程开课、2场考试",
      href: "/dashboard/training-reminder",
      icon: GraduationCap,
      color: "cyan",
    },
    {
      id: "hours",
      title: "课时不足",
      count: 3,
      desc: "3名学员需续费",
      href: "/dashboard/low-hours",
      icon: Clock,
      color: "rose",
    },
  ]

  const totalAlerts = pendingAlerts.reduce((sum, a) => sum + a.count, 0)

  // 订单子类型
  const orderSubTypes = [
    { id: 'training', label: '培训订单', icon: GraduationCap },
    { id: 'service', label: '服务订单', icon: Home },
  ]
  
  // 合同子类型
  const contractSubTypes = [
    { id: 'maternal', label: '母婴合同', icon: Heart },
    { id: 'wellness', label: '产康合同', icon: Heart },
    { id: 'employment', label: '用工合同', icon: Users },
  ]

  // 表单步骤配置
  const getFormSteps = (type: string, subType?: string | null) => {
    switch (type) {
      case "customer":
        return ["客户信息", "需求信息", "完成"]
      case "lead":
        return ["线索信息", "跟进计划", "完成"]
      case "order":
        if (subType === 'service') {
          return ["客户信息", "服务选择", "付款信息", "协议签约"]
        }
        return ["学员信息", "课程选择", "付款信息", "协议签约"]
      case "contract":
        return ["合同信息", "条款配置", "签署确认"]
      default:
        return []
    }
  }

  const handleTabChange = (value: string) => {
    if (activeTab === value) {
      setActiveTab(null)
      setActiveSubTab(null)
    } else {
      setActiveTab(value)
      setActiveSubTab(null)
      setFormStep(1)
    }
  }

  const handleSubTabChange = (subType: string) => {
    setActiveSubTab(subType)
    setFormStep(1)
  }

  const closeForm = () => {
    setActiveTab(null)
    setActiveSubTab(null)
    setFormStep(1)
  }

  const renderStepIndicator = (steps: string[]) => (
    <div className="flex items-center gap-1 py-3 border-b bg-muted/20 px-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors",
              formStep === i + 1
                ? "bg-primary text-primary-foreground"
                : formStep > i + 1
                ? "bg-emerald-100 text-emerald-700"
                : "bg-muted text-muted-foreground"
            )}
          >
            {formStep > i + 1 ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <span className="w-4 text-center font-medium">{i + 1}</span>
            )}
            <span>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className={cn("h-4 w-4 mx-1", formStep > i + 1 ? "text-emerald-500" : "text-muted-foreground")} />
          )}
        </div>
      ))}
    </div>
  )

  // 渲染新建客户表单
  const renderCustomerForm = () => (
    <div className="p-4 space-y-4">
      {formStep === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">客户姓名 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入客户姓名" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">联系电话 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系电话" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">客户来源</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择来源渠道" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">线上咨询</SelectItem>
                <SelectItem value="referral">老客户推荐</SelectItem>
                <SelectItem value="douyin">抖音推广</SelectItem>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">负责顾问 <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择顾问" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zhang">张顾问</SelectItem>
                <SelectItem value="li">李顾问</SelectItem>
                <SelectItem value="wang">王顾问</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">家庭住址</Label>
            <Input placeholder="请输入家庭住址" className="h-9" />
          </div>
        </div>
      )}
      {formStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">服务需求</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择服务类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yuesao">月嫂服务</SelectItem>
                <SelectItem value="yuyingshi">育婴师服务</SelectItem>
                <SelectItem value="chankang">产康服务</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">预产期/预计上户时间</Label>
            <Input type="date" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">特殊要求</Label>
            <Textarea placeholder="请输入客户的特殊需求..." rows={3} />
          </div>
        </div>
      )}
      {formStep === 3 && (
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="font-medium">客户信息已保存</p>
          <p className="text-sm text-muted-foreground mt-1">可在客户管理中查看详情</p>
        </div>
      )}
    </div>
  )

  // 渲染新建线索表单
  const renderLeadForm = () => (
    <div className="p-4 space-y-4">
      {formStep === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">线索姓名 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入姓名" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">联系电话 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入电话" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">线索来源 <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择来源" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meituan">美团推广</SelectItem>
                <SelectItem value="douyin">抖音广告</SelectItem>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="referral">客户转介绍</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">意向服务</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择服务类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yuesao">月嫂</SelectItem>
                <SelectItem value="yuyingshi">育婴师</SelectItem>
                <SelectItem value="training">培训报名</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">备注</Label>
            <Textarea placeholder="线索备注信息..." rows={2} />
          </div>
        </div>
      )}
      {formStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">跟进方式</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择跟进方式" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">电话跟进</SelectItem>
                <SelectItem value="wechat">微信沟通</SelectItem>
                <SelectItem value="visit">上门拜访</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">下次跟进时间</Label>
            <Input type="datetime-local" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">分配给</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择跟进人" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zhang">张顾问</SelectItem>
                <SelectItem value="li">李顾问</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {formStep === 3 && (
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="font-medium">线索已录入</p>
          <p className="text-sm text-muted-foreground mt-1">可在线索池中查看</p>
        </div>
      )}
    </div>
  )

  // 渲染新建培训订单表单
  const renderOrderForm = () => (
    <div className="p-4 space-y-4">
      {formStep === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">学员姓名 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入学员姓名" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">联系电话 <span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系电话" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">身份证号 <span className="text-destructive">*</span></Label>
            <Input placeholder="用于办理证书" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">学员来源</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择来源渠道" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">线上报名</SelectItem>
                <SelectItem value="referral">老学员介绍</SelectItem>
                <SelectItem value="gov">政府补贴</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">家庭住址</Label>
            <Input placeholder="请输入家庭住址" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">招生顾问 <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择招生顾问" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zhang">张顾问</SelectItem>
                <SelectItem value="li">李顾问</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {formStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">已选课程</Label>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />添加课程
            </Button>
          </div>
          <div className="border rounded-lg divide-y">
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">高级月嫂培训</p>
                <p className="text-xs text-muted-foreground">月嫂培训</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">¥3,800</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">删除</Button>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">育婴师中级</p>
                <p className="text-xs text-muted-foreground">育婴培训</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">¥2,500</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">删除</Button>
              </div>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex justify-between">
              <span>课程总数</span>
              <span className="font-medium">2 门</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>原价合计</span>
              <span className="font-medium">¥6,300</span>
            </div>
          </div>
        </div>
      )}
      {formStep === 3 && (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex justify-between text-sm">
              <span>原价合计</span>
              <span>¥6,300</span>
            </div>
            <div className="flex justify-between text-sm text-amber-700 mt-1">
              <span>连报优惠</span>
              <span>-¥300</span>
            </div>
            <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t border-emerald-200">
              <span>应付金额</span>
              <span className="text-lg">¥6,000</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">支付方式</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择支付方式" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full">全款支付</SelectItem>
                <SelectItem value="deposit">定金+尾款</SelectItem>
                <SelectItem value="installment">分期付款</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {formStep === 4 && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">培训服务协议</p>
                <p className="text-xs text-muted-foreground">包含培训内容、费用、权利义务等</p>
              </div>
              <Select defaultValue="unsigned">
                <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsigned">待签署</SelectItem>
                  <SelectItem value="signed">已签署</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">学员须知确认书</p>
                <p className="text-xs text-muted-foreground">课程安排、考勤要求等</p>
              </div>
              <Select defaultValue="unsigned">
                <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsigned">待确认</SelectItem>
                  <SelectItem value="signed">已确认</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">合同编号</Label>
            <Input placeholder="系统自动生成或手动输入" className="h-9" />
          </div>
        </div>
      )}
    </div>
  )

  // 渲染新建合同表单
  const renderContractForm = () => (
    <div className="p-4 space-y-4">
      {formStep === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">合同类型 <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择合同类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="service">服务合同</SelectItem>
                <SelectItem value="training">培训合同</SelectItem>
                <SelectItem value="employment">用工合同</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">关联订单</Label>
            <Select>
              <SelectTrigger className="h-9"><SelectValue placeholder="选择关联订单" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="order1">DD202501001</SelectItem>
                <SelectItem value="order2">DD202501002</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">甲方（客户）<span className="text-destructive">*</span></Label>
            <Input placeholder="客户姓名" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">乙方（服务人员）</Label>
            <Input placeholder="服务人员姓名" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">合同金额</Label>
            <Input type="number" placeholder="0.00" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">合同期限</Label>
            <Input type="date" className="h-9" />
          </div>
        </div>
      )}
      {formStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">服务条款</Label>
            <Textarea placeholder="请输入服务条款..." rows={4} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">付款条款</Label>
            <Textarea placeholder="请输入付款条款..." rows={3} />
          </div>
        </div>
      )}
      {formStep === 3 && (
        <div className="text-center py-8">
          <FileSignature className="h-12 w-12 text-primary mx-auto mb-3" />
          <p className="font-medium">合同已创建</p>
          <p className="text-sm text-muted-foreground mt-1">等待各方签署确认</p>
        </div>
      )}
    </div>
  )

  const renderFormContent = () => {
    switch (activeTab) {
      case "customer":
        return renderCustomerForm()
      case "lead":
        return renderLeadForm()
      case "order":
        return renderOrderForm()
      case "contract":
        return renderContractForm()
      default:
        return null
    }
  }

  const getMaxSteps = () => {
    switch (activeTab) {
      case "customer":
      case "lead":
      case "contract":
        return 3
      case "order":
        return 4
      default:
        return 1
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader
          title="工作台"
          description="欢迎回来，今天是2025年1月23日，周四"
        />

        {/* 区域1：数据统计面板 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {coreStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              iconClassName={stat.iconClassName}
              href={stat.href}
            />
          ))}
        </div>

        {/* 区域2：待办事项提醒 */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-600" />
              待处理提醒
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 text-[10px]">
                {totalAlerts} 项
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pendingAlerts.map((alert) => {
                const Icon = alert.icon
                const colorClasses = {
                  amber: "text-amber-600 bg-amber-500 border-amber-300 hover:border-amber-400",
                  orange: "text-orange-600 bg-orange-500 border-orange-300 hover:border-orange-400",
                  cyan: "text-cyan-600 bg-cyan-500 border-cyan-300 hover:border-cyan-400",
                  rose: "text-rose-600 bg-rose-500 border-rose-300 hover:border-rose-400",
                }
                return (
                  <Link key={alert.id} href={alert.href} className="group">
                    <div className={cn(
                      "p-3 rounded-lg border bg-white hover:shadow-sm transition-all",
                      colorClasses[alert.color as keyof typeof colorClasses]?.split(" ").slice(2).join(" ")
                    )}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Icon className={cn("h-3.5 w-3.5", colorClasses[alert.color as keyof typeof colorClasses]?.split(" ")[0])} />
                          <span className="text-xs font-medium">{alert.title}</span>
                        </div>
                        <Badge className={cn(
                          "h-5 min-w-[20px] justify-center text-white text-[10px]",
                          colorClasses[alert.color as keyof typeof colorClasses]?.split(" ")[1]
                        )}>
                          {alert.count}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{alert.desc}</p>
                      <p className={cn(
                        "text-[10px] mt-1 group-hover:underline",
                        colorClasses[alert.color as keyof typeof colorClasses]?.split(" ")[0]
                      )}>
                        查看详情 →
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 区域3：快捷操作区域 */}
        <Card>
          {/* 标签按钮组 */}
          <div className="flex items-center gap-2 p-3 border-b">
            <Button
              variant={activeTab === "customer" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => handleTabChange("customer")}
            >
              <UserPlus className="h-3.5 w-3.5" />
              新建客户
            </Button>
            <Button
              variant={activeTab === "lead" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => handleTabChange("lead")}
            >
              <Users className="h-3.5 w-3.5" />
              新建线索
            </Button>
            <Button
              variant={activeTab === "order" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => handleTabChange("order")}
            >
              <FileText className="h-3.5 w-3.5" />
              新建订单
            </Button>
            <Button
              variant={activeTab === "contract" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => handleTabChange("contract")}
            >
              <FileSignature className="h-3.5 w-3.5" />
              新建合同
            </Button>
          </div>

          {/* 表单内容区域 */}
          {activeTab && (
            <div className="border-t">
              {/* 子类型选择（仅订单和合同） */}
              {(activeTab === "order" || activeTab === "contract") && !activeSubTab && (
                <div className="p-4">
                  <p className="text-sm font-medium mb-3">请选择{activeTab === "order" ? "订单" : "合同"}类型:</p>
                  <div className="flex flex-wrap gap-2">
                    {(activeTab === "order" ? orderSubTypes : contractSubTypes).map(subType => (
                      <Button
                        key={subType.id}
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs gap-2"
                        onClick={() => handleSubTabChange(subType.id)}
                      >
                        <subType.icon className="h-4 w-4" />
                        {subType.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 表单标题（非订单/合同 或 已选择子类型时显示） */}
              {((activeTab !== "order" && activeTab !== "contract") || activeSubTab) && (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      {activeTab === "customer" && <UserPlus className="h-4 w-4 text-primary" />}
                      {activeTab === "lead" && <Users className="h-4 w-4 text-primary" />}
                      {activeTab === "order" && <FileText className="h-4 w-4 text-primary" />}
                      {activeTab === "contract" && <FileSignature className="h-4 w-4 text-primary" />}
                      <div>
                        <h3 className="font-medium text-sm">
                          {activeTab === "customer" && "新建客户"}
                          {activeTab === "lead" && "新建线索"}
                          {activeTab === "order" && activeSubTab === "training" && "新建培训订单"}
                          {activeTab === "order" && activeSubTab === "service" && "新建服务订单"}
                          {activeTab === "contract" && activeSubTab === "maternal" && "新建母婴合同"}
                          {activeTab === "contract" && activeSubTab === "wellness" && "新建产康合同"}
                          {activeTab === "contract" && activeSubTab === "employment" && "新建用工合同"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {activeTab === "order" && activeSubTab === "training"
                            ? "请按步骤填写学员报名信息，确保信息完整准确"
                            : activeTab === "order" && activeSubTab === "service"
                            ? "请按步骤填写客户服务信息，确保信息完整准确"
                            : "请填写相关信息"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 子类型标签（已选择时显示切换） */}
                  {(activeTab === "order" || activeTab === "contract") && activeSubTab && (
                    <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/10">
                      {(activeTab === "order" ? orderSubTypes : contractSubTypes).map(subType => (
                        <Button
                          key={subType.id}
                          variant={activeSubTab === subType.id ? "secondary" : "ghost"}
                          size="sm"
                          className={cn("h-7 text-xs gap-1.5", activeSubTab === subType.id && "bg-primary/10")}
                          onClick={() => handleSubTabChange(subType.id)}
                        >
                          <subType.icon className="h-3 w-3" />
                          {subType.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* 步骤指示器 */}
                  {renderStepIndicator(getFormSteps(activeTab, activeSubTab))}

                  {/* 表单内容 */}
                  {renderFormContent()}

                  {/* 表单底部按钮 */}
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => formStep > 1 && setFormStep(formStep - 1)}
                      disabled={formStep === 1}
                    >
                      上一步
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        保存草稿
                      </Button>
                      {formStep < getMaxSteps() ? (
                        <Button size="sm" onClick={() => setFormStep(formStep + 1)}>
                          下一步
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={closeForm}>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          提交
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 未选择标签时的提示 */}
          {!activeTab && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">点击上方按钮快速创建客户、线索、订单或合同</p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
