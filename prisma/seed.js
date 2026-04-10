const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acms.gov.in' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@acms.gov.in',
      password: adminPass,
      role: 'ADMIN',
      city: 'Delhi',
    },
  });

  // Create Officers
  const officerPass = await bcrypt.hash('officer123', 10);
  const officers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'mehta@acms.gov.in' },
      update: {},
      create: { name: 'Insp. Rajesh Mehta', email: 'mehta@acms.gov.in', password: officerPass, role: 'OFFICER', phone: '9876543210', city: 'Delhi', badgeNumber: 'DL-001' },
    }),
    prisma.user.upsert({
      where: { email: 'sharma@acms.gov.in' },
      update: {},
      create: { name: 'SI Amit Sharma', email: 'sharma@acms.gov.in', password: officerPass, role: 'OFFICER', phone: '9876543211', city: 'Noida', badgeNumber: 'UP-001' },
    }),
    prisma.user.upsert({
      where: { email: 'joshi@acms.gov.in' },
      update: {},
      create: { name: 'Insp. Pooja Joshi', email: 'joshi@acms.gov.in', password: officerPass, role: 'OFFICER', phone: '9876543212', city: 'Gurugram', badgeNumber: 'HR-001' },
    }),
  ]);

  // Create Citizen
  const citizenPass = await bcrypt.hash('citizen123', 10);
  const citizen = await prisma.user.upsert({
    where: { email: 'rahul@example.com' },
    update: {},
    create: { name: 'Rahul Sharma', email: 'rahul@example.com', password: citizenPass, role: 'CITIZEN', phone: '9999999999', city: 'Delhi' },
  });

  // Create Sample Complaints & Cases
  const sampleComplaints = [
    { crimeType: 'RANSOMWARE', description: 'My company systems were attacked by ransomware. All files encrypted. Demanded ₹5 lakh in Bitcoin.', city: 'Delhi', financialLoss: 450000, priority: 'CRITICAL', officerIdx: 0 },
    { crimeType: 'IDENTITY_THEFT', description: 'Someone created fake accounts using my Aadhaar number and took loans.', city: 'Noida', financialLoss: 82000, priority: 'HIGH', officerIdx: 1 },
    { crimeType: 'BANKING_FRAUD', description: 'Received OTP call from fake bank executive, lost money from account.', city: 'Gurugram', financialLoss: 15500, priority: 'MEDIUM', officerIdx: 2 },
    { crimeType: 'PHISHING', description: 'Got email from fake HDFC bank, clicked link and credentials stolen.', city: 'Delhi', financialLoss: 8200, priority: 'MEDIUM', officerIdx: 0 },
    { crimeType: 'DATA_BREACH', description: 'Our company customer database was exfiltrated and posted on dark web.', city: 'Mumbai', financialLoss: 1200000, priority: 'CRITICAL', officerIdx: 1 },
  ];

  for (let i = 0; i < sampleComplaints.length; i++) {
    const sc = sampleComplaints[i];
    const firNum = `FIR-2026-${4817 + i}`;
    const caseNum = `CASE-2026-${4817 + i}`;

    let complaint;
    try {
      complaint = await prisma.complaint.create({
        data: {
          firNumber: firNum,
          complainantId: citizen.id,
          crimeType: sc.crimeType,
          description: sc.description,
          incidentDate: new Date(Date.now() - (i + 1) * 86400000),
          city: sc.city,
          financialLoss: sc.financialLoss,
          status: i === 3 ? 'CLOSED' : 'ACTIVE',
          priority: sc.priority,
          aiAnalysis: `AI Analysis: This incident is classified as ${sc.crimeType}. Confidence: 89%.`,
          aiConfidence: 0.89,
        },
      });

      await prisma.case.create({
        data: {
          caseNumber: caseNum,
          complaintId: complaint.id,
          officerId: officers[sc.officerIdx].id,
          status: i === 3 ? 'CLOSED' : 'ACTIVE',
          priority: sc.priority,
          notes: 'Case under active investigation.',
        },
      });
    } catch (e) {
      // Skip if already exists
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin     → admin@acms.gov.in    / admin123');
  console.log('Officer   → mehta@acms.gov.in    / officer123');
  console.log('Citizen   → rahul@example.com    / citizen123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
