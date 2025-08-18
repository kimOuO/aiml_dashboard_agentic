// // // import React, { useState, useEffect } from "react";
// // // import { HandleDelete, HandleUpdate, HandleCreate } from "./service";
// // // import {
// // //   ModalInput,
// // //   BaseDeleteModal,
// // //   ValidateForm,
// // //   FileInput,
// // // } from "@/app/modalComponent";
// // // import { useToastNotification } from "@/app/modalComponent";
// // // import CodeEditor from "@/components/base/CodeEditor";
// // // import { getAPI } from "@/app/api/entrypoint";
// // // import APIKEYS from "@/app/api/api_key.json";
// // // import { PIPELINE_TEMPLATES } from '@/utils/pipelineTemplates';

// // // export const CreateModal = ({
// // //   applicationUID,
// // //   applicationName,
// // //   type,
// // //   onCreate,
// // //   onClose,
// // //   pipelineType,
// // // }) => {
// // //   const { showToast } = useToastNotification();
// // //   const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
// // //   const [currentCode, setCurrentCode] = useState('');

// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     description: "",
// // //     type,
// // //     f_application_uid: applicationUID,
// // //     file: null,
// // //     extension: "py",
// // //   });

// // //   const [errors, setErrors] = useState({});

// // //   //暫存更新的value
// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData({
// // //       ...formData,
// // //       [name]: value,
// // //     });
// // //   };

// // //   const handleFileChange = (file) => {
// // //     setFormData({
// // //       ...formData,
// // //       file: file,
// // //     });

// // //     // If it's a Python file, read its content for the editor
// // //     if (file && file.name.endsWith('.py')) {
// // //       const reader = new FileReader();
// // //       reader.onload = (e) => {
// // //         setCurrentCode(e.target.result);
// // //       };
// // //       reader.readAsText(file);
// // //     }
// // //   };

// // //   const handleOpenCodeEditor = () => {
// // //     setIsCodeEditorOpen(true);
// // //   };

// // //   const handleCreateBlankFile = () => {
// // //     // Check if there's already a file uploaded
// // //     if (formData.file) {
// // //       const confirmOverwrite = window.confirm(
// // //         `You have already uploaded "${formData.file.name}". Creating a blank file will replace it. Do you want to continue?`
// // //       );
      
// // //       if (!confirmOverwrite) {
// // //         return; // User cancelled, don't proceed
// // //       }
// // //     }

// // //     const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
// // //     // Use the utility to generate template code
// // //     const blankCode = PIPELINE_TEMPLATES.generateTemplate(type);

// // //     // Create a file object for the blank template
// // //     const blob = new Blob([blankCode], { type: 'text/plain' });
// // //     const templateFile = new File([blob], fileName, {
// // //       type: 'text/plain',
// // //       lastModified: Date.now()
// // //     });

// // //     // Update form data with the new blank file
// // //     setFormData({
// // //       ...formData,
// // //       file: templateFile
// // //     });
    
// // //     setCurrentCode(blankCode);
// // //     setIsCodeEditorOpen(true);
    
// // //     showToast(true, 'Blank template created! You can now edit it in the code editor.');
// // //   };

// // //   const handleCodeSave = (file, code) => {
// // //     // Create a proper File object with the correct properties
// // //     const blob = new Blob([code], { type: 'text/plain' });
// // //     const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
// // //     // Create a File object that behaves more like a real uploaded file
// // //     const codeFile = new File([blob], fileName, {
// // //       type: 'text/plain',
// // //       lastModified: Date.now()
// // //     });
    
// // //     setFormData({
// // //       ...formData,
// // //       file: file
// // //     });
// // //     setCurrentCode(code);
// // //     setIsCodeEditorOpen(false);
// // //   };

// // //   const handleCreateClick = async () => {
// // //     const fieldsToValidate = ["name", "file"];
// // //     const validationErrors = ValidateForm(formData, fieldsToValidate);
// // //     setErrors(validationErrors);

// // //     if (Object.keys(validationErrors).length === 0) {
// // //       const response = await HandleCreate(formData, onCreate, onClose);
// // //       // 根據 response 顯示對應的 toast
// // //       showToast(response && response.status === 200);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
// // //         <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
// // //           <h2 className="text-2xl font-bold mb-4">Upload {type} pipeline</h2>
// // //           <ModalInput
// // //             label="Application UID"
// // //             value={formData.f_application_uid}
// // //             readOnly
// // //           />
// // //           <ModalInput label="Application Name" value={applicationName} readOnly />
// // //           <ModalInput
// // //             label="Pipeline Name"
// // //             name="name"
// // //             value={formData.name}
// // //             onChange={handleInputChange}
// // //             error={errors.name}
// // //           />
// // //           <ModalInput label="Type" name="type" value={formData.type} readOnly />
          
// // //           <div className="mb-4">
// // //             <FileInput
// // //               label="Pipeline File"
// // //               onChange={handleFileChange}
// // //               accept=".py"
// // //               error={errors.file}
// // //             />
            
