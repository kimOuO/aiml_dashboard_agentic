import React, { useState } from "react";
import { HandleCreate } from "../../../preprocessing_pipeline/[prePipeName]/tasks/service";
import { ModalInput, ValidateForm, SelectDropdown } from "@/app/modalComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CreateModal = ({
  pipelineUID,
  pipelineName,
  onCreate,
  onClose,
  taskFile,
}) => {
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
    model_name: "",
    model_description: "",
    model_type: "",
    model_file_extension: "zip",
    application_uid: "",
  });

  console.log(formData);
  const [errors, setErrors] = useState({});

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("image_uid")) {
      //更新嵌套字串
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        image_uid: {
          ...formData.image_uid,
          [key]: value,
        },
      });
    } else {
      //更新非嵌套字串
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //動態顯示不同的original dataset根據type
  const getOriginalDatasetOptions = () => {
    if (formData.type === "application") {
      return taskFile.taskFile.training_dataset?.application || [];
    } else if (formData.type === "project") {
      return taskFile.taskFile?.training_dataset?.project || [];
    }
    return [];
  };

  const handleCreateClick = () => {
    const fieldsToValidate = [
      "access_key",
      "secret_key",
      "dataset_uid",
      "image_uid.download_uid",
      "image_uid.running_uid",
      "image_uid.upload_uid",
      "model_name",
      "model_type",
      "task_name",
      "config_uid",
      "type",
    ];

    const validationErrors = ValidateForm(formData, fieldsToValidate);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      HandleCreate(formData, onCreate, onClose);
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
                label="Training Pipeline Name"
                value={pipelineName}
                readOnly
              />
              <SelectDropdown
                label="Training Task Type"
                name="type"
                value={formData.type}
                options={[
                  { uid: "application", name: "application" },
                  { uid: "project", name: "project" },
                ]}
                onChange={handleInputChange}
                error={errors.type}
              />
              <SelectDropdown
                label="Training Dataset Name"
                name="dataset_uid"
                value={formData.dataset_uid}
                options={getOriginalDatasetOptions()} // 根據type顯示動態數據
                onChange={handleInputChange}
                error={errors.dataset_uid}
              />
              <SelectDropdown
                label="Training Task Config"
                name="config_uid"
                value={formData.config_uid}
                options={taskFile.taskFile.config}
                onChange={handleInputChange}
                error={errors.config_uid}
              />
              <SelectDropdown
                label="Build File:#1. Download Training Dataset"
                name="image_uid.download_uid"
                value={formData.image_uid.download_uid}
                options={taskFile.taskFile.image.download}
                onChange={handleInputChange}
                error={errors.image_uid?.download_uid}
              />
              <SelectDropdown
                label="Build File:#2. Training"
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
                label="Model Name"
                name="model_name"
                value={formData.model_name}
                onChange={handleInputChange}
                error={errors.task_name}
              />
              <ModalInput
                label="Model File Extension"
                value={formData.model_file_extension}
                readOnly
              />
              <ModalInput
                label="Model Description"
                name="model_description"
                value={formData.model_description}
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
                label="Training Task Name"
                value={formData.task_name}
                onChange={handleInputChange}
                error={errors.task_name}
              />
              <ModalInput
                label="Training Task Description"
                value={formData.task_description}
                onChange={handleInputChange}
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
