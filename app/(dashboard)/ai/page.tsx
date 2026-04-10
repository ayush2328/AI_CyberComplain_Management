'use client';
import { useState } from 'react';

const S = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '16px' } as React.CSSProperties,
  label: { display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '6px' },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' } as React.CSSProperties,
};

export default function AIPage() {
  const [form, setForm] = useState({ description: '', financialLoss: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!form.description) { setError('Please describe the incident'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { setError(e.message || 'Analysis failed'); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <div style={S.card}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Incident Input</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={S.label}>Incident Description *</label>
            <textarea style={{ ...S.input, resize: 'vertical', minHeight: '140px' }}
              placeholder="e.g. I received an email asking to verify my bank account. I clicked and lost ₹50,000 within minutes..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={6} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={S.label}>Amount Lost (₹)</label>
              <input style={S.input} type="number" placeholder="0" value={form.financialLoss} onChange={e => setForm(p => ({ ...p, financialLoss: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>City</label>
              <input style={S.input} type="text" placeholder="e.g. Delhi" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            </div>
          </div>
          {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--danger)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>{error}</div>}
          <button onClick={run} disabled={loading} style={{ width: '100%', background: 'var(--accent3)', color: '#fff', border: 'none', padding: '11px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Running AI Analysis...' : '✦ Run AI Prediction'}
          </button>
        </div>

        <div style={S.card}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Known Crime Patterns</div>
          {[
            { name: 'OTP Fraud Cluster', cases: 143, status: 'CRITICAL' },
            { name: 'Investment Scam Ring', cases: 89, status: 'HIGH' },
            { name: 'Fake Job Portal', cases: 67, status: 'MEDIUM' },
            { name: 'SIM Swap Attacks', cases: 45, status: 'HIGH' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{p.cases} cases linked</div>
              </div>
              <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontFamily: 'DM Mono, monospace', background: p.status === 'CRITICAL' ? 'rgba(255,77,109,0.15)' : p.status === 'HIGH' ? 'rgba(255,184,0,0.15)' : 'rgba(123,97,255,0.15)', color: p.status === 'CRITICAL' ? 'var(--danger)' : p.status === 'HIGH' ? 'var(--warning)' : 'var(--accent3)', border: `1px solid ${p.status === 'CRITICAL' ? 'rgba(255,77,109,0.3)' : p.status === 'HIGH' ? 'rgba(255,184,0,0.3)' : 'rgba(123,97,255,0.3)'}` }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={S.card}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>AI Analysis Result</div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent3)', animation: `bounce 1.2s ${d}s infinite` }} />)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Running AI prediction model...</div>
            </div>
          )}
          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.3 }}>◎</div>
              <div style={{ fontSize: '13px' }}>Enter incident details and run AI prediction to see classification, risk score, and recommended actions.</div>
            </div>
          )}
          {result && (
            <div>
              <div style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--accent3),var(--accent))' }} />
                <div style={{ fontSize: '9px', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>Primary Classification</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>{result.classification}</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Risk Level:</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)' }}>{result.riskLevel}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.7, marginBottom: '12px' }}>{result.analysis}</div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Confidence Score</div>
                  <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${Math.round((result.confidence || 0.85) * 100)}%`, background: 'linear-gradient(90deg,var(--accent3),var(--accent))', borderRadius: '3px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '4px', fontFamily: 'DM Mono, monospace' }}>{Math.round((result.confidence || 0.85) * 100)}%</div>
                </div>
              </div>

              {result.actions && (
                <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Recommended Actions</div>
                  {result.actions.map((a: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < result.actions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace', fontSize: '12px', minWidth: '20px' }}>{i + 1}.</span>
                      <span style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.similarCases && (
                <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Similar Cases</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{result.similarCases}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>cases with similar pattern found in database</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}
