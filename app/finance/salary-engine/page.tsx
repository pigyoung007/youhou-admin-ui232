"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, Calculator, Users, GraduationCap, Baby, Home, Briefcase, 
  Plus, Edit, Trash2, Save, Copy, ChevronRight, DollarSign, Target,
  Award, TrendingUp, CheckCircle, AlertCircle, FileText, Percent,
  BookOpen, Video, ThumbsUp, MessageSquare, Play, Info, Heart,
  Stethoscope, UserCog, Globe, ArrowRight, Layers
} from "lucide-react"

// ========== 月嫂工资级别表（附件原表） ==========
const yuesaoLevels = [
  { level: "一星", serviceType: "住家", experience: "1年以内", price: 8800, salary: 5600, commission: 1600 },
  { level: "二星", serviceType: "住家", experience: "1-2年", price: 9800, salary: 6500, commission: 1800 },
  { level: "三星", serviceType: "住家", experience: "1-2年", price: 10800, salary: 7200, commission: 2000 },
  { level: "四星", serviceType: "住家", experience: "2-3年", price: 12800, salary: 8500, commission: 2500 },
  { level: "五星", serviceType: "住家", experience: "3-6年", price: 14800, salary: 10000, commission: 3600 },
  { level: "六星", serviceType: "住家", experience: "3-6年", price: 16800, salary: 11200, commission: 4000 },
  { level: "七星", serviceType: "住家", experience: "6年以上", price: 18800, salary: 12800, commission: 4600 },
]

// ========== 育婴师级别表（附件原表） ==========
const yuyingshiLevels = [
  {
    level: "初级育婴师", experience: "6个月以内", education: "初中或以上", certs: ["育婴师证书"],
    goodRate: "85%",
    dayPrice: 4800, dayPay: 4100, dayCommission: 700,
    livePrice: 6000, livePay: 5200, liveCommission: 800,
  },
  {
    level: "中级育婴师", experience: "6个月以上", education: "初中或以上", certs: ["育婴师证书", "早教指导师证书"],
    goodRate: "90%",
    dayPrice: 5800, dayPay: 4800, dayCommission: 1000,
    livePrice: 7000, livePay: 5800, liveCommission: 1200,
  },
  {
    level: "高级育婴师", experience: "12个月以上", education: "初中或以上", certs: ["育婴师证书", "早教指导师证书", "婴儿营养辅食证书"],
    goodRate: "96%",
    dayPrice: 6800, dayPay: 5500, dayCommission: 1300,
    livePrice: 8000, livePay: 6500, liveCommission: 1500,
  },
  {
    level: "精英育婴师", experience: "24个月以上", education: "初中或以上", certs: ["育婴师证书", "早教指导师证书", "婴儿营养辅食证书", "小儿推拿师证书"],
    goodRate: "100%",
    dayPrice: 8000, dayPay: 6500, dayCommission: 1500,
    livePrice: 9500, livePay: 7800, liveCommission: 1700,
  },
  {
    level: "金牌育婴师", experience: "36个月以上", education: "大专及以上", certs: ["育婴师证书", "早教指导师证书", "婴儿营养辅食证书", "小儿推拿师证书"],
    goodRate: "100%",
    dayPrice: 9000, dayPay: 7300, dayCommission: 1700,
    livePrice: 10500, livePay: 8800, liveCommission: 1700,
  },
  {
    level: "超级育婴师", experience: "金牌6个月+,零投诉", education: "大专及以上", certs: ["育婴师证书", "早教指导师证书", "婴儿营养辅食证书", "小儿推拿师证书", "育婴师(师资)证书"],
    goodRate: "100%",
    dayPrice: 10000, dayPay: 8000, dayCommission: 2000,
    livePrice: 12000, livePay: 9500, liveCommission: 2500,
  },
]

