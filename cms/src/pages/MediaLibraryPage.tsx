import { useState } from 'react';
import { ExternalLink, Loader2, Search, Trash2, Upload } from 'lucide-react';
import { apiErrorMessage } from '../lib/api';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useToast } from '../context/ToastContext';
import { uploadAsset } from '../lib/upload';
import { PageHeader } from '../components/ui/Card';
import { IconButton } from '../components/ui/Button';
import { Input } from '../components/ui/Form';
import { Badge, EmptyState, Spinner } from '../components/ui/Feedback';
import { ConfirmDialog } from '../components/ui/Modal';

export function MediaLibraryPage() {
  const media = useMediaLibrary();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const visible = media.items.filter((item) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      (item.filename ?? '').toLowerCase().includes(needle) ||
      (item.alt ?? '').toLowerCase().includes(needle) ||
      item.publicId.toLowerCase().includes(needle)
    );
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadAsset(file, 'portfolio/media', 'image');
      await media.refresh();
      toast.success('Asset uploaded.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (pendingDelete === null) return;
    try {
      await media.remove(pendingDelete);
      toast.success('Asset deleted.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'The asset is still in use somewhere.'));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Media library"
        description="Every uploaded asset with the content that references it."
        actions={
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-page-light transition-colors hover:bg-accent-hover">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading…' : 'Upload asset'}
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
        }
      />

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search assets"
          className="pl-9"
        />
      </div>

      {media.loading ? (
        <Spinner label="Loading media…" />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No assets found"
          description="Upload an image to build the media library."
          icon={<Upload size={22} />}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-xl border border-line bg-page-light shadow-card"
            >
              <div className="flex h-36 items-center justify-center overflow-hidden bg-surface">
                <img src={item.url} alt={item.alt ?? ''} className="h-full w-full object-cover" />
              </div>
              <figcaption className="space-y-2 p-3">
                <p className="truncate text-xs font-medium text-ink" title={item.filename ?? item.publicId}>
                  {item.filename ?? item.publicId}
                </p>
                <p className="text-[11px] text-muted">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ''}
                  {item.folder ?? 'portfolio'}
                </p>
                {item.usage.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.usage.map((usage) => (
                      <Badge key={`${usage.type}-${usage.refId}-${usage.label}`} tone="accent">
                        {usage.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge>unused</Badge>
                )}
                <div className="flex items-center justify-end gap-1 pt-1">
                  <IconButton
                    label="Open asset"
                    onClick={() => window.open(item.url, '_blank', 'noopener')}
                  >
                    <ExternalLink size={15} />
                  </IconButton>
                  <IconButton label="Delete asset" tone="danger" onClick={() => setPendingDelete(item.id)}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete asset"
        message="Assets that are still used by the site content cannot be deleted."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
