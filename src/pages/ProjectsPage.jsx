import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { client, urlFor } from '../client';
import { X, MapPin, Calendar } from 'lucide-react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const query = '*[_type == "project"] | order(date desc)';
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
                    Projects
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <motion.div
                            key={project._id}
                            layoutId={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedProject(project)}
                            className="bg-nature-900/50 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
                        >
                            {project.coverImage && (
                                <div className="overflow-hidden h-64">
                                    <img
                                        src={urlFor(project.coverImage).width(800).height(600).url()}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-serif text-nature-50 mb-2">{project.title}</h2>
                                <p className="text-nature-200 mb-4 line-clamp-3">{project.shortDescription}</p>
                                <div className="flex items-center gap-4 text-sm text-nature-300">
                                    {project.date && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>{project.date}</span>
                                        </div>
                                    )}
                                    {project.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{project.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 overflow-y-auto"
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="fixed top-4 right-4 z-50 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full"
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            layoutId={selectedProject._id}
                            className="relative w-full max-w-6xl my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-nature-900 rounded-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <div className="mb-8 text-center">
                                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">{selectedProject.title}</h2>
                                    <p className="text-nature-200 max-w-3xl mx-auto text-lg leading-relaxed">
                                        {selectedProject.shortDescription}
                                    </p>
                                    <div className="flex justify-center gap-6 mt-4 text-nature-300">
                                        {selectedProject.date && (
                                            <div className="flex items-center gap-2">
                                                <Calendar size={20} />
                                                <span>{selectedProject.date}</span>
                                            </div>
                                        )}
                                        {selectedProject.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={20} />
                                                <span>{selectedProject.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {selectedProject.gallery?.map((image, index) => (
                                        <div key={index} className="rounded-lg overflow-hidden shadow-2xl">
                                            <img
                                                src={urlFor(image).width(1200).url()}
                                                alt={`${selectedProject.title} - ${index + 1}`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    ))}
                                    {(!selectedProject.gallery || selectedProject.gallery.length === 0) && (
                                        <div className="text-center text-nature-400 py-12">
                                            No additional images in gallery.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsPage;
