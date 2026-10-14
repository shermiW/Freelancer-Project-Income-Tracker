import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      <div className="w-full max-w-[480px] bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
        {/* Brand F Icon Box */}
        <div className="w-11 h-11 rounded-xl bg-[#5046e5] flex items-center justify-center text-white font-bold text-lg mx-auto mb-5 shadow-sm shadow-indigo-500/25 select-none">
          F
        </div>

        {/* Title & Subtitle matching reference screenshot */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center my-0">
          Welcome back
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 text-center mt-1.5 mb-6 font-normal whitespace-nowrap">
          Enter your credentials to access your income tracker
        </p>

        {/* Error Notification matching screenshot */}
        {(validationError || error) && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#fff1f2] border border-[#fecdd3] text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#f43f5e] shrink-0" strokeWidth={1.75} />
            <span className="text-xs text-[#e11d48] font-normal leading-tight">
              {error === 'Invalid email or password'
                ? 'Invalid email or password. Please try again.'
                : error || validationError}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] accent-[#5046e5] cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('For demo purposes, you can use email: freelancer@demo.com and password: password123');
              }}
              className="text-[#5046e5] hover:text-[#4338ca] font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer mt-5"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer text matching screenshot */}
        <p className="text-center text-xs text-slate-500 mt-6 mb-0">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#5046e5] hover:text-[#4338ca] font-semibold hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
