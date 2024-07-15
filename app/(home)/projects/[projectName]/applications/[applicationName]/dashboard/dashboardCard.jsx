import React from "react";
import { useRouter } from "next/navigation";

const ApplicationDashboard = ({projectName,applicationName}) => {
    const router = useRouter();

    const handleModelClick = () => {
        router.push(`/projects/${projectName}/applications/${applicationName}/dashboard/model`);
    }

    const handlePreprocessingPipelineClick = () => {
        router.push(`/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline`);
    }

    const handleTrainingPipelineClick = () => {
        router.push(`/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline`);
    }

    const handleOptimizationDatasetsClick = () => {
        router.push(`/projects/${projectName}/applications/${applicationName}/dashboard/optimization_datasets`); 
    }

    const handleValidationPipelineClick = () => {
        router.push(`/projects/${projectName}/applications/${applicationName}/dashboard/validation_pipeline`); 
    }

    return(
        <div className="space-y-10">
            <div 
                className="relative bg-blue-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-blue-300 "
                onClick={handleModelClick}
            >
                <div className="flex space-x-4">
                    <h2 className=" text-xl font-semibold p-1">Model</h2>
                    <span className="text-2xl font-bold">→</span>
                </div>
            </div>
            <div 
                className="relative bg-orange-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-orange-300"
                onClick={handlePreprocessingPipelineClick}
                >
                <div className="flex space-x-4">
                    <h2 className=" text-xl font-semibold p-1">Preprocessing Pipeline</h2>
                    <span className="text-2xl font-bold">→</span>
                </div>
            </div>
            <div 
                className="relative bg-green-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-green-300"
                onClick={handleTrainingPipelineClick}
                >
                <div className="flex space-x-4">
                    <h2 className=" text-xl font-semibold p-1">Training Pipeline</h2>
                    <span className="text-2xl font-bold">→</span>
                </div>
            </div>
            <div 
                className="relative bg-purple-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-purple-300"
                onClick={handleOptimizationDatasetsClick}
            >
                <div className="flex space-x-4">
                    <h2 className=" text-xl font-semibold p-1">Optimization Datasets</h2>
                    <span className="text-2xl font-bold">→</span>
                </div>
            </div>
            <div 
                className="relative bg-red-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-red-300"
                onClick={handleValidationPipelineClick}
            >
                <div className="flex space-x-4">
                    <h2 className=" text-xl font-semibold p-1">Validation Pipeline</h2>
                    <span className="text-2xl font-bold">→</span>
                </div>
            </div>
        </div>
        
    )
}

export default ApplicationDashboard;