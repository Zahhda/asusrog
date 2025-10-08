'use client';
import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      setStatus('sending');
      setError('');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Unknown error');
    }
  }

  return (
    <>
      <Nav />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <h1 style={{ marginTop: 0 }}>Contact</h1>
        <p className="muted">Have a question about ASUS gaming laptops? Send us a message.</p>
        <form onSubmit={onSubmit}>
          <input name="name" placeholder="Your name" required />
          <input type="email" name="email" placeholder="you@example.com" required />
          <textarea name="message" placeholder="Message" rows={5} required />
          <button disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && <div style={{ color: '#22c55e' }}>Thanks! We’ll get back to you.</div>}
          {status === 'error' && <div style={{ color: '#ef4444' }}>{error}</div>}
        </form>
      </div>
      <Footer />
    </>
  );
}


