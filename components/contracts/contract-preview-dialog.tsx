"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  FileText,
  Building2,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  Check,
  Clock,
} from "lucide-react"

interface ContractPreviewProps {
  contractId: string
  contractNo?: string
  title: string
  type: string
  typeName: string
  amount: number
  status: "signed" | "pending"
  signedAt?: string | null
  // 合同各方信息
  company?: { name: string; creditCode?: string }
  employer?: { name: string; phone: string; idCard?: string }
  caregiver?: { name: string; role: string; phone?: string; idCard?: string }
  // 服务信息
  serviceStartDate?: string
  serviceEndDate?: string
  serviceAddress?: string
  // 触发按钮自定义
  trigger?: React.ReactNode
}

// 模拟合同正文内容
const getContractContent = (type: string, data: ContractPreviewProps) => {
  const companyName = data.company?.name || "银川优厚家庭服务有限公司"
  const employerName = data.employer?.name || "甲方"
  const caregiverName = data.caregiver?.name || "乙方服务人员"
  const amount = data.amount?.toLocaleString() || "0"
  const startDate = data.serviceStartDate || "____年__月__日"
  const endDate = data.serviceEndDate || "____年__月__日"
  const address = data.serviceAddress || "________________"

  return {
    title: data.title || "服务合同",
    sections: [
      {
        title: "合同编号",
        content: data.contractNo || "CT____________",
      },
      {
        title: "合同各方",
        content: `甲方（雇主）：${employerName}
身份证号：${data.employer?.idCard || "________________"}
联系电话：${data.employer?.phone || "________________"}

乙方（服务人员）：${caregiverName}
服务角色：${data.caregiver?.role || "________________"}
联系电话：${data.caregiver?.phone || "________________"}

丙方（服务公司）：${companyName}
统一社会信用代码：${data.company?.creditCode || "91640100MA7XXXXXX"}`,
      },
      {
        title: "第一条 服务内容",
        content: `1.1 丙方为甲方提供${data.typeName || "家政"}服务，指派乙方作为服务人员。

1.2 服务内容包括但不限于：
（一）${type === "maternity_service" || type === "main" ? "产妇护理：产后身体恢复指导、营养餐制作、伤口护理等" : "日常家务服务"}；
（二）${type === "maternity_service" || type === "main" ? "新生儿护理：喂养、洗澡、抚触、早教互动等" : "家庭成员照护"}；
（三）${type === "maternity_service" || type === "main" ? "家务协助：与产妇、新生儿相关的家务劳动" : "其他约定服务事项"}。

1.3 乙方应按照丙方的服务标准和规范提供服务，保证服务质量。`,
      },
      {
        title: "第二条 服务期限",
        content: `2.1 服务期限自 ${startDate} 起至 ${endDate} 止。

2.2 服务地点：${address}

2.3 如需延长或缩短服务期限，双方应提前协商并签署补充协议。`,
      },
      {
        title: "第三条 服务费用",
        content: `3.1 本合同服务费用总计人民币：¥${amount}元（大写：________________元整）。

3.2 付款方式：
（一）定金：甲方应在签订本合同时支付定金人民币________元；
（二）尾款：甲方应在服务开始前支付剩余款项人民币________元。

3.3 费用包含服务人员工资、管理费、保险费等，不含服务人员食宿费用。`,
      },
      {
        title: "第四条 甲方权利与义务",
        content: `4.1 甲方有权要求乙方按照约定提供服务，并对服务质量进行监督。

4.2 甲方应按时支付服务费用，并为乙方提供必要的工作条件和生活条件。

4.3 甲方应尊重乙方人格，不得辱骂、歧视或侵害乙方合法权益。

4.4 甲方有权在合理范围内对服务内容提出调整要求。`,
      },
      {
        title: "第五条 乙方权利与义务",
        content: `5.1 乙方应按照本合同约定和丙方服务标准提供服务。

5.2 乙方享有法定休息时间，每日工作时间不超过10小时，每周至少休息一天。

5.3 乙方应遵守甲方家庭的生活习惯和规章制度，保守甲方家庭隐私。

5.4 乙方有权拒绝从事与本合同约定无关的工作。`,
      },
      {
        title: "第六条 丙方权利与义务",
        content: `6.1 丙方负责对乙方进行岗前培训和定期技能考核。

6.2 丙方应对乙方服务质量进行监督，定期回访甲方。

6.3 丙方为乙方购买意外伤害保险和家政服务责任保险。

6.4 如乙方无法继续提供服务，丙方应在3日内安排同等资质的替换人员。`,
      },
      {
        title: "第七条 合同变更与解除",
        content: `7.1 经三方协商一致，可以变更或解除本合同。

7.2 甲方提前解除合同的，已付费用按实际服务天数结算，剩余部分退还。

7.3 因乙方原因无法继续服务的，丙方应安排替换人员或退还剩余费用。

7.4 因不可抗力致使合同无法履行的，三方互不承担违约责任。`,
      },
      {
        title: "第八条 违约责任",
        content: `8.1 甲方逾期支付服务费用的，应按日支付应付金额0.5%的违约金。

8.2 乙方未按约定提供服务或服务质量不达标的，丙方应予以整改或更换人员。

8.3 因乙方故意或重大过失造成甲方损失的，由丙方先行赔偿后向乙方追偿。`,
      },
      {
        title: "第九条 争议解决",
        content: `9.1 因本合同引起的争议，三方应协商解决。

9.2 协商不成的，可向丙方所在地人民法院提起诉讼。`,
      },
      {
        title: "第十条 其他约定",
        content: `10.1 本合同一式三份，甲、乙、丙三方各执一份，具有同等法律效力。

10.2 本合同自三方签字（盖章）之日起生效。

10.3 本合同未尽事宜，由三方另行协商并签订补充协议。`,
      },
    ],
  }
}

