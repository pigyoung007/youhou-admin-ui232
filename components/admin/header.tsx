"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const breadcrumbsMap: Record<string, { label: string; href?: string }[]> = {
    "/": [{ label: "首页" }, { label: "工作台" }],
    "/scrm/leads": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "客户线索公海池" }],
    "/scrm/customers": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "客户管理" }],
    "/scrm/customers/sea": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "公海客户" }],
    "/scrm/customers/team": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "团队客户" }],
    "/scrm/customers/mine": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "我的客户" }],
    "/scrm/followup": [{ label: "首页", href: "/" }, { label: "SCRM" }, { label: "跟进记录" }],
    "/operations/nanny": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "月嫂管理" }],
    "/operations/nanny/scheduling": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "月嫂排班" }],
    "/operations/infant-care": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "育婴师管理" }],
    "/operations/infant-care/scheduling": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "育婴师排班" }],
    "/operations/tech": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "产康技师" }],
    "/operations/scheduling": [{ label: "首页", href: "/" }, { label: "业务中心" }, { label: "产康排班" }],
    "/operations/workorders": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "服务工单" }],
    "/operations/supplies": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "耗材管理" }],
    "/business/projects": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "项目管理" }],
    "/business/services": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "服务内容" }],
    "/business/pricing": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "价格体系" }],
    "/business/packages": [{ label: "首页", href: "/" }, { label: "运营中心" }, { label: "套餐管理" }],
    "/contracts/list": [{ label: "首页", href: "/" }, { label: "合同中心" }, { label: "合同管理" }],
    "/contracts/templates": [{ label: "首页", href: "/" }, { label: "合同中心" }, { label: "合同模板" }],
    "/contracts/pending": [{ label: "首页", href: "/" }, { label: "合同中心" }, { label: "待签合同" }],
    "/contracts/insurance": [{ label: "首页", href: "/" }, { label: "合同中心" }, { label: "保险管理" }],
    "/contracts/amendments": [{ label: "首页", href: "/" }, { label: "合同中心" }, { label: "合同变更" }],
    "/education/students": [{ label: "首页", href: "/" }, { label: "培训学院" }, { label: "学员管理" }],
    "/education/courses": [{ label: "首页", href: "/" }, { label: "培训学院" }, { label: "课程管理" }],
    "/education/transfer": [{ label: "首页", href: "/" }, { label: "培训学院" }, { label: "学员转化" }],
    "/orders": [{ label: "首页", href: "/" }, { label: "订单中心" }],
    "/finance/payroll": [{ label: "首页", href: "/" }, { label: "财务管理" }, { label: "薪资结算" }],
    "/finance/salary-engine": [{ label: "首页", href: "/" }, { label: "财务管理" }, { label: "薪资结算引擎" }],
    "/finance/billing": [{ label: "首页", href: "/" }, { label: "财务管理" }, { label: "账单管理" }],
    "/finance/reports": [{ label: "首页", href: "/" }, { label: "财务管理" }, { label: "财务报表" }],
    "/inventory": [{ label: "首页", href: "/" }, { label: "库存管理" }],
    "/family-service/orders": [{ label: "首页", href: "/" }, { label: "家庭服务" }, { label: "服务订单" }],
  }
  return breadcrumbsMap[pathname] || [{ label: "首页" }]
}

export function Header() {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm ml-12 md:ml-0">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索..." className="w-64 pl-9 bg-secondary border-0 focus-visible:ring-1" />
        </div>

        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">新线索待分配</span>
              <span className="text-xs text-muted-foreground">5分钟前 · 来自美团推广</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">薪资审核提醒</span>
              <span className="text-xs text-muted-foreground">1小时前 · 15笔待审核</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">排班冲突提醒</span>
              <span className="text-xs text-muted-foreground">2小时前 · 王美丽时间冲突</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">管</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">管理员</p>
                <p className="text-xs text-muted-foreground">admin@youhou.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人设置</DropdownMenuItem>
            <DropdownMenuItem>系统设置</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