// // //             {/* Code Editor Actions */}
// // //             <div className="mt-2 flex gap-2">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCreateBlankFile}
// // //                 className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700"
// // //                 title={formData.file ? "This will replace your uploaded file" : "Create a new blank template"}
// // //               >
// // //                 🆕 Create Blank Template
// // //                 {formData.file && <span className="ml-1 text-yellow-200">⚠️</span>}
// // //               </button>
              
// // //               {formData.file && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={handleOpenCodeEditor}
// // //                   className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700"
// // //                 >
// // //                   ✏️ Edit Code
// // //                 </button>
// // //               )}
// // //             </div>
            
// // //             {formData.file && (
// // //               <div className="mt-2 text-sm text-gray-600">
// // //                 📄 Selected: {formData.file.name}
// // //               </div>
// // //             )}
// // //           </div>

// // //           <ModalInput
// // //             label="Pipeline Description"
// // //             name="description"
// // //             value={formData.description}
// // //             onChange={handleInputChange}
// // //             error={errors.description}
// // //           />
          
// // //           <div className="flex justify-between">
// // //             <button
// // //               onClick={handleCreateClick}
// // //               className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
// // //             >
// // //               Create
// // //             </button>
// // //             <button
// // //               onClick={onClose}
// // //               className="bg-blue-700 text-white px-4 py-2 rounded-md font-bold"
// // //             >
// // //               Close
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <CodeEditor
// // //         initialCode={currentCode}
// // //         onSave={handleCodeSave}
// // //         onClose={() => setIsCodeEditorOpen(false)}
// // //         fileName={formData.name ? `${formData.name}.py` : 'pipeline.py'}
// // //         isOpen={isCodeEditorOpen}
// // //         pipelineType={pipelineType || type || "preprocessing"}
// // //       />
// // //     </>
// // //   );
// // // };

// // // export const EditModal = ({ pipeline, onClose, onEdit, applicationName, pipelineType }) => {
// // //   const { showToast } = useToastNotification();
// // //   const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
// // //   const [isViewMode, setIsViewMode] = useState(false);
// // //   const [currentCode, setCurrentCode] = useState('');
// // //   const [isLoadingCode, setIsLoadingCode] = useState(false);
  
// // //   const [formData, setFormData] = useState({
// // //     file: pipeline.f_file_uid,
// // //     uid: pipeline.uid,
// // //     name: pipeline.name,
// // //     description: pipeline.description,
// // //   });

// // //   // Auto-fetch existing code when modal opens using existing download API
// // //   useEffect(() => {
// // //     const fetchExistingCodeUsingDownloadAPI = async () => {
// // //       if (pipeline.f_file_uid && typeof pipeline.f_file_uid === 'object') {
// // //         setIsLoadingCode(true);
// // //         try {
// // //           console.log('Fetching code using download API for file:', pipeline.f_file_uid);
          
// // //           // Build file path from the existing file structure - using the CORRECT pattern from downloadFile.jsx
// // //           const fileInfo = pipeline.f_file_uid;
// // //           let file_path = fileInfo.path + "/" + pipeline.uid; // Use fileInfo.uid, NOT pipeline.uid
          
// // //           // Add extension if it exists
// // //           if (fileInfo.extension && fileInfo.extension !== "null") {
// // //             file_path += "." + fileInfo.extension;
// // //           }
          
// // //           console.log('Constructed file path:', file_path);
          
// // //           // Use the existing download API
// // //           const data = { file_path: file_path };
// // //           const response = await getAPI(APIKEYS.DOWNLOAD_FILE, data, false, true);
          
// // //           if (response.status === 200) {
// // //             // The response.data should contain the file content as text
// // //             let fileContent = '';
            
// // //             if (typeof response.data === 'string') {
// // //               fileContent = response.data;
// // //             } else if (response.data instanceof Blob) {
// // //               fileContent = await response.data.text();
// // //             } else {
// // //               // If it's ArrayBuffer or other format, convert to text
// // //               const blob = new Blob([response.data], { type: 'text/plain' });
// // //               fileContent = await blob.text();
// // //             }
            
// // //             setCurrentCode(fileContent);
// // //             console.log('Code loaded successfully, length:', fileContent.length);
            
// // //           } else {
// // //             throw new Error(`API returned status: ${response.status}`);
// // //           }
          
// // //         } catch (error) {
// // //           console.error('Failed to load existing file content:', error);
// // //           setCurrentCode(`# Failed to load existing content for file: ${pipeline.f_file_uid?.uid}
// // // # Error: ${error.message}
// // // # File path attempted: ${pipeline.f_file_uid?.path}/${pipeline.f_file_uid?.uid}${pipeline.f_file_uid?.extension ? '.' + pipeline.f_file_uid.extension : ''}
// // // # You can add your code here

// // // def main():
// // //     """
// // //     Main ${pipeline.type.toLowerCase()} pipeline function
// // //     """
// // //     print("Starting ${pipeline.type.toLowerCase()} pipeline...")
    
