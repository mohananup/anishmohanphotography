import React from 'react';

const Footer = () => (
    <footer className="mt-flow border-t border-rule">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-7 text-eyebrow font-mono uppercase text-muted">
            <span>&copy; {new Date().getFullYear()} Anish Mohan Photography</span>

            <div className="flex flex-wrap gap-x-7 gap-y-3">
                <a
                    href="https://instagram.com/shotbyanishmohan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navlink"
                >
                    @shotbyanishmohan
                </a>
                <a href="mailto:anish.mohan22@gmail.com" className="navlink">
                    Email
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
