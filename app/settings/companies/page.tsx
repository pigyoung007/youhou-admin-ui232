"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Phone, Mail, Edit, Plus, CheckCircle2 } from "lucide-react"

const companies = [
  { 
    id: 1,
    name: "银川优厚家庭服务有限公司",
    shortName: "银川总部",
    type: "headquarters",
    address: "银川市金凤区北京路正源街交叉路口瑞银财富中心C座7楼",
    phone: "0951-8888888",
    email: "yinchuan@youhou.com",
    license: "91640100MA76XXXXX",
    status: "active"
  },
  { 
    id: 2,
    name: "优厚家庭服务（西安）有限公司",
    shortName: "西安分公司",
    type: "branch",
    address: "西安市雁塔区高新路88号领先时代广场1801",
    phone: "029-88888888",
    email: "xian@youhou.com",
    license: "91610131MA71XXXXX",
    status: "active"
  },
  { 
    id: 3,
    name: "优厚母婴护理培训中心",
    shortName: "培训中心",
    type: "training",
    address: "银川市金凤区北京路正源街交叉路口瑞银财富中心C座8楼",
    phone: "0951-8888889",
    email: "training@youhou.com",
    license: "91640100MA76XXXXY",
    status: "active"
  },
]

const typeLabels = {
  headquarters: { label: "总部", color: "bg-blue-100 text-blue-700 border-blue-200" },
  branch: { label: "分公司", color: "bg-purple-100 text-purple-700 border-purple-200" },
  training: { label: "培训中心", color: "bg-amber-100 text-amber-700 border-amber-200" },
}

export default function CompaniesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">公司主体</h1>
            <p className="text-muted-foreground">管理公司及分支机构信息</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            添加主体
          </Button>
        </div>

        {/* Companies List */}
        <div className="grid gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-all hover:border-primary/30">
              <CardContent className="p-4 lg:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
                    <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground text-sm lg:text-base truncate">{company.name}</h3>
                        <Badge variant="outline" className={`text-xs shrink-0 ${typeLabels[company.type as keyof typeof typeLabels].color}`}>
                          {typeLabels[company.type as keyof typeof typeLabels].label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 shrink-0">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>运营中</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">简称: {company.shortName}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-2 lg:gap-3 mt-3 text-sm">
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span className="text-xs lg:text-sm line-clamp-2">{company.address}</span>
                        </div>
                        <div className="space-y-1 text-muted-foreground text-xs lg:text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{company.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[10px] lg:text-xs text-muted-foreground mt-2 lg:mt-3 truncate">
                        统一社会信用代码: <span className="tabular-nums">{company.license}</span>
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                    <Edit className="h-4 w-4 mr-1.5" />
                    编辑
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
