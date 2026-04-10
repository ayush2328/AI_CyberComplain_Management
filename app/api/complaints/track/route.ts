import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crimeTypeLabel } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const fir = req.nextUrl.searchParams.get('fir');
  if (!fir) return NextResponse.json({ found: false });

  const complaint = await prisma.complaint.findUnique({
    where: { firNumber: fir },
    include: { case: { include: { officer: { select: { name: true } } } } },
  });

  if (!complaint) return NextResponse.json({ found: false });

  return NextResponse.json({
    found: true,
    firNumber: complaint.firNumber,
    status: complaint.status,
    crimeType: crimeTypeLabel(complaint.crimeType),
    city: complaint.city,
    officer: complaint.case?.officer?.name || null,
    createdAt: complaint.createdAt,
  });
}
