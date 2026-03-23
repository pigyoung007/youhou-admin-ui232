"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  ShoppingCart,
  Wallet,
  Package,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCog,
  Shield,
  Bell,
  Calendar,
  Heart,
  Phone,
  ClipboardList,
  TrendingUp,
  CreditCard,
  BarChart3,
  Award,
  BookOpen,
  UserPlus,
  Megaphone,
  MessageSquare,
  FileSignature,
  AlertTriangle,
  Clock,
  Target,
  Layers,
  Menu,
  X,
  Baby,
  Boxes,
  Tag,
  Wrench,
  Receipt,
  Star,
  RefreshCw,
  ArrowDownUp,
  Banknote,
  PieChart,
  Gift,
  BookCopy,
  Database,
  Store,
  BadgeCheck,
} from "lucide-react"

interface SubChild {
  id: string
  label: string
  href: string
  icon?: React.ElementType
  badge?: string | number
  badgeVariant?: "default" | "destructive" | "warning"
}

interface ChildItem {
  id: string
  label: string
  href?: string
  icon?: React.ElementType
  badge?: string | number
  badgeVariant?: "default" | "destructive" | "warning"
  children?: SubChild[]
}

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  badge?: string | number
  badgeVariant?: "default" | "destructive" | "warning"
  children?: ChildItem[]
}

