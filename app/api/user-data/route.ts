import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const location = body?.location;
    const name = (body?.name || `User-${Math.random().toString(36).slice(2, 8)}`) as string;
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json({ error: 'Location required' }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Server misconfiguration: MONGODB_URI is not set' }, { status: 500 });
    }

    const db = await getDb();
    const collection = db.collection('users');
    const now = new Date();
    const ua = request.headers.get('user-agent') ?? null;
    // Best-effort IP extraction (may be masked by proxies)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || (request as any).ip
      || request.headers.get('x-real-ip')
      || null;
    const doc = {
      location,
      createdAt: now,
      userAgent: ua,
      ip,
      name,
    };
    const result = await collection.insertOne(doc);

    return NextResponse.json({ ok: true, id: result.insertedId.toString(), createdAt: now.toISOString(), userAgent: ua, ip, name });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save user data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


