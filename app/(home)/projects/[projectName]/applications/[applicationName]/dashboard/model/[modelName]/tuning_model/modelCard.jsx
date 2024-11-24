import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal, UploadInferenceModal } from "./modelModal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HandlePublishToggle, useGetInference } from "./service";
import { useToast } from "@/components/ui/use-toast";
import { HandleDownloadFile } from "@/app/downloadFile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ModelCard = React.memo(
  ({
    model,
    onEdit,
    onDelete,
    onUpload,
    applicationName,
    projectName,
    applicationUID,
  }) => {
    const { inference } = useGetInference(model.uid);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPublish, setIsPublish] = useState(model.status === "publish");
    const [currentModel, setCurrentModel] = useState(null);

    const router = useRouter();

    const { toast } = useToast();

    // Edit modal開啟關閉
    const handleEditClick = (retrainModel) => {
      setIsEditModalOpen(true);
      setCurrentModel(retrainModel);
    };

    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setCurrentModel(null);
    };

    // delete modal開啟關閉
    const handleDeleteClick = (retrainModel) => {
      setIsDeleteModalOpen(true);
      setCurrentModel(retrainModel);
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setCurrentModel(null);
    };

    // download file
    const handleDownloadClick = async (retrainModel) => {
      const { downloadFile } = HandleDownloadFile(retrainModel);
      await downloadFile();
    };

    // upload folder modal開啟關閉
    const handleUploadFolderClick = async (retrainModel) => {
      setIsUploadModalOpen(true);
      setCurrentModel(retrainModel);
    };

    const handleCloseUploadFolderModal = () => {
      setIsUploadModalOpen(false);
      setCurrentModel(null);
    };

    const handlePublishToggle = async () => {
      const response = await HandlePublishToggle(model, onEdit);
      if (response) {
        setIsPublish((prev) => !prev); // 更新本地狀態
        toast({
          description: (
            <span className="text-xl">Status changed successfully !</span>
          ),
          variant: "success",
          duration: 1500,
        });
      } else {
        toast({
          description: <span className="text-xl">Model publishing failed</span>,
          variant: "destructive",
          duration: 1500,
        });
      }
    };
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="model-card">
          <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer mb-4">
            <div>
              <div className="bg-blue-300 rounded-lg p-0.5">{model.uid}</div>
              <h2 className="text-xl font-semibold p-1">{model.name}</h2>
              <p className="text-gray-500">{model.description}</p>
            </div>
            <div className="space-x-4 flex items-center">
              <div className="flex space-x-8 items-center">
                <button onClick={() => handleEditClick(model)}>
                  <img src="/project/edit.svg" alt="Edit" />
                </button>
                <button onClick={() => handleDownloadClick(model)}>
                  <img src="/project/download.svg" alt="Download" />
                </button>
                <button onClick={() => handleDeleteClick(model)}>
                  <img src="/project/delete.svg" alt="Delete" />
                </button>
                <button onClick={() => handleUploadFolderClick(model)}>
                  <img src="/project/folder.svg" alt="Folder" />
                </button>
                {model.status === "unavailable" ? (
                  <div className="flex items-center space-x-1">
                    <Label className="text-red-500 text-lg" htmlFor="publish">
                      Unavailable
                    </Label>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Switch
                      checked={isPublish}
                      onCheckedChange={handlePublishToggle}
                    />
                    <Label className="text-lg" htmlFor="publish">
                      Publish
                    </Label>
                  </div>
                )}
                <div className="flex flex-col items-center space-y-1 bg-gray-200 p-2 rounded">
                  <div>Performance</div>
                  <div className="font-bold text-xl">{model.accuracy}</div>
                </div>
              </div>

              {/* AccordionTrigger區域 */}
              <AccordionTrigger className="bg-gray-200 hover:bg-gray-400 px-4 py-8 ml-2 rounded-lg w-full transition-all duration-300"></AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="py-2 px-8">
            {model.retrain_model.map((retrainModel) => (
              <div key={retrainModel.uid} className="relative bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center cursor-pointer">
                <div>
                  <div className="bg-blue-300 rounded-lg p-0.5">{retrainModel.uid}</div>
                  <h2 className="text-xl font-semibold p-1">{retrainModel.name}</h2>
                  <p className="text-gray-500">{retrainModel.description}</p>
                </div>
                <div className="space-x-8 flex items-center">
                  <button onClick={() => handleEditClick(retrainModel)}>
                    <img src="/project/edit.svg" alt="Edit" />
                  </button>
                  <button onClick={() => handleDownloadClick(retrainModel)}>
                    <img src="/project/download.svg" alt="Download" />
                  </button>
                  <button onClick={() => handleDeleteClick(retrainModel)}>
                    <img src="/project/delete.svg" alt="Delete" />
                  </button>
                  <button onClick={() => handleUploadFolderClick(retrainModel)}>
                    <img src="/project/folder.svg" alt="Folder" />
                  </button>
                  <div className="flex flex-col items-center space-y-1 bg-gray-200 p-2 rounded">
                    <div>Performance</div>
                    <div className="font-bold text-xl">{retrainModel.accuracy}</div>
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>

          {/* 模態框部分 */}
          {isEditModalOpen && (
            <EditModal
              model={currentModel}
              onClose={handleCloseEditModal}
              onEdit={onEdit}
              applicationName={applicationName}
            />
          )}
          {isDeleteModalOpen && (
            <DeleteModal
              model={currentModel}
              onClose={handleCloseDeleteModal}
              onDelete={onDelete}
            />
          )}
          {isUploadModalOpen && (
            <UploadInferenceModal
              modelUID={currentModel.uid}
              onClose={handleCloseUploadFolderModal}
              onUpload={onUpload}
              inference={inference}
            />
          )}
        </AccordionItem>
      </Accordion>
    );
  }
);

export default ModelCard;