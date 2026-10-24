import { useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { apiErrorMessage } from '../lib/api';
import { useResource } from '../hooks/useResource';
import { useToast } from '../context/ToastContext';
import type { SkillCategory } from '../lib/types';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { SortableList } from '../components/ui/SortableList';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { AttachmentField } from '../components/attachments/AttachmentField';
import type { AttachmentValue } from '../components/attachments/AttachmentField';

export function SkillsManager() {
  const { items, loading, create, update, remove, reorder } = useResource<SkillCategory>('/skills');
  const toast = useToast();
  const [draft, setDraft] = useState<Partial<SkillCategory> | null>(null);
  const [itemsInput, setItemsInput] = useState('');
  const [attachment, setAttachment] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SkillCategory | null>(null);

  const openCreate = () => {
    setDraft({ category: '', items: [] });
    setItemsInput('');
    setAttachment({ url: null, mediaId: null, alt: null });
  };

  const openEdit = (category: SkillCategory) => {
    setDraft(category);
    setItemsInput((category.items ?? []).join(', '));
    setAttachment({
      url: category.icon ?? null,
      mediaId: category.mediaId ?? null,
      alt: category.category,
    });
  };

  const handleSave = async () => {
    if (!draft?.category) {
      toast.error('A category name is required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        items: itemsInput
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        icon: attachment.url,
        mediaId: attachment.mediaId,
      };
      if (draft.id) {
        await update(draft.id, payload);
        toast.success('Skill category updated.');
      } else {
        await create(payload);
        toast.success('Skill category added.');
      }
      setDraft(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the skill category.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      toast.success('Skill category removed.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to remove the skill category.'));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Skills"
        description="Skill categories with their items and optional icon."
        actions={
          <Button type="button" icon={<Plus size={15} />} onClick={openCreate}>
            Add category
          </Button>
        }
      />

      <Card>
        <CardHeader title="Categories" description={`${items.length} categories.`} />
        {loading ? (
          <Spinner label="Loading skills…" />
        ) : (
          <SortableList
            items={items}
            onReorder={(ids) => void reorder(ids)}
            empty={
              <EmptyState
                title="No skill categories yet"
                description="Group the skills the way they should appear on the site."
              />
            }
            renderItem={(category) => (
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                  {category.icon ? (
                    <img src={category.icon} alt={category.category} className="h-full w-full object-contain" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{category.category}</p>
                  <p className="truncate text-xs text-muted">{(category.items ?? []).join(' · ')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label="Edit category" onClick={() => openEdit(category)}>
                    <Edit2 size={15} />
                  </IconButton>
                  <IconButton label="Delete category" tone="danger" onClick={() => setPendingDelete(category)}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            )}
          />
        )}
      </Card>

      <Modal
        open={draft !== null}
        title={draft?.id ? 'Edit category' : 'New category'}
        onClose={() => setDraft(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} loading={saving}>
              Save category
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <Field label="Category">
              <Input
                value={draft.category ?? ''}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </Field>
            <Field label="Skills" hint="Comma separated.">
              <Textarea
                value={itemsInput}
                onChange={(e) => setItemsInput(e.target.value)}
                className="min-h-20"
              />
            </Field>
            <AttachmentField
              label="Icon"
              value={attachment}
              onChange={setAttachment}
              folder="portfolio/skills"
              hint="Small square icon, e.g. 64×64."
            />
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete skill category"
        message="The category and its skills will be removed from the site."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
