"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Search, Plus, Award, Gift, TrendingUp, TrendingDown, Settings, Edit, Trash2,
  User, Calendar, ArrowUpRight, ArrowDownRight, Star, ShoppingBag, Users, Coins,
  Crown, Diamond, Sparkles, Heart, UserPlus, Clock, Percent, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 会员等级配置 ====================
interface MemberLevel {
  id: string
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  condition: string
  coefficient: string
  validity: string
  benefits: string[]
}

const memberLevels: MemberLevel[] = [
  {
    id: "registered",
    name: "注册会员",
    icon: User,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    condition: "爱月宝有消费",
    coefficient: "1%",
    validity: "永久",
    benefits: [
      "用于产康项目消费，不能适用于产品，且消费不低于2000元",
      "用于积分兑换",
      "产康消费积分抵现最高不超过本次消费的10%，例如本次消费5000元，积分抵现金不得超过500",
    ],
  },
  {
    id: "vip",
    name: "VIP会员",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    condition: "产康累计消费1,000-8,000元",
    coefficient: "2%",
    validity: "永久",
    benefits: [
      "可用于产康的任何产品与项目（产品按照原价兑换），当次消费不低于2000元",
      "积分100以上，每年生日有礼，须到店领取",
      "产康消费积分抵现最高不超过本次消费的10%",
    ],
  },
  {
    id: "diamond",
    name: "钻卡会员",
    icon: Diamond,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    condition: "产康累计消费8,001-30,000元",
    coefficient: "3%",
    validity: "永久",
    benefits: [
      "可用于产康的任何产品与项目（产品按照原价兑换），当次消费不低于2000元",
      "积分100以上，每年生日有礼，须到店领取",
      "产康消费积分抵现最高不超过本次消费的10%",
    ],
  },
  {
    id: "supreme",
    name: "至尊会员",
    icon: Crown,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    condition: "产康累计消费30,000元以上",
    coefficient: "4%",
    validity: "永久",
    benefits: [
      "可用于产康的任何产品与项目（产品按照原价兑换），当次消费不低于2000元",
      "积分100以上，每年生日有礼，须到店领取",
      "产康消费积分抵现最高不超过本次消费的10%",
      "专属VIP客服通道",
    ],
  },
]

// ==================== 积分赠送规则 ====================
interface BonusRule {
  id: string
  name: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  description: string
  points: string
  enabled: boolean
}

const bonusRules: BonusRule[] = [
  { id: "B001", name: "准时到达奖励", icon: Clock, iconColor: "text-green-600", iconBg: "bg-green-100", description: "客户预约准时到达", points: "+5分/次", enabled: true },
  { id: "B002", name: "生日双倍积分", icon: Sparkles, iconColor: "text-amber-600", iconBg: "bg-amber-100", description: "客户生日当天充值/定制套餐", points: "双倍积分", enabled: true },
  { id: "B003", name: "转介绍奖励(A)", icon: UserPlus, iconColor: "text-blue-600", iconBg: "bg-blue-100", description: "客户A转介绍客户（上户或到店），无论成交与否", points: "+200积分/人", enabled: true },
  { id: "B004", name: "转介绍成交奖励(大额)", icon: Heart, iconColor: "text-rose-600", iconBg: "bg-rose-100", description: "转介绍成交金额 >= 3000元：A得300分，B得200分", points: "+300/+200积分", enabled: true },
  { id: "B005", name: "转介绍成交奖励(小额)", icon: Heart, iconColor: "text-pink-600", iconBg: "bg-pink-100", description: "转介绍成交金额 < 3000元：A和B各按成交金额10%获得积分", points: "成交额10%", enabled: true },
]

// ==================== 积分兑换规则 ====================
interface RedeemTier {
  id: string
  points: number
  gift: string
  stock: number
  redeemed: number
  enabled: boolean
}

const redeemTiers: RedeemTier[] = [
  { id: "G001", points: 1000, gift: "精品推车", stock: 20, redeemed: 5, enabled: true },
  { id: "G002", points: 2000, gift: "凯宾斯基双人自助餐券", stock: 30, redeemed: 12, enabled: true },
  { id: "G003", points: 3000, gift: "酷奇儿童自行车/骆驼户外野营装备", stock: 15, redeemed: 3, enabled: true },
  { id: "G004", points: 5000, gift: "品牌包包", stock: 10, redeemed: 2, enabled: true },
  { id: "G005", points: 8000, gift: "单人贵州旅行套餐", stock: 8, redeemed: 1, enabled: true },
  { id: "G006", points: 10000, gift: "单人桂林旅行套餐", stock: 5, redeemed: 0, enabled: true },
  { id: "G007", points: 20000, gift: "当季新款华为或苹果手机/平板一台", stock: 3, redeemed: 0, enabled: true },
]

