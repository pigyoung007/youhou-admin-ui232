"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import {
  Search, Filter, Download, Eye, Clock, MapPin, Camera, FileText,
  CheckCircle, XCircle, AlertTriangle, CalendarIcon, User, Phone,
  LogIn, LogOut, MoreHorizontal, Image as ImageIcon
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// 打卡类型
type CheckinType = "checkin" | "checkout"
const checkinTypeConfig: Record<CheckinType, { label: string; color: string; icon: typeof LogIn }> = {
  checkin: { label: "上户", color: "bg-green-100 text-green-700", icon: LogIn },
  checkout: { label: "下户", color: "bg-blue-100 text-blue-700", icon: LogOut },
}

// 打卡状态
type CheckinStatus = "normal" | "late" | "early" | "abnormal"
const statusConfig: Record<CheckinStatus, { label: string; color: string }> = {
  normal: { label: "正常", color: "bg-green-100 text-green-700" },
  late: { label: "迟到", color: "bg-amber-100 text-amber-700" },
  early: { label: "早退", color: "bg-amber-100 text-amber-700" },
  abnormal: { label: "异常", color: "bg-red-100 text-red-700" },
}

// Mock打卡记录 - 包含小程序提交的GPS坐标和照片数据
const mockCheckins = [
  {
    id: "CK202603180001",
    type: "checkin" as CheckinType,
    nannyId: "NY001",
    nannyName: "李秀英",
    orderId: "DD202603001",
    customerName: "张女士",
    customerAddress: "北京市朝阳区望京SOHO T1 1205",
    checkTime: "2026-03-18 08:32:15",
    expectedTime: "08:30",
    status: "normal" as CheckinStatus,
    location: "北京市朝阳区望京街道",
    locationAccuracy: "15m",
    // 小程序上传的GPS坐标
    gpsCoords: { lat: 39.9922, lng: 116.4814 },
    // 与客户地址的距离（米）
    distanceFromCustomer: 85,
    // 小程序设备信息
    deviceInfo: "iPhone 14 Pro, iOS 17.2",
    photos: ["/placeholder.jpg"],
    photoUploadTime: "2026-03-18 08:32:18",
    remark: "已到达客户家中，开始今日服务",
    // 审核状态
    reviewStatus: "approved" as "pending" | "approved" | "rejected",
    reviewedBy: "系统自动",
    reviewTime: "2026-03-18 08:32:20",
  },
  {
    id: "CK202603180002",
    type: "checkout" as CheckinType,
    nannyId: "NY001",
    nannyName: "李秀英",
    orderId: "DD202602015",
    customerName: "王女士",
    customerAddress: "北京市海淀区中关村软件园二期",
    checkTime: "2026-03-17 18:45:30",
    expectedTime: "18:00",
    status: "normal" as CheckinStatus,
    location: "北京市海淀区中关村软件园",
    locationAccuracy: "20m",
    photos: ["/placeholder.jpg", "/placeholder2.jpg"],
    remark: "本次服务周期结束，客户评价良好",
  },
  {
    id: "CK202603170003",
    type: "checkin" as CheckinType,
    nannyId: "YY001",
    nannyName: "王秀芳",
    orderId: "DD202603005",
    customerName: "李先生",
    customerAddress: "北京市西城区金融街购物中心",
    checkTime: "2026-03-17 09:15:22",
    expectedTime: "09:00",
    status: "late" as CheckinStatus,
    location: "北京市西城区金融街",
    locationAccuracy: "18m",
    photos: ["/placeholder.jpg"],
    remark: "地铁延误导致迟到15分钟，已与客户沟通",
  },
  {
    id: "CK202603160004",
    type: "checkout" as CheckinType,
    nannyId: "NY002",
    nannyName: "张玉兰",
    orderId: "DD202602020",
    customerName: "刘女士",
    customerAddress: "北京市丰台区马家堡东路",
    checkTime: "2026-03-16 17:30:00",
    expectedTime: "18:00",
    status: "early" as CheckinStatus,
    location: "北京市丰台区马家堡",
    locationAccuracy: "12m",
    photos: [],
    remark: "客户临时有事，协商后提前下户",
  },
]

