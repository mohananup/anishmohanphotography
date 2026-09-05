import React from 'react';

/**
 * One wrapper for every band on the page — photographs and text alike.
 *
 * The whole site is a single vertical flow of "plates" separated by one
 * constant gap. This component owns that rhythm so a spacing change is a
 * one-file edit rather than a six-file sweep.
 *
 * Props:
 *   eyebrow  small uppercase label above the heading
 *   title    section heading, rendered in the display face
 *   side     'l' | 'r' — which edge of the track the plate sits against
 *   as       element to render as (default 'section')
 */
const Section = ({
    id,
    eyebrow,
    title,
    side = 'l',
    as: Tag = 'section',
    className = '',
    children,
}) => {
    const align = side === 'r' ? 'justify-end' : 'justify-start';

    return (
        <Tag id={id} className={`flex ${align} ${className}`}>
            <div className="min-w-0 max-w-[34rem]">
                {eyebrow && (
                    <p className="font-mono text-eyebrow uppercase text-accent mb-4">
                        {eyebrow}
                    </p>
                )}
                {title && (
                    <h2 className="text-section text-ink mb-4">{title}</h2>
                )}
                {children}
            </div>
        </Tag>
    );
};

export default Section;
