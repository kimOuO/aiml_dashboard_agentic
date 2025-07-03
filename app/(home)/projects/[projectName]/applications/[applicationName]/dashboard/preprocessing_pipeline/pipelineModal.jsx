import React, { useState, useEffect } from "react";
import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
import {
  ModalInput,
  BaseDeleteModal,
  ValidateForm,
  FileInput,
} from "@/app/modalComponent";
import { useToastNotification } from "@/app/modalComponent";
import CodeEditor from "@/components/base/CodeEditor";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";
import { PIPELINE_TEMPLATES } from '@/utils/pipelineTemplates';

export const CreateModal = ({
  applicationUID,
  applicationName,
  type,
  onCreate,
  onClose,
  pipelineType,
}) => {
  const { showToast } = useToastNotification();
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type,
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

    // If it's a Python file, read its content for the editor
    if (file && file.name.endsWith('.py')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleOpenCodeEditor = () => {
    setIsCodeEditorOpen(true);
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

    const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
    // Use the utility to generate template code
    const blankCode = PIPELINE_TEMPLATES.generateTemplate(type);

    // Create a file object for the blank template
    const blob = new Blob([blankCode], { type: 'text/plain' });
    const templateFile = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    });

    // Update form data with the new blank file
    setFormData({
      ...formData,
      file: templateFile
    });
    
    setCurrentCode(blankCode);
    setIsCodeEditorOpen(true);
    
    showToast(true, 'Blank template created! You can now edit it in the code editor.');
  };

  const handleCodeSave = (file, code) => {
    // Create a proper File object with the correct properties
    const blob = new Blob([code], { type: 'text/plain' });
    const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
    // Create a File object that behaves more like a real uploaded file
    const codeFile = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    });
    
    setFormData({
      ...formData,
      file: file
    });
    setCurrentCode(code);
    setIsCodeEditorOpen(false);
  };

  const handleCreateClick = async () => {
    const fieldsToValidate = ["name", "file"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const response = await HandleCreate(formData, onCreate, onClose);
      // 根據 response 顯示對應的 toast
      showToast(response && response.status === 200);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
          <h2 className="text-2xl font-bold mb-4">Upload {type} pipeline</h2>
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
          <ModalInput label="Type" name="type" value={formData.type} readOnly />
          
          <div className="mb-4">
            <FileInput
              label="Pipeline File"
              onChange={handleFileChange}
              accept=".py"
              error={errors.file}
            />
            
            {/* Code Editor Actions */}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleCreateBlankFile}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700"
                title={formData.file ? "This will replace your uploaded file" : "Create a new blank template"}
              >
                🆕 Create Blank Template
                {formData.file && <span className="ml-1 text-yellow-200">⚠️</span>}
              </button>
              
              {formData.file && (
                <button
                  type="button"
                  onClick={handleOpenCodeEditor}
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
        fileName={formData.name ? `${formData.name}.py` : 'pipeline.py'}
        isOpen={isCodeEditorOpen}
        pipelineType={pipelineType || type || "preprocessing"} // Use passed prop, fallback to type, then preprocessing
      />
    </>
  );
};

export const EditModal = ({ pipeline, onClose, onEdit, applicationName, pipelineType }) => {
  const { showToast } = useToastNotification();
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  
  const [formData, setFormData] = useState({
    file: pipeline.f_file_uid,
    uid: pipeline.uid,
    name: pipeline.name,
    description: pipeline.description,
  });

  // Auto-fetch existing code when modal opens using existing download API
  useEffect(() => {
    const fetchExistingCodeUsingDownloadAPI = async () => {
      if (pipeline.f_file_uid && typeof pipeline.f_file_uid === 'object') {
        setIsLoadingCode(true);
        try {
          console.log('Fetching code using download API for file:', pipeline.f_file_uid);
          
          // Build file path from the existing file structure - using the CORRECT pattern from downloadFile.jsx
          const fileInfo = pipeline.f_file_uid;
          let file_path = fileInfo.path + "/" + pipeline.uid; // Use fileInfo.uid, NOT pipeline.uid
          
          // Add extension if it exists
          if (fileInfo.extension && fileInfo.extension !== "null") {
            file_path += "." + fileInfo.extension;
          }
          
          console.log('Constructed file path:', file_path);
          
          // Use the existing download API
          const data = { file_path: file_path };
          const response = await getAPI(APIKEYS.DOWNLOAD_FILE, data, false, true);
          
          if (response.status === 200) {
            // The response.data should contain the file content as text
            let fileContent = '';
            
            if (typeof response.data === 'string') {
              fileContent = response.data;
            } else if (response.data instanceof Blob) {
              fileContent = await response.data.text();
            } else {
              // If it's ArrayBuffer or other format, convert to text
              const blob = new Blob([response.data], { type: 'text/plain' });
              fileContent = await blob.text();
            }
            
            setCurrentCode(fileContent);
            console.log('Code loaded successfully, length:', fileContent.length);
            
          } else {
            throw new Error(`API returned status: ${response.status}`);
          }
          
        } catch (error) {
          console.error('Failed to load existing file content:', error);
          setCurrentCode(`# Failed to load existing content for file: ${pipeline.f_file_uid?.uid}
# Error: ${error.message}
# File path attempted: ${pipeline.f_file_uid?.path}/${pipeline.f_file_uid?.uid}${pipeline.f_file_uid?.extension ? '.' + pipeline.f_file_uid.extension : ''}
# You can add your code here

def main():
    """
    Main ${pipeline.type.toLowerCase()} pipeline function
    """
    print("Starting ${pipeline.type.toLowerCase()} pipeline...")
    
    # Add your ${pipeline.type.toLowerCase()} logic here
    pass

if __name__ == '__main__':
    main()
`);
        } finally {
          setIsLoadingCode(false);
        }
      } else {
        // No file UID object, provide template
        setCurrentCode(PIPELINE_TEMPLATES.generateTemplate(pipeline.type));
      }
    };

    fetchExistingCodeUsingDownloadAPI();
  }, [pipeline.f_file_uid, pipeline.type, pipeline.uid]);

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

    if (file && file.name.endsWith('.py')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleEditCode = () => {
    setIsViewMode(false);
    setIsCodeEditorOpen(true);
  };

  const handleViewCode = () => {
    setIsViewMode(true);
    setIsCodeEditorOpen(true);
  };

  const handleCodeSave = (file, code) => {
    setFormData({
      ...formData,
      file: file
    });
    setCurrentCode(code);
    setIsCodeEditorOpen(false);
  };

  const handleCodeClose = () => {
    setIsCodeEditorOpen(false);
    setIsViewMode(false);
  };

  const handleUpdateClick = async () => {
    const updatedFormData = {...formData};
    if(formData.file !== pipeline.f_file_uid){
      updatedFormData.file = formData.file;
    }else{
      delete updatedFormData.file
    }
    
    const response = await HandleUpdate(updatedFormData, onEdit, onClose);
    showToast(response && response.status === 200);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
          <h2 className="text-2xl font-bold mb-4">{pipeline.type} pipeline</h2>
          <ModalInput label="Application" value={applicationName} readOnly />
          <ModalInput label="UID" value={formData.uid} readOnly />
          <ModalInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          
          <div className="mb-4">
            <FileInput
              label="Pipeline File"
              file={pipeline.f_file_uid?.uid || 'No file'}
              onChange={handleFileChange}
              accept=".py"
            />
            
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleViewCode}
                disabled={isLoadingCode}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                title="View code in read-only mode"
              >
                {isLoadingCode ? '🔄 Loading...' : '👁️ View Code'}
              </button>
              
              <button
                type="button"
                onClick={handleEditCode}
                disabled={isLoadingCode}
                className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                title="Edit code with AI assistance"
              >
                {isLoadingCode ? '🔄 Loading...' : '✏️ Edit Code'}
              </button>
            </div>
            
            {isLoadingCode && (
              <div className="mt-2 text-sm text-blue-600">
                🔄 Loading existing code from: {pipeline.f_file_uid?.path}/{pipeline.f_file_uid?.uid}{pipeline.f_file_uid?.extension ? '.' + pipeline.f_file_uid.extension : ''}
              </div>
            )}
            
            {!isLoadingCode && currentCode && (
              <div className="mt-2 text-sm text-gray-600">
                ✅ Code loaded ({currentCode.split('\n').length} lines)
                <br />
                📁 File: {pipeline.f_file_uid?.uid}
              </div>
            )}
          </div>

          <ModalInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <ModalInput
            label="Type"
            value={pipeline.type}
            readOnly
          />
          <ModalInput 
            label="File Extension" 
            value={pipeline.f_file_uid?.extension || 'py'} 
            readOnly 
          />
          <ModalInput
            label="Created Time"
            value={pipeline.created_time}
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

      {/* use CodeEditor with dynamic pipeline context */}
      {isCodeEditorOpen && (
        <CodeEditor
          initialCode={currentCode}
          onSave={isViewMode ? undefined : handleCodeSave}
          onClose={handleCodeClose}
          fileName={`${formData.name}.py`}
          isOpen={isCodeEditorOpen}
          isReadOnly={isViewMode}
          pipelineType={pipelineType || pipeline.type || "preprocessing"} // Use passed prop, fallback to pipeline type
        />
      )}
    </>
  );
};

export const DeleteModal = ({ pipeline, onClose, onDelete }) => {
  const entityName = `${pipeline.type} Pipeline`;

  return (
    <BaseDeleteModal
      entity={pipeline}
      entityName={entityName}
      onClose={onClose}
      onDelete={onDelete}
      handleDelete={HandleDelete}
    />
  );
};
