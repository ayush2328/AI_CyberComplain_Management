'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
        <span className="text-white text-xl font-bold">🛡️</span>
      </div>
      <div>
        <h1 className="font-bold text-gray-800 text-lg tracking-tight">CyberGuard <span className="text-blue-600">AI</span></h1>
        <p className="text-[10px] text-gray-400 -mt-0.5">Cyber Crime Management</p>
      </div>
    </Link>
  );
}