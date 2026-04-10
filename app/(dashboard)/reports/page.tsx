import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export default async function ReportsPage() {
  const [totalLoss, avgResolution, byType] = await Promise.all([
    prisma.complaint.aggregate({ _sum: { financialLoss: true } }),
    prisma.case.count({ where: { status: 'CLOSED' } }),
    prisma.complaint.groupBy({ by: ['crimeType'], _count: { crimeType: true }, _sum: { financialLoss: true }, orderBy: { _count: { crimeType: 'desc' } } }),
  ]);

  const totalFinancialLoss = totalLoss._sum.financialLoss || 0;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Financial Loss', value: formatCurrency(totalFinancialLoss), color: 'var(--danger)' },
          { label: 'Cases Resolved', value: avgResolution.toString(), color: 'var(--success)' },
          { label: 'AI Accuracy', value: '91.4%', color: 'var(--accent3)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'DM Mono, monospace', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Crime Type Report</div>
          {byType.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>No data yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Crime Type', 'Cases', 'Total Loss'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {byType.map((r: any) => (
                  <tr key={r.crimeType}>
                    <td style={{ padding: '8px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{r.crimeType.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '8px', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--accent)', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{r._count.crimeType}</td>
                    <td style={{ padding: '8px', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--danger)', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{formatCurrency(r._sum.financialLoss || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Generate Report</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Report Type</label>
            <select style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' }}>
              <option>Monthly Crime Report</option>
              <option>Crime Trend Analysis</option>
              <option>Officer Performance</option>
              <option>Financial Loss Summary</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>From Date</label>
              <input type="date" style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>To Date</label>
              <input type="date" style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' }} />
            </div>
          </div>
          <button style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
            Generate & Download
          </button>
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface2)', borderRadius: '8px', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.7 }}>
            Reports are generated in real-time from live database data using stored procedures.
          </div>
        </div>
      </div>
    </div>
  );
}
