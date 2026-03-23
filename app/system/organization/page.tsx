"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Building2, Users, ChevronDown, ChevronRight, Eye, MessageSquare,
  MoreHorizontal, Phone, Mail
} from "lucide-react"

// 组织架构数据类型
interface OrgNode {
  id: string
  name: string
  type: "company" | "department"
  parentId?: string
  employeeCount: number
  children?: OrgNode[]
}

// 员工数据类型
interface Employee {
  id: string
  name: string
  employeeNo: string
  department: string
  position: string
  phone: string
  email: string
  status: "active" | "trial" | "resigned"
  joinDate: string
  orgId: string
}

// 员工状态配置
const statusConfig = {
  active: { label: "在职", className: "bg-green-50 text-green-700 border-green-200" },
  trial: { label: "试用期", className: "bg-amber-50 text-amber-700 border-amber-200" },
  resigned: { label: "离职", className: "bg-gray-50 text-gray-500 border-gray-200" },
}

// Mock组织架构数据
const mockOrgTree: OrgNode[] = [
  {
    id: "all",
    name: "全部公司",
    type: "company",
    employeeCount: 24,
    children: [
      { id: "hq", name: "总部", type: "department", parentId: "all", employeeCount: 1 },
      {
        id: "yc",
        name: "银川分公司",
        type: "company",
        parentId: "all",
        employeeCount: 18,
        children: [
          { id: "yc-hr", name: "人才孵化事业部", type: "department", parentId: "yc", employeeCount: 6 },
          { id: "yc-admin", name: "行政人事部", type: "department", parentId: "yc", employeeCount: 1 },
          {
            id: "yc-elder",
            name: "养老服务事业部",
            type: "department",
            parentId: "yc",
            employeeCount: 2,
            children: [
              { id: "yc-elder-finance", name: "财务部", type: "department", parentId: "yc-elder", employeeCount: 2 },
              { id: "yc-elder-media", name: "媒体宣传部", type: "department", parentId: "yc-elder", employeeCount: 1 },
            ]
          },
          { id: "yc-home", name: "居家服务事业部", type: "department", parentId: "yc", employeeCount: 6 },
        ]
      },
      {
        id: "xa",
        name: "西安分公司",
        type: "company",
        parentId: "all",
        employeeCount: 5,
        children: [
          { id: "xa-hr", name: "人才孵化事业部", type: "department", parentId: "xa", employeeCount: 2 },
          { id: "xa-admin", name: "行政人事部", type: "department", parentId: "xa", employeeCount: 0 },
          { id: "xa-elder", name: "养老服务事业部", type: "department", parentId: "xa", employeeCount: 0 },
          { id: "xa-finance", name: "财务部", type: "department", parentId: "xa", employeeCount: 0 },
          { id: "xa-media", name: "媒体宣传部", type: "department", parentId: "xa", employeeCount: 0 },
          { id: "xa-home", name: "居家服务事业部", type: "department", parentId: "xa", employeeCount: 3, children: [
            { id: "xa-home-gm", name: "总经办", type: "department", parentId: "xa-home", employeeCount: 1 },
          ]},
        ]
      },
    ]
  }
]

