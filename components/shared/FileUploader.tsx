'use client';

import { useState, useRef } from 'react';
import { Paperclip, Upload, File, FileText, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import { useAttachments, useUploadAttachment, useDeleteAttachment } from '@/lib/api-client/attachments';
import { useUIStore } from '@/stores/useUIStore';

interface FileUploaderProps {
  applicationId?: string;
  readOnly?: boolean;
}

export function FileUploader({
  applicationId,
  readOnly = false,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { data: attachments = [], isLoading } = useAttachments(applicationId || '');
  const uploadAttachment = useUploadAttachment(applicationId || '');
  const deleteAttachment = useDeleteAttachment(applicationId || '');
  const addToast = useUIStore((state) => state.addToast);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (files: File[]) => {
    if (!applicationId) {
      addToast('Cannot upload files here', 'error');
      return;
    }
    
    files.forEach(file => {
      uploadAttachment.mutate(file, {
        onSuccess: () => {
          addToast(`Uploaded ${file.name}`);
        },
        onError: () => {
          addToast(`Failed to upload ${file.name}`, 'error');
        }
      });
    });
  };

  const handleRemove = (attId: string) => {
    if (!applicationId) return;
    deleteAttachment.mutate(attId, {
      onSuccess: () => addToast('Attachment removed'),
      onError: () => addToast('Failed to remove attachment', 'error')
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return <File className="w-4 h-4 text-violet-400" />;
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-pink-400" />;
    if (type.includes('pdf') || type.includes('text'))
      return <FileText className="w-4 h-4 text-blue-400" />;
    return <File className="w-4 h-4 text-violet-400" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-violet-400" />
          Attachments ({attachments.length})
        </h3>
      </div>

      {/* Upload Zone */}
      {!readOnly && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              processFiles(Array.from(e.dataTransfer.files));
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-1.5">
            <Upload className="w-5 h-5 text-gray-400" />
            <p className="text-xs text-gray-300 font-medium">
              Click to upload or drag & drop proof / documents
            </p>
            <p className="text-[11px] text-gray-500">
              Screenshots, email exports, PDF resumes (max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* Attachment List */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs group hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                <div className="p-1.5 rounded-lg bg-white/5 flex-shrink-0">
                  {getFileIcon(att.mimeType)}
                </div>
                <div className="truncate">
                  <p className="text-gray-200 font-medium truncate">{att.filename}</p>
                  <p className="text-[10px] text-gray-500">{att.size ? formatFileSize(att.size) : 'Unknown size'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {att.url && (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-400 hover:text-violet-400 transition-colors"
                    title="Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {!readOnly && (
                  <button
                    onClick={() => handleRemove(att.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        readOnly && <p className="text-xs text-gray-500 italic">No attachments added.</p>
      )}
    </div>
  );
}
