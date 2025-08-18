// import React, { useState, useEffect } from "react";
// import { ModalInput, ValidateForm, useToastNotification, BaseDeleteModal } from "@/app/modalComponent";
// import { HandleCreate, HandleUpdate, HandleDelete } from "./service";
// import CodeEditor from "@/components/base/CodeEditor";
// import { SMART_CONFIG_GENERATOR } from "@/utils/smartConfigGenerator";

// export const CreateModal = ({
//   pipelineUID,
//   pipelineName,
//   type,
//   onCreate,
//   onClose,
// }) => {
//   const { showToast } = useToastNotification();
//   const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
//   const [currentCode, setCurrentCode] = useState('');
//   const [configStats, setConfigStats] = useState(null);
//   const [isLoadingSmartConfig, setIsLoadingSmartConfig] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     data: "",
//     f_pipeline_uid: pipelineUID,
//   });

//   const [errors, setErrors] = useState({});

//   // 初始化時檢查智能配置可用性
//   useEffect(() => {
//     const checkSmartConfig = async () => {
//       try {
//         console.log('🔍 Checking smart config availability for pipeline:', pipelineUID);
//         const stats = await SMART_CONFIG_GENERATOR.getConfigStats(pipelineUID);
//         setConfigStats(stats);
//         console.log('📊 Config stats:', stats);
//       } catch (error) {
//         console.error('Error checking smart config:', error);
//       }
//     };

//     if (pipelineUID) {
//       checkSmartConfig();
//     }
//   }, [pipelineUID]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // 🆕 生成智能配置
//   const handleGenerateSmartConfig = async () => {
//     setIsLoadingSmartConfig(true);
//     try {
//       console.log('🧠 Generating smart config for pipeline:', pipelineUID);
//       const smartConfig = await SMART_CONFIG_GENERATOR.generateSmartConfig(pipelineUID);
      
//       if (smartConfig && Object.keys(smartConfig).length > 0) {
//         // 🎯 只設置簡潔的 JSON 格式到 data 欄位
//         const configJson = JSON.stringify(smartConfig, null, 2);
//         setCurrentCode(configJson);
//         setFormData(prev => ({
//           ...prev,
//           data: configJson
//           // 🚫 移除 name 和 description 的自動設置
//         }));
        
//         setIsCodeEditorOpen(true);
//         showToast(true, `Smart config generated with ${Object.keys(smartConfig).length} parameters!`);
//       } else {
//         // 如果沒有偵測到參數，使用標準簡潔配置
//         const standardConfig = SMART_CONFIG_GENERATOR.generateStandardSimpleConfig();
//         const configJson = JSON.stringify(standardConfig, null, 2);
//         setCurrentCode(configJson);
//         setFormData(prev => ({
//           ...prev,
//           data: configJson
//           // 🚫 移除 name 和 description 的自動設置
//         }));
        
//         setIsCodeEditorOpen(true);
//         showToast(true, 'Generated standard config template');
//       }
//     } catch (error) {
//       console.error('Error generating smart config:', error);
//       showToast(false, `Error generating smart config: ${error.message}`);
//     } finally {
//       setIsLoadingSmartConfig(false);
//     }
//   };

//   const handleCreateBlankFile = () => {
//     const basicTemplate = {
//       "learning_rate": 0.001,
//       "batch_size": 32,
//       "epochs": 100
//     };
    
//     setCurrentCode(JSON.stringify(basicTemplate, null, 2));
//     setIsCodeEditorOpen(true);
//   };

//   const handleCodeSave = (file, code) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       data: code,
//     }));
//     setCurrentCode(code);
//     setIsCodeEditorOpen(false);
//   };

//   const handleCreateClick = async () => {
//     const fieldsToValidate = ["name", "data"];
//     const validationErrors = ValidateForm(formData, fieldsToValidate);

