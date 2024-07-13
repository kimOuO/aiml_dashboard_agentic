// agents/link/[name]/page.jsx
"use client";
import React from "react";
import ToggleButton from "@/components/ui/togglebutton";

const agents = [
  { name: "Inc", date: "2024-05-10 21:17:54" },
  { name: "Inc", date: "2024-05-10 21:17:54" },
  { name: "Inc", date: "2024-05-10 21:17:54" },
];

export default function linkPage({ params }) {
  const { name } = params;
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full mt-[-100px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <div className="flex">
              <a
                href="/agents"
                className="text-slate-500 hover:text-blue-900 duration-300 ease-in-out"
              >
                Agents
              </a>
              <p className="ml-3">/</p>
              <p className="ml-3">{name}</p>
            </div>

            <h1 className="text-3xl font-semibold">Link Applications</h1>
          </div>
        </div>
        <div>
          {agents.map((agent, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center border border-slate-300"
            >
              <div>
                <h2 className="text-xl font-extrabold text-blue-950 mb-2">
                  {agent.name}
                </h2>
                <p className="text-gray-700">{agent.date}</p>
              </div>
              <div className="flex space-x-6">
                <button className="bg-slate-50 text-black text-sm font-bold px-2 py-1 rounded-md border border-slate-500 hover:bg-slate-300">
                  Detail
                </button>
                <ToggleButton />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
