import React, { useState } from "react";
import { HandleCreate, HandleUpdate, HandleDelete } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
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
    pipelineUID,
    pipelineName,
    name1: "",
    sequence1: "1",
    description1: "",
    file1: null,
    name2: "",
    sequence2: "2",
    description2: "",
    file2: null,
    name3: "",
    sequence3: "3",
    description3: "",
    file3: null,
  });
  const accordionItems = [
    { id: 1, title: title1, prefix: "1" },
    { id: 2, title: title2, prefix: "2" },
    { id: 3, title: title3, prefix: "3" },
  ];

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
    const prefixes = ["1", "2", "3"];
    const allErrors = {}; // 儲存錯誤的fields
    const submissions = []; // 準備提交的資料

    prefixes.forEach((prefix) => {
      const fieldsToValidate = [`name${prefix}`, `description${prefix}`];
      const validationErrors = ValidateForm(formData, fieldsToValidate);

      if (validationErrors && Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach((field) => {
          allErrors[field] = validationErrors[field];
        });
      } else {
        // 如果這組資料沒有錯誤，將其加入提交陣列
        const submissionData = {
          pipelineUID: formData.pipelineUID,
          pipelineName: formData.pipelineName,
          name: formData[`name${prefix}`],
          sequence: formData[`sequence${prefix}`],
          description: formData[`description${prefix}`],
          file: formData[`file${prefix}`],
        };
        submissions.push(submissionData);
      }
    });

    setErrors(allErrors); // 更新錯誤信息

    if (Object.keys(allErrors).length === 0) {
      // 如果所有的字段都通過了驗證，則提交
      HandleCreate(submissions, onCreate, onClose);
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
                    value={formData.pipelineUID}
                    readOnly
                  />
                  <ModalInput
                    label={`${type} Pipeline Name`}
                    value={formData.pipelineName}
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
                  <FileInput
                    label={`${type} Build File`}
                    onChange={(file) =>
                      handleFileChange(file, `file${item.prefix}`)
                    }
                    accept=""
                    error={errors[`file${item.prefix}`]}
                  />
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
    HandleUpdate(buildFile.uid, formData, onEdit, onClose);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Build File</h2>
        <ModalInput label="UID" value={buildFile.uid} readOnly />
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
