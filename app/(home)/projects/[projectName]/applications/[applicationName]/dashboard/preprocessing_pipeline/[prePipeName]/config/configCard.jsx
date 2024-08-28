import React, { useState } from "react";
import { EditModal, DeleteModal } from "./configModal";

export const ConfigCard = ({ config, pipelineName, onEdit, onDelete }) => {
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

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{config.uid}</div>
        <h2 className="text-xl font-semibold p-1">{config.name}</h2>
        <p className="text-gray-500">{config.description}</p>
      </div>
      <div className="space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button>
          <img src="/project/download.svg" alt="Download" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          config={config}
          pipelineName={pipelineName}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          config={config}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