// Mock员工数据
const mockEmployees: Employee[] = [
  { id: "e1", name: "李总", employeeNo: "E001", department: "总经办", position: "总经理", phone: "138****0001", email: "lizong@youhou.com", status: "active", joinDate: "2020-01-01", orgId: "all" },
  { id: "e2", name: "张经理", employeeNo: "E002", department: "运营中心", position: "运营总监", phone: "138****5678", email: "zhang@youhou.com", status: "active", joinDate: "2023-03-15", orgId: "yc" },
  { id: "e3", name: "王主管", employeeNo: "E003", department: "职业发展部", position: "职业发展部主管", phone: "139****2345", email: "wang@youhou.com", status: "active", joinDate: "2023-05-01", orgId: "yc-hr" },
  { id: "e4", name: "李顾问", employeeNo: "E004", department: "职业发展一部", position: "职业顾问", phone: "139****1234", email: "li@youhou.com", status: "active", joinDate: "2023-06-20", orgId: "yc-hr" },
  { id: "e5", name: "刘顾问", employeeNo: "E005", department: "职业发展一部", position: "职业顾问", phone: "138****3456", email: "liu@youhou.com", status: "active", joinDate: "2024-01-15", orgId: "yc-hr" },
  { id: "e6", name: "郑顾问", employeeNo: "E006", department: "职业发展二部", position: "职业顾问", phone: "137****4567", email: "zheng@youhou.com", status: "active", joinDate: "2024-02-20", orgId: "yc-hr" },
  { id: "e7", name: "陈主管", employeeNo: "E007", department: "家庭服务部", position: "家庭服务部主管", phone: "136****5678", email: "chen@youhou.com", status: "active", joinDate: "2023-04-01", orgId: "yc-home" },
  { id: "e8", name: "周顾问", employeeNo: "E008", department: "家庭服务一部", position: "母婴顾问", phone: "135****2345", email: "zhou@youhou.com", status: "active", joinDate: "2024-01-10", orgId: "yc-home" },
  { id: "e9", name: "吴顾问", employeeNo: "E009", department: "家庭服务一部", position: "母婴顾问", phone: "136****3456", email: "wu@youhou.com", status: "trial", joinDate: "2025-01-05", orgId: "yc-home" },
  { id: "e10", name: "孙顾问", employeeNo: "E010", department: "家庭服务二部", position: "母婴顾问", phone: "137****6789", email: "sun@youhou.com", status: "active", joinDate: "2024-03-15", orgId: "yc-home" },
  { id: "e11", name: "马客服", employeeNo: "E011", department: "客服部", position: "客服专员", phone: "138****7890", email: "ma@youhou.com", status: "active", joinDate: "2024-05-01", orgId: "yc" },
  { id: "e12", name: "杨客服", employeeNo: "E012", department: "客服部", position: "客服专员", phone: "139****8901", email: "yang@youhou.com", status: "resigned", joinDate: "2023-08-01", orgId: "yc" },
  { id: "e13", name: "王财务", employeeNo: "E013", department: "财务部", position: "财务主管", phone: "137****9876", email: "wangcw@youhou.com", status: "active", joinDate: "2023-01-10", orgId: "yc-elder-finance" },
  { id: "e14", name: "赵会计", employeeNo: "E014", department: "财务部", position: "会计", phone: "136****0987", email: "zhao@youhou.com", status: "active", joinDate: "2024-02-01", orgId: "yc-elder-finance" },
  { id: "e15", name: "钱人事", employeeNo: "E015", department: "人事行政部", position: "人事专员", phone: "135****1098", email: "qian@youhou.com", status: "active", joinDate: "2024-03-01", orgId: "yc-admin" },
]

