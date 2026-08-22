import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { VisionUploaderProps } from '@/types'

export function VisionUploader({
  onImageSelected,
  onClose,
  previewUrl,
  onClearPreview,
}: VisionUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onImageSelected(file)
      }
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0])
    }
  }

  return (
    <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm my-2 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-700">
            <ImageIcon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900">Crop Vision AI Diagnostic</h3>
            <p className="text-[11px] text-gray-500">Upload leaf, crop specimen or soil photo</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close uploader"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-emerald-300 max-h-48 bg-slate-900 flex items-center justify-center">
          <img src={previewUrl} alt="Crop preview" className="max-h-48 object-contain w-full" />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-emerald-900/80 backdrop-blur-xs text-emerald-200 text-[10px] rounded-md font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> Image Ready
            </span>
            {onClearPreview && (
              <button
                onClick={onClearPreview}
                className="p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                aria-label="Clear image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-150',
            isDragging
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-400'
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <UploadCloud size={20} />
          </div>
          <p className="text-xs font-semibold text-emerald-900">
            Drag & drop crop image for disease analysis
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
        </div>
      )}
    </div>
  )
}
