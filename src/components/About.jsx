import React from 'react';
import Section from './Section';
import aboutImage from '../assets/misc_images/Anish Mohan.JPG';

/**
 * Plates in the flow — the prose, then the portrait. No min-h-screen, and no
 * stat cards: those numbers were hardcoded in JSX and would have gone stale
 * without anyone noticing.
 */
const About = () => (
    <div id="profile" className="flex flex-col gap-flow">
        <Section
            eyebrow="Behind the lens"
            title={<>Curiosity about the birds in a backyard, and then it wouldn&rsquo;t stop.</>}
            side="l"
        >
            <p className="mb-4 text-muted">
                I&rsquo;m Anish. What began as idle attention to the birds outside my window turned
                into a slow, deliberate pursuit of the natural world &mdash; mostly at the edges of
                the day, when the light is worth waiting for.
            </p>
            <p className="text-muted">
                Much of the work is sitting still until something decides you aren&rsquo;t a threat.
                I photograph in the hope that a single frame can make someone care about an animal
                they will never meet.
            </p>
        </Section>

        <div className="mx-auto w-full max-w-[1100px] px-6">
            <div className="flex justify-end">
                <img
                    src={aboutImage}
                    alt="Anish Mohan in the field"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-auto max-w-[min(var(--spacing-plate),100%)] object-contain md:max-h-plate-tall"
                />
            </div>
        </div>
    </div>
);

export default About;
