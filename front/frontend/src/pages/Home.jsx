import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HelpMenu from "../components/HelpMenu";

const Home = () => {
  // Background gradient animation effect
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;
      
      document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
      document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHover = {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-95">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(56,_182,_255,_0.2)_0%,_transparent_70%)]"
          style={{ 
            transition: 'background 0.5s ease-out',
            pointerEvents: 'none'
          }}
        />
      </div>
      <HelpMenu />


      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center space-y-6 mb-16" variants={itemVariants}>
          <motion.h1 
            className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Face Recognition Platform
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Advanced facial recognition with real-time processing and AI-powered features
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link to="/register">
              <motion.div 
                className="group relative block bg-gradient-to-br from-blue-800/50 to-indigo-900/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-700/30 hover:border-cyan-400/50"
                whileHover={cardHover}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-blue-900/50 rounded-full text-cyan-300 group-hover:bg-blue-800/70 transition-all duration-500 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Register Faces
                  </h2>
                  <p className="text-blue-100/80">
                    Capture and register new faces with names for recognition
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                    Get Started
                  </button>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-blue-500/20 group-hover:border-cyan-400/40 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/attendance">
              <motion.div 
                className="group relative block bg-gradient-to-br from-blue-800/50 to-indigo-900/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-700/30 hover:border-cyan-400/50"
                whileHover={cardHover}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-blue-900/50 rounded-full text-cyan-300 group-hover:bg-blue-800/70 transition-all duration-500 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Live Recognition
                  </h2>
                  <p className="text-blue-100/80">
                    Real-time face recognition from your webcam feed
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                    Start Recognizing
                  </button>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-blue-500/20 group-hover:border-cyan-400/40 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/chatbot">
              <motion.div 
                className="group relative block bg-gradient-to-br from-blue-800/50 to-indigo-900/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-700/30 hover:border-cyan-400/50"
                whileHover={cardHover}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-blue-900/50 rounded-full text-cyan-300 group-hover:bg-blue-800/70 transition-all duration-500 group-hover:rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Face Query Chat
                  </h2>
                  <p className="text-blue-100/80">
                    Ask questions about registered faces using natural language
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                    Start Chatting
                  </button>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-blue-500/20 group-hover:border-cyan-400/40 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 text-center text-blue-200/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p>Ensure your webcam is connected and permissions are granted</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;