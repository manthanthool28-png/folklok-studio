import { useState } from 'react';
import site from '../content/site.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { Needed, NeededPanel } from '../components/Needed';
import { IconMail, IconPhone, IconArrow } from '../components/Icons';
import { GlassCard } from '../components/Glass';

const EVENT_TYPES = [
  'Festival',
  'Wedding or celebration',
  'Corporate or private event',
  'Cultural programme',
  'Other',
];

const EMPTY = {
  name: '',
  organisation: '',
  email: '',
  eventDate: '',
  venue: '',
  eventType: '',
  message: '',
};

const field =
  'w-full rounded-2xl border border-espresso/15 bg-white/55 px-4 py-3.5 font-body text-espresso ' +
  'backdrop-blur-md transition-all duration-300 placeholder:text-espresso/35 ' +
  'focus:border-marigold focus:bg-white/80 focus:outline-none ' +
  'focus:shadow-[0_0_0_4px_rgba(245,183,0,0.18)]';

const labelCls = 'block font-body text-sm font-600 text-espresso';

export function Booking() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const to = site.contact.bookingEmail;

  function update(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    };
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!form.email.trim()) next.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That email does not look right.';
    if (!form.eventDate) next.eventDate = 'Which date are you planning for?';
    if (!form.message.trim()) next.message = 'A line or two about the event helps.';
    return next;
  }

  /**
   * No backend on this build, so the form hands off to the visitor's mail
   * client with everything pre-filled. Swap this for a real POST (Formspree,
   * Basin, a serverless function) before launch — see the README.
   */
  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || !to) return;

    const body = [
      `Name: ${form.name}`,
      `Organisation: ${form.organisation || '—'}`,
      `Email: ${form.email}`,
      `Event date: ${form.eventDate}`,
      `Venue: ${form.venue || '—'}`,
      `Event type: ${form.eventType || '—'}`,
      '',
      form.message,
    ].join('\n');

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(
      `Booking enquiry — ${form.name}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
      <PageHeader
        mr="बुकिंग"
        en="Book Folklok"
        lead="Festivals, weddings, cultural programmes — tell us about the event and we will come back to you."
      />

      <section className="texture-cloth">
        <div className="mx-auto max-w-5xl px-5 py-18 sm:px-8">
          {/* Direct contact */}
          <Reveal className="grid gap-5 sm:grid-cols-2">
            <GlassCard tone="light" spotlight className="p-6">
              <p className="flex items-center gap-2 font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
                <IconMail className="h-4 w-4" /> Email
              </p>
              <p className="mt-2 font-display text-xl break-words text-espresso">
                {to ? (
                  <a href={`mailto:${to}`} className="underline decoration-marigold decoration-2 underline-offset-4">
                    {to}
                  </a>
                ) : (
                  <Needed>Booking email</Needed>
                )}
              </p>
            </GlassCard>
            <GlassCard tone="light" spotlight className="p-6">
              <p className="flex items-center gap-2 font-body text-[0.7rem] font-600 uppercase tracking-[0.16em] text-terracotta">
                <IconPhone className="h-4 w-4" /> Phone
              </p>
              <p className="mt-2 font-display text-xl text-espresso">
                {site.contact.bookingPhone ? (
                  <a
                    href={`tel:${site.contact.bookingPhone.replace(/\s/g, '')}`}
                    className="underline decoration-marigold decoration-2 underline-offset-4"
                  >
                    {site.contact.bookingPhone}
                  </a>
                ) : (
                  <Needed>Phone number</Needed>
                )}
              </p>
            </GlassCard>
          </Reveal>

          <Divider />

          {/* What we offer */}
          <Reveal>
            <p className="font-display text-xl text-terracotta">आम्ही काय देतो</p>
            <h2 className="mt-1 font-display text-3xl text-espresso sm:text-4xl">What we offer</h2>
          </Reveal>
          <Reveal delay={100} className="mt-7">
            <NeededPanel title="Set the organiser's expectations">
              Typical set length and style, how many people travel with the
              group, and the stage, sound and power you need. Answering this
              before someone writes saves a round of emails — and a press kit or
              one-page PDF to download here would help organisers more.
            </NeededPanel>
          </Reveal>

          <Divider />

          {/* Form */}
          <Reveal>
            <h2 className="font-display text-3xl text-espresso sm:text-4xl">Enquire</h2>
          </Reveal>

          {!to && (
            <Reveal delay={80} className="mt-6">
              <div
                data-needed
                className="rounded-3xl border border-dashed border-terracotta/45 bg-terracotta/7 p-7 backdrop-blur-md"
              >
                <p className="font-body text-[0.72rem] font-600 uppercase tracking-[0.14em] text-terracotta">
                  Form cannot send yet
                </p>
                <p className="mt-2 font-body text-espresso/75">
                  Submissions are handed to the visitor's mail app, and there is
                  no booking address set in{' '}
                  <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                    src/content/site.json
                  </code>{' '}
                  to send them to, so the button stays disabled. Add one — or
                  wire the form to a real endpoint, as the README describes.
                </p>
              </div>
            </Reveal>
          )}

          {sent && (
            <Reveal delay={80} className="mt-6">
              <div className="rounded-xl border-2 border-marigold bg-marigold/12 p-6">
                <h3 className="font-display text-xl text-espresso">Your mail app should be open</h3>
                <p className="mt-1.5 font-body text-espresso/75">
                  We have pre-filled the enquiry — press send there and it reaches us.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={140} className="mt-8">
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelCls}>
                  Your name <span className="text-terracotta">*</span>
                </label>
                <input id="name" type="text" value={form.name} onChange={update('name')}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined}
                  className={`mt-1.5 ${field}`} placeholder="Name" />
                {errors.name && <p id="err-name" className="mt-1.5 font-body text-sm text-deepred">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="organisation" className={labelCls}>Organisation</label>
                <input id="organisation" type="text" value={form.organisation} onChange={update('organisation')}
                  className={`mt-1.5 ${field}`} placeholder="Festival, company or trust" />
              </div>

              <div>
                <label htmlFor="email" className={labelCls}>
                  Email <span className="text-terracotta">*</span>
                </label>
                <input id="email" type="email" value={form.email} onChange={update('email')}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined}
                  className={`mt-1.5 ${field}`} placeholder="you@example.com" />
                {errors.email && <p id="err-email" className="mt-1.5 font-body text-sm text-deepred">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="eventDate" className={labelCls}>
                  Event date <span className="text-terracotta">*</span>
                </label>
                <input id="eventDate" type="date" value={form.eventDate} onChange={update('eventDate')}
                  aria-invalid={!!errors.eventDate} aria-describedby={errors.eventDate ? 'err-date' : undefined}
                  className={`mt-1.5 ${field}`} />
                {errors.eventDate && <p id="err-date" className="mt-1.5 font-body text-sm text-deepred">{errors.eventDate}</p>}
              </div>

              <div>
                <label htmlFor="venue" className={labelCls}>Venue</label>
                <input id="venue" type="text" value={form.venue} onChange={update('venue')}
                  className={`mt-1.5 ${field}`} placeholder="Where is it being held?" />
              </div>

              <div>
                <label htmlFor="eventType" className={labelCls}>Event type</label>
                <select id="eventType" value={form.eventType} onChange={update('eventType')} className={`mt-1.5 ${field}`}>
                  <option value="">Choose one</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className={labelCls}>
                  About the event <span className="text-terracotta">*</span>
                </label>
                <textarea id="message" rows={5} value={form.message} onChange={update('message')}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-msg' : undefined}
                  className={`mt-1.5 ${field} resize-y`}
                  placeholder="Audience size, how long you would like us to play, anything else we should know." />
                {errors.message && <p id="err-msg" className="mt-1.5 font-body text-sm text-deepred">{errors.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={!to}
                  className="inline-flex items-center gap-2 rounded-full bg-marigold px-7 py-3.5 font-body font-600 text-espresso transition-all duration-200 hover:bg-marigold-light disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-marigold"
                >
                  Send enquiry
                  <IconArrow className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
