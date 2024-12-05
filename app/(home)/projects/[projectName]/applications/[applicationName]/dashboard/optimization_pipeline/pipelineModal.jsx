"use client";

import React, { useState } from "react";
import { HandleCreate } from "../preprocessing_pipeline/service";
import {
  ModalInput,
  ValidateForm,
  SelectDropdown,
  FileInput,
} from "@/app/modalComponent";
import { useToastNotification } from "@/app/modalComponent";

export const CreateModal = ({
  applicationUID,
  applicationName,
  onCreateRetain,
  onCreateTuning,
  onClose,
}) => {
  const { showToast } = useToastNotification();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    f_application_uid: applicationUID,
    file: null,
    extension: "py"
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
    const fieldsToValidate = ["name", "file", "type","f_agent_uid"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const onCreate =
        formData.type === "retrain" ? onCreateRetain : onCreateTuning;

      const response = await HandleCreate(formData, onCreate, onClose);
      // 根據 response 顯示對應的 toast
      showToast(response && response.status === 200);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          Upload Optimization pipeline
        </h2>
        <ModalInput
          label="Application UID"
          value={formData.f_application_uid}
          readOnly
        />
        <ModalInput label="Application Name" value={applicationName} readOnly />
        <ModalInput
          label="Pipeline Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <SelectDropdown
          label="Pipeline Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          options={[
            { uid: "retrain", name: "retrain" },
            { uid: "tuning", name: "tuning" },
          ]}
          error={errors.type}
        />
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
