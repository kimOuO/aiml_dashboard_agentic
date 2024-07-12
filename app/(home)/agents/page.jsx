// agents/page.jsx
"use client";
import React from "react";
import Link from "next/link";

const agents = [
  { name: "James-LLC", date: "2024-05-10 21:17:54" },
  { name: "James-LLC", date: "2024-05-10 21:17:54" },
  { name: "James-LLC", date: "2024-05-10 21:17:54" },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full mt-[-100px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold mb-3">Agents</h1>
            <a
              href="/projects"
              className="text-slate-700 underline hover:text-blue-900 transition duration-300 ease-in-out"
              onClick={(e) => {
                Link.href = "/agents/link";
              }}
            >
              Agent Dashboard
            </a>
          </div>
          <button className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-900">
            Create New Agent
          </button>
        </div>
        <div>
          {agents.map((agent, index) => (
            <Link
              href={`/agents/link/[name]`}
              as={`/agents/link/${agent.name}`}
            >
              <div
                key={index}
                className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center border border-slate-300 w-full"
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-extrabold text-blue-950 mb-2">
                    {agent.name}
                  </h2>
                  <p className="text-gray-700">{agent.date}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="bg-slate-50 text-black text-sm font-bold px-2 py-1 rounded-md border border-slate-500 hover:bg-slate-300">
                    Detail
                  </button>
                  <button className="bg-slate-50 text-black text-sm font-bold px-2 py-1 rounded-md border border-slate-500 hover:bg-slate-300">
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
