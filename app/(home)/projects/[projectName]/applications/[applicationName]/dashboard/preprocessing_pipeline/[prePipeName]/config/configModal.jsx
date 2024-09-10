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
    data: "",
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
      // 在這裡嘗試將 data 轉換為物件
      let updatedFormData = { ...formData };

      try {
        updatedFormData.data = JSON.parse(formData.data); // 將 data 字串轉成物件
      } catch (error) {
        // 如果解析失敗，可以選擇提示用戶或直接返回，避免繼續執行
        setErrors((prevErrors) => ({
          ...prevErrors,
          data: "data field must be in legal json format",
        }));
        return;
      }

      // 使用更新過的 formData 傳遞給 HandleCreate
      HandleCreate(updatedFormData, onCreate, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload {type} Config</h2>
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
        <ModalInput
          label="Data"
          name="data"
          value={formData.data}
          onChange={handleInputChange}
          error={errors.data}
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

export const EditModal = ({ config, onClose, onEdit, pipelineName }) => {
  const [formData, setFormData] = useState({
    uid: config.uid,
    name: config.name,
    description: config.description,
    // 將 data 物件轉換為字串來顯示
    data: JSON.stringify(config.data, null, 2), // 轉換成格式化的 JSON 字串
  });

  const [errors, setErrors] = useState({});

  // 暫存更新的 value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateClick = () => {
    const fieldsToValidate = ["name"]; // 這裡你可以加入需要驗證的其他欄位
    const validationErrors = ValidateForm(formData, fieldsToValidate); // 執行自定義的驗證函數
    setErrors(validationErrors);

    // 確認沒有驗證錯誤
    if (Object.keys(validationErrors).length === 0) {
      let updatedFormData = { ...formData };

      // 嘗試將 data 欄位轉換為物件
      try {
        updatedFormData.data = JSON.parse(formData.data); // 將 data 字串轉成物件
      } catch (error) {
        // 如果解析失敗，設置錯誤訊息並停止提交
        setErrors((prevErrors) => ({
          ...prevErrors,
          data: "data field must be in legal json format",
        }));
        return;
      }

      // 使用更新過的 formData 傳遞給 HandleUpdate
      HandleUpdate(updatedFormData, onEdit, onClose);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Config</h2>
        <ModalInput label="Pipeline" value={pipelineName} readOnly />
        <ModalInput label="UID" value={formData.uid} readOnly />
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
        <ModalInput
          label="Data"
          name="data"
          value={formData.data}
          onChange={handleInputChange}
          error={errors.data}
        />
        <ModalInput label="Created Time" value={config.created_time} readOnly />
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

export const DeleteModal = ({ config, onClose, onDelete }) => {
  return (
    <BaseDeleteModal
      entity={config}
      entityName="Config"
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
