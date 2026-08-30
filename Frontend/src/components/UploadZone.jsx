import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  ImageIcon,
  X,
  Sparkles,
  ClipboardPaste,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function UploadZone({
  onFileSelected,
  onDemo,
  className,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      onFileSelected?.(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFiles([file]);
            break;
          }
        }
      }
    },
    [handleFiles]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div
      className={cn('w-full', className)}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card"
          >
            <img
              src={preview}
              alt="Uploaded screenshot"
              className={cn('w-full object-contain', compact ? 'max-h-48' : 'max-h-96')}
            />
            <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{fileName}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={clearPreview}>
                  <X className="h-3.5 w-3.5" /> Remove
                </Button>
                <Button size="sm" variant="gradient" onClick={onDemo}>
                  <Sparkles className="h-3.5 w-3.5" /> Analyze
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
                compact ? 'px-6 py-8' : 'px-6 py-16',
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/30'
              )}
            >
              <motion.div
                animate={
                  isDragging
                    ? { scale: 1.1, rotate: 5 }
                    : { scale: 1, rotate: 0 }
                }
                className={cn(
                  'mb-4 flex items-center justify-center rounded-2xl transition-colors',
                  compact ? 'h-12 w-12' : 'h-16 w-16',
                  isDragging ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
                )}
              >
                <UploadCloud size={compact ? 24 : 32} />
              </motion.div>
              <p className={cn('font-semibold text-foreground', compact ? 'text-sm' : 'text-base')}>
                Drop your website screenshot here
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                PNG, JPG or WEBP up to 10MB
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size={compact ? 'sm' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <ImageIcon className="h-4 w-4" /> Browse files
                </Button>
                {onDemo && (
                  <Button
                    variant="gradient"
                    size={compact ? 'sm' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDemo();
                    }}
                  >
                    <Sparkles className="h-4 w-4" /> Try a Demo
                  </Button>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ClipboardPaste className="h-3 w-3" />
                Or paste an image directly (Ctrl+V)
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
