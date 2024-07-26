import React from "react";

export const TaskCard = ({ task }) => {
  console.log(task.status);
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div>
        <h2 className="text-2xl font-semibold p-1 ">
          {task.name}
          <span className="ml-4">
            <TaskStatus status={task.status} />
          </span>
        </h2>
        <p className="text-gray-500">{task.date}</p>
      </div>
      <div className="space-x-8 px-5">
        <button>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
        <button className="bg-gray-200 rounded-xl px-2 py-1 border border-gray-400">
          Log
        </button>
      </div>
    </div>
  );
};

const TaskStatus = ({ status }) => {
  let bgColor = "";
  let textColor = "";
  let dotColor = "";
  let text = "";

  switch (status) {
    case "Success":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      dotColor = "text-blue-500";
      text = "Success";
      break;
    case "Running":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      dotColor = "text-green-500";
      text = "Running";
      break;
    case "Failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      dotColor = "text-red-500";
      text = "Failed";
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
