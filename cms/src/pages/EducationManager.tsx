import { useEffect, useState } from 'react';
import { Award, Edit2, Plus, Save, Trash2 } from 'lucide-react';
import { api, apiErrorMessage } from '../lib/api';
import { useResource } from '../hooks/useResource';
import { useToast } from '../context/ToastContext';
import type { Award as AwardType, Certification, Education } from '../lib/types';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { SortableList } from '../components/ui/SortableList';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { AttachmentField } from '../components/attachments/AttachmentField';
import type { AttachmentValue } from '../components/attachments/AttachmentField';

export function EducationManager() {
  const toast = useToast();
  const [education, setEducation] = useState<Education | null>(null);
  const [courseworks, setCourseworks] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const certifications = useResource<Certification>('/certifications');
  const awards = useResource<AwardType>('/awards');

  const [certDraft, setCertDraft] = useState<Partial<Certification> | null>(null);
  const [certAttachment, setCertAttachment] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });
  const [awardDraft, setAwardDraft] = useState<Partial<AwardType> | null>(null);
  const [awardAttachment, setAwardAttachment] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });
  const [pendingDelete, setPendingDelete] = useState<{ type: 'cert' | 'award'; id: number; title: string } | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<{ education: Education }>('/education');
        setEducation(data.education);
        setCourseworks((data.education.relevantCourseworks ?? []).join(', '));
      } catch (error) {
        toast.error(apiErrorMessage(error, 'Failed to load the education data.'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [toast]);

  const handleSaveEducation = async () => {
    if (!education) return;
    setSaving(true);
    try {
      const { data } = await api.put<{ education: Education }>('/education', {
        ...education,
        relevantCourseworks: courseworks
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setEducation(data.education);
      toast.success('Education saved.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the education data.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCert = async () => {
    if (!certDraft?.title) {
      toast.error('A title is required.');
      return;
    }
    try {
      const payload = { ...certDraft, image: certAttachment.url, mediaId: certAttachment.mediaId };
      if (certDraft.id) {
        await certifications.update(certDraft.id, payload);
        toast.success('Certification updated.');
      } else {
        await certifications.create(payload);
        toast.success('Certification added.');
      }
      setCertDraft(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the certification.'));
    }
  };

  const handleSaveAward = async () => {
    if (!awardDraft?.title) {
      toast.error('A title is required.');
      return;
    }
    try {
      const payload = { ...awardDraft, image: awardAttachment.url, mediaId: awardAttachment.mediaId };
      if (awardDraft.id) {
        await awards.update(awardDraft.id, payload);
        toast.success('Award updated.');
      } else {
        await awards.create(payload);
        toast.success('Award added.');
      }
      setAwardDraft(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the award.'));
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      if (pendingDelete.type === 'cert') {
        await certifications.remove(pendingDelete.id);
      } else {
        await awards.remove(pendingDelete.id);
      }
      toast.success('Item removed.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to remove the item.'));
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) return <Spinner label="Loading education…" />;

  return (
    <>
      <PageHeader
        title="Education"
        description="Formal education, certifications and awards."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSaveEducation} loading={saving}>
            Save education
          </Button>
        }
      />

      <Card>
        <CardHeader title="Formal education" description="Shown at the top of the education section." />
        {education ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Degree">
              <Input
                value={education.degree ?? ''}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
              />
            </Field>
            <Field label="Institution">
              <Input
                value={education.institution ?? ''}
                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
              />
            </Field>
            <Field label="Period">
              <Input
                value={education.period ?? ''}
                onChange={(e) => setEducation({ ...education, period: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GPA">
                <Input
                  value={education.gpa ?? ''}
                  onChange={(e) => setEducation({ ...education, gpa: e.target.value })}
                />
              </Field>
              <Field label="Credits">
                <Input
                  value={education.credits ?? ''}
                  onChange={(e) => setEducation({ ...education, credits: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Relevant coursework" hint="Comma separated." className="sm:col-span-2">
              <Textarea value={courseworks} onChange={(e) => setCourseworks(e.target.value)} />
            </Field>
          </div>
        ) : null}
      </Card>

      <Card>
        <CardHeader
          title="Certifications"
          description="Badges shown in the education section."
          actions={
              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => {
                  setCertDraft({ title: '', issuer: '', date: '', link: '' });
                  setCertAttachment({ url: null, mediaId: null, alt: null });
                }}
              >
              Add certification
            </Button>
          }
        />
        {certifications.loading ? (
          <Spinner label="Loading certifications…" />
        ) : (
          <SortableList
            items={certifications.items}
            onReorder={(ids) => void certifications.reorder(ids)}
            empty={<EmptyState title="No certifications yet" />}
            renderItem={(certification) => (
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                  {certification.image ? (
                    <img
                      src={certification.image}
                      alt={certification.title}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{certification.title}</p>
                  <p className="truncate text-xs text-muted">
                    {certification.issuer}
                    {certification.date ? ` · ${certification.date}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    label="Edit certification"
                    onClick={() => {
                      setCertDraft(certification);
                      setCertAttachment({
                        url: certification.image ?? null,
                        mediaId: certification.mediaId ?? null,
                        alt: certification.title,
                      });
                    }}
                  >
                    <Edit2 size={15} />
                  </IconButton>
                  <IconButton
                    label="Delete certification"
                    tone="danger"
                    onClick={() =>
                      setPendingDelete({ type: 'cert', id: certification.id, title: certification.title })
                    }
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            )}
          />
        )}
      </Card>

      <Card>
        <CardHeader
          title="Awards"
          description="Highlights of the education section."
          actions={
              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => {
                  setAwardDraft({ title: '', year: '', tag: '', description: '' });
                  setAwardAttachment({ url: null, mediaId: null, alt: null });
                }}
              >
              Add award
            </Button>
          }
        />
        {awards.loading ? (
          <Spinner label="Loading awards…" />
        ) : (
          <SortableList
            items={awards.items}
            onReorder={(ids) => void awards.reorder(ids)}
            empty={<EmptyState title="No awards yet" icon={<Award size={22} />} />}
            renderItem={(award) => (
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                  {award.image ? (
                    <img src={award.image} alt={award.title} className="h-full w-full object-contain" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{award.title}</p>
                  <p className="truncate text-xs text-muted">
                    {award.year}
                    {award.tag ? ` · ${award.tag}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    label="Edit award"
                    onClick={() => {
                      setAwardDraft(award);
                      setAwardAttachment({
                        url: award.image ?? null,
                        mediaId: award.mediaId ?? null,
                        alt: award.title,
                      });
                    }}
                  >
                    <Edit2 size={15} />
                  </IconButton>
                  <IconButton
                    label="Delete award"
                    tone="danger"
                    onClick={() => setPendingDelete({ type: 'award', id: award.id, title: award.title })}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            )}
          />
        )}
      </Card>

      <Modal
        open={certDraft !== null}
        title={certDraft?.id ? 'Edit certification' : 'New certification'}
        onClose={() => setCertDraft(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setCertDraft(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveCert}>
              Save
            </Button>
          </>
        }
      >
        {certDraft ? (
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={certDraft.title ?? ''}
                onChange={(e) => setCertDraft({ ...certDraft, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Issuer">
                <Input
                  value={certDraft.issuer ?? ''}
                  onChange={(e) => setCertDraft({ ...certDraft, issuer: e.target.value })}
                />
              </Field>
              <Field label="Date">
                <Input
                  value={certDraft.date ?? ''}
                  onChange={(e) => setCertDraft({ ...certDraft, date: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Link">
              <Input
                value={certDraft.link ?? ''}
                onChange={(e) => setCertDraft({ ...certDraft, link: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <AttachmentField
              label="Badge image"
              value={certAttachment}
              onChange={setCertAttachment}
              folder="portfolio/certifications"
              hint="Square badge, e.g. 256×256."
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        open={awardDraft !== null}
        title={awardDraft?.id ? 'Edit award' : 'New award'}
        onClose={() => setAwardDraft(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setAwardDraft(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveAward}>
              Save
            </Button>
          </>
        }
      >
        {awardDraft ? (
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={awardDraft.title ?? ''}
                onChange={(e) => setAwardDraft({ ...awardDraft, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Year">
                <Input
                  value={awardDraft.year ?? ''}
                  onChange={(e) => setAwardDraft({ ...awardDraft, year: e.target.value })}
                />
              </Field>
              <Field label="Tag" hint="e.g. National Scholarship.">
                <Input
                  value={awardDraft.tag ?? ''}
                  onChange={(e) => setAwardDraft({ ...awardDraft, tag: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={awardDraft.description ?? ''}
                onChange={(e) => setAwardDraft({ ...awardDraft, description: e.target.value })}
              />
            </Field>
            <AttachmentField
              label="Badge image"
              value={awardAttachment}
              onChange={setAwardAttachment}
              folder="portfolio/awards"
              hint="Square badge, e.g. 256×256."
            />
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete item"
        message={`"${pendingDelete?.title ?? ''}" will be removed from the site.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
