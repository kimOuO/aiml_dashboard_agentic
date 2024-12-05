import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal } from "../preprocessing_pipeline/pipelineModal";
import { HandleDownloadFile } from "@/app/downloadFile";

export const PipelineCard = ({
  projectName,
  applicationName,
  organizationUID,
  pipeline,
  path,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/${path}/${pipeline.name}/tasks?pipelineUID=${pipeline.uid}&organizationUID=${organizationUID}`
    );
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDownloadClick = async () => {
    const { downloadFile } = HandleDownloadFile(pipeline);
    await downloadFile();
  };
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div onClick={handlePreprocessingPipelineClick}>
        <div className="bg-blue-300 rounded-lg p-0.5">{pipeline.uid}</div>
        <h2 className="text-xl font-semibold p-1">{pipeline.name}</h2>
        <p className="text-gray-500">{pipeline.description}</p>
      </div>
      <div className="space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button onClick={handleDownloadClick}>
          <img src="/project/download.svg" alt="Download" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          pipeline={pipeline}
          applicationName={applicationName}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
          type="Preprocessing"
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          pipeline={pipeline}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
