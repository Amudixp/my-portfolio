import type { ApiSiteContent } from '../types/api';

/**
 * Base URL of the Go API. In production this points at
 * `https://api.amudipurba.com/api`; locally it falls back to the dev server.
 */
const isProd = import.meta.env.PROD;
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (isProd ? 'https://api.amudipurba.com/api' : 'http://localhost:8080/api');

const REQUEST_TIMEOUT_MS = 8000;

/**
 * Fetches the whole site content in a single request.
 * Resolves to `null` when the API is unreachable so the caller can fall back
 * to the bundled static content instead of rendering an empty page.
 */
export async function fetchSiteContent(): Promise<ApiSiteContent | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/site`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiSiteContent;
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

/**
 * Normalises an asset path coming from the API.
 * Absolute URLs (Cloudinary) are kept as-is, relative paths are anchored to
 * the site root so they resolve against the frontend's public folder.
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:|\/)/i.test(trimmed)) return trimmed;
  return `/${trimmed}`;
}
