import React, { useState } from 'react';
import API from '../api';
import { motion } from 'framer-motion';

function Chatbot() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await API.post('/chat', { query });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer(err.response?.data?.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <motion.div
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      className="relative min-h-screen p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex justify-center items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Radial mouse spotlight */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(56,_182,_255,_0.15)_0%,_transparent_70%)] pointer-events-none"
        style={{
          '--mouse-x': `${mousePos.x}px`,
          '--mouse-y': `${mousePos.y}px`,
          transition: 'background 0.2s ease',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-white drop-shadow">🤖 Ask the Chatbot</h2>

        <textarea
          rows={3}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type your question about students or attendance..."
          className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-blue-300 border border-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow"
        />

        <motion.button
          onClick={handleAsk}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-cyan-400/30 transition-all disabled:opacity-60"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? '🤔 Thinking...' : '💬 Ask'}
        </motion.button>

        {answer && (
          <motion.div
            className="bg-blue-900/40 text-blue-100 border border-blue-700/50 p-4 rounded-xl whitespace-pre-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {answer}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Chatbot;
