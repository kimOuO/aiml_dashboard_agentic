import React, { useState } from "react";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
} from "@/app/modalComponent";
import {
  HandleDelete,
  HandleUpdate,
  HandleCreate,
  HandleUpload,
} from "./service";
import { useToastNotification } from "@/app/modalComponent";
import { HandleDownloadFile } from "@/app/downloadFile";

export const CreateModal = ({
  applicationUID,
  applicationName,
  onCreate,
  onClose,
}) => {
  const { showToast } = useToastNotification();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "default",
    model_input_format: "",
    model_output_format: "",
    status: "unavailable",
    f_application_uid: applicationUID,
    file: null,
    extension: "zip",
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

  const handleCreateClick = async () => {
    const fieldsToValidate = [
      "name",
      "model_input_format",
      "model_output_format",
      "file",
    ];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const response = await HandleCreate(formData, onCreate, onClose);
      // 根據 response 顯示對應的 toast
      showToast(response && response.status === 200);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload Model</h2>
        <ModalInput
          label="Application UID"
          value={formData.f_application_uid}
          readOnly
        />
        <ModalInput label="Application Name" value={applicationName} readOnly />
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
        <FileInput
          label="Model File"
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

export const EditModal = ({ model, onClose, onEdit, applicationName }) => {
  const { showToast } = useToastNotification();

  const [formData, setFormData] = useState({
    model_uid: model.uid,
    model_name: model.name,
    model_description: model.description,
    model_input_format: model.model_input_format,
    model_output_format: model.model_output_format,
    model_status: model.status,
  });

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateClick = async () => {
    const response = await HandleUpdate(formData, onEdit, onClose);
    // 根據 response 顯示對應的 toast
    showToast(response && response.status === 200);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Model</h2>
        <ModalInput label="Application" value={applicationName} readOnly />
        <ModalInput label="UID" value={model.uid} readOnly />
        <ModalInput
          label="Name"
          name="model_name"
          value={formData.model_name}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Input Format"
          name="model_input_format"
          value={formData.model_input_format}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Output Format"
          name="model_output_format"
          value={formData.model_output_format}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Version"
          name="version"
          value={model.version}
          readOnly
        />
        <ModalInput label="Access Token" value={model.access_token} readOnly />
        <ModalInput label="File Extension" value="zip" readOnly />
        <ModalInput
          label="Description"
          name="model_description"
          value={formData.model_description}
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

export const UploadInferenceModal = ({
  inference,
  modelUID,
  onClose,
  onUpload,
}) => {
  const { showToast } = useToastNotification();

  const [formData, setFormData] = useState({
    name: inference[0]?.name || "",
    description: inference[0]?.description || "",
    type: "template",
    file: inference[0]?.f_file_uid || "",
    extension: "zip",
    f_model_uid: modelUID,
  });

  const [errors, setErrors] = useState({});

  // 暫存更新的value
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

  const handleCreateClick = async () => {
    const fieldsToValidate = ["name", "file"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const response = await HandleUpload(formData, onUpload, onClose);
      // 根據 response 顯示對應的 toast
      showToast(response && response.status === 200);
    }
  };

  //download file
  const handleDownloadClick = async () => {
    const download = window.confirm("Do you want to download the file?");
    if (download) {
      const { downloadFile } = HandleDownloadFile(inference[0]);
      await downloadFile();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload Inference</h2>
        <ModalInput
          label="Inference Template Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <FileInput
              label="Dataset File"
              file={formData.file}
              onChange={handleFileChange}
              error={errors.file}
              accept=".zip"
            />
          </div>
          {/*有inference file才可下載*/}
          {inference[0]?.f_file_uid && (
            <button onClick={handleDownloadClick}>
              <img src="/project/download.svg" alt="Download" />
            </button>
          )}
        </div>
        <ModalInput
          label="Inference Template Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
        />
        <ModalInput
          label="Inference Extension"
          name="extension"
          value="zip"
          readOnly
        />
        <div className="flex justify-between">
          <button
            onClick={handleCreateClick}
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Upload
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
