import React from 'react';
import Section from './Section';

/**
 * The bio only. The portrait moved next to the contact details, where the
 * two together make one closing block.
 */
const About = () => (
    <Section
        id="profile"
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
);

export default About;
