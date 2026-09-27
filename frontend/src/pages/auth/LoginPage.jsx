import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input } from '../../components/forms/Input';
import { Checkbox } from '../../components/forms/Checkbox';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { MOCK_AUTH_USERS } from '../../mock/authUsers';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('manager@buildops.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UX & Validation states
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field validation helper
  const validate = () => {
    const errors = {};

    if (!email || !email.trim()) {
      errors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleQuickSelect = (userItem) => {
    setEmail(userItem.email);
    setPassword('password123');
    setFieldErrors({});
    setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);

      if (res.success && res.user) {
        setIsSuccess(true);
        addToast({
          title: 'Authenticated Successfully',
          message: `Logged in as ${res.user.name} (${res.user.jobTitle})`,
          type: 'success',
        });

        const destination = location.state?.from?.pathname || '/dashboard';
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 500);
      } else {
        setIsLoading(false);
        setAuthError(res.error || 'Unable to sign in. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Unable to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Title Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to BuildOps</h2>
        <p className="text-xs text-slate-500 mt-1">
          Smart Construction & Resource Intelligence Platform
        </p>
      </div>

      {/* Auth Failure Alert */}
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold block">Authentication Error</span>
            <span className="text-red-700">{authError}</span>
          </div>
        </div>
      )}

      {/* Auth Success Indicator */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">
            Authentication successful! Redirecting to workspace...
          </span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <Input
          label="Work Email Address"
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
            if (authError) setAuthError('');
          }}
          placeholder="e.g. manager@buildops.com"
          leftIcon={Mail}
          error={fieldErrors.email}
          required
          isDisabled={isLoading || isSuccess}
        />

        {/* Password Field */}
        <Input
          label="Password"
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
            if (authError) setAuthError('');
          }}
          placeholder="Enter your password"
          leftIcon={Lock}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-slate-700 focus:outline-none focus:text-slate-900 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={fieldErrors.password}
          required
          isDisabled={isLoading || isSuccess}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            isDisabled={isLoading || isSuccess}
          />

          <Link
            to="/forgot-password"
            className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            fullWidth
            isLoading={isLoading}
            isDisabled={isSuccess}
            rightIcon={!isLoading ? LogIn : null}
            className="py-2.5 font-bold"
          >
            {isLoading ? 'Signing in...' : isSuccess ? 'Accessing Workspace...' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* Mock Credentials Demo Selector */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            Quick Demo Accounts
          </span>
          <span className="text-[10px] text-slate-400">Click to autofill</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MOCK_AUTH_USERS.map((usr) => {
            const isSelected = email.toLowerCase() === usr.email.toLowerCase();
            return (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleQuickSelect(usr)}
                className={`p-2 text-left rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-slate-800 truncate">{usr.name}</span>
                  <Badge variant={isSelected ? 'amber' : 'outline'} size="sm" className="text-[9px] px-1 py-0">
                    {usr.role}
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{usr.email}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          BuildOps SaaS v1.0 • Enterprise Auth Architecture Ready
        </p>
      </div>
    </div>
  );
};
