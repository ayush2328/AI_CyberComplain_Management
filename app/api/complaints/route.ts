import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateFIR, generateCaseNumber } from '@/lib/utils';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  const where = user.role === 'CITIZEN' ? { complainantId: user.id } : {};

  const complaints = await prisma.complaint.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { complainant: { select: { name: true } }, case: { include: { officer: { select: { name: true } } } } },
  });

  return NextResponse.json(complaints);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, crimeType, description, incidentDate, city, financialLoss, aiAnalysis, aiConfidence } = body;

    if (!name || !crimeType || !description || !city) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Get or create user for the complainant
    const session = await getServerSession(authOptions);
    let complainantId: string;

    if (session?.user) {
      complainantId = (session.user as any).id;
    } else {
      // Create guest account
      if (!email) return NextResponse.json({ error: 'Email required for guest filing' }, { status: 400 });
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const pw = await bcrypt.hash(Math.random().toString(36), 10);
        user = await prisma.user.create({ data: { name, email, password: pw, phone, role: 'CITIZEN', city } });
      }
      complainantId = user.id;
    }

    const firNumber = generateFIR();
    const caseNumber = generateCaseNumber();

    // Determine priority based on financial loss
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    if (financialLoss > 500000) priority = 'CRITICAL';
    else if (financialLoss > 100000) priority = 'HIGH';
    else if (financialLoss < 10000) priority = 'LOW';

    const complaint = await prisma.complaint.create({
      data: {
        firNumber,
        complainantId,
        crimeType,
        description,
        incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
        city,
        financialLoss: financialLoss || 0,
        status: 'OPEN',
        priority,
        aiAnalysis,
        aiConfidence,
      },
    });

    // Auto-create case
    await prisma.case.create({
      data: {
        caseNumber,
        complaintId: complaint.id,
        status: 'OPEN',
        priority,
      },
    });

    return NextResponse.json({ firNumber, caseNumber, complaintId: complaint.id }, { status: 201 });
  } catch (error: any) {
    console.error('Complaint POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
