
import React, { useState } from "react";
import { DeleteModal, EditModal } from "./rawDataModal";
import { HandleDownloadFile } from "@/app/downloadFile";

export default function RawDataCard({
  rawData,
  onEdit,
  onDelete,
  applicationName,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    const { downloadFile } = HandleDownloadFile(rawData);
    await downloadFile();
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{rawData.uid}</div>
        <h2 className="text-xl font-semibold p-1">{rawData.name}</h2>
        <p className="text-gray-500">{rawData.description}</p>
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
          rawData={rawData}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
          applicationName={applicationName}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          rawData={rawData}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
