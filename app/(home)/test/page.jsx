"use client";
import { useState } from "react";

export default function Home() {
  const [linked, setLinked] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center">
        <button
          className={`px-4 py-2 rounded-l-full ${
            linked ? "bg-green-600 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setLinked(true)}
        >
          Link
        </button>
        <button
          className={`px-4 py-2 rounded-r-full ${
            !linked ? "bg-green-600 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setLinked(false)}
        >
          Unlink
        </button>
      </div>
    </div>
  );
}
