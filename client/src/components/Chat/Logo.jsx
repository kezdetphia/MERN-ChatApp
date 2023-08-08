import React from "react";

const Logo = () => {
  return (
    <div className="text-blue-600 font-bold flex gap-2  p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9M6 11.25h6M5.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501c1.153-.086 2.294-.213 3.423-.379C17.127 15.754 18.25 14.36 18.25 12.76v-6.018c0-1.602-1.123-2.995-2.707-3.228C15.057 3.209 13.916 3.082 12.763 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
      ChatMe
    </div>
  );
};

export default Logo;