// // //     # Add your ${pipeline.type.toLowerCase()} logic here
// // //     pass

// // // if __name__ == '__main__':
// // //     main()
// // // `);
// // //         } finally {
// // //           setIsLoadingCode(false);
// // //         }
// // //       } else {
// // //         // No file UID object, provide template
// // //         setCurrentCode(PIPELINE_TEMPLATES.generateTemplate(pipeline.type));
// // //       }
// // //     };

// // //     fetchExistingCodeUsingDownloadAPI();
// // //   }, [pipeline.f_file_uid, pipeline.type, pipeline.uid]);

// // //   //暫存更新的value
// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData({
// // //       ...formData,
// // //       [name]: value,
// // //     });
// // //   };

// // //   const handleFileChange = (file) => {
// // //     setFormData({
// // //       ...formData,
// // //       file: file,
// // //     });

// // //     if (file && file.name.endsWith('.py')) {
// // //       const reader = new FileReader();
// // //       reader.onload = (e) => {
// // //         setCurrentCode(e.target.result);
// // //       };
// // //       reader.readAsText(file);
// // //     }
// // //   };

// // //   const handleEditCode = () => {
// // //     setIsViewMode(false);
// // //     setIsCodeEditorOpen(true);
// // //   };

// // //   const handleViewCode = () => {
// // //     setIsViewMode(true);
// // //     setIsCodeEditorOpen(true);
// // //   };

// // //   const handleCodeSave = (file, code) => {
// // //     setFormData({
// // //       ...formData,
// // //       file: file
// // //     });
// // //     setCurrentCode(code);
// // //     setIsCodeEditorOpen(false);
// // //   };

// // //   const handleCodeClose = () => {
// // //     setIsCodeEditorOpen(false);
// // //     setIsViewMode(false);
// // //   };

// // //   const handleUpdateClick = async () => {
// // //     const updatedFormData = {...formData};
// // //     if(formData.file !== pipeline.f_file_uid){
// // //       updatedFormData.file = formData.file;
// // //     }else{
// // //       delete updatedFormData.file
// // //     }
    
// // //     const response = await HandleUpdate(updatedFormData, onEdit, onClose);
// // //     showToast(response && response.status === 200);
// // //   };

// // //   return (
// // //     <>
// // //       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
// // //         <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
// // //           <h2 className="text-2xl font-bold mb-4">{pipeline.type} pipeline</h2>
// // //           <ModalInput label="Application" value={applicationName} readOnly />
// // //           <ModalInput label="UID" value={formData.uid} readOnly />
// // //           <ModalInput
// // //             label="Name"
// // //             name="name"
// // //             value={formData.name}
// // //             onChange={handleInputChange}
// // //           />
          
// // //           <div className="mb-4">
// // //             <FileInput
// // //               label="Pipeline File"
// // //               file={pipeline.f_file_uid?.uid || 'No file'}
// // //               onChange={handleFileChange}
// // //               accept=".py"
// // //             />
            
// // //             <div className="mt-2 flex gap-2">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleViewCode}
// // //                 disabled={isLoadingCode}
// // //                 className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
// // //                 title="View code in read-only mode"
// // //               >
// // //                 {isLoadingCode ? '🔄 Loading...' : '👁️ View Code'}
// // //               </button>
              
// // //               <button
// // //                 type="button"
// // //                 onClick={handleEditCode}
// // //                 disabled={isLoadingCode}
// // //                 className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
// // //                 title="Edit code with AI assistance"
// // //               >
// // //                 {isLoadingCode ? '🔄 Loading...' : '✏️ Edit Code'}
// // //               </button>
// // //             </div>
            
// // //             {isLoadingCode && (
// // //               <div className="mt-2 text-sm text-blue-600">
// // //                 🔄 Loading existing code from: {pipeline.f_file_uid?.path}/{pipeline.f_file_uid?.uid}{pipeline.f_file_uid?.extension ? '.' + pipeline.f_file_uid.extension : ''}
// // //               </div>
// // //             )}
            
// // //             {!isLoadingCode && currentCode && (
// // //               <div className="mt-2 text-sm text-gray-600">
// // //                 ✅ Code loaded ({currentCode.split('\n').length} lines)
// // //                 <br />
// // //                 📁 File: {pipeline.f_file_uid?.uid}
// // //               </div>
// // //             )}
// // //           </div>

