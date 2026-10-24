import { useCallback, useEffect, useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';

interface ResourceState<T> {
  items: T[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

/**
 * Generic list endpoint helper: loads a collection and exposes the mutations
 * the CMS pages need. Every page shares the same loading, error and refresh
 * behaviour instead of repeating it.
 */
export function useResource<T extends { id: number | string }>(path: string) {
  const [state, setState] = useState<ResourceState<T>>({
    items: [],
    loading: true,
    saving: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const { data } = await api.get<T[]>(path);
      setState({ items: data ?? [], loading: false, saving: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: apiErrorMessage(error, `Failed to load ${path}.`),
      }));
    }
  }, [path]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (payload: Partial<T>) => {
      setState((current) => ({ ...current, saving: true }));
      try {
        const { data } = await api.post<T>(path, payload);
        setState((current) => ({
          ...current,
          items: [...current.items, data],
          saving: false,
        }));
        return data;
      } catch (error) {
        setState((current) => ({ ...current, saving: false }));
        throw error;
      }
    },
    [path],
  );

  const update = useCallback(
    async (id: number | string, payload: Partial<T>) => {
      setState((current) => ({ ...current, saving: true }));
      try {
        const { data } = await api.put<T>(`${path}/${id}`, payload);
        setState((current) => ({
          ...current,
          items: current.items.map((item) => (item.id === id ? data : item)),
          saving: false,
        }));
        return data;
      } catch (error) {
        setState((current) => ({ ...current, saving: false }));
        throw error;
      }
    },
    [path],
  );

  const remove = useCallback(
    async (id: number | string) => {
      try {
        await api.delete(`${path}/${id}`);
        setState((current) => ({
          ...current,
          items: current.items.filter((item) => item.id !== id),
        }));
      } catch (error) {
        throw error;
      }
    },
    [path],
  );

  /** Persists a new display order. The backend rewrites every row in one go. */
  const reorder = useCallback(
    async (ids: (number | string)[]) => {
      const previous = state.items;
      setState((current) => ({
        ...current,
        items: current.items
          .slice()
          .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
          .map((item, index) => ({ ...item, displayOrder: index })),
      }));
      try {
        await api.put(`${path}/reorder`, { ids });
      } catch (error) {
        setState((current) => ({ ...current, items: previous }));
        throw error;
      }
    },
    [path, state.items],
  );

  return { ...state, refresh, create, update, remove, reorder };
}
