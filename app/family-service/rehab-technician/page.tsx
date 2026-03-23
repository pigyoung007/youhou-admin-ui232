"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CompactScheduleTimeline, type ScheduleBlock } from "@/components/family-service/schedule-timeline"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Filter, Download, Eye, Edit, Phone, MoreHorizontal,
  Star, Award, Calendar, MapPin, Clock, User, CheckCircle, XCircle
} from "lucide-react"

// 技师状态
type TechnicianStatus = "available" | "working" | "training" | "leave" | "resigned"
const statusConfig: Record<TechnicianStatus, { label: string; color: string }> = {
  available: { label: "空闲", color: "bg-green-100 text-green-700" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-700" },
  training: { label: "培训中", color: "bg-amber-100 text-amber-700" },
  leave: { label: "请假", color: "bg-gray-100 text-gray-700" },
  resigned: { label: "已离职", color: "bg-red-100 text-red-700" },
}

// 技师等级
type TechnicianLevel = "senior" | "intermediate" | "junior" | "trainee"
const levelConfig: Record<TechnicianLevel, { label: string; color: string }> = {
  senior: { label: "高级产康师", color: "bg-amber-100 text-amber-700" },
  intermediate: { label: "中级产康师", color: "bg-purple-100 text-purple-700" },
  junior: { label: "初级产康师", color: "bg-blue-100 text-blue-700" },
  trainee: { label: "实习生", color: "bg-gray-100 text-gray-700" },
}

// 技师数据类型
interface RehabTechnician {
  id: string
  name: string
  phone: string
  avatar?: string
  level: TechnicianLevel
  status: TechnicianStatus
  skills: string[]
  rating: number
  serviceCount: number
  experience: number // 年
  joinDate: string
  consultant?: string
  address?: string
  certifications: string[]
  schedules: ScheduleBlock[]
}

// Mock数据
const mockTechnicians: RehabTechnician[] = [
  {
    id: "RT001",
    name: "陈丽华",
    phone: "138****5678",
    level: "senior",
    status: "working",
    skills: ["产后修复", "骨盆矫正", "腹直肌修复", "催乳通乳", "满月发汗"],
    rating: 4.9,
    serviceCount: 328,
    experience: 8,
    joinDate: "2020-03-15",
    consultant: "王顾问",
    address: "北京市朝阳区",
    certifications: ["高级产康师证", "催乳师证", "中医理疗师证"],
    schedules: [
      { id: "s1", startDate: "2026-01-11", endDate: "2026-02-10", type: "booked", customerName: "张女士" },
      { id: "s2", startDate: "2026-03-01", endDate: "2026-03-15", type: "booked", customerName: "李女士" },
    ],
  },
  {
    id: "RT002",
    name: "王秀芳",
    phone: "139****1234",
    level: "senior",
    status: "available",
    skills: ["产后修复", "经络疏通", "盆底康复", "体态矫正"],
    rating: 4.8,
    serviceCount: 256,
    experience: 6,
    joinDate: "2021-06-20",
    consultant: "刘顾问",
    address: "北京市海淀区",
    certifications: ["高级产康师证", "盆底康复师证"],
    schedules: [],
  },
  {
    id: "RT003",
    name: "李小敏",
    phone: "137****9876",
    level: "intermediate",
    status: "working",
    skills: ["产后修复", "腹直肌修复", "催乳通乳"],
    rating: 4.7,
    serviceCount: 142,
    experience: 4,
    joinDate: "2022-09-10",
    consultant: "王顾问",
    address: "北京市西城区",
    certifications: ["中级产康师证", "催乳师证"],
    schedules: [
      { id: "s3", startDate: "2026-03-10", endDate: "2026-03-25", type: "booked", customerName: "王女士" },
    ],
  },
  {
    id: "RT004",
    name: "张晓燕",
    phone: "136****5432",
    level: "intermediate",
    status: "training",
    skills: ["产后修复", "骨盆矫正"],
    rating: 4.6,
    serviceCount: 89,
    experience: 2,
    joinDate: "2024-01-15",
    consultant: "张顾问",
    address: "北京市丰台区",
    certifications: ["中级产康师证"],
    schedules: [
      { id: "s4", startDate: "2026-03-15", endDate: "2026-03-20", type: "training" },
    ],
  },
  {
    id: "RT005",
    name: "刘春梅",
    phone: "135****7890",
    level: "junior",
    status: "available",
    skills: ["产后修复", "催乳通乳"],
    rating: 4.5,
    serviceCount: 45,
    experience: 1,
    joinDate: "2025-03-01",
    consultant: "王顾问",
    address: "北京市东城区",
    certifications: ["初级产康师证"],
    schedules: [],
  },
]

export default function RehabTechnicianPage() {
  const router = useRouter()
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState<RehabTechnician | null>(null)

  // 业务流程跳转回调
  const handleSchedule = (tech: RehabTechnician) => {
    router.push(`/family-service/scheduling?techId=${tech.id}&techName=${tech.name}`)
  }

  const handleAssignOrder = (tech: RehabTechnician) => {
    router.push(`/family-service/orders?action=create&techId=${tech.id}&techName=${tech.name}`)
  }

  const handleCall = (tech: RehabTechnician) => {
    console.log("拨打电话:", tech.phone)
  }

  // 筛选技师
  const filteredTechnicians = mockTechnicians.filter(tech => {
    if (searchTerm && !tech.name.includes(searchTerm) && !tech.id.includes(searchTerm)) return false
    if (statusFilter !== "all" && tech.status !== statusFilter) return false
    if (levelFilter !== "all" && tech.level !== levelFilter) return false
    if (activeTab === "available" && tech.status !== "available") return false
    if (activeTab === "working" && tech.status !== "working") return false
    return true
  })

  // 统计数据
  const stats = {
    total: mockTechnicians.length,
    available: mockTechnicians.filter(t => t.status === "available").length,
    working: mockTechnicians.filter(t => t.status === "working").length,
    training: mockTechnicians.filter(t => t.status === "training").length,
    avgRating: (mockTechnicians.reduce((sum, t) => sum + t.rating, 0) / mockTechnicians.length).toFixed(1),
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTechnicians(filteredTechnicians.map(t => t.id))
    } else {
      setSelectedTechnicians([])
    }
  }

  const handleSelectTech = (techId: string, checked: boolean) => {
    if (checked) {
      setSelectedTechnicians([...selectedTechnicians, techId])
    } else {
      setSelectedTechnicians(selectedTechnicians.filter(id => id !== techId))
    }
  }

  const handleViewDetail = (tech: RehabTechnician) => {
    setSelectedTech(tech)
    setDetailOpen(true)
  }

  return (
    <AdminLayout title="产康技师管理">
      <div className="space-y-4">
        {/* 技师列表 */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList>
                <TabsTrigger value="all">全部技师</TabsTrigger>
                <TabsTrigger value="available">
                  空闲中
                  <Badge className="ml-1 bg-green-100 text-green-700">{stats.available}</Badge>
                </TabsTrigger>
                <TabsTrigger value="working">服务中</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />导出
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />添加技师
                </Button>
              </div>
            </div>

            {/* 筛选栏 */}
            <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名/编号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="senior">高级产康师</SelectItem>
                  <SelectItem value="intermediate">中级产康师</SelectItem>
                  <SelectItem value="junior">初级产康师</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="available">空闲</SelectItem>
                  <SelectItem value="working">服务中</SelectItem>
                  <SelectItem value="training">培训中</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedTechnicians.length === filteredTechnicians.length && filteredTechnicians.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[80px]">编号</TableHead>
                    <TableHead className="min-w-[140px]">技师信息</TableHead>
                    <TableHead className="w-[100px]">等级</TableHead>
                    <TableHead className="min-w-[180px]">专业技能</TableHead>
                    <TableHead className="w-[80px]">评分</TableHead>
                    <TableHead className="w-[80px]">服务数</TableHead>
                    <TableHead className="min-w-[200px]">档期</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnicians.map(tech => (
                    <TableRow key={tech.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTechnicians.includes(tech.id)}
                          onCheckedChange={(checked) => handleSelectTech(tech.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{tech.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10">{tech.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />{tech.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", levelConfig[tech.level].color)}>
                          {levelConfig[tech.level].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tech.skills.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {tech.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tech.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-medium">{tech.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{tech.serviceCount}次</TableCell>
                      <TableCell>
                        <CompactScheduleTimeline
                          schedules={tech.schedules}
                          startMonth={new Date(2026, 0, 1)}
                          monthCount={4}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusConfig[tech.status].color)}>
                          {statusConfig[tech.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewDetail(tech)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />编辑信息
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />查看排班
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" />联系技师
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />标记离职
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Card>

        {/* 详情侧边栏 */}
        <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
          <SheetContent className="w-[480px] sm:max-w-[480px]">
            <SheetHeader>
              <SheetTitle>技师详情</SheetTitle>
            </SheetHeader>
            {selectedTech && (
              <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                <div className="space-y-6 pr-4">
                  {/* 基本信息 */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl bg-primary/10">{selectedTech.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{selectedTech.name}</h3>
                        <Badge className={cn("text-xs", levelConfig[selectedTech.level].color)}>
                          {levelConfig[selectedTech.level].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />{selectedTech.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />{selectedTech.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 统计数据 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{selectedTech.serviceCount}</div>
                      <div className="text-xs text-muted-foreground">服务次数</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{selectedTech.experience}年</div>
                      <div className="text-xs text-muted-foreground">从业经验</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{selectedTech.rating}</div>
                      <div className="text-xs text-muted-foreground">客户评分</div>
                    </div>
                  </div>

                  {/* 专业技能 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">专业技能</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTech.skills.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* 资质证书 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">资质证书</h4>
                    <div className="space-y-2">
                      {selectedTech.certifications.map(cert => (
                        <div key={cert} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                          <Award className="h-4 w-4 text-amber-600" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 档期日历 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">排班档期</h4>
                    <CompactScheduleTimeline
                      schedules={selectedTech.schedules}
                      startMonth={new Date(2026, 0, 1)}
                      monthCount={6}
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Calendar className="h-4 w-4 mr-1" />安排排班
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />联系技师
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  )
}
