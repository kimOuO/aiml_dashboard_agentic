import React, { useState, useMemo } from "react";
import { EditModal, DeleteModal } from "./taskModal";
import { HandlePrintLog } from "@/app/downloadFile";
import RealtimeLogModal from "@/components/ui/realtime-log-modal";
import { useSingleTaskStatusMonitor } from "@/hooks/useTaskStatusMonitor";

export const TaskCard = ({ task, pipelineName, onEdit, onDelete, type, pipelineUID }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // 只有當 task 狀態為 running 或 pending 時才啟用監控
  const shouldMonitor = useMemo(() => {
    return task.status === 'running' || task.status === 'pending' || task.status === 'init';
  }, [task.status]);

  // 使用狀態監控 hook
  const { taskStatus, isMonitoring } = useSingleTaskStatusMonitor(
    task.uid,
    pipelineUID,
    null, // 使用全域設定的間隔
    shouldMonitor
  );

  // 使用監控的狀態或原始任務狀態
  const currentTask = taskStatus || task;

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
    const { PrintLog } = HandlePrintLog({ task: currentTask, type });
    await PrintLog();
  };

  const handleViewLogsClick = () => {
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div>
        <h2 className="text-2xl font-semibold p-1 ">
          {currentTask.name}
          <span className="ml-4 space-x-4">
            <TaskExecute execute_step={currentTask.execute_step} />
            <TaskStatus status={currentTask.status} isMonitoring={isMonitoring} />
          </span>
        </h2>
        <p className="text-gray-500">{currentTask.date}</p>
        {isMonitoring && (
          <p className="text-blue-500 text-sm">
            🔄 即時監控中...
          </p>
        )}
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
          下載 Log
        </button>
        <button
          className="bg-blue-200 rounded-xl px-2 py-1 border border-blue-400 hover:bg-blue-300"
          onClick={handleViewLogsClick}
        >
          即時 Log
        </button>
      </div>
      {isEditModalOpen && (
        <EditModal
          task={currentTask}
          pipelineName={pipelineName}
          onClose={handleCloseEditModal}
          onEdit={onEdit}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          task={currentTask}
          onClose={handleCloseDeleteModal}
          onDelete={onDelete}
        />
      )}

      {/* 即時 Log 查看模態框 */}
      {isLogModalOpen && (
        <RealtimeLogModal
          isOpen={isLogModalOpen}
          onClose={handleCloseLogModal}
          taskId={currentTask.uid}
          taskName={currentTask.name}
          taskType={type}
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
    case "generate_file":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      dotColor = "text-amber-500";
      text = "Generate File";
      break;
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

const TaskStatus = ({ status, isMonitoring }) => {
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
      className={`inline-flex items-center ${bgColor} ${textColor} text-sm font-medium px-2.5 py-0.5 rounded relative`}
    >
      <svg
        className={`w-2.5 h-2.5 mr-1.5 ${dotColor} ${isMonitoring && (status === 'running' || status === 'pending') ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" r="3"></circle>
      </svg>
      {text}
      {isMonitoring && (
        <div className="absolute -top-1 -right-1 w-2 h-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  );
};
