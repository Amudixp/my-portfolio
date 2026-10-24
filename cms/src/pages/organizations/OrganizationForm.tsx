import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';
import { Button } from '../../components/ui/Button';
import { FormRow } from '../../components/ui/FormRow';
import { Input, NumberInput } from '../../components/ui/Inputs';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Tabs, Tab } from '../../components/ui/Tabs';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { Select } from '../../components/ui/Form';
import { MediaPickerModal } from '../../components/attachments/MediaPickerModal';
import type { Organization } from '../../lib/types';

interface OrganizationFormProps {
  draft: Partial<Organization>;
  onChange: (value: Partial<Organization>) => void;
  onSave: () => void;
  saving: boolean;
  isExisting: boolean;
  onCancel: () => void;
}

const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'left', 'right', null];

export function OrganizationForm({ draft, onChange, onSave, saving, isExisting, onCancel }: OrganizationFormProps) {
  useMediaLibrary();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'position' | 'logo' | 'more'>('basic');
  const [description, setDescription] = useState((draft as any).description ?? '');

  const logoUrl = (draft as any).logo ?? null;

  const updateDraft = (patch: Partial<Organization>) => {
    onChange({ ...draft, ...patch });
  };

  const handlePick = (item: any) => {
    updateDraft({ logo: item.url, mediaId: item.id } as any);
    setPickerOpen(false);
  };

  return (
    <div>
      <div className="border-b border-[#f1f1ef] px-6 sm:px-8">
        <Tabs>
          <Tab active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
            Basic info
          </Tab>
          <Tab active={activeTab === 'position'} onClick={() => setActiveTab('position')}>
            Position & size
          </Tab>
          <Tab active={activeTab === 'logo'} onClick={() => setActiveTab('logo')}>
            Logo
          </Tab>
          <Tab active={activeTab === 'more'} onClick={() => setActiveTab('more')}>
            More info
          </Tab>
        </Tabs>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        {activeTab === 'basic' ? (
          <>
            <FormRow label="Name" helper="Displayed in the experience graph and lists.">
              <Input value={draft.name ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ name: e.target.value })} />
            </FormRow>
            <FormRow label="Slug" helper={isExisting ? 'Cannot be changed after creation.' : 'Lowercase slug used as the node id.'}>
              <Input
                value={draft.id ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ id: e.target.value.toLowerCase() } as any)}
                disabled={isExisting}
              />
            </FormRow>
            <FormRow label="Short name" helper="Used in tight layouts.">
              <Input value={(draft as any).shortName ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ shortName: e.target.value } as any)} />
            </FormRow>
          </>
        ) : null}

        {activeTab === 'position' ? (
          <>
            <FormRow label="Position & size" helper="Values are synced with the public hub-and-spoke diagram.">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <NumberInput value={draft.x ?? 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ x: Number(e.target.value) })} placeholder="X" />
                <NumberInput value={draft.y ?? 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ y: Number(e.target.value) })} placeholder="Y" />
                <NumberInput value={draft.size ?? 80} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ size: Number(e.target.value) })} placeholder="Size" />
              </div>
            </FormRow>
            <FormRow label="Rotation" helper="Degrees.">
              <div className="max-w-[200px]">
                <NumberInput value={(draft as any).rotate ?? 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ rotate: Number(e.target.value) } as any)} />
              </div>
            </FormRow>
          </>
        ) : null}

        {activeTab === 'logo' ? (
          <FormRow label="Logo" helper="JPEG, PNG or WebP. Max 300 KB.">
            <div className="flex flex-col gap-3">
              <ImageUpload url={logoUrl} alt={draft.name ?? ''} onReplace={() => setPickerOpen(true)} onRemove={() => updateDraft({ logo: null, mediaId: null } as any)} />
              <Button type="button" variant="outline" size="sm" icon={<Plus size={14} />} className="w-fit" onClick={() => setPickerOpen(true)}>
                Open media library
              </Button>
            </div>
          </FormRow>
        ) : null}

        {activeTab === 'more' ? (
          <>
            <FormRow label="Tooltip placement" helper="Controls where the hover tooltip appears.">
              <div className="max-w-[260px]">
                <Select
                  value={(draft as any).tooltipPlacement ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDraft({ tooltipPlacement: e.target.value || null } as any)}
                  className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.01)] focus:border-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#9ca3af]"
                >
                  {TOOLTIP_PLACEMENTS.map((placement) => (
                    <option key={placement ?? 'auto'} value={placement ?? ''}>
                      {placement ?? 'auto'}
                    </option>
                  ))}
                </Select>
              </div>
            </FormRow>
            <FormRow label="Description" helper="Optional rich text shown in more detail views.">
              <RichTextEditor value={description} onChange={setDescription} placeholder="Write a short description..." />
            </FormRow>
          </>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 sm:px-8">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Save draft
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Publish
            </Button>
          </div>
        </div>
      </form>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePick}
        folder="portfolio/organizations"
      />
    </div>
  );
}
