import { useState } from 'react';
import { Copy, Globe, GripVertical, Plus } from 'lucide-react';
import { useResource } from '../hooks/useResource';
import { useToast } from '../context/ToastContext';
import type { Organization } from '../lib/types';
import { Button } from '../components/ui/Button';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { SortableList } from '../components/ui/SortableList';
import { ConfirmDialog } from '../components/ui/Modal';
import { ListRow } from '../components/ui/ListRow';
import { PageHeader } from '../components/ui/PageHeader';
import { OrganizationForm } from './organizations/OrganizationForm';

export function OrganizationsManager() {
  const { items, loading, create, update, remove, reorder } = useResource<Organization>('/organizations');
  const toast = useToast();
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [draft, setDraft] = useState<Partial<Organization> | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null);

  const openCreate = () => {
    setDraft({ id: '', name: '', shortName: '', x: 0, y: 0, size: 80, rotate: 0, tooltipPlacement: null });
    setMode('edit');
  };

  const openEdit = (organization: Organization) => {
    setDraft(organization);
    setMode('edit');
  };

  const backToList = () => {
    setMode('list');
    setDraft(null);
  };

  const handleSave = async (payload: Partial<Organization>) => {
    if (!payload.name) {
      toast.error('A name is required.');
      return;
    }
    setSaving(true);
    try {
      if (payload.id && items.some((item) => item.id === payload.id)) {
        await update(payload.id, payload);
        toast.success('Organization updated.');
      } else {
        if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(payload.id ?? '')) {
          toast.error('The id must be a lowercase slug, e.g. "itb" or "akhdani".');
          return;
        }
        await create(payload);
        toast.success('Organization added.');
      }
      backToList();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to save the organization.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      toast.success('Organization removed.');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to remove the organization.');
    } finally {
      setPendingDelete(null);
    }
  };

  if (mode === 'edit' && draft) {
    const isExisting = items.some((item) => item.id === draft.id);
    return (
      <>
        <PageHeader
          thumbnail={<Globe size={18} className="text-[#9ca3af]" />}
          title={draft.name || 'New organization'}
          subtitle={draft.id ? `${draft.id} · ${draft.x}, ${draft.y}` : 'New organization'}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" icon={<Copy size={15} />} className="hidden sm:inline-flex">
                Copy link
              </Button>
              <Button variant="outline">Save draft</Button>
              <Button variant="primary" onClick={() => handleSave(draft)} loading={saving}>
                Publish
              </Button>
              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-ink">
                AP
              </div>
            </div>
          }
        />
        <OrganizationForm
          draft={draft}
          onChange={(value) => setDraft(value)}
          onSave={() => handleSave(draft)}
          saving={saving}
          isExisting={isExisting}
          onCancel={backToList}
        />
        <ConfirmDialog
          open={pendingDelete !== null}
          title="Delete organization"
          message="The node disappears from the graph. Experiences keep their data but lose the link."
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDelete}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Organizations"
        subtitle={`${items.length} organizations`}
        actions={
          <Button variant="primary" icon={<Plus size={15} />} onClick={openCreate}>
            Add organization
          </Button>
        }
      />
      <div className="px-6 py-4 sm:px-8">
        {loading ? (
          <Spinner label="Loading organizations…" />
        ) : (
          <SortableList
            items={items}
            onReorder={(ids) => void reorder(ids)}
            empty={
              <EmptyState
                title="No organizations yet"
                description="Add the institutions and companies shown in the experience graph."
              />
            }
            renderItem={(organization) => (
              <ListRow
                handle={<GripVertical size={16} className="cursor-grab text-[#9ca3af]" />}
                leading={
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f8f9fa]">
                    {organization.logo ? (
                      <img
                        src={organization.logo}
                        alt={organization.name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-medium text-[#9ca3af]">
                        {organization.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                }
                title={organization.name}
                subtitle={`${organization.id} · x ${organization.x} · y ${organization.y} · size ${organization.size}`}
                onEdit={() => openEdit(organization)}
                onDelete={() => setPendingDelete(organization)}
              />
            )}
          />
        )}
      </div>
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete organization"
        message="The node disappears from the graph. Experiences keep their data but lose the link."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
