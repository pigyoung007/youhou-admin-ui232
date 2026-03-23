'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Phone, MapPin, Calendar } from 'lucide-react'

// MOCK数据 - 私单月嫂
const privateNannies = [
  { id: 'PN001', name: '王阿姨', phone: '138****1234', serviceTypes: ['月嫂'], yearExp: 8, rating: 4.8, orders: 156, joinDate: '2020-03-15', status: 'active' },
  { id: 'PN002', name: '李阿姨', phone: '139****2345', serviceTypes: ['月嫂', '育婴'], yearExp: 10, rating: 4.9, orders: 203, joinDate: '2018-06-20', status: 'active' },
  { id: 'PN003', name: '张阿姨', phone: '137****3456', serviceTypes: ['育婴师'], yearExp: 5, rating: 4.7, orders: 89, joinDate: '2021-08-10', status: 'active' },
  { id: 'PN004', name: '刘阿姨', phone: '136****4567', serviceTypes: ['保姆'], yearExp: 3, rating: 4.6, orders: 45, joinDate: '2023-01-01', status: 'inactive' },
]

export default function PrivateNanniesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredNannies = privateNannies.filter(n => {
    if (searchTerm && !n.name.includes(searchTerm) && !n.phone.includes(searchTerm)) return false
    if (filterStatus !== 'all' && n.status !== filterStatus) return false
    return true
  })

  return (
    <AdminLayout title="私单月嫂管理">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">私单月嫂管理</h1>
            <p className="text-sm text-muted-foreground mt-1">管理平台上的独立服务人员</p>
          </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增月嫂
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">在职人数</p>
              <p className="text-2xl font-bold mt-1">{privateNannies.filter(n => n.status === 'active').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">平均评分</p>
              <p className="text-2xl font-bold mt-1">4.75</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">总服务单数</p>
              <p className="text-2xl font-bold mt-1">{privateNannies.reduce((sum, n) => sum + n.orders, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">平均工作年限</p>
              <p className="text-2xl font-bold mt-1">{(privateNannies.reduce((sum, n) => sum + n.yearExp, 0) / privateNannies.length).toFixed(1)}年</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="搜索姓名或电话..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 max-w-sm"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">全部状态</option>
          <option value="active">在职</option>
          <option value="inactive">停用</option>
        </select>
      </div>

      {/* 列表 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>服务类型</TableHead>
                <TableHead>联系电话</TableHead>
                <TableHead className="tabular-nums">工作年限</TableHead>
                <TableHead className="tabular-nums">评分</TableHead>
                <TableHead className="tabular-nums">服务单数</TableHead>
                <TableHead>入驻时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNannies.map(nanny => (
                <TableRow key={nanny.id}>
                  <TableCell className="font-medium">{nanny.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {nanny.serviceTypes.map(type => (
                        <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{nanny.phone}</TableCell>
                  <TableCell className="tabular-nums font-medium">{nanny.yearExp}年</TableCell>
                  <TableCell className="tabular-nums">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{nanny.rating}</span>
                      <span className="text-amber-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums font-medium">{nanny.orders}</TableCell>
                  <TableCell>{nanny.joinDate}</TableCell>
                  <TableCell>
                    <Badge className={nanny.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {nanny.status === 'active' ? '在职' : '停用'}
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
      </div>
    </AdminLayout>
  )
}