// // //           <ModalInput
// // //             label="Description"
// // //             name="description"
// // //             value={formData.description}
// // //             onChange={handleInputChange}
// // //           />
// // //           <ModalInput
// // //             label="Type"
// // //             value={pipeline.type}
// // //             readOnly
// // //           />
// // //           <ModalInput 
// // //             label="File Extension" 
// // //             value={pipeline.f_file_uid?.extension || 'py'} 
// // //             readOnly 
// // //           />
// // //           <ModalInput
// // //             label="Created Time"
// // //             value={pipeline.created_time}
// // //             readOnly
// // //           />
// // //           <div className="flex justify-between">
// // //             <button
// // //               onClick={handleUpdateClick}
// // //               className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
// // //             >
// // //               Update
// // //             </button>
// // //             <button
// // //               onClick={onClose}
// // //               className="bg-blue-700 text-white px-4 py-2 rounded-md font-bold"
// // //             >
// // //               Close
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* use CodeEditor with dynamic pipeline context */}
// // //       {isCodeEditorOpen && (
// // //         <CodeEditor
// // //           initialCode={currentCode}
// // //           onSave={isViewMode ? undefined : handleCodeSave}
// // //           onClose={handleCodeClose}
// // //           fileName={`${formData.name}.py`}
// // //           isOpen={isCodeEditorOpen}
// // //           isReadOnly={isViewMode}
// // //           pipelineType={pipelineType || pipeline.type || "preprocessing"} // Use passed prop, fallback to pipeline type
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export const DeleteModal = ({ pipeline, onClose, onDelete }) => {
// // //   const entityName = `${pipeline.type} Pipeline`;

// // //   return (
// // //     <BaseDeleteModal
// // //       entity={pipeline}
// // //       entityName={entityName}
// // //       onClose={onClose}
// // //       onDelete={onDelete}
// // //       handleDelete={HandleDelete}
// // //     />
// // //   );
// // // };
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
import { HYPERPARAMETER_DETECTOR } from "@/utils/hyperparameterDetector";
import { INDEXED_DB_HYPERPARAMETER_STORAGE } from "@/utils/indexedDBHyperparameterStorage";

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
  const [detectedHyperparameters, setDetectedHyperparameters] = useState({});
  const [isRequestingDify, setIsRequestingDify] = useState(false); // 🆕 Dify 請求狀態

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type,
    f_application_uid: applicationUID,
    file: null,
    extension: "py",
  });

  const [errors, setErrors] = useState({});

  // 測試 IndexedDB 和超參數偵測
  useEffect(() => {
    const testSystems = async () => {
      console.log('🔍 Testing hyperparameter detection and IndexedDB...');
      
      // 1. 測試 IndexedDB
      try {
        const db = await INDEXED_DB_HYPERPARAMETER_STORAGE.initDB();
        console.log('✅ IndexedDB initialized successfully');
        db.close();
      } catch (error) {
        console.error('❌ IndexedDB initialization failed:', error);
        showToast(false, `IndexedDB error: ${error.message}`);
      }

      // 2. 測試超參數偵測
      const testCode = `
learning_rate = 0.001
batch_size = 32
epochs = 100
dropout_rate = 0.5
additional_layer = 2

config = {
    "learning_rate": 0.001,
    "batch_size": 32,
    "dropout_rate": 0.5
}

import torch.nn as nn
class Model(nn.Module):
    def __init__(self):
        self.layer1 = nn.Linear(784, 256)
        self.layer2 = nn.Linear(256, 128)
        self.dropout = nn.Dropout(0.3)
`;

      try {
        console.log('🧪 Testing hyperparameter detection...');
        const detected = HYPERPARAMETER_DETECTOR.detectHyperparameters(testCode);
        console.log('✅ Hyperparameter detection test result:', detected);
        
        if (Object.keys(detected).length > 0) {
          showToast(true, `Detection test passed: found ${Object.keys(detected).length} parameters`);
        } else {
          console.warn('⚠️ No parameters detected in test code');
          showToast(false, 'Hyperparameter detection test failed - no parameters found');
        }
      } catch (error) {
        console.error('❌ Hyperparameter detection test failed:', error);
        showToast(false, `Detection error: ${error.message}`);
      }
    };
    
    testSystems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 當檔案改變時，立即分析超參數
  const handleFileChange = (file) => {
    console.log('📁 File changed:', file?.name, 'Type:', type);
    
    setFormData({
      ...formData,
      file: file,
    });

    // 如果是 Python 檔案，讀取內容進行超參數偵測
    if (file && file.name.endsWith('.py')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        setCurrentCode(fileContent);
        
        console.log('📄 File content loaded, length:', fileContent.length);
        console.log('🔍 Pipeline type:', type);
        
        // 如果是 training pipeline，偵測超參數
        if (type === "training") {
          console.log('🎯 Starting hyperparameter detection...');
          
          try {
            const hyperparams = HYPERPARAMETER_DETECTOR.detectHyperparameters(fileContent);
            console.log('✅ Hyperparameters detected:', hyperparams);
            
            setDetectedHyperparameters(hyperparams);
            
            if (Object.keys(hyperparams).length > 0) {
              showToast(true, `🎉 Detected ${Object.keys(hyperparams).length} hyperparameters including dropout_rate and additional_layer`);
              
              // 立即測試儲存到 IndexedDB
              console.log('💾 Testing immediate save to IndexedDB...');
              const testUID = `test_${Date.now()}`;
              const saveResult = await INDEXED_DB_HYPERPARAMETER_STORAGE.saveHyperparameters(testUID, hyperparams);
              console.log('💾 Test save result:', saveResult);
              
              if (saveResult) {
                console.log('✅ Test save successful, verifying...');
                const loadResult = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(testUID);
                console.log('📖 Test load result:', loadResult);
                
                if (loadResult) {
                  showToast(true, 'IndexedDB test successful! Data can be saved and loaded.');
                } else {
                  showToast(false, 'IndexedDB test failed: data could not be loaded');
                }
              } else {
                showToast(false, 'IndexedDB test failed: data could not be saved');
              }
            } else {
              console.log('⚠️ No hyperparameters detected in the code');
              showToast(false, 'No hyperparameters detected in the uploaded file');
            }
          } catch (error) {
            console.error('❌ Error in hyperparameter detection:', error);
            showToast(false, `Error detecting hyperparameters: ${error.message}`);
          }
        } else {
          console.log('ℹ️ Skipping hyperparameter detection for non-training pipeline');
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ File reading error:', error);
        showToast(false, 'Error reading file');
      };
      
      reader.readAsText(file);
    }
  };

  // 🆕 發送檔案到 Dify 請求轉換超參數為 config 形式
  const handleRequestConfigConversion = async () => {
    if (!formData.file || !currentCode) {
      showToast(false, 'Please upload a Python file first');
      return;
    }

    // 檢查是否有偵測到超參數
    if (Object.keys(detectedHyperparameters).length === 0) {
      showToast(false, 'No hyperparameters detected. Please upload a file with hyperparameters first.');
      return;
    }

    setIsRequestingDify(true);
    
    try {
      console.log('🚀 Sending file to Dify for config conversion...');
      
      // 構建偵測到的超參數列表
      const detectedParamsList = Object.entries(detectedHyperparameters)
        .filter(([param, info]) => !param.startsWith('_'))
        .map(([param, info]) => `${param} = ${info.value} (${info.type})`)
        .join('\n');

      const fileName = formData.file.name;
      const query = `請幫我將以下程式碼中的超參數改成從 config 讀取的形式。

檔案名稱: ${fileName}

已偵測到的超參數:
${detectedParamsList}

原始程式碼:
\`\`\`python
${currentCode}
\`\`\`

請幫我：
1. 將已偵測到的超參數改成從 config.get() 的形式讀取
2. 在程式碼開頭加入 config 參數的接收（例如：def main(config): 或 def train(config):）
3. 保持程式碼的其他邏輯不變
4. 提供完整的重構後程式碼

範例格式：
- 原本：learning_rate = 0.001
- 改成：learning_rate = config.get('learning_rate', 0.001)

謝謝！`;

      console.log('📤 Query to send:', query);

      // 🎯 發送到 Dify，使用指定的 user ID
      const response = await fetch(`${process.env.NEXT_PUBLIC_DIFY_BASE_URL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: query,
          response_mode: 'blocking',
          user: 'training_parameter_config_user' // 🎯 指定的用戶 ID
        })
      });

      console.log('📥 Dify response status:', response.status);

      if (!response.ok) {
        throw new Error(`Dify API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Dify response data:', data);

      // 取得 AI 的回應
      const aiResponse = data.answer || data.data?.answer || 'No response received';
      
      // 顯示成功訊息
      showToast(true, '🤖 AI has processed your request! Check the response for config integration suggestions.');
      
      // 如果回應中包含程式碼，可以選擇性地更新編輯器
      const codeBlockRegex = /```python\s*([\s\S]*?)\s*```/g;
      const codeMatches = [...aiResponse.matchAll(codeBlockRegex)];
      
      if (codeMatches.length > 0) {
        const suggestedCode = codeMatches[0][1].trim();
        
        // 詢問用戶是否要用建議的程式碼替換
        const userConfirmed = window.confirm(
          `🤖 AI has converted your hyperparameters to config.get() format!\n\nDetected parameters: ${Object.keys(detectedHyperparameters).filter(p => !p.startsWith('_')).join(', ')}\n\nWould you like to:\n• ✅ Replace current code with config-integrated version\n• ❌ Keep current code\n\nClick OK to replace, Cancel to keep current code.`
        );
        
        if (userConfirmed) {
          setCurrentCode(suggestedCode);
          
          // 更新檔案物件
          const blob = new Blob([suggestedCode], { type: 'text/plain' });
          const updatedFile = new File([blob], fileName, {
            type: 'text/plain',
            lastModified: Date.now()
          });
          
          setFormData(prev => ({
            ...prev,
            file: updatedFile
          }));
          
          showToast(true, '✅ Code updated with config integration! Your hyperparameters now use config.get() format.');
          
          console.log('✅ Code successfully converted to config format');
        }
      } else {
        // 如果沒有找到程式碼，仍然顯示 AI 的回應內容
        console.log('ℹ️ AI response received but no code block found');
        showToast(true, '🤖 AI provided suggestions. Please check the full response for details.');
      }
      
      console.log('✅ Dify config conversion request completed');
      
    } catch (error) {
      console.error('❌ Error sending request to Dify:', error);
      showToast(false, `Failed to send request to Dify: ${error.message}`);
    } finally {
      setIsRequestingDify(false);
    }
  };

  const handleOpenCodeEditor = () => {
    setIsCodeEditorOpen(true);
  };

  const handleCreateBlankFile = () => {
    if (formData.file) {
      const confirmOverwrite = window.confirm(
        `You have already uploaded "${formData.file.name}". Creating a blank file will replace it. Do you want to continue?`
      );
      
      if (!confirmOverwrite) {
        return;
      }
    }

    const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
    // 使用工具生成模板程式碼
    const blankCode = PIPELINE_TEMPLATES.generateTemplate(type);

    // 創建檔案物件
    const blob = new Blob([blankCode], { type: 'text/plain' });
    const templateFile = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    });

    // 更新表單數據
    setFormData({
      ...formData,
      file: templateFile
    });
    
    setCurrentCode(blankCode);
    setIsCodeEditorOpen(true);
    
    showToast(true, 'Blank template created! You can now edit it in the code editor.');
  };

  const handleCodeSave = async (file, code) => {
    console.log('💾 Code saved, analyzing for hyperparameters...');
    
    // 創建適當的檔案物件
    const blob = new Blob([code], { type: 'text/plain' });
    const fileName = formData.name ? `${formData.name}.py` : 'pipeline.py';
    
    const codeFile = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    });
    
    setFormData({
      ...formData,
      file: codeFile
    });
    setCurrentCode(code);
    setIsCodeEditorOpen(false);

    // 如果是 training pipeline，重新偵測超參數
    if (type === "training") {
      try {
        const hyperparams = HYPERPARAMETER_DETECTOR.detectHyperparameters(code);
        console.log('🔍 Re-detected hyperparameters after code save:', hyperparams);
        setDetectedHyperparameters(hyperparams);
        
        if (Object.keys(hyperparams).length > 0) {
          showToast(true, `Code saved and detected ${Object.keys(hyperparams).length} hyperparameters`);
        }
      } catch (error) {
        console.error('❌ Error re-detecting hyperparameters:', error);
      }
    }
  };

  const handleCreateClick = async () => {
    console.log('🚀 Creating pipeline with hyperparameters:', detectedHyperparameters);
    
    const fieldsToValidate = ["name", "file"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log('📤 Sending create request...');
        const response = await HandleCreate(formData, onCreate, onClose);
        console.log('📥 Create response:', response);
        
        // 如果創建成功且有偵測到超參數，儲存到 IndexedDB
        if (response && response.status === 200 && Object.keys(detectedHyperparameters).length > 0) {
          // 嘗試多種方式獲取 pipeline UID
          const pipelineUID = response.data?.uid || 
                              response.data?.data?.uid || 
                              response.data?.pipeline?.uid ||
                              response.uid ||
                              `pipeline_${Date.now()}`; // 備用 UID
          
          console.log('🆔 Pipeline UID:', pipelineUID);
          console.log('💾 Saving hyperparameters to IndexedDB...');
          
          try {
            const saveSuccess = await INDEXED_DB_HYPERPARAMETER_STORAGE.saveHyperparameters(
              pipelineUID, 
              detectedHyperparameters
            );
            
            console.log('💾 Save result:', saveSuccess);
            
            if (saveSuccess) {
              console.log(`✅ Hyperparameters saved to IndexedDB for pipeline: ${pipelineUID}`);
              
              // 驗證儲存
              const verifyLoad = await INDEXED_DB_HYPERPARAMETER_STORAGE.loadHyperparameters(pipelineUID);
              console.log('🔍 Verification load:', verifyLoad);
              
              if (verifyLoad) {
                showToast(true, `Pipeline created successfully! ${Object.keys(detectedHyperparameters).length} hyperparameters saved to IndexedDB.`);
              } else {
                showToast(true, `Pipeline created, but verification failed. Data might not be properly saved.`);
              }
            } else {
              showToast(true, `Pipeline created successfully, but failed to save hyperparameters to IndexedDB.`);
            }
          } catch (error) {
            console.error('❌ Error saving hyperparameters to IndexedDB:', error);
            showToast(true, `Pipeline created successfully, but hyperparameters could not be saved to IndexedDB: ${error.message}`);
          }
        } else if (response && response.status === 200) {
          console.log('ℹ️ Pipeline created but no hyperparameters to save');
          showToast(response && response.status === 200, 'Pipeline created successfully (no hyperparameters detected)');
        } else {
          console.log('❌ Pipeline creation failed');
          showToast(false, 'Failed to create pipeline');
        }
      } catch (error) {
        console.error("❌ Error creating pipeline:", error);
        showToast(false, "Failed to create pipeline");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-1/3 max-h-[90vh] overflow-y-auto">
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
            <div className="mt-2 flex gap-2 flex-wrap">
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

              {/* 🆕 Dify Config 轉換按鈕 - 只在 training pipeline 顯示 */}
              {type === "training" && formData.file && currentCode && (
                <button
                  type="button"
                  onClick={handleRequestConfigConversion}
                  disabled={isRequestingDify}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    isRequestingDify
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg'
                  }`}
                  title="Send file to AI for config parameter extraction"
                >
                  {isRequestingDify ? (
                    <>
                      🔄 Requesting AI...
                    </>
                  ) : (
                    <>
                      🤖 AI Config Convert
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* 🆕 顯示 Dify 請求說明 */}
            {type === "training" && formData.file && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                💡 <strong>AI Config Convert:</strong> Send your training file to AI for automatic config parameter extraction and code refactoring
              </div>
            )}
            
            {formData.file && (
              <div className="mt-2 text-sm text-gray-600">
                📄 Selected: {formData.file.name}
              </div>
            )}
          </div>

          {/* 顯示偵測到的超參數 */}
          {type === "training" && Object.keys(detectedHyperparameters).length > 0 && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-semibold text-green-800 mb-2">
                ✅ Detected Hyperparameters ({Object.keys(detectedHyperparameters).length})
              </h4>
              <div className="text-xs text-green-600 max-h-32 overflow-y-auto">
                {Object.entries(detectedHyperparameters).map(([param, info]) => (
                  !param.startsWith('_') && (
                    <div key={param} className="mb-1">
                      <span className="font-medium">{param}</span>: {info.value} 
                      <span className="text-gray-500 ml-1">({info.type})</span>
                      {(param === 'dropout_rate' || param === 'additional_layer') && (
                        <span className="ml-2 text-blue-600 font-semibold">🆕</span>
                      )}
                    </div>
                  )
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2">
                💾 These parameters will be saved to IndexedDB for quick config generation
              </p>
            </div>
          )}

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
        pipelineType={pipelineType || type || "preprocessing"}
      />
    </>
  );
};

// EditModal 和 DeleteModal 保持原來的邏輯
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
// # Error: ${error.message}
// # File path attempted: ${pipeline.f_file_uid?.path}/${pipeline.f_file_uid?.uid}${pipeline.f_file_uid?.extension ? '.' + pipeline.f_file_uid.extension : ''}
// # You can add your code here

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
        <div className="bg-white rounded-lg shadow-lg p-8 w-1/3 max-h-[90vh] overflow-y-auto">
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

// 🆕 發送檔案到 Dify 請求轉換超參數為 config 形式 - 使用 streaming 模式
const handleRequestConfigConversion = async () => {
  if (!formData.file || !currentCode) {
    showToast(false, 'Please upload a Python file first');
    return;
  }

  // 檢查是否有偵測到超參數
  if (Object.keys(detectedHyperparameters).length === 0) {
    showToast(false, 'No hyperparameters detected. Please upload a file with hyperparameters first.');
    return;
  }

  setIsRequestingDify(true);
  let accumulatedResponse = '';
  
  try {
    console.log('🚀 Sending file to Dify for config conversion...');
    
    // 構建偵測到的超參數列表
    const detectedParamsList = Object.entries(detectedHyperparameters)
      .filter(([param, info]) => !param.startsWith('_'))
      .map(([param, info]) => `${param} = ${info.value} (${info.type})`)
      .join('\n');

    const fileName = formData.file.name;
    const query = `請幫我將以下程式碼中的超參數改成從 config 讀取的形式。

檔案名稱: ${fileName}

已偵測到的超參數:
${detectedParamsList}

原始程式碼:
\`\`\`python
${currentCode}
\`\`\`

請幫我：
1. 將已偵測到的超參數改成從 config.get() 的形式讀取
2. 在程式碼開頭加入 config 參數的接收（例如：def main(config): 或 def train(config):）
3. 保持程式碼的其他邏輯不變
4. 提供完整的重構後程式碼

範例格式：
- 原本：learning_rate = 0.001
- 改成：learning_rate = config.get('learning_rate', 0.001)

謝謝！`;

    console.log('📤 Query to send:', query);

    // 🎯 發送到 Dify，使用 streaming 模式
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIFY_BASE_URL}/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: 'streaming', // 🔄 改為 streaming 模式
        user: 'training_parameter_config_user' // 🎯 指定的用戶 ID
      })
    });

    console.log('📥 Dify response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dify API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Dify API request failed with status: ${response.status}`);
    }

    // 🔄 處理 streaming 回應
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream reader');
    }

    const decoder = new TextDecoder();
    
    // 顯示開始處理的訊息
    showToast(true, '🤖 AI is processing your request... Streaming response will be ready soon!');
    
    console.log('📡 Starting to read streaming response...');

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('✅ Streaming completed');
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      console.log('📦 Received chunk:', chunk.substring(0, 100) + '...');
      
      // 處理 SSE 格式的 chunk
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '' || line.startsWith(':')) {
          continue; // 跳過空行和註釋行
        }
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // 移除 'data: ' 前綴
          
          if (data === '[DONE]') {
            console.log('🏁 Stream completed with [DONE]');
            break;
          }
          
          try {
            const jsonData = JSON.parse(data);
            console.log('📋 Parsed JSON data:', jsonData);
            
            // 提取回應內容 (根據 Dify streaming 格式)
            if (jsonData.event === 'message' && jsonData.answer) {
              accumulatedResponse += jsonData.answer;
            } else if (jsonData.event === 'agent_message' && jsonData.answer) {
              accumulatedResponse += jsonData.answer;
            } else if (jsonData.data && jsonData.data.answer) {
              accumulatedResponse += jsonData.data.answer;
            }
            
          } catch (parseError) {
            console.warn('⚠️ Failed to parse JSON chunk:', parseError, 'Raw data:', data);
            // 如果解析失敗，直接累積原始數據
            if (data && data !== '[DONE]') {
              accumulatedResponse += data;
            }
          }
        }
      }
    }

    console.log('📋 Final accumulated response length:', accumulatedResponse.length);
    
    if (!accumulatedResponse || accumulatedResponse.trim() === '') {
      throw new Error('Received empty response from AI');
    }

    // 顯示成功訊息
    showToast(true, '🤖 AI has completed processing! Check the suggestions below.');
    
    // 如果回應中包含程式碼，可以選擇性地更新編輯器
    const codeBlockRegex = /```python\s*([\s\S]*?)\s*```/g;
    const codeMatches = [...accumulatedResponse.matchAll(codeBlockRegex)];
    
    if (codeMatches.length > 0) {
      const suggestedCode = codeMatches[0][1].trim();
      
      // 詢問用戶是否要用建議的程式碼替換
      const userConfirmed = window.confirm(
        `🤖 AI has converted your hyperparameters to config.get() format!\n\nDetected parameters: ${Object.keys(detectedHyperparameters).filter(p => !p.startsWith('_')).join(', ')}\n\nResponse length: ${accumulatedResponse.length} characters\n\nWould you like to:\n• ✅ Replace current code with config-integrated version\n• ❌ Keep current code\n\nClick OK to replace, Cancel to keep current code.`
      );
      
      if (userConfirmed) {
        setCurrentCode(suggestedCode);
        
        // 更新檔案物件
        const blob = new Blob([suggestedCode], { type: 'text/plain' });
        const updatedFile = new File([blob], fileName, {
          type: 'text/plain',
          lastModified: Date.now()
        });
        
        setFormData(prev => ({
          ...prev,
          file: updatedFile
        }));
        
        showToast(true, '✅ Code updated with config integration! Your hyperparameters now use config.get() format.');
        
        // 重新偵測超參數（AI 轉換後的程式碼可能有新的模式）
        if (type === "training") {
          try {
            const newHyperparams = HYPERPARAMETER_DETECTOR.detectHyperparameters(suggestedCode);
            setDetectedHyperparameters(newHyperparams);
            console.log('🔄 Re-detected hyperparameters after AI update:', newHyperparams);
          } catch (error) {
            console.error('❌ Error re-detecting hyperparameters:', error);
          }
        }
        
        console.log('✅ Code successfully converted to config format');
      }
    } else {
      // 如果沒有找到程式碼，顯示完整回應內容
      console.log('ℹ️ AI response received but no code block found');
      console.log('📝 Full response preview:', accumulatedResponse.substring(0, 500));
      
      // 可以考慮顯示回應內容給用戶
      const showFullResponse = window.confirm(
        `🤖 AI provided suggestions but no code block was detected.\n\nResponse received: ${accumulatedResponse.length} characters\n\nWould you like to view the full response in console?`
      );
      
      if (showFullResponse) {
        console.log('📖 Full AI Response:', accumulatedResponse);
      }
      
      showToast(true, '🤖 AI provided suggestions. Check console for full response or try again with different parameters.');
    }
    
    console.log('✅ Dify config conversion request completed successfully');
    
  } catch (error) {
    console.error('❌ Error sending request to Dify:', error);
    
    // 更詳細的錯誤訊息
    let userFriendlyMessage = error.message;
    
    if (error.message.includes('Failed to fetch')) {
      userFriendlyMessage = 'Network error: Cannot connect to Dify API. Please check your internet connection and Dify URL.';
    } else if (error.message.includes('Failed to get response stream reader')) {
      userFriendlyMessage = 'Streaming error: Cannot read response stream. Please try again.';
    } else if (error.message.includes('Received empty response')) {
      userFriendlyMessage = 'AI returned empty response. Please try again with different parameters.';
    }
    
    showToast(false, `❌ ${userFriendlyMessage}`);
    
    // 開發模式下顯示完整錯誤和部分回應
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        accumulatedResponse: accumulatedResponse.substring(0, 500),
        difyConfig: {
          baseUrl: process.env.NEXT_PUBLIC_DIFY_BASE_URL,
          hasApiKey: !!process.env.NEXT_PUBLIC_DIFY_API_KEY
        }
      });
    }
    
  } finally {
    setIsRequestingDify(false);
  }
};