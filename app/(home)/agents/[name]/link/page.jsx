// agents/link/[name]/page.jsx
"use client";
import React from "react";
import ToggleButton from "@/components/ui/togglebutton";

const Link = [
  { name: "Inc", date: "2024-05-10 21:17:54" },
  { name: "Inc", date: "2024-05-10 21:17:54" },
  { name: "Inc", date: "2024-05-10 21:17:54" },
];

export default function linkPage({ params }) {
  const { name } = params;
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div>
          <p>Agents / {name}</p>
        </div>
        <div className="flex items-center mb-6 space-x-4">
          <button>
            <img src="/project/vector_left.svg" />
          </button>
          <p className="text-3xl">Link Applications</p>
        </div>
        <div className="mx-auto"></div>
      </div>

      <div>
        {Link.map((agent, index) => (
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
  );
}
