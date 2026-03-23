import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffListView, type StaffMember } from "@/components/operations/staff-list-view"

const staff: StaffMember[] = [
  { id: "IC001", name: "周婷婷", age: 28, status: "available", rating: 4.9, orders: 42, experience: "5年", skills: ["早教", "辅食制作", "睡眠训练"], location: "兴庆区", price: "¥280/天" },
  { id: "IC002", name: "吴丽丽", age: 32, status: "working", rating: 4.8, orders: 68, experience: "8年", skills: ["双胞胎", "早产儿护理", "感统训练"], location: "金凤区", price: "¥320/天" },
  { id: "IC003", name: "郑小红", age: 35, status: "available", rating: 4.7, orders: 53, experience: "6年", skills: ["辅食制作", "婴儿按摩", "早教"], location: "西夏区", price: "¥260/天" },
  { id: "IC004", name: "孙美华", age: 40, status: "vacation", rating: 4.9, orders: 95, experience: "12年", skills: ["高端育婴", "英语启蒙", "蒙氏早教"], location: "贺兰县", price: "¥450/天" },
  { id: "IC005", name: "钱小敏", age: 29, status: "working", rating: 4.6, orders: 38, experience: "4年", skills: ["早教", "睡眠训练", "辅食制作"], location: "兴庆区", price: "¥240/天" },
  { id: "IC006", name: "李晓燕", age: 34, status: "available", rating: 4.8, orders: 61, experience: "7年", skills: ["婴儿游泳", "抚触按摩", "早教"], location: "金凤区", price: "¥300/天" },
]

const statusConfig = {
  available: { label: "待接单", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  vacation: { label: "休假中", color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function InfantCarePage() {
  return (
    <AdminLayout>
      <StaffListView
        title="育婴师管理"
        subtitle={`共 ${staff.length} 位育婴师`}
        staffList={staff}
        statusConfig={statusConfig}
        avatarColor="bg-cyan-100 text-cyan-700"
        detailPath="/operations/infant-care"
        schedulingPath="/operations/infant-care/scheduling"
        staffType="infant-care"
      />
    </AdminLayout>
  )
}
