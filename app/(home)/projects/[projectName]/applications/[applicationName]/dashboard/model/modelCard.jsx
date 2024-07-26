import React from "react";
import { useFetchModelData } from "./service";

export const ModelCard = ({ model }) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer">
      <div>
        <div className="bg-blue-300 rounded-lg p-0.5">{model.uid}</div>
        <h2 className="text-xl font-semibold p-1">{model.name}</h2>
        <p className="text-gray-500">{model.description}</p>
      </div>
      <div className="space-x-8 ">
        <button>
          <img src="/project/edit.svg" alt="Edit" />
        </button>
        <button>
          <img src="/project/download.svg" alt="Download" />
        </button>
        <button>
          <img src="/project/delete.svg" alt="Delete" />
        </button>
        <button className="bg-gray-200 rounded-xl px-3 py-2 border border-gray-400">
          upload
        </button>
        <button className="bg-gray-200 rounded-xl px-3 py-2 border border-gray-400">
          Performance
        </button>
      </div>
    </div>
  );
};

export default ModelCard;
