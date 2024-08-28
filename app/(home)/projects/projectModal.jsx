import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
} from "@/app/modalComponent";
import { format } from "date-fns";

export const CreateModal = ({ organization, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    f_organization_uid: organization.uid,
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

  const handleCreateClick = () => {
    const fieldsToValidate = ["name"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      HandleCreate(formData, onCreate, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create Project</h2>
        <ModalInput
          label="Organization UID"
          value={formData.f_organization_uid}
          readOnly
        />
        <ModalInput
          label="Organization Name"
          value={organization.name}
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

export const EditModal = ({ project, onClose, onEdit, organizationName }) => {
  const [formData, setFormData] = useState({
    uid: project.uid,
    name: project.name,
    description: project.description,
  });

  const formattedDate = format(
    new Date(project.created_time),
    "yyyy-MM-dd HH:mm:ss"
  );

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateClick = () => {
    HandleUpdate(formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Project</h2>
        <ModalInput label="Organization" value={organizationName} readOnly />
        <ModalInput label="UID" value={formData.uid} readOnly />
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
        <ModalInput label="Created Time" value={formattedDate} readOnly />
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

export const DeleteModal = ({ project, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={project}
      entityName="Project"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
