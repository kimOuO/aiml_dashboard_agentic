import React from "react";

export const LinkApplicationModal = ({ isPublish, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          {isPublish ? "Unlink Application" : "Link Application"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isPublish
            ? "Are you sure you want to unlink this application?"
            : "Are you sure you want to link this application?"}
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-bold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
