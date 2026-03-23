'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, FileSignature, CheckCircle2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ServiceItem {
  id: string
  serviceType: string
  productName: string
  originalPrice: number
  startDate: string
  endDate: string
  quantity: number
}

interface PaymentBill {
  id: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid'
  uploadedFile?: string
}

export function NewServiceOrderDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])

  // 第1步：客户信息
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    idCard: '',
    source: '',
    address: '',
    maternalAdvisor: '',
    recruitmentAdvisor: '',
    expectedDelivery: '',
    expectedStartDate: '',
    specialRequirements: [] as string[],
  })

  // 第2步：服务选择
  const [newService, setNewService] = useState({
    serviceType: '',
    productName: '',
    originalPrice: 0,
    startDate: '',
    endDate: '',
    quantity: 1,
  })

  // 第3步：付款信息
  const [paymentInfo, setPaymentInfo] = useState({
    totalAmount: 0,
    paidAmount: 0,
    paymentType: 'full',
    bills: [] as PaymentBill[],
    discounts: [] as { name: string; amount: number }[],
  })

  const serviceTypes = [
    { value: 'yuesao', label: '月嫂服务' },
    { value: 'yuying', label: '育婴师服务' },
    { value: 'kangfu', label: '产康服务' },
    { value: 'baoming', label: '保姆服务' },
  ]

  const serviceProducts: Record<string, { value: string; label: string; price: number }[]> = {
    yuesao: [
      { value: 'golden', label: '金牌月嫂', price: 12800 },
      { value: 'premium', label: '高级月嫂', price: 10800 },
      { value: 'standard', label: '标准月嫂', price: 8800 },
    ],
    yuying: [
      { value: 'senior', label: '高级育婴师', price: 8800 },
      { value: 'mid', label: '中级育婴师', price: 6800 },
      { value: 'junior', label: '初级育婴师', price: 5800 },
    ],
    kangfu: [
      { value: 'kangfu_premium', label: '产康师高级', price: 9800 },
      { value: 'kangfu_standard', label: '产康师标准', price: 7800 },
    ],
    baoming: [
      { value: 'live_in', label: '住家保姆', price: 6800 },
      { value: 'hourly', label: '钟点保姆', price: 150 },
    ],
  }

  const sources = [
    '线上渠道',
    '介绍转介',
    '抖音推广',
    '小红书',
    '线下推广',
    '医院合作',
  ]

  const advisors = [
    '张顾问',
    '李顾问',
    '王顾问',
    '赵顾问',
  ]

  const handleAddService = () => {
    if (!newService.serviceType || !newService.productName) return
    
    const serviceItem: ServiceItem = {
      id: Date.now().toString(),
      serviceType: newService.serviceType,
      productName: newService.productName,
      originalPrice: newService.originalPrice,
      startDate: newService.startDate,
      endDate: newService.endDate,
      quantity: newService.quantity,
    }
    
    setServiceItems([...serviceItems, serviceItem])
    setNewService({
      serviceType: '',
      productName: '',
      originalPrice: 0,
      startDate: '',
      endDate: '',
      quantity: 1,
    })
  }

  const handleRemoveService = (id: string) => {
    setServiceItems(serviceItems.filter(item => item.id !== id))
  }

  const handleServiceProductChange = (productName: string) => {
    const serviceType = newService.serviceType
    const products = serviceProducts[serviceType] || []
    const selected = products.find(p => p.value === productName)
    setNewService({
      ...newService,
      productName,
      originalPrice: selected?.price || 0,
    })
  }

  const calculateTotalAmount = () => {
    const subtotal = serviceItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
    const discountTotal = paymentInfo.discounts.reduce((sum, d) => sum + d.amount, 0)
    return Math.max(0, subtotal - discountTotal)
  }

  const handleCreatePaymentBill = (amount: number, days: number) => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + days)
    const bill: PaymentBill = {
      id: Date.now().toString(),
      amount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
    }
    setPaymentInfo({
      ...paymentInfo,
      bills: [...paymentInfo.bills, bill],
    })
  }

  const stepIndicator = (
    <div className="flex items-center justify-center gap-1 py-3 border-b bg-muted/20 px-2 overflow-x-auto">
      {[
        { num: 1, label: '客户信息' },
        { num: 2, label: '服务选择' },
        { num: 3, label: '付款信息' },
        { num: 4, label: '协议签约' },
      ].map((s, i) => (
        <React.Fragment key={s.num}>
          <button
            onClick={() => step >= s.num && setStep(s.num)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0",
              step === s.num 
                ? "bg-primary text-primary-foreground" 
                : step > s.num 
                ? "bg-emerald-100 text-emerald-700 cursor-pointer" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step > s.num ? <CheckCircle2 className="h-3 w-3" /> : <span className="w-3.5 text-center font-bold text-[11px]">{s.num}</span>}
            <span className="text-[11px]">{s.label}</span>
          </button>
          {i < 3 && <div className={cn("w-4 h-0.5 shrink-0", step > s.num ? "bg-emerald-300" : "bg-muted")} />}
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        新建订单
      </button>

      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileSignature className="h-4 w-4 text-primary" />
            新建服务订单
          </DialogTitle>
          <DialogDescription className="text-xs">请按步骤填写客户及服务信息，确保信息完整准确</DialogDescription>
        </DialogHeader>

        {stepIndicator}

        <div className="flex-1 overflow-y-auto p-4">
          {/* 第1步：客户信息 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">客户姓名 <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="请输入客户姓名" 
                    className="h-8 text-xs"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">联系电话 <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="请输入联系电话" 
                    className="h-8 text-xs"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">身份证号</Label>
                  <Input 
                    placeholder="请输入身份证号" 
                    className="h-8 text-xs"
                    value={customerInfo.idCard}
                    onChange={e => setCustomerInfo({...customerInfo, idCard: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">客户来源</Label>
                  <Select value={customerInfo.source} onValueChange={v => setCustomerInfo({...customerInfo, source: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">家庭住址</Label>
                <Input 
                  placeholder="请输入家庭住址" 
                  className="h-8 text-xs"
                  value={customerInfo.address}
                  onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">母婴顾问</Label>
                  <Select value={customerInfo.maternalAdvisor} onValueChange={v => setCustomerInfo({...customerInfo, maternalAdvisor: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择顾问" />
                    </SelectTrigger>
                    <SelectContent>
                      {advisors.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">招生顾问 <span className="text-red-500">*</span></Label>
                  <Select value={customerInfo.recruitmentAdvisor} onValueChange={v => setCustomerInfo({...customerInfo, recruitmentAdvisor: v})}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="选择顾问" />
                    </SelectTrigger>
                    <SelectContent>
                      {advisors.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">预产期时间</Label>
                  <Input 
                    type="date"
                    className="h-8 text-xs"
                    value={customerInfo.expectedDelivery}
                    onChange={e => setCustomerInfo({...customerInfo, expectedDelivery: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">要求上户时间</Label>
                  <Input 
                    type="date"
                    className="h-8 text-xs"
                    value={customerInfo.expectedStartDate}
                    onChange={e => setCustomerInfo({...customerInfo, expectedStartDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">特殊要求</Label>
                <Textarea 
                  placeholder="如有特殊要求，请详细描述..." 
                  className="text-xs"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* 第2步：服务选择 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border bg-blue-50">
                <p className="text-xs font-medium text-blue-900 mb-3">添加服务项目</p>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">服务类型</Label>
                      <Select value={newService.serviceType} onValueChange={v => {
                        setNewService({...newService, serviceType: v, productName: '', originalPrice: 0})
                      }}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">服务产品</Label>
                      <Select value={newService.productName} onValueChange={handleServiceProductChange}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="选择产品" />
                        </SelectTrigger>
                        <SelectContent>
                          {(serviceProducts[newService.serviceType] || []).map(p => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">开始日期</Label>
                      <Input 
                        type="date"
                        className="h-7 text-xs"
                        value={newService.startDate}
                        onChange={e => setNewService({...newService, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">结束日期</Label>
                      <Input 
                        type="date"
                        className="h-7 text-xs"
                        value={newService.endDate}
                        onChange={e => setNewService({...newService, endDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">数量</Label>
                      <Input 
                        type="number"
                        className="h-7 text-xs"
                        min="1"
                        value={newService.quantity}
                        onChange={e => setNewService({...newService, quantity: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full h-7 text-xs"
                    onClick={handleAddService}
                    disabled={!newService.serviceType || !newService.productName}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    添加服务
                  </Button>
                </div>
              </div>

              {serviceItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium">已选择服务 ({serviceItems.length})</p>
                  {serviceItems.map(item => (
                    <div key={item.id} className="p-2.5 rounded-lg border bg-white flex items-center justify-between">
                      <div className="text-xs flex-1">
                        <p className="font-medium">{serviceProducts[item.serviceType]?.find(p => p.value === item.productName)?.label || item.productName}</p>
                        <p className="text-muted-foreground text-[10px]">¥{item.originalPrice.toLocaleString()} × {item.quantity}件 = ¥{(item.originalPrice * item.quantity).toLocaleString()}</p>
                        <p className="text-muted-foreground text-[10px]">{item.startDate} 至 {item.endDate}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveService(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 第3步：付款信息 */}
          {step === 3 && (
            <div className="space-y-4">
              {/* 服务项目和基础费用 */}
              <div className="p-3 rounded-lg border bg-emerald-50">
                <p className="text-xs font-medium text-emerald-900 mb-3">服务项目费用</p>
                <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto">
                  {serviceItems.map(item => (
                    <div key={item.id} className="flex justify-between py-1 px-2 rounded bg-white">
                      <span>{serviceProducts[item.serviceType]?.find(p => p.value === item.productName)?.label}</span>
                      <span className="font-medium">¥{(item.originalPrice * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1.5 mt-1.5 flex justify-between font-bold bg-white rounded px-2 py-1">
                    <span>服务项目合计</span>
                    <span className="text-emerald-700">¥{calculateTotalAmount().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 额外费用（双胞胎、早产儿等） */}
              <div className="p-3 rounded-lg border bg-blue-50 space-y-2">
                <p className="text-xs font-medium text-blue-900 mb-2">额外费用</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-white text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5" onChange={e => setPaymentInfo({...paymentInfo, hasTwins: e.target.checked})} />
                      <span>双胞胎服务费 (50%)</span>
                    </label>
                    <Input type="number" placeholder="或输入金额" className="h-6 w-20 text-xs" defaultValue={50} />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5" onChange={e => setPaymentInfo({...paymentInfo, hasPremature: e.target.checked})} />
                      <span>早产儿服务费</span>
                    </label>
                    <span className="font-medium text-blue-600">¥2,000</span>
                  </div>
                </div>
              </div>

              {/* 费用总汇 */}
              <div className="p-3 rounded-lg border bg-primary/5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务项目:</span>
                    <span className="font-medium">¥{calculateTotalAmount().toLocaleString()}</span>
                  </div>
                  {paymentInfo.hasTwins && (
                    <div className="flex justify-between text-blue-600">
                      <span>双胞胎费:</span>
                      <span className="font-medium">¥{Math.round(calculateTotalAmount() * 0.5).toLocaleString()}</span>
                    </div>
                  )}
                  {paymentInfo.hasPremature && (
                    <div className="flex justify-between text-blue-600">
                      <span>早产儿费:</span>
                      <span className="font-medium">¥2,000</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold text-primary">
                    <span>订单总费用:</span>
                    <span className="text-lg">¥{(calculateTotalAmount() + (paymentInfo.hasTwins ? Math.round(calculateTotalAmount() * 0.5) : 0) + (paymentInfo.hasPremature ? 2000 : 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 付款方案 */}
              <div className="p-3 rounded-lg border bg-blue-50">
                <p className="text-xs font-medium text-blue-900 mb-3">付款方案</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="full" 
                      id="full"
                      checked={paymentInfo.paymentType === 'full'}
                      onChange={e => setPaymentInfo({...paymentInfo, paymentType: e.target.value})}
                      className="h-3.5 w-3.5"
                    />
                    <label htmlFor="full" className="text-xs cursor-pointer">全款支付</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="installment" 
                      id="installment"
                      checked={paymentInfo.paymentType === 'installment'}
                      onChange={e => setPaymentInfo({...paymentInfo, paymentType: e.target.value})}
                      className="h-3.5 w-3.5"
                    />
                    <label htmlFor="installment" className="text-xs cursor-pointer">分期付款 (预付10% + 定金20% + 尾款70%)</label>
                  </div>
                </div>
              </div>

              {/* 付款账单 */}
              {paymentInfo.paymentType === 'installment' && (
                <div className="p-3 rounded-lg border bg-amber-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-amber-900">付款账单</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs bg-white"
                      onClick={() => {
                        const totalAmount = calculateTotalAmount() + (paymentInfo.hasTwins ? Math.round(calculateTotalAmount() * 0.5) : 0) + (paymentInfo.hasPremature ? 2000 : 0)
                        const newBill: PaymentBill = {
                          id: Date.now().toString(),
                          amount: Math.round(totalAmount / (paymentInfo.bills.length + 1)),
                          dueDate: new Date(Date.now() + (paymentInfo.bills.length + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          status: 'pending',
                        }
                        setPaymentInfo({ ...paymentInfo, bills: [...paymentInfo.bills, newBill] })
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      添加账单
                    </Button>
                  </div>
                  
                  {/* 账单统计 */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">订单总额</p>
                      <p className="font-bold text-primary">¥{(calculateTotalAmount() + (paymentInfo.hasTwins ? Math.round(calculateTotalAmount() * 0.5) : 0) + (paymentInfo.hasPremature ? 2000 : 0)).toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">已付金额</p>
                      <p className="font-bold text-emerald-600">¥{paymentInfo.bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">待付金额</p>
                      <p className="font-bold text-amber-600">¥{paymentInfo.bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* 账单列表 */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {paymentInfo.bills.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">暂无账单，点击"添加账单"创建分期</p>
                    ) : (
                      paymentInfo.bills.map((bill, index) => (
                        <div key={bill.id} className="rounded border bg-white text-xs overflow-hidden">
                          {/* 顶部：期号 + 操作区 */}
                          <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border-b">
                            <Badge variant="outline" className="text-[10px] h-5">第 {index + 1} 期</Badge>
                            <div className="flex items-center gap-1.5">
                              <Select
                                value={bill.status}
                                onValueChange={(value: 'pending' | 'paid') => {
                                  const updated = paymentInfo.bills.map(b =>
                                    b.id === bill.id ? { ...b, status: value } : b
                                  )
                                  setPaymentInfo({ ...paymentInfo, bills: updated })
                                }}
                              >
                                <SelectTrigger className={cn("h-6 w-20 text-[10px]",
                                  bill.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                )}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">待付款</SelectItem>
                                  <SelectItem value="paid">已付款</SelectItem>
                                </SelectContent>
                              </Select>
                              {bill.status === 'paid' && (
                                <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1">
                                  <Upload className="h-3 w-3" />
                                  凭证
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => setPaymentInfo({ ...paymentInfo, bills: paymentInfo.bills.filter(b => b.id !== bill.id) })}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {/* 底部：金额 + 日期 */}
                          <div className="flex items-center gap-3 px-2 py-1.5">
                            <div className="flex items-center gap-1.5 flex-1">
                              <span className="text-muted-foreground text-[10px] shrink-0">金额:</span>
                              <Input
                                type="number"
                                value={bill.amount}
                                onChange={(e) => {
                                  const updated = paymentInfo.bills.map(b =>
                                    b.id === bill.id ? { ...b, amount: Number(e.target.value) } : b
                                  )
                                  setPaymentInfo({ ...paymentInfo, bills: updated })
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
                                  const updated = paymentInfo.bills.map(b =>
                                    b.id === bill.id ? { ...b, dueDate: e.target.value } : b
                                  )
                                  setPaymentInfo({ ...paymentInfo, bills: updated })
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
          )}

          {/* 第4步：协议签约 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
                <h4 className="text-xs font-medium flex items-center gap-1.5">
                  <FileSignature className="h-3.5 w-3.5 text-primary" />
                  合同与协议
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">服务协议</p>
                      <p className="text-[10px] text-muted-foreground">包含服务内容、费用、权利义务等</p>
                    </div>
                    <Select defaultValue="unsigned">
                      <SelectTrigger className="h-7 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unsigned">待签署</SelectItem>
                        <SelectItem value="signed">已签署</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 space-y-3">
                <h4 className="text-xs font-medium text-emerald-800">订单信息汇总</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">客户姓名</span>
                    <span className="font-medium">{customerInfo.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">联系电话</span>
                    <span className="font-medium">{customerInfo.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务类型</span>
                    <span className="font-medium">{serviceItems.length > 0 ? `${serviceItems.length}项服务` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">订单总额</span>
                    <span className="font-medium text-primary">¥{calculateTotalAmount().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-3 border-t flex-shrink-0 bg-background">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent h-7 text-xs"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
            >
              上一步
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent h-7 text-xs">保存草稿</Button>
              {step < 4 ? (
                <Button size="sm" className="h-7 text-xs" onClick={() => setStep(step + 1)}>下一步</Button>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  提交订单
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
