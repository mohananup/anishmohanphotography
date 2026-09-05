import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logo from '../assets/logo.png';

const navLinks = [
    { name: 'Work', path: '#gallery' },
    { name: 'Profile', path: '#profile' },
    { name: 'Projects', path: '/projects' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Journal', path: '/blog' },
    { name: 'Contact', path: '#contact' },
];

const BAR_HEIGHT = 56;

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === '/';
    // Over the hero photograph the bar is transparent with light type;
    // once scrolled (or on any inner page) it sits on the paper ground.
    const onPhoto = isHome && !scrolled;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => scrollToHash(path), 300);
        } else {
            setTimeout(() => scrollToHash(path), isOpen ? 300 : 0);
        }
    };

    const isActive = (path) =>
        path.startsWith('/') && location.pathname === path;

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
                    className="flex items-center"
                    aria-label="Anish Mohan Photography — home"
                >
                    <img
                        src={logo}
                        alt=""
                        className={`h-9 w-auto object-contain ${onPhoto ? 'brightness-0 invert' : ''}`}
                    />
                </a>

                <div className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            onClick={(e) => handleNavigation(e, link.path)}
                            aria-current={isActive(link.path) ? 'page' : undefined}
                            className={`text-eyebrow border-b font-mono uppercase transition-colors ${
                                onPhoto
                                    ? 'border-transparent text-white/75 hover:text-white'
                                    : isActive(link.path)
                                        ? 'border-accent text-ink'
                                        : 'border-transparent text-muted hover:text-ink'
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
                    <div className="flex flex-col gap-4 px-6 py-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                onClick={(e) => handleNavigation(e, link.path)}
                                className="text-eyebrow font-mono uppercase text-ink"
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
