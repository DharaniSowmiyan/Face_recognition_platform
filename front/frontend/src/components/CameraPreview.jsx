import React from 'react';

function CameraPreview() {
  return (
    <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Live Camera Preview</h3>
      <img
        src="http://localhost:5000/api/video_feed"
        alt="Camera Preview"
        className="w-full max-w-md rounded-xl border-2 border-gray-300 dark:border-gray-700"
      />
    </div>
  );
}

export default CameraPreview;