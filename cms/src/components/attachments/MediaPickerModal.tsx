import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search, Upload } from 'lucide-react';
import { api, apiErrorMessage } from '../../lib/api';
import { uploadAsset } from '../../lib/upload';
import type { Media } from '../../lib/types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Form';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/Feedback';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  folder?: string;
}

export function MediaPickerModal({ open, onClose, onSelect, folder = 'portfolio' }: MediaPickerModalProps) {
  const toast = useToast();
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Media[]>('/media', {
        params: search ? { q: search } : undefined,
      });
      setItems(data ?? []);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to load the media library.'));
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const media = await uploadAsset(file, folder, 'image');
      setItems((current) => [media, ...current]);
      toast.success('Asset uploaded.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Media library"
      description="Pick an existing asset or upload a new one."
      onClose={onClose}
      size="xl"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by filename or alt text"
            className="pl-9"
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-pill/60 px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-pill">
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
              event.target.value = '';
            }}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No assets yet"
          description="Upload an image to start filling this slot."
          icon={<Upload size={22} />}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((media) => (
            <button
              key={media.id}
              type="button"
              onClick={() => onSelect(media)}
              className="group overflow-hidden rounded-xl border border-line bg-page-light text-left transition-colors hover:border-accent"
            >
              <div className="flex h-32 items-center justify-center overflow-hidden bg-surface">
                <img
                  src={media.url}
                  alt={media.alt ?? ''}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="px-2.5 py-2">
                <p className="truncate text-xs font-medium text-ink">
                  {media.filename ?? media.publicId}
                </p>
                {media.width && media.height ? (
                  <p className="text-[11px] text-muted">
                    {media.width}×{media.height}
                  </p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
