import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal, UploadModal } from "./modelModal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HandlePublishToggle } from "./service";
import { useToast } from "@/components/ui/use-toast";
import { HandleDownloadFile } from "@/app/downloadFile";

export const ModelCard = React.memo(
  ({ model, onEdit, onDelete, onUpload, applicationName,projectName,applicationUID }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPublish, setIsPublish] = useState(model.status === "publish");
    const router = useRouter();

    const { toast } = useToast();
    //Edit modal開啟關閉
    const handleEditClick = () => {
      setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
    };

    //delete modal開啟關閉
    const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
    };

    //download file
    const handleDownloadClick = async () => {
      const { downloadFile } = HandleDownloadFile(model);
      await downloadFile();
    };

    //upload folder modal開啟關閉
    const handleUploadFolderClick = () => {
      setIsUploadModalOpen(true);
    };

    const handleCloseUploadFolderModal = () => {
      setIsUploadModalOpen(false);
    };

    const handlePublishToggle = async () => {
      const response = await HandlePublishToggle(model,onEdit);
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

    const handleModelClick = () => {
      router.push(
        `/projects/${projectName}/applications/${applicationName}/dashboard/model/${model.name}/tuning_model?modelUID=${model.uid}&applicationUID=${applicationUID}`
      );
    };

    return (
      <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
        <div onClick={handleModelClick}>
          <div className="bg-blue-300 rounded-lg p-0.5">{model.uid}</div>
          <h2 className="text-xl font-semibold p-1">{model.name}</h2>
          <p className="text-gray-500">{model.description}</p>
        </div>
        <div className="space-x-8 flex items-center">
          <button onClick={handleEditClick}>
            <img src="/project/edit.svg" alt="Edit" />
          </button>
          <button onClick={handleDownloadClick}>
            <img src="/project/download.svg" alt="Download" />
          </button>
          <button onClick={handleDeleteClick}>
            <img src="/project/delete.svg" alt="Delete" />
          </button>
          <button onClick={handleUploadFolderClick}>
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
        {isEditModalOpen && (
          <EditModal
            model={model}
            onClose={handleCloseEditModal}
            onEdit={onEdit}
            applicationName={applicationName}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteModal
            model={model}
            onClose={handleCloseDeleteModal}
            onDelete={onDelete}
          />
        )}
        {isUploadModalOpen && (
          <UploadModal
            modelUID={model.uid}
            onClose={handleCloseUploadFolderModal}
            onUpload={onUpload}
          />
        )}
      </div>
    );
  }
);

export default ModelCard;
