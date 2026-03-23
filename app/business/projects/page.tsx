"use client"

import React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal, Layers, Heart, Baby, Sparkles, Home, GraduationCap,
  ChevronRight
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Project {
  id: string
  name: string
  code: string
  category: string
  description: string
  servicesCount: number
  status: "active" | "inactive"
  icon: React.ElementType
  color: string
}

const mockProjects: Project[] = [
  { id: "P001", name: "月嫂服务", code: "YUESAO", category: "母婴护理", description: "为产妇和新生儿提供专业护理服务", servicesCount: 12, status: "active", icon: Heart, color: "bg-rose-50 text-rose-600" },
  { id: "P002", name: "育婴师服务", code: "YUYING", category: "母婴护理", description: "为婴幼儿提供专业照护和早教服务", servicesCount: 8, status: "active", icon: Baby, color: "bg-blue-50 text-blue-600" },
  { id: "P003", name: "产康服务", code: "CHANKANG", category: "产后康复", description: "产后身体恢复及康复训练服务", servicesCount: 15, status: "active", icon: Sparkles, color: "bg-purple-50 text-purple-600" },
  { id: "P004", name: "家政服务", code: "JIAZHENG", category: "家庭服务", description: "家庭清洁、烹饪等日常服务", servicesCount: 6, status: "active", icon: Home, color: "bg-teal-50 text-teal-600" },
  { id: "P005", name: "培训课程", code: "PEIXUN", category: "培训教育", description: "月嫂、育婴师等专业技能培训", servicesCount: 10, status: "active", icon: GraduationCap, color: "bg-amber-50 text-amber-600" },
]

const Loading = () => null;

export default function ProjectsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const searchParams = useSearchParams();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">项目管理</h1>
            <p className="text-muted-foreground mt-1">管理业务项目分类与配置</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增项目
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索项目名称或编码" className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="muying">母婴护理</SelectItem>
                  <SelectItem value="chankang">产后康复</SelectItem>
                  <SelectItem value="jiazheng">家庭服务</SelectItem>
                  <SelectItem value="peixun">培训教育</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => {
            const Icon = project.icon
            return (
              <Card key={project.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${project.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant="outline" className="text-xs">{project.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">服务项: </span>
                      <span className="font-medium">{project.servicesCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">启用</span>
                      <Switch checked={project.status === "active"} />
                    </div>
                  </div>

                  <Link 
                    href={`/business/services?project=${project.id}`}
                    className="flex items-center justify-center gap-1 mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    查看服务内容
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增项目</DialogTitle>
            <DialogDescription>创建新的业务项目分类</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>项目名称 *</Label>
                <Input placeholder="如: 月嫂服务" />
              </div>
              <div className="space-y-2">
                <Label>项目编码 *</Label>
                <Input placeholder="如: YUESAO" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>所属分类</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muying">母婴护理</SelectItem>
                  <SelectItem value="chankang">产后康复</SelectItem>
                  <SelectItem value="jiazheng">家庭服务</SelectItem>
                  <SelectItem value="peixun">培训教育</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>项目描述</Label>
              <Textarea placeholder="输入项目描述..." className="resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export const unstable_settings = { runtime: "experimental-edge" };
