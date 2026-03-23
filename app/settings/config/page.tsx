"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, 
  Globe, 
  Palette, 
  Database, 
  Shield, 
  Save,
  Upload
} from "lucide-react"

export default function ConfigPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">系统配置</h1>
            <p className="text-muted-foreground">管理系统基础配置和参数</p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            保存配置
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">基础设置</CardTitle>
                  <CardDescription>系统基本信息配置</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>系统名称</Label>
                <Input defaultValue="优厚家庭服务管理系统" />
              </div>
              <div className="space-y-2">
                <Label>系统Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">优</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    上传Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>公司简介</Label>
                <Textarea 
                  rows={3}
                  defaultValue="优厚家庭服务专注于为家庭提供专业的母婴护理、产后康复和家政培训服务。"
                />
              </div>
              <div className="space-y-2">
                <Label>客服电话</Label>
                <Input defaultValue="400-888-8888" />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">显示设置</CardTitle>
                  <CardDescription>界面显示和主题配置</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">深色模式</p>
                  <p className="text-xs text-muted-foreground truncate">启用深色主题界面</p>
                </div>
                <Switch className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">紧凑模式</p>
                  <p className="text-xs text-muted-foreground truncate">减少界面间距</p>
                </div>
                <Switch className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">侧边栏折叠</p>
                  <p className="text-xs text-muted-foreground truncate">默认折叠侧边栏</p>
                </div>
                <Switch className="shrink-0" />
              </div>
              <div className="space-y-2">
                <Label>每页显示条数</Label>
                <Input type="number" defaultValue="20" />
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Database className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">数据设置</CardTitle>
                  <CardDescription>数据存储和备份配置</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">自动备份</p>
                  <p className="text-xs text-muted-foreground truncate">每日凌晨自动备份数据</p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">操作日志</p>
                  <p className="text-xs text-muted-foreground truncate">记录用户操作日志</p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="space-y-2">
                <Label>数据保留天数</Label>
                <Input type="number" defaultValue="365" />
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Database className="h-4 w-4 mr-2" />
                立即备份
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base">安全设置</CardTitle>
                  <CardDescription>系统安全和访问控制</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">双因素认证</p>
                  <p className="text-xs text-muted-foreground truncate">登录时需要验证码</p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">登录IP限制</p>
                  <p className="text-xs text-muted-foreground truncate">仅允许指定IP访问</p>
                </div>
                <Switch className="shrink-0" />
              </div>
              <div className="space-y-2">
                <Label>会话超时（分钟）</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label>密码最小长度</Label>
                <Input type="number" defaultValue="8" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
