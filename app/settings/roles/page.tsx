"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Settings, 
  Eye, 
  Pencil, 
  Trash2,
  Monitor,
  Smartphone,
  UserCog,
  Building2,
  HeartHandshake,
  GraduationCap,
  Wallet,
  Headphones,
  TrendingUp,
  CheckCircle2,
  ChevronRight
} from "lucide-react"
// 角色类型定义
interface Role {
  id: number
  name: string
  description: string
  userCount: number
  type: string
  category?: string
  permissions: string[]
}

const roleTypeColors: Record<string, string> = {
  system: "bg-amber-50 text-amber-700 border-amber-200",
  business: "bg-blue-50 text-blue-700 border-blue-200",
  custom: "bg-purple-50 text-purple-700 border-purple-200",
  default: "bg-gray-50 text-gray-600 border-gray-200",
  vip: "bg-amber-50 text-amber-700 border-amber-200",
  enterprise: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-gray-50 text-gray-600 border-gray-200",
  certified: "bg-blue-50 text-blue-700 border-blue-200",
  gold: "bg-amber-50 text-amber-700 border-amber-200",
}

const roleTypeLabels: Record<string, string> = {
  system: "系统",
  business: "业务",
  custom: "自定义",
  default: "默认",
  vip: "VIP",
  enterprise: "企业",
  pending: "待认证",
  certified: "已认证",
  gold: "金牌",
}

const categoryIcons: Record<string, typeof UserCog> = {
  management: UserCog,
  operations: Settings,
  sales: TrendingUp,
  finance: Wallet,
  education: GraduationCap,
  service: Headphones,
  analytics: TrendingUp,
}

