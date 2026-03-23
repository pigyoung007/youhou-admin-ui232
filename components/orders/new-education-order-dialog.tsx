"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CheckCircle2, FileSignature, Trash2, Tag, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { calculateEducationDiscount } from '@/lib/discount-rules'

interface PaymentBill {
  id: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid'
}

interface CourseItem {
  id: string
  name: string
  category: string
  price: number
}

const COURSES_DATA: Record<string, CourseItem[]> = {
  yuesao: [
    { id: 'y1', name: '初级月嫂培训', category: 'yuesao', price: 2800 },
    { id: 'y2', name: '高级月嫂培训', category: 'yuesao', price: 3800 },
    { id: 'y3', name: '金牌月嫂培训', category: 'yuesao', price: 4800 },
  ],
  yuyingshi: [
    { id: 'a1', name: '育婴师初级', category: 'yuyingshi', price: 2000 },
    { id: 'a2', name: '育婴师中级', category: 'yuyingshi', price: 2500 },
    { id: 'a3', name: '育婴师高级', category: 'yuyingshi', price: 3200 },
  ],
  kangyang: [
    { id: 'k1', name: '产康师初级', category: 'kangyang', price: 2800 },
    { id: 'k2', name: '产康师高级', category: 'kangyang', price: 3800 },
  ],
  xiaoyertui: [
    { id: 'x1', name: '小儿推拿培训', category: 'xiaoyertui', price: 3000 },
  ],
}

const COURSE_CATEGORIES = [
  { value: 'yuesao', label: '月嫂培训' },
  { value: 'yuyingshi', label: '育婴培训' },
  { value: 'kangyang', label: '产康培训' },
  { value: 'xiaoyertui', label: '小儿推拿' },
]

