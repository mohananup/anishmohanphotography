import React from 'react';
import { MessageCircle } from 'lucide-react';
import Section from './Section';

// Country code + number, digits only — the format wa.me requires.
const WHATSAPP_NUMBER = '919845845842';
// Names the site, since a WhatsApp message arrives with no other context
// about where the person came from, then opens on a dash so the cursor
// lands mid-thought rather than after a full stop. Deliberately does not
// name a subject: these are general enquiries, not print orders.
const WHATSAPP_TEXT = 'Hi Anish, I came across your photography site \u2014';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const details = [
    { label: 'Email', value: 'anish.mohan22@gmail.com', href: 'mailto:anish.mohan22@gmail.com' },
    { label: 'Instagram', value: '@shotbyanishmohan', href: 'https://instagram.com/shotbyanishmohan' },
    { label: 'Based in', value: 'Bangalore, India' },
];

const Contact = () => (
    <Section
        id="contact"
        eyebrow="Contact"
        title="Say hello."
        side="r"
    >
        <p className="mb-8 text-muted">
            Questions about the work, where a frame was made, or anything else
            &mdash; WhatsApp is the quickest way to reach me.
        </p>

        <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-eyebrow inline-flex items-center gap-2.5 bg-accent px-6 py-4 font-mono uppercase text-onaccent transition-opacity hover:opacity-85"
        >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Message on WhatsApp
        </a>

        <dl className="mt-10 flex flex-col gap-2 font-mono text-sm">
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
    </Section>
);

export default Contact;
