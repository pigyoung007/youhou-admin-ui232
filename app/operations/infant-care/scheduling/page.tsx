import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffScheduling, type SchedulingStaff } from "@/components/scheduling/staff-scheduling"

const staffList: SchedulingStaff[] = [
  {
    id: "IC001",
    name: "周婷婷",
    level: "高级育婴师",
    rating: 4.9,
    phone: "138****1234",
    status: "working",
    price: "¥280/天",
    consultant: "张顾问",
    consultantId: "E001",
    availableDate: "2025-03-01",
    lastClient: "王先生家",
    lastEndDate: "2025-01-14",
    notes: "",
    currentOrder: { customer: "刘先生家", endDate: "2025-02-28", location: "兴庆区" },
    schedule: [
      { id: "S001", startDate: "2025-01-15", endDate: "2025-02-28", customer: "刘先生家", status: "working", location: "兴庆区" },
      { id: "S002", startDate: "2025-03-10", endDate: "2025-05-10", customer: "王女士家", status: "booked", location: "金凤区" },
    ],
  },
  {
    id: "IC002",
    name: "吴丽丽",
    level: "金牌育婴师",
    rating: 4.8,
    phone: "139****5678",
    status: "gap",
    price: "¥320/天",
    gapDays: 12,
    nextAvailable: "2025-02-25",
    consultant: "李顾问",
    consultantId: "E002",
    availableDate: "2025-02-13",
    lastClient: "李先生家",
    lastEndDate: "2025-02-12",
    notes: "需关注，空档超7天",
    schedule: [
      { id: "S003", startDate: "2025-02-25", endDate: "2025-04-25", customer: "张先生家", status: "booked", location: "西夏区" },
    ],
  },
  {
    id: "IC003",
    name: "郑小红",
    level: "高级育婴师",
    rating: 4.7,
    phone: "137****9012",
    status: "available",
    price: "¥260/天",
    gapDays: 18,
    consultant: "张顾问",
    consultantId: "E001",
    availableDate: "2025-01-26",
    lastClient: "孙先生家",
    lastEndDate: "2025-01-07",
    notes: "重点推荐",
    schedule: [],
  },
  {
    id: "IC004",
    name: "孙美华",
    level: "特级育婴师",
    rating: 4.9,
    phone: "136****3456",
    status: "working",
    price: "¥450/天",
    consultant: "王顾问",
    consultantId: "E003",
    availableDate: "2025-03-16",
    lastClient: "周先生家",
    lastEndDate: "2025-01-19",
    notes: "VIP客户指定",
    currentOrder: { customer: "陈女士家", endDate: "2025-03-15", location: "贺兰县" },
    schedule: [
      { id: "S004", startDate: "2025-01-20", endDate: "2025-03-15", customer: "陈女士家", status: "working", location: "贺兰县" },
    ],
  },
  {
    id: "IC005",
    name: "钱小敏",
    level: "育婴师",
    rating: 4.6,
    phone: "135****7890",
    status: "available",
    price: "¥240/天",
    gapDays: 10,
    consultant: "李顾问",
    consultantId: "E002",
    availableDate: "2025-01-26",
    lastClient: "郑先生家",
    lastEndDate: "2025-01-15",
    notes: "新人育婴师",
    schedule: [],
  },
  {
    id: "IC006",
    name: "李晓燕",
    level: "高级育婴师",
    rating: 4.8,
    phone: "138****2345",
    status: "gap",
    price: "¥300/天",
    gapDays: 6,
    nextAvailable: "2025-02-15",
    consultant: "王顾问",
    consultantId: "E003",
    availableDate: "2025-02-09",
    lastClient: "吴先生家",
    lastEndDate: "2025-02-08",
    notes: "",
    schedule: [
      { id: "S005", startDate: "2025-02-15", endDate: "2025-04-15", customer: "赵先生家", status: "booked", location: "兴庆区" },
    ],
  },
]

export default function InfantCareSchedulingPage() {
  return (
    <AdminLayout>
      <StaffScheduling
        title="育婴师排班管理"
        staffList={staffList}
        avatarColor="bg-cyan-100 text-cyan-700"
      />
    </AdminLayout>
  )
}
