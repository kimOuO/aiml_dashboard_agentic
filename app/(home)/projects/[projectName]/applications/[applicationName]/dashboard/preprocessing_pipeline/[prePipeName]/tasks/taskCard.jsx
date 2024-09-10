import React, { useState } from "react";
import { EditModal, DeleteModal } from "./taskModal";
import { HandlePrintLog } from "@/app/downloadFile";

export const TaskCard = ({ task, pipelineName, onEdit, onDelete, type }) => {
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

  //
  const handleDownloadClick = async () => {
    const { PrintLog } = HandlePrintLog({ task });
    await PrintLog();
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div>
        <h2 className="text-2xl font-semibold p-1 ">
          {task.name}
          <span className="ml-4 space-x-4">
            <TaskExecute execute_step={task.execute_step} />
            <TaskStatus status={task.status} />
          </span>
        </h2>
        <p className="text-gray-500">{task.date}</p>
      </div>
      <div className="space-x-8 px-5">
        <button onClick={handleEditClick}>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button onClick={handleDeleteClick}>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
        <button
          className="bg-gray-200 rounded-xl px-2 py-1 border border-gray-400"
          onClick={handleDownloadClick}
        >
          Log
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          task={task}
          pipelineName={pipelineName}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          task={task}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

const TaskExecute = ({ execute_step }) => {
  let bgColor = "";
  let textColor = "";
  let dotColor = "";
  let text = "";

  switch (execute_step) {
    case "prepare_file":
      bgColor = "bg-slate-100";
      textColor = "text-slate-800";
      dotColor = "text-slate-500";
      text = "Prepare File";
      break;
    case "execute_pipeline":
      bgColor = "bg-teal-100";
      textColor = "text-teal-800";
      dotColor = "text-teal-500";
      text = "Execute Pipeline";
      break;
    case "run_task":
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-800";
      dotColor = "text-indigo-500";
      text = "Run Task";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      dotColor = "text-gray-500";
      text = "Unknown";
  }

  return (
    <div
      className={`inline-flex items-center ${bgColor} ${textColor} text-sm font-medium px-2.5 py-0.5 rounded `}
    >
      <svg
        className={`w-2.5 h-2.5 mr-1.5 ${dotColor}`}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" r="3"></circle>
      </svg>
      {text}
    </div>
  );
};

const TaskStatus = ({ status }) => {
  let bgColor = "";
  let textColor = "";
  let dotColor = "";
  let text = "";

  switch (status) {
    case "init":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      dotColor = "text-yellow-500";
      text = "Init";
      break;
    case "init error":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      dotColor = "text-orange-500";
      text = "Init Error";
      break;
    case "pending":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      dotColor = "text-purple-500";
      text = "Pending";
      break;
    case "running":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      dotColor = "text-green-500";
      text = "Running";
      break;
    case "success":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      dotColor = "text-blue-500";
      text = "Success";
      break;
    case "fail":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      dotColor = "text-red-500";
      text = "Fail";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      dotColor = "text-gray-500";
      text = "Unknown";
  }

  return (
    <div
      className={`inline-flex items-center ${bgColor} ${textColor} text-sm font-medium px-2.5 py-0.5 rounded `}
    >
      <svg
        className={`w-2.5 h-2.5 mr-1.5 ${dotColor}`}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" r="3"></circle>
      </svg>
      {text}
    </div>
  );
};
