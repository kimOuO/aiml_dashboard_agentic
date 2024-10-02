import React, { useState } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  SelectDropdown,
} from "@/app/modalComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToastNotification } from "@/app/modalComponent";

export const CreateModal = ({
  pipelineUID,
  pipelineName,
  onCreate,
  onClose,
  taskFile,
}) => {
  const { showToast } = useToastNotification();

  const [formData, setFormData] = useState({
    access_key: "",
    secret_key: "",
    task_name: "",
    task_description: "",
    pipeline_uid: pipelineUID,
    dataset_uid: "",
    type: "",
    config_uid: "",
    image_uid: {
      download_uid: "",
      running_uid: "",
      upload_uid: "",
    },
    dataset_name: "",
    dataset_description: "",
    dataset_type: "",
    dataset_file_extension: "zip",
  });

  const [errors, setErrors] = useState({});

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      // 當 type 改變時，清空 dataset_uid
      setFormData({
        ...formData,
        type: value,
        dataset_uid: "",
      });
    } else if (name.includes("image_uid")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        image_uid: {
          ...formData.image_uid,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //動態顯示不同的original dataset根據type
  const getOriginalDatasetOptions = () => {
    if (formData.type === "Optimization Dataset") {
      formData.dataset_type = "optimization";
      return taskFile.taskFile.original_dataset?.application || [];
    } else if (formData.type === "Original Dataset") {
      formData.dataset_type = "training";
      return taskFile.taskFile?.original_dataset?.project || [];
    }
    return [];
  };

  const handleCreateClick = async () => {
    const fieldsToValidate = [
      "access_key",
      "secret_key",
      "dataset_uid",
      "image_uid.download_uid",
      "image_uid.running_uid",
      "image_uid.upload_uid",
      "dataset_name",
      "task_name",
      "config_uid",
      "type",
    ];

    const validationErrors = ValidateForm(formData, fieldsToValidate);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      let updatedType = formData.type;

      // 根據 type 動態修改值
      if (formData.type === "Optimization Dataset") {
        updatedType = "application";
      } else if (formData.type === "Original Dataset") {
        updatedType = "project";
      }

      // 更新 formData 並呼叫 HandleCreate
      setFormData({
        ...formData,
        type: updatedType,
      });

      // 確保 type 更新後再進行創建操作
      const response = await HandleCreate(
        { ...formData, type: updatedType },
        onCreate,
        onClose
      );
      // 根據 response 顯示對應的 toast
      showToast(response && response.status === 200);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <Accordion type="single" collapsible>
          <AccordionItem value="Authentication">
            <AccordionTrigger className="font-bold text-xl">
              Authentication
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <ModalInput
                  label="Access key"
                  name="access_key"
                  value={formData.access_key}
                  onChange={handleInputChange}
                  error={errors.access_key}
                />
                <ModalInput
                  label="Secret key"
                  name="secret_key"
                  value={formData.secret_key}
                  onChange={handleInputChange}
                  error={errors.secret_key}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Input">
            <AccordionTrigger className="font-bold text-xl">
              Input
            </AccordionTrigger>
            <AccordionContent>
              <ModalInput
                label="Preprocessing Pipeline Name"
                value={pipelineName}
                readOnly
              />
              <SelectDropdown
                label="Preprocessing Task Type"
                name="type"
                value={formData.type}
                options={[
                  { uid: "Original Dataset", name: "Original Dataset" },
                  { uid: "Optimization Dataset", name: "Optimization Dataset" },
                ]}
                onChange={handleInputChange}
                error={errors.type}
              />
              <SelectDropdown
                label="Original Dataset Name"
                name="dataset_uid"
                value={formData.dataset_uid}
                options={getOriginalDatasetOptions()} // 根據type顯示動態數據
                onChange={handleInputChange}
                error={errors.dataset_uid}
              />
              <SelectDropdown
                label="Preprocessing Task Config"
                name="config_uid"
                value={formData.config_uid}
                options={taskFile.taskFile.config}
                onChange={handleInputChange}
                error={errors.config_uid}
              />
              <SelectDropdown
                label="Build File:#1. Download Original Dataset"
                name="image_uid.download_uid"
                value={formData.image_uid.download_uid}
                options={taskFile.taskFile.image.download}
                onChange={handleInputChange}
                error={errors.image_uid?.download_uid}
              />
              <SelectDropdown
                label="Build File:#2. Preprocessing"
                name="image_uid.running_uid"
                value={formData.image_uid.running_uid}
                options={taskFile.taskFile.image.running}
                onChange={handleInputChange}
                error={errors.image_uid?.running_uid}
              />
              <SelectDropdown
                label="Build File:#3. Upload Training Dataset"
                name="image_uid.upload_uid"
                value={formData.image_uid.upload_uid}
                options={taskFile.taskFile.image.upload}
                onChange={handleInputChange}
                error={errors.image_uid?.upload_uid}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Output">
            <AccordionTrigger className="font-bold text-xl">
              Output
            </AccordionTrigger>
            <AccordionContent>
              <ModalInput
                label="Training Dataset Name"
                name="dataset_name"
                value={formData.dataset_name}
                onChange={handleInputChange}
                error={errors.dataset_name}
              />
              <ModalInput
                label="Training Dataset File Extension"
                value={formData.dataset_file_extension}
                readOnly
              />
              <ModalInput
                label="Training Dataset Description"
                name="dataset_description"
                value={formData.dataset_description}
                onChange={handleInputChange}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Task">
            <AccordionTrigger className="font-bold text-xl">
              Task
            </AccordionTrigger>
            <AccordionContent>
              <ModalInput
                label="Preprocessing Task Name"
                name="task_name"
                value={formData.task_name}
                onChange={handleInputChange}
                error={errors.task_name}
              />
              <ModalInput
                label="Preprocessing Task Description"
                name="task_description"
                value={formData.task_description}
                onChange={handleInputChange}
                error={errors.task_description}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex justify-between mt-4">
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
  const { showToast } = useToastNotification();

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

  const handleUpdateClick = async () => {
    const response = await HandleUpdate(formData, onEdit, onClose);
    // 根據 response 顯示對應的 toast
    showToast(response && response.status === 200);
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