// 组织树节点组件
function OrgTreeNode({ 
  node, 
  level = 0, 
  selectedId, 
  onSelect,
  expandedIds,
  onToggleExpand 
}: { 
  node: OrgNode
  level?: number
  selectedId: string
  onSelect: (id: string) => void
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm hover:bg-muted/50 transition-colors",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            className="h-4 w-4 flex items-center justify-center hover:bg-muted rounded"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        {node.type === "company" ? (
          <Building2 className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className={cn("truncate flex-1", isSelected && "text-primary")}>{node.name}</span>
        <span className="text-xs text-muted-foreground">{node.employeeCount}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrganizationPage() {
  const [selectedOrgId, setSelectedOrgId] = useState("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["all", "yc", "xa"]))
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // 获取所有子组织ID
  const getAllChildIds = (node: OrgNode): string[] => {
    const ids = [node.id]
    if (node.children) {
      node.children.forEach(child => {
        ids.push(...getAllChildIds(child))
      })
    }
    return ids
  }

  // 根据选中的组织获取相关的组织ID列表
  const getRelevantOrgIds = useMemo(() => {
    const findNode = (nodes: OrgNode[], targetId: string): OrgNode | null => {
      for (const node of nodes) {
        if (node.id === targetId) return node
        if (node.children) {
          const found = findNode(node.children, targetId)
          if (found) return found
        }
      }
      return null
    }
    const selectedNode = findNode(mockOrgTree, selectedOrgId)
    if (selectedNode) {
      return getAllChildIds(selectedNode)
    }
    return [selectedOrgId]
  }, [selectedOrgId])

  // 过滤员工
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchOrg = getRelevantOrgIds.includes(emp.orgId)
      const matchSearch = !searchQuery || 
        emp.name.includes(searchQuery) || 
        emp.phone.includes(searchQuery) || 
        emp.position.includes(searchQuery)
      const matchStatus = statusFilter === "all" || emp.status === statusFilter
      return matchOrg && matchSearch && matchStatus
    })
  }, [selectedOrgId, searchQuery, statusFilter, getRelevantOrgIds])

  // 统计数据
  const stats = useMemo(() => {
    const relevantEmps = mockEmployees.filter(emp => getRelevantOrgIds.includes(emp.orgId))
    return {
      total: relevantEmps.length,
      active: relevantEmps.filter(e => e.status === "active").length,
      trial: relevantEmps.filter(e => e.status === "trial").length,
      resigned: relevantEmps.filter(e => e.status === "resigned").length,
    }
  }, [getRelevantOrgIds])

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">员工管理</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{stats.total}人</span>
              <span className="flex items-center gap-1 text-green-600">{stats.active}在职</span>
              <span className="flex items-center gap-1 text-amber-600">{stats.trial}试用</span>
              <span className="flex items-center gap-1 text-gray-500">{stats.resigned}离职</span>
            </div>
          </div>
          <Button size="sm" onClick={() => setAddEmployeeOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            添加员工
          </Button>
        </div>

        {/* 主体内容 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧组织架构树 */}
          <div className="w-56 border-r bg-muted/20 flex flex-col shrink-0">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium text-muted-foreground">组织架构</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockOrgTree.map(node => (
                  <OrgTreeNode
                    key={node.id}
                    node={node}
                    selectedId={selectedOrgId}
                    onSelect={setSelectedOrgId}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧员工列表 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 搜索和筛选 */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名、手机、职位..."
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-9 text-sm">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">在职</SelectItem>
                  <SelectItem value="trial">试用期</SelectItem>
                  <SelectItem value="resigned">离职</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 员工表格 */}
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs w-48">员工</TableHead>
                    <TableHead className="text-xs">部门/职位</TableHead>
                    <TableHead className="text-xs">联系方式</TableHead>
                    <TableHead className="text-xs text-center w-20">状态</TableHead>
                    <TableHead className="text-xs w-28">入职日期</TableHead>
                    <TableHead className="text-xs text-center w-28">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {emp.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.employeeNo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{emp.department}</p>
                          <p className="text-xs text-muted-foreground">{emp.position}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{emp.phone}</p>
                          <p className="text-xs text-muted-foreground">{emp.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-[10px]", statusConfig[emp.status].className)}>
                          {statusConfig[emp.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{emp.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs">编辑信息</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">调整部门</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">重置密码</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs text-red-600">离职处理</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        暂无员工数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* 添加员工对话框 */}
      <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">添加员工</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">姓名 <span className="text-red-500">*</span></Label>
                <Input placeholder="请输入姓名" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">工号</Label>
                <Input placeholder="自动生成" className="h-9 text-sm" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">手机号 <span className="text-red-500">*</span></Label>
                <Input placeholder="请输入手机号" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">邮箱</Label>
                <Input placeholder="请输入邮箱" className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">所属部门 <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yc-hr">人才孵化事业部</SelectItem>
                    <SelectItem value="yc-home">居家服务事业部</SelectItem>
                    <SelectItem value="yc-elder">养老服务事业部</SelectItem>
                    <SelectItem value="yc-admin">行政人事部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">职位 <span className="text-red-500">*</span></Label>
                <Input placeholder="请输入职位" className="h-9 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">入职日期 <span className="text-red-500">*</span></Label>
              <Input type="date" className="h-9 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddEmployeeOpen(false)}>取消</Button>
            <Button size="sm" className="text-xs">确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
