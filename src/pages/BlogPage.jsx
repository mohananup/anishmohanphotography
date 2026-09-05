import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from '../client';

const POSTS_PER_PAGE = 3;

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = (start, end) => {
        const query = `{
            "posts": *[_type == "blogPost"] | order(publishedAt desc) [${start}...${end}],
            "total": count(*[_type == "blogPost"])
        }`;

        return client.fetch(query);
    };

    useEffect(() => {
        fetchPosts(0, POSTS_PER_PAGE)
            .then((data) => {
                setPosts(data.posts);
                setTotalPosts(data.total);
                setLoadedCount(data.posts.length);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleLoadMore = () => {
        setLoadingMore(true);
        const start = loadedCount;
        const end = loadedCount + POSTS_PER_PAGE;

        fetchPosts(start, end)
            .then((data) => {
                setPosts([...posts, ...data.posts]);
                setLoadedCount(loadedCount + data.posts.length);
                setLoadingMore(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadingMore(false);
            });
    };

    // Custom components for Portable Text
    const components = {
        types: {
            image: ({ value }) => {
                if (!value?.asset?._ref) {
                    return null;
                }
                return (
                    <img
                        src={urlFor(value).width(800).fit('max').auto('format').url()}
                        alt={value.alt || 'Blog Image'}
                        className="w-full h-auto rounded-lg my-8"
                    />
                );
            },
        },
        block: {
            h3: ({ children }) => <h3 className="text-2xl font-serif text-nature-50 mt-8 mb-4">{children}</h3>,
            h4: ({ children }) => <h4 className="text-xl font-serif text-nature-50 mt-6 mb-3">{children}</h4>,
            normal: ({ children }) => <p className="text-nature-300 leading-relaxed mb-4 text-lg">{children}</p>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-nature-500 pl-4 italic text-nature-200 my-6">{children}</blockquote>,
        },
    };

    if (loading) return <div className="pt-28 px-4 text-center text-nature-50">Loading...</div>;
    if (error) return <div className="pt-28 px-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="pt-28 px-4 sm:px-6 lg:px-8 bg-nature-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-serif text-nature-50 mb-20 text-center"
                >
                    Blog
                </motion.h1>

                <div className="space-y-32">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="border-b border-nature-800 pb-20 last:border-0"
                        >
                            <header className="mb-8 text-center">
                                <h2 className="text-3xl md:text-4xl font-serif text-nature-50 mb-4 leading-tight">
                                    {post.title}
                                </h2>
                                <div className="text-nature-400 font-light">
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unpublished'}
                                </div>
                            </header>

                            {post.coverImage && (
                                <div className="mb-12 overflow-hidden rounded-lg shadow-xl">
                                    <img
                                        src={urlFor(post.coverImage).width(1200).height(800).url()}
                                        alt={post.title}
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            <div className="prose prose-invert prose-lg max-w-none">
                                {post.content && (
                                    <PortableText value={post.content} components={components} />
                                )}
                            </div>

                            {/* Gallery Grid if present */}
                            {post.gallery && post.gallery.length > 0 && (
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {post.gallery.map((image, idx) => (
                                        <img
                                            key={image._key || idx}
                                            src={urlFor(image).width(600).height(400).url()}
                                            alt={`Gallery image ${idx + 1}`}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>

                {loadedCount < totalPosts && (
                    <div className="py-20 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-8 py-3 border border-nature-50 text-nature-50 hover:bg-nature-50 hover:text-nature-950 transition-colors duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingMore ? 'Loading...' : 'Load More Stories'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
