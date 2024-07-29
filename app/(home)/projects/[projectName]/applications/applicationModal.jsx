import React, { useState } from "react";
import { handleDelete, handleUpdate } from "./service";

export const EditModal=({application,onClose,onEdit,projectName})=>{
    const [formData, setFormData] = useState({
        name: application.name,
        description: application.description,
      });

      //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateClick = () => {
    handleUpdate(application.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Application</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Project
          </label>
          <input
            type="text"
            value={projectName}
            readOnly
            className="bg-gray-200 border-gray-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            UID
          </label>
          <input
            type="text"
            value={application.uid}
            readOnly
            className="bg-gray-200 border-gray-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border-blue-500  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className=" border-blue-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created Time
          </label>
          <input
            type="text"
            value={application.created_time}
            readOnly
            className="bg-gray-200 border-gray-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleUpdateClick}
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-blue-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export const DeleteModal = ({ application, onClose, onDelete }) => {
    const handleDeleteClick = () => {
      handleDelete(application.uid, onDelete, onClose);
    };
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
          <h2 className="text-2xl font-bold mb-4">Delete Application</h2>
          <p className="mb-4">
            Are you sure you want to delete the dataset＂{application.name}＂？
          </p>
          <div className="flex justify-between">
            <button
              onClick={handleDeleteClick}
              className="bg-red-700 text-white px-4 py-2 rounded-md font-bold"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 rounded-md font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };