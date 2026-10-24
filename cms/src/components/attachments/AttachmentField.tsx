import { useRef, useState } from 'react';
import { Image as ImageIcon, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { apiErrorMessage } from '../../lib/api';
import { uploadAsset } from '../../lib/upload';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Field, Input } from '../ui/Form';
import { MediaPickerModal } from './MediaPickerModal';

export interface AttachmentValue {
  url: string | null;
  mediaId: number | null;
  alt: string | null;
}

interface AttachmentFieldProps {
  label: string;
  value: AttachmentValue;
  onChange: (value: AttachmentValue) => void;
  folder?: string;
  hint?: string;
  accept?: string;
  /** "raw" uploads documents such as the CV instead of images. */
  resourceType?: 'image' | 'raw';
  /** Extra controls rendered next to the preview, e.g. an object position picker. */
  children?: React.ReactNode;
}

/**
 * One attachment slot. Every image of the site (project covers, gallery tiles,
 * logos, hero background, contact photo…) is edited through this widget, so
 * the behaviour is identical everywhere.
 */
export function AttachmentField({
  label,
  value,
  onChange,
  folder = 'portfolio',
  hint,
  accept = 'image/*',
  resourceType = 'image',
  children,
}: AttachmentFieldProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const media = await uploadAsset(file, folder, resourceType);
      onChange({ url: media.url, mediaId: media.id, alt: value.alt ?? media.alt ?? null });
      toast.success('Asset uploaded.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Upload failed.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange({ url: null, mediaId: null, alt: null });
  };

  return (
    <div className="space-y-3">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface">
          {value.url ? (
            resourceType === 'image' ? (
              <img src={value.url} alt={value.alt ?? ''} className="h-full w-full object-cover" />
            ) : (
              <a
                href={value.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 text-center text-xs font-medium text-accent underline"
              >
                Open file
              </a>
            )
          ) : (
            <ImageIcon size={22} className="text-muted/60" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {resourceType === 'image' ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                icon={<Link2 size={14} />}
                onClick={() => setPickerOpen(true)}
              >
                Library
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="outline"
              icon={uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            {value.url ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                icon={<Trash2 size={14} />}
                onClick={handleRemove}
              >
                Remove
              </Button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </div>

          {value.url ? (
            <p className="truncate text-xs text-muted" title={value.url}>
              {value.url}
            </p>
          ) : (
            <p className="text-xs text-muted">{hint ?? 'No attachment yet.'}</p>
          )}

          {resourceType === 'image' ? (
            <Field label="Alt text" hint="Describes the image for screen readers and search engines.">
              <Input
                value={value.alt ?? ''}
                onChange={(event) => onChange({ ...value, alt: event.target.value || null })}
                placeholder="e.g. Amudi Purba portrait"
              />
            </Field>
          ) : null}

          {children}
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => {
          onChange({ url: media.url, mediaId: media.id, alt: value.alt ?? media.alt ?? null });
          setPickerOpen(false);
        }}
        folder={folder}
      />
    </div>
  );
}
