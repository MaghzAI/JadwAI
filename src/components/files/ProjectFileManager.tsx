'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Archive,
  Download,
  Eye,
  Edit3,
  Trash2,
  Share,
  FolderPlus,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  Star,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ProjectFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  category: 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'presentation' | 'archive' | 'other';
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: Date;
  lastModified: Date;
  description?: string;
  tags: string[];
  folder?: string;
  isPublic: boolean;
  isStarred: boolean;
  version: number;
  versions?: ProjectFile[];
  downloadUrl: string;
  previewUrl?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
}

interface FileFolder {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  filesCount: number;
  color: string;
}

interface ProjectFileManagerProps {
  projectId: string;
  canEdit?: boolean;
}

const CATEGORIES = [
  { value: 'document', label: 'مستندات', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  { value: 'image', label: 'صور', icon: Image, color: 'bg-green-100 text-green-800' },
  { value: 'video', label: 'فيديو', icon: FileVideo, color: 'bg-purple-100 text-purple-800' },
  { value: 'audio', label: 'صوتيات', icon: FileAudio, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'spreadsheet', label: 'جداول بيانات', icon: FileSpreadsheet, color: 'bg-emerald-100 text-emerald-800' },
  { value: 'archive', label: 'أرشيف', icon: Archive, color: 'bg-gray-100 text-gray-800' },
  { value: 'other', label: 'أخرى', icon: File, color: 'bg-slate-100 text-slate-800' }
];

export function ProjectFileManager({ projectId, canEdit = true }: ProjectFileManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'دراسة_الجدوى_النهائية.pdf',
      originalName: 'دراسة الجدوى النهائية.pdf',
      size: 2048000,
      type: 'application/pdf',
      category: 'document',
      uploadedBy: { id: '1', name: 'أحمد محمد' },
      uploadedAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      description: 'دراسة الجدوى الاقتصادية الشاملة للمشروع',
      tags: ['جدوى', 'اقتصادية', 'تحليل'],
      folder: 'دراسات',
      isPublic: false,
      isStarred: true,
      version: 2,
      downloadUrl: '/api/files/1/download',
      previewUrl: '/api/files/1/preview',
      status: 'ready'
    },
    {
      id: '2',
      name: 'عرض_المشروع.pptx',
      originalName: 'عرض المشروع.pptx',
      size: 5120000,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      category: 'document',
      uploadedBy: { id: '2', name: 'فاطمة أحمد' },
      uploadedAt: new Date('2024-02-01'),
      lastModified: new Date('2024-02-01'),
      description: 'عرض تقديمي للمشروع',
      tags: ['عرض', 'تقديمي'],
      isPublic: true,
      isStarred: false,
      version: 1,
      downloadUrl: '/api/files/2/download',
      status: 'ready'
    }
  ]);

  const [folders, setFolders] = useState<FileFolder[]>([
    {
      id: '1',
      name: 'دراسات',
      description: 'دراسات الجدوى والأبحاث',
      createdAt: new Date('2024-01-10'),
      filesCount: 3,
      color: 'blue'
    },
    {
      id: '2',
      name: 'عقود',
      description: 'العقود والاتفاقيات',
      createdAt: new Date('2024-01-12'),
      filesCount: 2,
      color: 'green'
    },
    {
      id: '3',
      name: 'صور',
      description: 'الصور والوسائط المرئية',
      createdAt: new Date('2024-01-15'),
      filesCount: 8,
      color: 'purple'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const getFileIcon = (file: ProjectFile) => {
    const category = CATEGORIES.find(cat => cat.value === file.category);
    return category ? category.icon : File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file) => {
      const newFile: ProjectFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category: 'other', // This would be determined by file type
        uploadedBy: { id: 'current', name: 'المستخدم الحالي' },
        uploadedAt: new Date(),
        lastModified: new Date(),
        tags: [],
        isPublic: false,
        isStarred: false,
        version: 1,
        downloadUrl: '',
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'ready' as const, progress: 100 }
              : f
          ));
        } else {
          setFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress }
              : f
          ));
        }
      }, 500);
    });

    setIsUploadDialogOpen(false);
  }, []);

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
    ));
  };

  const handleCreateFolder = (name: string, description: string, color: string) => {
    const newFolder: FileFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      createdAt: new Date(),
      filesCount: 0,
      color
    };
    setFolders(prev => [...prev, newFolder]);
    setIsCreateFolderDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الملفات
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            إدارة وتنظيم ملفات ومرفقات المشروع
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4 mr-2" />
                مجلد جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء مجلد جديد</DialogTitle>
                <DialogDescription>
                  أنشئ مجلد جديد لتنظيم الملفات
                </DialogDescription>
              </DialogHeader>
              <CreateFolderForm onCreateFolder={handleCreateFolder} />
            </DialogContent>
          </Dialog>

          {canEdit && (
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  رفع ملفات
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>رفع ملفات جديدة</DialogTitle>
                  <DialogDescription>
                    اختر الملفات المراد رفعها للمشروع
                  </DialogDescription>
                </DialogHeader>
                <FileUploadForm onFileSelect={handleFileUpload} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الملفات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فئة الملف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="المجلد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المجلدات</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.name}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folders Section */}
      {folders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المجلدات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map(folder => (
                <div
                  key={folder.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setSelectedFolder(folder.name)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full bg-${folder.color}-500`} />
                    <h4 className="font-medium">{folder.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {folder.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {folder.filesCount} ملف
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            الملفات ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                لا توجد ملفات
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                ابدأ برفع الملفات للمشروع
              </p>
              {canEdit && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  رفع ملف
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-2"
            }>
              {filteredFiles.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onDelete={handleDeleteFile}
                  onToggleStar={handleToggleStar}
                  canEdit={canEdit}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions moved outside component
const getFileIconHelper = (file: ProjectFile) => {
  const category = CATEGORIES.find(cat => cat.value === file.category);
  return category ? category.icon : File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File Card Component
function FileCard({ 
  file, 
  viewMode, 
  onDelete, 
  onToggleStar, 
  canEdit 
}: { 
  file: ProjectFile; 
  viewMode: 'grid' | 'list'; 
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  canEdit: boolean;
}) {
  const FileIcon = getFileIconHelper(file);
  const category = CATEGORIES.find(cat => cat.value === file.category);

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex-shrink-0">
          <FileIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{file.name}</h4>
            {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            <Badge variant="outline" className={category?.color}>
              {category?.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {formatFileSize(file.size)} • {format(file.uploadedAt, 'PP', { locale: ar })} • {file.uploadedBy.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {file.status === 'uploading' && (
            <Progress value={file.progress} className="w-20" />
          )}
          <FileActions 
            file={file} 
            onDelete={onDelete} 
            onToggleStar={onToggleStar} 
            canEdit={canEdit} 
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileIcon className="h-6 w-6 text-blue-600" />
            {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          </div>
          <FileActions 
            file={file} 
            onDelete={onDelete} 
            onToggleStar={onToggleStar} 
            canEdit={canEdit} 
          />
        </div>

        <h4 className="font-medium truncate mb-2" title={file.name}>
          {file.name}
        </h4>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={category?.color}>
              {category?.label}
            </Badge>
            <span>{formatFileSize(file.size)}</span>
          </div>

          {file.description && (
            <p className="text-xs truncate" title={file.description}>
              {file.description}
            </p>
          )}

          {file.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {file.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 text-xs">
            <User className="h-3 w-3" />
            <span>{file.uploadedBy.name}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{format(file.uploadedAt, 'PP', { locale: ar })}</span>
          </div>
        </div>

        {file.status === 'uploading' && (
          <Progress value={file.progress} className="mt-3" />
        )}
      </CardContent>
    </Card>
  );
}

// File Actions Component
function FileActions({ 
  file, 
  onDelete, 
  onToggleStar, 
  canEdit 
}: { 
  file: ProjectFile; 
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  canEdit: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="h-4 w-4 mr-2" />
          معاينة
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="h-4 w-4 mr-2" />
          تحميل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStar(file.id)}>
          <Star className={`h-4 w-4 mr-2 ${file.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
          {file.isStarred ? 'إلغاء الإعجاب' : 'إضافة للمفضلة'}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share className="h-4 w-4 mr-2" />
          مشاركة
        </DropdownMenuItem>
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit3 className="h-4 w-4 mr-2" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(file.id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              حذف
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Create Folder Form Component
function CreateFolderForm({ onCreateFolder }: { onCreateFolder: (name: string, description: string, color: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');

  const colors = [
    { value: 'blue', label: 'أزرق', class: 'bg-blue-500' },
    { value: 'green', label: 'أخضر', class: 'bg-green-500' },
    { value: 'purple', label: 'بنفسجي', class: 'bg-purple-500' },
    { value: 'orange', label: 'برتقالي', class: 'bg-orange-500' },
    { value: 'red', label: 'أحمر', class: 'bg-red-500' },
    { value: 'yellow', label: 'أصفر', class: 'bg-yellow-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateFolder(name.trim(), description.trim(), color);
      setName('');
      setDescription('');
      setColor('blue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="folderName">اسم المجلد</Label>
        <Input
          id="folderName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم المجلد"
          required
        />
      </div>

      <div>
        <Label htmlFor="folderDescription">الوصف (اختياري)</Label>
        <Textarea
          id="folderDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف المجلد"
        />
      </div>

      <div>
        <Label>لون المجلد</Label>
        <div className="flex gap-2 mt-2">
          {colors.map(colorOption => (
            <button
              key={colorOption.value}
              type="button"
              className={`w-6 h-6 rounded-full ${colorOption.class} ${
                color === colorOption.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onClick={() => setColor(colorOption.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">إنشاء المجلد</Button>
        <Button type="button" variant="outline">إلغاء</Button>
      </div>
    </form>
  );
}

// File Upload Form Component
function FileUploadForm({ onFileSelect }: { onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">اسحب الملفات هنا</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          أو انقر لتحديد الملفات
        </p>
        <input
          type="file"
          multiple
          onChange={onFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button asChild>
            <span>اختيار الملفات</span>
          </Button>
        </label>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>الحد الأقصى لحجم الملف: 10 MB</p>
        <p>الصيغ المدعومة: PDF، DOC، XLS، PPT، JPG، PNG، MP4، وأخرى</p>
      </div>
    </div>
  );
}
