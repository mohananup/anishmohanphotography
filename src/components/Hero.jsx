import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { client, urlFor } from '../client';

// Used only until the homePage singleton has an image.
const fallbackImage =
    "https://images.unsplash.com/photo-1530728327726-b504480e42ec?q=100&w=2560&auto=format&fit=crop";

const Hero = () => {
    const [image, setImage] = useState({ desktop: fallbackImage, mobile: fallbackImage });

    useEffect(() => {
        client
            .fetch('*[_type == "homePage"][0]{heroImages}')
            .then((data) => {
                const first = data?.heroImages?.[0];
                if (!first) return;
                setImage({
                    desktop: urlFor(first).width(2560).quality(90).auto('format').url(),
                    mobile: urlFor(first).width(900).height(1200).fit('crop').quality(85).auto('format').url(),
                });
            })
            .catch((err) => console.error('Failed to fetch hero image:', err));
    }, []);

    return (
        <header
            id="home"
            className="relative flex h-svh min-h-[480px] items-end overflow-hidden bg-paper"
        >
            <picture className="absolute inset-0">
                <source media="(max-width: 768px)" srcSet={image.mobile} />
                <img
                    src={image.desktop}
                    alt=""
                    className="h-full w-full object-cover"
                />
            </picture>

            {/* Scrim — keeps the type legible whichever frame sits behind it. */}
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
