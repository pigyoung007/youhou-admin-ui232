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
  Phone, MessageSquare, Star, Plus, Edit, Calendar, Clock,
  FileText, X, ExternalLink, Award, Shield, Wallet, Briefcase,
  MapPin, User, Camera, Video, ChevronDown, ChevronRight, Eye,
  CheckCircle, AlertCircle, History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FullScheduleTimeline, type ScheduleBlock } from "@/components/family-service/schedule-timeline"
import { NannyResumeView, type NannyResume } from "@/components/family-service/nanny-resume-view"

// 家政员详情数据接口
export interface NannyDetail {
  id: string
  name: string
  avatar?: string
  phone: string
  gender?: "male" | "female"
  age?: number
  status: "available" | "working" | "training" | "vacation" | "resigned"
  level: string // 星级/等级
  type: "月嫂" | "育婴师" | "产康技师" | "保姆"
  consultant: string
  consultantId?: string
  // 基本信息
  idCard?: string
  idCardFront?: string
  idCardBack?: string
  birthDate?: string
  zodiac?: string // 星座
  nativePlace?: string // 籍贯
  currentAddress?: string
  education?: string
  maritalStatus?: string
  healthStatus?: string
  registrationDate?: string
  // 简历信息
  workPhotos?: string[]
  videoIntro?: string
  skills?: { name: string; level: string; certified: boolean }[]
  certificates?: { id: string; name: string; issueDate: string; validUntil?: string; image?: string }[]
  workExperience?: { id: string; employer: string; period: string; content: string; evaluation?: string }[]
  customerReviews?: { id: string; customerName: string; rating: number; content: string; date: string; orderType: string }[]
  workYears?: number
  // 简历额外字段
  foodPhotos?: string[] // 辅食照片
  levelCertificate?: string // 星级证书图片
  selfIntro?: string // 自我介绍
  // 档期信息
  schedules?: { id: string; customerName: string; startDate: string; endDate: string; status: string; address: string }[]
  // 等级信息
  levelHistory?: { date: string; oldLevel: string; newLevel: string; reason: string }[]
  servicePrice?: number
  commissionRate?: number
  // 征信信息
  creditScore?: number
  creditRecords?: { id: string; type: string; content: string; date: string; status: string }[]
  idVerified?: boolean
  backgroundCheck?: boolean
  // 保证金信息
  depositAmount?: number
  depositPaid?: boolean
  depositDate?: string
  depositRecords?: { id: string; type: string; amount: number; date: string; remark: string }[]
  // 标签
  tags?: { id: string; name: string; color: string }[]
  // 资料完整度
  profileCompleteness?: number
}

interface NannyDetailPanelProps {
  nanny: NannyDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (nanny: NannyDetail) => void
  onCall?: (nanny: NannyDetail) => void
  onAssignOrder?: (nanny: NannyDetail) => void
  onViewOrders?: (nanny: NannyDetail) => void
  onSchedule?: (nanny: NannyDetail) => void
  onViewContract?: (nanny: NannyDetail) => void
}

// 状态配置
const statusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "空闲", color: "bg-green-100 text-green-800" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-800" },
  training: { label: "培训中", color: "bg-amber-100 text-amber-800" },
  vacation: { label: "休假", color: "bg-gray-100 text-gray-800" },
  resigned: { label: "已离职", color: "bg-red-100 text-red-800" },
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

