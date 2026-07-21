'use client';

import { useRef } from 'react';
import { Camera, X, FileText, Sparkles, ScanLine } from 'lucide-react';

interface ExistingPhoto {
  id: string;
  url: string;
}

interface FoodPhotoSectionProps {
  existing: ExistingPhoto[];
  pendingFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemovePending: (index: number) => void;
  onRemoveExisting?: (id: string) => void;
  max?: number;
}

/** Multi food-photo attachment grid — mirrors FoodPhotoAttachmentSection in PhotoAttachmentViews.swift. */
export function FoodPhotoSection({
  existing,
  pendingFiles,
  onAddFiles,
  onRemovePending,
  onRemoveExisting,
  max = 6,
}: FoodPhotoSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const total = existing.length + pendingFiles.length;

  return (
    <div>
      <p className="mb-2 text-sm font-bold" style={{ color: 'var(--foreground)' }}>
        Food Photos
      </p>
      <div className="grid grid-cols-3 gap-2">
        {existing.map((photo) => (
          <div key={photo.id} className="relative h-[88px] overflow-hidden rounded-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="Food" className="h-full w-full object-cover" />
            {onRemoveExisting && (
              <button
                onClick={() => onRemoveExisting(photo.id)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--destructive)] text-white"
              >
                <X size={11} strokeWidth={3} />
              </button>
            )}
          </div>
        ))}
        {pendingFiles.map((file, index) => (
          <div key={`${file.name}-${index}`} className="relative h-[88px] overflow-hidden rounded-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={URL.createObjectURL(file)} alt="Pending upload" className="h-full w-full object-cover" />
            <button
              onClick={() => onRemovePending(index)}
              aria-label="Remove pending photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--destructive)] text-white"
            >
              <X size={11} strokeWidth={3} />
            </button>
          </div>
        ))}
        {total < max && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-[88px] flex-col items-center justify-center gap-1 rounded-[14px] text-[var(--text-secondary)]"
            style={{ background: 'var(--chip-fill)' }}
          >
            <Camera size={18} strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onAddFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

interface MenuPdfSectionProps {
  menuFile: File | null;
  onFileChange: (file: File | null) => void;
  hasSavedPDF: boolean;
  saving?: boolean;
  onSavePDF: () => void;
  onViewPDF: () => void;
}

/** Menu photo -> PDF attachment flow — mirrors MenuPDFAttachmentSection in PhotoAttachmentViews.swift. */
export function MenuPdfSection({ menuFile, onFileChange, hasSavedPDF, saving, onSavePDF, onViewPDF }: MenuPdfSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = menuFile ? URL.createObjectURL(menuFile) : null;

  return (
    <div>
      <p className="mb-2 text-sm font-bold" style={{ color: 'var(--foreground)' }}>
        Menu (photo → PDF)
      </p>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex h-[120px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[16px]"
        style={{ background: 'var(--chip-fill)', border: '2px solid var(--input-border)' }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Menu preview" className="h-full w-full object-cover" />
        ) : (
          <>
            <ScanLine size={22} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Add menu photo</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />

      <div className="mt-2.5 flex gap-2.5">
        <button onClick={onSavePDF} disabled={!menuFile || saving} className="btn-green flex flex-1 items-center justify-center gap-2 py-3 text-[13px] text-white disabled:opacity-50">
          <Sparkles size={13} strokeWidth={2.6} />
          {saving ? 'Saving…' : 'Scan & save PDF to restaurant'}
        </button>
        {hasSavedPDF && (
          <button
            onClick={onViewPDF}
            className="flex items-center gap-1.5 rounded-[18px] border-2 px-3 py-3 text-[13px] font-bold"
            style={{ borderColor: 'var(--brand-green)', color: 'var(--brand-green)' }}
          >
            <FileText size={13} strokeWidth={2.6} />
            View PDF
          </button>
        )}
      </div>
    </div>
  );
}
