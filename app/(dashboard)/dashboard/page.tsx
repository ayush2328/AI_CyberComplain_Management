import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const [totalComplaints, activeComplaints, closedCases, criticalAlerts, recentComplaints] =
    await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'ACTIVE' } }),
      prisma.case.count({ where: { status: 'CLOSED' } }),
      prisma.complaint.count({ where: { priority: 'CRITICAL', status: { not: 'CLOSED' } } }),
      prisma.complaint.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { complainant: { select: { name: true } } },
      }),
    ]);

  const crimeTypeCounts = await prisma.complaint.groupBy({
    by: ['crimeType'],
    _count: { crimeType: true },
    orderBy: { _count: { crimeType: 'desc' } },
    take: 6,
  });

  return (
    <DashboardClient
      stats={{ totalComplaints, activeComplaints, closedCases, criticalAlerts }}
      recentComplaints={recentComplaints}
      crimeTypeCounts={crimeTypeCounts}
      userRole={user?.role}
    />
  );
}