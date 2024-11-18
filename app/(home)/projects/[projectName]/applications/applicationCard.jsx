import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal } from "./applicationModal";

export default function ApplicationCard({
  projectName,
  organizationUID,
  application,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

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

  const handleApplicationClick = () => {
    router.push(
      `/projects/${projectName}/applications/${application.name}/dashboard?applicationUID=${application.uid}&organizationUID=${organizationUID}`
    );
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div className={"cursor-pointer"} onClick={handleApplicationClick}>
        <div className="bg-blue-300 rounded-lg p-0.5">{application.uid}</div>
        <h2 className="text-xl font-semibold p-1">{application.name}</h2>
        <p className="text-gray-500">{application.description}</p>
      </div>
      <div className="space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          application={application}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
          projectName={projectName}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          application={application}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
