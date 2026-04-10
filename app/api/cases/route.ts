import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  const where = user.role === 'OFFICER' ? { officerId: user.id } : user.role === 'CITIZEN' ? { complaint: { complainantId: user.id } } : {};

  const cases = await prisma.case.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      officer: { select: { name: true } },
      complaint: { include: { complainant: { select: { name: true } } } },
    },
  });

  return NextResponse.json(cases);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  if (user.role === 'CITIZEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { caseId, officerId, status, notes } = body;

  const updated = await prisma.case.update({
    where: { id: caseId },
    data: { officerId, status, notes, ...(status === 'CLOSED' ? { closedAt: new Date() } : {}) },
  });

  // Sync complaint status
  if (status) {
    await prisma.complaint.update({ where: { id: updated.complaintId }, data: { status } });
  }

  // Add log
  await prisma.caseLog.create({
    data: { caseId, action: status ? `Status changed to ${status}` : 'Case updated', details: notes },
  });

  return NextResponse.json(updated);
}
