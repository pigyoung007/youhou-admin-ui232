import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffListView, type StaffMember } from "@/components/operations/staff-list-view"

const technicians: StaffMember[] = [
  { id: "T001", name: "赵丽娜", age: 32, status: "available", rating: 4.9, orders: 156, experience: "6年", skills: ["产后修复", "盆底康复", "腹直肌"], price: "¥380/次" },
  { id: "T002", name: "孙晓燕", age: 29, status: "working", rating: 4.8, orders: 98, experience: "4年", skills: ["产后塑形", "中医调理", "经络疏通"], price: "¥320/次" },
  { id: "T003", name: "周婷婷", age: 35, status: "available", rating: 4.7, orders: 203, experience: "8年", skills: ["骨盆修复", "乳腺疏通", "产后瑜伽"], price: "¥420/次" },
  { id: "T004", name: "王美丽", age: 38, status: "working", rating: 4.9, orders: 278, experience: "10年", skills: ["高端产康", "腹直肌", "盆底康复", "体态矫正"], price: "¥580/次" },
  { id: "T005", name: "李小芳", age: 26, status: "available", rating: 4.5, orders: 45, experience: "2年", skills: ["产后塑形", "基础产康"], price: "¥260/次" },
  { id: "T006", name: "张秀珍", age: 41, status: "vacation", rating: 4.8, orders: 312, experience: "12年", skills: ["高端产康", "中医调理", "满月发汗", "骨盆修复"], price: "¥680/次" },
]

const statusConfig = {
  available: { label: "空闲", color: "bg-green-100 text-green-700 border-green-200" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  vacation: { label: "休假中", color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function TechPage() {
  return (
    <AdminLayout>
      <StaffListView
        title="产康师管理"
        subtitle={`共 ${technicians.length} 位产康师`}
        staffList={technicians}
        statusConfig={statusConfig}
        avatarColor="bg-teal-100 text-teal-700"
        detailPath="/operations/tech"
        schedulingPath="/operations/scheduling"
        staffType="tech"
      />
    </AdminLayout>
  )
}