// ==================== 积分记录 ====================
interface PointRecord {
  id: string
  userId: string
  userName: string
  memberLevel: string
  type: "earn" | "spend"
  category: string
  points: number
  balance: number
  description: string
  orderId?: string
  createdAt: string
}

const mockRecords: PointRecord[] = [
  { id: "P001", userId: "C001", userName: "刘女士", memberLevel: "VIP会员", type: "earn", category: "消费积分", points: 188, balance: 1688, description: "产康消费 ORD202501001（2%系数）", orderId: "ORD202501001", createdAt: "2025-01-20 14:30" },
  { id: "P002", userId: "C002", userName: "陈先生", memberLevel: "注册会员", type: "earn", category: "转介绍", points: 200, balance: 2300, description: "转介绍客户上户，未成交", createdAt: "2025-01-19 10:15" },
  { id: "P003", userId: "C003", userName: "王女士", memberLevel: "钻卡会员", type: "earn", category: "转介绍成交", points: 300, balance: 8500, description: "转介绍客户B成交5000元（>=3000）", createdAt: "2025-01-18 16:45" },
  { id: "P004", userId: "C004", userName: "张女士", memberLevel: "VIP会员", type: "spend", category: "积分兑换", points: -2000, balance: 3500, description: "兑换凯宾斯基双人自助餐券", createdAt: "2025-01-17 11:20" },
  { id: "P005", userId: "C005", userName: "赵女士", memberLevel: "至尊会员", type: "earn", category: "生日双倍", points: 600, balance: 12200, description: "生日当天充值15000元（4%*2双倍）", createdAt: "2025-01-16 09:00" },
  { id: "P006", userId: "C006", userName: "孙女士", memberLevel: "注册会员", type: "earn", category: "准时到达", points: 5, balance: 155, description: "预约准时到达", createdAt: "2025-01-15 15:30" },
  { id: "P007", userId: "C007", userName: "周女士", memberLevel: "钻卡会员", type: "spend", category: "积分抵扣", points: -300, balance: 6700, description: "订单消费3000元，积分抵扣300元（上限10%）", orderId: "ORD202501007", createdAt: "2025-01-14 14:00" },
  { id: "P008", userId: "C008", userName: "吴女士", memberLevel: "VIP会员", type: "earn", category: "消费积分", points: 80, balance: 980, description: "产康消费4000元（2%系数）", createdAt: "2025-01-13 10:30" },
]

