"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  Briefcase,
  Home,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ==================== 组织架构数据 ====================
const organizationStructure = {
  headquarters: {
    id: "HQ",
    name: "优厚家庭服务总部",
    role: "董事长",
    branches: [
      { id: "YC", name: "银川分公司", role: "总经理" },
      { id: "XA", name: "西安分公司", role: "总经理" },
    ]
  }
}

// ==================== 财务数据（按组织架构和角色权限） ====================

// 人才孵化事业部数据
const talentDeptData = {
  // 职业顾问 - 个人佣金数、个人所属家政人员薪资额、按学员展示佣金
  consultant: {
    personalCommission: 15680,
    personalStaffSalary: 86500,
    monthlyOrders: 12,
    avgCommission: 1306,
    // 按学员展示佣金总数
    studentCommissions: [
      { studentName: "张小花", courseName: "金牌月嫂培训", commission: 2800, enrollDate: "2025-01-15", status: "已结算" },
      { studentName: "李美丽", courseName: "高级育婴师培训", commission: 2200, enrollDate: "2025-01-12", status: "已结算" },
      { studentName: "王秀英", courseName: "产康技师培训", commission: 1800, enrollDate: "2025-01-10", status: "已结算" },
      { studentName: "赵桂芳", courseName: "金牌月嫂培训", commission: 2800, enrollDate: "2025-01-08", status: "已结算" },
      { studentName: "陈小红", courseName: "初级月嫂培训", commission: 1500, enrollDate: "2025-01-05", status: "已结算" },
      { studentName: "刘小燕", courseName: "高级育婴师培训", commission: 2200, enrollDate: "2025-01-03", status: "待结算" },
      { studentName: "孙美华", courseName: "产康技师培训", commission: 1800, enrollDate: "2025-01-02", status: "待结算" },
    ],
    // 所属家政人员薪资明细
    staffSalaryDetails: [
      { staffName: "张小花", serviceType: "月嫂", currentOrder: "刘女士", salary: 12800, status: "服务中" },
      { staffName: "李美丽", serviceType: "育婴师", currentOrder: "陈先生", salary: 8600, status: "服务中" },
      { staffName: "王秀英", serviceType: "产康师", currentOrder: "-", salary: 6500, status: "待岗" },
      { staffName: "赵桂芳", serviceType: "月嫂", currentOrder: "赵女士", salary: 15800, status: "服务中" },
      { staffName: "陈小红", serviceType: "月嫂", currentOrder: "周先生", salary: 11200, status: "服务中" },
      { staffName: "刘小燕", serviceType: "育婴师", currentOrder: "-", salary: 7600, status: "待岗" },
      { staffName: "孙美华", serviceType: "月嫂", currentOrder: "冯女士", salary: 14000, status: "服务中" },
    ],
  },
  // 事业部总经理 - 事业部总佣金数（展示每个职业顾问佣金总额明细）
  deptManager: {
    totalCommission: 186500,
    consultantDetails: [
      { name: "李顾问", commission: 45600, orders: 28, target: 85 },
      { name: "王顾问", commission: 38200, orders: 22, target: 78 },
      { name: "张顾问", commission: 32800, orders: 18, target: 72 },
      { name: "刘顾问", commission: 28500, orders: 15, target: 68 },
      { name: "陈顾问", commission: 24200, orders: 12, target: 62 },
      { name: "赵顾问", commission: 17200, orders: 8, target: 55 },
    ],
  },
}

