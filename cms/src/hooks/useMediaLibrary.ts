import { useCallback, useEffect, useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';
import type { Media } from '../lib/types';

export function useMediaLibrary() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Media[]>('/media');
      setItems(data ?? []);
    } catch (caught) {
      setError(apiErrorMessage(caught, 'Failed to load the media library.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update = useCallback(async (id: number, payload: { alt?: string | null; filename?: string | null }) => {
    const { data } = await api.put<Media>(`/media/${id}`, payload);
    setItems((current) => current.map((item) => (item.id === id ? data : item)));
    return data;
  }, []);

  /** Removes an asset. The backend rejects assets that are still in use. */
  const remove = useCallback(async (id: number) => {
    await api.delete(`/media/${id}`);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const findById = useCallback(
    (id: number | null | undefined) => (id ? (items.find((item) => item.id === id) ?? null) : null),
    [items],
  );

  return { items, loading, error, refresh, update, remove, findById };
}
