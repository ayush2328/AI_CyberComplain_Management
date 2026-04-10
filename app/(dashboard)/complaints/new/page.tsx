'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const crimeTypes = [
  { value: 'PHISHING',          label: 'Phishing / Email Fraud' },
  { value: 'RANSOMWARE',        label: 'Ransomware Attack' },
  { value: 'IDENTITY_THEFT',    label: 'Identity Theft' },
  { value: 'BANKING_FRAUD',     label: 'Online Banking Fraud' },
  { value: 'CYBERBULLYING',     label: 'Cyberbullying / Harassment' },
  { value: 'DATA_BREACH',       label: 'Data Breach' },
  { value: 'HACKING',           label: 'Hacking / Unauthorized Access' },
  { value: 'SOCIAL_MEDIA_FRAUD',label: 'Social Media Fraud' },
  { value: 'DARK_WEB',          label: 'Dark Web Activity' },
  { value: 'OTHER',             label: 'Other' },
];

const S = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '16px' } as React.CSSProperties,
  label: { display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '6px' },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Syne, sans-serif', outline: 'none' } as React.CSSProperties,
};

export default function NewComplaintPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', crimeType: '', description: '',
    incidentDate: '', city: '', financialLoss: '0',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const analyzeWithAI = async () => {
    if (!form.description || !form.crimeType) {
      setError('Please fill crime type and description first');
      return;
    }
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: form.description, crimeType: form.crimeType, financialLoss: form.financialLoss, city: form.city }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch {
      setError('AI analysis failed. Please try again.');
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.crimeType) { setError('Please select a crime type'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, financialLoss: parseFloat(form.financialLoss) || 0, aiAnalysis: aiResult?.analysis, aiConfidence: aiResult?.confidence }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(`Complaint filed successfully! FIR Number: ${data.firNumber}`);
      setTimeout(() => router.push('/complaints'), 3000);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Form */}
        <div>
          <div style={S.card}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '18px', color: 'var(--text)' }}>Complainant Details</div>
            <div style={{ marginBottom: '14px' }}>
              <label style={S.label}>Full Name *</label>
              <input style={S.input} placeholder="Enter your full name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={S.label}>Phone *</label>
                <input style={S.input} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '18px', color: 'var(--text)' }}>Incident Details</div>
            <div style={{ marginBottom: '14px' }}>
              <label style={S.label}>Crime Type *</label>
              <select style={S.input} value={form.crimeType} onChange={e => set('crimeType', e.target.value)}>
                <option value="">Select crime type...</option>
                {crimeTypes.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={S.label}>Date of Incident *</label>
                <input style={S.input} type="date" value={form.incidentDate} onChange={e => set('incidentDate', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>City / Location *</label>
                <input style={S.input} placeholder="e.g. Delhi, Noida" value={form.city} onChange={e => set('city', e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={S.label}>Incident Description *</label>
              <textarea style={{ ...S.input, resize: 'vertical', minHeight: '110px' }} placeholder="Describe the incident in detail. Include any suspicious links, phone numbers, emails, or any other relevant information..." value={form.description} onChange={e => set('description', e.target.value)} rows={5} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={S.label}>Financial Loss (₹)</label>
              <input style={S.input} type="number" placeholder="0" value={form.financialLoss} onChange={e => set('financialLoss', e.target.value)} />
            </div>

            {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--danger)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>{error}</div>}
            {success && <div style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: 'var(--success)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>{success}</div>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} disabled={loading} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Filing...' : 'Submit Complaint'}
              </button>
              <button onClick={analyzeWithAI} disabled={aiLoading} style={{ background: 'transparent', color: 'var(--accent3)', border: '1px solid var(--accent3)', padding: '9px 18px', borderRadius: '6px', fontSize: '13px', fontFamily: 'Syne, sans-serif', cursor: 'pointer', opacity: aiLoading ? 0.7 : 1 }}>
                {aiLoading ? 'Analyzing...' : '✦ Analyze with AI'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Panel */}
        <div>
          <div style={S.card}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>AI Quick Analysis</div>
            {aiLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent3)', animation: `bounce 1.2s ${d}s infinite` }} />)}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Analyzing incident...</span>
              </div>
            )}
            {!aiLoading && !aiResult && (
              <div style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '9px', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>AI Prediction Engine</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>Fill the crime type and description, then click "Analyze with AI" to get classification, risk score, and recommended actions.</div>
              </div>
            )}
            {aiResult && (
              <div>
                <div style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px', padding: '14px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--accent3),var(--accent))' }} />
                  <div style={{ fontSize: '9px', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Classification</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>{aiResult.classification}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>{aiResult.analysis}</div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Confidence Score</div>
                    <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${Math.round((aiResult.confidence || 0.85) * 100)}%`, background: 'linear-gradient(90deg,var(--accent3),var(--accent))', borderRadius: '3px', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '4px', fontFamily: 'DM Mono, monospace' }}>{Math.round((aiResult.confidence || 0.85) * 100)}% confidence</div>
                  </div>
                </div>
                {aiResult.actions && (
                  <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Recommended Actions</div>
                    {aiResult.actions.map((a: string, i: number) => (
                      <div key={i} style={{ fontSize: '12px', color: 'var(--text)', padding: '4px 0', borderBottom: i < aiResult.actions.length - 1 ? '1px solid var(--border)' : 'none', lineHeight: 1.5 }}>{i + 1}. {a}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={S.card}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Track Existing Complaint</div>
            <input style={{ ...S.input, marginBottom: '10px' }} placeholder="Enter FIR Number e.g. FIR-2026-12345" id="track-fir" />
            <button onClick={async () => {
              const fir = (document.getElementById('track-fir') as HTMLInputElement).value;
              if (!fir) return;
              const res = await fetch(`/api/complaints/track?fir=${fir}`);
              const data = await res.json();
              const box = document.getElementById('track-box');
              if (box) box.innerHTML = data.found
                ? `<div style="font-size:12px;line-height:1.8;color:var(--text)"><b style="color:var(--accent)">${data.firNumber}</b><br/>Status: ${data.status}<br/>Crime: ${data.crimeType}<br/>Officer: ${data.officer || 'Not assigned yet'}</div>`
                : `<div style="color:var(--danger);font-size:12px">FIR not found. Check the number and try again.</div>`;
            }} style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '8px', borderRadius: '6px', fontSize: '12px', fontFamily: 'Syne, sans-serif', cursor: 'pointer', marginBottom: '10px' }}>
              Track Status
            </button>
            <div id="track-box" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}
