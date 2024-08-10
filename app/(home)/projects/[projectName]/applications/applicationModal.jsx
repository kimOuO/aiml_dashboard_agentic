import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import { ModalInput, BaseDeleteModal } from "@/app/modalComponent";

export const CreateModal = ({ projectUID, projectName, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    projectUID: projectUID,
    projectName: projectName,
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    //判斷字串是否為空字串或只輸入空白
    if (!formData.name.trim())
      newErrors.name = "Application name cannot be blank.";
    if (!formData.description.trim())
      newErrors.description = "Application description cannot be blank.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleCreateClick=()=>{
    if(validateForm()){
      HandleCreate(formData,onCreate,onClose)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create Application</h2>
        <ModalInput
          label="Project UID"
          value={formData.projectUID}
          readOnly
        />
        <ModalInput
          label="Project Name"
          value={formData.projectName}
          readOnly
        />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
        />
        <div className="flex justify-between">
          <button
            onClick={handleCreateClick}
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Create
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

export const EditModal = ({ application, onClose, onEdit, projectName }) => {
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
    HandleUpdate(application.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Application</h2>
        <ModalInput label="Project" value={projectName} readOnly />
        <ModalInput label="UID" value={application.uid} readOnly />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Created Time"
          value={application.created_time}
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

export const DeleteModal = ({ application, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={application}
      entityName="Application"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
