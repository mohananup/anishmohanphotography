import React from 'react';
import { MessageCircle } from 'lucide-react';
import portrait from '../assets/misc_images/Anish Mohan.JPG';

// Country code + number, digits only — the format wa.me requires.
const WHATSAPP_NUMBER = '919845845842';
// Names the site, since a WhatsApp message arrives with no other context
// about where the person came from, then opens on a dash so the cursor
// lands mid-thought rather than after a full stop.
const WHATSAPP_TEXT = 'Hi Anish, I came across your photography site —';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const details = [
    { label: 'Email', value: 'anish.mohan22@gmail.com', href: 'mailto:anish.mohan22@gmail.com' },
    { label: 'Instagram', value: '@shotbyanishmohan', href: 'https://instagram.com/shotbyanishmohan' },
    { label: 'Based in', value: 'Bangalore, India' },
];

/**
 * The closing block: the way to reach him, with the portrait beside it.
 * One nav link covers both honestly — you see the person at the same moment
 * you see how to message him — and the bio sits directly above.
 *
 * Text on the left, portrait on the right: the bio above is also a
 * left-aligned plate, so the prose runs down one continuous column and the
 * portrait closes the page on the right, where the flow's plates alternate
 * to anyway.
 */
const Contact = () => (
    <section id="contact" className="mx-auto w-full max-w-[1100px] px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-16">
            <div className="w-full max-w-[34rem]">
                <p className="text-eyebrow mb-4 font-mono uppercase text-accent">Contact</p>
                <h2 className="text-section mb-4 text-ink">Say hello.</h2>

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
            </div>

            <div className="min-w-0 shrink-0">
                <img
                    src={portrait}
                    alt="Anish Mohan in the field"
                    width={3000}
                    height={4000}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] h-auto w-[400px] max-w-full object-cover"
                />
            </div>
        </div>
    </section>
);

export default Contact;
