import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GoatCounter from './components/GoatCounter';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <GoatCounter />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
