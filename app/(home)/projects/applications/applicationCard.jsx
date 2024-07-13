import React from "react";

const ApplicationCard = ({application}) => {
    return(
        <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="bg-blue-300 rounded-lg p-0.5">
              {application.id}
              </div>
                <h2 className="text-xl font-semibold p-1">{application.name}</h2>
                <p className="text-gray-500">{application.description}</p>
            </div>
            <div className="flex space-x-4">
                <button>
                  <img src="/project/edit.svg" alt="Edit"/>
                </button>
                <button >
                  <img src="/project/delete.svg"/>
                </button>
            </div>
        </div>
    );
}

export default ApplicationCard;