import React from "react";
import { useRouter } from "next/navigation";

const ApplicationCard = ({ projectName, application }) => {
  const router = useRouter();

  const handleApplicationClick = () => {
    router.push(
      `/projects/${projectName}/applications/${application.name}/dashboard`
    );
  };
  return (
    <div
      className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer"
      onClick={handleApplicationClick}
    >
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{application.id}</div>
        <h2 className="text-xl font-semibold p-1">{application.name}</h2>
        <p className="text-gray-500">{application.description}</p>
      </div>
      <div className="space-x-8 px-5">
        <button>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
