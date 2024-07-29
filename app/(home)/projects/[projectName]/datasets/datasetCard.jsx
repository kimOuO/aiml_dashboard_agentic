import React, { useState } from "react";
import { DeleteModal,EditModal } from "./datasetModal";

export default function DatasetCard ({ dataset, onEdit, onDelete, projectName })  {
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
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{dataset.uid}</div>
        <h2 className="text-xl font-semibold p-1">{dataset.name}</h2>
        <p className="text-gray-500">{dataset.description}</p>
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
          dataset={dataset}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
          projectName={projectName}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          dataset={dataset}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
