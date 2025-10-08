import { NextResponse } from 'next/server';

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const message = (body.message || '').toString().trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // In a real app, forward to email/provider. Here we just log.
  console.log('[contact]', { name, email, message });
  return NextResponse.json({ ok: true });
}


