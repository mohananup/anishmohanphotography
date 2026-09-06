import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { client, urlFor } from '../client';

// Mirrors the genre list in the portfolio schema. Order only, not a
// whitelist — an unrecognised value still gets a chip, shown last.
const CATEGORY_ORDER = ['Wildlife', 'Sports', 'Street'];

// How many plates the flow shows before asking. Deliberately a button and
// never a scroll trigger: infinite scroll makes the end of the page recede
// as you approach it, so Contact and the footer become unreachable.
const BATCH = 12;

// Widths the srcSet offers. Previously every photograph was requested at
// 1440px, including on a phone, which is roughly four times the pixels a
// 375px screen can use.
//
// sizes puts the desktop case in the media condition and the mobile case in
// the fallback, so a condition that fails to match errs toward the smaller
// image rather than the larger. calc(100vw - 3rem) is the real plate width
// below the breakpoint, where the track carries px-6 either side.
// srcset is comma-separated, and Sanity's crop parameter puts commas inside
// the URL itself (rect=11,0,5989,3376). Unescaped, the browser splits one URL
// into several bogus candidates. Encoding them keeps each entry intact.
const srcsetEntry = (url, px) => `${url.replace(/,/g, '%2C')} ${px}w`;

// Tops out at 2160 so a 720px plate is still fully covered at 3x.
const WIDTHS = [480, 720, 960, 1440, 1920, 2160];

/**
 * The flow.
 *
 * Every photograph obeys two caps and nothing else: landscape frames are
 * capped by width, portrait frames by height, and neither is ever cropped.
 * One constant gap separates them. Plates alternate against the left and
 * right edges of the track, and each caption sits under its frame, aligned
 * to the same edge.
 */
const Gallery = () => {
    const [selected, setSelected] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [limit, setLimit] = useState(BATCH);

    useEffect(() => {
        const query = `*[_type == "portfolio" && defined(image)] | order(order asc, _createdAt desc){
            _id, title, caption, location, date, category,
            "dims": image.asset->metadata.dimensions,
            image
        }`;

        client
            .fetch(query)
            .then((data) => {
                setPhotos(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch portfolio:', err);
                setLoading(false);
            });
    }, []);

    // Escape closes the lightbox.
    const onKeyDown = useCallback((e) => {
        if (e.key === 'Escape') setSelected(null);
    }, []);

    useEffect(() => {
        if (!selected) return;
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selected, onKeyDown]);

    if (loading || photos.length === 0) return null;

    // Chips derive from the categories actually in use, so they appear on
    // their own as photographs get tagged and never need maintaining here.
    // CATEGORY_ORDER only fixes the order; unknown values still show, last.
    const present = new Set(photos.map((p) => p.category).filter(Boolean));
    const categories = [
        ...CATEGORY_ORDER.filter((c) => present.has(c)),
        ...[...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
    ];
    const matching = filter === 'all' ? photos : photos.filter((p) => p.category === filter);
    const shown = matching.slice(0, limit);
    const remaining = matching.length - shown.length;

    const pick = (next) => {
        setFilter(next);
        setLimit(BATCH); // a new filter starts a fresh batch
    };

    return (
        <section id="gallery" className="mx-auto w-full max-w-[1100px] px-6">
            {categories.length > 1 && (
                <div className="mb-flow flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                    {['all', ...categories].map((loc) => (
                        <button
                            key={loc}
                            type="button"
                            onClick={() => pick(loc)}
                            aria-pressed={filter === loc}
                            className={`text-eyebrow rounded-full border px-4 py-2 font-mono uppercase transition-colors ${
                                filter === loc
                                    ? 'border-accent bg-accent text-onaccent'
                                    : 'border-rule text-muted hover:border-muted hover:text-ink'
                            }`}
                        >
                            {loc === 'all' ? 'All' : loc}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-flow">
                {shown.map((photo, i) => {
                    const w = photo.dims?.width;
                    const h = photo.dims?.height;

                    // A definite width is what reserves the space. width/height
                    // attributes only supply the ratio — with width:auto an
                    // image that has not loaded yet collapses to nothing, and
                    // every plate below it shifts when it arrives. Resolve the
                    // display width here from the same two caps the design
                    // uses: landscape by width, portrait by height.
                    const ratio = w && h ? w / h : null;
                    const plateWidth = ratio
                        ? Math.round(ratio >= 1 ? 720 : 630 * ratio)
                        : 720;
                    // Plates alternate edges; the caption sits under the frame
                    // and hugs the same edge, so it reads left-to-right at a
                    // normal size instead of being set vertically beside it.
                    const atStart = i % 2 === 0;
                    const side = atStart ? 'justify-start' : 'justify-end';
                    const capAlign = atStart ? 'text-left' : 'text-right';

                    return (
                        <figure key={photo._id} className={`m-0 flex ${side}`}>
                            <div className="min-w-0 max-w-full">
                                <button
                                    type="button"
                                    onClick={() => setSelected(photo)}
                                    className="block min-w-0 cursor-zoom-in border-0 bg-transparent p-0"
                                    aria-label={`View ${photo.title || 'photograph'} larger`}
                                >
                                    <img
                                        src={urlFor(photo.image).width(1440).quality(90).auto('format').url()}
                                        srcSet={WIDTHS.map((px) =>
                                            srcsetEntry(
                                                urlFor(photo.image).width(px).quality(90).auto('format').url(),
                                                px
                                            )
                                        ).join(', ')}
                                        sizes="(min-width: 768px) 720px, calc(100vw - 3rem)"
                                        alt={photo.image?.alt || photo.title || ''}
                                        width={w}
                                        height={h}
                                        loading={i < 2 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        style={{
                                            width: `${plateWidth}px`,
                                            aspectRatio: ratio ? `${w} / ${h}` : undefined,
                                        }}
                                        className="h-auto max-w-full object-contain"
                                    />
                                </button>

                                <figcaption
                                    className={`mt-4 text-eyebrow font-mono text-muted ${capAlign}`}
                                >
                                    <span className="text-ink">{photo.title}</span>
                                    {photo.location && (
                                        <>
                                            <span aria-hidden="true">{'  ·  '}</span>
                                            <span className="uppercase">{photo.location}</span>
                                        </>
                                    )}
                                </figcaption>
                            </div>
                        </figure>
                    );
                })}
            </div>

            {remaining > 0 && (
                <div className="mt-flow flex justify-center">
                    <button
                        type="button"
                        onClick={() => setLimit(limit + BATCH)}
                        className="text-eyebrow border border-rule px-6 py-3 font-mono uppercase text-muted transition-colors hover:border-accent hover:text-ink"
                    >
                        Load more &middot; {remaining} left
                    </button>
                </div>
            )}

            {selected && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={selected.title || 'Photograph'}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                    onClick={() => setSelected(null)}
                >
                    <button
                        type="button"
                        className="absolute right-5 top-5 text-white/80 hover:text-white"
                        onClick={() => setSelected(null)}
                        aria-label="Close"
                    >
                        <X className="h-7 w-7" />
                    </button>

                    <div
                        className="flex max-h-full w-full max-w-5xl flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={urlFor(selected.image).width(1800).quality(90).auto('format').url()}
                            alt={selected.image?.alt || selected.title || ''}
                            className="max-h-[80vh] max-w-full object-contain"
                        />
                        <div className="mt-5 text-center">
                            <h2 className="text-xl text-white">{selected.title}</h2>
                            {selected.caption && (
                                <p className="mx-auto mt-2 max-w-2xl text-sm text-white/65">
                                    {selected.caption}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
