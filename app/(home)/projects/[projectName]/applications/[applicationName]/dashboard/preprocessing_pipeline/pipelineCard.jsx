import React from "react";
import { useRouter } from "next/navigation";

export const PipelineCard = ({ projectName, applicationName, pipeline, path }) => {
  const router = useRouter();

  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/${path}/${pipeline.name}/tasks?pipelineUID=${pipeline.uid}`
    );
  };
  return (
    <div
      className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer"
      onClick={handlePreprocessingPipelineClick}
    >
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{pipeline.uid}</div>
        <h2 className="text-xl font-semibold p-1">{pipeline.name}</h2>
        <p className="text-gray-500">{pipeline.description}</p>
      </div>
      <div className="space-x-8 px-5">
        <button>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button>
          <img src="/project/download.svg" alt="Download" />
        </button>
        <button>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
      </div>
    </div>
  );
};
