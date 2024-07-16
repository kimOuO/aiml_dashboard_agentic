import React, { useEffect, useState } from "react";
import { useFetchModelData } from "./service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ModelCard = ({ model, projectName, applicationName }) => {
  const { modelData, isLoading } = useFetchModelData(
    projectName,
    applicationName,
    model.name
  );

  return (
    <div className="mb-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="model-details">
          <div className="border border-gray-300 shadow-md rounded-lg flex justify-between items-center w-full">
            <div className="relative flex justify-between items-center w-full px-5 cursor-pointer">
              <div className="text-left">
                <div className="bg-blue-300 rounded-lg p-0.5">{model.id}</div>
                <h2 className="text-2xl font-semibold p-1">{model.name}</h2>
                <p className="text-gray-500">{model.description}</p>
              </div>
              <div className="space-x-8">
                <button>
                  <img src="/project/edit.svg" alt="Edit" />
                </button>
                <button>
                  <img src="/project/download.svg" alt="Download" />
                </button>
                <button>
                  <img src="/project/delete.svg" alt="Delete" />
                </button>
                <button className="bg-gray-200 rounded-xl px-2 py-2 border border-gray-400">
                  Performance
                </button>
              </div>
            </div>
            <div>
              <AccordionTrigger className="py-14 px-4 border border-gray-300 rounded-md cursor-pointe"></AccordionTrigger>
            </div>
          </div>

          <AccordionContent>
            <div className="mt-2 px-10">
              {isLoading ? (
                <div>Loading ...</div>
              ) : (
                modelData.map((modelData) => (
                  <div
                    key={modelData.id}
                    className="border border-gray-300 relative bg-gray-100 shadow-sm rounded-lg p-4 flex justify-between items-center cursor-pointer mt-2"
                  >
                    <div className="space-y-2">
                      <div className="bg-blue-200 rounded-lg p-0.5">
                        {modelData.id}
                      </div>
                      <h3 className="text-lg font-semibold p-1">
                        {modelData.name}
                      </h3>
                      <p className="text-gray-500">{modelData.description}</p>
                    </div>
                    <div className="space-x-8">
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
                        Log
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className=" relative bg-gray-200 shadow-sm rounded-lg p-4 flex justify-center items-center cursor-pointer mt-2">
                +
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ModelCard;
