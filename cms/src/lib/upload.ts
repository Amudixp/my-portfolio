import { api } from './api';
import type { Media } from './types';

export type UploadResourceType = 'image' | 'raw';

interface SignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  resourceType: UploadResourceType;
}

/**
 * Uploads a file straight to Cloudinary and registers it in the media library.
 * The backend only signs the upload, the bytes never touch the API server.
 */
export async function uploadAsset(
  file: File,
  folder: string,
  resourceType: UploadResourceType = 'image',
): Promise<Media> {
  const { data: signature } = await api.post<SignatureResponse>('/upload/signature', {
    folder,
    resourceType,
  });

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signature.apiKey);
  form.append('timestamp', signature.timestamp.toString());
  form.append('signature', signature.signature);
  form.append('folder', signature.folder);

  const endpoint =
    resourceType === 'image'
      ? `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`
      : `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`;

  const cloudinaryResponse = await fetch(endpoint, { method: 'POST', body: form });
  const uploaded = (await cloudinaryResponse.json()) as {
    secure_url?: string;
    public_id?: string;
    bytes?: number;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
    error?: { message?: string };
  };

  if (!cloudinaryResponse.ok || !uploaded.secure_url || !uploaded.public_id) {
    throw new Error(uploaded.error?.message || 'Cloudinary upload failed.');
  }

  const { data: media } = await api.post<Media>('/media', {
    publicId: uploaded.public_id,
    url: uploaded.secure_url,
    filename: file.name,
    mimeType: file.type,
    bytes: uploaded.bytes ?? null,
    width: uploaded.width ?? null,
    height: uploaded.height ?? null,
    alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
    folder: signature.folder,
  });

  return media;
}