// ========== 产康技师手工费表（附件原表） ==========
const technicianServiceFees = [
  // 乳房护理
  { category: "乳房护理", name: "开奶", code: "25000153", price: 638, probation: 20, regular: 30 },
  { category: "乳房护理", name: "乳腺疏通(堵奶/涨奶)", code: "24000120", price: 480, probation: 20, regular: 30 },
  { category: "乳房护理", name: "回奶/排残奶", code: "24000120-1", price: 480, probation: 20, regular: 30 },
  { category: "乳房护理", name: "急慢性乳腺炎", code: "24000120-2", price: 480, probation: 20, regular: 30 },
  { category: "乳房护理", name: "乳腺增生调理", code: "24000120-3", price: 480, probation: 20, regular: 30 },
  // 产后恢复
  { category: "产后恢复", name: "产后深层排毒发汗", code: "24000120-4", price: 498, probation: 25, regular: 40 },
  { category: "产后恢复", name: "五行减压疏通", code: "24000120-5", price: 580, probation: 20, regular: 25 },
  { category: "产后恢复", name: "徒手骨盆修复", code: "24000120-7", price: 998, probation: 20, regular: 25 },
  { category: "产后恢复", name: "耻骨闭合", code: "25000154", price: 6498, probation: 0, regular: 0 },
  { category: "产后恢复", name: "妈妈臀", code: "24000148-8", price: 498, probation: 8, regular: 10 },
  { category: "产后恢复", name: "盆底肌检测", code: "24000120-9", price: 158, probation: 0, regular: 0 },
  { category: "产后恢复", name: "盆底肌修复", code: "25000155-1", price: 380, probation: 8, regular: 10 },
  { category: "产后恢复", name: "腹直肌修复", code: "24000121-0", price: 498, probation: 8, regular: 10 },
  { category: "产后恢复", name: "脏腑提升(归位)", code: "24000148-4", price: 498, probation: 8, regular: 10 },
  { category: "产后恢复", name: "腰腹塑形(无产品)", code: "24000148-5", price: 398, probation: 5, regular: 5 },
  { category: "产后恢复", name: "肋骨外翻", code: "24000121-3", price: 598, probation: 10, regular: 10 },
  // 体质调理
  { category: "体质调理", name: "扶阳补气太极灸", code: "24000121-6", price: 498, probation: 15, regular: 20 },
  { category: "体质调理", name: "宫廷滋养脐罐灸", code: "24000121-7", price: 498, probation: 10, regular: 15 },
  { category: "体质调理", name: "全身经络疏通(草本泥)", code: "24000122-3", price: 598, probation: 15, regular: 20 },
  { category: "体质调理", name: "产后关节/肩颈酸痛调理", code: "24000121-9", price: 498, probation: 10, regular: 15 },
  { category: "体质调理", name: "淋巴排毒", code: "24000122-1", price: 498, probation: 10, regular: 15 },
  { category: "体质调理", name: "圆肩驼背/美胸薄背", code: "24000122-6", price: 698, probation: 10, regular: 15 },
  { category: "体质调理", name: "产后局部塑形", code: "24000122-7", price: 498, probation: 10, regular: 10 },
  // 私密美疗
  { category: "私密美疗", name: "外阴SPA+养颜缩阴术", code: "PM001", price: 598, probation: 20, regular: 30 },
  { category: "私密美疗", name: "私密粉嫩", code: "PM002", price: 498, probation: 20, regular: 30 },
  { category: "私密美疗", name: "私密艾灸", code: "PM003", price: 0, probation: 10, regular: 15 },
  { category: "私密美疗", name: "一指私密", code: "24000123-0", price: 1280, probation: 0, regular: 0 },
  // 其他
  { category: "其他", name: "疤痕套盒", code: "QT001", price: 398, probation: 10, regular: 10 },
  { category: "其他", name: "面部清洁+护理", code: "25000205-0", price: 0, probation: 10, regular: 0 },
]

// ========== 流程环节模板 ==========
const processNodes = [
  { id: "N1", name: "客源开发", code: "SOURCE", roles: ["数据专员", "职业顾问"], weight: 10, desc: "客户信息录入、线索获取" },
  { id: "N2", name: "需求匹配", code: "MATCH", roles: ["职业顾问", "母婴顾问"], weight: 15, desc: "与客户沟通意向、匹配服务" },
  { id: "N3", name: "签约成交", code: "DEAL", roles: ["职业顾问", "母婴顾问"], weight: 25, desc: "签订合同、收取定金" },
  { id: "N4", name: "服务执行", code: "SERVICE", roles: ["家政员", "产康技师"], weight: 30, desc: "上户服务、产康服务" },
  { id: "N5", name: "回款确认", code: "PAYMENT", roles: ["母婴顾问", "财务"], weight: 10, desc: "尾款收取、全额确认" },
  { id: "N6", name: "售后跟进", code: "AFTER", roles: ["职业顾问", "母婴顾问"], weight: 10, desc: "客户回访、满意度确认" },
]

// ========== 结算周期配置 ==========
const settlementCycles = [
  { id: "C1", role: "家政员(月嫂)", cycleType: "逢8结算", dates: "每月8、18、28日", desc: "自动生成薪资结算单" },
  { id: "C2", role: "家政员(育婴师)", cycleType: "逢8结算", dates: "每月8、18、28日", desc: "按自然月到期日就近计算" },
  { id: "C3", role: "职业顾问", cycleType: "月结", dates: "每月15日", desc: "基本工资+佣金提成" },
  { id: "C4", role: "母婴顾问", cycleType: "月结", dates: "每月15日", desc: "基本工资+佣金提成" },
  { id: "C5", role: "产康技师", cycleType: "月结", dates: "每月5日(底薪)/15日(提成)", desc: "底薪+业绩提成+手工提成" },
  { id: "C6", role: "基本工资(全员)", cycleType: "固定发放", dates: "每月5日", desc: "总经理确定，全员底薪发放" },
]

