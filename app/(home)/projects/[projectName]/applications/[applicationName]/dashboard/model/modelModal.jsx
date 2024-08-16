import React, { useState } from "react";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
} from "@/app/modalComponent";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";

export const CreateModal = ({
  applicationUID,
  applicationName,
  onCreate,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    applicationUID,
    applicationName,
    name: "",
    model_input_format: "",
    model_output_format: "",
    status: "unpublish",
    version: "",
    file: null,
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

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      file: file,
    });
  };

  const handleCreateClick = () => {
    const fieldsToValidate = [
      "name",
      "description",
      "model_input_format",
      "model_output_format",
      "version",
    ]; //file還沒加上去
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      HandleCreate(formData, onCreate, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload Model</h2>
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
          label="Model Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <ModalInput
          label="Model Input Format"
          name="model_input_format"
          value={formData.model_input_format}
          onChange={handleInputChange}
          error={errors.model_input_format}
        />
        <ModalInput
          label="Model Output Format"
          name="model_output_format"
          value={formData.model_output_format}
          onChange={handleInputChange}
          error={errors.model_output_format}
        />
        <ModalInput
          label="Model Version"
          name="version"
          value={formData.version}
          onChange={handleInputChange}
          error={errors.version}
        />
        <FileInput
          label="Pipeline File"
          onChange={handleFileChange}
          accept=".zip"
          error={errors.file}
        />
        <ModalInput
          label="Model Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
        />
        <ModalInput label="Model Publish" value={formData.status} readOnly />
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

export const PerformanceModal = ({ model, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Performance</h2>
        <ModalInput label="Model" value={model.name} readOnly />
        <ModalInput label="Matrice" value="" readOnly />
        <ModalInput label="Value" value="" readOnly />
        <ModalInput label="Created Time" value="" readOnly />
        <div className="flex justify-center">
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

export const EditModal = ({ model, onClose, onEdit, applicationName }) => {
  const [formData, setFormData] = useState({
    name: model.name,
    version: model.version,
    description: model.description,
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
    HandleUpdate(model.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Model</h2>
        <ModalInput label="Application" value={applicationName} readOnly />
        <ModalInput label="UID" value={model.uid} readOnly />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Input Format"
          value={model.model_input_format}
          readOnly
        />
        <ModalInput
          label="Output Format"
          value={model.model_output_format}
          readOnly
        />
        <ModalInput
          label="Version"
          name="version"
          value={formData.version}
          onChange={handleInputChange}
        />
        <ModalInput label="Access Token" value={model.access_token} readOnly />
        <ModalInput label="File Extension" value="zip" readOnly />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <ModalInput label="Created Time" value={model.created_time} readOnly />
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

export const DeleteModal = ({ model, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={model}
      entityName="Model"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
