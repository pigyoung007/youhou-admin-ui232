"use client"

import { useState } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  FileSignature, 
  Copy, 
  Check, 
  MessageSquare, 
  Phone,
  Building2 
} from "lucide-react"

const typeConfig = {
  maternity_service: { label: "月嫂服务", color: "bg-rose-500/10 text-rose-600" },
  infant_care: { label: "育婴师服务", color: "bg-blue-500/10 text-blue-600" },
  postpartum_recovery: { label: "产后康复", color: "bg-teal-500/10 text-teal-600" },
  domestic_service: { label: "家政服务", color: "bg-amber-500/10 text-amber-600" },
  training: { label: "培训服务", color: "bg-purple-500/10 text-purple-600" },
}

interface CreateContractSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string
  customerName?: string
  onContractCreated?: (data: any) => void
}

export function CreateContractSheet({
  open,
  onOpenChange,
  customerId,
  customerName,
  onContractCreated,
}: CreateContractSheetProps) {
  const [step, setStep] = useState(1)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [sendTargets, setSendTargets] = useState<string[]>(["employer", "caregiver", "company"])
  
  // Mock contract link
  const contractLink = "https://sign.youhou.com/c/CT202501011"
  
  const handleCopyLink = (target: string) => {
    navigator.clipboard.writeText(contractLink)
    setCopiedLink(target)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setStep(1)
      setSendTargets(["employer", "caregiver", "company"])
    }
  }

  const handleConfirmSend = () => {
    const contractData = {
      customerId,
      customerName,
      contractLink,
      sendTargets,
      step,
    }
    onContractCreated?.(contractData)
    handleOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-lg">新建合同</SheetTitle>
          <SheetDescription className="text-xs">
            步骤 {step}/4: {step === 1 ? "选择合同模板" : step === 2 ? "填写签约信息" : step === 3 ? "确认合同内容" : "生成签署链接"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 py-4">
              {Object.entries(typeConfig).map(([key, config]) => (
                <button
                  key={key}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  onClick={() => setStep(2)}
                >
                  <Badge className={config.color}>{config.label}</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">
                    标准{config.label}合同模板
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">签约公司</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择公司主体" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yhjs">银川优厚家庭服务有限公司</SelectItem>
                      <SelectItem value="yhmy">银川优厚母婴护理有限公司</SelectItem>
                      <SelectItem value="yhpx">银川优厚职业培训学校</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">合同金额</label>
                  <Input type="number" placeholder="请输入金额" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">雇主(甲方)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="搜索或选择雇主" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zhang">张女士 (138****1234)</SelectItem>
                    <SelectItem value="liu">刘先生 (139****5678)</SelectItem>
                    <SelectItem value="chen">陈女士 (137****9012)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">服务人员(乙方)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="搜索或选择服务人员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="li">李春华 - 金牌月嫂</SelectItem>
                    <SelectItem value="wang">王秀兰 - 高级育婴师</SelectItem>
                    <SelectItem value="zhangm">张美玲 - 产康技师</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">服务开始日期</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">服务结束日期</label>
                  <Input type="date" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">合同类型</span>
                  <span className="font-medium">月嫂服务合同</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">签约公司</span>
                  <span className="font-medium">银川优厚家庭服务有限公司</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">雇主</span>
                  <span className="font-medium">{customerName || "张女士"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">服务人员</span>
                  <span className="font-medium">李春华</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">合同金额</span>
                  <span className="font-medium text-primary">¥18,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">服务周期</span>
                  <span className="font-medium">2025-03-15 至 2025-04-15</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <FileSignature className="h-5 w-5 text-primary" />
                  <span className="font-medium">合同签署链接已生成</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    value={contractLink} 
                    readOnly 
                    className="font-mono text-sm bg-background"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyLink("main")}
                  >
                    {copiedLink === "main" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">签约方人员确认</label>
                  <Badge variant="outline" className="text-xs">共3方需签署</Badge>
                </div>
                
                {[
                  { id: "employer", name: "张女士", role: "甲方(雇主)", phone: "138****1234", avatar: "张" },
                  { id: "caregiver", name: "李春华", role: "乙方(服务人员)", phone: "139****5678", avatar: "李" },
                ].map((person) => (
                  <div key={person.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={sendTargets.includes(person.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSendTargets([...sendTargets, person.id])
                            } else {
                              setSendTargets(sendTargets.filter(t => t !== person.id))
                            }
                          }}
                          className="rounded"
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{person.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.role} · {person.phone}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-xs"
                        onClick={() => handleCopyLink(person.id)}
                      >
                        {copiedLink === person.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        复制链接
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={sendTargets.includes("company")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSendTargets([...sendTargets, "company"])
                          } else {
                            setSendTargets(sendTargets.filter(t => t !== "company"))
                          }
                        }}
                        className="rounded"
                      />
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">银川优厚家庭服务有限公司</p>
                        <p className="text-xs text-muted-foreground">丙方(公司) · 张经理签署</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => handleCopyLink("company")}
                    >
                      {copiedLink === "company" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      复制链接
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">发送方式</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={sendTargets.length === 0}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    推送系统消息 ({sendTargets.length})
                  </Button>
                  <Button size="sm" variant="outline" disabled={sendTargets.length === 0}>
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    发送短信 ({sendTargets.length})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="pt-4 border-t flex gap-2 justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                上一步
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>
                {step === 3 ? "生成签署链接" : "下一步"}
              </Button>
            ) : (
              <Button disabled={sendTargets.length === 0} onClick={handleConfirmSend}>
                确认发送 ({sendTargets.length})
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
