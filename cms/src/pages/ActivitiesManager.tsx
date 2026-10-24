import { useState } from 'react';
import { Edit2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { apiErrorMessage } from '../lib/api';
import { useResource } from '../hooks/useResource';
import { useToast } from '../context/ToastContext';
import type { Activity } from '../lib/types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { SortableList } from '../components/ui/SortableList';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { AttachmentField } from '../components/attachments/AttachmentField';
import type { AttachmentValue } from '../components/attachments/AttachmentField';

const CATEGORIES = ['Event', 'Visit', 'Organization', 'Academic', 'Competition', 'Internship'];

const emptyActivity: Partial<Activity> = {
  category: 'Event',
  tag: '',
  title: '',
  description: '',
  date: '',
};

export function ActivitiesManager() {
  const { items, loading, create, update, remove, reorder } = useResource<Activity>('/activities');
  const toast = useToast();
  const [draft, setDraft] = useState<Partial<Activity> | null>(null);
  const [attachment, setAttachment] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  const openCreate = () => {
    setDraft({ ...emptyActivity });
    setAttachment({ url: null, mediaId: null, alt: null });
  };

  const openEdit = (activity: Activity) => {
    setDraft(activity);
    setAttachment({
      url: activity.image ?? null,
      mediaId: activity.mediaId ?? null,
      alt: activity.title,
    });
  };

  const handleSave = async () => {
    if (!draft?.title) {
      toast.error('A title is required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        image: attachment.url,
        mediaId: attachment.mediaId,
      };
      if (draft.id) {
        await update(draft.id, payload);
        toast.success('Gallery item updated.');
      } else {
        await create(payload);
        toast.success('Gallery item added.');
      }
      setDraft(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the gallery item.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      toast.success('Gallery item removed.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to remove the gallery item.'));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Campus life gallery"
        description="Tiles of the About section. Drag to reorder them."
        actions={
            <Button type="button" size="sm" variant="primary" icon={<Plus size={14} />} onClick={openCreate}>
            Add tile
          </Button>
        }
      />

      {loading ? (
        <Spinner label="Loading gallery…" />
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => void reorder(ids)}
          empty={
            <EmptyState
              title="No gallery items yet"
              description="Add the campus activities you want to highlight."
              icon={<ImageIcon size={22} />}
            />
          }
          renderItem={(activity) => (
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                {activity.image ? (
                  <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={16} className="text-muted/60" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{activity.title}</p>
                <p className="truncate text-xs text-muted">
                  {activity.tag ? `${activity.tag} · ` : ''}
                  {activity.date}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="Edit tile" onClick={() => openEdit(activity)}>
                  <Edit2 size={15} />
                </IconButton>
                <IconButton label="Delete tile" tone="danger" onClick={() => setPendingDelete(activity)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
          )}
        />
      )}

      <Modal
        open={draft !== null}
        title={draft?.id ? 'Edit gallery item' : 'New gallery item'}
        onClose={() => setDraft(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={draft.title ?? ''}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={draft.category ?? 'Event'}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full rounded-lg border border-line bg-page-light px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tag" hint="Short label rendered on the tile, e.g. LEADERSHIP.">
                <Input value={draft.tag ?? ''} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} />
              </Field>
            </div>
            <Field label="Date" hint="Free format, e.g. OCT 2024.">
              <Input value={draft.date ?? ''} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea
                value={draft.description ?? ''}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </Field>
            <AttachmentField
              label="Tile image"
              value={attachment}
              onChange={setAttachment}
              folder="portfolio/about"
              hint="Portrait tiles look best at 3:4."
            />
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete gallery item"
        message="The tile will be removed from the About section. This cannot be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
