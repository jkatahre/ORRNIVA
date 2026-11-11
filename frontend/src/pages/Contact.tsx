import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Clock, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { SITE } from '../config/site';
import { sendContactMessage } from '../services/api';
import { usePageMeta } from '../hooks';
import { PageHeader, Spinner } from '../components/common';
import { EMAIL_PATTERN } from '../components/common/NewsletterForm';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  orderId: string;
  message: string;
}

const SUBJECTS = ['Order enquiry', 'Returns & exchanges', 'Product question', 'Corporate & bulk gifting', 'Press & collaborations', 'Something else'];

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch with the Orrniva customer care team by email, phone or WhatsApp.');
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({ mode: 'onTouched' });

  const onSubmit = handleSubmit(async (v) => {
    await sendContactMessage({ name: v.name, email: v.email, phone: v.phone, subject: v.orderId ? `${v.subject} (${v.orderId})` : v.subject, message: v.message });
    reset();
    setSent(true);
  });

  const info = [
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: SITE.whatsapp, href: `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}` },
    { icon: Clock, label: 'Hours', value: SITE.hours },
    { icon: MapPin, label: 'Studio', value: SITE.address },
  ];

  return (
    <div>
      <PageHeader title="Contact Us" crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} description="Questions about an order, a piece, or a gifting project? We usually reply within one business day." />
      <div className="container-x grid gap-14 py-12 md:py-16 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <ul className="space-y-6">
            {info.map((i) => (
              <li key={i.label} className="flex gap-4">
                <i.icon size={18} strokeWidth={1.4} className="mt-1 flex-none text-gold" />
                <div>
                  <p className="eyebrow">{i.label}</p>
                  {i.href ? (
                    <a href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="mt-1 block text-[15px] text-charcoal link-underline">
                      {i.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-[15px] text-charcoal">{i.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-8">
          {sent ? (
            <div className="border border-sand bg-cream/50 p-8" role="status">
              <Check size={28} className="text-success" />
              <h2 className="mt-4 text-[30px]">Thank you — message received</h2>
              <p className="mt-2 text-muted">Our care team will reply to you by email within one business day.</p>
              <button onClick={() => setSent(false)} className="btn-outline mt-6">Send another message</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="field-label">Name</label>
                <input id="c-name" autoComplete="name" aria-invalid={!!errors.name} className="field" {...register('name', { required: 'Please enter your name.' })} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="field-label">Email</label>
                <input id="c-email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" {...register('email', { required: 'Email is required.', pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' } })} />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="c-phone" className="field-label">Mobile (optional)</label>
                <input id="c-phone" type="tel" inputMode="numeric" maxLength={10} aria-invalid={!!errors.phone} className="field" {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number.' } })} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="c-subject" className="field-label">Subject</label>
                <select id="c-subject" aria-invalid={!!errors.subject} className="field" defaultValue="" {...register('subject', { required: 'Please choose a subject.' })}>
                  <option value="" disabled>Select a topic</option>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="field-error">{errors.subject.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-order" className="field-label">Order number (if applicable)</label>
                <input id="c-order" placeholder="e.g. ORV12345678" className="field" {...register('orderId')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="field-label">Message</label>
                <textarea id="c-message" rows={6} aria-invalid={!!errors.message} className="field resize-y" {...register('message', { required: 'Please write a message.', minLength: { value: 10, message: 'Please add a little more detail (10+ characters).' }, maxLength: { value: 2000, message: 'Please keep it under 2000 characters.' } })} />
                {errors.message && <p className="field-error">{errors.message.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={isSubmitting} className="btn-dark h-12 min-w-44">{isSubmitting ? <Spinner /> : 'Send message'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
