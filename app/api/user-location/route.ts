import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const location = body?.location;
    const refId = body?.refId as string | undefined;
    const ts = body?.timestamp as number | undefined;
    const name = (body?.name || `User-${Math.random().toString(36).slice(2, 8)}`) as string;

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json({ error: 'Location required' }, { status: 400 });
    }
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Server misconfiguration: MONGODB_URI is not set' }, { status: 500 });
    }

    const db = await getDb();
    const collection = db.collection('locations');
    const now = new Date();
    const ua = request.headers.get('user-agent') ?? null;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || (request as any).ip
      || request.headers.get('x-real-ip')
      || null;

    const doc = {
      refId: refId ?? null,
      location,
      createdAt: now,
      timestamp: typeof ts === 'number' ? new Date(ts) : now,
      userAgent: ua,
      ip,
      name,
    };

    const result = await collection.insertOne(doc);
    return NextResponse.json({ ok: true, id: result.insertedId.toString(), createdAt: now.toISOString(), name });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save location';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Server misconfiguration: MONGODB_URI is not set' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const refId = searchParams.get('refId');
    const limitParam = searchParams.get('limit');
    const limit = Math.max(1, Math.min(200, Number(limitParam || 50)));
    const db = await getDb();
    const collection = db.collection('locations');

    const query: any = {};
    if (refId) {
      query.refId = refId;
    } else {
      const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || (request as any).ip
        || request.headers.get('x-real-ip')
        || null);
      if (ip) query.ip = ip;
    }

    const docs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    const items = docs.map(d => {
      const t = d.timestamp || d.createdAt || new Date();
      const date = typeof t === 'string' ? new Date(t) : t;
      return {
        latitude: Number(d.location?.latitude),
        longitude: Number(d.location?.longitude),
        accuracy: typeof d.location?.accuracy === 'number' ? Number(d.location.accuracy) : null,
        time: new Date(date).toISOString(),
        name: d.name ?? null,
        id: d._id?.toString?.() || null,
      };
    });
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch locations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


