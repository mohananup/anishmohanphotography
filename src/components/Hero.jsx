import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { client, urlFor } from '../client';

// Slow enough to read as a considered change rather than a distraction —
// the original ran every 5s, which registers as movement more than as a
// photograph.
const INTERVAL = 9000;

// The hero is full-bleed, so it needs the viewport width times the display's
// pixel ratio. A single 2560 file covered only 86% of a 1512pt screen at 2x
// and less on a 16-inch, which shows as softness. A srcSet lets a phone take
// a small file and a Retina desktop take a large one.
// srcset is comma-separated, and Sanity's crop parameter puts commas inside
// the URL itself (rect=11,0,5989,3376). Unescaped, the browser splits one URL
// into several bogus candidates. Encoding them keeps each entry intact.
const srcsetEntry = (url, px) => `${url.replace(/,/g, '%2C')} ${px}w`;

const HERO_WIDTHS = [1280, 1920, 2560, 3200, 3840];

const Hero = () => {
    // No placeholder photograph. The original shipped a stock image from
    // Unsplash as a fallback, so every page load showed a stranger's
    // photograph in the hero of a photographer's site until Sanity answered.
    const [frames, setFrames] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        client
            .fetch(
                '*[_type == "homePage"][0]{heroImages[]{..., "lqip": asset->metadata.lqip}}'
            )
            .then((data) => {
                const images = data?.heroImages;
                if (!images?.length) return;
                setFrames(
                    images.map((img) => ({
                        lqip: img.lqip,
                        desktop: urlFor(img).width(2560).quality(90).auto('format').url(),
                        srcSet: HERO_WIDTHS.map((px) =>
                            srcsetEntry(urlFor(img).width(px).quality(90).auto('format').url(), px)
                        ).join(', '),
                        // Art-directed rather than object-cover: a 16:9 frame
                        // cropped to a tall phone loses most of its width, so
                        // the mobile variant is cut to the hotspot instead.
                        mobile: urlFor(img).width(1200).height(1800).fit('crop').quality(90).auto('format').url(),
                    }))
                );
            })
            .catch((err) => console.error('Failed to fetch hero images:', err));
    }, []);

    useEffect(() => {
        if (frames.length <= 1) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const id = setInterval(() => {
            // Nothing to see in a background tab, and advancing there only
            // burns battery and data.
            if (document.hidden) return;
            setIndex((i) => (i + 1) % frames.length);
        }, INTERVAL);

        return () => clearInterval(id);
    }, [frames.length]);

    return (
        <header
            id="home"
            className="relative flex h-svh min-h-[480px] items-end overflow-hidden bg-[#14160e]"
        >
            {frames.map((frame, i) => (
                <picture key={frame.desktop} aria-hidden={i !== index}>
                    {frame.lqip && (
                        <span
                            aria-hidden="true"
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ${
                                i === index ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url(${frame.lqip})` }}
                        />
                    )}
                    <source media="(max-width: 767px)" srcSet={frame.mobile} />
                    <img
                        src={frame.desktop}
                        srcSet={frame.srcSet}
                        sizes="100vw"
                        alt=""
                        // Only the opening frame is needed at load; the rest
                        // arrive during the first interval.
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : 'low'}
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
                            i === index ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                </picture>
            ))}

            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, rgba(8,10,6,0.74) 0%, rgba(8,10,6,0.28) 40%, rgba(8,10,6,0) 70%)',
                }}
            />

            <div className="relative mx-auto w-full max-w-[1100px] px-6 pb-12">
                {/* Stacked the way the logo lockup stacks it, so the full
                    business name reads at display size without wrapping by
                    accident. */}
                <h1 className="text-display mb-3 text-[#F4F5EE]">
                    Anish Mohan <span className="block">Photography</span>
                </h1>
                <p className="text-eyebrow font-mono uppercase text-[#F4F5EE]/80">
                    Wildlife &amp; street &middot; Bangalore, India
                </p>
            </div>

            {/* Nothing peeks above the fold at full height, so the cue does the
                work the visible content used to. Sits right, clear of the name. */}
            <div className="pointer-events-none absolute bottom-8 right-6 text-[#F4F5EE]/60 motion-safe:animate-bounce">
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </div>
        </header>
    );
};

export default Hero;
