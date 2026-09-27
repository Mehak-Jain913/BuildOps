import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 text-center">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Reset Your Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered work email address below to receive password recovery instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-5 text-center animate-in fade-in">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Reset Link Sent</h4>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  If an account exists for <span className="font-semibold">{email}</span>, password reset instructions will be sent shortly.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/login">
              <Button variant="outline" fullWidth leftIcon={ArrowLeft}>
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Work Email Address"
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. manager@buildops.com"
            leftIcon={Mail}
            error={error}
            required
            isDisabled={isSubmitting}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              fullWidth
              isLoading={isSubmitting}
            >
              Send Reset Link
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          BuildOps Site Intelligence Platform • Security Self-Service
        </p>
      </div>
    </div>
  );
};
