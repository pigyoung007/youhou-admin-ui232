"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, CheckCircle, DollarSign, Clock, AlertCircle, Eye, Settings } from "lucide-react"
import { SalaryDetailDialog } from "./salary-detail-dialog"
import Link from "next/link"

interface PayrollRecord {
  id: string
  name: string
  role: string
  attendanceDays: number
  baseSalary: number
  commission: number
  deductions: number
  adjustment: number
  finalPayout: number
  status: "pending" | "approved" | "paid"
}

const mockPayroll: PayrollRecord[] = [
  {
    id: "P001",
    name: "王美丽",
    role: "月嫂",
    attendanceDays: 26,
    baseSalary: 8000,
    commission: 2400,
    deductions: 500,
    adjustment: 0,
    finalPayout: 9900,
    status: "pending",
  },
  {
    id: "P002",
    name: "李芳芳",
    role: "产康师",
    attendanceDays: 22,
    baseSalary: 6000,
    commission: 3200,
    deductions: 400,
    adjustment: 200,
    finalPayout: 9000,
    status: "approved",
  },
  {
    id: "P003",
    name: "张晓红",
    role: "月嫂",
    attendanceDays: 28,
    baseSalary: 8000,
    commission: 2800,
    deductions: 600,
    adjustment: 0,
    finalPayout: 10200,
    status: "paid",
  },
  {
    id: "P004",
    name: "陈秀英",
    role: "销售顾问",
    attendanceDays: 23,
    baseSalary: 5000,
    commission: 4500,
    deductions: 300,
    adjustment: 500,
    finalPayout: 9700,
    status: "pending",
  },
  {
    id: "P005",
    name: "刘春梅",
    role: "产康师",
    attendanceDays: 25,
    baseSalary: 6000,
    commission: 2900,
    deductions: 350,
    adjustment: 0,
    finalPayout: 8550,
    status: "approved",
  },
]

const statusConfig = {
  pending: { label: "待审核", className: "bg-warning/15 text-warning-foreground border-warning/30", icon: Clock },
  approved: { label: "已审核", className: "bg-info/15 text-info border-info/30", icon: CheckCircle },
  paid: { label: "已发放", className: "bg-success/15 text-success border-success/30", icon: CheckCircle },
}

export function PayrollTable() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollRecord | null>(null)

  const summaryData = {
    totalPayout: mockPayroll.reduce((sum, r) => sum + r.finalPayout, 0),
    pendingCount: mockPayroll.filter((r) => r.status === "pending").length,
    paidCount: mockPayroll.filter((r) => r.status === "paid").length,
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full md:w-44 pl-9"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="角色类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  <SelectItem value="nanny">月嫂</SelectItem>
                  <SelectItem value="tech">产康师</SelectItem>
                  <SelectItem value="sales">销售顾问</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/finance/salary-engine">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                薪资规则配置
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-muted-foreground truncate">应发总额</div>
                <div className="text-base md:text-xl font-semibold truncate">¥{(summaryData.totalPayout / 10000).toFixed(1)}万</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-warning/10 flex-shrink-0">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-warning-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-muted-foreground truncate">待审核</div>
                <div className="text-base md:text-xl font-semibold truncate">{summaryData.pendingCount}人</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-success/10 flex-shrink-0">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-muted-foreground truncate">已发放</div>
                <div className="text-base md:text-xl font-semibold truncate">{summaryData.paidCount}人</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {mockPayroll.map((record) => {
          const config = statusConfig[record.status]
          return (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() =>
                        setSelectedRecords((prev) =>
                          prev.includes(record.id) ? prev.filter((id) => id !== record.id) : [...prev, record.id],
                        )
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-sm text-muted-foreground">{record.role}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={config.className}>
                    {config.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">出勤: </span>
                    <span>{record.attendanceDays}天</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">底薪: </span>
                    <span>¥{record.baseSalary.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">提成: </span>
                    <span className="text-success">¥{record.commission.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">扣款: </span>
                    <span className="text-destructive">-¥{record.deductions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <span className="text-sm text-muted-foreground">调整: </span>
                    <Input type="number" defaultValue={record.adjustment} className="w-20 h-8 inline-block ml-1" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">实发</div>
                    <div className="text-lg font-semibold text-primary">¥{record.finalPayout.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent cursor-default bg-muted/30">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  onChange={(e) => setSelectedRecords(e.target.checked ? mockPayroll.map((r) => r.id) : [])}
                />
              </TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead className="text-right">出勤</TableHead>
              <TableHead className="text-right">底薪</TableHead>
              <TableHead className="text-right">提成</TableHead>
              <TableHead className="text-right">扣款</TableHead>
              <TableHead className="text-center">调整</TableHead>
              <TableHead className="text-right">实发</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-16">明细</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayroll.map((record) => {
              const config = statusConfig[record.status]
              return (
                <TableRow key={record.id} className="group">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() =>
                        setSelectedRecords((prev) =>
                          prev.includes(record.id) ? prev.filter((id) => id !== record.id) : [...prev, record.id],
                        )
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium group-hover:text-primary transition-colors">
                    {record.name}
                  </TableCell>
                  <TableCell>{record.role}</TableCell>
                  <TableCell className="text-right">{record.attendanceDays}天</TableCell>
                  <TableCell className="text-right">¥{record.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-success">+¥{record.commission.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive">-¥{record.deductions.toLocaleString()}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={record.adjustment}
                      className="w-24 h-8 text-center group-hover:border-primary/50 transition-colors"
                    />
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ¥{record.finalPayout.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedEmployee(record)
                        setShowDetailDialog(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-sm text-muted-foreground">
            已选择 <span className="font-medium text-foreground">{selectedRecords.length}</span> 条记录
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出银行文件
            </Button>
            <Button disabled={selectedRecords.length === 0}>
              <CheckCircle className="mr-2 h-4 w-4" />
              批量审核
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div className="h-20" />

      {/* Salary Detail Dialog */}
      <SalaryDetailDialog 
        open={showDetailDialog} 
        onOpenChange={setShowDetailDialog}
      />
    </div>
  )
}
