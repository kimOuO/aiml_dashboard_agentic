import React, { useState } from "react";
import { HandleCreate } from "./service";
import { ModalInput, ValidateForm, SelectDropdown } from "@/app/modalComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CreateModal = ({
  pipelineUID,
  pipelineType,
  pipelineName,
  onCreate,
  onClose,
  taskFile,
  agents,
}) => {
  const [formData, setFormData] = useState({
    access_key: "",
    secret_key: "",
    task_name: "",
    task_description: "",
    pipeline_uid: pipelineUID,
    model_uid: "",
    dataset_uid: "",
    type: "project",
    f_agent_uid: "",
    config_uid: "",
    image_uid: {
      download_uid: "",
      running_uid: "",
      upload_uid: "",
    },
    model_name: "",
    model_description: "",
    model_type: pipelineType === "retrain" ? "default" : "agent",
    model_input_format: "",
    model_output_format: "",
    model_file_extension: "zip",
  });

  const [errors, setErrors] = useState({});

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      //當type改變時，清空dataset_uid
      setFormData({
        ...formData,
        type: value==="Training Dataset"?"project":"application",
        model_type : value==="Training Dataset"?"default":"agent",
        dataset_uid: "",
      });
    } else if (name.includes("image_uid")) {
      // 處理嵌套欄位的值
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        image_uid: {
          ...formData.image_uid,
          [key]: value,
        },
      });
    } else {
      // 處理其他欄位
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  //根據type動態顯示不同的original dataset
  const getTrainingDatasetOptions = () => {
    if (formData.type === "project") {
      return taskFile.training_dataset.project || [];
    } else if (formData.type === "application") {
      return taskFile.training_dataset.application || [];
    }
    return [];
  };

  //根據pipelineType動態顯示不同的pretrain model
  const getPretrainModelsList = () => {
    if (pipelineType === "retrain") {
      return taskFile.retrain_pretrain_model || [];
    } else if (pipelineType === "tuning") {
      return taskFile.tuning_pretrain_model || [];
    }
    return [];
  };

  const handleCreateClick = () => {
    //根據type動態調整fieldsToValidate
    const fieldsToValidate = [
      "access_key",
      "secret_key",
      "dataset_uid",
      "model_uid",
      "config_uid",
      "image_uid.download_uid",
      "image_uid.running_uid",
      "image_uid.upload_uid",
      "model_name",
      "model_input_format",
      "model_output_format",
      "task_name",
      "type",
    ];

    if (formData.type === "Optimization Dataset") {
      //Optimization Dataset 時驗證 f_agent_uid
      fieldsToValidate.push("f_agent_uid");
    }

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
                label="Optimization Pipeline Name"
                value={pipelineName}
                readOnly
              />
              <SelectDropdown
                label="Optimization Task Type"
                name="type"
                value={formData.type==="project"?"Training Dataset":"Optimization Dataset"}
                options={[
                  { uid: "Training Dataset", name: "Training Dataset" },
                  { uid: "Optimization Dataset", name: "Optimization Dataset" },
                ]}
                onChange={handleInputChange}
                error={errors.type}
              />
              {formData.type === "Optimization Dataset" && (
                <SelectDropdown
                  label="Agent"
                  name="f_agent_uid"
                  value={formData.f_agent_uid}
                  options={agents || []}
                  onChange={handleInputChange}
                  error={errors.f_agent_uid}
                />
              )}
              <SelectDropdown
                label="Optimization Dataset Name"
                name="dataset_uid"
                value={formData.dataset_uid}
                options={getTrainingDatasetOptions()} //根據type顯示動態數據
                onChange={handleInputChange}
                error={errors.dataset_uid}
              />
              <SelectDropdown
                label="Retrain Model Name"
                name="model_uid"
                value={formData.model_uid}
                options={getPretrainModelsList()} //根據pipelineType顯示動態數據
                onChange={handleInputChange}
                error={errors.model_uid}
              />
              <SelectDropdown
                label="Retrain Task Config"
                name="config_uid"
                value={formData.config_uid}
                options={taskFile.config}
                onChange={handleInputChange}
                error={errors.config_uid}
              />
              <SelectDropdown
                label="Build File:#1. Download Image Path"
                name="image_uid.download_uid"
                value={formData.image_uid.download_uid}
                options={taskFile.image.download}
                onChange={handleInputChange}
                error={errors.image_uid?.download_uid}
              />
              <SelectDropdown
                label="Build File:#2. Running Image Path"
                name="image_uid.running_uid"
                value={formData.image_uid.running_uid}
                options={taskFile.image.running}
                onChange={handleInputChange}
                error={errors.image_uid?.running_uid}
              />
              <SelectDropdown
                label="Build File:#2. Upload Image Path"
                name="image_uid.upload_uid"
                value={formData.image_uid.upload_uid}
                options={taskFile.image.upload}
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
                error={errors.model_name}
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Task">
            <AccordionTrigger className="font-bold text-xl">
              Task
            </AccordionTrigger>
            <AccordionContent>
              <ModalInput
                label="Retrain Task Name"
                name="task_name"
                value={formData.task_name}
                onChange={handleInputChange}
                error={errors.task_name}
              />
              <ModalInput
                label="Retrain Task Description"
                name="task_description"
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
