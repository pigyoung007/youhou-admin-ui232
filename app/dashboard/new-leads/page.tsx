"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, Search, Users, Phone, MessageSquare, 
  UserPlus, Clock, Calendar, ExternalLink
} from "lucide-react"
import Link from "next/link"

// 新线索数据
const newLeadsData = [
  {
    id: "L001", name: "小红女士", phone: "138****1234",
    source: "美团推广", serviceType: "月嫂服务", expectedDate: "2026-04-01",
    createdAt: "2026-03-19 09:15", status: "new",
    budget: "15000-20000", address: "浦东新区", remark: "预产期4月中旬"
  },
  {
    id: "L002", name: "张女士", phone: "139****2345",
    source: "朋友推荐", serviceType: "育婴师", expectedDate: "2026-03-25",
    createdAt: "2026-03-19 10:30", status: "new",
    budget: "8000-12000", address: "静安区", remark: "宝宝3个月大"
  },
  {
    id: "L003", name: "李先生", phone: "137****3456",
    source: "抖音广告", serviceType: "月嫂服务", expectedDate: "2026-04-15",
    createdAt: "2026-03-19 11:45", status: "new",
    budget: "20000+", address: "黄浦区", remark: "双胞胎，需要经验丰富的月嫂"
  },
  {
    id: "L004", name: "王女士", phone: "136****4567",
    source: "官网咨询", serviceType: "产康服务", expectedDate: "2026-03-20",
    createdAt: "2026-03-19 14:00", status: "new",
    budget: "5000-8000", address: "徐汇区", remark: "产后42天，需要产康护理"
  },
  {
    id: "L005", name: "刘女士", phone: "135****5678",
    source: "老客户转介", serviceType: "月嫂服务", expectedDate: "2026-05-01",
    createdAt: "2026-03-19 15:20", status: "new",
    budget: "18000-22000", address: "长宁区", remark: "二胎，第一胎用过我们服务"
  },
]

export default function NewLeadsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const filteredData = newLeadsData.filter(item => {
    if (searchTerm && !item.name.includes(searchTerm) && !item.phone.includes(searchTerm)) return false
    if (sourceFilter !== "all" && item.source !== sourceFilter) return false
    return true
  })

  const sources = [...new Set(newLeadsData.map(l => l.source))]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredData.map(l => l.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, id])
    } else {
      setSelectedLeads(selectedLeads.filter(l => l !== id))
    }
  }

  return (
    <AdminLayout title="新线索">
      <div className="space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div>
              <h1 className="text-xl font-semibold">新线索列表</h1>
              <p className="text-sm text-muted-foreground">
                共 {filteredData.length} 条新线索待跟进
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedLeads.length > 0 && (
              <Button variant="outline">
                批量分配 ({selectedLeads.length})
              </Button>
            )}
            <Button asChild>
              <Link href="/scrm/leads?action=create">
                <UserPlus className="h-4 w-4 mr-2" />
                新增线索
              </Link>
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日新增</p>
                  <p className="text-2xl font-bold text-blue-600">{newLeadsData.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-cyan-200 bg-cyan-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">月嫂需求</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {newLeadsData.filter(l => l.serviceType === "月嫂服务").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">育婴需求</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {newLeadsData.filter(l => l.serviceType === "育婴师").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">产康需求</p>
                  <p className="text-2xl font-bold">
                    {newLeadsData.filter(l => l.serviceType === "产康服务").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索客户姓名或电话..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="来源筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  {sources.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href="/scrm/leads">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  线索池管理
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 线索列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedLeads.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>客户信息</TableHead>
                <TableHead>服务需求</TableHead>
                <TableHead>预算范围</TableHead>
                <TableHead>期望日期</TableHead>
                <TableHead>来源渠道</TableHead>
                <TableHead>录入时间</TableHead>
                <TableHead>备注</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectLead(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.phone}</p>
                      <p className="text-xs text-muted-foreground">{item.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {item.serviceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.budget}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{item.expectedDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground max-w-[150px] truncate block">
                      {item.remark}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" title="拨打电话">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="发送消息">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/scrm/customers/mine?action=claim&leadId=${item.id}`}>
                          领取
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
