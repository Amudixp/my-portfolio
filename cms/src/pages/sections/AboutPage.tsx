import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useToast } from '../../context/ToastContext';
import { apiErrorMessage } from '../../lib/api';
import { Card, CardHeader, PageHeader } from '../../components/ui/Card';
import { Button, IconButton } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Form';
import { Spinner } from '../../components/ui/Feedback';
import { ActivitiesManager } from '../ActivitiesManager';
import type { AboutSettings, AboutStat } from '../../lib/types';

export function AboutPage() {
  const { settings, loading, error, saveSection } = useSiteSettings();
  const toast = useToast();
  const [form, setForm] = useState<AboutSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings.about);
  }, [settings]);

  if (loading || !form) return <Spinner label="Loading about…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const update = <K extends keyof AboutSettings>(key: K, value: AboutSettings[K]) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));

  const updateStat = (index: number, patch: Partial<AboutStat>) =>
    setForm((current) =>
      current
        ? { ...current, stats: current.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)) }
        : current,
    );

  const addStat = () =>
    update('stats', [...form.stats, { label: 'LABEL', value: 'Value', subtext: '' }]);

  const removeStat = (index: number) =>
    update(
      'stats',
      form.stats.filter((_, i) => i !== index),
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection('about', form);
      toast.success('About section saved.');
    } catch (caught) {
      toast.error(apiErrorMessage(caught, 'Failed to save the about section.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="About section"
        description="Intro copy, the four stat cards and the campus life gallery."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-5">
        <Card>
          <CardHeader title="Copy" description="Headline, tagline and gallery labels." />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Heading">
                <Input value={form.heading} onChange={(e) => update('heading', e.target.value)} />
              </Field>
              <Field label="Subheading">
                <Input
                  value={form.subheading}
                  onChange={(e) => update('subheading', e.target.value)}
                />
              </Field>
              <Field label="Feed label">
                <Input value={form.feedLabel} onChange={(e) => update('feedLabel', e.target.value)} />
              </Field>
              <Field label="Gallery title">
                <Input
                  value={form.galleryTitle}
                  onChange={(e) => update('galleryTitle', e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Stat cards"
            description="Four cards rendered next to the profile picture."
            actions={
              <Button type="button" size="sm"             variant="primary" icon={<Plus size={14} />} onClick={addStat}>
                Add stat
              </Button>
            }
          />
          <div className="space-y-3">
            {form.stats.map((stat, index) => (
              <div key={index} className="flex items-start gap-2 rounded-xl border border-line bg-surface/60 p-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <Field label="Label">
                    <Input value={stat.label} onChange={(e) => updateStat(index, { label: e.target.value })} />
                  </Field>
                  <Field label="Value">
                    <Input value={stat.value} onChange={(e) => updateStat(index, { value: e.target.value })} />
                  </Field>
                  <Field label="Subtext">
                    <Input
                      value={stat.subtext}
                      onChange={(e) => updateStat(index, { subtext: e.target.value })}
                    />
                  </Field>
                </div>
                <IconButton label="Remove stat" tone="danger" onClick={() => removeStat(index)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            ))}
          </div>
        </Card>

        <ActivitiesManager />
      </div>
    </>
  );
}
