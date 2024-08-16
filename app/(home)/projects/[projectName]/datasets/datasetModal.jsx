import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
} from "@/app/modalComponent";

export const CreateModal = ({
  projectUID,
  projectName,
  activeTab,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    projectUID,
    projectName,
    name: "",
    type: activeTab,
    description: "",
    file: null,
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

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      file: file,
    });
  };

  const handleCreateClick = () => {
    const fieldsToValidate = ["name", "description"]; //file還沒加上去
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      HandleCreate(formData, onCreate, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload {activeTab} Dataset</h2>
        <ModalInput label="Project UID" value={formData.projectUID} readOnly />
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
        <ModalInput label="Type" name="type" value={formData.type} readOnly />
        <FileInput
          label="Pipeline File"
          onChange={handleFileChange}
          accept=".zip"
          error={errors.file}
        />
        <ModalInput
          label="Dataset Description"
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

export const EditModal = ({ dataset, onClose, onEdit, projectName }) => {
  const [formData, setFormData] = useState({
    name: dataset.name,
    description: dataset.description,
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
    HandleUpdate(dataset.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">{dataset.type} Dataset</h2>
        <ModalInput label="Project" value={projectName} readOnly />
        <ModalInput label="UID" value={dataset.uid} readOnly />
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
        <ModalInput label="File Extension" value="zip" readOnly />
        <ModalInput
          label="Created Time"
          value={dataset.created_time}
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

export const DeleteModal = ({ dataset, onClose, onDelete }) => {
  const entityName = `${dataset.type} Dataset`;
  return (
    <BaseDeleteModal
      entity={dataset}
      entityName={entityName}
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
