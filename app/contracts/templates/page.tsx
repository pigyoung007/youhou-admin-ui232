"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, Edit, Copy, Trash2, Eye, MoreHorizontal, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Suspense } from "react"
import Loading from "./loading"

const templates = [
  { 
    id: 1, 
    name: "月嫂服务合同", 
    category: "母婴服务", 
    version: "v2.3", 
    usageCount: 156, 
    status: "active",
    updatedAt: "2025-10-15",
    description: "标准月嫂服务合同，包含服务内容、薪资条款、违约责任等"
  },
  { 
    id: 2, 
    name: "产康服务合同", 
    category: "产后康复", 
    version: "v1.8", 
    usageCount: 89, 
    status: "active",
    updatedAt: "2025-10-10",
    description: "产后康复服务合同，包含项目明细、疗程安排、退款条款等"
  },
  { 
    id: 3, 
    name: "育婴师服务合同", 
    category: "母婴服务", 
    version: "v2.0", 
    usageCount: 67, 
    status: "active",
    updatedAt: "2025-09-28",
    description: "育婴师服务合同，包含看护职责、工作时间、安全责任等"
  },
  { 
    id: 4, 
    name: "培训服务协议", 
    category: "培训教育", 
    version: "v1.5", 
    usageCount: 234, 
    status: "active",
    updatedAt: "2025-09-20",
    description: "学员培训服务协议，包含课程内容、考核标准、证书发放等"
  },
  { 
    id: 5, 
    name: "员工劳动合同", 
    category: "人事管理", 
    version: "v3.1", 
    usageCount: 45, 
    status: "draft",
    updatedAt: "2025-10-18",
    description: "公司员工劳动合同模板，符合劳动法规定"
  },
]

const categoryColors = {
  "母婴服务": "bg-pink-100 text-pink-700 border-pink-200",
  "产后康复": "bg-purple-100 text-purple-700 border-purple-200",
  "培训教育": "bg-blue-100 text-blue-700 border-blue-200",
  "人事管理": "bg-gray-100 text-gray-700 border-gray-200",
}

export default function ContractTemplatesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">合同模板</h1>
              <p className="text-muted-foreground">管理和维护各类合同模板</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索模板..." className="pl-9" />
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                同步模板
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-md transition-all hover:border-primary/30">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />预览</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />编辑</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />复制</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">{template.version}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <Badge variant="outline" className={categoryColors[template.category as keyof typeof categoryColors]}>
                      {template.category}
                    </Badge>
                    <Badge variant={template.status === "active" ? "default" : "secondary"}>
                      {template.status === "active" ? "已启用" : "草稿"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <span>使用 {template.usageCount} 次</span>
                    <span>更新于 {template.updatedAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
