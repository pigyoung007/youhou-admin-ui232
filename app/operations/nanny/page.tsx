import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffListView, type StaffMember } from "@/components/operations/staff-list-view"

const nannies: StaffMember[] = [
  { id: "N001", name: "李春华", age: 35, status: "available", rating: 4.9, orders: 28, experience: "5年", skills: ["月子餐", "早教", "催乳"], price: "¥12800/月" },
  { id: "N002", name: "王秀兰", age: 42, status: "working", rating: 4.8, orders: 45, experience: "10年", skills: ["月子餐", "新生儿护理", "产妇护理"], price: "¥15800/月" },
  { id: "N003", name: "张美玲", age: 38, status: "available", rating: 4.7, orders: 32, experience: "6年", skills: ["双胞胎", "早产儿", "月子餐"], price: "¥18800/月" },
  { id: "N004", name: "陈桂芳", age: 45, status: "vacation", rating: 4.9, orders: 58, experience: "12年", skills: ["高端月嫂", "产康", "月子餐", "营养配餐"], price: "¥22800/月" },
  { id: "N005", name: "刘玉梅", age: 40, status: "working", rating: 4.6, orders: 36, experience: "8年", skills: ["母乳喂养", "早教", "月子餐"], price: "¥13800/月" },
  { id: "N006", name: "赵秀英", age: 36, status: "available", rating: 4.8, orders: 41, experience: "7年", skills: ["新生儿护理", "产妇护理", "催乳"], price: "¥14800/月" },
  { id: "N007", name: "周小红", age: 33, status: "working", rating: 4.5, orders: 22, experience: "4年", skills: ["月子餐", "婴儿抚触"], price: "¥10800/月" },
  { id: "N008", name: "吴美华", age: 48, status: "available", rating: 4.9, orders: 72, experience: "15年", skills: ["高端月嫂", "双胞胎", "早产儿", "月子餐"], price: "¥26800/月" },
]

const statusConfig = {
  available: { label: "待接单", color: "bg-green-100 text-green-700 border-green-200" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  vacation: { label: "休假中", color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function NannyPage() {
  return (
    <AdminLayout>
      <StaffListView
        title="月嫂管理"
        subtitle={`共 ${nannies.length} 位月嫂`}
        staffList={nannies}
        statusConfig={statusConfig}
        avatarColor="bg-rose-100 text-rose-700"
        detailPath="/operations/nanny"
        schedulingPath="/operations/nanny/scheduling"
        staffType="nanny"
      />
    </AdminLayout>
  )
}
