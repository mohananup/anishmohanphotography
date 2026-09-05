import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { client, urlFor } from '../client';
import { X } from 'lucide-react';

const PortfolioPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        // Fetching 'portfolio' type.
        const query = '*[_type == "portfolio"] | order(_createdAt desc)';
        client.fetch(query)
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="pt-28 px-4 text-center text-nature-50">Loading...</div>;
    if (error) return <div className="pt-28 px-4 text-center text-red-600">Error: {error}. Please check your Sanity CORS settings.</div>;

    return (
        <div className="pt-28 px-4 sm:px-6 lg:px-8 bg-nature-950 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-serif text-nature-50 mb-12 text-center"
                >
                    Portfolio
                </motion.h1>

                {/* Dynamic Centered Layout */}
                <div className="flex flex-wrap justify-center gap-8">
                    {projects.map((project) => (
                        <motion.div
                            key={project._id}
                            layoutId={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedProject(project)}
                            className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] max-w-md"
                        >
                            {project.image && (
                                <img
                                    src={urlFor(project.image).width(600).height(400).url()}
                                    alt={project.title}
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col p-4 text-center">
                                <h2 className="text-white text-xl font-serif mb-2">{project.title}</h2>
                                <p className="text-white/80 text-sm">Click to view</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            layoutId={selectedProject._id}
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedProject.image && (
                                <img
                                    src={urlFor(selectedProject.image).width(1200).url()}
                                    alt={selectedProject.title}
                                    className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
                                />
                            )}
                            <div className="mt-4 text-center">
                                <h2 className="text-white text-2xl font-serif mb-2">{selectedProject.title}</h2>
                                {selectedProject.caption && (
                                    <p className="text-nature-200 max-w-2xl mx-auto">{selectedProject.caption}</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioPage;
