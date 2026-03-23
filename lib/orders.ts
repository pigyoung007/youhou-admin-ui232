// 订单数据结构定义
export interface CourseItem {
  id: string
  courseId: string
  courseName: string
  categoryType: 'yuesao' | 'yuyingshi' | 'kangyang' | 'xiaoyertui'
  originalPrice: number
  finalPrice: number
}

export interface ServiceItem {
  id: string
  serviceId: string
  serviceType: 'yuesao' | 'yuyingshi' | 'kangyang'
  serviceLevel: 'primary' | 'intermediate' | 'advanced'
  originalPrice: number
  finalPrice: number
  startDate: string
  endDate: string
  days: number
}

export interface EducationOrder {
  id?: string
  step: 1 | 2 | 3 | 4
  studentInfo: {
    name: string
    phone: string
    idNumber: string
    source?: string
    address?: string
    recruitmentAdvisor?: string
  }
  courses: CourseItem[]
  payment: {
    totalAmount: number
    discountAmount: number
    finalAmount: number
    installments: PaymentInstallment[]
    feeType: string
  }
  agreement?: {
    contractNumber?: string
    signed?: boolean
  }
}

export interface ServiceOrder {
  id?: string
  step: 1 | 2 | 3 | 4
  customerInfo: {
    name: string
    phone: string
    idNumber?: string
    source?: string
    address?: string
    maternalAdvisor?: string
    recruitmentAdvisor?: string
    expectedDueDate?: string
    expectedStartDate?: string
    specialRequirements?: string[]
  }
  services: ServiceItem[]
  additionalFees: AdditionalFee[]
  payment: {
    totalAmount: number
    discountAmount: number
    finalAmount: number
    installments: PaymentInstallment[]
    feeType: string
  }
  agreement?: {
    contractNumber?: string
    signed?: boolean
  }
}

export interface PaymentInstallment {
  id: string
  installmentNo: number
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  voucherUrl?: string
  remark?: string
}

export interface AdditionalFee {
  id: string
  name: string
  amount: number
  type: 'twins' | 'premature' | 'remote' | 'overtime' | 'custom'
  description?: string
}

export interface DiscountRule {
  id: string
  name: string
  type: 'tiered' | 'multiCourse' | 'directReduction' | 'package' | 'custom'
  description: string
  amount: number
  condition?: string
  isApplied?: boolean
}

// 优惠规则配置（根据附件规则）
export const EDUCATION_DISCOUNT_RULES: DiscountRule[] = [
  {
    id: 'tiered_3',
    name: '阶梯折扣-3科',
    type: 'tiered',
    description: '第3科及以上打95折',
    amount: 0.95,
    condition: 'courses >= 3'
  },
  {
    id: 'tiered_5',
    name: '阶梯折扣-5科',
    type: 'tiered',
    description: '第5科及以上打9折',
    amount: 0.9,
    condition: 'courses >= 5'
  },
  {
    id: 'multi_5',
    name: '多科连报减免-5科',
    type: 'multiCourse',
    description: '5科减500元',
    amount: 500,
    condition: 'courses === 5'
  },
  {
    id: 'multi_6',
    name: '多科连报减免-6科',
    type: 'multiCourse',
    description: '6科减600元',
    amount: 600,
    condition: 'courses === 6'
  },
  {
    id: 'multi_7plus',
    name: '多科连报减免-7科+',
    type: 'multiCourse',
    description: '7科及以上减800元',
    amount: 800,
    condition: 'courses >= 7'
  },
  {
    id: 'direct_kangyang',
    name: '产康直降',
    type: 'directReduction',
    description: '5科及以上时产康直降1500元',
    amount: 1500,
    condition: 'courses >= 5 && hasKangyang'
  },
  {
    id: 'direct_xiaoyertui',
    name: '小儿推拿直降',
    type: 'directReduction',
    description: '5科及以上时小儿推拿直降1500元',
    amount: 1500,
    condition: 'courses >= 5 && hasXiaoyertui'
  },
  {
    id: 'package_14000',
    name: '套餐优惠-14000',
    type: 'package',
    description: '14000元套餐整体减免',
    amount: 0,
    condition: 'totalPrice === 14000'
  },
  {
    id: 'package_12000',
    name: '套餐优惠-12000',
    type: 'package',
    description: '12000元套餐整体减免',
    amount: 0,
    condition: 'totalPrice === 12000'
  }
]

// 服务订单额外费用规则
export const SERVICE_ADDITIONAL_FEES = [
  {
    id: 'twins',
    name: '双胞胎费用',
    type: 'twins',
    description: '按合同金额百分比 / 育婴师固定1000元'
  },
  {
    id: 'premature',
    name: '早产儿费用',
    type: 'premature',
    description: '固定金额'
  },
  {
    id: 'remote',
    name: '异地服务费',
    type: 'remote',
    description: '按距离收费'
  },
  {
    id: 'overtime',
    name: '加班费',
    type: 'overtime',
    description: '按时薪计算'
  }
]

// 优惠规则计算引擎
export function calculateEducationDiscounts(courses: CourseItem[]): {
  applicableRules: DiscountRule[]
  totalDiscount: number
  bestOption: DiscountRule | null
} {
  const applicableRules: DiscountRule[] = []
  let totalDiscount = 0
  let bestOption: DiscountRule | null = null

  const courseCount = courses.length
  const hasKangyang = courses.some(c => c.categoryType === 'kangyang')
  const hasXiaoyertui = courses.some(c => c.categoryType === 'xiaoyertui')
  const totalPrice = courses.reduce((sum, c) => sum + c.originalPrice, 0)

  // 检查阶梯折扣
  if (courseCount >= 5) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'tiered_5')!)
  } else if (courseCount >= 3) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'tiered_3')!)
  }

  // 检查多科连报减免
  if (courseCount === 5) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'multi_5')!)
  } else if (courseCount === 6) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'multi_6')!)
  } else if (courseCount >= 7) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'multi_7plus')!)
  }

  // 检查直降规则（仅当5科及以上且与其他优惠互斥时）
  if (courseCount >= 5) {
    if (hasKangyang) {
      applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'direct_kangyang')!)
    }
    if (hasXiaoyertui) {
      applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'direct_xiaoyertui')!)
    }
  }

  // 检查套餐优惠
  if (totalPrice === 14000) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'package_14000')!)
  } else if (totalPrice === 12000) {
    applicableRules.push(EDUCATION_DISCOUNT_RULES.find(r => r.id === 'package_12000')!)
  }

  return {
    applicableRules,
    totalDiscount,
    bestOption
  }
}