// 居家服务事业部数据
const homeDeptData = {
  // 母婴顾问 - 个人新签佣金及下户、产康佣金额
  maternityConsultant: {
    newSignCommission: 28600,
    serviceCommission: 12800,
    postpartumCommission: 8500,
    monthlyNewSign: 8,
    monthlyService: 6,
  },
  // 部门经理 - 个人、团队佣金总额及明细（区分新签及下户，展示每个组员佣金总数）
  deptManager: {
    personalCommission: { newSign: 35200, service: 18600 },
    teamCommission: { newSign: 186500, service: 98600 },
    teamPostpartumCommission: 68500,
    memberDetails: [
      { name: "周顾问", newSign: 32800, service: 15600, postpartum: 12500, total: 60900 },
      { name: "吴顾问", newSign: 28500, service: 14200, postpartum: 10800, total: 53500 },
      { name: "孙顾问", newSign: 25200, service: 12800, postpartum: 9600, total: 47600 },
      { name: "马顾问", newSign: 22600, service: 11500, postpartum: 8200, total: 42300 },
      { name: "韩顾问", newSign: 18800, service: 9800, postpartum: 6800, total: 35400 },
    ],
  },
  // 事业部总经理 - 团队成员佣金额、所有家政人员薪资支出
  generalManager: {
    teamMemberCommission: 285100,
    allStaffSalary: 568000,
    commissionBreakdown: {
      newSign: 186500,
      service: 98600,
      postpartum: 68500,
    },
  },
}

// 城市分公司数据
const branchData = {
  // 总经理 - 营业额收入、各业务佣金金额、家政人员薪资支出
  yinchuan: {
    revenue: 1286500,
    businessCommission: {
      maternity: 186500,
      infant: 98600,
      postpartum: 68500,
      training: 45200,
    },
    staffSalary: 568000,
    netProfit: 319700,
  },
  xian: {
    revenue: 986500,
    businessCommission: {
      maternity: 156800,
      infant: 78500,
      postpartum: 52600,
      training: 38200,
    },
    staffSalary: 428000,
    netProfit: 232400,
  },
}

// 总公司数据 - 董事长视图
const headquartersData = {
  // 各城市营业额、各业务佣金金额、家政人员薪资支出
  totalRevenue: 2273000,
  cityRevenue: [
    { city: "银川", revenue: 1286500, growth: 18.5 },
    { city: "西安", revenue: 986500, growth: 15.2 },
  ],
  businessCommission: {
    maternity: 343300,
    infant: 177100,
    postpartum: 121100,
    training: 83400,
  },
  totalStaffSalary: 996000,
  totalProfit: 552100,
}

// 城市分公司会计 - 权限同城市分公司总经理
const accountantData = {
  // 与总经理相同权限
  ...branchData,
}

