import React from 'react';
import { motion } from 'framer-motion';

function ScannedLog({ log }) {
  return (
    <motion.div
      className="overflow-x-auto mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <table className="min-w-full bg-white/5 text-white rounded-xl overflow-hidden shadow-xl">
        <thead>
          <tr className="bg-white/10 text-cyan-300">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {log.map((row, idx) => (
            <motion.tr
              key={idx}
              className="text-center border-t border-white/10 hover:bg-white/5 transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <td className="py-2 px-4">{row.student_id}</td>
              <td className="py-2 px-4">{row.name}</td>
              <td className="py-2 px-4">{row.date}</td>
              <td className="py-2 px-4">{row.time}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ScannedLog;
