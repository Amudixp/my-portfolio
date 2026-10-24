import { useEffect, useState } from 'react';
import type { SectionAsset } from '../../lib/types';
import { useToast } from '../../context/ToastContext';
import { apiErrorMessage } from '../../lib/api';
import { AttachmentField } from './AttachmentField';
import type { AttachmentValue } from './AttachmentField';

interface SectionAssetFieldProps {
  label: string;
  section: string;
  slot: string;
  asset: SectionAsset | null;
  folder?: string;
  hint?: string;
  onSave: (payload: {
    mediaId: number | null;
    url: string | null;
    alt: string | null;
    meta: Record<string, unknown>;
  }) => Promise<unknown>;
}

/**
 * Binds an attachment widget to a section slot of the public site
 * (hero.background, contact.qr, navbar.avatar…).
 */
export function SectionAssetField({
  label,
  section,
  slot,
  asset,
  folder,
  hint,
  onSave,
}: SectionAssetFieldProps) {
  const toast = useToast();
  const [value, setValue] = useState<AttachmentValue>({
    url: asset?.url ?? null,
    mediaId: asset?.mediaId ?? null,
    alt: asset?.alt ?? null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue({
      url: asset?.url ?? null,
      mediaId: asset?.mediaId ?? null,
      alt: asset?.alt ?? null,
    });
  }, [asset]);

  const persist = async (next: AttachmentValue) => {
    setValue(next);
    setSaving(true);
    try {
      await onSave({
        mediaId: next.mediaId,
        url: next.url,
        alt: next.alt,
        meta: (asset?.meta ?? {}) as Record<string, unknown>,
      });
      toast.success(`${label} updated.`);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the attachment.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={saving ? 'opacity-70' : ''}>
      <AttachmentField
        label={label}
        value={value}
        onChange={(next) => void persist(next)}
        folder={folder ?? `portfolio/${section}`}
        hint={hint}
      />
      <p className="mt-1 text-[11px] text-muted/80">
        Slot: <code className="text-muted">{section}.{slot}</code>
      </p>
    </div>
  );
}