//     // 驗證 data 是否為有效的 JSON
//     if (formData.data) {
//       try {
//         JSON.parse(formData.data);
//       } catch (error) {
//         validationErrors.data = "Data must be valid JSON format";
//       }
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const dataToSubmit = {
//         ...formData,
//         data: JSON.parse(formData.data),
//       };

//       const response = await HandleCreate(dataToSubmit, onCreate, onClose);
//       if (response.status === 200) {
//         showToast(true);
//       } else {
//         showToast(false);
//       }
//     } catch (error) {
//       console.error("Error creating config:", error);
//       showToast(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Create {type} Config</h2>
        
//         {/* 智能配置狀態顯示 */}
//         {configStats && (
//           <div className={`mb-4 p-4 rounded-md border ${
//             configStats.hasDetected 
//               ? 'bg-green-50 border-green-200' 
//               : 'bg-yellow-50 border-yellow-200'
//           }`}>
//             <h4 className="text-sm font-semibold mb-2">
//               {configStats.hasDetected ? '🎯 Smart Config Available' : 'ℹ️ Smart Config Status'}
//             </h4>
//             <div className="text-xs space-y-1">
//               {configStats.hasDetected ? (
//                 <>
//                   <div>✅ Detected {configStats.detectedCount} parameters from your pipeline</div>
//                   <div>📊 Configuration completeness: {configStats.completeness}%</div>
//                   {configStats.missingCount > 0 && (
//                     <div>➕ Will auto-add {configStats.missingCount} smart defaults</div>
//                   )}
//                   <div className="text-blue-600 font-medium">
//                     Detected: {configStats.detectedParams?.join(', ')}
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-yellow-700">
//                   No parameters detected from pipeline. Will use standard template.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <ModalInput
//           label="Pipeline UID"
//           value={formData.f_pipeline_uid}
//           readOnly
//         />
//         <ModalInput label="Pipeline Name" value={pipelineName} readOnly />
//         <ModalInput
//           label="Name"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           error={errors.name}
//         />
//         <ModalInput
//           label="Description"
//           name="description"
//           value={formData.description}
//           onChange={handleInputChange}
//         />
        
//         {/* Data 欄位與增強的按鈕組 */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Configuration Data
//           </label>
//           <div className="space-y-2">
//             {/* 配置生成按鈕組 */}
//             <div className="flex flex-wrap gap-2">
//               <button
//                 type="button"
//                 onClick={handleGenerateSmartConfig}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 🧠 Generate Smart Config
//               </button>
//             </div>
            
//             {/* JSON 輸入欄位 */}
//             <textarea
//               name="data"
//               value={formData.data}
//               onChange={handleInputChange}
//               className="w-full h-32 shadow appearance-none border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
//               placeholder={configStats?.hasDetected 
//                 ? "Click 'Generate Smart Config' to auto-generate based on your pipeline parameters..."
//                 : "Click 'Generate Standard Config' or enter JSON configuration manually..."
//               }
//             />
//           </div>
//           {errors.data && <span className="text-red-500 text-sm mt-1">{errors.data}</span>}
//         </div>

//         <div className="flex justify-between">
//           <button
//             onClick={handleCreateClick}
//             className="bg-green-700 text-white px-6 py-3 rounded-md font-bold hover:bg-green-800"
//           >
//             Create Config
//           </button>
//           <button
//             onClick={onClose}
//             className="bg-gray-500 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {isCodeEditorOpen && (
//         <CodeEditor
//           initialCode={currentCode}
//           onSave={handleCodeSave}
//           onClose={() => setIsCodeEditorOpen(false)}
//           fileName={`${formData.name || 'config'}.json`}
//           isOpen={isCodeEditorOpen}
//           pipelineType="config"
//         />
//       )}
//     </div>
//   );
// };

// export const EditModal = ({ config, onClose, onEdit, pipelineName }) => {
//   const { showToast } = useToastNotification();
//   const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
//   const [currentCode, setCurrentCode] = useState('');

//   const [formData, setFormData] = useState({
//     uid: config.uid,
//     name: config.name,
//     description: config.description,
//     data: JSON.stringify(config.data, null, 2),
//   });

//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleCodeSave = (file, code) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       data: code,
//     }));
//     setCurrentCode(code);
//     setIsCodeEditorOpen(false);
//   };

//   const handleUpdateClick = async () => {
//     const fieldsToValidate = ["name", "data"];
//     const validationErrors = ValidateForm(formData, fieldsToValidate);

//     if (formData.data) {
//       try {
//         JSON.parse(formData.data);
//       } catch (error) {
//         validationErrors.data = "Data must be valid JSON format";
//       }
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const dataToSubmit = {
//         ...formData,
//         data: JSON.parse(formData.data),
//       };

//       const response = await HandleUpdate(dataToSubmit, onEdit, onClose);
//       if (response.status === 200) {
//         showToast(true);
//       } else {
//         showToast(false);
//       }
//     } catch (error) {
//       console.error("Error updating config:", error);
//       showToast(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Edit Config</h2>
//         <ModalInput label="UID" value={formData.uid} readOnly />
//         <ModalInput label="Pipeline Name" value={pipelineName} readOnly />
//         <ModalInput
//           label="Name"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           error={errors.name}
//         />
//         <ModalInput
//           label="Description"
//           name="description"
//           value={formData.description}
//           onChange={handleInputChange}
//         />
        
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Configuration Data
//           </label>
//           <div className="space-y-2">
//             <button
//               type="button"
//               onClick={() => setIsCodeEditorOpen(true)}
//               className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
//             >
//               ✏️ Edit in Code Editor
//             </button>
            
//             <textarea
//               name="data"
//               value={formData.data}
//               onChange={handleInputChange}
//               className="w-full h-40 shadow appearance-none border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
//               placeholder="Enter JSON configuration data..."
//             />
//           </div>
//           {errors.data && <span className="text-red-500 text-sm mt-1">{errors.data}</span>}
//         </div>

//         <div className="flex justify-between">
//           <button
//             onClick={handleUpdateClick}
//             className="bg-green-700 text-white px-6 py-3 rounded-md font-bold hover:bg-green-800"
//           >
//             Update
//           </button>
//           <button
//             onClick={onClose}
//             className="bg-gray-500 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {isCodeEditorOpen && (
//         <CodeEditor
//           initialCode={currentCode}
//           onSave={handleCodeSave}
//           onClose={() => setIsCodeEditorOpen(false)}
//           fileName={`${formData.name || 'config'}.json`}
//           isOpen={isCodeEditorOpen}
//           pipelineType="config"
//         />
//       )}
//     </div>
//   );
// };

// export const DeleteModal = ({ config, onClose, onDelete }) => {
//   return (
//     <BaseDeleteModal
//       entity={config}
//       entityName="Config"
//       onClose={onClose}
//       onDelete={onDelete}
//       handleDelete={HandleDelete}
//     />
//   );
// };
import React, { useState, useEffect } from "react";
import { ModalInput, ValidateForm, useToastNotification, BaseDeleteModal } from "@/app/modalComponent";
import { HandleCreate, HandleUpdate, HandleDelete } from "./service";
import CodeEditor from "@/components/base/CodeEditor";
import { SMART_CONFIG_GENERATOR } from "@/utils/smartConfigGenerator";

export const CreateModal = ({
  pipelineUID,
  pipelineName,
  type,
  onCreate,
  onClose,
}) => {
  const { showToast } = useToastNotification();
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [configStats, setConfigStats] = useState(null);
  const [isLoadingSmartConfig, setIsLoadingSmartConfig] = useState(false);
  const [suggestedConfig, setSuggestedConfig] = useState(null); // 🆕 儲存建議的配置
  const [showSuggestion, setShowSuggestion] = useState(false); // 🆕 控制顯示建議

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data: "",
    f_pipeline_uid: pipelineUID,
  });

  const [errors, setErrors] = useState({});

  // 初始化時檢查智能配置可用性
  useEffect(() => {
    const checkSmartConfig = async () => {
      try {
        console.log('🔍 Checking smart config availability for pipeline:', pipelineUID);
        const stats = await SMART_CONFIG_GENERATOR.getConfigStats(pipelineUID);
        setConfigStats(stats);
        console.log('📊 Config stats:', stats);
      } catch (error) {
        console.error('Error checking smart config:', error);
      }
    };

    if (pipelineUID) {
      checkSmartConfig();
    }
  }, [pipelineUID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🆕 生成智能配置建議（不直接應用）
  const handleGenerateSmartConfig = async () => {
    setIsLoadingSmartConfig(true);
    try {
      console.log('🧠 Generating smart config for pipeline:', pipelineUID);
      const smartConfig = await SMART_CONFIG_GENERATOR.generateSmartConfig(pipelineUID);
      
      if (smartConfig && Object.keys(smartConfig).length > 0) {
        setSuggestedConfig(smartConfig);
        setShowSuggestion(true);
        showToast(true, `Smart config generated with ${Object.keys(smartConfig).length} parameters! Review and apply if needed.`);
      } else {
        // 如果沒有偵測到參數，使用標準簡潔配置
        const standardConfig = SMART_CONFIG_GENERATOR.generateStandardSimpleConfig();
        setSuggestedConfig(standardConfig);
        setShowSuggestion(true);
        showToast(true, 'Generated standard config template! Review and apply if needed.');
      }
    } catch (error) {
      console.error('Error generating smart config:', error);
      showToast(false, `Error generating smart config: ${error.message}`);
    } finally {
      setIsLoadingSmartConfig(false);
    }
  };

  // 🆕 一鍵套用建議的配置並關閉建議
  const handleApplySuggestion = () => {
    if (suggestedConfig) {
      const configJson = JSON.stringify(suggestedConfig, null, 2);
      setCurrentCode(configJson);
      setFormData(prev => ({
        ...prev,
        data: configJson
      }));
      
      // 立即關閉建議卡片
      setShowSuggestion(false);
      setSuggestedConfig(null);
      
      // 顯示成功訊息
      showToast(true, '✅ Smart config applied successfully! Ready to create.');
      
      console.log('✅ Config applied to form:', configJson);
    }
  };

  // 🆕 拒絕建議的配置
  const handleRejectSuggestion = () => {
    setSuggestedConfig(null);
    setShowSuggestion(false);
    showToast(true, 'Config suggestion dismissed.');
  };

  // 🆕 在編輯器中打開建議的配置
  const handleOpenSuggestionInEditor = () => {
    if (suggestedConfig) {
      const configJson = JSON.stringify(suggestedConfig, null, 2);
      setCurrentCode(configJson);
      setIsCodeEditorOpen(true);
      
      // 關閉建議卡片（因為用戶選擇在編輯器中編輯）
      setShowSuggestion(false);
      setSuggestedConfig(null);
    }
  };

  const handleCreateBlankFile = () => {
    const basicTemplate = {
      "learning_rate": 0.001,
      "batch_size": 32,
      "epochs": 100
    };
    
    setCurrentCode(JSON.stringify(basicTemplate, null, 2));
    setIsCodeEditorOpen(true);
  };

  const handleCodeSave = (file, code) => {
    setFormData((prevData) => ({
      ...prevData,
      data: code,
    }));
    setCurrentCode(code);
    setIsCodeEditorOpen(false);
    
    // 當從編輯器保存後，顯示確認訊息
    showToast(true, '💾 Code saved to form! Ready to create config.');
  };

  const handleCreateClick = async () => {
    const fieldsToValidate = ["name", "data"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);

    // 驗證 data 是否為有效的 JSON
    if (formData.data) {
      try {
        JSON.parse(formData.data);
      } catch (error) {
        validationErrors.data = "Data must be valid JSON format";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        data: JSON.parse(formData.data),
      };

      const response = await HandleCreate(dataToSubmit, onCreate, onClose);
      if (response.status === 200) {
        showToast(true, '🎉 Config created successfully!');
      } else {
        showToast(false, 'Failed to create config');
      }
    } catch (error) {
      console.error("Error creating config:", error);
      showToast(false, 'Error creating config');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create {type} Config</h2>
        
        {/* 智能配置狀態顯示 */}
        {configStats && (
          <div className={`mb-4 p-4 rounded-md border ${
            configStats.hasDetected 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h4 className="text-sm font-semibold mb-2">
              {configStats.hasDetected ? '🎯 Smart Config Available' : 'ℹ️ Smart Config Status'}
            </h4>
            <div className="text-xs space-y-1">
              {configStats.hasDetected ? (
                <>
                  <div>✅ Detected {configStats.detectedCount} parameters from your pipeline</div>
                  <div>📊 Configuration completeness: {configStats.completeness}%</div>
                  {configStats.missingCount > 0 && (
                    <div>➕ Will auto-add {configStats.missingCount} smart defaults</div>
                  )}
                  <div className="text-blue-600 font-medium">
                    Detected: {configStats.detectedParams?.join(', ')}
                  </div>
                </>
              ) : (
                <div className="text-yellow-700">
                  No parameters detected from pipeline. Will use standard template.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🆕 智能配置建議卡片 - 優化版本 */}
        {showSuggestion && suggestedConfig && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                🤖 Smart Config Generated
                <span className="ml-2 bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {Object.keys(suggestedConfig).length} params
                </span>
              </h4>
              <button
                onClick={handleRejectSuggestion}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                title="Dismiss suggestion"
              >
                ×
              </button>
            </div>
            
            {/* 顯示建議的配置預覽 */}
            <div className="bg-white border rounded p-3 mb-4 max-h-32 overflow-y-auto">
              <pre className="text-xs font-mono text-gray-700">
                {JSON.stringify(suggestedConfig, null, 2)}
              </pre>
            </div>
            
            {/* 🎯 主要操作按鈕 - 突出 Apply 按鈕 */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleApplySuggestion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                ✅ Apply & Close
              </button>
              
              <button
                onClick={handleOpenSuggestionInEditor}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium"
              >
                ✏️ Edit in Editor
              </button>
              
              <button
                onClick={handleRejectSuggestion}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium"
              >
                ❌ Dismiss
              </button>
            </div>
            
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
              💡 <strong>Apply & Close</strong> will automatically fill the form and close this suggestion.
              You can then directly create the config or make manual adjustments.
            </div>
          </div>
        )}

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
        
        {/* Data 欄位與增強的按鈕組 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Configuration Data
          </label>
          <div className="space-y-2">
            {/* 配置生成按鈕組 */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerateSmartConfig}
                disabled={isLoadingSmartConfig}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isLoadingSmartConfig ? '🔄 Generating...' : '🧠 Generate Smart Config'}
              </button>
              
              <button
                type="button"
                onClick={handleCreateBlankFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                📄 Basic Template
              </button>
            </div>
            
            {/* JSON 輸入欄位 */}
            <textarea
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full h-32 shadow appearance-none border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={configStats?.hasDetected 
                ? "Click 'Generate Smart Config' to get AI-suggested parameters based on your pipeline..."
                : "Click 'Generate Smart Config' for standard template or enter JSON configuration manually..."
              }
            />
            
            {/* 手動編輯器按鈕 */}
            {formData.data && (
              <button
                type="button"
                onClick={() => {
                  setCurrentCode(formData.data);
                  setIsCodeEditorOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                ✏️ Edit in Code Editor
              </button>
            )}
            
            {/* 🆕 顯示當前配置狀態 */}
            {formData.data && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                ✅ Configuration ready ({JSON.stringify(JSON.parse(formData.data), null, 0).length} characters)
              </div>
            )}
          </div>
          {errors.data && <span className="text-red-500 text-sm mt-1">{errors.data}</span>}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleCreateClick}
            disabled={!formData.data || !formData.name}
            className={`px-6 py-3 rounded-md font-bold transition-all duration-200 ${
              formData.data && formData.name
                ? 'bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Config
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {isCodeEditorOpen && (
        <CodeEditor
          initialCode={currentCode}
          onSave={handleCodeSave}
          onClose={() => setIsCodeEditorOpen(false)}
          fileName={`${formData.name || 'config'}.json`}
          isOpen={isCodeEditorOpen}
          pipelineType="config"
        />
      )}
    </div>
  );
};

export const EditModal = ({ config, onClose, onEdit, pipelineName }) => {
  const { showToast } = useToastNotification();
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const [formData, setFormData] = useState({
    uid: config.uid,
    name: config.name,
    description: config.description,
    data: JSON.stringify(config.data, null, 2),
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCodeSave = (file, code) => {
    setFormData((prevData) => ({
      ...prevData,
      data: code,
    }));
    setCurrentCode(code);
    setIsCodeEditorOpen(false);
    
    showToast(true, '💾 Code saved to form!');
  };

  const handleUpdateClick = async () => {
    const fieldsToValidate = ["name", "data"];
    const validationErrors = ValidateForm(formData, fieldsToValidate);

    if (formData.data) {
      try {
        JSON.parse(formData.data);
      } catch (error) {
        validationErrors.data = "Data must be valid JSON format";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        data: JSON.parse(formData.data),
      };

      const response = await HandleUpdate(dataToSubmit, onEdit, onClose);
      if (response.status === 200) {
        showToast(true, '🎉 Config updated successfully!');
      } else {
        showToast(false, 'Failed to update config');
      }
    } catch (error) {
      console.error("Error updating config:", error);
      showToast(false, 'Error updating config');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Config</h2>
        <ModalInput label="UID" value={formData.uid} readOnly />
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
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Configuration Data
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrentCode(formData.data);
                setIsCodeEditorOpen(true);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
            >
              ✏️ Edit in Code Editor
            </button>
            
            <textarea
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full h-40 shadow appearance-none border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter JSON configuration data..."
            />
          </div>
          {errors.data && <span className="text-red-500 text-sm mt-1">{errors.data}</span>}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleUpdateClick}
            className="bg-green-700 text-white px-6 py-3 rounded-md font-bold hover:bg-green-800"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {isCodeEditorOpen && (
        <CodeEditor
          initialCode={currentCode}
          onSave={handleCodeSave}
          onClose={() => setIsCodeEditorOpen(false)}
          fileName={`${formData.name || 'config'}.json`}
          isOpen={isCodeEditorOpen}
          pipelineType="config"
        />
      )}
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