import React from "react";

export default function ProfileHeader({ joinDate, onEdit }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-green-700">Profile</h2>
        <p className="text-sm text-gray-500">Join date : {joinDate}</p>
      </div>
      <div className="text-right">
        <button onClick={onEdit} className="text-green-600 inline-flex items-center gap-2 cursor-pointer hover:text-green-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 010 2.828L8.414 14.414a2 2 0 01-1.414.586H4a1 1 0 01-1-1v-3c0-.53.21-1.04.586-1.414l9-9a2 2 0 012.828 0z" />
          </svg>
          <span className="text-sm">Edit</span>
        </button>
      </div>
    </div>
  );
}
