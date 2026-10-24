import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';
import type { SectionAsset, SiteSettings } from '../lib/types';

type SettingsSection = 'hero' | 'about' | 'contact' | 'navbar' | 'footer';

interface AssetPayload {
  mediaId?: number | null;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  meta?: Record<string, unknown>;
}

/**
 * Shared state for the section pages: the copy of every section plus the
 * attachment slots that belong to them.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [assets, setAssets] = useState<Record<string, SectionAsset>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsResponse, assetsResponse] = await Promise.all([
        api.get<SiteSettings>('/settings'),
        api.get<SectionAsset[]>('/section-assets'),
      ]);
      setSettings(settingsResponse.data);
      const map: Record<string, SectionAsset> = {};
      for (const asset of assetsResponse.data ?? []) {
        map[`${asset.section}.${asset.slot}`] = asset;
      }
      setAssets(map);
    } catch (caught) {
      setError(apiErrorMessage(caught, 'Failed to load the section settings.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveSection = useCallback(
    async (section: SettingsSection, value: SiteSettings[SettingsSection]) => {
      const { data } = await api.put<SiteSettings>('/settings', { [section]: value });
      setSettings(data);
      return data;
    },
    [],
  );

  const saveAsset = useCallback(
    async (section: string, slot: string, payload: AssetPayload) => {
      const { data } = await api.put<SectionAsset>(`/section-assets/${section}/${slot}`, payload);
      setAssets((current) => ({ ...current, [`${section}.${slot}`]: data }));
      return data;
    },
    [],
  );

  const removeAsset = useCallback(async (section: string, slot: string) => {
    await api.delete(`/section-assets/${section}/${slot}`);
    setAssets((current) => {
      const next = { ...current };
      delete next[`${section}.${slot}`];
      return next;
    });
  }, []);

  const asset = useCallback(
    (section: string, slot: string) => assets[`${section}.${slot}`] ?? null,
    [assets],
  );

  return useMemo(
    () => ({ settings, assets, loading, error, load, saveSection, saveAsset, removeAsset, asset }),
    [settings, assets, loading, error, load, saveSection, saveAsset, removeAsset, asset],
  );
}
