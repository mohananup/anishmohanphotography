import React, { useState, useEffect } from 'react';
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
            className="relative flex h-[78vh] min-h-[420px] items-end overflow-hidden bg-paper"
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
                <h1 className="text-display mb-3 text-[#F4F5EE]">Anish Mohan</h1>
                <p className="text-eyebrow font-mono uppercase text-[#F4F5EE]/80">
                    Wildlife photography &mdash; Western Ghats &amp; beyond
                </p>
            </div>
        </header>
    );
};

export default Hero;