export function ContractPreviewDialog({
  contractId,
  contractNo,
  title,
  type,
  typeName,
  amount,
  status,
  signedAt,
  company,
  employer,
  caregiver,
  serviceStartDate,
  serviceEndDate,
  serviceAddress,
  trigger,
}: ContractPreviewProps) {
  const [zoom, setZoom] = useState(100)

  const contractContent = getContractContent(type, {
    contractId,
    contractNo,
    title,
    type,
    typeName,
    amount,
    status,
    signedAt,
    company,
    employer,
    caregiver,
    serviceStartDate,
    serviceEndDate,
    serviceAddress,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <div>
              <DialogTitle className="text-sm font-medium">{title}</DialogTitle>
              <p className="text-xs text-muted-foreground">{contractNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`text-xs ${
                status === "signed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {status === "signed" ? "已签署" : "待签署"}
            </Badge>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.max(70, zoom - 10))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-10 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.min(130, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Printer className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Download className="h-3.5 w-3.5 mr-1" />
              下载
            </Button>
          </div>
        </div>

        {/* Contract Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="p-6" style={{ fontSize: `${zoom}%` }}>
            {/* Contract Paper */}
            <div className="max-w-2xl mx-auto bg-background shadow-sm border rounded-sm px-8 py-6">
              {/* Contract Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold tracking-wide mb-1">{contractContent.title}</h1>
                <p className="text-xs text-muted-foreground">{contractNo}</p>
              </div>

              {/* Contract Body */}
              <div className="space-y-4 text-sm leading-relaxed">
                {contractContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-sm mb-1.5">{section.title}</h3>
                    <p className="whitespace-pre-line text-muted-foreground text-xs pl-3">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Signature Area */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-sm mb-4">签署区域</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {/* Party A - Employer */}
                  <div className="p-3 border rounded bg-muted/30">
                    <p className="font-medium mb-2">甲方（雇主）</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>签名：{employer?.name || "________"}</p>
                      <p>日期：{signedAt?.split(" ")[0] || "____-__-__"}</p>
                    </div>
                    {status === "signed" && (
                      <div className="text-green-600 text-[10px] flex items-center gap-1 mt-2">
                        <Check className="h-3 w-3" />
                        已电子签名
                      </div>
                    )}
                  </div>

                  {/* Party B - Caregiver */}
                  <div className="p-3 border rounded bg-muted/30">
                    <p className="font-medium mb-2">乙方（服务人员）</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>签名：{caregiver?.name || "________"}</p>
                      <p>日期：{signedAt?.split(" ")[0] || "____-__-__"}</p>
                    </div>
                    {status === "signed" && (
                      <div className="text-green-600 text-[10px] flex items-center gap-1 mt-2">
                        <Check className="h-3 w-3" />
                        已电子签名
                      </div>
                    )}
                  </div>

                  {/* Party C - Company */}
                  <div className="p-3 border rounded bg-muted/30">
                    <p className="font-medium mb-2">丙方（公司）</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>盖章：优厚家政</p>
                      <p>日期：{signedAt?.split(" ")[0] || "____-__-__"}</p>
                    </div>
                    {status === "signed" && (
                      <div className="text-green-600 text-[10px] flex items-center gap-1 mt-2">
                        <Check className="h-3 w-3" />
                        已加盖电子章
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-3 border-t text-center text-[10px] text-muted-foreground">
                <p>本合同由银川优厚家庭服务有限公司提供电子签约服务</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t bg-background shrink-0">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5" />
              <span>¥{amount.toLocaleString()}</span>
            </div>
            {serviceStartDate && serviceEndDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{serviceStartDate.slice(5)} ~ {serviceEndDate.slice(5)}</span>
              </div>
            )}
            {serviceAddress && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[150px]">{serviceAddress}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {status === "pending" && (
              <Button size="sm" className="h-7 text-xs">发送签署提醒</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
