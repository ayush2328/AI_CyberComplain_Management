'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'admin'|'officer'|'citizen'>('citizen');

  const demoCredentials = {
    admin:   { email: 'admin@acms.gov.in',  password: 'admin123' },
    officer: { email: 'mehta@acms.gov.in',  password: 'officer123' },
    citizen: { email: 'rahul@example.com',  password: 'citizen123' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError('Invalid email or password');
    else router.push('/dashboard');
  };

  const fillDemo = () => setForm(demoCredentials[tab]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--accent)', borderRadius: '12px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#050A14">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>ACMS Portal</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>AI Cyber Crime Management System</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
          {/* Role Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: '8px', padding: '3px', marginBottom: '24px', gap: '2px' }}>
            {(['citizen','officer','admin'] as const).map(r => (
              <button key={r} onClick={() => setTab(r)} style={{ flex: 1, padding: '7px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: tab === r ? 700 : 400, background: tab === r ? 'var(--surface)' : 'transparent', color: tab === r ? 'var(--text)' : 'var(--muted)', textTransform: 'capitalize' }}>
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                placeholder="your@email.com"
                style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}
                placeholder="••••••••"
                style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' }}
              />
            </div>

            {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--danger)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '11px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button onClick={fillDemo} style={{ width: '100%', marginTop: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '9px', borderRadius: '6px', fontSize: '12px', fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
            Fill Demo Credentials ({tab})
          </button>

          <div style={{ marginTop: '20px', padding: '12px', background: 'var(--surface2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Demo Accounts</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.8, fontFamily: 'DM Mono, monospace' }}>
              admin@acms.gov.in / admin123<br/>
              mehta@acms.gov.in / officer123<br/>
              rahul@example.com / citizen123
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/complaints/new" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
            File a complaint without login →
          </a>
        </div>
      </div>
    </div>
  );
}
