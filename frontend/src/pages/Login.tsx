import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestPasswordReset } from '../services/api';
import { usePageMeta } from '../hooks';
import { Img, Logo, Spinner } from '../components/common';
import { EMAIL_PATTERN } from '../components/common/NewsletterForm';

type Mode = 'login' | 'register' | 'forgot';

const PASSWORD_RULES = [
  { test: (s: string) => s.length >= 8, label: 'At least 8 characters' },
  { test: (s: string) => /[A-Z]/.test(s), label: 'One uppercase letter' },
  { test: (s: string) => /[a-z]/.test(s), label: 'One lowercase letter' },
  { test: (s: string) => /\d/.test(s), label: 'One number' },
];

function PasswordInput({ id, registration, invalid, autoComplete }: { id: string; registration: object; invalid: boolean; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} aria-invalid={invalid} className="field pr-11" {...registration} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-taupe hover:text-ink">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function LoginForm({ onDone, setMode }: { onDone: () => void; setMode: (m: Mode) => void }) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();
  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="login-email" className="field-label">Email</label>
        <input id="login-email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" {...register('email', { required: 'Email is required.', pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' } })} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="login-password" className="field-label">Password</label>
          <button type="button" onClick={() => setMode('forgot')} className="text-[12px] text-muted underline underline-offset-4 hover:text-ink">Forgot password?</button>
        </div>
        <PasswordInput id="login-password" autoComplete="current-password" invalid={!!errors.password} registration={register('password', { required: 'Password is required.' })} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>
      {error && <p role="alert" className="bg-sale/10 px-3 py-2 text-[13px] text-sale">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="btn-dark h-12 w-full">{isSubmitting ? <Spinner /> : 'Sign in'}</button>
      <p className="text-center text-[14px] text-muted">
        New to Orrniva? <button type="button" onClick={() => setMode('register')} className="text-charcoal link-underline">Create an account</button>
      </p>
    </form>
  );
}

interface RegisterValues { name: string; email: string; phone: string; password: string; confirm: string; terms: boolean }

function RegisterForm({ onDone, setMode }: { onDone: () => void; setMode: (m: Mode) => void }) {
  const { register: signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterValues>({ mode: 'onTouched' });
  const pw = watch('password') ?? '';
  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    try {
      await signUp({ name: v.name, email: v.email, phone: v.phone || undefined, password: v.password });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create account.');
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="reg-name" className="field-label">Full name</label>
        <input id="reg-name" autoComplete="name" aria-invalid={!!errors.name} className="field" {...register('name', { required: 'Please enter your name.', minLength: { value: 2, message: 'Please enter your full name.' } })} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-email" className="field-label">Email</label>
          <input id="reg-email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" {...register('email', { required: 'Email is required.', pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' } })} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="reg-phone" className="field-label">Mobile (optional)</label>
          <input id="reg-phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" aria-invalid={!!errors.phone} className="field" {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number.' } })} />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="reg-password" className="field-label">Password</label>
        <PasswordInput
          id="reg-password"
          autoComplete="new-password"
          invalid={!!errors.password}
          registration={register('password', { required: 'Please create a password.', validate: (v) => PASSWORD_RULES.every((r) => r.test(v)) || 'Password does not meet all requirements.' })}
        />
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(pw);
            return (
              <li key={r.label} className={`flex items-center gap-1.5 ${ok ? 'text-success' : 'text-taupe'}`}>
                {ok ? <Check size={12} /> : <X size={12} />} {r.label}
              </li>
            );
          })}
        </ul>
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="reg-confirm" className="field-label">Confirm password</label>
        <PasswordInput id="reg-confirm" autoComplete="new-password" invalid={!!errors.confirm} registration={register('confirm', { required: 'Please confirm your password.', validate: (v) => v === pw || 'Passwords do not match.' })} />
        {errors.confirm && <p className="field-error">{errors.confirm.message}</p>}
      </div>
      <label className="flex items-start gap-3 text-[13px] text-muted">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-charcoal" {...register('terms', { required: 'Please accept the terms to continue.' })} />
        <span>
          I agree to the <Link to="/privacy-policy" className="text-charcoal underline underline-offset-2">privacy policy</Link> and terms of sale.
        </span>
      </label>
      {errors.terms && <p className="field-error -mt-3">{errors.terms.message}</p>}
      {error && <p role="alert" className="bg-sale/10 px-3 py-2 text-[13px] text-sale">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="btn-dark h-12 w-full">{isSubmitting ? <Spinner /> : 'Create account'}</button>
      <p className="text-center text-[14px] text-muted">
        Already have an account? <button type="button" onClick={() => setMode('login')} className="text-charcoal link-underline">Sign in</button>
      </p>
    </form>
  );
}

function ForgotForm({ setMode }: { setMode: (m: Mode) => void }) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();
  const onSubmit = handleSubmit(async ({ email }) => {
    await requestPasswordReset(email);
    setSentTo(email);
  });
  if (sentTo)
    return (
      <div className="space-y-5">
        <p className="flex items-start gap-2 text-[14px] text-charcoal" role="status">
          <Check size={16} className="mt-1 flex-none text-success" />
          If an account exists for {sentTo}, you will receive a link to reset your password shortly.
        </p>
        <button onClick={() => setMode('login')} className="btn-outline w-full">Back to sign in</button>
      </div>
    );
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <p className="text-[14px] text-muted">Enter the email address on your account and we will send you a link to reset your password.</p>
      <div>
        <label htmlFor="forgot-email" className="field-label">Email</label>
        <input id="forgot-email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" {...register('email', { required: 'Email is required.', pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' } })} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-dark h-12 w-full">{isSubmitting ? <Spinner /> : 'Send reset link'}</button>
      <button type="button" onClick={() => setMode('login')} className="w-full text-center text-[13px] text-muted underline underline-offset-4 hover:text-ink">Back to sign in</button>
    </form>
  );
}

export default function Login() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get('mode') === 'register' ? 'register' : 'login');
  const { user } = useAuth();
  const navigate = useNavigate();
  const redirect = params.get('redirect');
  const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/account';
  usePageMeta(mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Sign in');

  if (user && mode !== 'forgot') return <Navigate to={safeRedirect} replace />;
  const onDone = () => navigate(safeRedirect, { replace: true });

  const titles: Record<Mode, [string, string]> = {
    login: ['Welcome back', 'Sign in to view orders, saved addresses and your wishlist.'],
    register: ['Create an account', 'Join Orrniva for faster checkout, order tracking and early access to new collections.'],
    forgot: ['Reset password', ''],
  };

  return (
    <div className="container-x grid gap-12 py-10 md:py-16 lg:grid-cols-2 lg:gap-20">
      <div className="hidden lg:block">
        <div className="sticky top-[150px] aspect-[4/5] overflow-hidden bg-cream">
          <Img imageKey="arched-mirror-console" alt="" sizes="45vw" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-md lg:pt-8">
        <Logo className="mb-10 lg:hidden" />
        {mode !== 'forgot' && (
          <div role="tablist" className="mb-8 grid grid-cols-2 border-b border-sand">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`relative pb-3 text-[12px] font-medium uppercase tracking-[0.18em] ${mode === m ? 'text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-charcoal' : 'text-taupe'}`}>
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>
        )}
        <h1 className="text-[38px]">{titles[mode][0]}</h1>
        {titles[mode][1] && <p className="mt-2 mb-8 text-muted">{titles[mode][1]}</p>}
        <div className={mode === 'forgot' ? 'mt-6' : ''}>
          {mode === 'login' && <LoginForm onDone={onDone} setMode={setMode} />}
          {mode === 'register' && <RegisterForm onDone={onDone} setMode={setMode} />}
          {mode === 'forgot' && <ForgotForm setMode={setMode} />}
        </div>
      </div>
    </div>
  );
}
