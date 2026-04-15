const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'gheplq_secret_2026';

/** Decrypt AES-256-CBC encrypted API response */
async function decryptPayload(payload: { iv: string; data: string }): Promise<unknown> {
  // Derive key from API_TOKEN using SHA-256 (matches BE crypto.createHash('sha256').update(API_TOKEN).digest())
  const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(API_TOKEN));
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']);

  const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
  const encData = Uint8Array.from(atob(payload.data), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encData);
  const text = new TextDecoder().decode(decrypted);
  return JSON.parse(text);
}

/** Parse API response — auto-decrypt if encrypted */
async function parseResponse(res: Response): Promise<{ ok: boolean; data: unknown }> {
  const json = await res.json();
  if (json.encrypted && json.payload) {
    const data = await decryptPayload(json.payload);
    return { ok: res.ok, data };
  }
  return { ok: res.ok, data: json };
}

/** Common headers for all requests (includes ngrok bypass) */
const commonHeaders: Record<string, string> = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'ngrok-skip-browser-warning': '1',
};

/** Authenticated GET request */
export async function apiGet(path: string): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: commonHeaders,
  });
  return parseResponse(res);
}

/** Authenticated POST request */
export async function apiPost(path: string, body: unknown): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...commonHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse(res);
}

/** Plain POST (for non-encrypted endpoints like generate) */
export async function apiPostPlain(path: string, body: unknown): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...commonHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

export { API_URL, API_TOKEN };
