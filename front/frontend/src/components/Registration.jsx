import React, { useState, useEffect } from "react";
import API from "../api";
import StudentList from "./StudentList";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Registration() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--mouse-x", `${xPercent}%`);
      document.documentElement.style.setProperty("--mouse-y", `${yPercent}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRegister = async () => {
    if (!id || !name) {
      setMessage("Please enter both ID and Name");
      return;
    }

    try {
      // Start camera preview
      setShowPreview(true);
      setIsCapturing(true);

      // Start the capture process
      const res = await API.post("/register", { 
        id, 
        name,
        start_capture: true 
      });

      // Wait for capture to complete
      setTimeout(() => {
        setShowPreview(false);
        setIsCapturing(false);
        setMessage(res.data.message);
        fetchTotal();
      }, 10000); // Adjust this time based on your capture duration

    } catch (err) {
      setShowPreview(false);
      setIsCapturing(false);
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const handleTrain = async () => {
    const password = prompt("Enter password to save profile:");
    if (!password) return;
    try {
      await API.post("/verify_password", { password });
      const res = await API.post("/train");
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const fetchTotal = async () => {
    const res = await API.get("/students");
    setTotal(res.data.students.length);
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <motion.div
      className="min-h-screen p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(56,_182,_255,_0.2)_0%,_transparent_70%)]"
        style={{
          transition: "background 0.5s ease-out",
          pointerEvents: "none",
        }}
      />
      <motion.div
        className="w-full max-w-3xl p-8 bg-gradient-to-br from-blue-800/50 to-indigo-900/50 rounded-3xl backdrop-blur-xl border border-cyan-300/30 hover:border-cyan-400/50 shadow-2xl space-y-6"
        variants={itemVariants}
      >
        <motion.h2
          className="text-4xl font-extrabold text-white drop-shadow-md text-center"
          variants={itemVariants}
        >
          🎓 Student Registration
        </motion.h2>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <label className="text-blue-200">Student ID</label>
            <input
              type="text"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-3 mt-1 rounded-xl bg-blue-900/40 border border-blue-600/40 text-white placeholder-blue-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="text-blue-200">Full Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-1 rounded-xl bg-blue-900/40 border border-blue-600/40 text-white placeholder-blue-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </motion.div>

          <motion.p
            className="text-sm text-white text-center"
            variants={itemVariants}
          >
            Steps: <b>1)</b> Take Images → <b>2)</b> Save Profile
          </motion.p>

          <motion.div className="flex space-x-4" variants={itemVariants}>
            <motion.button
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-cyan-400/30 transition-all disabled:opacity-50"
              onClick={handleRegister}
              disabled={isCapturing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCapturing ? "Capturing..." : "📸 Take Images"}
            </motion.button>
            <motion.button
              className="flex-1 bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-xl shadow-md hover:shadow-green-400/30 transition-all"
              onClick={handleTrain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 Save Profile
            </motion.button>
          </motion.div>

          {showPreview && (
            <motion.div
              className="mt-4 p-4 rounded-xl bg-blue-900/40 border border-blue-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Camera Preview</h3>
              <img
                src="http://localhost:5000/api/video_feed"
                alt="Camera Preview"
                className="w-full max-w-md rounded-xl border-2 border-gray-300 dark:border-gray-700"
              />
            </motion.div>
          )}

          {message && (
            <motion.div
              className="p-3 rounded-xl bg-blue-900/40 text-blue-100 border border-blue-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.div>
          )}

          <motion.div
            className="text-lg font-semibold text-white text-center"
            variants={itemVariants}
          >
            Total Registered: <span className="text-cyan-300">{total}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="mt-12 w-full max-w-5xl" variants={itemVariants}>
        <StudentList />
      </motion.div>
    </motion.div>
  );
}

export default Registration;
