import React from 'react';

// Kept in step with Contact.jsx. On the home page the footer sits just
// below the contact block, so these repeat — but the footer is the only
// way to reach him from a journal post, and it is where people look.
const WHATSAPP_URL = `https://wa.me/919845845842?text=${encodeURIComponent(
    'Hi Anish, I came across your photography site —'
)}`;

const links = [
    { label: 'WhatsApp', href: WHATSAPP_URL },
    { label: '@shotbyanishmohan', href: 'https://instagram.com/shotbyanishmohan' },
    { label: 'Email', href: 'mailto:anish.mohan22@gmail.com' },
];

const Footer = () => (
    <footer className="mt-flow border-t border-rule">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-7 text-eyebrow font-mono uppercase text-muted">
            <span>&copy; {new Date().getFullYear()} Anish Mohan Photography</span>

            <div className="flex flex-wrap gap-x-7 gap-y-3">
                {links.map((l) => (
                    <a
                        key={l.label}
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="navlink"
                    >
                        {l.label}
                    </a>
                ))}
            </div>
        </div>
    </footer>
);

export default Footer;
