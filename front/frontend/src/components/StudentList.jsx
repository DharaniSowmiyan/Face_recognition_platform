// StudentList.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { motion } from 'framer-motion';

function StudentList() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const res = await API.get('/students');
    setStudents(res.data.students || []);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (student_id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    await API.post('/delete_student', { student_id });
    await API.post('/train');
    fetchStudents();
    alert('Student deleted and model retrained!');
  };

  return (
    <motion.div 
      className="mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-white mb-4">
        🗂️ Registered Students
      </h3>
      <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-blue-900/30 border border-blue-700/30 shadow-lg">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-blue-800/60 text-blue-100">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <motion.tr 
                key={s.student_id} 
                className={`border-t border-blue-800/20 ${index % 2 === 0 ? 'bg-blue-900/10' : 'bg-blue-900/20'}`}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <td className="py-3 px-4">{s.student_id}</td>
                <td className="py-3 px-4">{s.name}</td>
                <td className="py-3 px-4 text-right">
                  <motion.button
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-1.5 rounded-lg hover:shadow-pink-500/40 shadow transition-all"
                    onClick={() => handleDelete(s.student_id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default StudentList;
