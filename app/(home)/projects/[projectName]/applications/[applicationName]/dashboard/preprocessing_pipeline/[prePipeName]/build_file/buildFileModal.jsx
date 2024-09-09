import React, { useState } from "react";
import { HandleCreate, HandleUpdate, HandleDelete } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
} from "@/app/modalComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CreateModal = ({
  pipelineUID,
  pipelineName,
  type,
  onCreate,
  onClose,
  title1,
  title2,
  title3,
}) => {
  const [formData, setFormData] = useState({
    name1: "",
    sequence1: "download",
    description1: "",
    file1: null,
    name2: "",
    sequence2: "running",
    description2: "",
    file2: null,
    name3: "",
    sequence3: "upload",
    description3: "",
    file3: null,
    f_pipeline_uid: pipelineUID,
  });

  const accordionItems = [
    { id: 1, title: title1, prefix: "1" },
    { id: 2, title: title2, prefix: "2" },
    { id: 3, title: title3, prefix: "3" },
  ];

  const [errors, setErrors] = useState({});
  //用於保存每個file的filename
  const [fileNames, setFileNames] = useState({
    file1: "未選擇任何檔案",
    file2: "未選擇任何檔案",
    file3: "未選擇任何檔案",
  });

  //暫存更新的value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (file, prefix) => {
    setFormData({
      ...formData,
      [`file${prefix}`]: file,
    });
    setFileNames({
      ...fileNames,
      [`file${prefix}`]: file ? file.name : "未選擇任何檔案",
    });
  };

  const handleCreateClick = () => {
    const prefixes = ["1", "2", "3"];
    const allErrors = {}; // 保存验证错误的字段
    const submissions = []; // 准备提交的数据

    prefixes.forEach((prefix) => {
      const fieldsToValidate = [`name${prefix}`, `file${prefix}`];
      const validationErrors = ValidateForm(formData, fieldsToValidate);

      if (validationErrors && Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach((field) => {
          allErrors[field] = validationErrors[field];
        });
      } else {
        const submissionData = {
          f_pipeline_uid: formData.f_pipeline_uid,
          name: formData[`name${prefix}`],
          sequence: formData[`sequence${prefix}`],
          description: formData[`description${prefix}`],
          file: formData[`file${prefix}`],
          extension: "null",
        };
        submissions.push(submissionData);
      }
    });

    setErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      submissions.forEach((submission) => {
        //一次創建一個buildFile
        HandleCreate(submission, onCreate, onClose);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <Accordion type="single" collapsible>
          {accordionItems.map((item) => (
            <AccordionItem key={item.id} value={`item-${item.id}`}>
              <AccordionTrigger className="font-bold text-xl">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <ModalInput
                    label={`${type} Pipeline UID`}
                    value={formData.f_pipeline_uid}
                    readOnly
                  />
                  <ModalInput
                    label={`${type} Pipeline Name`}
                    value={pipelineName}
                    readOnly
                  />
                  <ModalInput
                    label={`${type} Build File Sequence`}
                    value={formData[`sequence${item.prefix}`]}
                    readOnly
                  />
                  <ModalInput
                    label={`${type} Build File Name`}
                    name={`name${item.prefix}`}
                    value={formData[`name${item.prefix}`]}
                    onChange={handleInputChange}
                    error={errors[`name${item.prefix}`]}
                  />
                  <ModalInput
                    label={`${type} Build File Description`}
                    name={`description${item.prefix}`}
                    value={formData[`description${item.prefix}`]}
                    onChange={handleInputChange}
                    error={errors[`description${item.prefix}`]}
                  />
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {`${type} Build File`}
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(`fileInput${item.prefix}`)
                            .click()
                        }
                        className="absolute right-0 top-0 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-r-md"
                      >
                        選擇檔案
                      </button>
                      <input
                        type="file"
                        id={`fileInput${item.prefix}`}
                        accept=""
                        onChange={(e) =>
                          handleFileChange(e.target.files[0], item.prefix)
                        }
                        style={{ display: "none" }}
                      />
                      <input
                        type="text"
                        value={fileNames[`file${item.prefix}`]}
                        readOnly
                        className="border-blue-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    {errors[`file${item.prefix}`] && (
                      <span className="text-red-500 mt-1">
                        {errors[`file${item.prefix}`]}
                      </span>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
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

export const EditModal = ({ buildFile, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    uid: buildFile.uid,
    name: buildFile.name,
    description: buildFile.description,
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
        <h2 className="text-2xl font-bold mb-4">Build File</h2>
        <ModalInput label="UID" value={formData.uid} readOnly />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <ModalInput label="Sequence" value={buildFile.sequence} readOnly />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <ModalInput
          label="Created Time"
          value={buildFile.created_time}
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

export const DeleteModal = ({ buildFile, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={buildFile}
      entityName="Build File"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
