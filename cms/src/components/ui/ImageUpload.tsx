import { X } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadProps {
  url?: string | null;
  alt?: string | null;
  onReplace?: () => void;
  onRemove?: () => void;
}

export function ImageUpload({ url, alt, onReplace, onRemove }: ImageUploadProps) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f8f9fa]">
        {url && !errored ? (
          <img
            src={url}
            alt={alt ?? ''}
            className="h-full w-full object-contain"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#9ca3af]">
            {(alt ?? 'IMG').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onReplace ? (
          <button
            type="button"
            onClick={onReplace}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:bg-[#f9fafb]"
          >
            Replace
          </button>
        ) : null}
        {onRemove && url ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-ink"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