// Mock日志记录
const mockLogs = [
  {
    id: "LOG202603180001",
    nannyId: "NY001",
    nannyName: "李秀英",
    orderId: "DD202603001",
    customerName: "张女士",
    date: "2026-03-18",
    content: "今日宝宝状态良好，体温36.5度。上午进行了抚触按摩，下午进行了早教游戏。宝妈产后恢复进展顺利，已开始进行简单的产后恢复操。",
    photos: ["/placeholder.jpg", "/placeholder2.jpg"],
    createTime: "2026-03-18 20:30:00",
    babyInfo: {
      weight: "3.8kg",
      temperature: "36.5°C",
      feeding: "母乳+配方奶 共8次",
      sleep: "约14小时",
      stool: "3次，正常",
    },
  },
  {
    id: "LOG202603170002",
    nannyId: "NY001",
    nannyName: "李秀英",
    orderId: "DD202603001",
    customerName: "张女士",
    date: "2026-03-17",
    content: "宝宝今日有轻微吐奶现象，已调整喂养姿势和频率。建议宝妈注意饮食清淡。下午进行了宝宝游泳训练。",
    photos: ["/placeholder.jpg"],
    createTime: "2026-03-17 21:15:00",
    babyInfo: {
      weight: "3.75kg",
      temperature: "36.6°C",
      feeding: "母乳+配方奶 共7次",
      sleep: "约15小时",
      stool: "4次，正常",
    },
  },
  {
    id: "LOG202603180003",
    nannyId: "YY001",
    nannyName: "王秀芳",
    orderId: "DD202603005",
    customerName: "李先生",
    date: "2026-03-18",
    content: "宝宝6个月体检一切正常。今日进行了辅食添加尝试（米粉），宝宝接受度良好。继续进行大运动训练，宝宝已能独坐片刻。",
    photos: [],
    createTime: "2026-03-18 19:45:00",
    babyInfo: {
      weight: "7.5kg",
      temperature: "36.4°C",
      feeding: "母乳+辅食 共6次",
      sleep: "约12小时",
      stool: "2次，正常",
    },
  },
]

// 统计数据
const statsData = {
  todayCheckin: 45,
  todayCheckout: 12,
  abnormalCount: 3,
  pendingLogs: 8,
  monthlyTotal: 1256,
  normalRate: "96.5%",
}

