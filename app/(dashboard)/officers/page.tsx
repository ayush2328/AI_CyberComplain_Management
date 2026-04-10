import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function OfficersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (user?.role === 'CITIZEN') redirect('/dashboard');

  const officers = await prisma.user.findMany({
    where: { role: 'OFFICER' },
    include: { _count: { select: { assignedCases: { where: { status: { not: 'CLOSED' } } } } } },
    orderBy: { name: 'asc' },
  });

  const unassignedCases = await prisma.case.findMany({
    where: { officerId: null, status: { not: 'CLOSED' } },
    include: { complaint: { select: { firNumber: true, crimeType: true, priority: true } } },
    take: 10,
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
      <div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Officer Roster</div>
          {officers.map((o: any) => {
            const load = o._count.assignedCases;
            const overloaded = load > 12;
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '8px', background: 'var(--surface2)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: overloaded ? 'var(--danger)' : 'var(--accent3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {o.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{o.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{o.city} • {o.badgeNumber || 'No badge'}</div>
                  <div style={{ marginTop: '6px', height: '4px', background: 'var(--surface)', borderRadius: '2px', width: '120px' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (load / 15) * 100)}%`, background: overloaded ? 'var(--danger)' : 'var(--success)', borderRadius: '2px' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'DM Mono, monospace', color: overloaded ? 'var(--danger)' : 'var(--accent)' }}>{load}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{overloaded ? '⚠ overloaded' : 'active cases'}</div>
                </div>
              </div>
            );
          })}
          {officers.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '30px 0', fontSize: '13px' }}>No officers found. Run <code style={{ color: 'var(--accent)' }}>npm run db:seed</code> to add demo data.</div>}
        </div>
      </div>

      <div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Unassigned Cases</div>
          {unassignedCases.length === 0 ? (
            <div style={{ color: 'var(--success)', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>✓ All cases are assigned</div>
          ) : unassignedCases.map((c: any) => (
            <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{c.complaint.firNumber}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{c.complaint.crimeType.replace(/_/g, ' ')}</div>
                </div>
                <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', background: c.complaint.priority === 'CRITICAL' ? 'rgba(255,77,109,0.15)' : 'rgba(255,184,0,0.15)', color: c.complaint.priority === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)', border: `1px solid ${c.complaint.priority === 'CRITICAL' ? 'rgba(255,77,109,0.3)' : 'rgba(255,184,0,0.3)'}` }}>{c.complaint.priority}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.3)', borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--accent3),var(--accent))' }} />
          <div style={{ fontSize: '9px', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>AI Recommendation</div>
          <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>
            {officers.length > 0 ? (() => {
              const lightest = officers.reduce((a: any, b: any) => a._count.assignedCases < b._count.assignedCases ? a : b);
              return `Based on current load, assign new cases to ${lightest.name} — ${lightest._count.assignedCases} active cases (lowest load).`;
            })() : 'Add officers to see recommendations.'}
          </div>
        </div>
      </div>
    </div>
  );
}
