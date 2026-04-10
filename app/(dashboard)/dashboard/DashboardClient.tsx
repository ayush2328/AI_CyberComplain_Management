'use client';
import { crimeTypeLabel, formatCurrency } from '@/lib/utils';

const S = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' } as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: 700, fontFamily: 'DM Mono, monospace', lineHeight: 1 },
  cardTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' },
  pill: (color: string) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 500, fontFamily: 'DM Mono, monospace', background: `${color}20`, color, border: `1px solid ${color}50` }),
};

const statusColor: Record<string, string> = { OPEN: '#FFB800', ACTIVE: '#00C896', CLOSED: '#6B8CAE', DISMISSED: '#6B8CAE' };
const priorityColor: Record<string, string> = { LOW: '#00C896', MEDIUM: '#7B61FF', HIGH: '#FFB800', CRITICAL: '#FF4D6D' };
const monthlyData = [210, 280, 245, 320, 290, 380, 410, 384];
const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

export default function DashboardClient({ stats, recentComplaints, crimeTypeCounts, userRole }: any) {
  const maxBar = Math.max(...monthlyData);
  const totalCrimeCount = crimeTypeCounts.reduce((s: number, c: any) => s + c._count.crimeType, 0);
  const resolutionRate = stats.totalComplaints > 0 ? Math.round((stats.closedCases / stats.totalComplaints) * 100) : 0;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Cases', value: stats.totalComplaints, color: 'var(--accent)', delta: 'All time' },
          { label: 'Active Investigations', value: stats.activeComplaints, color: 'var(--warning)', delta: 'Currently open' },
          { label: 'Cases Solved', value: stats.closedCases, color: 'var(--success)', delta: `${resolutionRate}% resolution rate` },
          { label: 'Critical Alerts', value: stats.criticalAlerts, color: 'var(--danger)', delta: 'Needs action' },
        ].map(stat => (
          <div key={stat.label} style={S.card}>
            <div style={S.statLabel}>{stat.label}</div>
            <div style={{ ...S.statValue, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Bar Chart */}
        <div style={S.card}>
          <div style={S.cardTitle}>Monthly Crime Trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '130px', padding: '0 4px' }}>
            {monthlyData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(v / maxBar) * 110}px`, background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '4px', fontFamily: 'DM Mono, monospace' }}>{months[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Crime Type Breakdown */}
        <div style={S.card}>
          <div style={S.cardTitle}>Crime Type Breakdown</div>
          {crimeTypeCounts.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>No data yet</div>
          ) : crimeTypeCounts.map((c: any) => {
            const pct = totalCrimeCount > 0 ? Math.round((c._count.crimeType / totalCrimeCount) * 100) : 0;
            return (
              <div key={c.crimeType} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text)' }}>{crimeTypeLabel(c.crimeType)}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{pct}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--surface2)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Complaints */}
      <div style={S.card}>
        <div style={S.cardTitle}>Recent Complaints</div>
        {recentComplaints.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>No complaints yet. <a href="/complaints/new" style={{ color: 'var(--accent)' }}>File the first one →</a></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['FIR No.', 'Complainant', 'Crime Type', 'City', 'Loss', 'Status', 'Priority'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {recentComplaints.map((c: any) => (
                  <tr key={c.id} style={{ cursor: 'pointer' }}>
                    <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--accent)', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{c.firNumber}</td>
                    <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{c.complainant.name}</td>
                    <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{crimeTypeLabel(c.crimeType)}</td>
                    <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{c.city}</td>
                    <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'DM Mono, monospace', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{formatCurrency(c.financialLoss)}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}><span style={S.pill(statusColor[c.status] || '#6B8CAE')}>{c.status}</span></td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}><span style={S.pill(priorityColor[c.priority] || '#6B8CAE')}>{c.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
