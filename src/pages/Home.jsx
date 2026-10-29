import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, pageTransition, scaleIn, hoverScale } from '../utils/animations';
import { supabase } from '../lib/supabaseClient';
import NewsletterForm from '../components/NewsletterForm';
import {
  ArrowRight,
  Calendar,
  Users,
  BookOpen,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Lightbulb,
  Rocket,
  Mail
} from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return;
      
      try {
        // First try to get upcoming and live events
        let { data, error } = await supabase
          .from('events')
          .select('id,title,date,category,status,color,cover_image_url,slug,featured')
          .in('status', ['upcoming', 'live'])
          .order('featured', { ascending: false })
          .order('date', { ascending: true })
          .limit(3);

        // If no upcoming/live events, get completed events as fallback
        if (!error && (!data || data.length === 0)) {
          const result = await supabase
            .from('events')
            .select('id,title,date,category,status,color,cover_image_url,slug,featured')
            .eq('status', 'completed')
            .order('featured', { ascending: false })
            .order('date', { ascending: false })
            .limit(3);
          
          data = result.data;
          error = result.error;
        }

        if (error) throw error;

        const mapped = (data || []).map(event => {
          const statusRaw = String(event.status || '').trim().toLowerCase();
          let normalizedStatus = statusRaw; // Use the status from DB directly

          return {
            id: event.id,
            slug: event.slug || event.id,
            title: event.title || '',
            date: event.date || '',
            category: event.category || 'Event',
            color: event.color || 'from-blue-500 to-cyan-500',
            status: normalizedStatus,
            image: String(event.cover_image_url || '').trim(),
            featured: event.featured || false,
          };
        });

        setEvents(mapped);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const techAreas = [
    {
      title: 'Web Development',
      description: 'HTML5, React.js, Next.js, modern web tech',
      color: 'bg-red-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'AI/ML',
      description: 'Artificial Intelligence, ML models',
      color: 'bg-green-500',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: 'Android',
      description: 'React Native and Flutter',
      color: 'bg-blue-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'Design & Photography',
      description: 'UI/UX design and photography',
      color: 'bg-yellow-500',
      icon: <BookOpen className="w-8 h-8" />
    }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-blue-50/50 via-white to-yellow-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-google-blue/10 to-transparent rounded-full blur-3xl opacity-30 dark:opacity-10" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#9270FF]/10 to-transparent rounded-full blur-3xl opacity-30 dark:opacity-10" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm mb-6"
              >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-google-green"></span>
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    A community for people ready to take their first step
                  </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Welcome to{' '}
                <span className="text-gradient from-[#087BFF] via-[#19C8FF] to-[#9270FF]">
                  AARAMBH Community
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Hyderabad, India
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Explore entrepreneurship, technology, and meaningful connections with people who are taking their first steps.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/events"
                  className="inline-flex items-center px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  Explore Events
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="mailto:aarambh.community.team@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold"
                >
                  Join Community
                </a>
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Illustration */}
           
{/* Right Content - AARAMBH Logo with Rotating Circles */}
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="relative"
>
  <div className="relative mx-auto flex h-[360px] w-full max-w-[560px] items-center justify-center sm:h-[440px]">

    {/* Static orbital rings */}
    <div className="absolute h-[220px] w-[220px] rounded-full border border-[#087BFF]/30 sm:h-[300px] sm:w-[300px]" />

    <div className="absolute h-[280px] w-[280px] rounded-full border border-[#9270FF]/25 sm:h-[370px] sm:w-[370px]" />

    {/* Orbiting blue, cyan and violet circles */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute h-[310px] w-[310px] sm:h-[400px] sm:w-[400px]"
    >
      <span className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-[#19C8FF]/70 shadow-[0_0_28px_rgba(25,200,255,0.4)] sm:h-16 sm:w-16" />

      <span className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#9270FF]/75 shadow-[0_0_28px_rgba(146,112,255,0.4)] sm:h-12 sm:w-12" />

      <span className="absolute bottom-0 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-[#087BFF]/75 shadow-[0_0_28px_rgba(8,123,255,0.4)] sm:h-14 sm:w-14" />

      <span className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#19C8FF]/60 sm:h-10 sm:w-10" />
    </motion.div>

    {/* Center AARAMBH logo */}
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative z-10 flex w-[72%] max-w-[360px] items-center justify-center bg-transparent p-0 shadow-none"
    >
      <img
        src="/assets/aarambh-logo.png"
        alt="AARAMBH — The First Step of Entrepreneurship"
        className="h-auto w-full object-contain drop-shadow-[0_12px_30px_rgba(8,123,255,0.16)]"
      />
    </motion.div>

  </div>
</motion.div>

          </div>
        </div>

      </section>

      {/* Explore Our Events */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Our <span className="text-google-blue">Events</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Bringing together aspiring founders, curious minds, and future innovators to grow together.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          >
            {events.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
              >
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                  className="relative overflow-hidden rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer group h-full"
                >
                {/* Image Section with Better Overlay */}
                <div className="h-64 relative overflow-hidden">
                  {event.image ? (
                    <>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                    </>
                  ) : (
                    <div className={`flex absolute inset-0 bg-gradient-to-br ${event.color} p-6 flex-col justify-end`}>
                       <motion.div 
                         initial={{ rotate: 0 }}
                         whileHover={{ rotate: 10, scale: 1.1 }}
                         className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4"
                       >
                            <Calendar size={80} className="text-white" />
                       </motion.div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-xs font-bold backdrop-blur-md px-4 py-2 rounded-full border shadow-lg ${
                      event.status === 'upcoming' 
                        ? 'bg-blue-500/95 border-blue-400/50 text-white'
                        : event.status === 'live' 
                        ? 'bg-green-500/95 border-green-400/50 text-white animate-pulse' 
                        : 'bg-gray-500/95 border-gray-400/50 text-white'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/30">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-google-blue transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-semibold text-google-blue group-hover:underline">
                      View Details
                    </span>
                    <ArrowRight className="w-5 h-5 text-google-blue transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Animated Bottom Border */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${event.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </motion.div>
              </Link>
            ))}
          </motion.div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side — About AARAMBH */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Us
              </h2>

              <h3 className="text-2xl font-semibold text-google-blue mb-4">
                Empowering the next generation to explore ideas, embrace technology, and take their first step into entrepreneurship.
              </h3>

              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  AARAMBH is a student-led community built to connect aspiring entrepreneurs, students, founders, mentors, and innovators. We aim to make entrepreneurship and technology more accessible through learning, collaboration, and meaningful opportunities.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-google-blue mr-2">📍</span>
                    <span>
                      <strong>Based in:</strong> Hyderabad, India
                    </span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-google-green mr-2">🤝</span>
                    <span>
                      <strong>Our Community:</strong> Students, aspiring founders, creators, mentors, and innovators
                    </span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-google-red mr-2">🎯</span>
                    <span>
                      <strong>Our Mission:</strong> Help people discover ideas, develop practical skills, build connections, and take their first step towards entrepreneurship.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Side — Four Core Pillars */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {/* Ideas */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-google-blue">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ideas
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Explore entrepreneurship, discover possibilities, and turn curiosity into ideas worth pursuing.
                </p>
              </motion.div>

              {/* Community */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-500">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Community
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Connect with students, founders, mentors, and innovators who want to grow together.
                </p>
              </motion.div>

              {/* Learning */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-cyan-500">
                  <Code2 className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Learning
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Explore AI, technology, and practical skills that help transform knowledge into action.
                </p>
              </motion.div>

              {/* Opportunities */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-amber-500">
                  <Rocket className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Opportunities
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Discover ways to collaborate, participate, build projects, and take your next step.
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
{/* AARAMBH Ecosystem Benefits */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto">
    {/* Section Heading */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-google-blue mb-3">
        The AARAMBH Advantage
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        One Ecosystem. Three Opportunities.
      </h2>

      <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
        Connecting students, educational institutions, and startups to
        create opportunities, encourage innovation, and grow together.
      </p>
    </motion.div>

    {/* Three Benefit Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Students */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-7 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-google-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="bg-google-blue w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
          <Users size={30} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
          For Students
        </h3>

        <p className="text-sm font-medium text-google-blue mb-5">
          Learn. Build. Lead.
        </p>

        <ul className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <li>• Explore entrepreneurship, AI, and emerging technologies.</li>
          <li>• Discover hackathons, internships, and learning opportunities.</li>
          <li>• Connect with founders, mentors, and fellow innovators.</li>
          <li>• Turn ideas into practical projects and potential ventures.</li>
        </ul>
      </motion.div>

      {/* Educational Institutions */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-7 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-google-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
<div className="bg-gradient-to-br from-violet-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
        
          <BookOpen size={30} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-400 transition-colors">
          For Institutions
        </h3>

        <p className="text-sm font-medium text-purple-600 dark:text-purple-300 mb-5">
  Engage. Innovate. Empower.
</p>

        <ul className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <li>• Connect students with startups and industry professionals.</li>
          <li>• Organize workshops, awareness sessions, and innovation activities.</li>
          <li>• Showcase student projects, talent, and achievements.</li>
          <li>• Strengthen entrepreneurship culture and external collaborations.</li>
        </ul>
      </motion.div>

      {/* Startups */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-7 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="bg-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
          <Rocket size={30} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-500 transition-colors">
          For Startups
        </h3>

        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-5">
          Connect. Grow. Scale.
        </p>

        <ul className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <li>• Reach student talent for internships and potential recruitment.</li>
          <li>• Build brand visibility across college communities.</li>
          <li>• Discover potential users, feedback, and early adopters.</li>
          <li>• Explore campus partnerships, collaborations, and sponsored outreach.</li>
        </ul>
      </motion.div>

    </div>
          {/* AARAMBH Newsletter */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#087BFF]/30 bg-[#087BFF]/15">
            <Mail className="h-7 w-7 text-[#19C8FF]" />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#19C8FF]">
            The AARAMBH Newsletter
          </p>

          <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Stay Ahead of the Curve.
          </h2>

          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-gray-300">
            Discover startup insights, technology updates, upcoming events,
            and opportunities for your next big step — straight to your inbox.
          </p>

          <NewsletterForm />

          <p className="mt-5 text-xs text-gray-400">
            Useful updates only. Unsubscribe whenever you wish.
          </p>
        </div>
      </section>
  </div>
</section>

    </motion.div>
  );
};

export default Home;