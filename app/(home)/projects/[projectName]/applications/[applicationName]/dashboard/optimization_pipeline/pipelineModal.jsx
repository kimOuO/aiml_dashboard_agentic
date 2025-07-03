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
import CodeEditor from "@/components/base/CodeEditor";

export const CreateModal = ({
  applicationUID,
  applicationName,
  onCreateRetain,
  onCreateTuning,
  onClose,
}) => {
  const { showToast } = useToastNotification();
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    f_application_uid: applicationUID,
    file: null,
    extension: "py",
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

    if (file && file.name.endsWith(".py")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleCreateBlankFile = () => {
    // Check if there's already a file uploaded
    if (formData.file) {
      const confirmOverwrite = window.confirm(
        `You have already uploaded "${formData.file.name}". Creating a blank file will replace it. Do you want to continue?`
      );

      if (!confirmOverwrite) {
        return; // User cancelled, don't proceed
      }
    }

    const pipelineType = formData.type || "optimization";
    const fileName = formData.name
      ? `${formData.name}.py`
      : `${pipelineType}_pipeline.py`;

    const templateCode = `# ${pipelineType.toUpperCase()} Pipeline Code
# Created on ${new Date().toLocaleString()}

import numpy as np
import pandas as pd
${
  pipelineType === "retrain"
    ? 'from sklearn.model_selection import train_test_split'
    : ""
}
${
  pipelineType === "tuning"
    ? 'from sklearn.model_selection import GridSearchCV'
    : ""
}

def ${pipelineType}_pipeline():
    """
    ${pipelineType.charAt(0).toUpperCase() + pipelineType.slice(1)} pipeline implementation
    """
    print(f"Starting ${pipelineType} pipeline...")
    
    # Load data
    # data = load_data()
    
    ${pipelineType === "retrain" ? `# Retrain model logic
    # model = train_model(data)
    # save_model(model)` : ""}
    
    ${pipelineType === "tuning" ? `# Hyperparameter tuning logic
    # param_grid = {'param1': [1, 2, 3]}
    # grid_search = GridSearchCV(model, param_grid)
    # best_model = grid_search.fit(X_train, y_train)` : ""}
    
    pass

if __name__ == '__main__':
    ${pipelineType}_pipeline()
`;

    // Create a file object for the blank template
    const blob = new Blob([templateCode], { type: "text/plain" });
    const templateFile = new File([blob], fileName, {
      type: "text/plain",
      lastModified: Date.now(),
    });

    // Update form data with the new blank file
    setFormData({
      ...formData,
      file: templateFile,
    });

    setCurrentCode(templateCode);
    setIsCodeEditorOpen(true);

    showToast(true, "Blank template created! You can now edit it in the code editor.");
  };

  const handleCodeSave = (file, code) => {
    // Create a proper File object with the correct properties
    const blob = new Blob([code], { type: "text/plain" });
    const fileName = formData.name
      ? `${formData.name}.py`
      : `${formData.type || "optimization"}_pipeline.py`;

    // Create a File object that behaves more like a real uploaded file
    const codeFile = new File([blob], fileName, {
      type: "text/plain",
      lastModified: Date.now(),
    });

    setFormData({
      ...formData,
      file: file,
    });
    setCurrentCode(code);
    setIsCodeEditorOpen(false);
  };

  const handleCreateClick = async () => {
    const fieldsToValidate = ["name", "file", "type"];
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

  const fileName = formData.name
    ? `${formData.name}.py`
    : `${formData.type || "optimization"}_pipeline.py`;

  return (
    <>
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

          <div className="mb-4">
            <FileInput
              label="Pipeline File"
              onChange={handleFileChange}
              accept=".py"
              error={errors.file}
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleCreateBlankFile}
                disabled={!formData.type}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                title={
                  formData.file
                    ? "This will replace your uploaded file"
                    : `Create a new ${formData.type || "template"} template`
                }
              >
                🆕 Create{" "}
                {formData.type
                  ? formData.type.charAt(0).toUpperCase() +
                    formData.type.slice(1)
                  : "Template"}
                {formData.file && (
                  <span className="ml-1 text-yellow-200">⚠️</span>
                )}
              </button>

              {formData.file && (
                <button
                  type="button"
                  onClick={() => setIsCodeEditorOpen(true)}
                  className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  ✏️ Edit Code
                </button>
              )}
            </div>

            {formData.file && (
              <div className="mt-2 text-sm text-gray-600">
                📄 Selected: {formData.file.name}
              </div>
            )}
          </div>

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

      <CodeEditor
        initialCode={currentCode}
        onSave={handleCodeSave}
        onClose={() => setIsCodeEditorOpen(false)}
        fileName={fileName}
        isOpen={isCodeEditorOpen}
        pipelineType={formData.type || "optimization"} // Use dynamic type (retrain/tuning) or fallback to optimization
      />
    </>
  );
};
