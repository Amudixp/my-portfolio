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
import type { ContactSettings } from '../../lib/types';

export function ContactPage() {
  const { settings, loading, error, saveSection, saveAsset, asset } = useSiteSettings();
  const toast = useToast();
  const [form, setForm] = useState<ContactSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings.contact);
  }, [settings]);

  if (loading || !form) return <Spinner label="Loading contact…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const update = <K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection('contact', form);
      toast.success('Contact section saved.');
    } catch (caught) {
      toast.error(apiErrorMessage(caught, 'Failed to save the contact section.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contact section"
        description="Copy, the profile card, the photo and the QR code."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Copy" description="Headline, statement and the download button." />
          <div className="space-y-4">
            <Field label="Heading">
              <Input value={form.heading} onChange={(e) => update('heading', e.target.value)} />
            </Field>
            <Field label="Big statement" hint="Each line becomes a separate line on the site.">
              <Textarea
                value={form.bigText}
                onChange={(e) => update('bigText', e.target.value)}
                className="min-h-24"
              />
            </Field>
            <Field label="Paragraph">
              <Textarea
                value={form.paragraph}
                onChange={(e) => update('paragraph', e.target.value)}
                className="min-h-24"
              />
            </Field>
            <Field label="Button label" hint="Label of the download CV button.">
              <Input value={form.ctaLabel} onChange={(e) => update('ctaLabel', e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Card caption">
                <Input value={form.cardCaption} onChange={(e) => update('cardCaption', e.target.value)} />
              </Field>
              <Field label="Card subtitle">
                <Input
                  value={form.cardSubtitle}
                  onChange={(e) => update('cardSubtitle', e.target.value)}
                />
              </Field>
            </div>
            <Field label="Flip hint" hint="Small caption under the photo card.">
              <Input value={form.flipHint} onChange={(e) => update('flipHint', e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="QR label">
                <Input value={form.qrLabel} onChange={(e) => update('qrLabel', e.target.value)} />
              </Field>
              <Field label="QR subtitle">
                <Input value={form.qrSubtitle} onChange={(e) => update('qrSubtitle', e.target.value)} />
              </Field>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Photo card" description="The photo shown on the contact card." />
            <SectionAssetField
              label="Contact photo"
              section="contact"
              slot="photo"
              asset={asset('contact', 'photo')}
              folder="portfolio/contact"
              hint="Portrait orientation works best, e.g. 3:4."
              onSave={(payload) => saveAsset('contact', 'photo', payload)}
            />
          </Card>

          <Card>
            <CardHeader title="QR code" description="Scannable code placed next to the photo." />
            <SectionAssetField
              label="LinkedIn QR"
              section="contact"
              slot="qr"
              asset={asset('contact', 'qr')}
              folder="portfolio/contact"
              hint="Square image, at least 512×512."
              onSave={(payload) => saveAsset('contact', 'qr', payload)}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
