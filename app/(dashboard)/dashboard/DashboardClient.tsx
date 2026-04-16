'use client';

import { FiFileText, FiAlertCircle, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

const crimeTypeLabels: Record<string, string> = {
  FINANCIAL_FRAUD: 'Financial Fraud',
  IDENTITY_THEFT: 'Identity Theft',
  CYBERSTALKING: 'Cyberstalking',
  RANSOMWARE: 'Ransomware',
  ONLINE_SCAM: 'Online Scam',
  DATA_BREACH: 'Data Breach',
  PHISHING: 'Phishing',
  HACKING: 'Hacking',
  OTHER: 'Other',
};

export default function DashboardClient({ stats, recentComplaints, crimeTypeCounts, userRole }: any) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of cyber crime complaints and system status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalComplaints}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FiFileText className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Complaints</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeComplaints}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <FiAlertCircle className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Resolved Cases</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.closedCases}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.criticalAlerts}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <FiShield className="text-red-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Crime Type Distribution */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Complaints by Type</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {crimeTypeCounts.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{crimeTypeLabels[item.crimeType] || item.crimeType}</span>
                  <span className="text-gray-500 font-medium">{item._count.crimeType}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item._count.crimeType / stats.totalComplaints) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Recent Complaints</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentComplaints.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No complaints found</div>
          ) : (
            recentComplaints.map((complaint: any) => (
              <div key={complaint.id} className="p-4 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{complaint.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {complaint.complainant?.name || 'Anonymous'} • {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                    complaint.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                    complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {complaint.status || 'PENDING'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}