// 角色项组件
function RoleItem({ 
  role, 
  selectedRole, 
  setSelectedRole 
}: { 
  role: Role
  selectedRole: number | null
  setSelectedRole: (id: number) => void 
}) {
  const CategoryIcon = role.category ? categoryIcons[role.category] : Shield
  return (
    <div 
      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
        selectedRole === role.id 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/30 hover:bg-muted/50'
      }`}
      onClick={() => setSelectedRole(role.id)}
    >
      <div className={`p-1.5 rounded-md ${role.type === "system" || role.type === "gold" ? "bg-amber-100" : "bg-primary/10"} flex-shrink-0`}>
        {CategoryIcon && <CategoryIcon className={`h-3.5 w-3.5 ${role.type === "system" || role.type === "gold" ? "text-amber-600" : "text-primary"}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground text-sm truncate">{role.name}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${roleTypeColors[role.type]}`}>
            {roleTypeLabels[role.type]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{role.description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Users className="h-3 w-3" />
        <span className="tabular-nums">{role.userCount.toLocaleString()}</span>
      </div>
    </div>
  )
}

// 三个端的定义
const platforms = [
  { 
    key: "admin",
    name: "管理后台",
    icon: Monitor,
    description: "内部员工使用的管理系统",
    color: "bg-blue-500"
  },
  { 
    key: "employer",
    name: "雇主端",
    icon: Building2,
    description: "雇主客户使用的小程序/App",
    color: "bg-emerald-500"
  },
  { 
    key: "caregiver",
    name: "家政员端",
    icon: HeartHandshake,
    description: "服务人员使用的小程序/App",
    color: "bg-rose-500"
  },
]

// 后台管理角色 - 按类别分组
// 系统角色
const systemRoles = [
  { 
    id: 1,
    name: "超级管理员",
    description: "拥有系统全部权限",
    userCount: 2,
    type: "system",
    category: "management",
    permissions: ["all"]
  },
]

// 6个核心业务角色
const businessRoles = [
  { 
    id: 2,
    name: "运营主管",
    description: "管理月嫂、育婴师、产康师档案和排班",
    userCount: 3,
    type: "business",
    category: "operations",
    permissions: ["staff", "scheduling", "workorders"]
  },
  { 
    id: 3,
    name: "销售顾问",
    description: "客户线索跟进、面试安排和签约",
    userCount: 8,
    type: "business",
    category: "sales",
    permissions: ["leads", "interviews", "contracts_create"]
  },
  { 
    id: 4,
    name: "财务人员",
    description: "收支流水、薪资结算和财务报表",
    userCount: 2,
    type: "business",
    category: "finance",
    permissions: ["transactions", "payroll", "reports"]
  },
  { 
    id: 5,
    name: "培训讲师",
    description: "管理培训班级、学员和课程",
    userCount: 4,
    type: "business",
    category: "education",
    permissions: ["classes", "students", "courses"]
  },
  { 
    id: 6,
    name: "客服专员",
    description: "处理客户咨询、投诉和售后",
    userCount: 5,
    type: "business",
    category: "service",
    permissions: ["tickets", "customers_view", "orders_view"]
  },
]

// 其他职能角色
const customRoles = [
  { 
    id: 7,
    name: "区域经理",
    description: "管理指定区域的业务和团队",
    userCount: 2,
    type: "custom",
    category: "management",
    permissions: ["area_management", "reports_view"]
  },
  { 
    id: 8,
    name: "数据分析师",
    description: "查看和分析业务数据报表",
    userCount: 1,
    type: "custom",
    category: "analytics",
    permissions: ["reports", "analytics"]
  },
]

// 合并所有后台角色
const adminRoles = [...systemRoles, ...businessRoles, ...customRoles]

// 雇主端角色
const employerRoles = [
  { 
    id: 101,
    name: "普通雇主",
    description: "基础功能：浏览服务、预约面试、下单签约",
    userCount: 1250,
    type: "default",
    permissions: ["browse", "booking", "orders_self"]
  },
  { 
    id: 102,
    name: "VIP雇主",
    description: "享受优先匹配、专属顾问和会员优惠",
    userCount: 86,
    type: "vip",
    permissions: ["browse", "booking", "orders_self", "vip_benefits"]
  },
  { 
    id: 103,
    name: "企业客户",
    description: "企业批量采购服务，独立账户管理",
    userCount: 12,
    type: "enterprise",
    permissions: ["browse", "booking", "batch_orders", "invoice"]
  },
]

// 家政员端角色
const caregiverRoles = [
  { 
    id: 201,
    name: "待认证阿姨",
    description: "已注册但未完成资质认证",
    userCount: 156,
    type: "pending",
    permissions: ["profile_edit", "training_view"]
  },
  { 
    id: 202,
    name: "认证月嫂",
    description: "通过月嫂资质认证，可接月嫂订单",
    userCount: 89,
    type: "certified",
    permissions: ["orders_accept", "schedule_view", "income_view"]
  },
  { 
    id: 203,
    name: "认证育婴师",
    description: "通过育婴师资质认证，可接育婴订单",
    userCount: 67,
    type: "certified",
    permissions: ["orders_accept", "schedule_view", "income_view"]
  },
  { 
    id: 204,
    name: "认证产康师",
    description: "通过产康技师资质认证，可接产康服务",
    userCount: 34,
    type: "certified",
    permissions: ["orders_accept", "schedule_view", "income_view"]
  },
  { 
    id: 205,
    name: "金牌服务师",
    description: "评级达到金牌标准，优先派单和更高薪资",
    userCount: 28,
    type: "gold",
    permissions: ["orders_accept", "schedule_view", "income_view", "priority_matching"]
  },
]

// 权限组定义
const permissionGroups = {
  admin: [
    {
      name: "SCRM客户管理",
      key: "scrm",
      items: [
        { key: "leads_view", label: "查看线索", description: "查看客户线索列表" },
        { key: "leads_edit", label: "编辑线索", description: "添加和修改线索信息" },
        { key: "leads_assign", label: "分配线索", description: "将线索分配给销售顾问" },
        { key: "customers_view", label: "查看客户", description: "查看已成交客户" },
        { key: "customers_edit", label: "编辑客户", description: "修改客户信息" },
      ]
    },
    {
      name: "订单管理",
      key: "orders",
      items: [
        { key: "orders_view", label: "查看订单", description: "查看订单列表和详情" },
        { key: "orders_create", label: "创建订单", description: "创建新订单" },
        { key: "orders_edit", label: "编辑订单", description: "修改订单信息" },
        { key: "orders_cancel", label: "取消订单", description: "取消和退款订单" },
      ]
    },
    {
      name: "运营管理",
      key: "operations",
      items: [
        { key: "staff_view", label: "查看人员", description: "查看服务人员档案" },
        { key: "staff_edit", label: "编辑人员", description: "管理服务人员信息" },
        { key: "scheduling", label: "排班管理", description: "安排服务人员工作" },
        { key: "workorders", label: "工单管理", description: "处理服务工单" },
      ]
    },
    {
      name: "财务管理",
      key: "finance",
      items: [
        { key: "transactions_view", label: "查看流水", description: "查看收支记录" },
        { key: "transactions_edit", label: "财务操作", description: "记账和调账" },
        { key: "payroll_view", label: "查看薪资", description: "查看薪资计算" },
        { key: "payroll_approve", label: "薪资审批", description: "审批薪资发放" },
      ]
    },
    {
      name: "培训管理",
      key: "education",
      items: [
        { key: "classes_view", label: "查看班级", description: "查看培训班级" },
        { key: "classes_edit", label: "管理班级", description: "创建和管理班级" },
        { key: "students_view", label: "查看学员", description: "查看学员信息" },
        { key: "students_edit", label: "管理学员", description: "学员报名和管理" },
      ]
    },
    {
      name: "系统设置",
      key: "settings",
      items: [
        { key: "employees", label: "员工管理", description: "管理后台用户" },
        { key: "roles", label: "角色权限", description: "配置角色和权限" },
        { key: "config", label: "系统配置", description: "系统参数设置" },
      ]
    },
  ],
  employer: [
    {
      name: "基础功能",
      key: "basic",
      items: [
        { key: "browse", label: "浏览服务", description: "查看服务项目和人员" },
        { key: "booking", label: "预约面试", description: "预约与服务人员面试" },
        { key: "orders_self", label: "我的订单", description: "查看和管理自己的订单" },
      ]
    },
    {
      name: "会员权益",
      key: "vip",
      items: [
        { key: "vip_benefits", label: "会员优惠", description: "享受会员专属折扣" },
        { key: "priority_service", label: "优先服务", description: "优先匹配和响应" },
        { key: "exclusive_consultant", label: "专属顾问", description: "一对一顾问服务" },
      ]
    },
  ],
  caregiver: [
    {
      name: "个人中心",
      key: "profile",
      items: [
        { key: "profile_view", label: "查看档案", description: "查看个人信息" },
        { key: "profile_edit", label: "编辑档案", description: "修改个人资料" },
        { key: "certification", label: "资质认证", description: "提交认证申请" },
      ]
    },
    {
      name: "工作管理",
      key: "work",
      items: [
        { key: "orders_accept", label: "接单", description: "查看和接受工作订单" },
        { key: "schedule_view", label: "排班查看", description: "查看工作安排" },
        { key: "income_view", label: "收入查看", description: "查看薪资和收入" },
      ]
    },
    {
      name: "培训学习",
      key: "training",
      items: [
        { key: "training_view", label: "培训课程", description: "查看可报名课程" },
        { key: "training_apply", label: "报名培训", description: "申请培训课程" },
      ]
    },
  ],
}

export default function RolesPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("admin")
  const [selectedRole, setSelectedRole] = useState<number | null>(1)

  const getRoles = () => {
    switch (selectedPlatform) {
      case "admin":
        return adminRoles
      case "employer":
        return employerRoles
      case "caregiver":
        return caregiverRoles
      default:
        return adminRoles
    }
  }

  const getPermissionGroups = () => {
    return permissionGroups[selectedPlatform as keyof typeof permissionGroups] || []
  }

  const currentRoles = getRoles()
  const currentRole = currentRoles.find(r => r.id === selectedRole)
  const currentPermissions = getPermissionGroups()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">角色与权限</h1>
            <p className="text-muted-foreground">管理三端用户角色和功能权限配置</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建角色
          </Button>
        </div>

        {/* Platform Tabs */}
        <div className="grid grid-cols-3 gap-3">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isActive = selectedPlatform === platform.key
            return (
              <Card 
                key={platform.key}
                className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'}`}
                onClick={() => {
                  setSelectedPlatform(platform.key)
                  setSelectedRole(platform.key === "admin" ? 1 : platform.key === "employer" ? 101 : 201)
                }}
              >
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${platform.color} text-white flex-shrink-0`}>
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm lg:text-base text-foreground truncate">{platform.name}</p>
                      <p className="text-xs text-muted-foreground truncate hidden sm:block">{platform.description}</p>
                    </div>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {platforms.find(p => p.key === selectedPlatform)?.name}角色
                </CardTitle>
                <CardDescription className="text-xs">
                  共 {currentRoles.length} 个角色，{currentRoles.reduce((sum, r) => sum + r.userCount, 0).toLocaleString()} 位用户
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  <div className="p-3 space-y-4">
                    {/* 管理后台按分类显示 */}
                    {selectedPlatform === "admin" && (
                      <>
                        {/* 系统角色 */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            系统角色
                          </div>
                          <div className="space-y-1.5">
                            {systemRoles.map((role) => (
                              <RoleItem key={role.id} role={role} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                            ))}
                          </div>
                        </div>
                        {/* 业务角色 */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
                            <Settings className="h-3 w-3" />
                            业务角色
                          </div>
                          <div className="space-y-1.5">
                            {businessRoles.map((role) => (
                              <RoleItem key={role.id} role={role} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                            ))}
                          </div>
                        </div>
                        {/* 自定义角色 */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
                            <UserCog className="h-3 w-3" />
                            自定义角色
                          </div>
                          <div className="space-y-1.5">
                            {customRoles.map((role) => (
                              <RoleItem key={role.id} role={role} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {/* 雇主端和家政员端不分组显示 */}
                    {selectedPlatform !== "admin" && (
                      <div className="space-y-1.5">
                        {currentRoles.map((role) => (
                          <RoleItem key={role.id} role={role} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Permission Config */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 flex-row items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base font-semibold truncate">{currentRole?.name || "选择角色"}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{currentRole?.description || "请从左侧选择一个角色查看权限配置"}</p>
              </div>
              {currentRole && currentRole.type !== "system" && (
                <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                  <Edit className="h-4 w-4 mr-1.5" />
                  编辑
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {currentRole?.type === "system" ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-amber-500 mb-3" />
                  <p className="text-sm text-muted-foreground">超级管理员拥有系统全部权限</p>
                  <p className="text-xs text-muted-foreground mt-1">此角色权限不可修改</p>
                </div>
              ) : (
                <ScrollArea className="h-[380px] pr-4">
                  <div className="space-y-5">
                    {currentPermissions.map((group) => (
                      <div key={group.key}>
                        <h4 className="font-medium text-foreground text-sm mb-2.5 flex items-center gap-2">
                          <span className="w-1 h-4 bg-primary rounded-full" />
                          {group.name}
                        </h4>
                        <div className="space-y-2">
                          {group.items.map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                              <div className="min-w-0 flex-1 mr-3">
                                <span className="text-sm text-foreground">{item.label}</span>
                                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                              </div>
                              <Switch 
                                defaultChecked={
                                  currentRole?.permissions.includes("all") || 
                                  currentRole?.permissions.includes(item.key) ||
                                  currentRole?.permissions.some(p => item.key.startsWith(p))
                                } 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