const menuItems: MenuItem[] = [
  // 1. 工作台
  { id: "dashboard", label: "工作台", icon: LayoutDashboard, href: "/" },

  // 2. SCRM客户管理（按需求文档2.1-2.7）
  {
    id: "scrm",
    label: "SCRM客户管理",
    icon: Users,
    children: [
      { id: "leads", label: "线索池", href: "/scrm/leads", icon: Target, badge: 28 },
      { id: "customers-sea", label: "公海客户", href: "/scrm/customers/sea", icon: Users, badge: 15 },
      { id: "customers-team", label: "团队客户", href: "/scrm/customers/team", icon: UserCheck },
      { id: "customers-mine", label: "我的客户", href: "/scrm/customers/mine", icon: Heart },
      { id: "followup", label: "跟进记录", href: "/scrm/followup", icon: MessageSquare },
      { id: "daily-logs", label: "员工日志", href: "/scrm/daily-logs", icon: ClipboardList },
      { id: "complaints", label: "客诉库", href: "/scrm/complaints", icon: AlertTriangle, badge: 5, badgeVariant: "destructive" },
    ],
  },

  // 3. 培训学院（按需求文档3.1-3.6）
  {
    id: "education",
    label: "培训学院",
    icon: GraduationCap,
    children: [
      { id: "students", label: "学员管理", href: "/education/students", icon: Users },
      { id: "courses", label: "课程管理", href: "/education/courses", icon: BookOpen },
      {
        id: "exams",
        label: "考试管理（待建）",
        icon: ClipboardList,
        children: [
          { id: "question-bank", label: "题库管理", href: "/education/question-bank", icon: Database },
          { id: "online-exam", label: "在线考试", href: "/education/exams", icon: ClipboardList },
        ],
      },
      { id: "certificates", label: "证书管理", href: "/education/certificates", icon: Award },
      { id: "certificate-collection", label: "证书领取", href: "/education/certificate-collection", icon: BadgeCheck },
      { id: "textbooks", label: "培训物料领取", href: "/education/textbooks", icon: BookCopy },
      { id: "training-orders", label: "培训订单", href: "/education/orders", icon: ShoppingCart },
    ],
  },

  // 4. 家庭服务（按需求文档4.1-4.6）
  {
    id: "family-service",
    label: "家庭服务",
    icon: Heart,
    children: [
      { id: "nanny", label: "家政员管理", href: "/family-service/nanny", icon: Heart },
      { id: "rehab-tech", label: "产康技师", href: "/family-service/rehab-technician", icon: UserCog },
      { id: "appointments", label: "服务预约（产康待建）", href: "/family-service/appointments", icon: Calendar, badge: 3, badgeVariant: "warning" },
      { id: "scheduling", label: "档期排班", href: "/family-service/scheduling", icon: Clock },
      { id: "service-orders", label: "服务订单", href: "/family-service/orders", icon: ShoppingCart },
      { id: "materials", label: "上户物料领取", href: "/family-service/materials", icon: Package },
      { id: "checkin", label: "上下户打卡与日志", href: "/family-service/checkin", icon: Clock },
    ],
  },

  // 5. 合同中心（按需求文档5.1-5.4）
  {
    id: "contracts",
    label: "合同中心",
    icon: FileText,
    children: [
      { id: "contract-list", label: "合同管理", href: "/contracts/list", icon: FileSignature },
      { id: "templates", label: "合同模板", href: "/contracts/templates", icon: Layers },
      { id: "pending", label: "待签合同", href: "/contracts/pending", icon: Clock, badge: 8, badgeVariant: "warning" },
      { id: "insurance", label: "保险管理", href: "/contracts/insurance", icon: Shield, badge: 3, badgeVariant: "destructive" },
    ],
  },

  // 6. 运营中心（按需求文档6.1-6.5）
  {
    id: "operations",
    label: "运营中心",
    icon: BarChart3,
    children: [
      { id: "dashboard", label: "数据看板", href: "/operations/dashboard", icon: PieChart },
      { id: "tags", label: "标签组管理", href: "/operations/tags", icon: Tag },
      { id: "products", label: "产品及服务管理", href: "/operations/products", icon: Package },
      { id: "points", label: "积分管理", href: "/operations/points", icon: Award },
      { id: "evaluation", label: "服务评价", href: "/operations/evaluation", icon: Star },
    ],
  },

  // 7. 财务管理（按需求文档7.1-7.4）
  {
    id: "finance",
    label: "财务管理",
    icon: Wallet,
    children: [
      { id: "overview", label: "财务概览", href: "/finance/overview", icon: BarChart3 },
      { id: "invoices", label: "发票管理", href: "/finance/invoices", icon: Receipt },
      {
        id: "payroll",
        label: "薪资结算",
        icon: CreditCard,
        children: [
          { id: "payroll-overview", label: "结算总览", href: "/finance/payroll", icon: BarChart3 },
          { id: "payroll-consultant", label: "顾问薪资", href: "/finance/payroll/consultant", icon: UserCheck },
          { id: "payroll-technician", label: "技师薪资", href: "/finance/payroll/technician", icon: UserCog },
          { id: "payroll-commission", label: "佣金结算", href: "/finance/payroll/commission", icon: Banknote },
        ],
      },
      { id: "salary-engine", label: "薪资引擎", href: "/finance/salary-engine", icon: Settings },
    ],
  },

  // 8. 库存管理（按需求文档8.1-8.5）
  {
    id: "inventory",
    label: "库存管理（待建）",
    icon: Package,
    children: [
      { id: "materials", label: "物料库存", href: "/inventory/materials", icon: Package },
      { id: "purchase", label: "采购申请", href: "/inventory/purchase", icon: ShoppingCart },
      { id: "records", label: "出入库记录", href: "/inventory/records", icon: ClipboardList },
      { id: "alerts", label: "库存预警", href: "/inventory/alerts", icon: AlertTriangle, badge: 6, badgeVariant: "destructive" },
      { id: "consumables", label: "耗材管理", href: "/inventory/consumables", icon: Boxes },
    ],
  },

  // 9. 系统管理（按需求文档9.1-9.4）
  {
    id: "settings",
    label: "系统管理",
    icon: Settings,
    children: [
      { id: "organization", label: "组织管理", href: "/system/organization", icon: Building2 },
      { id: "permissions", label: "权限管理", href: "/settings/permissions", icon: Shield },
      { id: "notifications", label: "通知设置", href: "/settings/notifications", icon: Bell },
      { id: "config", label: "基础信息配置", href: "/settings/config", icon: Settings },
    ],
  },

  // 10. 租户管理（按需求文档10.1-10.2）
  {
    id: "tenant",
    label: "租户管理",
    icon: Building2,
    children: [
      { id: "institutions", label: "机构租户", href: "/tenant/institutions", icon: Store },
      { id: "private", label: "私单月嫂", href: "/tenant/private", icon: Heart },
    ],
  },
]

function getActiveItems(pathname: string): { parentId: string; childId: string; subChildId: string } {
  for (const item of menuItems) {
    if (item.href === pathname) {
      return { parentId: item.id, childId: "", subChildId: "" }
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.href === pathname) {
          return { parentId: item.id, childId: child.id, subChildId: "" }
        }
        if (child.children) {
          for (const sub of child.children) {
            if (sub.href === pathname) {
              return { parentId: item.id, childId: child.id, subChildId: sub.id }
            }
          }
        }
      }
    }
  }
  // prefix match
  for (const item of menuItems) {
    if (item.children) {
      for (const child of item.children) {
        if (child.children) {
          for (const sub of child.children) {
            if (pathname.startsWith(sub.href + "/")) {
              return { parentId: item.id, childId: child.id, subChildId: sub.id }
            }
          }
        }
        if (child.href && pathname.startsWith(child.href + "/")) {
          return { parentId: item.id, childId: child.id, subChildId: "" }
        }
      }
    }
  }
  return { parentId: "dashboard", childId: "", subChildId: "" }
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { parentId, childId, subChildId } = getActiveItems(pathname)
  const [expandedParents, setExpandedParents] = useState<string[]>([parentId])
  const [expandedChildren, setExpandedChildren] = useState<string[]>(childId ? [childId] : [])

