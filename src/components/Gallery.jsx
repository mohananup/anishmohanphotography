import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { client, urlFor } from '../client';

/**
 * The flow.
 *
 * Every photograph obeys two caps and nothing else: landscape frames are
 * capped by width, portrait frames by height, and neither is ever cropped.
 * One constant gap separates them. Plates alternate against the left and
 * right edges of the track, which opens a gutter for the caption rail.
 */
const Gallery = () => {
    const [selected, setSelected] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const query = `*[_type == "portfolio" && defined(image)] | order(order asc, _createdAt desc){
            _id, title, caption, location, date,
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

    return (
        <section id="gallery" className="mx-auto w-full max-w-[1100px] px-6 pt-flow">
            <div className="flex flex-col gap-flow">
                {photos.map((photo, i) => {
                    const w = photo.dims?.width;
                    const h = photo.dims?.height;
                    const side = i % 2 === 0 ? 'justify-start' : 'justify-end';

                    return (
                        <figure key={photo._id} className={`m-0 flex ${side}`}>
                            <div className="flex min-w-0 max-w-full flex-col gap-3 md:flex-row md:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelected(photo)}
                                    className="min-w-0 cursor-zoom-in border-0 bg-transparent p-0"
                                    aria-label={`View ${photo.title || 'photograph'} larger`}
                                >
                                    <img
                                        src={urlFor(photo.image).width(1440).quality(85).auto('format').url()}
                                        alt={photo.image?.alt || photo.title || ''}
                                        width={w}
                                        height={h}
                                        loading={i < 2 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className="h-auto w-auto max-w-plate object-contain md:max-h-plate-tall"
                                    />
                                </button>

                                <figcaption className="rail text-eyebrow font-mono text-muted">
                                    <span className="text-ink">{photo.title}</span>
                                    {photo.location && (
                                        <>
                                            <span aria-hidden="true">{'  ·  '}</span>
                                            <span className="uppercase">{photo.location}</span>
                                        </>
                                    )}
                                    {photo.date && (
                                        <>
                                            <span aria-hidden="true">{'  ·  '}</span>
                                            <span>{new Date(photo.date).getFullYear()}</span>
                                        </>
                                    )}
                                </figcaption>
                            </div>
                        </figure>
                    );
                })}
            </div>

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
