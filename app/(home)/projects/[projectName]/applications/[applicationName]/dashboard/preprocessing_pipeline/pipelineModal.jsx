import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
} from "@/app/modalComponent";

export const CreateModal = ({
  applicationUID,
  applicationName,
  type,
  onCreate,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    applicationUID,
    applicationName,
    name: "",
    type,
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
        <h2 className="text-2xl font-bold mb-4">Upload {type} Pipeline</h2>
        <ModalInput
          label="Application UID"
          value={formData.applicationUID}
          readOnly
        />
        <ModalInput
          label="Application Name"
          value={formData.applicationName}
          readOnly
        />
        <ModalInput
          label="Pipeline Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <ModalInput label="Type" name="type" value={formData.type} readOnly />
        <FileInput
          label="Pipeline File"
          onChange={handleFileChange}
          accept=".py"
          error={errors.file}
        />
        <ModalInput
          label="Pipeline Description"
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
