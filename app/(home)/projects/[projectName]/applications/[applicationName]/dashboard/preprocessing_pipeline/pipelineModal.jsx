import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import { ModalInput, BaseDeleteModal } from "@/app/modalComponent";

export const CreateModal = ({
  applicationUID,
  applicationName,
  type,
  onCreate,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    applicationUID: applicationUID,
    applicationName: applicationName,
    name: "",
    type,
    description: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("未選擇任何檔案");

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file: file,
      });
      setFileName(file.name);
    } else {
      setFormData({
        ...formData,
        file: null,
      });
      setFileName("未選擇任何檔案");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const errorMessage = "The field cannot be blank.";
    //定義需要檢查的field
    const fieldsToValidate = [
      "name",
      "description",
      //"file",
    ];
    fieldsToValidate.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = errorMessage;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; //Return true if no errors
  };

  const handleCreateClick = () => {
    if (validateForm()) {
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
        <ModalInput label="Pipeline File Extension" value="py" readOnly />
        {/*上傳檔案的欄位*/}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Pipeline File
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="absolute right-0 top-0 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-r-md"
            >
              選擇檔案
            </button>
            <input
              type="file"
              id="fileInput"
              accept=".py"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <input
              type="text"
              value={fileName}
              readOnly
              className="border-blue-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/*{errors.file && <span className="text-red-500">{errors.file}</span>}*/}
        </div>
        {/*上傳檔案的欄位*/}
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