export default function FinanceOverviewPage() {
  const [selectedOrg, setSelectedOrg] = useState("headquarters")
  const [selectedRole, setSelectedRole] = useState("chairman") // consultant | deptManager | generalManager | branchManager | chairman | accountant
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [expandedBranch, setExpandedBranch] = useState<string | null>("YC")

  const roleOptions = [
    { value: "consultant", label: "职业顾问/母婴顾问" },
    { value: "deptManager", label: "部门经理" },
    { value: "generalManager", label: "事业部总经理" },
    { value: "branchManager", label: "分公司总经理" },
    { value: "accountant", label: "分公司会计" },
    { value: "chairman", label: "董事长" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">财务看板</h1>
            <p className="text-sm text-muted-foreground">按组织架构及角色权限查看财务数据</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              导出Excel
            </Button>
          </div>
        </div>

        {/* 根据角色显示不同视图 */}
        {selectedRole === "chairman" && (
          <ChairmanView data={headquartersData} branchData={branchData} expandedBranch={expandedBranch} setExpandedBranch={setExpandedBranch} />
        )}
        {selectedRole === "branchManager" && (
          <BranchManagerView data={branchData.yinchuan} branchName="银川分公司" />
        )}
        {selectedRole === "accountant" && (
          <BranchManagerView data={branchData.yinchuan} branchName="银川分公司" />
        )}
        {selectedRole === "generalManager" && (
          <GeneralManagerView talentData={talentDeptData.deptManager} homeData={homeDeptData.generalManager} />
        )}
        {selectedRole === "deptManager" && (
          <DeptManagerView homeData={homeDeptData.deptManager} />
        )}
        {selectedRole === "consultant" && (
          <ConsultantView talentData={talentDeptData.consultant} maternityData={homeDeptData.maternityConsultant} />
        )}
      </div>
    </AdminLayout>
  )
}

// ==================== 董事长视图 ====================
function ChairmanView({ 
  data, 
  branchData, 
  expandedBranch, 
  setExpandedBranch 
}: { 
  data: typeof headquartersData
  branchData: typeof branchData
  expandedBranch: string | null
  setExpandedBranch: (v: string | null) => void
}) {
  return (
    <div className="space-y-4">
      {/* 总览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-xs text-muted-foreground">各城市营业总额</span>
            </div>
            <p className="text-xl font-bold">¥{(data.totalRevenue / 10000).toFixed(1)}万</p>
            <p className="text-[10px] text-emerald-600 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />+16.8%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-blue-100"><Briefcase className="h-3.5 w-3.5 text-blue-600" /></div>
              <span className="text-xs text-muted-foreground">各业务佣金总额</span>
            </div>
            <p className="text-xl font-bold">¥{((data.businessCommission.maternity + data.businessCommission.infant + data.businessCommission.postpartum + data.businessCommission.training) / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-rose-100"><Users className="h-3.5 w-3.5 text-rose-600" /></div>
              <span className="text-xs text-muted-foreground">家政人员薪资支出</span>
            </div>
            <p className="text-xl font-bold">¥{(data.totalStaffSalary / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-purple-100"><Wallet className="h-3.5 w-3.5 text-purple-600" /></div>
              <span className="text-xs text-muted-foreground">净利润</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">¥{(data.totalProfit / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
      </div>

      {/* 各城市营业额明细 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              各城市营业额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.cityRevenue.map(city => (
                <div key={city.city} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{city.city}分公司</p>
                    <p className="text-xs text-muted-foreground">同比增长 {city.growth}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">¥{(city.revenue / 10000).toFixed(1)}万</p>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">
                      <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />{city.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              各业务佣金分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "月嫂服务", value: data.businessCommission.maternity, color: "bg-rose-500" },
                { name: "育婴服务", value: data.businessCommission.infant, color: "bg-blue-500" },
                { name: "产康服务", value: data.businessCommission.postpartum, color: "bg-teal-500" },
                { name: "培训收入", value: data.businessCommission.training, color: "bg-purple-500" },
              ].map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">¥{(item.value / 10000).toFixed(1)}万</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / data.totalRevenue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 分公司详情展开 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">分公司财务详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { id: "YC", name: "银川分公司", data: branchData.yinchuan },
            { id: "XA", name: "西安分公司", data: branchData.xian },
          ].map(branch => (
            <Collapsible key={branch.id} open={expandedBranch === branch.id} onOpenChange={(open) => setExpandedBranch(open ? branch.id : null)}>
              <CollapsibleTrigger asChild>
                <button type="button" className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {expandedBranch === branch.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{branch.name}</span>
                  </div>
                  <span className="text-sm font-bold">¥{(branch.data.revenue / 10000).toFixed(1)}万</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/20 rounded-lg ml-6">
                  <div className="p-2 bg-background rounded">
                    <p className="text-[10px] text-muted-foreground">营业额</p>
                    <p className="text-sm font-bold">¥{(branch.data.revenue / 10000).toFixed(1)}万</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-[10px] text-muted-foreground">月嫂佣金</p>
                    <p className="text-sm font-bold">¥{(branch.data.businessCommission.maternity / 10000).toFixed(1)}万</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-[10px] text-muted-foreground">薪资支出</p>
                    <p className="text-sm font-bold text-rose-600">¥{(branch.data.staffSalary / 10000).toFixed(1)}万</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-[10px] text-muted-foreground">净利润</p>
                    <p className="text-sm font-bold text-emerald-600">¥{(branch.data.netProfit / 10000).toFixed(1)}万</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== 分公司总经理视图 ====================
function BranchManagerView({ data, branchName }: { data: typeof branchData.yinchuan; branchName: string }) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground mb-1">当前视图</p>
          <p className="font-medium">{branchName} - 总经理/会计</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-xs text-muted-foreground">营业额收入</span>
            </div>
            <p className="text-xl font-bold">¥{(data.revenue / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-blue-100"><Briefcase className="h-3.5 w-3.5 text-blue-600" /></div>
              <span className="text-xs text-muted-foreground">各业务佣金</span>
            </div>
            <p className="text-xl font-bold">¥{((data.businessCommission.maternity + data.businessCommission.infant + data.businessCommission.postpartum) / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-rose-100"><Users className="h-3.5 w-3.5 text-rose-600" /></div>
              <span className="text-xs text-muted-foreground">家政人员薪资</span>
            </div>
            <p className="text-xl font-bold text-rose-600">¥{(data.staffSalary / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-purple-100"><Wallet className="h-3.5 w-3.5 text-purple-600" /></div>
              <span className="text-xs text-muted-foreground">净利润</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">¥{(data.netProfit / 10000).toFixed(1)}万</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">各业务佣金明细</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">业务类型</TableHead>
                <TableHead className="text-xs text-right">佣金金额</TableHead>
                <TableHead className="text-xs text-right">占比</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "月嫂服务", value: data.businessCommission.maternity },
                { name: "育婴服务", value: data.businessCommission.infant },
                { name: "产康服务", value: data.businessCommission.postpartum },
                { name: "培训收入", value: data.businessCommission.training },
              ].map(item => (
                <TableRow key={item.name}>
                  <TableCell className="text-xs font-medium">{item.name}</TableCell>
                  <TableCell className="text-xs text-right">¥{item.value.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground">
                    {((item.value / data.revenue) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== 事业部总经理视图 ====================
function GeneralManagerView({ talentData, homeData }: { talentData: typeof talentDeptData.deptManager; homeData: typeof homeDeptData.generalManager }) {
  return (
    <Tabs defaultValue="talent" className="space-y-4">
      <TabsList className="h-8">
        <TabsTrigger value="talent" className="text-xs">人才孵化事业部</TabsTrigger>
        <TabsTrigger value="home" className="text-xs">居家服务事业部</TabsTrigger>
      </TabsList>

      <TabsContent value="talent" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
                <span className="text-xs text-muted-foreground">事业部总佣金</span>
              </div>
              <p className="text-xl font-bold">¥{talentData.totalCommission.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-blue-100"><Users className="h-3.5 w-3.5 text-blue-600" /></div>
                <span className="text-xs text-muted-foreground">顾问人数</span>
              </div>
              <p className="text-xl font-bold">{talentData.consultantDetails.length}人</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">各职业顾问佣金总额明细</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">顾问姓名</TableHead>
                  <TableHead className="text-xs text-right">佣金金额</TableHead>
                  <TableHead className="text-xs text-right">订单数</TableHead>
                  <TableHead className="text-xs text-right">目标完成</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talentData.consultantDetails.map(item => (
                  <TableRow key={item.name}>
                    <TableCell className="text-xs font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs text-right font-medium text-primary">¥{item.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">{item.orders}单</TableCell>
                    <TableCell className="text-xs text-right">
                      <Badge variant="outline" className={cn("text-[10px]", item.target >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                        {item.target}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="home" className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
                <span className="text-xs text-muted-foreground">团队成员佣金</span>
              </div>
              <p className="text-xl font-bold">¥{homeData.teamMemberCommission.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-rose-100"><Users className="h-3.5 w-3.5 text-rose-600" /></div>
                <span className="text-xs text-muted-foreground">家政人员薪资支出</span>
              </div>
              <p className="text-xl font-bold text-rose-600">¥{(homeData.allStaffSalary / 10000).toFixed(1)}万</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-2">佣金构成</div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span>新签</span><span>¥{homeData.commissionBreakdown.newSign.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>下户</span><span>¥{homeData.commissionBreakdown.service.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>产康</span><span>¥{homeData.commissionBreakdown.postpartum.toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

// ==================== 部门经理视图 ====================
function DeptManagerView({ homeData }: { homeData: typeof homeDeptData.deptManager }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
              <span className="text-xs text-muted-foreground">个人新签佣金</span>
            </div>
            <p className="text-xl font-bold">¥{homeData.personalCommission.newSign.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-blue-100"><Home className="h-3.5 w-3.5 text-blue-600" /></div>
              <span className="text-xs text-muted-foreground">个人下户佣金</span>
            </div>
            <p className="text-xl font-bold">¥{homeData.personalCommission.service.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-purple-100"><Briefcase className="h-3.5 w-3.5 text-purple-600" /></div>
              <span className="text-xs text-muted-foreground">团队新签佣金</span>
            </div>
            <p className="text-xl font-bold">¥{homeData.teamCommission.newSign.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-teal-100"><Home className="h-3.5 w-3.5 text-teal-600" /></div>
              <span className="text-xs text-muted-foreground">团队下户佣金</span>
            </div>
            <p className="text-xl font-bold">¥{homeData.teamCommission.service.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">团队成员佣金明细（区分新签及下户）</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">成员</TableHead>
                <TableHead className="text-xs text-right">新签佣金</TableHead>
                <TableHead className="text-xs text-right">下户佣金</TableHead>
                <TableHead className="text-xs text-right">产康佣金</TableHead>
                <TableHead className="text-xs text-right">合计</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeData.memberDetails.map(member => (
                <TableRow key={member.name}>
                  <TableCell className="text-xs font-medium">{member.name}</TableCell>
                  <TableCell className="text-xs text-right">¥{member.newSign.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right">¥{member.service.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right">¥{member.postpartum.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right font-medium text-primary">¥{member.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== 顾问视图 ====================
function ConsultantView({ talentData, maternityData }: { talentData: typeof talentDeptData.consultant; maternityData: typeof homeDeptData.maternityConsultant }) {
  return (
    <Tabs defaultValue="talent" className="space-y-4">
      <TabsList className="h-8">
        <TabsTrigger value="talent" className="text-xs">职业顾问</TabsTrigger>
        <TabsTrigger value="maternity" className="text-xs">母婴顾问</TabsTrigger>
      </TabsList>

      <TabsContent value="talent" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
                <span className="text-xs text-muted-foreground">个人佣金数</span>
              </div>
              <p className="text-xl font-bold">¥{talentData.personalCommission.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">本月{talentData.monthlyOrders}单，平均¥{talentData.avgCommission}/单</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-rose-100"><Users className="h-3.5 w-3.5 text-rose-600" /></div>
                <span className="text-xs text-muted-foreground">所属家政人员薪资</span>
              </div>
              <p className="text-xl font-bold">¥{talentData.personalStaffSalary.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* 按学员展示佣金总数 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              个人及团队佣金总额明细（按学员展示）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">学员姓名</TableHead>
                  <TableHead className="text-xs">报名课程</TableHead>
                  <TableHead className="text-xs text-right">佣金金额</TableHead>
                  <TableHead className="text-xs">报名日期</TableHead>
                  <TableHead className="text-xs">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talentData.studentCommissions.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{item.studentName}</TableCell>
                    <TableCell className="text-xs">{item.courseName}</TableCell>
                    <TableCell className="text-xs text-right font-medium text-primary">¥{item.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.enrollDate}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className={cn("text-[10px]", item.status === "已结算" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 所属家政人员薪资额明细 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-rose-500" />
              个人所属家政人员薪资额明细
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">家政人员</TableHead>
                  <TableHead className="text-xs">服务类型</TableHead>
                  <TableHead className="text-xs">当前订单</TableHead>
                  <TableHead className="text-xs text-right">薪资金额</TableHead>
                  <TableHead className="text-xs">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talentData.staffSalaryDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{item.staffName}</TableCell>
                    <TableCell className="text-xs">{item.serviceType}</TableCell>
                    <TableCell className="text-xs">{item.currentOrder}</TableCell>
                    <TableCell className="text-xs text-right font-medium">¥{item.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className={cn("text-[10px]", item.status === "服务中" ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600")}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="maternity" className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-emerald-100"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /></div>
                <span className="text-xs text-muted-foreground">个人新签佣金及下户</span>
              </div>
              <p className="text-xl font-bold">¥{maternityData.newSignCommission.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">新签{maternityData.monthlyNewSign}单 · 下户{maternityData.monthlyService}单</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-teal-100"><Home className="h-3.5 w-3.5 text-teal-600" /></div>
                <span className="text-xs text-muted-foreground">产康佣金额</span>
              </div>
              <p className="text-xl font-bold">¥{maternityData.postpartumCommission.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-blue-100"><CreditCard className="h-3.5 w-3.5 text-blue-600" /></div>
                <span className="text-xs text-muted-foreground">下户服务佣金</span>
              </div>
              <p className="text-xl font-bold">¥{maternityData.serviceCommission.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
