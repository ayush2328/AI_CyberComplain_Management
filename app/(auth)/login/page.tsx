'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiShield, FiArrowRight, FiEye, FiEyeOff, FiUser, FiBriefcase, FiShield as FiAdmin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('citizen');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || 'Invalid credentials');
      } else {
        toast.success('Welcome to CyberGuard AI!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email: string, pass: string) => {
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password: pass,
      redirect: false,
    });
    if (!result?.error) {
      toast.success('Login successful!');
      router.push('/dashboard');
      router.refresh();
    } else {
      toast.error('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Branding */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-700 to-blue-500 p-8 lg:p-12 text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FiShield className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">CyberGuard <span className="text-blue-200">AI</span></h1>
                  <p className="text-xs text-blue-200 opacity-80">AI-Powered Cyber Crime Management</p>
                </div>
              </div>
              
              <div className="space-y-6 mt-12">
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-blue-100 leading-relaxed">
                  India's first AI-powered cyber crime complaint management system. 
                  File complaints, track cases, and get AI-assisted analysis in real-time.
                </p>
                
                <div className="space-y-3 mt-8">
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                    <span>AI-powered crime classification</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                    <span>Real-time case tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                    <span>Secure evidence upload</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                    <span>24/7 complaint filing</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-xs text-blue-200">
                  🔒 Protected by advanced encryption • Made in India
                </p>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-white">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-gray-500 text-sm mt-1">Access your CyberGuard AI account</p>
                </div>

                {/* Role Selector */}
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={() => setSelectedRole('citizen')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedRole === 'citizen' 
                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <FiUser className="text-base" />
                    <span className="text-sm font-medium">Citizen</span>
                  </button>
                  <button
                    onClick={() => setSelectedRole('officer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedRole === 'officer' 
                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <FiBriefcase className="text-base" />
                    <span className="text-sm font-medium">Officer</span>
                  </button>
                  <button
                    onClick={() => setSelectedRole('admin')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedRole === 'admin' 
                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <FiAdmin className="text-base" />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={selectedRole === 'citizen' ? 'rahul@example.com' : selectedRole === 'officer' ? 'mehta@acms.gov.in' : 'admin@acms.gov.in'}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In <FiArrowRight />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-8">
                  <p className="text-xs text-center text-gray-400 mb-3">Quick Demo Access</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => quickLogin('admin@acms.gov.in', 'admin123')}
                      className="py-2 text-xs font-medium rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      👑 Admin
                    </button>
                    <button
                      onClick={() => quickLogin('mehta@acms.gov.in', 'officer123')}
                      className="py-2 text-xs font-medium rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      👮 Officer
                    </button>
                    <button
                      onClick={() => quickLogin('rahul@example.com', 'citizen123')}
                      className="py-2 text-xs font-medium rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      👤 Citizen
                    </button>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                  <a href="/complaints/new" className="text-xs text-blue-500 hover:text-blue-600 transition-colors">
                    🔍 File a complaint without login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 CyberGuard AI. All rights reserved. | Protected by Indian Cyber Laws
        </p>
      </div>
    </div>
  );
}