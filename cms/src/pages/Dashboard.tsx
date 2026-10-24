import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Briefcase, Code2, FolderOpen, Image as ImageIcon, Sparkles, Users } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/Card';
import { Spinner } from '../components/ui/Feedback';

interface Counts {
  projects: number;
  experiences: number;
  organizations: number;
  activities: number;
  skills: number;
  awards: number;
  certifications: number;
  media: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, experiences, organizations, activities, skills, awards, certifications, media] =
          await Promise.all([
            api.get<unknown[]>('/projects'),
            api.get<unknown[]>('/experiences'),
            api.get<unknown[]>('/organizations'),
            api.get<unknown[]>('/activities'),
            api.get<unknown[]>('/skills'),
            api.get<unknown[]>('/awards'),
            api.get<unknown[]>('/certifications'),
            api.get<unknown[]>('/media'),
          ]);
        setCounts({
          projects: projects.data.length,
          experiences: experiences.data.length,
          organizations: organizations.data.length,
          activities: activities.data.length,
          skills: skills.data.length,
          awards: awards.data.length,
          certifications: certifications.data.length,
          media: media.data.length,
        });
      } catch {
        setCounts(null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const cards = counts
    ? [
        { label: 'Projects', value: counts.projects, icon: Code2, to: '/projects' },
        { label: 'Experiences', value: counts.experiences, icon: Briefcase, to: '/experiences' },
        { label: 'Organizations', value: counts.organizations, icon: Users, to: '/organizations' },
        { label: 'Gallery tiles', value: counts.activities, icon: ImageIcon, to: '/sections/about' },
        { label: 'Skill categories', value: counts.skills, icon: Sparkles, to: '/skills' },
        { label: 'Certifications', value: counts.certifications, icon: Award, to: '/education' },
        { label: 'Awards', value: counts.awards, icon: Award, to: '/education' },
        { label: 'Media assets', value: counts.media, icon: FolderOpen, to: '/media' },
      ]
    : [];

  if (loading) return <Spinner label="Loading dashboard…" />;

  return (
    <>
      <PageHeader
        title={`Welcome${user?.githubLogin ? `, ${user.githubLogin}` : ''}`}
        description="Everything on the public site is edited from here. Changes are live as soon as they are saved."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-2xl border border-line bg-page-light p-4 shadow-card transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{card.label}</span>
                <Icon size={16} className="text-accent" />
              </div>
              <p className="mt-2 text-3xl font-medium text-ink">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-page-light p-5 shadow-card">
          <h2 className="text-lg font-medium text-ink">Sections</h2>
          <p className="mt-1 text-sm text-muted">
            Copy and the attachment slots of every section of the landing page.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {[
              { label: 'Hero', to: '/sections/hero' },
              { label: 'About', to: '/sections/about' },
              { label: 'Contact', to: '/sections/contact' },
              { label: 'Navigation & footer', to: '/sections/navigation' },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-accent underline-offset-2 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-page-light p-5 shadow-card">
          <h2 className="text-lg font-medium text-ink">Tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Every image of the site is attached through the attachment widget, so it can be swapped in seconds.</li>
            <li>Assets that are still referenced cannot be deleted from the media library.</li>
            <li>Dragging a row reorders the list and saves the new order immediately.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