// ========== 科目配置 ==========
const subjectConfigs = [
  { id: "s1", name: "母婴护理师", category: "技能培训", commissionRate: 8, bonusRules: { newStudent: 300, interview: 100, subjectExtra: 150, multiEnroll: 200, skillBonus: 150 } },
  { id: "s2", name: "育婴师", category: "技能培训", commissionRate: 7, bonusRules: { newStudent: 250, interview: 80, subjectExtra: 120, multiEnroll: 180, skillBonus: 120 } },
  { id: "s3", name: "产后康复师", category: "技能培训", commissionRate: 10, bonusRules: { newStudent: 350, interview: 120, subjectExtra: 180, multiEnroll: 250, skillBonus: 180 } },
  { id: "s4", name: "小儿推拿师", category: "技能培训", commissionRate: 9, bonusRules: { newStudent: 300, interview: 100, subjectExtra: 150, multiEnroll: 200, skillBonus: 150 } },
  { id: "s5", name: "家政服务员", category: "基础培训", commissionRate: 5, bonusRules: { newStudent: 200, interview: 60, subjectExtra: 80, multiEnroll: 120, skillBonus: 80 } },
  { id: "s6", name: "养老护理员", category: "基础培训", commissionRate: 6, bonusRules: { newStudent: 220, interview: 70, subjectExtra: 100, multiEnroll: 150, skillBonus: 100 } },
]

// ========== 日常工作量考核 ==========
const workAssessmentRules = [
  { id: "wa1", name: "单日工作量", dailyTarget: 8, unit: "小时", rewardPerExtra: 30, penaltyPerMiss: 20, enabled: true },
  { id: "wa2", name: "朋友圈发布", dailyTarget: 2, unit: "条", rewardPerExtra: 10, penaltyPerMiss: 5, enabled: true },
  { id: "wa3", name: "视频号转发", dailyTarget: 3, unit: "条", rewardPerExtra: 8, penaltyPerMiss: 5, enabled: true },
  { id: "wa4", name: "客户好评", dailyTarget: 1, unit: "条", rewardPerExtra: 50, penaltyPerMiss: 0, enabled: true },
  { id: "wa5", name: "小红书转发/编写", dailyTarget: 1, unit: "篇", rewardPerExtra: 20, penaltyPerMiss: 10, enabled: true },
]

