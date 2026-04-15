import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const runtime = 'edge'; // Use edge runtime for faster cold starts and no 10s timeout

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
    const targetUrl = `${API_URL}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      headers: { 'ngrok-skip-browser-warning': '1' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return new NextResponse('Not found', { status: res.status });

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=600, s-maxage=600',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 502 });
  }
}
