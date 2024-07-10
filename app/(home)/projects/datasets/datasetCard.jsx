import React from "react";

const DatasetCard = ({dataset}) => {
    return(
        <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
            <div>
                <h3>{dataset.id}</h3>
                <h2 className="text-xl font-semibold">{dataset.name}</h2>
                <p className="text-gray-500">{dataset.description}</p>
            </div>
            <div className="flex space-x-4">
                <button>
                  <img src="/project/edit.svg" alt="Edit"/>
                </button>
                <button>
                  <img src="/project/download.svg"/>
                </button>
                <button >
                  <img src="/project/delete.svg"/>
                </button>
            </div>
        </div>
    );
}

export default DatasetCard;