import React, { useState } from "react";
import { HandleDelete, HandleUpdate } from "./service";
import { ModalInput, BaseDeleteModal } from "@/app/modalComponent";

export const EditModal = ({ pipeline, onClose, onEdit, applicationName }) => {
  const [formData, setFormData] = useState({
    name: pipeline.name,
    description: pipeline.description,
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
    HandleUpdate(pipeline.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">{pipeline.type} Pipeline</h2>
        <ModalInput label="Application" value={applicationName} readOnly />
        <ModalInput label="UID" value={pipeline.uid} readOnly />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <ModalInput label="File Extension" value="py" readOnly />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Created Time"
          value={pipeline.created_time}
          readOnly
        />
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
};

export const DeleteModal = ({ pipeline, onClose, onDelete }) => {
  const entityName = `${pipeline.type} Pipeline`;

  return (
    <BaseDeleteModal
      entity={pipeline}
      entityName={entityName}
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
