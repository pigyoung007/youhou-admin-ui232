'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Plus, Settings, Monitor, Smartphone, Users, Shield, Building2, 
  ChevronRight, Search, Edit, Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 平台类型
type Platform = 'admin' | 'employer' | 'staff'

// 角色类型
interface Role {
  id: string
  name: string
  description: string
  userCount: number
  type: 'system' | 'custom'
  platform: Platform
}

// 权限项
interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
  hasDetail?: boolean
}

// 权限分类
interface PermissionCategory {
  id: string
  name: string
  permissions: Permission[]
}

// Mock角色数据
const mockRoles: Record<Platform, Role[]> = {
  admin: [
    { id: 'R001', name: '超级管理员', description: '拥有系统全部权限', userCount: 2, type: 'system', platform: 'admin' },
    { id: 'R002', name: '运营主管', description: '管理月嫂、督导师、产康师档案和排班', userCount: 3, type: 'system', platform: 'admin' },
    { id: 'R003', name: '销售顾问', description: '客户线索跟进、意向促进和签约', userCount: 8, type: 'system', platform: 'admin' },
    { id: 'R004', name: '财务人员', description: '收支流水、新进结算和财务报表', userCount: 2, type: 'system', platform: 'admin' },
    { id: 'R005', name: '培训讲师', description: '管理培训班级、学员和课程', userCount: 4, type: 'system', platform: 'admin' },
    { id: 'R006', name: '客服专员', description: '处理客户投诉、投诉和售后', userCount: 6, type: 'system', platform: 'admin' },
    { id: 'R007', name: '区域经理', description: '管理指定区域的业务和团队', userCount: 2, type: 'custom', platform: 'admin' },
    { id: 'R008', name: '数据分析师', description: '查看和分析业务数据报表', userCount: 1, type: 'custom', platform: 'admin' },
  ],
  employer: [
    { id: 'E001', name: '雇主用户', description: '普通雇主权限', userCount: 156, type: 'system', platform: 'employer' },
    { id: 'E002', name: 'VIP雇主', description: '高级雇主权限', userCount: 23, type: 'system', platform: 'employer' },
  ],
  staff: [
    { id: 'S001', name: '月嫂', description: '月嫂服务人员权限', userCount: 89, type: 'system', platform: 'staff' },
    { id: 'S002', name: '育婴师', description: '育婴师服务人员权限', userCount: 45, type: 'system', platform: 'staff' },
    { id: 'S003', name: '产康师', description: '产康师服务人员权限', userCount: 32, type: 'system', platform: 'staff' },
  ],
}

// Mock权限配置
const mockPermissions: PermissionCategory[] = [
  {
    id: 'scrm',
    name: 'SCRM客户管理',
    permissions: [
      { id: 'scrm_view_lead', name: '查看线索', description: '查看客户线索列表和详情', enabled: true, hasDetail: true },
      { id: 'scrm_view_convert', name: '查看转化', description: '查看线索转化数据', enabled: true, hasDetail: true },
      { id: 'scrm_assign_lead', name: '分配线索', description: '分配线索给其他顾问', enabled: true },
      { id: 'scrm_view_customer', name: '查看客户', description: '查看已成交客户', enabled: true, hasDetail: true },
      { id: 'scrm_edit_customer', name: '编辑客户', description: '修改客户信息', enabled: true },
    ]
  },
  {
    id: 'order',
    name: '订单管理',
    permissions: [
      { id: 'order_view', name: '查看订单', description: '查看订单列表和详情', enabled: true, hasDetail: true },
      { id: 'order_create', name: '创建订单', description: '创建新订单', enabled: true, hasDetail: true },
      { id: 'order_edit', name: '编辑订单', description: '修改订单信息', enabled: false, hasDetail: true },
      { id: 'order_cancel', name: '取消订单', description: '取消和退款订单', enabled: false },
    ]
  },
  {
    id: 'operation',
    name: '运营管理',
    permissions: [
      { id: 'op_view_staff', name: '查看人员', description: '查看服务人员档案', enabled: true, hasDetail: true },
      { id: 'op_edit_staff', name: '编辑人员', description: '修改服务人员信息', enabled: true, hasDetail: true },
      { id: 'op_schedule', name: '排班管理', description: '安排服务人员工作', enabled: true, hasDetail: true },
      { id: 'op_ticket', name: '工单管理', description: '处理服务工单', enabled: true },
    ]
  },
  {
    id: 'finance',
    name: '财务管理',
    permissions: [
      { id: 'fin_view_flow', name: '查看流水', description: '查看收支记录', enabled: false, hasDetail: true },
      { id: 'fin_operate', name: '财务操作', description: '立账和结算', enabled: false },
      { id: 'fin_view_salary', name: '查看薪资', description: '查看薪资计算', enabled: false, hasDetail: true },
    ]
  },
  {
    id: 'salary_approve',
    name: '薪资审批',
    permissions: [
      { id: 'salary_approve', name: '薪资审批', description: '审批薪资发放', enabled: false },
    ]
  },
  {
    id: 'training',
    name: '培训管理',
    permissions: [
      { id: 'train_view_class', name: '查看班级', description: '查看培训班级', enabled: false, hasDetail: true },
      { id: 'train_manage_class', name: '管理班级', description: '创建和管理班级', enabled: false },
      { id: 'train_view_student', name: '查看学员', description: '查看学员信息', enabled: false, hasDetail: true },
      { id: 'train_manage_student', name: '管理学员', description: '学员档案和调整', enabled: false },
    ]
  },
  {
    id: 'system',
    name: '系统设置',
    permissions: [
      { id: 'sys_employee', name: '员工管理', description: '管理后台用户', enabled: false, hasDetail: true },
      { id: 'sys_role', name: '角色权限', description: '配置角色权限', enabled: false },
    ]
  },
]

