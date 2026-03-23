// 培训订单优惠规则计算引擎

export interface DiscountRule {
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'conditional'
  amount: number
  condition?: string
}

export interface DiscountResult {
  originalTotal: number
  appliedRules: DiscountRule[]
  totalDiscount: number
  finalAmount: number
}

// 培训课程优惠规则
export const educationDiscountRules = {
  // 阶梯折扣规则：根据报名科目数量
  tiered: [
    { courses: 1, discount: 0, description: '单科' },
    { courses: 2, discount: 0, description: '双科' },
    { courses: 3, discount: 0.05, description: '3科95折' },
    { courses: 4, discount: 0.05, description: '4科95折' },
    { courses: 5, discount: 0.1, description: '5科及以上9折' },
  ],
  
  // 连报减免规则：固定减免金额
  consecutive: [
    { courses: 5, reduction: 500, description: '5科连报减500' },
    { courses: 6, reduction: 600, description: '6科连报减600' },
    { courses: 7, reduction: 800, description: '7科及以上连报减800' },
  ],
  
  // 特定科目直降规则：5科及以上享受
  directReduction: {
    minCourses: 5,
    courses: ['产康', '小儿推拿'],
    reduction: 1500,
    description: '5科及以上，产康/小儿推拿直降1500',
    mutuallyExclusive: true,
  },
  
  // 套餐减免规则
  bundle: [
    { price: 14000, discount: 500, description: '14000套餐优惠500' },
    { price: 12000, discount: 400, description: '12000套餐优惠400' },
  ],
  
  // 单科最低价限制
  minimumPrice: 500,
}

// 服务订单优惠规则和额外费用
export const serviceOrderRules = {
  // 额外费用项
  extras: {
    twins: {
      description: '双胞胎费用',
      types: {
        yuesao: 'percentage', // 月嫂按合同金额百分比
        yuyingshi: 1000, // 育婴师固定1000
      },
      percentage: 0.5, // 月嫂为50%
    },
    premature: {
      description: '早产儿费用',
      fixed: 2000,
    },
    distance: {
      description: '异地服务费',
      fixed: 1000,
    },
    overtime: {
      description: '加班费',
      hourly: 150,
    },
    deposit: {
      description: '保证金',
      fixed: 2000,
      note: '仅展示不计入合计',
    },
  },
  
  // 分期付款规则
  installmentRules: {
    threeStage: {
      description: '分三期：预付10% + 定金20% + 尾款70%',
      stages: [
        { name: '预付款', percentage: 0.1 },
        { name: '定金', percentage: 0.2 },
        { name: '尾款', percentage: 0.7 },
      ],
    },
  },
  
  // 付款方式
  paymentMethods: [
    { value: 'full', label: '全款支付' },
    { value: 'deposit', label: '预付款+定金+尾款' },
    { value: 'monthly', label: '按月付款' },
  ],
}

// 计算培训订单优惠
export function calculateEducationDiscount(
  courseItems: Array<{ name: string; price: number }>,
  _customDiscount?: number
): DiscountResult {
  const originalTotal = courseItems.reduce((sum, item) => sum + item.price, 0)
  const courseCount = courseItems.length
  const appliedRules: DiscountRule[] = []
  let totalDiscount = 0

  // 检查单科最低价限制
  const hasLowPriceCourses = courseItems.some(item => item.price < educationDiscountRules.minimumPrice)

  // 应用阶梯折扣
  const tierRule = educationDiscountRules.tiered.find(t => t.courses === courseCount)
  if (tierRule && tierRule.discount > 0) {
    const discountAmount = originalTotal * tierRule.discount
    appliedRules.push({
      name: tierRule.description,
      description: `${courseCount}科课程享受${(tierRule.discount * 100).toFixed(0)}折优惠`,
      type: 'percentage',
      amount: discountAmount,
    })
    totalDiscount += discountAmount
  }

  // 应用连报减免
  const consecutiveRule = educationDiscountRules.consecutive.find(c => c.courses <= courseCount)
  if (consecutiveRule) {
    appliedRules.push({
      name: consecutiveRule.description,
      description: `连报${consecutiveRule.courses}科减免${consecutiveRule.reduction}元`,
      type: 'fixed',
      amount: consecutiveRule.reduction,
    })
    totalDiscount += consecutiveRule.reduction
  }

  // 检查特定科目直降规则
  const hasTargetCourse = courseItems.some(item => 
    educationDiscountRules.directReduction.courses.some(c => item.name.includes(c))
  )
  if (hasTargetCourse && courseCount >= educationDiscountRules.directReduction.minCourses) {
    appliedRules.push({
      name: educationDiscountRules.directReduction.description,
      description: `${courseCount}科及以上，特定科目直降1500元`,
      type: 'fixed',
      amount: educationDiscountRules.directReduction.reduction,
    })
    totalDiscount += educationDiscountRules.directReduction.reduction
  }

  // 确保最终金额不低于最低价限制
  const finalAmount = Math.max(originalTotal - totalDiscount, educationDiscountRules.minimumPrice * courseCount)

  return {
    originalTotal,
    appliedRules,
    totalDiscount: Math.round(totalDiscount),
    finalAmount: Math.round(finalAmount),
  }
}

// 计算服务订单额外费用
export function calculateServiceOrderExtras(
  baseAmount: number,
  serviceType: string,
  extras: {
    isTwins?: boolean
    isPremature?: boolean
    isDistance?: boolean
    overtimeHours?: number
  }
): { description: string; amount: number }[] {
  const results: { description: string; amount: number }[] = []

  if (extras.isTwins) {
    if (serviceType === 'yuesao') {
      const amount = baseAmount * serviceOrderRules.extras.twins.percentage
      results.push({
        description: serviceOrderRules.extras.twins.description,
        amount: Math.round(amount),
      })
    } else if (serviceType === 'yuyingshi') {
      results.push({
        description: serviceOrderRules.extras.twins.description,
        amount: serviceOrderRules.extras.twins.types.yuyingshi as number,
      })
    }
  }

  if (extras.isPremature) {
    results.push({
      description: serviceOrderRules.extras.premature.description,
      amount: serviceOrderRules.extras.premature.fixed,
    })
  }

  if (extras.isDistance) {
    results.push({
      description: serviceOrderRules.extras.distance.description,
      amount: serviceOrderRules.extras.distance.fixed,
    })
  }

  if (extras.overtimeHours && extras.overtimeHours > 0) {
    results.push({
      description: `${serviceOrderRules.extras.overtime.description}(${extras.overtimeHours}小时)`,
      amount: extras.overtimeHours * (serviceOrderRules.extras.overtime.hourly as number),
    })
  }

  return results
}

// 计算分期付款计划
export function calculateInstallmentPlan(
  totalAmount: number,
  installmentType: string
): Array<{ stage: string; percentage: number; amount: number; daysLater: number }> {
  if (installmentType === 'threeStage') {
    const stages = serviceOrderRules.installmentRules.threeStage.stages
    return stages.map((stage, index) => ({
      stage: stage.name,
      percentage: stage.percentage,
      amount: Math.round(totalAmount * stage.percentage),
      daysLater: (index + 1) * 15, // 每期间隔15天
    }))
  }

  // 默认全款
  return [
    {
      stage: '全款',
      percentage: 1,
      amount: totalAmount,
      daysLater: 0,
    },
  ]
}

export default {
  calculateEducationDiscount,
  calculateServiceOrderExtras,
  calculateInstallmentPlan,
}