// ========== 主组件 ==========
export default function SalaryEnginePage() {
  const [activeTab, setActiveTab] = useState("yuesao")
  const [showSimulator, setShowSimulator] = useState(false)
  const [editingNode, setEditingNode] = useState<typeof processNodes[0] | null>(null)
  const [techCategory, setTechCategory] = useState("all")

  const techCategories = [...new Set(technicianServiceFees.map(f => f.category))]
  const filteredTechFees = techCategory === "all" ? technicianServiceFees : technicianServiceFees.filter(f => f.category === techCategory)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">薪资结算引擎</h1>
            <p className="text-sm text-muted-foreground mt-1">配置各角色薪资规则、价格体系、提成比例和佣金分成流程</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent" onClick={() => setShowSimulator(true)}>
              <Calculator className="h-4 w-4 mr-2" />
              模拟计算
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="yuesao" className="text-xs gap-1.5"><Baby className="h-3.5 w-3.5" />月嫂工资</TabsTrigger>
            <TabsTrigger value="yuyingshi" className="text-xs gap-1.5"><Heart className="h-3.5 w-3.5" />育婴师工资</TabsTrigger>
            <TabsTrigger value="technician" className="text-xs gap-1.5"><Stethoscope className="h-3.5 w-3.5" />技师手工费</TabsTrigger>
            <TabsTrigger value="consultant" className="text-xs gap-1.5"><GraduationCap className="h-3.5 w-3.5" />顾问提成</TabsTrigger>
            <TabsTrigger value="process" className="text-xs gap-1.5"><Layers className="h-3.5 w-3.5" />流程分佣</TabsTrigger>
            <TabsTrigger value="cycle" className="text-xs gap-1.5"><Settings className="h-3.5 w-3.5" />结算周期</TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs gap-1.5"><Target className="h-3.5 w-3.5" />工作量考核</TabsTrigger>
          </TabsList>

          {/* ===== 月嫂工资级别表 ===== */}
          <TabsContent value="yuesao" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">月嫂工资级别标准</CardTitle>
                    <CardDescription className="text-xs mt-0.5">月嫂薪资按天数计算，标准为26天/月。未达到或超过26天按平均日工资 x 实际服务天数计算。</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增级别</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-muted/30">
                        <TableHead className="w-20">级别</TableHead>
                        <TableHead>服务性质</TableHead>
                        <TableHead>经验要求</TableHead>
                        <TableHead className="text-right">服务价格</TableHead>
                        <TableHead className="text-right">月嫂工资(26天)</TableHead>
                        <TableHead className="text-right">平均日工资</TableHead>
                        <TableHead className="text-right">顾问佣金</TableHead>
                        <TableHead className="text-right">公司收入</TableHead>
                        <TableHead className="w-16">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yuesaoLevels.map((l, i) => {
                        const dailyWage = Math.round(l.salary / 26)
                        const companyRevenue = l.price - l.salary - l.commission
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge variant="outline" className={
                                i >= 5 ? "bg-purple-50 text-purple-700 border-purple-200" :
                                i >= 3 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-blue-50 text-blue-700 border-blue-200"
                              }>{l.level}</Badge>
                            </TableCell>
                            <TableCell>{l.serviceType}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{l.experience}</TableCell>
                            <TableCell className="text-right font-semibold">¥{l.price.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">¥{l.salary.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-muted-foreground">¥{dailyWage}/天</TableCell>
                            <TableCell className="text-right text-amber-600">¥{l.commission.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-emerald-600">¥{companyRevenue.toLocaleString()}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800 space-y-1">
                  <p className="font-medium">计薪说明：</p>
                  <p>- 标准服务周期为26天，实际工资 = 月工资 / 26 x 实际服务天数</p>
                  <p>- 如服务天数不足或超过26天，均按日均工资折算</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 育婴师工资级别表 ===== */}
          <TabsContent value="yuyingshi" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">育婴师工资级别标准</CardTitle>
                    <CardDescription className="text-xs mt-0.5">分白班和住家两种模式，工资逢8日(8/18/28)发放</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增级别</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-muted/30">
                        <TableHead rowSpan={2} className="border-r align-middle">级别</TableHead>
                        <TableHead colSpan={3} className="text-center border-r bg-blue-50/50">白班</TableHead>
                        <TableHead colSpan={3} className="text-center border-r bg-pink-50/50">住家</TableHead>
                        <TableHead rowSpan={2} className="align-middle">好评率</TableHead>
                        <TableHead rowSpan={2} className="w-16 align-middle">操作</TableHead>
                      </TableRow>
                      <TableRow className="hover:bg-transparent bg-muted/20">
                        <TableHead className="text-right text-xs">签约价</TableHead>
                        <TableHead className="text-right text-xs">到手价</TableHead>
                        <TableHead className="text-right text-xs border-r">佣金</TableHead>
                        <TableHead className="text-right text-xs">签约价</TableHead>
                        <TableHead className="text-right text-xs">到手价</TableHead>
                        <TableHead className="text-right text-xs border-r">佣金</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yuyingshiLevels.map((l, i) => (
                        <TableRow key={i}>
                          <TableCell className="border-r">
                            <Badge variant="outline" className={
                              i >= 4 ? "bg-purple-50 text-purple-700 border-purple-200" :
                              i >= 2 ? "bg-amber-50 text-amber-700 border-amber-200" : ""
                            }>{l.level}</Badge>
                          </TableCell>
                          <TableCell className="text-right">¥{l.dayPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium text-primary">¥{l.dayPay.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-amber-600 border-r">¥{l.dayCommission.toLocaleString()}</TableCell>
                          <TableCell className="text-right">¥{l.livePrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium text-primary">¥{l.livePay.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-amber-600 border-r">¥{l.liveCommission.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs">{l.goodRate}</Badge></TableCell>
                          <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 育婴师等级详情 */}
                <div className="mt-4 grid lg:grid-cols-3 gap-3">
                  {yuyingshiLevels.slice(0, 3).map((l, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-muted/20">
                      <div className="font-medium text-sm mb-2">{l.level}</div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>经验: {l.experience}</p>
                        <p>学历: {l.education}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {l.certs.map((c, j) => <Badge key={j} variant="secondary" className="text-[10px] px-1 py-0">{c}</Badge>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 space-y-1">
                  <p className="font-medium">特殊规则：</p>
                  <p>- 保证金: 起收1000元，按签约月数每月多收200元，1500元封顶</p>
                  <p>- 双休调整: 育婴师双休时，服务价和到手价各立减300元</p>
                  <p>- 双胎加收: 客户每月加收1000元，育婴师每月加补1000元，顾问佣金不变</p>
                  <p>- 签约收费: 收取当月服务费全款 + 未上户月份20%定金 + 10%预付款，按月收尾款</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 产康技师手工费表 ===== */}
          <TabsContent value="technician" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">产康技师手工费标准</CardTitle>
                    <CardDescription className="text-xs mt-0.5">技师薪资 = 底薪 + 业绩提成 + 手工提成。底薪由总经理确定每月发放，业绩提成根据结算管理生成。</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={techCategory} onValueChange={setTechCategory}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部分类</SelectItem>
                        {techCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增项目</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-muted/30">
                        <TableHead>分类</TableHead>
                        <TableHead>项目名称</TableHead>
                        <TableHead className="text-right">项目编号</TableHead>
                        <TableHead className="text-right">服务单价(元)</TableHead>
                        <TableHead className="text-right">试用期手工费</TableHead>
                        <TableHead className="text-right">转正后手工费</TableHead>
                        <TableHead className="w-16">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTechFees.map((fee, i) => {
                        const prevCategory = i > 0 ? filteredTechFees[i - 1].category : ""
                        const isNewCategory = fee.category !== prevCategory
                        return (
                          <TableRow key={i} className={isNewCategory ? "border-t-2" : ""}>
                            <TableCell>
                              {isNewCategory && (
                                <Badge variant="outline" className={
                                  fee.category === "乳房护理" ? "bg-pink-50 text-pink-700 border-pink-200" :
                                  fee.category === "产后恢复" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  fee.category === "体质调理" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  fee.category === "私密美疗" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                  "bg-muted"
                                }>{fee.category}</Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-sm">{fee.name}</TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground font-mono">{fee.code}</TableCell>
                            <TableCell className="text-right">{fee.price > 0 ? `¥${fee.price}` : <span className="text-muted-foreground">-</span>}</TableCell>
                            <TableCell className="text-right text-amber-600">{fee.probation > 0 ? `¥${fee.probation}` : "-"}</TableCell>
                            <TableCell className="text-right font-medium text-primary">{fee.regular > 0 ? `¥${fee.regular}` : "-"}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>共 {technicianServiceFees.length} 个项目</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{techCategories.length} 个分类</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>注: "一指私密"项目按成交价10%计提</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 顾问提成规则 ===== */}
          <TabsContent value="consultant" className="space-y-4">
            {/* 职业顾问 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10"><GraduationCap className="h-5 w-5 text-blue-500" /></div>
                  <div>
                    <CardTitle className="text-base">职业顾问薪资构成</CardTitle>
                    <CardDescription className="text-xs mt-0.5">基本工资 + 提成，基本工资每月5号发放，佣金每月15号生成</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">底薪(总经理确定)</div>
                    <div className="flex items-baseline gap-1 mt-1"><Input type="number" className="w-24 h-8" defaultValue={5000} /><span className="text-sm text-muted-foreground">元/月</span></div>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">底薪发放日</div>
                    <div className="text-lg font-semibold mt-1">每月5号</div>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">佣金生成日</div>
                    <div className="text-lg font-semibold mt-1">每月15号</div>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">薪资发放周期</div>
                    <div className="text-lg font-semibold mt-1">每月8/18/28日</div>
                  </div>
                </div>

                {/* 科目奖励配置 */}
                <div>
                  <h4 className="text-sm font-medium mb-3">科目奖励配置</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-muted/30">
                          <TableHead>科目名称</TableHead>
                          <TableHead>分类</TableHead>
                          <TableHead className="text-right">基础提成</TableHead>
                          <TableHead className="text-right">新增奖励</TableHead>
                          <TableHead className="text-right">面试奖励</TableHead>
                          <TableHead className="text-right">科目额外</TableHead>
                          <TableHead className="text-right">连报奖励</TableHead>
                          <TableHead className="text-right">技能奖励</TableHead>
                          <TableHead className="w-16">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectConfigs.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{s.category}</Badge></TableCell>
                            <TableCell className="text-right font-semibold text-primary">{s.commissionRate}%</TableCell>
                            <TableCell className="text-right">¥{s.bonusRules.newStudent}</TableCell>
                            <TableCell className="text-right">¥{s.bonusRules.interview}</TableCell>
                            <TableCell className="text-right">¥{s.bonusRules.subjectExtra}</TableCell>
                            <TableCell className="text-right">¥{s.bonusRules.multiEnroll}</TableCell>
                            <TableCell className="text-right">¥{s.bonusRules.skillBonus}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 顾问分佣 */}
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-blue-50/50">
                    <div className="flex items-center gap-2 mb-3"><GraduationCap className="h-4 w-4 text-blue-600" /><span className="font-medium text-sm">职业顾问分佣比例</span></div>
                    <div className="space-y-2 text-sm">
                      {yuesaoLevels.map((l, i) => (
                        <div key={i} className="flex justify-between"><span className="text-muted-foreground">{l.level}月嫂</span><span className="font-medium text-amber-600">¥{l.commission.toLocaleString()}/单</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-pink-50/50">
                    <div className="flex items-center gap-2 mb-3"><Baby className="h-4 w-4 text-pink-600" /><span className="font-medium text-sm">母婴顾问分佣比例</span></div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">育婴师在户奖励</span><span className="font-medium">¥500/单</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">联单奖励</span><span className="font-medium">¥300/单</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">月嫂成交提成</span><span className="font-medium">8%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">育婴师成交提成</span><span className="font-medium">6%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">产康服务提成</span><span className="font-medium">10%</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 流程分佣管理 ===== */}
          <TabsContent value="process" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">服务流程环节与佣金分成</CardTitle>
                    <CardDescription className="text-xs mt-0.5">将家政服务拆分为多个环节，各角色根据所参与的环节及比例参与佣金分成。支持按城市差异化设置。</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增环节</Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 流程可视化 */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
                  {processNodes.map((node, i) => (
                    <div key={node.id} className="flex items-center shrink-0">
                      <div
                        className="p-3 rounded-lg border-2 border-primary/30 bg-primary/5 cursor-pointer hover:border-primary/60 transition-colors min-w-[130px]"
                        onClick={() => setEditingNode(node)}
                      >
                        <div className="text-xs font-medium text-primary mb-1">{node.code}</div>
                        <div className="font-medium text-sm">{node.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">权重: {node.weight}%</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {node.roles.map((r, j) => <Badge key={j} variant="secondary" className="text-[10px] px-1 py-0">{r}</Badge>)}
                        </div>
                      </div>
                      {i < processNodes.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* 环节详情表 */}
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/30">
                      <TableHead>环节编码</TableHead>
                      <TableHead>环节名称</TableHead>
                      <TableHead>参与角色</TableHead>
                      <TableHead className="text-right">佣金权重</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead className="w-16">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processNodes.map(node => (
                      <TableRow key={node.id}>
                        <TableCell className="font-mono text-xs">{node.code}</TableCell>
                        <TableCell className="font-medium">{node.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">{node.roles.map((r, i) => <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${node.weight}%` }} />
                            </div>
                            <span className="font-semibold text-primary">{node.weight}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{node.desc}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingNode(node)}><Edit className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/30 font-medium">
                      <TableCell colSpan={3} className="text-right">权重合计</TableCell>
                      <TableCell className="text-right text-primary font-bold">{processNodes.reduce((s, n) => s + n.weight, 0)}%</TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 space-y-1">
                  <p className="font-medium">跨城市分佣说明：</p>
                  <p>- 支持不同城市设置各自的流程环节及各环节分佣比例</p>
                  <p>- 支持不同城市间的角色互相参与不同环节获取分佣</p>
                  <p>- 例: A城市录入客户 → B城市顾问成交 → C城市家政员执行 → 各按环节比例分佣</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 结算周期配置 ===== */}
          <TabsContent value="cycle" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">结算周期配置</CardTitle>
                    <CardDescription className="text-xs mt-0.5">按角色配置差异化的薪资结算周期，系统在指定日期自动生成结算单并提交审批</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增配置</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settlementCycles.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10"><Settings className="h-4 w-4 text-primary" /></div>
                        <div>
                          <div className="font-medium text-sm">{c.role}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">{c.cycleType}</Badge>
                          <div className="text-xs text-muted-foreground">{c.dates}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 佣金结算说明 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">佣金结算流程</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {["订单完成/服务执行", "计划任务触发结算", "系统自动计算佣金", "生成待结算清单", "部门主管审核", "财务确认", "薪资发放"].map((step, i) => (
                    <div key={i} className="flex items-center shrink-0">
                      <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-xs font-medium whitespace-nowrap">{step}</div>
                      {i < 6 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800 space-y-1">
                  <p className="font-medium">结算调整说明：</p>
                  <p>- 因特殊原因需调整结算单时，可在顾问确认环节录入调整金额(正数为调增，负数为调减)及调整原因</p>
                  <p>- 调整信息需上传附件材料，并经审批后生效</p>
                  <p>- 每笔佣金可查看详细计算过程与依据，支持佣金明细导出</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== 工作量考核 ===== */}
          <TabsContent value="assessment" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">日常工作量考核规则</CardTitle>
                    <CardDescription className="text-xs mt-0.5">设置工作量指标和奖惩标准</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增指标</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {workAssessmentRules.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Switch checked={rule.enabled} />
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0"><Target className="h-4 w-4 text-primary" /></div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-sm">{rule.name}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">日标准: {rule.dailyTarget} {rule.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">超额奖励</div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">+¥{rule.rewardPerExtra}/{rule.unit}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">未完成扣款</div>
                          <Badge className="bg-red-100 text-red-700 border-red-200">-¥{rule.penaltyPerMiss}/{rule.unit}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">考核等级标准</CardTitle></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-emerald-600" /><span className="font-medium text-sm text-emerald-700">超额达标</span></div>
                    <p className="text-xs text-muted-foreground">完成量超过日标准120%</p>
                    <p className="text-sm font-medium mt-2">额外奖励 +30%</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-blue-600" /><span className="font-medium text-sm text-blue-700">达标</span></div>
                    <p className="text-xs text-muted-foreground">完成量达到日标准100%</p>
                    <p className="text-sm font-medium mt-2">正常发放</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                    <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4 text-red-600" /><span className="font-medium text-sm text-red-700">未完成</span></div>
                    <p className="text-xs text-muted-foreground">完成量低于日标准80%</p>
                    <p className="text-sm font-medium mt-2">扣款处理</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 流程环节编辑弹窗 */}
        <Dialog open={!!editingNode} onOpenChange={() => setEditingNode(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>编辑流程环节</DialogTitle>
              <DialogDescription>配置环节参数、参与角色和佣金权重</DialogDescription>
            </DialogHeader>
            {editingNode && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>环节编码</Label><Input defaultValue={editingNode.code} /></div>
                  <div className="space-y-2"><Label>环节名称</Label><Input defaultValue={editingNode.name} /></div>
                </div>
                <div className="space-y-2">
                  <Label>佣金权重 (%)</Label>
                  <Input type="number" defaultValue={editingNode.weight} />
                </div>
                <div className="space-y-2">
                  <Label>参与角色</Label>
                  <div className="flex flex-wrap gap-2">
                    {["数据专员", "职业顾问", "母婴顾问", "家政员", "产康技师", "财务"].map(r => (
                      <Badge key={r} variant={editingNode.roles.includes(r) ? "default" : "outline"} className="cursor-pointer">{r}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2"><Label>环节说明</Label><Textarea defaultValue={editingNode.desc} /></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setEditingNode(null)}>取消</Button>
              <Button onClick={() => setEditingNode(null)}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 模拟计算弹窗 */}
        <SalarySimulatorDialog open={showSimulator} onOpenChange={setShowSimulator} />
      </div>
    </AdminLayout>
  )
}

// ========== 薪资模拟计算组件 - 多维计算引擎 ==========
function SalarySimulatorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [role, setRole] = useState("yuesao")
  const [params, setParams] = useState({ 
    level: 3, 
    serviceDays: 26, 
    isLiveIn: true, 
    // 育婴师参数
    serviceMode: "day", // day | live
    // 产康技师参数
    serviceCount: 10,
    selectedServices: [] as string[],
    isProbation: false,
    // 考勤参数
    lateDays: 0,
    absentDays: 0,
    overtimeHours: 0,
    // 奖惩参数
    bonusAmount: 0,
    penaltyAmount: 0,
  })

  // 月嫂薪资计算
  const calcYuesao = () => {
    const l = yuesaoLevels[Math.min(params.level, yuesaoLevels.length - 1)]
    const dailyWage = l.salary / 26
    let wage = Math.round(dailyWage * params.serviceDays)
    // 迟到扣款: 50元/次
    wage -= params.lateDays * 50
    // 缺勤扣款: 日工资/天
    wage -= params.absentDays * Math.round(dailyWage)
    // 加班补贴: 30元/小时
    wage += params.overtimeHours * 30
    // 奖惩
    wage += params.bonusAmount - params.penaltyAmount
    return { base: l.salary, daily: Math.round(dailyWage), actual: Math.max(0, wage), commission: l.commission, price: l.price, level: l.level }
  }

  // 育婴师薪资计算
  const calcYuyingshi = () => {
    const l = yuyingshiLevels[Math.min(params.level, yuyingshiLevels.length - 1)]
    const isLive = params.serviceMode === "live"
    const monthlyPay = isLive ? l.livePay : l.dayPay
    const dailyWage = monthlyPay / 26
    let wage = Math.round(dailyWage * params.serviceDays)
    wage -= params.lateDays * 50
    wage -= params.absentDays * Math.round(dailyWage)
    wage += params.overtimeHours * 25
    wage += params.bonusAmount - params.penaltyAmount
    const price = isLive ? l.livePrice : l.dayPrice
    const commission = isLive ? l.liveCommission : l.dayCommission
    return { base: monthlyPay, daily: Math.round(dailyWage), actual: Math.max(0, wage), commission, price, level: l.level }
  }

  // 产康技师薪资计算
  const calcTechnician = () => {
    const baseSalary = 3000 // 底薪
    let serviceFee = 0
    // 计算选中服务的提成
    params.selectedServices.forEach(code => {
      const service = technicianServiceFees.find(s => s.code === code)
      if (service) {
        const fee = params.isProbation ? service.probation : service.regular
        serviceFee += fee * params.serviceCount
      }
    })
    // 如果没有选择服务，使用默认示例
    if (params.selectedServices.length === 0) {
      serviceFee = params.isProbation ? 200 : 300
      serviceFee *= params.serviceCount
    }
    let wage = baseSalary + serviceFee
    wage += params.bonusAmount - params.penaltyAmount
    return { base: baseSalary, serviceFee, actual: Math.max(0, wage), commission: 0, price: 0, level: params.isProbation ? "试用期" : "正式" }
  }

  // 根据角色类型计算
  const getResult = () => {
    switch (role) {
      case "yuyingshi": return calcYuyingshi()
      case "technician": return calcTechnician()
      default: return calcYuesao()
    }
  }

  const result = getResult()

  // 获取当前角色的级别列表
  const getLevelOptions = () => {
    switch (role) {
      case "yuyingshi": return yuyingshiLevels.map((l, i) => ({ value: String(i), label: `${l.level}` }))
      case "technician": return [{ value: "0", label: "试用期技师" }, { value: "1", label: "正式技师" }]
      default: return yuesaoLevels.map((l, i) => ({ value: String(i), label: `${l.level} (¥${l.price.toLocaleString()})` }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base">薪资多维计算引擎</DialogTitle>
          <DialogDescription className="text-xs">根据角色类型、级别、服务天数、考勤、奖惩等参数计算薪资</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4">
          {/* 左侧：参数设置 - 占3列 */}
          <div className="col-span-2 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">角色类型</Label>
              <Select value={role} onValueChange={(v) => { setRole(v); setParams(p => ({...p, level: 0})) }}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yuesao">月嫂</SelectItem>
                  <SelectItem value="yuyingshi">育婴师</SelectItem>
                  <SelectItem value="technician">产康技师</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">级别</Label>
              <Select value={String(params.level)} onValueChange={v => setParams(p => ({...p, level: Number(v)}))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {getLevelOptions().map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {role === "yuyingshi" && (
              <div className="space-y-1.5">
                <Label className="text-xs">服务模式</Label>
                <Select value={params.serviceMode} onValueChange={v => setParams(p => ({...p, serviceMode: v}))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">白班</SelectItem>
                    <SelectItem value="live">住家</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === "technician" && (
              <div className="space-y-1.5">
                <Label className="text-xs">服务次数</Label>
                <Input type="number" className="h-8 text-xs" value={params.serviceCount} onChange={e => setParams(p => ({...p, serviceCount: Number(e.target.value)}))} />
              </div>
            )}

            {role !== "technician" && (
              <div className="space-y-1.5">
                <Label className="text-xs">实际服务天数</Label>
                <Input type="number" className="h-8 text-xs" value={params.serviceDays} onChange={e => setParams(p => ({...p, serviceDays: Number(e.target.value)}))} />
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-2">考勤扣款</div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">迟到(次)</Label>
                  <Input type="number" value={params.lateDays} onChange={e => setParams(p => ({...p, lateDays: Number(e.target.value)}))} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">缺勤(天)</Label>
                  <Input type="number" value={params.absentDays} onChange={e => setParams(p => ({...p, absentDays: Number(e.target.value)}))} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">加班(时)</Label>
                  <Input type="number" value={params.overtimeHours} onChange={e => setParams(p => ({...p, overtimeHours: Number(e.target.value)}))} className="h-7 text-xs" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-2">奖惩调整</div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="space-y-1">
                  <Label className="text-[10px] text-green-600">奖励金额</Label>
                  <Input type="number" value={params.bonusAmount} onChange={e => setParams(p => ({...p, bonusAmount: Number(e.target.value)}))} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-red-600">扣罚金额</Label>
                  <Input type="number" value={params.penaltyAmount} onChange={e => setParams(p => ({...p, penaltyAmount: Number(e.target.value)}))} className="h-7 text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：计算结果 - 占2列 */}
          <div className="col-span-3 space-y-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs text-muted-foreground">预计实发工资</div>
              <div className="text-2xl font-bold text-primary tabular-nums">¥{result.actual.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{result.level}</div>
            </div>
            
            <div className="space-y-1.5 text-xs">
              {role !== "technician" && (
                <>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">服务价格</span><span className="tabular-nums font-medium">¥{result.price.toLocaleString()}</span></div>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">标准月工资</span><span className="tabular-nums font-medium">¥{result.base.toLocaleString()}</span></div>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">日均工资</span><span className="tabular-nums font-medium">¥{result.daily}/天</span></div>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">实际服务天数</span><span className="tabular-nums font-medium">{params.serviceDays}天</span></div>
                </>
              )}
              {role === "technician" && (
                <>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">底薪</span><span className="tabular-nums font-medium">¥{result.base.toLocaleString()}</span></div>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">手工费提成</span><span className="tabular-nums font-medium">¥{(result as any).serviceFee?.toLocaleString() || 0}</span></div>
                  <div className="flex justify-between py-1.5 px-2 rounded bg-muted/50"><span className="text-muted-foreground">服务次数</span><span className="tabular-nums font-medium">{params.serviceCount}次</span></div>
                </>
              )}
              {params.lateDays > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-red-50 text-red-700"><span>迟到扣款({params.lateDays}次)</span><span className="tabular-nums font-medium">-¥{(params.lateDays * 50).toLocaleString()}</span></div>
              )}
              {params.absentDays > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-red-50 text-red-700"><span>缺勤扣款({params.absentDays}天)</span><span className="tabular-nums font-medium">-¥{(params.absentDays * result.daily).toLocaleString()}</span></div>
              )}
              {params.overtimeHours > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-green-50 text-green-700"><span>加班补贴({params.overtimeHours}时)</span><span className="tabular-nums font-medium">+¥{(params.overtimeHours * 30).toLocaleString()}</span></div>
              )}
              {params.bonusAmount > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-green-50 text-green-700"><span>奖励</span><span className="tabular-nums font-medium">+¥{params.bonusAmount.toLocaleString()}</span></div>
              )}
              {params.penaltyAmount > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-red-50 text-red-700"><span>扣罚</span><span className="tabular-nums font-medium">-¥{params.penaltyAmount.toLocaleString()}</span></div>
              )}
              {role !== "technician" && result.commission > 0 && (
                <div className="flex justify-between py-1.5 px-2 rounded bg-amber-50 text-amber-700"><span>顾问佣金(另付)</span><span className="tabular-nums font-medium">¥{result.commission.toLocaleString()}</span></div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-3 border-t mt-3">
          <Button variant="outline" size="sm" className="bg-transparent h-8 text-xs" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button size="sm" className="h-8 text-xs"><FileText className="h-3.5 w-3.5 mr-1.5" />导出计算报告</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
