"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Star, Search, Filter, MessageSquare, ThumbsUp, ThumbsDown,
  Clock, User, Phone, Calendar, ChevronRight, AlertTriangle,
  CheckCircle, XCircle, Eye, Reply
} from "lucide-react"

// MOCK数据 - 评价列表
const evaluationsData = [
  {
    id: "EVL001",
    orderId: "FSO2026031801",
    customerName: "张女士",
    customerPhone: "188****8888",
    staffName: "王阿姨",
    staffType: "月嫂",
    serviceType: "月嫂服务",
    rating: 5,
    dimensions: { skill: 5, attitude: 5, punctuality: 5, hygiene: 5 },
    content: "王阿姨非常专业，对宝宝照顾得很细心，月子餐也做得很好吃，强烈推荐！",
    images: [],
    reply: "感谢您的认可，我们会继续努力提供优质服务！",
    status: "replied",
    createdAt: "2026-03-18 10:30",
    isAnonymous: false,
  },
  {
    id: "EVL002",
    orderId: "FSO2026031802",
    customerName: "李女士",
    customerPhone: "177****7777",
    staffName: "张阿姨",
    staffType: "育婴师",
    serviceType: "育婴服务",
    rating: 4,
    dimensions: { skill: 4, attitude: 5, punctuality: 4, hygiene: 4 },
    content: "整体服务不错，育婴师很有耐心，就是有时候时间观念稍差一点。",
    images: [],
    reply: null,
    status: "pending",
    createdAt: "2026-03-17 16:20",
    isAnonymous: false,
  },
  {
    id: "EVL003",
    orderId: "FSO2026031803",
    customerName: "匿名用户",
    customerPhone: "166****6666",
    staffName: "陈技师",
    staffType: "产康技师",
    serviceType: "产康服务",
    rating: 5,
    dimensions: { skill: 5, attitude: 5, punctuality: 5, hygiene: 5 },
    content: "产康效果很好，技师手法专业，服务态度也很好，会继续做疗程。",
    images: [],
    reply: "感谢您的好评，期待继续为您服务！",
    status: "replied",
    createdAt: "2026-03-17 14:15",
    isAnonymous: true,
  },
  {
    id: "EVL004",
    orderId: "FSO2026031804",
    customerName: "赵女士",
    customerPhone: "155****5555",
    staffName: "李阿姨",
    staffType: "月嫂",
    serviceType: "月嫂服务",
    rating: 2,
    dimensions: { skill: 2, attitude: 3, punctuality: 2, hygiene: 2 },
    content: "服务不太满意，月嫂经常玩手机，做事不够认真，希望公司能加强管理。",
    images: [],
    reply: null,
    status: "flagged",
    createdAt: "2026-03-16 09:45",
    isAnonymous: false,
  },
]

// 评价统计
const statsData = {
  totalCount: 156,
  avgRating: 4.7,
  ratingDistribution: [
    { rating: 5, count: 98, percentage: 63 },
    { rating: 4, count: 38, percentage: 24 },
    { rating: 3, count: 12, percentage: 8 },
    { rating: 2, count: 5, percentage: 3 },
    { rating: 1, count: 3, percentage: 2 },
  ],
  dimensionAvg: { skill: 4.8, attitude: 4.9, punctuality: 4.5, hygiene: 4.7 },
  pendingReply: 12,
  flaggedCount: 3,
}

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending": { label: "待回复", color: "bg-amber-100 text-amber-700" },
  "replied": { label: "已回复", color: "bg-green-100 text-green-700" },
  "flagged": { label: "需关注", color: "bg-red-100 text-red-700" },
}

const dimensionLabels: Record<string, string> = {
  skill: "专业技能",
  attitude: "服务态度",
  punctuality: "守时程度",
  hygiene: "卫生习惯",
}

export default function EvaluationPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<typeof evaluationsData[0] | null>(null)

  // 筛选评价
  const filteredEvaluations = evaluationsData.filter(e => {
    if (searchTerm && !e.customerName.includes(searchTerm) && !e.staffName.includes(searchTerm)) return false
    if (filterRating !== "all" && e.rating !== parseInt(filterRating)) return false
    if (activeTab === "pending" && e.status !== "pending") return false
    if (activeTab === "flagged" && e.status !== "flagged") return false
    return true
  })

  const handleViewDetail = (evaluation: typeof evaluationsData[0]) => {
    setSelectedEvaluation(evaluation)
    setShowDetailDialog(true)
  }

  const handleReply = (evaluation: typeof evaluationsData[0]) => {
    setSelectedEvaluation(evaluation)
    setShowReplyDialog(true)
  }

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={cn(
              size,
              i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
            )}
          />
        ))}
      </div>
    )
  }

