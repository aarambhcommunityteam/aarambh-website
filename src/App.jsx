
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Members from './pages/Members';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Builder from './pages/Builder';
import IRDP from './pages/IRDP';
import Founder from './pages/Founder';
import ProductTesting from './pages/ProductTesting';
import ProductTestingStudents from './pages/ProductTestingStudents';
import ProductTestingStartups from './pages/ProductTestingStartups';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />

        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/members" element={<Members />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/irdp" element={<IRDP />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/product-testing" element={<ProductTesting />} />
              <Route path="/product-testing/students" element={<ProductTestingStudents />} />
              <Route path="/product-testing/startups" element={<ProductTestingStartups />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
