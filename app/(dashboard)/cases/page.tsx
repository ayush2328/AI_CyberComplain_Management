import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { crimeTypeLabel, formatCurrency } from '@/lib/utils';

const statusColor: Record<string, string> = { OPEN: '#FFB800', ACTIVE: '#00C896', CLOSED: '#6B8CAE', DISMISSED: '#6B8CAE' };
const priorityColor: Record<string, string> = { LOW: '#00C896', MEDIUM: '#7B61FF', HIGH: '#FFB800', CRITICAL: '#FF4D6D' };

export default async function CasesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const where = user?.role === 'OFFICER' ? { officerId: user.id } : {};
  const cases = await prisma.case.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      officer: { select: { name: true } },
      complaint: { include: { complainant: { select: { name: true } } } },
    },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{cases.length} cases found</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', overflowX: 'auto' }}>
        {cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>No cases yet. Cases are auto-created when a complaint is filed.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Case No.', 'FIR No.', 'Complainant', 'Crime Type', 'Officer', 'Status', 'Priority', 'Loss', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {cases.map((c: any) => (
                <tr key={c.id}>
                  <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--accent)', borderBottom: '1px solid rgba(30,48,82,0.5)', whiteSpace: 'nowrap' }}>{c.caseNumber}</td>
                  <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', borderBottom: '1px solid rgba(30,48,82,0.5)', whiteSpace: 'nowrap' }}>{c.complaint.firNumber}</td>
                  <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{c.complaint.complainant.name}</td>
                  <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)', whiteSpace: 'nowrap' }}>{crimeTypeLabel(c.complaint.crimeType)}</td>
                  <td style={{ padding: '10px', fontSize: '12px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>{c.officer?.name || <span style={{ color: 'var(--muted)' }}>Unassigned</span>}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>
                    <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontFamily: 'DM Mono, monospace', background: `${statusColor[c.status]}20`, color: statusColor[c.status], border: `1px solid ${statusColor[c.status]}50` }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(30,48,82,0.5)' }}>
                    <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontFamily: 'DM Mono, monospace', background: `${priorityColor[c.priority]}20`, color: priorityColor[c.priority], border: `1px solid ${priorityColor[c.priority]}50` }}>{c.priority}</span>
                  </td>
                  <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'DM Mono, monospace', borderBottom: '1px solid rgba(30,48,82,0.5)', whiteSpace: 'nowrap' }}>{formatCurrency(c.complaint.financialLoss)}</td>
                  <td style={{ padding: '10px', fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace', borderBottom: '1px solid rgba(30,48,82,0.5)', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
