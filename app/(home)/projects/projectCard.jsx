import React from "react";
import { useRouter } from "next/navigation";

const ProjectCard = ({project}) => {
  const router = useRouter();
  
  const handleDatasetsClick=()=>{
    router.push(`/projects/${project.name}/datasets`);
  }

  const handleApplicationsClick=()=>{
    router.push(`/projects/${project.name}/applications`);
  }
    return(
        <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold p-1">
            {project.name}
          </h2>
          <p className="text-gray-500">{project.date}</p>
        </div>
        <div className="flex space-x-4">
          <button>
            <img src="/project/edit.svg" alt="Edit"/>
          </button>
          <button>
            <img src="/project/delete.svg" alt="Delete"/>
          </button>
          <button onClick={handleDatasetsClick}>
          <div className="transform  hover:scale-105 hover:bg-blue-200 transition-transform flex items-center bg-blue-100 rounded-lg p-2 border border-blue-500 text-blue-500 font-bold">
            <span>Datasets</span>
            <img src="/project/vector_upperRight.svg"/>
          </div>
          </button>
          <button onClick={handleApplicationsClick}>
            <div className="transform  hover:scale-105 hover:bg-blue-200 transition-transform flex items-center bg-blue-100 rounded-lg p-2 border border-blue-500 text-blue-500 font-bold">
              <span>Applications</span>
              <img src="/project/vector_upperRight.svg"/>
            </div>
          </button>
        </div>
      </div>
    )
  }

export default ProjectCard;