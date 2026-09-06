import React from 'react';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Contact from '../components/Contact';

/**
 * One page, one rhythm. Photographs and text alike are plates in a single
 * vertical flow separated by one constant gap.
 */
const Home = () => (
    <>
        <Hero />
        <div className="flex flex-col gap-flow pt-16 pb-flow">
            <Gallery />
            <About />
            <Contact />
        </div>
    </>
);

export default Home;
