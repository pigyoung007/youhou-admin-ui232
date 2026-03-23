'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Camera, Video, Award, FileText, Star, Users, Plus, Upload, 
  Check, AlertCircle, Phone, User, Calendar, X, ChevronLeft,
  Save, Send, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock家政员数据
const mockNannyData = {
  id: "NY001",
  name: "李秀英",
  phone: "138****5678",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  selfIntro: "您好，我从事母婴护理工作已有8年经验...",
  photos: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  ],
  foodPhotos: [],
  videos: [],
  skills: [
    { id: "s1", name: "母乳喂养指导", level: "精通" },
    { id: "s2", name: "新生儿护理", level: "精通" },
  ],
  certificates: [
    { id: "c1", name: "高级母婴护理师证书", date: "2023-06-15" },
  ],
  experiences: [
    { id: "e1", employer: "王女士", period: "2024-12 ~ 2025-02", content: "照顾新生儿及产妇" },
  ],
}

export default function NannyEditPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [isValid, setIsValid] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [nanny, setNanny] = useState(mockNannyData)
  const [activeSection, setActiveSection] = useState('intro')
  const [hasChanges, setHasChanges] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  
  // 编辑状态
  const [selfIntro, setSelfIntro] = useState(nanny.selfIntro)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [addSkillDialogOpen, setAddSkillDialogOpen] = useState(false)
  const [addExpDialogOpen, setAddExpDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', level: '熟练' })
  const [newExp, setNewExp] = useState({ employer: '', period: '', content: '' })

  useEffect(() => {
    // 验证token有效性
    const token = searchParams.get('token')
    setTimeout(() => {
      setIsLoading(false)
      // 实际项目中应验证token
      setIsValid(!!token)
    }, 500)
  }, [searchParams])

  const sections = [
    { id: 'intro', label: '自我介绍', icon: User },
    { id: 'photos', label: '工作生活照', icon: Camera },
    { id: 'food_photos', label: '辅食作品', icon: Camera },
    { id: 'videos', label: '视频介绍', icon: Video },
    { id: 'skills', label: '技能资格', icon: Award },
    { id: 'certificates', label: '证书信息', icon: FileText },
    { id: 'experience', label: '工作经历', icon: Users },
  ]

  const handleUpload = (type: string) => {
    setUploadType(type)
    setUploadDialogOpen(true)
  }

  const handleAddSkill = () => {
    if (newSkill.name) {
      setNanny(prev => ({
        ...prev,
        skills: [...prev.skills, { id: `s${Date.now()}`, ...newSkill }]
      }))
      setNewSkill({ name: '', level: '熟练' })
      setAddSkillDialogOpen(false)
      setHasChanges(true)
    }
  }

  const handleAddExperience = () => {
    if (newExp.employer && newExp.period) {
      setNanny(prev => ({
        ...prev,
        experiences: [...prev.experiences, { id: `e${Date.now()}`, ...newExp }]
      }))
      setNewExp({ employer: '', period: '', content: '' })
      setAddExpDialogOpen(false)
      setHasChanges(true)
    }
  }

  const handleSubmit = () => {
    // 提交审核
    setSubmitDialogOpen(false)
    setSuccessDialogOpen(true)
    setHasChanges(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">链接已失效</h1>
          <p className="text-muted-foreground mb-6">
            该编辑链接已过期或无效，请联系您的顾问获取新的链接。
          </p>
          <p className="text-sm text-muted-foreground">
            如有疑问，请拨打客服电话：400-xxx-xxxx
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={nanny.avatar} />
              <AvatarFallback>{nanny.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold">{nanny.name}的简历</h1>
              <p className="text-xs text-muted-foreground">编辑模式</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                有未保存的更改
              </Badge>
            )}
            <Button 
              onClick={() => setSubmitDialogOpen(true)}
              disabled={!hasChanges}
            >
              <Send className="h-4 w-4 mr-1" />
              提交审核
            </Button>
          </div>
        </div>
      </header>

      {/* 提示横幅 */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">欢迎编辑您的简历</p>
            <p className="text-blue-600 mt-0.5">
              您可以补充和完善个人信息。提交后，顾问将进行审核，审核通过后将展示给客户。
            </p>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 快速导航 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="flex-shrink-0"
            >
              <section.icon className="h-4 w-4 mr-1" />
              {section.label}
            </Button>
          ))}
        </div>

        {/* 自我介绍 */}
        {activeSection === 'intro' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                自我介绍
              </h2>
            </div>
            <Textarea
              value={selfIntro}
              onChange={(e) => {
                setSelfIntro(e.target.value)
                setHasChanges(true)
              }}
              placeholder="请介绍您的工作经历、擅长领域、服务理念..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              建议200-500字，突出您的专业优势和服务特点
            </p>
          </Card>
        )}

        {/* 工作生活照 */}
        {activeSection === 'photos' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                工作生活照
              </h2>
              <Button size="sm" onClick={() => handleUpload('photos')}>
                <Plus className="h-4 w-4 mr-1" />
                上传照片
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {nanny.photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  <img src={photo} alt={`照片${i + 1}`} className="w-full h-full object-cover" />
                  <button 
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setNanny(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, idx) => idx !== i)
                      }))
                      setHasChanges(true)
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
              <button 
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                onClick={() => handleUpload('photos')}
              >
                <Plus className="h-8 w-8 mb-1" />
                <span className="text-xs">添加照片</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              建议上传3-6张工作场景照片，展示您的专业形象
            </p>
          </Card>
        )}

        {/* 辅食作品 */}
        {activeSection === 'food_photos' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                辅食作品
              </h2>
              <Button size="sm" onClick={() => handleUpload('food_photos')}>
                <Plus className="h-4 w-4 mr-1" />
                上传照片
              </Button>
            </div>
            {nanny.foodPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {nanny.foodPhotos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={photo} alt={`辅食${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed rounded-lg">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                <p className="text-muted-foreground mb-3">展示您的辅食制作技能</p>
                <Button variant="outline" onClick={() => handleUpload('food_photos')}>
                  <Upload className="h-4 w-4 mr-1" />
                  上传辅食照片
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 视频介绍 */}
        {activeSection === 'videos' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Video className="h-5 w-5" />
                视频介绍
              </h2>
              <Button size="sm" onClick={() => handleUpload('videos')}>
                <Plus className="h-4 w-4 mr-1" />
                上传视频
              </Button>
            </div>
            {nanny.videos.length > 0 ? (
              <div className="space-y-3">
                {/* 视频列表 */}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed rounded-lg">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                <p className="text-muted-foreground mb-3">录制一段自我介绍视频，让客户更了解您</p>
                <Button variant="outline" onClick={() => handleUpload('videos')}>
                  <Upload className="h-4 w-4 mr-1" />
                  上传视频
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              建议时长1-3分钟，介绍您的工作经历和服务特点
            </p>
          </Card>
        )}

        {/* 技能资格 */}
        {activeSection === 'skills' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Award className="h-5 w-5" />
                技能资格
              </h2>
              <Button size="sm" onClick={() => setAddSkillDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                添加技能
              </Button>
            </div>
            <div className="space-y-2">
              {nanny.skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{skill.level}</Badge>
                    <button 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setNanny(prev => ({
                          ...prev,
                          skills: prev.skills.filter(s => s.id !== skill.id)
                        }))
                        setHasChanges(true)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 证书信息 */}
        {activeSection === 'certificates' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                证书信息
              </h2>
              <Button size="sm" onClick={() => handleUpload('certificates')}>
                <Plus className="h-4 w-4 mr-1" />
                添加证书
              </Button>
            </div>
            <div className="space-y-2">
              {nanny.certificates.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">发证日期：{cert.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">查看</Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              上传证书照片可以提高您的可信度
            </p>
          </Card>
        )}

        {/* 工作经历 */}
        {activeSection === 'experience' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Users className="h-5 w-5" />
                工作经历
              </h2>
              <Button size="sm" onClick={() => setAddExpDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                添加经历
              </Button>
            </div>
            <div className="space-y-3">
              {nanny.experiences.map(exp => (
                <div key={exp.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exp.employer}家</p>
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                    </div>
                    <button 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setNanny(prev => ({
                          ...prev,
                          experiences: prev.experiences.filter(e => e.id !== exp.id)
                        }))
                        setHasChanges(true)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm mt-2">{exp.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      {/* 上传对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传{uploadType === 'photos' ? '照片' : uploadType === 'videos' ? '视频' : '文件'}</DialogTitle>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">点击或拖拽上传文件</p>
            <Button variant="outline">选择文件</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              setUploadDialogOpen(false)
              setHasChanges(true)
            }}>上传</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加技能对话框 */}
      <Dialog open={addSkillDialogOpen} onOpenChange={setAddSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加技能</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>技能名称</Label>
              <Input 
                placeholder="如：母乳喂养指导" 
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1" 
              />
            </div>
            <div>
              <Label>熟练程度</Label>
              <select 
                className="w-full mt-1 px-3 py-2 border rounded-md"
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
              >
                <option value="了解">了解</option>
                <option value="熟练">熟练</option>
                <option value="精通">精通</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSkillDialogOpen(false)}>取消</Button>
            <Button onClick={handleAddSkill}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加经历对话框 */}
      <Dialog open={addExpDialogOpen} onOpenChange={setAddExpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加工作经历</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>雇主称呼</Label>
              <Input 
                placeholder="如：王女士" 
                value={newExp.employer}
                onChange={(e) => setNewExp(prev => ({ ...prev, employer: e.target.value }))}
                className="mt-1" 
              />
            </div>
            <div>
              <Label>服务周期</Label>
              <Input 
                placeholder="如：2024-12 ~ 2025-02" 
                value={newExp.period}
                onChange={(e) => setNewExp(prev => ({ ...prev, period: e.target.value }))}
                className="mt-1" 
              />
            </div>
            <div>
              <Label>服务内容</Label>
              <Textarea 
                placeholder="描述您的服务内容..." 
                value={newExp.content}
                onChange={(e) => setNewExp(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1" 
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExpDialogOpen(false)}>取消</Button>
            <Button onClick={handleAddExperience}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提交确认对话框 */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提交审核</DialogTitle>
            <DialogDescription>
              确认提交您的简历更新吗？提交后将由顾问进行审核。
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-800">
            <p>审核说明：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>审核通常在1-2个工作日内完成</li>
              <li>审核通过后，更新内容将展示给客户</li>
              <li>如有问题，顾问会联系您修改</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-1" />
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提交成功对话框 */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">提交成功</h3>
            <p className="text-muted-foreground">
              您的简历更新已提交审核，顾问会尽快处理。
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessDialogOpen(false)} className="w-full">
              我知道了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
