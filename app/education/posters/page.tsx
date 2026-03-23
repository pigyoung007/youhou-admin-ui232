"use client"

import React from "react"
import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  Search, Plus, Download, Copy, Eye, Share2, MoreHorizontal, ImageIcon, 
  Palette, Type, QrCode, Calendar, TrendingUp, Edit, Trash2, CheckCircle2, Clock, Link, Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Poster {
  id: string
  name: string
  description: string
  type: "course" | "promotion" | "showcase" | "recruitment"
  status: "active" | "draft" | "expired"
  template: string
  course?: string
  qrCodeType: "wechat" | "link" | "custom"
  views: number
  shares: number
  downloads: number
  conversions: number
  createdAt: string
  expireDate?: string
  color: string
  tags: string[]
}

const posters: Poster[] = [
  { id: "P001", name: "高级月嫂培训招生", description: "专业月嫂培训，金牌讲师授课，结业颁发证书", type: "course", status: "active", template: "modern", course: "高级月嫂培训", qrCodeType: "wechat", views: 2456, shares: 189, downloads: 67, conversions: 23, createdAt: "2025-10-15", color: "from-pink-500 to-rose-500", tags: ["热门", "推荐"] },
  { id: "P002", name: "产康师认证课程", description: "产后康复专业培训，实操教学，就业推荐", type: "course", status: "active", template: "elegant", course: "产康师认证", qrCodeType: "wechat", views: 1823, shares: 142, downloads: 45, conversions: 18, createdAt: "2025-10-10", color: "from-purple-500 to-indigo-500", tags: ["新课"] },
  { id: "P003", name: "育婴师专业培训", description: "0-3岁婴幼儿护理专业培训，理论+实操", type: "course", status: "active", template: "fresh", course: "育婴师专业班", qrCodeType: "link", views: 956, shares: 78, downloads: 32, conversions: 12, createdAt: "2025-09-28", color: "from-cyan-500 to-blue-500", tags: [] },
  { id: "P004", name: "老学员推荐有礼", description: "推荐好友报名，双方各得500元现金红包", type: "promotion", status: "active", template: "festive", qrCodeType: "custom", views: 3421, shares: 567, downloads: 234, conversions: 89, createdAt: "2025-10-01", color: "from-amber-500 to-orange-500", tags: ["限时", "高转化"] },
  { id: "P005", name: "双十一特惠活动", description: "11月1日-11日，全场课程8折优惠", type: "promotion", status: "draft", template: "festive", qrCodeType: "wechat", views: 892, shares: 45, downloads: 12, conversions: 5, createdAt: "2025-10-18", expireDate: "2025-11-11", color: "from-red-500 to-pink-500", tags: ["草稿"] },
  { id: "P006", name: "结业学员风采展示", description: "优秀学员风采展示，见证成长蜕变", type: "showcase", status: "active", template: "gallery", qrCodeType: "wechat", views: 1567, shares: 234, downloads: 56, conversions: 34, createdAt: "2025-09-15", color: "from-emerald-500 to-teal-500", tags: ["口碑"] },
  { id: "P007", name: "月嫂招聘启事", description: "高薪诚聘月嫂、育婴师，待遇优厚", type: "recruitment", status: "active", template: "professional", qrCodeType: "link", views: 2134, shares: 312, downloads: 89, conversions: 45, createdAt: "2025-10-05", color: "from-blue-500 to-indigo-500", tags: ["招聘"] },
  { id: "P008", name: "春节不打烊", description: "春节期间正常招生，优惠不停歇", type: "promotion", status: "expired", template: "festive", qrCodeType: "wechat", views: 1890, shares: 156, downloads: 78, conversions: 28, createdAt: "2025-01-15", expireDate: "2025-02-15", color: "from-red-600 to-orange-500", tags: [] },
]

