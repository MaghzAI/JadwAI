'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  currentImage?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 5 * 1024 * 1024, // 5MB
  currentImage,
  disabled = false
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        setError('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        setError('نوع الملف غير مدعوم. يرجى اختيار صورة');
      } else {
        setError('حدث خطأ في رفع الملف');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled
  });

  const removeFile = () => {
    setPreview(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <Label>الصورة الشخصية</Label>
      
      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative mx-auto w-32 h-32">
              <Image
                src={preview}
                alt="معاينة الصورة"
                fill={true}
                className="object-cover rounded-lg"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {preview === currentImage ? 'الصورة الحالية' : 'صورة جديدة محددة'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card
          {...getRootProps()}
          className={`cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-dashed border-gray-300 hover:border-gray-400'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragActive
                  ? 'اسحب الصورة هنا...'
                  : 'اضغط لاختيار صورة أو اسحبها هنا'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF حتى 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
