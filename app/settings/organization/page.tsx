'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// MOCK数据 - 组织结构
const departments = [
  { id: 'D001', name: '顾问中心', manager: '王经理', memberCount: 15, status: 'active' },
  { id: 'D002', name: '技师团队', manager: '李经理', memberCount: 8, status: 'active' },
  { id: 'D003', name: '运营部', manager: '张经理', memberCount: 12, status: 'active' },
  { id: 'D004', name: '财务部', manager: '刘经理', memberCount: 5, status: 'active' },
]

// MOCK数据 - 员工
const employees = [
  { id: 'E001', name: '王小明', position: '资深顾问', department: 'D001', phone: '138****1234', joinDate: '2023-01-15', status: 'active' },
  { id: 'E002', name: '李阿姨', position: '高级月嫂', department: 'D002', phone: '139****2345', joinDate: '2023-06-20', status: 'active' },
  { id: 'E003', name: '张阿姨', position: '育婴师', department: 'D002', phone: '137****3456', joinDate: '2023-08-10', status: 'active' },
  { id: 'E004', name: '刘小姐', position: '运营专员', department: 'D003', phone: '136****4567', joinDate: '2024-01-01', status: 'active' },
]

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments')
  const [showDialog, setShowDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDepts = departments.filter(d => d.name.includes(searchTerm) || d.manager.includes(searchTerm))
  const filteredEmployees = employees.filter(e => e.name.includes(searchTerm) || e.position.includes(searchTerm))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">组织管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理部门结构和员工信息</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增
        </Button>
      </div>

      {/* 选项卡 */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('departments')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'departments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          部门管理
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'employees'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          员工管理
        </button>
      </div>

      {/* 部门管理 */}
      {activeTab === 'departments' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">部门列表</CardTitle>
              <Input
                placeholder="搜索部门或负责人..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>部门名称</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead className="tabular-nums">成员数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepts.map(dept => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{dept.manager}</TableCell>
                    <TableCell className="tabular-nums font-medium">{dept.memberCount}</TableCell>
                    <TableCell>
                      <Badge className={dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {dept.status === 'active' ? '活跃' : '停用'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 员工管理 */}
      {activeTab === 'employees' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">员工列表</CardTitle>
              <Input
                placeholder="搜索员工或职位..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>入职时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{departments.find(d => d.id === emp.department)?.name || '-'}</TableCell>
                    <TableCell className="tabular-nums">{emp.phone}</TableCell>
                    <TableCell>{emp.joinDate}</TableCell>
                    <TableCell>
                      <Badge className={emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {emp.status === 'active' ? '在职' : '离职'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