useEffect(() => {
  setExpandedParents((prev) => {
    if (parentId && !prev.includes(parentId)) {
      return [...prev, parentId]
    }
    return prev
  })
  setExpandedChildren((prev) => {
    if (childId && !prev.includes(childId)) {
      return [...prev, childId]
    }
    return prev
  })
  }, [parentId, childId])

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleChild = (id: string) => {
    setExpandedChildren((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground">优</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">优厚家庭服务</span>
          <span className="text-xs text-sidebar-foreground/60">管理后台</span>
        </div>
      </div>

      {/* Menu Items - Scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === parentId
            const isExpanded = expandedParents.includes(item.id)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.id}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleParent(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <span className="text-sidebar-foreground/50 shrink-0">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href || "/"}
                    onClick={onNavigate}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  </Link>
                )}

                {/* Level-2 Submenu */}
                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-3 space-y-0.5 border-l border-sidebar-border/50 pl-3">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon
                      const isChildActive = child.id === childId
                      const hasSubChildren = child.children && child.children.length > 0
                      const isChildExpanded = expandedChildren.includes(child.id)

                      if (hasSubChildren) {
                        return (
                          <div key={child.id}>
                            <button
                              onClick={() => toggleChild(child.id)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                                isChildActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground",
                              )}
                            >
                              {ChildIcon && <ChildIcon className="h-3.5 w-3.5 shrink-0" />}
                              <span className="flex-1 text-left truncate">{child.label}</span>
                              {child.badge && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "h-5 min-w-5 px-1.5 text-xs justify-center shrink-0",
                                    child.badgeVariant === "warning" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                    child.badgeVariant === "destructive" && "bg-red-500/20 text-red-400 border-red-500/30",
                                    !child.badgeVariant && "bg-sidebar-accent text-sidebar-foreground/70"
                                  )}
                                >
                                  {child.badge}
                                </Badge>
                              )}
                              <span className="text-sidebar-foreground/40 shrink-0">
                                {isChildExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              </span>
                            </button>
                            {/* Level-3 Submenu */}
                            {isChildExpanded && (
                              <div className="mt-0.5 ml-3 space-y-0.5 border-l border-sidebar-border/30 pl-2.5">
                                {child.children?.map((sub) => {
                                  const SubIcon = sub.icon
                                  const isSubActive = sub.id === subChildId
                                  return (
                                    <Link
                                      key={sub.id}
                                      href={sub.href}
                                      onClick={onNavigate}
                                      className={cn(
                                        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors",
                                        isSubActive
                                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                          : "text-sidebar-foreground/50 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground",
                                      )}
                                    >
                                      {SubIcon && <SubIcon className="h-3 w-3 shrink-0" />}
                                      <span className="flex-1 truncate">{sub.label}</span>
                                      {sub.badge && (
                                        <Badge
                                          variant="secondary"
                                          className={cn(
                                            "h-4 min-w-4 px-1 text-[10px] justify-center shrink-0",
                                            sub.badgeVariant === "warning" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                            sub.badgeVariant === "destructive" && "bg-red-500/20 text-red-400 border-red-500/30",
                                          )}
                                        >
                                          {sub.badge}
                                        </Badge>
                                      )}
                                    </Link>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={child.id}
                          href={child.href || "#"}
                          onClick={onNavigate}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground",
                          )}
                        >
                          {ChildIcon && <ChildIcon className="h-3.5 w-3.5 shrink-0" />}
                          <span className="flex-1 truncate">{child.label}</span>
                          {child.badge && (
                            <Badge
                              variant={child.badgeVariant === "destructive" ? "destructive" : "secondary"}
                              className={cn(
                                "h-5 min-w-5 px-1.5 text-xs justify-center shrink-0",
                                child.badgeVariant === "warning" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                child.badgeVariant === "destructive" && "bg-red-500/20 text-red-400 border-red-500/30",
                                !child.badgeVariant && "bg-sidebar-accent text-sidebar-foreground/70"
                              )}
                            >
                              {child.badge}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          <p>优厚家庭服务 v2.0</p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-50 h-10 w-10 bg-sidebar text-sidebar-foreground shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-sidebar-foreground/70 hover:text-sidebar-foreground z-10"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-60 flex-col fixed left-0 top-0 z-40 overflow-hidden">
        <SidebarContent />
      </aside>
    </>
  )
}
