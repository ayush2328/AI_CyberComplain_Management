import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const officers = await prisma.user.findMany({
    where: { role: 'OFFICER' },
    select: { id: true, name: true, email: true, city: true, badgeNumber: true, isActive: true, _count: { select: { assignedCases: { where: { status: { not: 'CLOSED' } } } } } },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(officers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { name, email, phone, city, badgeNumber } = await req.json();
  const password = await bcrypt.hash('officer123', 10);

  const officer = await prisma.user.create({
    data: { name, email, password, phone, city, badgeNumber, role: 'OFFICER' },
  });

  return NextResponse.json({ id: officer.id, name: officer.name }, { status: 201 });
}