export function NannyDetailPanel({
  nanny,
  open,
  onOpenChange,
  onEdit,
  onCall,
  onAssignOrder,
  onViewOrders,
  onSchedule,
  onViewContract,
}: NannyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("resume")
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [idInfoOpen, setIdInfoOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
        {/* 顶部标题栏 */}
        <SheetHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base font-medium">家政员档案</SheetTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/family-service/nanny/${nanny.id}`, '_blank')}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
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
                      onClick={() => onCall?.(nanny)}
                      title="拨打电话"
                    >
                      <Phone className="h-4 w-4 text-white" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 w-9 rounded-full" title="发消息">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 rounded-full" 
                      title="查看排班"
                      onClick={() => onSchedule?.(nanny)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 rounded-full" 
                      title="派单" 
                      onClick={() => onAssignOrder?.(nanny)}
                    >
                      <Briefcase className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 rounded-full" 
                      title="查看订单"
                      onClick={() => onViewOrders?.(nanny)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 头像 */}
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={nanny.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">{nanny.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>

                  {/* 姓名和职位 */}
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-semibold">{nanny.name}</h3>
                    <p className="text-sm text-muted-foreground">{nanny.consultant} 跟进</p>
                  </div>

                  {/* 状态和等级 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn("text-xs", statusConfig[nanny.status]?.color)}>
                      {statusConfig[nanny.status]?.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{nanny.type}</Badge>
                    <Badge className="bg-amber-100 text-amber-800 text-xs">{nanny.level}</Badge>
                  </div>

                  {/* 标签 */}
                  {nanny.tags && nanny.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {nanny.tags.map((tag) => (
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
                  <Progress value={nanny.profileCompleteness || 0} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{nanny.profileCompleteness || 0}%</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(nanny)}>
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
                      <InfoRow label="姓名" value={nanny.name} editable />
                      <InfoRow label="手机号" value={<span className="tabular-nums">{nanny.phone}</span>} editable />
                      <InfoRow label="性别" value={nanny.gender === "female" ? "女" : "男"} />
                      <InfoRow label="年龄" value={nanny.age ? `${nanny.age}岁` : undefined} />
                      <InfoRow label="星座" value={nanny.zodiac} />
                      <InfoRow label="籍贯" value={nanny.nativePlace} editable />
                      <InfoRow label="学历" value={nanny.education} />
                      <InfoRow label="婚姻状况" value={nanny.maritalStatus} />
                      <InfoRow label="健康状况" value={nanny.healthStatus} />
                      <InfoRow label="入职日期" value={nanny.registrationDate} />
                      <InfoRow label="工作年限" value={nanny.workYears ? `${nanny.workYears}年` : undefined} />
                      <InfoRow label="服务价格" value={nanny.servicePrice ? <span className="tabular-nums">¥{nanny.servicePrice.toLocaleString()}/月</span> : undefined} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-3" />

                {/* 身份信息折叠区 */}
                <Collapsible open={idInfoOpen} onOpenChange={setIdInfoOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                    <span className="text-sm font-medium">身份认证</span>
                    {idInfoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-0 mt-2">
                      <InfoRow label="身份证号" value={nanny.idCard ? `${nanny.idCard.slice(0, 6)}****${nanny.idCard.slice(-4)}` : undefined} />
                      <InfoRow label="实名认证" value={
                        nanny.idVerified ? 
                          <Badge className="bg-green-100 text-green-800 text-xs">已认证</Badge> : 
                          <Badge variant="outline" className="text-xs">未认证</Badge>
                      } />
                      <InfoRow label="背景调查" value={
                        nanny.backgroundCheck ? 
                          <Badge className="bg-green-100 text-green-800 text-xs">已通过</Badge> : 
                          <Badge variant="outline" className="text-xs">未调查</Badge>
                      } />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </div>

          {/* 右侧主Tab区域 - 简历/档期/等级/征信/保证金/服务记录 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start h-10 px-4 rounded-none border-b bg-transparent">
              <TabsTrigger value="resume" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                简历
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                档期
              </TabsTrigger>
              <TabsTrigger value="level" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                等级
              </TabsTrigger>
              <TabsTrigger value="credit" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                征信
              </TabsTrigger>
              <TabsTrigger value="deposit" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                保证金
              </TabsTrigger>
              <TabsTrigger value="service" className="text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                服务记录
              </TabsTrigger>
            </TabsList>

            {/* 简历Tab */}
            <TabsContent value="resume" className="flex-1 m-0 p-4 data-[state=inactive]:hidden overflow-auto">
              <ScrollArea className="h-full">
                <NannyResumeView 
                  editable={true}
                  resume={{
                    id: nanny.id,
                    name: nanny.name,
                    selfIntro: nanny.selfIntro || "您好，我从事母婴护理工作已有多年经验，持有高级母婴护理师证书。我性格温和有耐心，擅长新生儿护理、产妇护理和月子餐制作。在过去的工作中，我始终以专业的态度和细心的服务赢得了客户的认可。期待能有机会为您的家庭提供优质的服务！",
                    photos: (nanny.workPhotos || [
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
                    ]).map((url, i) => ({
                      id: `photo-${i}`,
                      type: 'photo' as const,
                      image: url,
                    })),
                    foodPhotos: [
                      { id: 'food-1', type: 'food_photo' as const, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop' },
                      { id: 'food-2', type: 'food_photo' as const, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop' },
                      { id: 'food-3', type: 'food_photo' as const, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' },
                    ],
                    videos: nanny.videoIntro ? [{
                      id: 'video-1',
                      type: 'video' as const,
                      title: '自我介绍',
                      description: '工作经历和服务理念介绍',
                      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=225&fit=crop',
                      videoUrl: nanny.videoIntro,
                      date: '2025-12-15',
                    }] : [
                      {
                        id: 'video-1',
                        type: 'video' as const,
                        title: '自我介绍',
                        description: '工作经历和服务理念介绍',
                        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=225&fit=crop',
                        date: '2025-12-15',
                      },
                      {
                        id: 'video-2',
                        type: 'video' as const,
                        title: '护理技能展示',
                        description: '新生儿护理、抚触等技能演示',
                        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=225&fit=crop',
                        date: '2025-11-20',
                      },
                    ],
                    skills: (nanny.skills || [
                      { name: "母乳喂养指导", level: "精通", certified: true },
                      { name: "新生儿护理", level: "精通", certified: true },
                      { name: "月子餐制作", level: "熟练", certified: true },
                      { name: "产妇护理", level: "精通", certified: true },
                      { name: "婴儿抚触", level: "精通", certified: true },
                      { name: "早期智力开发", level: "熟练", certified: false },
                    ]).map((skill, i) => ({
                      id: `skill-${i}`,
                      type: 'skill' as const,
                      title: skill.name,
                      description: `熟练程度：${skill.level}`,
                      certified: skill.certified,
                    })),
                    certificates: [
                      { id: 'cert-1', type: 'certificate' as const, title: '高级母婴护理师证书', date: '2023-06-15', validUntil: '2026-06-15' },
                      { id: 'cert-2', type: 'certificate' as const, title: '催乳师证书', date: '2022-03-20' },
                      { id: 'cert-3', type: 'certificate' as const, title: '健康证', date: '2025-01-10', validUntil: '2026-01-10' },
                      { id: 'cert-4', type: 'certificate' as const, title: '育婴师（三级）', date: '2021-09-08' },
                    ],
                    reviews: (nanny.customerReviews || [
                      { id: "r1", customerName: "王女士", rating: 5, content: "阿姨非常专业，照顾宝宝很细心，月子餐也做得很好吃！强烈推荐！", date: "2025-02-15" },
                      { id: "r2", customerName: "李女士", rating: 5, content: "双胞胎照顾得很好，晚上基本不用我们操心，非常感谢阿姨的付出！", date: "2024-11-20" },
                      { id: "r3", customerName: "张女士", rating: 5, content: "阿姨经验丰富，教会了我很多育儿知识，是值得信赖的好阿姨。", date: "2024-08-10" },
                    ]).map(review => ({
                      id: review.id,
                      type: 'review' as const,
                      title: review.customerName,
                      description: review.content,
                      rating: review.rating,
                      date: review.date,
                    })),
                    experiences: (nanny.workExperience || [
                      { id: "exp1", employer: "王女士", period: "2024-12 ~ 2025-02", content: "照顾新生儿及产妇，负责月子餐制作，24小时住家服务", evaluation: "非常满意" },
                      { id: "exp2", employer: "李女士", period: "2024-09 ~ 2024-11", content: "照顾双胞胎新生儿，负责两个宝宝的日常护理和喂养", evaluation: "满意" },
                      { id: "exp3", employer: "张女士", period: "2024-05 ~ 2024-08", content: "产后护理及婴儿照顾，指导产妇母乳喂养", evaluation: "非常满意" },
                    ]).map(exp => ({
                      id: exp.id,
                      type: 'experience' as const,
                      title: `${exp.employer}家 (${exp.period})`,
                      description: exp.content,
                      count: 1,
                      date: exp.period,
                    })),
                  }} 
                  onUpdate={(resume) => console.log('更新简历:', resume)}
                  onShare={() => console.log('分享简历')}
                />
              </ScrollArea>
            </TabsContent>

            {/* 档期Tab - 月度视图条 */}
            <TabsContent value="schedule" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* 月度视图条 */}
                  <FullScheduleTimeline
                    schedules={(() => {
                      // 转换schedule数据为ScheduleBlock格式
                      const mockSchedules: ScheduleBlock[] = [
                        { id: "s1", startDate: "2026-01-11", endDate: "2026-02-10", type: "booked", customerName: "王女士" },
                        { id: "s2", startDate: "2026-02-11", endDate: "2026-02-15", type: "training" },
                        { id: "s3", startDate: "2026-03-01", endDate: "2026-04-15", type: "booked", customerName: "张女士" },
                      ]
                      return mockSchedules
                    })()}
                    startMonth={new Date(2026, 0, 1)}
                    monthCount={8}
                    onAddAvailable={() => {}}
                    onViewCalendar={() => {}}
                  />

                  {/* 排班列表 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">排班记录</span>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />新建排班
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>客户</TableHead>
                          <TableHead>服务周期</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>服务地址</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(nanny.schedules || [
                          { id: "1", customerName: "张女士", startDate: "2025-03-20", endDate: "2025-04-20", status: "confirmed", address: "北京市朝阳区望京SOHO" },
                          { id: "2", customerName: "李女士", startDate: "2025-04-25", endDate: "2025-05-25", status: "pending", address: "北京市海淀区中关村" },
                        ]).map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.customerName}</TableCell>
                            <TableCell className="text-sm">{schedule.startDate} ~ {schedule.endDate}</TableCell>
                            <TableCell>
                              <Badge className={cn("text-xs", schedule.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>
                                {schedule.status === "confirmed" ? "已确认" : "待确认"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{schedule.address}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">查看</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 等级Tab */}
            <TabsContent value="level" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">等级信息</span>
                <Button size="sm" variant="outline">申请升级</Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* 当前等级卡片 */}
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">当前等级</p>
                        <p className="text-2xl font-bold text-amber-800">{nanny.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">服务价格</p>
                        <p className="text-xl font-bold tabular-nums">¥{(nanny.servicePrice || 18800).toLocaleString()}/月</p>
                      </div>
                    </div>
                  </div>

                  {/* 等级变更记录 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">等级变更记录</h4>
                    <div className="space-y-2">
                      {(nanny.levelHistory || [
                        { date: "2024-12-01", oldLevel: "四星月嫂", newLevel: "五星月嫂", reason: "客户好评率达标，通过考核" },
                        { date: "2024-06-15", oldLevel: "三星月嫂", newLevel: "四星月嫂", reason: "完成进阶培训" },
                      ]).map((record, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{record.oldLevel}</Badge>
                              <ChevronRight className="h-3 w-3" />
                              <Badge className="bg-amber-100 text-amber-800 text-xs">{record.newLevel}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                            <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 征信Tab */}
            <TabsContent value="credit" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">征信信息</span>
                <Button size="sm" variant="outline">发起背调</Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* 征信评分 */}
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">信用评分</p>
                        <p className="text-3xl font-bold text-green-800 tabular-nums">{nanny.creditScore || 95}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {nanny.idVerified ? (
                            <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle className="h-3 w-3 mr-1" />实名已认证</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />实名未认证</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {nanny.backgroundCheck ? (
                            <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle className="h-3 w-3 mr-1" />背调已通过</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />背调未完成</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 征信记录 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">征信记录</h4>
                    <div className="text-center text-muted-foreground text-sm py-8">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                      暂无不良记录
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 保证金Tab */}
            <TabsContent value="deposit" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">保证金管理</span>
                <Button size="sm">收取保证金</Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* 保证金状态 */}
                  <div className={cn("p-4 rounded-lg border", nanny.depositPaid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">保证金状态</p>
                        <p className={cn("text-xl font-bold", nanny.depositPaid ? "text-green-800" : "text-red-800")}>
                          {nanny.depositPaid ? "已缴纳" : "未缴纳"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">保证金金额</p>
                        <p className="text-2xl font-bold tabular-nums">¥{(nanny.depositAmount || 1000).toLocaleString()}</p>
                      </div>
                    </div>
                    {!nanny.depositPaid && (
                      <div className="mt-3 p-2 rounded bg-red-100 text-red-800 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        保证金未缴纳，不可安排上户服务
                      </div>
                    )}
                  </div>

                  {/* 保证金记录 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">保证金流水</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>类型</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>日期</TableHead>
                          <TableHead>备注</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(nanny.depositRecords || [
                          { id: "1", type: "缴纳", amount: 1000, date: "2024-06-01", remark: "入职缴纳保证金" },
                        ]).map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <Badge variant={record.type === "缴纳" ? "default" : "destructive"} className="text-xs">{record.type}</Badge>
                            </TableCell>
                            <TableCell className={cn("tabular-nums font-medium", record.type === "缴纳" ? "text-green-600" : "text-red-600")}>
                              {record.type === "缴纳" ? "+" : "-"}¥{record.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">{record.date}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{record.remark}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 服务记录Tab */}
            <TabsContent value="service" className="flex-1 m-0 p-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">历史服务记录</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>客户</TableHead>
                        <TableHead>服务类型</TableHead>
                        <TableHead>服务周期</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>评价</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="tabular-nums">DD2025021500001</TableCell>
                        <TableCell>王女士</TableCell>
                        <TableCell>月嫂服务</TableCell>
                        <TableCell className="text-sm">2024-12-01 ~ 2025-02-01</TableCell>
                        <TableCell className="tabular-nums">¥28,800</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="tabular-nums">DD2024110200002</TableCell>
                        <TableCell>李女士</TableCell>
                        <TableCell>月嫂服务</TableCell>
                        <TableCell className="text-sm">2024-09-01 ~ 2024-11-01</TableCell>
                        <TableCell className="tabular-nums">¥25,600</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
