import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
} from "@/app/modalComponent";

export const CreateModal = ({
  pipelineUID,
  pipelineName,
  type,
  onCreate,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    f_pipeline_uid: pipelineUID,
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
        <h2 className="text-2xl font-bold mb-4">Upload {type} Task</h2>
        <ModalInput
          label="Pipeline UID"
          value={formData.f_pipeline_uid}
          readOnly
        />
        <ModalInput label="Pipeline Name" value={pipelineName} readOnly />
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

export const EditModal = ({ task, onClose, onEdit, pipelineName }) => {
  const [formData, setFormData] = useState({
    uid: task.uid,
    name: task.name,
    description: task.description,
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
        <h2 className="text-2xl font-bold mb-4">Task</h2>
        <ModalInput label="Pipeline" value={pipelineName} readOnly />
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
        <ModalInput label="Created Time" value={task.created_time} readOnly />
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

export const DeleteModal = ({ task, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={task}
      entityName="Task"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
