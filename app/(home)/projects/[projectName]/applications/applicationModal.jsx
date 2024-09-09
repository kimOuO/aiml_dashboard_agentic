import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
} from "@/app/modalComponent";

export const CreateModal = ({ projectUID, projectName, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    application_name: "",
    application_description: "",
    f_project_uid: projectUID,
    f_agent_uid: [],
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
    const fieldsToValidate = ["application_name"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      HandleCreate(formData, onCreate, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create Application</h2>
        <ModalInput
          label="Project UID"
          value={formData.f_project_uid}
          readOnly
        />
        <ModalInput label="Project Name" value={projectName} readOnly />
        <ModalInput
          label="Name"
          name="application_name"
          value={formData.application_name}
          onChange={handleInputChange}
          error={errors.application_name}
        />
        <ModalInput
          label="Description"
          name="application_description"
          value={formData.application_description}
          onChange={handleInputChange}
          error={errors.application_description}
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
    application_uid: application.uid,
    application_name: application.name,
    application_description: application.description,
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
    HandleUpdate(formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Application</h2>
        <ModalInput label="Project" value={projectName} readOnly />
        <ModalInput label="UID" value={formData.application_uid} readOnly />
        <ModalInput
          label="Name"
          name="application_name"
          value={formData.application_name}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Description"
          name="application_description"
          value={formData.application_description}
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
