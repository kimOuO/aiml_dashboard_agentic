"use client";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);

  useEffect(() => {
    setCalculation(() => count * 2);
  }, [count]); // <- add the count variable here

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <p className="text-3xl font-semibold mb-3">Count: {count}</p>
      <button
        className="text-3xl font-semibold mb-3"
        onClick={() => setCount((c) => c + 1)}
      >
        +
      </button>
      <p className="text-3xl font-semibold mb-3">Calculation: {calculation}</p>
    </div>
  );
}
