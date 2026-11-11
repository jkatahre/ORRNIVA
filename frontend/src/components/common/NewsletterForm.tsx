import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Check } from 'lucide-react';
import { subscribeNewsletter } from '../../services/api';
import { Spinner } from './index';

interface Form {
  email: string;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ id = 'newsletter', tone = 'light' }: { id?: string; tone?: 'light' | 'dark' }) {
  const [done, setDone] = useState<null | 'new' | 'already'>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>();

  const onSubmit = async ({ email }: Form) => {
    const res = await subscribeNewsletter(email);
    setDone(res.already ? 'already' : 'new');
    reset();
  };

  const dark = tone === 'dark';

  if (done)
    return (
      <p className={`flex items-start gap-2 text-[14px] ${dark ? 'text-ivory' : 'text-charcoal'}`} role="status">
        <Check size={16} className="mt-1 flex-none text-gold-light" />
        {done === 'new'
          ? 'Thank you for subscribing. Your code WELCOME200 is on its way to your inbox.'
          : 'You are already on our list — thank you for being part of Orrniva.'}
      </p>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className={`flex border-b ${dark ? 'border-ivory/40 focus-within:border-ivory' : 'border-charcoal/40 focus-within:border-charcoal'} transition-colors`}>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${id}-err` : undefined}
          className={`min-w-0 flex-1 bg-transparent py-3 text-[14px] focus:outline-none ${dark ? 'text-ivory placeholder:text-ivory/50' : 'text-charcoal placeholder:text-taupe'}`}
          {...register('email', {
            required: 'Please enter your email address.',
            pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
          })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 pl-3 text-[11px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-ivory' : 'text-charcoal'}`}
        >
          {isSubmitting ? <Spinner /> : <>Subscribe <ArrowRight size={14} /></>}
        </button>
      </div>
      {errors.email && (
        <p id={`${id}-err`} className={`mt-2 text-[12px] ${dark ? 'text-[#e8b9a6]' : 'text-sale'}`}>
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
