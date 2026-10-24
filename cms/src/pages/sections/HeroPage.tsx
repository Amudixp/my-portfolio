import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useToast } from '../../context/ToastContext';
import { apiErrorMessage } from '../../lib/api';
import { Card, CardHeader, PageHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Field, Input, Textarea } from '../../components/ui/Form';
import { Spinner } from '../../components/ui/Feedback';
import { SectionAssetField } from '../../components/attachments/SectionAssetField';
import type { HeroSettings } from '../../lib/types';

export function HeroPage() {
  const { settings, loading, error, saveSection, saveAsset, asset } = useSiteSettings();
  const toast = useToast();
  const [form, setForm] = useState<HeroSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings.hero);
  }, [settings]);

  if (loading || !form) return <Spinner label="Loading hero…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const update = <K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection('hero', form);
      toast.success('Hero section saved.');
    } catch (caught) {
      toast.error(apiErrorMessage(caught, 'Failed to save the hero section.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Hero section"
        description="The first thing a visitor reads on the landing page."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Copy" description="Headline, subtitle and the call to action." />
          <div className="space-y-4">
            <Field label="Headline">
              <Input value={form.title} onChange={(e) => update('title', e.target.value)} />
            </Field>
            <Field label="Subtitle" hint="Short pitch shown under the headline.">
              <Textarea
                value={form.subtitle}
                onChange={(e) => update('subtitle', e.target.value)}
                className="min-h-20"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button label">
                <Input value={form.ctaLabel} onChange={(e) => update('ctaLabel', e.target.value)} />
              </Field>
              <Field label="Button link">
                <Input value={form.ctaHref} onChange={(e) => update('ctaHref', e.target.value)} />
              </Field>
            </div>
            <Field label="Scroll hint" hint="Small helper text at the bottom of the hero.">
              <Input value={form.scrollHint} onChange={(e) => update('scrollHint', e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Background"
            description="Full bleed image behind the hero. Keep it dark and low contrast."
          />
          <SectionAssetField
            label="Hero background"
            section="hero"
            slot="background"
            asset={asset('hero', 'background')}
            folder="portfolio/hero"
            hint="Recommended: 16:9 landscape, dark enough for white text."
            onSave={(payload) => saveAsset('hero', 'background', payload)}
          />
        </Card>
      </div>
    </>
  );
}
