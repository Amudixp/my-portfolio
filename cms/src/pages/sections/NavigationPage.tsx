import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useToast } from '../../context/ToastContext';
import { apiErrorMessage } from '../../lib/api';
import { Card, CardHeader, PageHeader } from '../../components/ui/Card';
import { Button, IconButton } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Form';
import { Spinner } from '../../components/ui/Feedback';
import { SectionAssetField } from '../../components/attachments/SectionAssetField';
import type { NavLink } from '../../lib/types';

export function NavigationPage() {
  const { settings, loading, error, saveSection, saveAsset, asset } = useSiteSettings();
  const toast = useToast();
  const [links, setLinks] = useState<NavLink[]>([]);
  const [footerText, setFooterText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLinks(settings.navbar.links ?? []);
      setFooterText(settings.footer.text);
    }
  }, [settings]);

  if (loading) return <Spinner label="Loading navigation…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const updateLink = (index: number, patch: Partial<NavLink>) =>
    setLinks((current) => current.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection('navbar', { links });
      await saveSection('footer', { text: footerText });
      toast.success('Navigation saved.');
    } catch (caught) {
      toast.error(apiErrorMessage(caught, 'Failed to save the navigation.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Navigation & footer"
        description="Side navigation links, the navbar avatar and the footer credit."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Navigation links"
            description="Links of the side navigation, in the order they are shown."
            actions={
              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => setLinks((current) => [...current, { name: 'New link', href: '#' }])}
              >
                Add link
              </Button>
            }
          />
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex items-start gap-2 rounded-xl border border-line bg-surface/60 p-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field label="Label">
                    <Input value={link.name} onChange={(e) => updateLink(index, { name: e.target.value })} />
                  </Field>
                  <Field label="Target" hint="Anchor such as #about or a full URL.">
                    <Input value={link.href} onChange={(e) => updateLink(index, { href: e.target.value })} />
                  </Field>
                </div>
                <IconButton
                  label="Remove link"
                  tone="danger"
                  onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Navbar avatar" description="Small round picture in the navigation." />
            <SectionAssetField
              label="Navigation avatar"
              section="navbar"
              slot="avatar"
              asset={asset('navbar', 'avatar')}
              folder="portfolio/navbar"
              hint="Square image, e.g. 256×256."
              onSave={(payload) => saveAsset('navbar', 'avatar', payload)}
            />
          </Card>

          <Card>
            <CardHeader title="Footer" description="Credit line rendered in the footer." />
            <Field label="Footer text">
              <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} />
            </Field>
          </Card>
        </div>
      </div>
    </>
  );
}
