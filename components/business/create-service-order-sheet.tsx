"use client"

import React, { useState } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  GraduationCap, Home, CheckCircle2, X, Plus, Trash2, Upload, Tag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateServiceOrderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string
  customerName?: string
  customerPhone?: string
  onOrderCreated?: (data: any) => void
}

// 订单子类型
const orderSubTypes = [
  { id: 'training', label: '培训订单', icon: GraduationCap, description: '学员培训报名订单' },
  { id: 'service', label: '服务订单', icon: Home, description: '家政服务订单' },
]

// 培训订单课程
const availableCourses = [
  { id: '1', name: '母婴护理师培训', price: 3980, duration: '15天' },
  { id: '2', name: '高级月嫂培训', price: 5980, duration: '30天' },
  { id: '3', name: '育婴师培训', price: 3580, duration: '12天' },
  { id: '4', name: '催乳师培训', price: 2980, duration: '7天' },
  { id: '5', name: '产后康复师培训', price: 4580, duration: '20天' },
]

// 服务项目
const serviceItems = [
  { id: '1', name: '金牌月嫂26天', price: 18800 },
  { id: '2', name: '金牌月嫂52天', price: 35600 },
  { id: '3', name: '育婴师月度服务', price: 8800 },
  { id: '4', name: '产后康复套餐', price: 6800 },
]

interface PaymentBill {
  id: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid'
}

