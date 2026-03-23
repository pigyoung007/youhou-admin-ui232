"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Search, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Filter,
  Calendar
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

// Mock data
const transactions = [
  {
    id: "TXN202402001",
    type: "income",
    category: "订单收款",
    description: "ORD202402001 - 金牌月嫂26天 - 刘女士",
    amount: 28800,
    method: "微信支付",
    status: "completed",
    time: "2024-02-10 14:35:22",
    operator: "系统自动",
  },
  {
    id: "TXN202402002",
    type: "income",
    category: "订单收款",
    description: "ORD202402002 - 产康套餐8次 - 陈先生 (定金)",
    amount: 2400,
    method: "支付宝",
    status: "completed",
    time: "2024-02-18 09:20:15",
    operator: "系统自动",
  },
  {
    id: "TXN202402003",
    type: "expense",
    category: "工资发放",
    description: "2024年1月工资 - 李春华",
    amount: 12000,
    method: "银行转账",
    status: "completed",
    time: "2024-02-05 10:00:00",
    operator: "财务张",
  },
  {
    id: "TXN202402004",
    type: "expense",
    category: "采购支出",
    description: "月子餐食材采购 - 第7周",
    amount: 3500,
    method: "对公转账",
    status: "completed",
    time: "2024-02-15 16:30:00",
    operator: "采购李",
  },
  {
    id: "TXN202402005",
    type: "income",
    category: "培训收费",
    description: "高级月嫂培训班 - 2024年第3期 - 报名费",
    amount: 6800,
    method: "微信支付",
    status: "completed",
    time: "2024-02-01 11:25:30",
    operator: "系统自动",
  },
  {
    id: "TXN202402006",
    type: "expense",
    category: "日常开支",
    description: "办公用品采购",
    amount: 850,
    method: "备用金",
    status: "pending",
    time: "2024-02-20 14:00:00",
    operator: "行政王",
  },
  {
    id: "TXN202402007",
    type: "refund",
    category: "订单退款",
    description: "ORD202402005 - 高级月嫂26天 - 孙女士 (全额退款)",
    amount: 22000,
    method: "原路退回",
    status: "completed",
    time: "2024-02-08 15:45:00",
    operator: "财务张",
  },
]

const typeConfig = {
  income: { label: "收入", color: "bg-green-100 text-green-700", icon: ArrowDownLeft },
  expense: { label: "支出", color: "bg-red-100 text-red-700", icon: ArrowUpRight },
  refund: { label: "退款", color: "bg-amber-100 text-amber-700", icon: ArrowUpRight },
}

const statusConfig = {
  completed: { label: "已完成", color: "bg-green-100 text-green-700" },
  pending: { label: "待审核", color: "bg-amber-100 text-amber-700" },
  failed: { label: "失败", color: "bg-red-100 text-red-700" },
}

export default function TransactionsPage() {
  const searchParams = useSearchParams()

  const stats = {
    income: transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    refund: transactions.filter(t => t.type === "refund").reduce((sum, t) => sum + t.amount, 0),
  }
  const netIncome = stats.income - stats.expense - stats.refund

  return (
    <AdminLayout>
      <Suspense fallback={null}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">收支流水</h1>
              <p className="text-muted-foreground">查看所有财务交易记录</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                2024年2月
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报表
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl font-bold text-green-600 truncate">+¥{(stats.income / 10000).toFixed(1)}万</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">本月收入</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl font-bold text-red-600 truncate">-¥{(stats.expense / 10000).toFixed(1)}万</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">本月支出</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
                    <Wallet className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl font-bold text-amber-600 truncate">-¥{(stats.refund / 10000).toFixed(1)}万</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">本月退款</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-lg sm:text-xl font-bold truncate ${netIncome >= 0 ? "text-primary" : "text-red-600"}`}>
                      {netIncome >= 0 ? "+" : ""}¥{(netIncome / 10000).toFixed(1)}万
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">净收入</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索交易流水号、描述..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="income">收入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
                <SelectItem value="refund">退款</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="order">订单收款</SelectItem>
                <SelectItem value="training">培训收费</SelectItem>
                <SelectItem value="salary">工资发放</SelectItem>
                <SelectItem value="purchase">采购支出</SelectItem>
                <SelectItem value="daily">日常开支</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="income">收入</TabsTrigger>
              <TabsTrigger value="expense">支出</TabsTrigger>
              <TabsTrigger value="refund">退款</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>流水号</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead className="max-w-[300px]">描述</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作人</TableHead>
                        <TableHead>时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => {
                        const TypeIcon = typeConfig[txn.type as keyof typeof typeConfig].icon
                        return (
                          <TableRow key={txn.id} className="group">
                            <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={typeConfig[txn.type as keyof typeof typeConfig].color}>
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {typeConfig[txn.type as keyof typeof typeConfig].label}
                              </Badge>
                            </TableCell>
                            <TableCell>{txn.category}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{txn.description}</TableCell>
                            <TableCell>
                              <span className={`font-bold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                {txn.type === "income" ? "+" : "-"}¥{txn.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{txn.method}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusConfig[txn.status as keyof typeof statusConfig].color}>
                                {statusConfig[txn.status as keyof typeof statusConfig].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{txn.operator}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{txn.time}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="income">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>流水号</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.filter(t => t.type === "income").map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                          <TableCell>{txn.category}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{txn.description}</TableCell>
                          <TableCell>
                            <span className="font-bold text-green-600">+¥{txn.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>{txn.method}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{txn.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expense">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>流水号</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.filter(t => t.type === "expense").map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                          <TableCell>{txn.category}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{txn.description}</TableCell>
                          <TableCell>
                            <span className="font-bold text-red-600">-¥{txn.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>{txn.method}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[txn.status as keyof typeof statusConfig].color}>
                              {statusConfig[txn.status as keyof typeof statusConfig].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{txn.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refund">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>流水号</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>退款方式</TableHead>
                        <TableHead>操作人</TableHead>
                        <TableHead>时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.filter(t => t.type === "refund").map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{txn.description}</TableCell>
                          <TableCell>
                            <span className="font-bold text-amber-600">-¥{txn.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>{txn.method}</TableCell>
                          <TableCell>{txn.operator}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{txn.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
