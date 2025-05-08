import React, { useState, useEffect } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import { motion, AnimatePresence } from 'framer-motion';

function HelpMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.help-menu')) setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="help-menu absolute top-4 right-6 z-50">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-white font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg"
      >
        Help ▼
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-blue-900/90 border border-cyan-400/30 backdrop-blur-lg text-white"
          >
            <div
              onClick={() => { setShowChange(true); setShowDropdown(false); }}
              className="px-4 py-3 cursor-pointer hover:bg-blue-800/70 border-b border-cyan-300/20"
            >
              Change Password
            </div>
            <div
              onClick={() => { setShowContact(true); setShowDropdown(false); }}
              className="px-4 py-3 cursor-pointer hover:bg-blue-800/70 border-b border-cyan-300/20"
            >
              Contact Us
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChange && (
          <ChangePasswordModal onClose={() => setShowChange(false)} />
        )}
        {showContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
          >
            <div className="bg-blue-950 text-white rounded-2xl p-8 shadow-2xl border border-cyan-400/30 w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p>Please email us at:</p>
              <p className="text-cyan-400 font-semibold mt-1">dharanisowmiyan29@gmail.com</p>
              <button
                onClick={() => setShowContact(false)}
                className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HelpMenu;