// ==================== 会员等级编辑弹窗 ====================
function LevelEditDialog({ level, trigger }: { level: MemberLevel; trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            编辑会员等级 - {level.name}
          </DialogTitle>
          <DialogDescription className="text-xs">修改会员等级的升级条件和积分系数</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">等级名称</Label>
            <Input className="h-8 text-xs" defaultValue={level.name} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">升级条件</Label>
            <Input className="h-8 text-xs" defaultValue={level.condition} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">积分系数</Label>
              <Input className="h-8 text-xs" defaultValue={level.coefficient} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">积分有效期</Label>
              <Input className="h-8 text-xs" defaultValue={level.validity} disabled />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">核心权益（每行一条）</Label>
            <Textarea className="text-xs min-h-24 resize-none" defaultValue={level.benefits.join("\n")} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 兑换礼品编辑弹窗 ====================
function RedeemEditDialog({ tier, trigger }: { tier?: RedeemTier; trigger: React.ReactNode }) {
  const isEdit = !!tier
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            {isEdit ? "编辑兑换礼品" : "新增兑换礼品"}
          </DialogTitle>
          <DialogDescription className="text-xs">配置积分兑换礼品及库存</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">礼品名称</Label>
            <Input className="h-8 text-xs" defaultValue={tier?.gift} placeholder="输入礼品名称" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">所需积分</Label>
              <Input type="number" className="h-8 text-xs" defaultValue={tier?.points} placeholder="输入积分数" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">库存数量</Label>
              <Input type="number" className="h-8 text-xs" defaultValue={tier?.stock} placeholder="输入库存" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div>
              <p className="text-xs font-medium">上架礼品</p>
              <p className="text-[10px] text-muted-foreground">关闭后该礼品将不可兑换</p>
            </div>
            <Switch defaultChecked={tier?.enabled ?? true} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">{isEdit ? "保存" : "创建"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 主页面 ====================
export default function PointsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("levels")
  const [typeFilter, setTypeFilter] = useState("all")

  const stats = useMemo(() => ({
    totalEarned: mockRecords.filter(r => r.type === "earn").reduce((sum, r) => sum + r.points, 0),
    totalSpent: Math.abs(mockRecords.filter(r => r.type === "spend").reduce((sum, r) => sum + r.points, 0)),
    totalMembers: 856,
    totalRedeemed: redeemTiers.reduce((sum, t) => sum + t.redeemed, 0),
  }), [])

  const filteredRecords = useMemo(() => {
    return mockRecords.filter(r => {
      const matchSearch = !searchTerm || r.userName.includes(searchTerm) || r.description.includes(searchTerm)
      const matchType = typeFilter === "all" || r.type === typeFilter
      return matchSearch && matchType
    })
  }, [searchTerm, typeFilter])

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">积分管理</h1>
            <p className="text-xs text-muted-foreground">管理会员等级、积分规则、积分记录与兑换礼品</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-100">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">+{stats.totalEarned.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">累计发放积分</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-100">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">-{stats.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">累计消耗积分</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stats.totalMembers}</p>
                  <p className="text-[10px] text-muted-foreground">积分会员数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-100">
                  <Gift className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stats.totalRedeemed}</p>
                  <p className="text-[10px] text-muted-foreground">已兑换礼品数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="levels" className="text-xs h-6">会员等级</TabsTrigger>
              <TabsTrigger value="bonus" className="text-xs h-6">积分赠送规则</TabsTrigger>
              <TabsTrigger value="redeem" className="text-xs h-6">积分兑换</TabsTrigger>
              <TabsTrigger value="records" className="text-xs h-6">积分记录</TabsTrigger>
            </TabsList>
            
            {activeTab === "records" && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="搜索用户或描述..." className="h-7 w-48 pl-7 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="earn">获取</SelectItem>
                    <SelectItem value="spend">消耗</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "redeem" && (
              <RedeemEditDialog trigger={<Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新增礼品</Button>} />
            )}
          </div>

          {/* ==================== 会员等级 Tab ==================== */}
          <TabsContent value="levels" className="mt-3 space-y-4">
            {/* 等级卡片 */}
            <div className="grid grid-cols-4 gap-3">
              {memberLevels.map(level => {
                const LevelIcon = level.icon
                return (
                  <Card key={level.id} className={cn("border-2", level.borderColor)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-2 rounded-lg", level.bgColor)}>
                            <LevelIcon className={cn("h-5 w-5", level.color)} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{level.name}</p>
                            <p className="text-[10px] text-muted-foreground">积分系数 {level.coefficient}</p>
                          </div>
                        </div>
                        <LevelEditDialog
                          level={level}
                          trigger={<Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3 w-3" /></Button>}
                        />
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">升级条件</span>
                          <span className="font-medium">{level.condition}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">积分有效期</span>
                          <Badge variant="outline" className="text-[10px] h-4">{level.validity}</Badge>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="space-y-1.5 mt-2">
                        <p className="text-[10px] font-medium text-muted-foreground">核心权益</p>
                        {level.benefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <ChevronRight className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{b}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 积分积累规则说明 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  积分积累规则说明
                </CardTitle>
                <CardDescription className="text-xs">客户消费时按对应等级的积分系数自动积累积分，积分永久有效</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="w-28">会员等级</TableHead>
                      <TableHead className="w-40">升级条件</TableHead>
                      <TableHead className="w-24 text-center">积分系数</TableHead>
                      <TableHead className="w-24 text-center">积分有效期</TableHead>
                      <TableHead>积分核心权益</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberLevels.map(level => {
                      const LevelIcon = level.icon
                      return (
                        <TableRow key={level.id} className="text-xs">
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <div className={cn("p-1 rounded", level.bgColor)}>
                                <LevelIcon className={cn("h-3 w-3", level.color)} />
                              </div>
                              <span className="font-medium">{level.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{level.condition}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn("text-[10px]", level.color)}>{level.coefficient}</Badge>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">{level.validity}</TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              {level.benefits.map((b, i) => (
                                <p key={i} className="text-[10px] text-muted-foreground">{i + 1}. {b}</p>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== 积分赠送规则 Tab ==================== */}
          <TabsContent value="bonus" className="mt-3 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {bonusRules.map(rule => {
                const RuleIcon = rule.icon
                return (
                  <Card key={rule.id} className={cn(!rule.enabled && "opacity-60")}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-lg shrink-0", rule.iconBg)}>
                          <RuleIcon className={cn("h-5 w-5", rule.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{rule.name}</p>
                            <Badge variant={rule.enabled ? "default" : "secondary"} className="text-[9px] h-4">
                              {rule.enabled ? "已启用" : "已禁用"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-green-600">{rule.points}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Switch defaultChecked={rule.enabled} />
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 规则详细说明 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">积分赠送规则详细说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="font-medium text-green-800 mb-1">准时到达奖励</p>
                  <p className="text-green-700">客户预约准时到达增加5分/次</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="font-medium text-amber-800 mb-1">生日双倍积分</p>
                  <p className="text-amber-700">客户生日当天充值/定制套餐增加双倍积分（按当前等级系数 x2 计算）</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="font-medium text-blue-800 mb-1">转介绍奖励</p>
                  <div className="space-y-1 text-blue-700">
                    <p>1. 客户A转介绍的客户（上户或到店），每转介绍一位，无论成交与否，都给客户A增加200积分</p>
                    <p>2. 转介绍成交金额 &gt;= 3000元：给客户A增加300积分，给客户B增加200积分（不影响B的项目积分）</p>
                    <p>3. 转介绍成交金额 &lt; 3000元：按成交金额10%的比例分别给客户A与客户B增加积分</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== 积分兑换 Tab ==================== */}
          <TabsContent value="redeem" className="mt-3 space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-28 text-center">积分额度</TableHead>
                    <TableHead>可兑换礼品</TableHead>
                    <TableHead className="w-20 text-center">库存</TableHead>
                    <TableHead className="w-20 text-center">已兑换</TableHead>
                    <TableHead className="w-20 text-center">状态</TableHead>
                    <TableHead className="w-24 text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redeemTiers.map(tier => (
                    <TableRow key={tier.id} className={cn("text-xs", !tier.enabled && "opacity-60")}>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[11px] font-bold text-primary">
                          <Coins className="h-3 w-3 mr-1" />{tier.points.toLocaleString()}分
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{tier.gift}</TableCell>
                      <TableCell className="text-center">{tier.stock}</TableCell>
                      <TableCell className="text-center">{tier.redeemed}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={tier.enabled ? "default" : "secondary"} className="text-[9px] h-4">
                          {tier.enabled ? "上架" : "下架"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <RedeemEditDialog tier={tier} trigger={<Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3 w-3" /></Button>} />
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* 兑换规则说明 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  兑换规则说明
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p>1. 积分兑换不设有效期限制，积分永久有效</p>
                <p>2. 兑换礼品后积分即时扣减，不可退还</p>
                <p>3. 实物礼品需到店领取，领取时出示会员信息</p>
                <p>4. 礼品库存不足时自动下架，补充库存后重新上架</p>
                <p>5. 积分不可转让给他人</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== 积分记录 Tab ==================== */}
          <TabsContent value="records" className="mt-3">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-40">用户</TableHead>
                    <TableHead className="w-20">会员等级</TableHead>
                    <TableHead className="w-20">类型</TableHead>
                    <TableHead className="w-24">分类</TableHead>
                    <TableHead className="w-20 text-right">积分</TableHead>
                    <TableHead className="w-24 text-right">余额</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="w-32">时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id} className="text-xs">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{record.userName.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{record.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] h-4",
                          record.memberLevel === "至尊会员" ? "bg-rose-50 text-rose-700" :
                          record.memberLevel === "钻卡会员" ? "bg-sky-50 text-sky-700" :
                          record.memberLevel === "VIP会员" ? "bg-amber-50 text-amber-700" :
                          "bg-slate-50 text-slate-700"
                        )}>{record.memberLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", record.type === "earn" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                          {record.type === "earn" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                          {record.type === "earn" ? "获取" : "消耗"}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell className={cn("text-right font-medium", record.points > 0 ? "text-green-600" : "text-red-600")}>
                        {record.points > 0 ? "+" : ""}{record.points}
                      </TableCell>
                      <TableCell className="text-right font-mono">{record.balance}</TableCell>
                      <TableCell className="text-muted-foreground">{record.description}</TableCell>
                      <TableCell className="text-muted-foreground">{record.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