return (
  <AdminLayout title="服务评价">
  <div className="flex flex-col gap-6">
  {/* 页面标题 */}
  <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">服务评价</h1>
          <p className="text-sm text-muted-foreground mt-1">查看和管理客户对服务的评价反馈</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {/* 综合评分 */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{statsData.avgRating}</p>
              <div className="flex justify-center mt-1">{renderStars(Math.round(statsData.avgRating))}</div>
              <p className="text-sm text-muted-foreground mt-1">综合评分 ({statsData.totalCount}条评价)</p>
            </div>
          </CardContent>
        </Card>

        {/* 评分分布 */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">评分分布</h4>
            <div className="space-y-2">
              {statsData.ratingDistribution.map(item => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.rating}星</span>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 维度评分 */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">维度评分</h4>
            <div className="space-y-2">
              {Object.entries(statsData.dimensionAvg).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dimensionLabels[key]}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索客户或服务人员..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="星级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部星级</SelectItem>
            <SelectItem value="5">5星</SelectItem>
            <SelectItem value="4">4星</SelectItem>
            <SelectItem value="3">3星</SelectItem>
            <SelectItem value="2">2星</SelectItem>
            <SelectItem value="1">1星</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tab和评价列表 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">全部评价</TabsTrigger>
          <TabsTrigger value="pending">待回复 <Badge variant="secondary" className="ml-1">{statsData.pendingReply}</Badge></TabsTrigger>
          <TabsTrigger value="flagged">需关注 <Badge variant="destructive" className="ml-1">{statsData.flaggedCount}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredEvaluations.map(evaluation => (
                  <div key={evaluation.id} className="p-4 border rounded-lg hover:bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{evaluation.customerName.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{evaluation.customerName}</span>
                            {evaluation.isAnonymous && <Badge variant="outline" className="text-xs">匿名</Badge>}
                            <Badge className={cn("text-xs", statusConfig[evaluation.status].color)}>
                              {statusConfig[evaluation.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(evaluation.rating, "h-3 w-3")}
                            <span className="text-sm text-muted-foreground">
                              评价 <span className="font-medium text-foreground">{evaluation.staffName}</span> ({evaluation.staffType})
                            </span>
                          </div>
                          <p className="mt-2 text-sm">{evaluation.content}</p>
                          {evaluation.reply && (
                            <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                              <span className="text-muted-foreground">商家回复：</span>
                              {evaluation.reply}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{evaluation.createdAt}</span>
                            <span>订单: {evaluation.orderId}</span>
                            <span>{evaluation.serviceType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(evaluation)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {evaluation.status === "pending" && (
                          <Button size="sm" onClick={() => handleReply(evaluation)}>
                            <Reply className="h-4 w-4 mr-1" />回复
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 评价详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>评价详情</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <div className="space-y-4 py-4">
              {/* 客户信息 */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{selectedEvaluation.customerName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedEvaluation.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedEvaluation.customerPhone}</p>
                </div>
              </div>

              {/* 评分 */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">综合评分</span>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedEvaluation.rating)}
                    <span className="font-bold">{selectedEvaluation.rating}.0</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(selectedEvaluation.dimensions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{dimensionLabels[key]}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(value, "h-3 w-3")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 评价内容 */}
              <div className="space-y-2">
                <p className="text-sm font-medium">评价内容</p>
                <p className="text-sm">{selectedEvaluation.content}</p>
              </div>

              {/* 服务信息 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">订单编号:</span><span>{selectedEvaluation.orderId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">服务人员:</span><span>{selectedEvaluation.staffName} ({selectedEvaluation.staffType})</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">服务类型:</span><span>{selectedEvaluation.serviceType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">评价时间:</span><span>{selectedEvaluation.createdAt}</span></div>
              </div>

              {/* 商家回复 */}
              {selectedEvaluation.reply && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700 mb-1">商家回复</p>
                  <p className="text-sm">{selectedEvaluation.reply}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>关闭</Button>
            {selectedEvaluation?.status === "pending" && (
              <Button onClick={() => { setShowDetailDialog(false); handleReply(selectedEvaluation); }}>
                回复评价
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 回复评价对话框 */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>回复评价</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedEvaluation.customerName}</span>
                  {renderStars(selectedEvaluation.rating, "h-3 w-3")}
                </div>
                <p className="text-sm text-muted-foreground">{selectedEvaluation.content}</p>
              </div>
              <div className="space-y-2">
                <Label>回复内容</Label>
                <Textarea placeholder="请输入回复内容..." rows={4} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>回复后将通知客户，请谨慎填写</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>取消</Button>
            <Button onClick={() => setShowReplyDialog(false)}>提交回复</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </AdminLayout>
  )
}