export default function CheckinPage() {
  const [activeTab, setActiveTab] = useState("checkin")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())
  const [selectedCheckin, setSelectedCheckin] = useState<typeof mockCheckins[0] | null>(null)
  const [selectedLog, setSelectedLog] = useState<typeof mockLogs[0] | null>(null)
  const [showCheckinDetail, setShowCheckinDetail] = useState(false)
  const [showLogDetail, setShowLogDetail] = useState(false)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">上下户打卡与日志</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理家政员上户/下户打卡记录及每日服务日志
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />导出
            </Button>

          </div>
        </div>

        {/* 主内容区 */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent">
                <TabsTrigger value="checkin" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  打卡记录
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  服务日志
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 打卡记录Tab */}
            <TabsContent value="checkin" className="m-0">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索家政员、客户、订单号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="打卡类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="checkin">上户</SelectItem>
                      <SelectItem value="checkout">下户</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="打卡状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="late">迟到</SelectItem>
                      <SelectItem value="early">早退</SelectItem>
                      <SelectItem value="abnormal">异常</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 w-[140px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange ? format(dateRange, "yyyy-MM-dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange}
                        onSelect={setDateRange}
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">类型</TableHead>
                      <TableHead className="w-[120px]">家政员</TableHead>
                      <TableHead className="w-[100px]">客户</TableHead>
                      <TableHead className="min-w-[150px]">打卡时间</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="min-w-[150px]">打卡位置</TableHead>
                      <TableHead className="w-[60px]">照片</TableHead>
                      <TableHead className="w-[80px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCheckins.map((record) => {
                      const TypeIcon = checkinTypeConfig[record.type].icon
                      return (
                        <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedCheckin(record); setShowCheckinDetail(true); }}>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs", checkinTypeConfig[record.type].color)}>
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {checkinTypeConfig[record.type].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{record.nannyName.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{record.nannyName}</div>
                                <div className="text-xs text-muted-foreground">{record.nannyId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{record.customerName}</div>
                            <div className="text-xs text-muted-foreground">{record.orderId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{record.checkTime}</div>
                            <div className="text-xs text-muted-foreground">预计: {record.expectedTime}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs", statusConfig[record.status].color)}>
                              {statusConfig[record.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="truncate max-w-[120px]">{record.location}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">精度: {record.locationAccuracy}</div>
                          </TableCell>
                          <TableCell>
                            {record.photos.length > 0 ? (
                              <Badge variant="secondary" className="text-xs">{record.photos.length}张</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedCheckin(record); setShowCheckinDetail(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </TabsContent>

            {/* 服务日志Tab */}
            <TabsContent value="logs" className="m-0">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索家政员、客户、日志内容..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 w-[140px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange ? format(dateRange, "yyyy-MM-dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange}
                        onSelect={setDateRange}
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-4">
                  {mockLogs.map((log) => (
                    <Card key={log.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => { setSelectedLog(log); setShowLogDetail(true); }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">{log.nannyName.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{log.nannyName}</div>
                              <div className="text-xs text-muted-foreground">服务客户: {log.customerName} · {log.orderId}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{log.date}</div>
                            <div className="text-xs text-muted-foreground">提交于 {log.createTime.split(" ")[1]}</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{log.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>体温: {log.babyInfo.temperature}</span>
                            <span>喂养: {log.babyInfo.feeding}</span>
                            <span>睡眠: {log.babyInfo.sleep}</span>
                          </div>
                          {log.photos.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <ImageIcon className="h-3 w-3 mr-1" />{log.photos.length}张照片
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* 打卡详情对话框 */}
        <Dialog open={showCheckinDetail} onOpenChange={setShowCheckinDetail}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCheckin && (
                  <>
                    {(() => { const Icon = checkinTypeConfig[selectedCheckin.type].icon; return <Icon className="h-5 w-5" />; })()}
                    {checkinTypeConfig[selectedCheckin.type].label}打卡详情
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedCheckin && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">打卡编号：</span>
                    <span className="font-mono">{selectedCheckin.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">打卡状态：</span>
                    <Badge variant="outline" className={cn("ml-1", statusConfig[selectedCheckin.status].color)}>
                      {statusConfig[selectedCheckin.status].label}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">家政员：</span>
                    <span>{selectedCheckin.nannyName} ({selectedCheckin.nannyId})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">订单编号：</span>
                    <span>{selectedCheckin.orderId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">客户：</span>
                    <span>{selectedCheckin.customerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">预计时间：</span>
                    <span>{selectedCheckin.expectedTime}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">打卡时间：</span>
                  <span className="font-medium">{selectedCheckin.checkTime}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">打卡地址：</span>
                  <span>{selectedCheckin.customerAddress}</span>
                </div>
                {/* GPS定位信息区域 - 展示小程序提交的数据 */}
                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      GPS定位信息
                    </span>
                    {selectedCheckin.distanceFromCustomer !== undefined && (
                      <Badge variant={selectedCheckin.distanceFromCustomer <= 100 ? "default" : "destructive"} className="text-xs">
                        距客户地址 {selectedCheckin.distanceFromCustomer}m
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">定位地址：</span>
                      <span>{selectedCheckin.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">定位精度：</span>
                      <span>{selectedCheckin.locationAccuracy}</span>
                    </div>
                    {selectedCheckin.gpsCoords && (
                      <>
                        <div>
                          <span className="text-muted-foreground">纬度：</span>
                          <span className="tabular-nums">{selectedCheckin.gpsCoords.lat}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">经度：</span>
                          <span className="tabular-nums">{selectedCheckin.gpsCoords.lng}</span>
                        </div>
                      </>
                    )}
                    {selectedCheckin.deviceInfo && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">设备信息：</span>
                        <span className="text-xs">{selectedCheckin.deviceInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedCheckin.remark && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">备注：</span>
                    <p className="mt-1 p-2 bg-muted/50 rounded">{selectedCheckin.remark}</p>
                  </div>
                )}
                {selectedCheckin.photos.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">打卡照片：</span>
                    <div className="flex gap-2 mt-2">
                      {selectedCheckin.photos.map((_, i) => (
                        <div key={i} className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCheckinDetail(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 日志详情对话框 */}
        <Dialog open={showLogDetail} onOpenChange={setShowLogDetail}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>服务日志详情</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-4 pr-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">{selectedLog.nannyName.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedLog.nannyName}</div>
                        <div className="text-sm text-muted-foreground">{selectedLog.customerName} · {selectedLog.orderId}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{selectedLog.date}</div>
                      <div className="text-xs text-muted-foreground">{selectedLog.createTime}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">日志内容</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted/30 rounded-lg">
                      {selectedLog.content}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">宝宝状况记录</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-xs">体重</div>
                        <div className="font-medium text-blue-700">{selectedLog.babyInfo.weight}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-red-600 text-xs">体温</div>
                        <div className="font-medium text-red-700">{selectedLog.babyInfo.temperature}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-xs">喂养</div>
                        <div className="font-medium text-green-700">{selectedLog.babyInfo.feeding}</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-purple-600 text-xs">睡眠</div>
                        <div className="font-medium text-purple-700">{selectedLog.babyInfo.sleep}</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg col-span-2">
                        <div className="text-amber-600 text-xs">大便</div>
                        <div className="font-medium text-amber-700">{selectedLog.babyInfo.stool}</div>
                      </div>
                    </div>
                  </div>

                  {selectedLog.photos.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">照片记录</h4>
                      <div className="flex gap-2">
                        {selectedLog.photos.map((_, i) => (
                          <div key={i} className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogDetail(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </AdminLayout>
  )
}
