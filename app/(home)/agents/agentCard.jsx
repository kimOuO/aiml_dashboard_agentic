import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal } from "./agentModal";

const AgentCard = ({ agent, onEdit, onDelete, organization }) => {
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

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold p-1">{agent.name}</h2>
        <p className="text-gray-500">{agent.description}</p>
        <p className="text-gray-500">{agent.created_time}</p>
      </div>
      <div className="flex space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          project={agent}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
          organizationName={organization.name}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          project={agent}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default AgentCard;
