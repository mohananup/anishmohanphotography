import React from 'react';
import Section from './Section';

const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSf1Ytiun6dpMLa4yf6XJJIdc51s6lkWJXW2oA_tkJwMfjf8Dw/formResponse';

const field =
    'w-full border-0 border-b border-rule bg-transparent py-2 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none';

const details = [
    { label: 'Email', value: 'anish.mohan22@gmail.com', href: 'mailto:anish.mohan22@gmail.com' },
    { label: 'Instagram', value: '@shotbyanishmohan', href: 'https://instagram.com/shotbyanishmohan' },
    { label: 'Based in', value: 'Bangalore, India' },
];

const Contact = () => {
    const [form, setForm] = React.useState({ name: '', email: '', message: '' });
    const [status, setStatus] = React.useState('');

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const data = new FormData();
        data.append('entry.482068227', form.name);
        data.append('entry.1476203373', form.email);
        data.append('entry.1954781396', form.message);

        try {
            await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: data });
            setStatus('success');
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 6000);
        } catch (err) {
            console.error('Form submission error', err);
            setStatus('error');
        }
    };

    return (
        <Section
            id="contact"
            eyebrow="Contact"
            title="Prints, licensing, or a morning in a hide."
            side="r"
        >
                    <dl className="mb-10 flex flex-col gap-2 font-mono text-sm">
                        {details.map((d) => (
                            <div key={d.label} className="flex gap-4">
                                <dt className="w-24 shrink-0 text-muted">{d.label}</dt>
                                <dd className="m-0">
                                    {d.href ? (
                                        <a
                                            href={d.href}
                                            target={d.href.startsWith('http') ? '_blank' : undefined}
                                            rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="navlink text-ink"
                                        >
                                            {d.value}
                                        </a>
                                    ) : (
                                        <span className="text-ink">{d.value}</span>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="name" className="text-eyebrow font-mono uppercase text-muted">
                                Name
                            </label>
                            <input id="name" name="name" type="text" required
                                value={form.name} onChange={change} className={field} />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-eyebrow font-mono uppercase text-muted">
                                Email
                            </label>
                            <input id="email" name="email" type="email" required
                                value={form.email} onChange={change} className={field} />
                        </div>
                        <div>
                            <label htmlFor="message" className="text-eyebrow font-mono uppercase text-muted">
                                Message
                            </label>
                            <textarea id="message" name="message" rows="4" required
                                value={form.message} onChange={change} className={`${field} resize-y`} />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="text-eyebrow mt-1 self-start bg-accent px-6 py-3 font-mono uppercase text-white transition-opacity hover:opacity-85 disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'Sending' : 'Send message'}
                        </button>

                        {status === 'success' && (
                            <p role="status" className="text-sm text-accent">
                                Sent. I&rsquo;ll come back to you shortly.
                            </p>
                        )}
                        {status === 'error' && (
                            <p role="alert" className="text-sm text-red-700">
                                That didn&rsquo;t go through &mdash; please email me directly.
                            </p>
                        )}
                    </form>
        </Section>
    );
};

export default Contact;
