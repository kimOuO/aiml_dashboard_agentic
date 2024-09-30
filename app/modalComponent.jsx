import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

//通用的ModalInput Component
export const ModalInput = ({
  label,
  value,
  name,
  onChange,
  readOnly = false,
  error,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`${
        readOnly ? "bg-gray-200" : "border-blue-500"
      } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    />
    <span className="text-red-500 mt-1">{error}</span>
  </div>
);

//通用的DeleteModal Component
export const BaseDeleteModal = ({
  entity,
  entityName,
  onClose,
  onDelete,
  handleDelete,
}) => {
  const { showToast } = useToastNotification();

  const handleDeleteClick = async () => {
    const response = await handleDelete(entity.uid, onDelete, onClose);
    // 根據 response 顯示對應的 toast
    showToast(response && response.status === 200);
  };

  // 監聽鍵盤事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleDeleteClick(); // 當按下 Enter 鍵時觸發刪除
      }
    };

    // 綁定鍵盤事件
    window.addEventListener("keydown", handleKeyDown);

    // 在組件卸載時移除事件監聽
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Delete {entityName}</h2>
        <p className="mb-4">
          Are you sure you want to delete the &quot;{entity.name}&quot;?
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleDeleteClick}
            className="bg-red-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

//通用的FileInput Component
export const FileInput = ({ label, file, onChange, accept, error }) => {
  const [fileName, setFileName] = useState(file ? file : "No file");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      onChange(selectedFile);
    } else {
      setFileName("No file");
      onChange(null);
    }
  };

  const handleClick = () => {
    if (fileName === "No file") {
      document.getElementById("fileInput").click();
    } else {
      const overwrite = window.confirm("Do you want to overwrite the file?");
      if (overwrite) {
        document.getElementById("fileInput").click();
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          className="absolute right-0 top-0 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-r-md"
        >
          Select File
        </button>
        <input
          type="file"
          id="fileInput"
          accept={accept}
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
      {error && <span className="text-red-500 mt-1">{error}</span>}
    </div>
  );
};

//表單驗證
export const ValidateForm = (formData, fieldsToValidate) => {
  const errors = {};
  const errorMessage = "This field is required.";

  fieldsToValidate.forEach((field) => {
    //檢查是否為嵌套字串
    const fieldParts = field.split(".");
    if (fieldParts.length > 1) {
      //如果是嵌套字串，例如image_uid.download_uid
      const [parentkey, childKey] = fieldParts;
      const parentValue = formData[parentkey];

      if (
        !parentValue ||
        !parentValue[childKey] ||
        (typeof parentValue[childKey] === "string" &&
          parentValue[childKey].trim() === "")
      ) {
        //初始化errors[parentkey]物件並設置錯誤
        if (!errors[parentkey]) {
          errors[parentkey] = {};
        }
        errors[parentkey][childKey] = errorMessage;
      }
    } else {
      //非嵌套字串的處理
      const value = formData[field];

      if (field === "file") {
        if (!value || value.length === 0) {
          errors[field] = "A file is required.";
        }
      } else {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors[field] = errorMessage;
        }
      }
    }
  });

  return errors;
};

//下拉式選單
export const SelectDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full py-2 px-3 text-gray-700 leading-tight shadow appearance-none border rounded focus:outline-none focus:shadow-outline border-blue-500`}
    >
      <option value="" disabled>
        Select ➜
      </option>
      {options.map((option) => (
        <option key={option.uid} value={option.uid}>
          {option.name}
        </option>
      ))}
    </select>
    {error && <p className="text-red-600 mt-1">{error}</p>}
  </div>
);

// 通用的 ToastNotification hook
export const useToastNotification = () => {
  const { toast } = useToast();

  const showToast = (isSuccess) => {
    if (isSuccess) {
      toast({
        description: <span className="text-xl">Operation successful!</span>,
        variant: "success",
        duration: 1500,
      });
    } else {
      toast({
        description: <span className="text-xl">Operation failed!</span>,
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  return { showToast };
};