const typeConfig = {
  course: { label: "课程招生", color: "bg-blue-100 text-blue-700 border-blue-200" },
  promotion: { label: "营销活动", color: "bg-amber-100 text-amber-700 border-amber-200" },
  showcase: { label: "风采展示", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  recruitment: { label: "招聘海报", color: "bg-purple-100 text-purple-700 border-purple-200" },
}

const statusConfig = {
  active: { label: "已发布", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  draft: { label: "草稿", color: "bg-gray-100 text-gray-600 border-gray-200" },
  expired: { label: "已过期", color: "bg-red-100 text-red-700 border-red-200" },
}

const templateOptions = [
  { value: "modern", label: "现代简约", description: "简洁大气，适合课程推广" },
  { value: "elegant", label: "优雅经典", description: "典雅风格，适合高端服务" },
  { value: "fresh", label: "清新活力", description: "活泼明快，适合年轻受众" },
  { value: "festive", label: "节日喜庆", description: "热烈红火，适合促销活动" },
  { value: "professional", label: "专业商务", description: "专业严谨，适合招聘宣传" },
  { value: "gallery", label: "图集展示", description: "多图展示，适合风采展示" },
]

// Poster Preview Dialog
function PosterPreviewDialog({ poster, trigger }: { poster: Poster; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            海报预览
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Poster Preview */}
          <div className={`aspect-[9/16] rounded-lg bg-gradient-to-br ${poster.color} p-6 flex flex-col relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Header */}
            <div className="relative z-10">
              <Badge className="bg-white/20 text-white text-[10px] border-white/30 mb-2">
                {typeConfig[poster.type].label}
              </Badge>
              <h2 className="text-xl font-bold text-white drop-shadow-lg">{poster.name}</h2>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-white/30" />
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-auto">
              <p className="text-white/90 text-xs mb-3 leading-relaxed">{poster.description}</p>
              <div className="flex items-end justify-between">
                <div className="text-white/70 text-[10px]">
                  <p>长按识别二维码</p>
                  <p>立即咨询报名</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Poster Stats */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-bold">{poster.views.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">浏览</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-bold">{poster.shares}</p>
              <p className="text-[10px] text-muted-foreground">分享</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-bold">{poster.downloads}</p>
              <p className="text-[10px] text-muted-foreground">下载</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-bold text-primary">{poster.conversions}</p>
              <p className="text-[10px] text-muted-foreground">转化</p>
            </div>
          </div>

          {/* Poster Info */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">海报信息</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">海报类型</p>
                <p className="text-xs font-medium">{typeConfig[poster.type].label}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">使用模板</p>
                <p className="text-xs font-medium">{templateOptions.find(t => t.value === poster.template)?.label}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">创建时间</p>
                <p className="text-xs font-medium">{poster.createdAt}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">二维码类型</p>
                <p className="text-xs font-medium">{poster.qrCodeType === "wechat" ? "微信二维码" : poster.qrCodeType === "link" ? "链接二维码" : "自定义"}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <Badge variant="outline" className={cn("text-[10px]", statusConfig[poster.status].color)}>
              {statusConfig[poster.status].label}
            </Badge>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Copy className="h-3 w-3 mr-1" />复制链接</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />下载</Button>
              <Button size="sm" className="h-7 text-xs"><Share2 className="h-3 w-3 mr-1" />分享</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Create Poster Dialog
function CreatePosterDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [posterType, setPosterType] = useState("course")

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新建海报</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            新建海报
          </DialogTitle>
          <DialogDescription className="text-xs">创建推广海报，支持多种模板和自定义设置</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-primary" />基本信息
            </h4>
            
            <div className="space-y-1.5">
              <Label className="text-xs">海报名称</Label>
              <Input placeholder="输入海报名称" className="h-8 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">海报描述</Label>
              <Textarea placeholder="输入海报描述文案" className="text-xs min-h-16 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">海报类型</Label>
                <Select value={posterType} onValueChange={setPosterType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">课程招生</SelectItem>
                    <SelectItem value="promotion">营销活动</SelectItem>
                    <SelectItem value="showcase">风采展示</SelectItem>
                    <SelectItem value="recruitment">招聘海报</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {posterType === "course" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">关联课程</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择课程" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yuesao">高级月嫂培训</SelectItem>
                      <SelectItem value="chankang">产康师认证</SelectItem>
                      <SelectItem value="yuying">育婴师专业班</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {posterType === "promotion" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">有效期至</Label>
                  <Input type="date" className="h-8 text-xs" />
                </div>
              )}
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-primary" />选择模板
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {templateOptions.map((template) => (
                <div key={template.value} className="p-2 rounded-lg border cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className={`aspect-[9/16] rounded bg-gradient-to-br ${
                    template.value === "modern" ? "from-blue-400 to-indigo-500" :
                    template.value === "elegant" ? "from-purple-400 to-pink-500" :
                    template.value === "fresh" ? "from-cyan-400 to-emerald-500" :
                    template.value === "festive" ? "from-red-400 to-orange-500" :
                    template.value === "professional" ? "from-slate-400 to-gray-600" :
                    "from-teal-400 to-blue-500"
                  } flex items-center justify-center mb-1.5`}>
                    <ImageIcon className="h-4 w-4 text-white/50" />
                  </div>
                  <p className="text-[10px] font-medium text-center">{template.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-primary" />二维码设置
            </h4>
            <div className="space-y-1.5">
              <Label className="text-xs">二维码类型</Label>
              <Select defaultValue="wechat">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wechat">微信公众号二维码</SelectItem>
                  <SelectItem value="link">自定义链接二维码</SelectItem>
                  <SelectItem value="custom">上传自定义二维码</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">预览</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">保存草稿</Button>
          <Button size="sm" className="h-7 text-xs"><Sparkles className="h-3 w-3 mr-1" />生成海报</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PostersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPosters = useMemo(() => {
    return posters.filter(p => {
      const matchType = activeTab === "all" || p.type === activeTab
      const matchStatus = statusFilter === "all" || p.status === statusFilter
      const matchSearch = !searchTerm || p.name.includes(searchTerm) || p.description.includes(searchTerm)
      return matchType && matchStatus && matchSearch
    })
  }, [activeTab, statusFilter, searchTerm])

  const stats = useMemo(() => ({
    total: posters.length,
    totalViews: posters.reduce((sum, p) => sum + p.views, 0),
    totalShares: posters.reduce((sum, p) => sum + p.shares, 0),
    totalConversions: posters.reduce((sum, p) => sum + p.conversions, 0),
  }), [])

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">推广海报</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" />{stats.total}张海报</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{stats.totalViews.toLocaleString()}浏览</span>
              <span className="flex items-center gap-1"><Share2 className="h-3 w-3" />{stats.totalShares}分享</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-500" />{stats.totalConversions}转化</span>
            </div>
          </div>
          <CreatePosterDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">全部</TabsTrigger>
              <TabsTrigger value="course" className="text-xs h-6">课程招生</TabsTrigger>
              <TabsTrigger value="promotion" className="text-xs h-6">营销活动</TabsTrigger>
              <TabsTrigger value="showcase" className="text-xs h-6">风采展示</TabsTrigger>
              <TabsTrigger value="recruitment" className="text-xs h-6">招聘海报</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索海报..." className="pl-7 h-7 w-40 text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">已发布</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredPosters.map((poster) => (
                <Card key={poster.id} className="group overflow-hidden hover:shadow-md transition-all">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${poster.color} flex items-center justify-center relative`}>
                    <ImageIcon className="h-10 w-10 text-white/40" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className="bg-white/20 text-white text-[10px] border-white/30 h-5">
                        {typeConfig[poster.type].label}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={cn("text-[10px] h-5", 
                        poster.status === "active" ? "bg-emerald-500/90 text-white border-emerald-400" :
                        poster.status === "draft" ? "bg-gray-500/90 text-white border-gray-400" :
                        "bg-red-500/90 text-white border-red-400"
                      )}>
                        {statusConfig[poster.status].label}
                      </Badge>
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5">
                      <PosterPreviewDialog poster={poster} trigger={
                        <Button size="sm" variant="secondary" className="h-6 text-[10px] shadow-sm"><Eye className="h-3 w-3 mr-1" />预览</Button>
                      } />
                      <Button size="sm" variant="secondary" className="h-6 text-[10px] shadow-sm"><Share2 className="h-3 w-3 mr-1" />分享</Button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold truncate">{poster.name}</h3>
                        <p className="text-[10px] text-muted-foreground truncate">{poster.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />预览</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs"><Copy className="h-3 w-3 mr-2" />复制链接</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs"><Download className="h-3 w-3 mr-2" />下载</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs text-red-600"><Trash2 className="h-3 w-3 mr-2" />删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {poster.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {poster.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-[9px] h-4 px-1.5">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{poster.views}</span>
                        <span className="flex items-center gap-0.5"><Share2 className="h-3 w-3" />{poster.shares}</span>
                        <span className="flex items-center gap-0.5 text-green-600"><TrendingUp className="h-3 w-3" />{poster.conversions}</span>
                      </div>
                      <span>{poster.createdAt}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground text-center mt-3">
              显示 {filteredPosters.length} / {posters.length} 张海报
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
