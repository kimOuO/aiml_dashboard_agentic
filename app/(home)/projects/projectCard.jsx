import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, DeleteModal } from "./projectModal";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDatasetsClick = () => {
    router.push(`/projects/${project.name}/datasets?projectUID=${project.uid}`);
  };

  const handleApplicationsClick = () => {
    router.push(
      `/projects/${project.name}/applications?projectUID=${project.uid}`
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

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold p-1">{project.name}</h2>
        <p className="text-gray-500">{project.description}</p>
        <p className="text-gray-500">{project.created_time}</p>
      </div>
      <div className="flex space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
        <button onClick={handleDatasetsClick}>
          <div className="transform  hover:scale-105 hover:bg-blue-200 transition-transform flex items-center bg-blue-100 rounded-lg p-2 border border-blue-500 text-blue-500 font-bold">
            <span>Datasets</span>
            <img src="/project/vector_upperRight.svg" />
          </div>
        </button>
        <button onClick={handleApplicationsClick}>
          <div className="transform  hover:scale-105 hover:bg-blue-200 transition-transform flex items-center bg-blue-100 rounded-lg p-2 border border-blue-500 text-blue-500 font-bold">
            <span>Applications</span>
            <img src="/project/vector_upperRight.svg" />
          </div>
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          project={project}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          project={project}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default ProjectCard;
