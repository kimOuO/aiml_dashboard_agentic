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
    const pipelineType = formData.type || "optimization";
    const fileName = formData.name
      ? `${formData.name}.py`
      : `${pipelineType}_pipeline.py`;

    const templateCode = `# ${pipelineType.toUpperCase()} Pipeline Code
# Generated on ${new Date().toLocaleString()}

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

    setCurrentCode(templateCode);
    setIsCodeEditorOpen(true);
  };

  const handleCodeSave = (file, code) => {
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
              >
                🆕 Create{" "}
                {formData.type
                  ? formData.type.charAt(0).toUpperCase() +
                    formData.type.slice(1)
                  : "Template"}
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
        fileName={
          formData.name
            ? `${formData.name}.py`
            : `${formData.type || "optimization"}_pipeline.py`
        }
        isOpen={isCodeEditorOpen}
      />
    </>
  );
};
