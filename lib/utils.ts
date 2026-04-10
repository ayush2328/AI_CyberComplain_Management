export function generateFIR(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `FIR-${year}-${rand}`;
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `CASE-${year}-${rand}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function crimeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PHISHING: 'Phishing / Email Fraud',
    RANSOMWARE: 'Ransomware Attack',
    IDENTITY_THEFT: 'Identity Theft',
    BANKING_FRAUD: 'Online Banking Fraud',
    CYBERBULLYING: 'Cyberbullying / Harassment',
    DATA_BREACH: 'Data Breach',
    HACKING: 'Hacking / Unauthorized Access',
    SOCIAL_MEDIA_FRAUD: 'Social Media Fraud',
    DARK_WEB: 'Dark Web Activity',
    OTHER: 'Other',
  };
  return labels[type] || type;
}
