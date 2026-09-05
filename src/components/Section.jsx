import React from 'react';

/**
 * A text plate in the flow.
 *
 * Photographs and prose share one track and one gap, so this owns the
 * repeated part: the track width, which edge the plate sits against, and
 * the eyebrow/heading pair. A spacing change is a one-file edit.
 */
const Section = ({ id, eyebrow, title, side = 'l', className = '', children }) => (
    <section
        id={id}
        className={`mx-auto w-full max-w-[1100px] px-6 ${className}`}
    >
        <div className={`flex ${side === 'r' ? 'justify-end' : 'justify-start'}`}>
            <div className="w-full max-w-[34rem]">
                {eyebrow && (
                    <p className="text-eyebrow mb-4 font-mono uppercase text-accent">
                        {eyebrow}
                    </p>
                )}
                {title && <h2 className="text-section mb-4 text-ink">{title}</h2>}
                {children}
            </div>
        </div>
    </section>
);

export default Section;