export default function PermissionsPage() {
  const [platform, setPlatform] = useState<Platform>('admin')
  const [selectedRole, setSelectedRole] = useState<Role>(mockRoles.admin[1]) // 默认选中运营主管
  const [permissions, setPermissions] = useState<PermissionCategory[]>(mockPermissions)
  const [searchTerm, setSearchTerm] = useState('')

  const currentRoles = mockRoles[platform]
  const systemRoles = currentRoles.filter(r => r.type === 'system')
  const customRoles = currentRoles.filter(r => r.type === 'custom')

  const togglePermission = (categoryId: string, permissionId: string) => {
    setPermissions(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          permissions: cat.permissions.map(p => 
            p.id === permissionId ? { ...p, enabled: !p.enabled } : p
          )
        }
      }
      return cat
    }))
  }

  const platformConfig = {
    admin: { label: '管理后台', icon: Monitor, description: '内部员工使用的管理系统', color: 'bg-blue-500' },
    employer: { label: '雇主端', icon: Users, description: '雇主客户使用的小程序/App', color: 'bg-amber-500' },
    staff: { label: '家政员端', icon: Heart, description: '服务人员使用的小程序/App', color: 'bg-rose-500' },
  }

  return (
    <AdminLayout title="角色与权限">
      <div className="space-y-4">
        {/* 平台切换 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">配置不同用户角色和功能权限分配</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新建角色
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(Object.keys(platformConfig) as Platform[]).map(p => {
            const config = platformConfig[p]
            const Icon = config.icon
            return (
              <button
                key={p}
                onClick={() => {
                  setPlatform(p)
                  setSelectedRole(mockRoles[p][0])
                }}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  platform === p 
                    ? "border-primary bg-primary/5" 
                    : "border-transparent bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* 主内容区 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 左侧角色列表 */}
          <Card className="col-span-3 p-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="font-medium text-sm">{platformConfig[platform].label}角色</h3>
              <p className="text-xs text-muted-foreground mt-0.5">共 {currentRoles.length} 个角色, {currentRoles.reduce((sum, r) => sum + r.userCount, 0)} 位用户</p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-380px)]">
              {/* 系统角色 */}
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1">系统角色</p>
                {systemRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors mb-1",
                      selectedRole.id === role.id 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{role.name}</span>
                        {role.type === 'system' && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1">系统</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">共 {role.userCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{role.description}</p>
                  </button>
                ))}
              </div>

              {/* 自定义角色 */}
              {customRoles.length > 0 && (
                <div className="p-2 border-t">
                  <p className="text-xs text-muted-foreground px-2 py-1">自定义角色</p>
                  {customRoles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-colors mb-1",
                        selectedRole.id === role.id 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{role.name}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1 text-amber-600 border-amber-300">自定义</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">共 {role.userCount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{role.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* 右侧权限配置 */}
          <Card className="col-span-9 p-0 overflow-hidden">
            {/* 角色信息头 */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{selectedRole.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedRole.description}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-3.5 w-3.5 mr-1" />
                编辑
              </Button>
            </div>

            {/* 权限列表 */}
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="p-4 space-y-4">
                {permissions.map(category => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2 py-2 border-b">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">{category.name}</h4>
                    </div>
                    <div className="space-y-1 pl-6">
                      {category.permissions.map(permission => (
                        <div 
                          key={permission.id}
                          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{permission.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {permission.hasDetail && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}
                            <Switch 
                              checked={permission.enabled}
                              onCheckedChange={() => togglePermission(category.id, permission.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* 底部操作 */}
            <div className="p-4 border-t bg-muted/30 flex items-center justify-end gap-2">
              <Button variant="outline">重置</Button>
              <Button>保存权限</Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
