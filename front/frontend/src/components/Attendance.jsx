import React, { useState, useEffect } from 'react';
import API from '../api';
import ScannedLog from './ScannedLog';
import { motion } from 'framer-motion';

function Attendance() {
  const [log, setLog] = useState([]);
  const [message, setMessage] = useState('');
  const [quit, setQuit] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchAttendance = async () => {
    const res = await API.get('/attendance');
    setLog(res.data.attendance || []);
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartScan = async () => {
    await API.post('/start_scan');
    setScanning(true);
  };

  const handleStopScan = async () => {
    await API.post('/stop_scan');
    setScanning(false);
    fetchAttendance();
  };

  if (quit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-lg text-white bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        Thank you! You may now close this tab.
      </div>
    );
  }

  return (
    <motion.div
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      className="relative min-h-screen p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mouse-following radial spotlight */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(56,_182,_255,_0.15)_0%,_transparent_70%)] pointer-events-none"
        style={{
          '--mouse-x': `${mousePos.x}px`,
          '--mouse-y': `${mousePos.y}px`,
          transition: 'background 0.2s ease',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-4xl space-y-6 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-md">
          Attendance - Already Registered
        </h2>

        {scanning ? (
          <motion.div className="space-y-4" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <img
              src="http://localhost:5000/api/scan_feed"
              alt="Scan Preview"
              className="rounded-xl border border-blue-300 shadow-md"
            />
            <button
              onClick={handleStopScan}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-all shadow"
            >
              Stop Scanning
            </button>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleStartScan}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl transition-all shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Face Scan
          </motion.button>
        )}

        <div className="text-xl font-semibold text-cyan-200">🧾 Scanned Log</div>

        <ScannedLog log={log} />

        <button
          onClick={() => setQuit(true)}
          className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl transition-all shadow"
        >
          Quit
        </button>

        {message && <div className="text-sm text-blue-200 pt-2">{message}</div>}
      </motion.div>
    </motion.div>
  );
}

export default Attendance;
