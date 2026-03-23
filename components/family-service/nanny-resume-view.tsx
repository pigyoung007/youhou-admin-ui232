'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { 
  Play, Download, Calendar, Award, Users, Heart, Plus, Edit, Trash2, 
  Share2, Link2, Copy, CheckCircle, Camera, Video, Star, FileText,
  Upload, X, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ResumeItem {
  id: string
  type: 'photo' | 'video' | 'skill' | 'review' | 'experience' | 'certificate' | 'food_photo'
  title?: string
  description?: string
  image?: string
  videoUrl?: string
  rating?: number
  count?: number
  date?: string
  certified?: boolean
  validUntil?: string
}

export interface NannyResume {
  id: string
  name: string
  avatar?: string
  selfIntro?: string
  photos: ResumeItem[]
  foodPhotos?: ResumeItem[]
  videos: ResumeItem[]
  skills: ResumeItem[]
  certificates?: ResumeItem[]
  reviews: ResumeItem[]
  experiences: ResumeItem[]
}

interface NannyResumeViewProps {
  resume: NannyResume
  editable?: boolean // 是否可编辑（顾问模式）
  onUpdate?: (resume: NannyResume) => void
  onShare?: () => void
}

export function NannyResumeView({ resume, editable = false, onUpdate, onShare }: NannyResumeViewProps) {
  const [selectedTab, setSelectedTab] = useState<string>('photos')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ResumeItem | null>(null)
  const [editingType, setEditingType] = useState<string>('')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<string>('')
  const [selfIntroDialogOpen, setSelfIntroDialogOpen] = useState(false)
  const [selfIntroText, setSelfIntroText] = useState(resume.selfIntro || '')
  
  // 表单状态管理
  const [formData, setFormData] = useState({
    // 技能表单
    skillName: '',
    skillLevel: '',
    skillCertified: false,
    // 证书表单
    certName: '',
    certDate: '',
    certValidUntil: '',
    // 工作经历表单
    expEmployer: '',
    expPeriod: '',
    expContent: '',
    // 视频表单
    videoTitle: '',
    videoDescription: '',
  })
  
  const resetFormData = () => {
    setFormData({
      skillName: '',
      skillLevel: '',
      skillCertified: false,
      certName: '',
      certDate: '',
      certValidUntil: '',
      expEmployer: '',
      expPeriod: '',
      expContent: '',
      videoTitle: '',
      videoDescription: '',
    })
  }

  const tabs = [
    { id: 'photos', label: '工作生活照', count: resume.photos.length, icon: Camera },
    { id: 'food_photos', label: '辅食作品', count: resume.foodPhotos?.length || 0, icon: Camera },
    { id: 'videos', label: '视频介绍', count: resume.videos.length, icon: Video },
    { id: 'skills', label: '技能资格', count: resume.skills.length, icon: Award },
    { id: 'certificates', label: '证书信息', count: resume.certificates?.length || 0, icon: FileText },
    { id: 'reviews', label: '客户好评', count: resume.reviews.length, icon: Star },
    { id: 'experience', label: '工作经历', count: resume.experiences.length, icon: Users },
  ]

  const getItems = (): ResumeItem[] => {
    switch (selectedTab) {
      case 'photos': return resume.photos
      case 'food_photos': return resume.foodPhotos || []
      case 'videos': return resume.videos
      case 'skills': return resume.skills
      case 'certificates': return resume.certificates || []
      case 'reviews': return resume.reviews
      case 'experience': return resume.experiences
      default: return []
    }
  }

  const handleEdit = (item: ResumeItem) => {
    setEditingItem({ ...item })
    setEditingType(selectedTab)
    setEditDialogOpen(true)
  }

  const handleAdd = () => {
    setUploadType(selectedTab)
    setUploadDialogOpen(true)
  }

  const handleDelete = (itemId: string) => {
    handleConfirmDelete(itemId)
  }

  const handleGenerateShareLink = () => {
    // 生成分享链接（实际项目中应调用API）
    const link = `${window.location.origin}/nanny-edit/${resume.id}?token=${Math.random().toString(36).substring(7)}`
    setShareLink(link)
    setShareDialogOpen(true)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handleSaveSelfIntro = () => {
    if (onUpdate) {
      onUpdate({ ...resume, selfIntro: selfIntroText })
    }
    setSelfIntroDialogOpen(false)
  }

  const handleSaveUpload = () => {
    const newItem: ResumeItem = {
      id: `new-${Date.now()}`,
      type: uploadType as ResumeItem['type'],
    }

    if (uploadType === 'skills') {
      newItem.title = formData.skillName
      newItem.description = `熟练程度：${formData.skillLevel}`
      newItem.certified = formData.skillCertified
    } else if (uploadType === 'certificates') {
      newItem.title = formData.certName
      newItem.date = formData.certDate
      newItem.validUntil = formData.certValidUntil || undefined
    } else if (uploadType === 'experience') {
      newItem.title = `${formData.expEmployer}家 (${formData.expPeriod})`
      newItem.description = formData.expContent
      newItem.date = formData.expPeriod
    } else if (uploadType === 'videos') {
      newItem.title = formData.videoTitle
      newItem.description = formData.videoDescription
    }

    // 更新数据
    if (onUpdate) {
      const updatedResume = { ...resume }
      switch (uploadType) {
        case 'skills':
          updatedResume.skills = [...resume.skills, newItem]
          break
        case 'certificates':
          updatedResume.certificates = [...(resume.certificates || []), newItem]
          break
        case 'experience':
          updatedResume.experiences = [...resume.experiences, newItem]
          break
        case 'videos':
          updatedResume.videos = [...resume.videos, newItem]
          break
        case 'photos':
          updatedResume.photos = [...resume.photos, newItem]
          break
        case 'food_photos':
          updatedResume.foodPhotos = [...(resume.foodPhotos || []), newItem]
          break
      }
      onUpdate(updatedResume)
    }

    resetFormData()
    setUploadDialogOpen(false)
  }

  const handleConfirmDelete = (itemId: string) => {
    if (!confirm('确定要删除此项吗？')) return
    
    if (onUpdate) {
      const updatedResume = { ...resume }
      switch (selectedTab) {
        case 'skills':
          updatedResume.skills = resume.skills.filter(s => s.id !== itemId)
          break
        case 'certificates':
          updatedResume.certificates = (resume.certificates || []).filter(c => c.id !== itemId)
          break
        case 'experience':
          updatedResume.experiences = resume.experiences.filter(e => e.id !== itemId)
          break
        case 'videos':
          updatedResume.videos = resume.videos.filter(v => v.id !== itemId)
          break
        case 'photos':
          updatedResume.photos = resume.photos.filter(p => p.id !== itemId)
          break
        case 'food_photos':
          updatedResume.foodPhotos = (resume.foodPhotos || []).filter(f => f.id !== itemId)
          break
        case 'reviews':
          updatedResume.reviews = resume.reviews.filter(r => r.id !== itemId)
          break
      }
      onUpdate(updatedResume)
    }
  }

  return (
    <div className="space-y-4">
      {/* 顾问操作栏 */}
      {editable && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Edit className="h-4 w-4" />
            <span>顾问编辑模式</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGenerateShareLink}>
              <Share2 className="h-4 w-4 mr-1" />
              生成分享链接
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelfIntroDialogOpen(true)}>
              <FileText className="h-4 w-4 mr-1" />
              编辑自我介绍
            </Button>
          </div>
        </div>
      )}

      {/* 自我介绍卡片 */}
      {resume.selfIntro && (
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2">自我介绍</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{resume.selfIntro}</p>
            </div>
            {editable && (
              <Button variant="ghost" size="sm" onClick={() => setSelfIntroDialogOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Tab导航 */}
      <div className="flex gap-1 border-b overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              selectedTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* 添加按钮 */}
      {editable && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            添加{tabs.find(t => t.id === selectedTab)?.label}
          </Button>
        </div>
      )}

      {/* 内容展示 */}
      <div className="space-y-4">
        {/* 照片类型 */}
        {(selectedTab === 'photos' || selectedTab === 'food_photos') && (
          <div className="grid grid-cols-3 gap-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                >
                  {item.image ? (
                    <img src={item.image} alt="work" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                  {editable && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无{selectedTab === 'photos' ? '工作生活照' : '辅食作品'}</p>
                {editable && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" />
                    上传照片
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 视频类型 */}
        {selectedTab === 'videos' && (
          <div className="space-y-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="relative w-32 h-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt="video" className="w-full h-full object-cover" />
                      ) : (
                        <Video className="h-8 w-8 text-muted-foreground" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title || '视频介绍'}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description || '点击播放视频'}</p>
                      {item.date && (
                        <p className="text-xs text-muted-foreground mt-2">上传于 {item.date}</p>
                      )}
                    </div>
                    {editable && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无视频介绍</p>
                {editable && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" />
                    上传视频
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 技能类型 */}
        {selectedTab === 'skills' && (
          <div className="grid grid-cols-2 gap-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <Card key={item.id} className="p-4 relative group">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        {item.certified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">已认证</Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {editable && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无技能资格</p>
                {editable && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加技能
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 证书类型 */}
        {selectedTab === 'certificates' && (
          <div className="space-y-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <Card key={item.id} className="p-4 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>发证日期：{item.date}</span>
                          {item.validUntil && <span>有效期至：{item.validUntil}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">查看证书</Button>
                      {editable && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无证书信息</p>
                {editable && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加证书
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 好评类型 */}
        {selectedTab === 'reviews' && (
          <div className="space-y-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <Card key={item.id} className="p-4 relative group">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "h-4 w-4",
                                i < (item.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      {item.date && (
                        <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                      )}
                    </div>
                    <Heart className="h-5 w-5 text-red-400 flex-shrink-0" />
                  </div>
                  {editable && (
                    <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无客户好评</p>
              </div>
            )}
          </div>
        )}

        {/* 工作经历 */}
        {selectedTab === 'experience' && (
          <div className="space-y-3">
            {getItems().length > 0 ? (
              getItems().map(item => (
                <Card key={item.id} className="p-4 relative group">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                    )}
                    {item.count && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.count}次服务
                      </span>
                    )}
                  </div>
                  {editable && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>暂无工作经历</p>
                {editable && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加经历
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分享链接对话框 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分享简历编辑链接</DialogTitle>
            <DialogDescription>
              将此链接发送给家政员，她可以通过此链接自行补充和编辑简历信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input value={shareLink} readOnly className="border-0 bg-transparent p-0 h-auto text-sm" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>注意事项：</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>链接有效期为7天</li>
                <li>家政员通过链接提交的内容需要顾问审核后才会显示</li>
                <li>可以随时重新生成新链接（旧链接将失效）</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>取消</Button>
            <Button onClick={handleCopyLink}>
              {linkCopied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  复制链接
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 自我介绍编辑对话框 */}
      <Dialog open={selfIntroDialogOpen} onOpenChange={setSelfIntroDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑自我介绍</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={selfIntroText}
              onChange={(e) => setSelfIntroText(e.target.value)}
              placeholder="请输入自我介绍..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              建议包含：工作年限、擅长领域、服务理念等
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelfIntroDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveSelfIntro}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 上传对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              添加{tabs.find(t => t.id === uploadType)?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(uploadType === 'photos' || uploadType === 'food_photos') && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-3">点击或拖拽上传图片</p>
                <Button variant="outline">选择图片</Button>
              </div>
            )}
            {uploadType === 'videos' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">点击或拖拽上传视频</p>
                  <Button variant="outline">选择视频</Button>
                </div>
                <div>
                  <Label>视频标题 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：自我介绍" 
                    className="mt-1"
                    value={formData.videoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>视频描述</Label>
                  <Textarea 
                    placeholder="简单描述视频内容..." 
                    className="mt-1" 
                    rows={2}
                    value={formData.videoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoDescription: e.target.value }))}
                  />
                </div>
              </div>
            )}
            {uploadType === 'skills' && (
              <div className="space-y-4">
                <div>
                  <Label>技能名称 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：母乳喂养指导" 
                    className="mt-1"
                    value={formData.skillName}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>技能等级 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：精通、熟练、了解" 
                    className="mt-1"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillLevel: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="certified"
                    checked={formData.skillCertified}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillCertified: e.target.checked }))}
                  />
                  <Label htmlFor="certified">已认证</Label>
                </div>
              </div>
            )}
            {uploadType === 'certificates' && (
              <div className="space-y-4">
                <div>
                  <Label>证书名称 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：高级母婴护理师证书" 
                    className="mt-1"
                    value={formData.certName}
                    onChange={(e) => setFormData(prev => ({ ...prev, certName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>发证日期 <span className="text-destructive">*</span></Label>
                  <Input 
                    type="date" 
                    className="mt-1"
                    value={formData.certDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, certDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>有效期至（可选）</Label>
                  <Input 
                    type="date" 
                    className="mt-1"
                    value={formData.certValidUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, certValidUntil: e.target.value }))}
                  />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">点击上传证书照片</p>
                </div>
              </div>
            )}
            {uploadType === 'experience' && (
              <div className="space-y-4">
                <div>
                  <Label>雇主称呼 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：王女士" 
                    className="mt-1"
                    value={formData.expEmployer}
                    onChange={(e) => setFormData(prev => ({ ...prev, expEmployer: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>服务周期 <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="如：2024-12 ~ 2025-02" 
                    className="mt-1"
                    value={formData.expPeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, expPeriod: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>服务内容</Label>
                  <Textarea 
                    placeholder="描述服务内容..." 
                    className="mt-1" 
                    rows={3}
                    value={formData.expContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, expContent: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetFormData(); setUploadDialogOpen(false) }}>取消</Button>
            <Button onClick={handleSaveUpload}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
