import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    setMessage('');
    try {
      const res = await API.post('/change_password', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-blue-950 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-cyan-400/30 text-white"
        >
          <h3 className="text-xl font-bold mb-6">Change Password</h3>
          <input
            type={show ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-blue-900/60 border border-cyan-300/20 rounded-lg placeholder-blue-300 text-white focus:outline-none"
          />
          <input
            type={show ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-blue-900/60 border border-cyan-300/20 rounded-lg placeholder-blue-300 text-white focus:outline-none"
          />
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-blue-900/60 border border-cyan-300/20 rounded-lg placeholder-blue-300 text-white focus:outline-none"
          />
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShow(!show)}
              className="text-cyan-400 hover:underline"
            >
              {show ? "Hide" : "Show"} Password
            </button>
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full mb-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500"
          >
            Change
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg mt-1"
          >
            Close
          </button>
          <p className="text-sm text-red-400 mt-4">{message}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ChangePasswordModal;
