import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { api, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import type { Profile } from '../lib/types';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';
import { Spinner } from '../components/ui/Feedback';
import { AttachmentField } from '../components/attachments/AttachmentField';
import type { AttachmentValue } from '../components/attachments/AttachmentField';

export function ProfileManager() {
  const toast = useToast();
  const media = useMediaLibrary();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });
  const [resume, setResume] = useState<AttachmentValue>({ url: null, mediaId: null, alt: null });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Profile>('/profile');
        setProfile(data);
        setAvatar({ url: null, mediaId: data.mediaId ?? null, alt: null });
        setResume({
          url: data.resume ?? null,
          mediaId: data.resumeMediaId ?? null,
          alt: null,
        });
      } catch (error) {
        toast.error(apiErrorMessage(error, 'Failed to load the profile.'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [toast]);

  // The profile picture is stored as a media id, so the preview resolves the
  // url from the media library.
  const avatarUrl = avatar.url ?? media.findById(avatar.mediaId)?.url ?? null;

  if (loading || !profile) return <Spinner label="Loading profile…" />;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put<Profile>('/profile', {
        ...profile,
        mediaId: avatar.mediaId,
        resumeMediaId: resume.mediaId,
        resume: resume.url,
      });
      setProfile(data);
      toast.success('Profile saved.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to save the profile.'));
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((current: Profile | null) => (current ? { ...current, [key]: value } : current));

  return (
    <>
      <PageHeader
        title="Profile"
        description="Identity, contact details and the attachments of the about block."
        actions={
          <Button type="button" icon={<Save size={15} />} onClick={handleSave} loading={saving}>
            Save profile
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Details" description="Shown in the about block and the footer." />
          <div className="space-y-4">
            <Field label="Name">
              <Input value={profile.name} onChange={(e) => update('name', e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Major">
                <Input value={profile.major} onChange={(e) => update('major', e.target.value)} />
              </Field>
              <Field label="University">
                <Input value={profile.university} onChange={(e) => update('university', e.target.value)} />
              </Field>
              <Field label="Location">
                <Input value={profile.location} onChange={(e) => update('location', e.target.value)} />
              </Field>
              <Field label="GPA">
                <Input value={profile.gpa} onChange={(e) => update('gpa', e.target.value)} />
              </Field>
            </div>
            <Field label="Status">
              <Input value={profile.status} onChange={(e) => update('status', e.target.value)} />
            </Field>
            <Field label="Short bio" hint="A few sentences about you.">
              <Textarea
                value={profile.shortBio}
                onChange={(e) => update('shortBio', e.target.value)}
                className="min-h-32"
              />
            </Field>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact" description="Used by the contact section." />
            <div className="space-y-4">
              <Field label="Email">
                <Input value={profile.email} onChange={(e) => update('email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <Input value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
              </Field>
              <Field label="GitHub">
                <Input value={profile.github} onChange={(e) => update('github', e.target.value)} />
              </Field>
              <Field label="LinkedIn">
                <Input value={profile.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Attachments" description="Profile picture and curriculum vitae." />
            <div className="space-y-5">
              <AttachmentField
                label="Profile picture"
                value={{ ...avatar, url: avatarUrl }}
                onChange={setAvatar}
                folder="portfolio/profile"
                hint="Portrait orientation, e.g. 3:4."
              />
              <AttachmentField
                label="Curriculum vitae"
                value={resume}
                onChange={setResume}
                folder="portfolio/profile"
                accept="application/pdf,.pdf"
                resourceType="raw"
                hint="PDF file linked from the download CV button."
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
