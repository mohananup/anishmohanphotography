import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logoMark from '../assets/logo-mark.png';

const navLinks = [
    { name: 'Work', path: '#gallery' },
    { name: 'Journal', path: '/blog' },
    { name: 'Contact', path: '#contact' },
];

const BAR_HEIGHT = 56;
const sectionIds = navLinks
    .filter((l) => l.path.startsWith('#'))
    .map((l) => l.path.slice(1));

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === '/';
    const onPhoto = isHome && !scrolled;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll-spy: the active section is the last one whose top has passed
    // under the bar. Computed from positions on every scroll rather than
    // from IntersectionObserver callbacks — the observer only reported
    // sections *entering*, so scrolling back up out of Contact left the
    // underline stuck there until another section happened to enter.
    useEffect(() => {
        if (!isHome) return;

        let frame = 0;

        const compute = () => {
            const line = BAR_HEIGHT + 8;
            let current = null;
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            setActiveSection(current);
        };

        // Three getBoundingClientRect reads per scroll event — cheap enough
        // that rAF throttling only added a failure mode (rAF is paused in a
        // background tab, so the underline would go stale there).
        const onScroll = compute;

        // Deferred rather than called here, so the first paint is not a
        // synchronous setState inside the effect body.
        frame = requestAnimationFrame(compute);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [isHome, location.pathname]);

    const scrollToHash = (hash) => {
        const el = document.querySelector(hash);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - BAR_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const handleNavigation = (e, path) => {
        e.preventDefault();
        setIsOpen(false);

        if (!path.startsWith('#')) {
            navigate(path);
            window.scrollTo(0, 0);
            return;
        }

        setActiveSection(path.slice(1));

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => scrollToHash(path), 300);
        } else {
            setTimeout(() => scrollToHash(path), isOpen ? 300 : 0);
        }
    };

    const isActive = (path) =>
        path.startsWith('/')
            ? location.pathname === path
            : isHome && activeSection === path.slice(1);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300 ${
                onPhoto
                    ? 'bg-gradient-to-b from-black/45 to-transparent'
                    : 'border-b border-rule bg-paper/85 backdrop-blur-md'
            }`}
        >
            <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
                <a
                    href="/"
                    onClick={(e) => handleNavigation(e, '#home')}
                    className="flex items-center gap-2.5"
                    aria-label="Anish Mohan Photography — home"
                >
                    <img
                        src={logoMark}
                        alt=""
                        className={`logo-mark h-7 w-auto shrink-0 object-contain ${onPhoto ? 'is-onphoto' : ''}`}
                    />
                    <span
                        className={`text-eyebrow hidden shrink-0 font-mono uppercase sm:block ${
                            onPhoto ? 'text-white' : 'text-ink'
                        }`}
                    >
                        Anish Mohan Photography
                    </span>
                </a>

                <div className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            onClick={(e) => handleNavigation(e, link.path)}
                            aria-current={isActive(link.path) ? 'page' : undefined}
                            className={`navlink text-eyebrow font-mono uppercase ${
                                onPhoto ? 'navlink-onphoto' : 'text-muted'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    className={`md:hidden ${onPhoto ? 'text-white' : 'text-ink'}`}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {isOpen && (
                <div className="border-b border-rule bg-paper md:hidden">
                    <div className="flex flex-col items-start gap-4 px-6 py-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                onClick={(e) => handleNavigation(e, link.path)}
                                aria-current={isActive(link.path) ? 'page' : undefined}
                                className="navlink text-eyebrow font-mono uppercase text-muted"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