export function CreateServiceOrderSheet({
  open,
  onOpenChange,
  customerId,
  customerName: initialCustomerName,
  customerPhone: initialCustomerPhone,
  onOrderCreated,
}: CreateServiceOrderSheetProps) {
  const [orderType, setOrderType] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  
  // 培训订单状态
  const [studentName, setStudentName] = useState(initialCustomerName || "")
  const [studentPhone, setStudentPhone] = useState(initialCustomerPhone || "")
  const [studentIdCard, setStudentIdCard] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<typeof availableCourses>([])
  
  // 服务订单状态
  const [customerName, setCustomerName] = useState(initialCustomerName || "")
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone || "")
  const [expectedDate, setExpectedDate] = useState("")
  const [serviceAddress, setServiceAddress] = useState("")
  const [selectedServices, setSelectedServices] = useState<typeof serviceItems>([])
  
  // 付款信息
  const [paymentType, setPaymentType] = useState("full")
  const [paymentBills, setPaymentBills] = useState<PaymentBill[]>([])

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      // 重置所有状态
      setOrderType(null)
      setStep(1)
      setStudentName(initialCustomerName || "")
      setStudentPhone(initialCustomerPhone || "")
      setStudentIdCard("")
      setSelectedCourses([])
      setCustomerName(initialCustomerName || "")
      setCustomerPhone(initialCustomerPhone || "")
      setExpectedDate("")
      setServiceAddress("")
      setSelectedServices([])
      setPaymentType("full")
      setPaymentBills([])
    }
  }

  const getSteps = () => {
    if (orderType === 'training') {
      return ['学员信息', '课程选择', '付款信息', '协议签约']
    }
    return ['客户信息', '服务选择', '付款信息', '协议签约']
  }

  const calculateTotal = () => {
    if (orderType === 'training') {
      return selectedCourses.reduce((sum, c) => sum + c.price, 0)
    }
    return selectedServices.reduce((sum, s) => sum + s.price, 0)
  }

  const handleConfirm = () => {
    const orderData = {
      customerId,
      orderType,
      ...(orderType === 'training' 
        ? { studentName, studentPhone, studentIdCard, courses: selectedCourses }
        : { customerName, customerPhone, expectedDate, serviceAddress, services: selectedServices }
      ),
      paymentType,
      paymentBills,
      totalAmount: calculateTotal(),
    }
    onOrderCreated?.(orderData)
    handleOpenChange(false)
  }

  // 步骤指示器
  const renderStepIndicator = () => {
    const steps = getSteps()
    return (
      <div className="flex items-center justify-center gap-1 py-3 border-b bg-muted/20 px-2">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => step > i + 1 && setStep(i + 1)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0",
                step === i + 1
                  ? "bg-primary text-primary-foreground"
                  : step > i + 1
                  ? "bg-emerald-100 text-emerald-700 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {step > i + 1 ? <CheckCircle2 className="h-3 w-3" /> : <span className="w-3.5 text-center font-bold text-[11px]">{i + 1}</span>}
              <span className="text-[11px]">{s}</span>
            </button>
            {i < steps.length - 1 && <div className={cn("w-4 h-0.5 shrink-0", step > i + 1 ? "bg-emerald-300" : "bg-muted")} />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // 培训订单表单
  const renderTrainingForm = () => (
    <>
      {step === 1 && (
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">学员姓名 <span className="text-destructive">*</span></Label>
              <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="请输入学员姓名" className="h-8 text-xs mt-1" />
            </div>
            <div>
              <Label className="text-xs">联系电话 <span className="text-destructive">*</span></Label>
              <Input value={studentPhone} onChange={e => setStudentPhone(e.target.value)} placeholder="请输入联系电话" className="h-8 text-xs mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">身份证号 <span className="text-destructive">*</span></Label>
            <Input value={studentIdCard} onChange={e => setStudentIdCard(e.target.value)} placeholder="用于办理证书" className="h-8 text-xs mt-1" />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3 p-4">
          <Label className="text-xs">选择课程</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableCourses.map(course => {
              const isSelected = selectedCourses.some(c => c.id === course.id)
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id))
                    } else {
                      setSelectedCourses([...selectedCourses, course])
                    }
                  }}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">周期: {course.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">¥{course.price}</p>
                      {isSelected && <Badge variant="secondary" className="text-[10px]">已选</Badge>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {selectedCourses.length > 0 && (
            <div className="p-2 rounded bg-emerald-50 text-xs">
              已选 {selectedCourses.length} 门课程，合计: <span className="font-bold">¥{calculateTotal()}</span>
            </div>
          )}
        </div>
      )}
    </>
  )

  // 服务订单表单
  const renderServiceForm = () => (
    <>
      {step === 1 && (
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">客户姓名 <span className="text-destructive">*</span></Label>
              <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="请输入客户姓名" className="h-8 text-xs mt-1" />
            </div>
            <div>
              <Label className="text-xs">联系电话 <span className="text-destructive">*</span></Label>
              <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="请输入联系电话" className="h-8 text-xs mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">预产期/服务开始日期</Label>
            <Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} className="h-8 text-xs mt-1" />
          </div>
          <div>
            <Label className="text-xs">服务地址</Label>
            <Textarea value={serviceAddress} onChange={e => setServiceAddress(e.target.value)} placeholder="请输入服务地址" className="text-xs mt-1" rows={2} />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3 p-4">
          <Label className="text-xs">选择服务项目</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {serviceItems.map(item => {
              const isSelected = selectedServices.some(s => s.id === item.id)
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices(selectedServices.filter(s => s.id !== item.id))
                    } else {
                      setSelectedServices([...selectedServices, item])
                    }
                  }}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">¥{item.price.toLocaleString()}</p>
                      {isSelected && <Badge variant="secondary" className="text-[10px]">已选</Badge>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {selectedServices.length > 0 && (
            <div className="p-2 rounded bg-emerald-50 text-xs">
              已选 {selectedServices.length} 项服务，合计: <span className="font-bold">¥{calculateTotal().toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </>
  )

  // 付款信息表单（共用）
  const renderPaymentForm = () => (
    <div className="space-y-3 p-4">
      <div className="p-3 rounded-lg border bg-primary/5">
        <div className="flex justify-between text-sm">
          <span>订单总额:</span>
          <span className="font-bold text-primary">¥{calculateTotal().toLocaleString()}</span>
        </div>
      </div>
      <div>
        <Label className="text-xs">支付方式</Label>
        <Select value={paymentType} onValueChange={setPaymentType}>
          <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="full">全款支付</SelectItem>
            <SelectItem value="deposit">定金+尾款</SelectItem>
            <SelectItem value="installment">分期付款</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {paymentType === 'installment' && (
        <div className="p-3 rounded-lg border bg-amber-50 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-900">付款账单</p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs bg-white"
              onClick={() => {
                const newBill: PaymentBill = {
                  id: Date.now().toString(),
                  amount: Math.round(calculateTotal() / (paymentBills.length + 1)),
                  dueDate: new Date(Date.now() + (paymentBills.length + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  status: 'pending',
                }
                setPaymentBills([...paymentBills, newBill])
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              添加账单
            </Button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {paymentBills.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">点击"添加账单"创建分期</p>
            ) : (
              paymentBills.map((bill, index) => (
                <div key={bill.id} className="rounded border bg-white text-xs overflow-hidden">
                  <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border-b">
                    <Badge variant="outline" className="text-[10px] h-5">第 {index + 1} 期</Badge>
                    <div className="flex items-center gap-1.5">
                      <Select
                        value={bill.status}
                        onValueChange={(value: 'pending' | 'paid') => {
                          const updated = paymentBills.map(b => b.id === bill.id ? { ...b, status: value } : b)
                          setPaymentBills(updated)
                        }}
                      >
                        <SelectTrigger className={cn("h-6 w-20 text-[10px]",
                          bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">待付款</SelectItem>
                          <SelectItem value="paid">已付款</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => setPaymentBills(paymentBills.filter(b => b.id !== bill.id))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 py-1.5">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-muted-foreground text-[10px] shrink-0">金额:</span>
                      <Input
                        type="number"
                        value={bill.amount}
                        onChange={(e) => {
                          const updated = paymentBills.map(b => b.id === bill.id ? { ...b, amount: Number(e.target.value) } : b)
                          setPaymentBills(updated)
                        }}
                        className="h-6 text-xs min-w-0"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-muted-foreground text-[10px] shrink-0">日期:</span>
                      <Input
                        type="date"
                        value={bill.dueDate}
                        onChange={(e) => {
                          const updated = paymentBills.map(b => b.id === bill.id ? { ...b, dueDate: e.target.value } : b)
                          setPaymentBills(updated)
                        }}
                        className="h-6 text-[10px] min-w-0"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )

  // 协议签约表单（共用）
  const renderSignatureForm = () => (
    <div className="space-y-3 p-4">
      <div className="p-4 rounded-lg border bg-muted/30">
        <h4 className="font-medium text-sm mb-3">订单确认信息</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">订单类型:</span>
            <span>{orderType === 'training' ? '培训订单' : '服务订单'}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">{orderType === 'training' ? '学员姓名' : '客户姓名'}:</span>
            <span>{orderType === 'training' ? studentName : customerName}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">联系电话:</span>
            <span>{orderType === 'training' ? studentPhone : customerPhone}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">{orderType === 'training' ? '已选课程' : '已选服务'}:</span>
            <span>{orderType === 'training' ? selectedCourses.length : selectedServices.length} 项</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">支付方式:</span>
            <span>{paymentType === 'full' ? '全款支付' : paymentType === 'deposit' ? '定金+尾款' : '分期付款'}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-primary">
            <span>订单总额:</span>
            <span>¥{calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-3 rounded-lg border bg-amber-50 text-xs text-amber-800">
        <p className="font-medium mb-1">签约须知</p>
        <p>请确认以上信息无误后提交订单，系统将自动生成电子协议供双方签署。</p>
      </div>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-base">新建订单</SheetTitle>
              <SheetDescription className="text-xs">
                {!orderType ? '请选择订单类型' : orderType === 'training' ? '新建培训订单' : '新建服务订单'}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 订单类型选择 */}
          {!orderType && (
            <div className="p-4 space-y-3">
              <p className="text-sm font-medium">请选择订单类型:</p>
              <div className="grid grid-cols-2 gap-3">
                {orderSubTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id)}
                    className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <type.icon className="h-8 w-8 mb-2 text-primary" />
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 已选择订单类型后显示步骤表单 */}
          {orderType && (
            <>
              {/* 订单类型切换标签 */}
              <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/10">
                {orderSubTypes.map(type => (
                  <Button
                    key={type.id}
                    variant={orderType === type.id ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("h-7 text-xs gap-1.5", orderType === type.id && "bg-primary/10")}
                    onClick={() => {
                      setOrderType(type.id)
                      setStep(1)
                    }}
                  >
                    <type.icon className="h-3 w-3" />
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* 步骤指示器 */}
              {renderStepIndicator()}

              {/* 表单内容 */}
              <div className="flex-1 overflow-y-auto">
                {orderType === 'training' && renderTrainingForm()}
                {orderType === 'service' && renderServiceForm()}
                {step === 3 && renderPaymentForm()}
                {step === 4 && renderSignatureForm()}
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => step > 1 ? setStep(step - 1) : setOrderType(null)}
                >
                  {step === 1 ? '返回选择' : '上一步'}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">保存草稿</Button>
                  {step < 4 ? (
                    <Button size="sm" onClick={() => setStep(step + 1)}>下一步</Button>
                  ) : (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirm}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      提交订单
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