export function NewEducationOrderDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  
  // Step 1: Student Info
  const [studentName, setStudentName] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [studentIdCard, setStudentIdCard] = useState('')
  const [studentSource, setStudentSource] = useState('')
  const [studentAddress, setStudentAddress] = useState('')
  const [recruitmentAdvisor, setRecruitmentAdvisor] = useState('')
  
  // Step 2: Courses
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<CourseItem[]>([])
  
  // Step 3: Payment
  const [paymentType, setPaymentType] = useState('full')
  const [discountType, setDiscountType] = useState('')
  const [paymentBills, setPaymentBills] = useState<PaymentBill[]>([])
  
  // Step 4: Agreement
  const [contractNumber, setContractNumber] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleAddCourse = (course: CourseItem) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course])
    }
  }

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId))
  }

  const calculateTotal = () => {
    return selectedCourses.reduce((sum, c) => sum + c.price, 0)
  }

  const calculateDiscount = () => {
    const courseItems = selectedCourses.map(c => ({ name: c.name, price: c.price }))
    const result = calculateEducationDiscount(courseItems)
    return result
  }

  const totalPrice = calculateTotal()
  const discountResult = calculateDiscount()
  const finalPrice = discountResult.finalAmount

  const handleReset = () => {
    setStep(1)
    setStudentName('')
    setStudentPhone('')
    setStudentIdCard('')
    setStudentSource('')
    setStudentAddress('')
    setRecruitmentAdvisor('')
    setSelectedCategory('')
    setSelectedCourses([])
    setPaymentType('full')
    setDiscountType('')
    setContractNumber('')
    setAgreed(false)
  }

  const handleClose = () => {
    setOpen(false)
    handleReset()
  }

  const stepIndicators = [
    { num: 1, label: '学员信息' },
    { num: 2, label: '课程选择' },
    { num: 3, label: '付款信息' },
    { num: 4, label: '协议签约' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => { setOpen(true); handleReset(); }} className="h-7 text-xs">
        <Plus className="h-3 w-3 mr-1" />
        新建订单
      </Button>

      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileSignature className="h-4 w-4 text-primary" />
            新建培训订单
          </DialogTitle>
          <DialogDescription className="text-xs">请按步骤填写学员报名信息，确保信息完整准确</DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-center gap-1">
          {stepIndicators.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                step === s.num ? "bg-primary text-primary-foreground" : 
                step > s.num ? "bg-emerald-100 text-emerald-700" : 
                "bg-muted text-muted-foreground"
              )}>
                {step > s.num ? <CheckCircle2 className="h-3 w-3" /> : <span className="w-4 text-center">{s.num}</span>}
                <span>{s.label}</span>
              </div>
              {i < 3 && <div className={cn("w-4 h-0.5", step > s.num ? "bg-emerald-300" : "bg-muted")} />}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">学员姓名 <span className="text-red-500">*</span></Label>
                  <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="请输入学员姓名" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">联系电话 <span className="text-red-500">*</span></Label>
                  <Input value={studentPhone} onChange={e => setStudentPhone(e.target.value)} placeholder="请输入联系电话" className="h-8 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">身份证号 <span className="text-red-500">*</span></Label>
                  <Input value={studentIdCard} onChange={e => setStudentIdCard(e.target.value)} placeholder="用于办理证书" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">学员来源</Label>
                  <Select value={studentSource} onValueChange={setStudentSource}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择来源" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">线上报名</SelectItem>
                      <SelectItem value="referral">老学员介绍</SelectItem>
                      <SelectItem value="promotion">推广渠道</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">家庭住址</Label>
                <Input value={studentAddress} onChange={e => setStudentAddress(e.target.value)} placeholder="请输入家庭住址" className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">招生顾问 <span className="text-red-500">*</span></Label>
                <Select value={recruitmentAdvisor} onValueChange={setRecruitmentAdvisor}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择招生顾问" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisor1">张顾问</SelectItem>
                    <SelectItem value="advisor2">李顾问</SelectItem>
                    <SelectItem value="advisor3">王顾问</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">培训类型 <span className="text-red-500">*</span></Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="选择培训类型" /></SelectTrigger>
                  <SelectContent>
                    {COURSE_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <div className="space-y-2">
                  <Label className="text-xs">可选课程</Label>
                  <div className="space-y-1.5">
                    {COURSES_DATA[selectedCategory]?.map(course => (
                      <div key={course.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                        <div className="text-xs font-medium">{course.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">¥{course.price}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs bg-transparent"
                            onClick={() => handleAddCourse(course)}
                            disabled={selectedCourses.some(c => c.id === course.id)}
                          >
                            {selectedCourses.some(c => c.id === course.id) ? '已选' : '选择'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg border bg-blue-50">
                <h4 className="text-xs font-medium mb-2 text-blue-900">已选课程 ({selectedCourses.length})</h4>
                {selectedCourses.length > 0 ? (
                  <div className="space-y-1">
                    {selectedCourses.map(course => (
                      <div key={course.id} className="flex items-center justify-between text-xs p-1.5 bg-white rounded">
                        <span>{course.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">¥{course.price}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleRemoveCourse(course.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-blue-700">暂无选课</p>
                )}
              </div>

              {/* 连报信息 */}
              <div className="p-3 rounded-lg border bg-amber-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-amber-900 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    连报优惠
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-800 border-amber-300">
                    选择多门课程可享受连报优惠
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-white text-xs">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="combo2" className="h-3 w-3 rounded border-amber-300" disabled={selectedCourses.length < 2} />
                      <label htmlFor="combo2" className={selectedCourses.length < 2 ? "text-muted-foreground" : ""}>两科连报</label>
                    </div>
                    <span className="text-amber-700 font-medium">-¥200</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white text-xs">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="combo3" className="h-3 w-3 rounded border-amber-300" disabled={selectedCourses.length < 3} />
                      <label htmlFor="combo3" className={selectedCourses.length < 3 ? "text-muted-foreground" : ""}>三科连报</label>
                    </div>
                    <span className="text-amber-700 font-medium">-¥500</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white text-xs">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="combo4" className="h-3 w-3 rounded border-amber-300" disabled={selectedCourses.length < 4} />
                      <label htmlFor="combo4" className={selectedCourses.length < 4 ? "text-muted-foreground" : ""}>四科及以上连报</label>
                    </div>
                    <span className="text-amber-700 font-medium">-¥800</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-700 mt-2">* 连报优惠规则会根据选择的课程自动计算</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border bg-emerald-50 space-y-2">
                <h4 className="text-xs font-medium text-emerald-900 mb-2">课程费用明细</h4>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {selectedCourses.map(course => (
                    <div key={course.id} className="flex justify-between py-1 px-2 rounded bg-white">
                      <span>{course.name}</span>
                      <span className="font-medium">¥{course.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1 mt-1 flex justify-between font-bold text-emerald-900 py-1 px-2">
                    <span>原价合计:</span>
                    <span>¥{totalPrice}</span>
                  </div>
                </div>
              </div>

              {discountResult.appliedRules.length > 0 && (
                <div className="p-3 rounded-lg border bg-blue-50 space-y-2">
                  <h4 className="text-xs font-medium text-blue-900 mb-2 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    优惠规则
                  </h4>
                  <div className="space-y-1.5">
                    {discountResult.appliedRules.map((rule, index) => (
                      <div key={index} className="flex items-start justify-between p-2 rounded bg-white text-xs">
                        <div>
                          <Badge variant="outline" className="mb-1">{rule.name}</Badge>
                          <p className="text-muted-foreground text-[10px]">{rule.description}</p>
                        </div>
                        <span className="font-bold text-blue-600">-¥{rule.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg border bg-primary/5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">原价合计:</span>
                    <span className="font-medium">¥{totalPrice}</span>
                  </div>
                  {discountResult.totalDiscount > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>优惠减免:</span>
                      <span className="font-medium">-¥{discountResult.totalDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold text-primary">
                    <span>最终应付:</span>
                    <span className="text-lg">¥{finalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">支付方式</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">全款支付</SelectItem>
                    <SelectItem value="deposit">定金+尾款 (30%+70%)</SelectItem>
                    <SelectItem value="installment">分期付款</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === 'deposit' && (
                <div className="p-2 rounded-lg border bg-amber-50 text-xs text-amber-900">
                  <div className="flex justify-between mb-1">
                    <span>定金 (30%):</span>
                    <span>¥{Math.round(finalPrice * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>尾款 (70%):</span>
                    <span>¥{Math.round(finalPrice * 0.7)}</span>
                  </div>
                </div>
              )}

              {/* 分期付款账单管理 */}
              {paymentType === 'installment' && (
                <div className="p-3 rounded-lg border bg-amber-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-amber-900">付款账单</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs bg-white"
                      onClick={() => {
                        const newBill: PaymentBill = {
                          id: Date.now().toString(),
                          amount: Math.round(finalPrice / (paymentBills.length + 1)),
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
                  
                  {/* 账单统计 */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">订单总额</p>
                      <p className="font-bold text-primary">¥{finalPrice.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">已付金额</p>
                      <p className="font-bold text-emerald-600">¥{paymentBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-white text-center">
                      <p className="text-muted-foreground text-[10px]">待付金额</p>
                      <p className="font-bold text-amber-600">¥{paymentBills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* 账单列表 */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {paymentBills.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">暂无账单，点击"添加账单"创建分期</p>
                    ) : (
                      paymentBills.map((bill, index) => (
                        <div key={bill.id} className="rounded border bg-white text-xs overflow-hidden">
                          {/* 顶部：期号 + 操作区 */}
                          <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border-b">
                            <Badge variant="outline" className="text-[10px] h-5">第 {index + 1} 期</Badge>
                            <div className="flex items-center gap-1.5">
                              <Select
                                value={bill.status}
                                onValueChange={(value: 'pending' | 'paid') => {
                                  const updated = paymentBills.map(b =>
                                    b.id === bill.id ? { ...b, status: value } : b
                                  )
                                  setPaymentBills(updated)
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
                                onClick={() => setPaymentBills(paymentBills.filter(b => b.id !== bill.id))}
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
                                  const updated = paymentBills.map(b =>
                                    b.id === bill.id ? { ...b, amount: Number(e.target.value) } : b
                                  )
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
                                  const updated = paymentBills.map(b =>
                                    b.id === bill.id ? { ...b, dueDate: e.target.value } : b
                                  )
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
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border bg-muted/20">
                <h4 className="text-xs font-medium mb-2">合同与协议</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded border bg-white">
                    <p className="font-medium">培训服务协议</p>
                    <p className="text-muted-foreground">包含培训内容、费用、权利义务等</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>合同编号</Label>
                    <Input value={contractNumber} onChange={e => setContractNumber(e.target.value)} placeholder="系统自动生成或手动输入" className="h-8 text-xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="w-3 h-3"
                    />
                    <label htmlFor="agree" className="text-xs cursor-pointer">我已阅读并同意培训服务协议</label>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                <h4 className="text-xs font-medium mb-2 text-emerald-900">报名信息汇总</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">学员姓名</span><span className="font-medium">{studentName || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">联系电话</span><span className="font-medium">{studentPhone || '-'}</span></div>
                  <div className="flex justify-between col-span-2"><span className="text-muted-foreground">报名课程</span><span className="font-medium">{selectedCourses.length} 门</span></div>
                  <div className="flex justify-between col-span-2"><span className="text-muted-foreground">学费合计</span><span className="font-medium text-primary">¥{finalPrice}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-4 py-3 border-t flex-shrink-0 bg-background">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
              上一步
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">保存草稿</Button>
              {step < 4 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>下一步</Button>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" disabled={!agreed}>
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
