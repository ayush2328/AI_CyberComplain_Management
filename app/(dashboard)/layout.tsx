'use client';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const navItems = [
  { href: '/dashboard',          label: 'Dashboard',      section: 'Overview',    icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { href: '/complaints/new',     label: 'File Complaint', section: 'Complaints',  icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z', badge: '+' },
  { href: '/complaints',         label: 'All Complaints', section: null,          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' },
  { href: '/cases',              label: 'Cases',          section: 'Intelligence',icon: 'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.51 16.48 1 14.63 1c-1.22 0-2.1.71-2.77 1.75L12 3.5l-.86-1.74C10.48 1.71 9.6 1 8.38 1 6.52 1 5 2.51 5 4.64c0 .48.11.92.18 1.36H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z' },
  { href: '/ai',                 label: 'AI Prediction',  section: null,          icon: 'M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z' },
  { href: '/officers',           label: 'Officers',       section: 'Admin',       icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z' },
  { href: '/reports',            label: 'Reports',        section: null,          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--accent)', fontSize: '14px' }}>Loading...</div>
    </div>
  );

  const user = session?.user as any;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  let lastSection = '';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#050A14"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>ACMS</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cyber Crime Portal</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <div key={item.href}>
                {showSection && <div style={{ padding: '8px 16px 4px', fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{item.section}</div>}
                <div onClick={() => router.push(item.href)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: active ? 'var(--accent)' : 'var(--muted)', borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`, background: active ? 'rgba(0,229,255,0.05)' : 'transparent', transition: 'all 0.15s', margin: '1px 0' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={item.icon}/></svg>
                  {item.label}
                  {item.badge && <span style={{ marginLeft: 'auto', background: 'var(--accent2)', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px' }}>{item.badge}</span>}
                </div>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{initials}</div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'capitalize' }}>{user?.role?.toLowerCase() || 'citizen'}</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px', borderRadius: '6px', fontSize: '11px', fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: '52px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', flexShrink: 0 }}>
          <div style={{ flex: 1, fontSize: '15px', fontWeight: 700 }}>
            {navItems.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
          </div>
          <div style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--accent)', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontFamily: 'DM Mono, monospace' }}>● LIVE</div>
          <button onClick={() => router.push('/complaints/new')} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
            + File Complaint
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
