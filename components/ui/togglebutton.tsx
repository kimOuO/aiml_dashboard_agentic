import { useState } from "react";

const ToggleButton = () => {
  const [linked, setLinked] = useState(true);
  const linkButtonText = linked ? "✓ Link" : "Link";
  const unlinkButtonText = linked ? "Unlink" : "Unlink X";
  return (
    <div className="flex items-center">
      <button
        className={`px-3 py-1 rounded-l-full text-sm font-bold ${
          linked
            ? "bg-green-600 text-white border border-slate-500"
            : "bg-white text-black border border-slate-500"
        }`}
        onClick={() => setLinked(true)}
      >
        {linkButtonText}
      </button>
      <button
        className={`px-3 py-1 rounded-r-full text-sm font-bold ${
          !linked
            ? "bg-red-600 text-white border border-slate-500"
            : "bg-white text-black border border-slate-500"
        }`}
        onClick={() => setLinked(false)}
      >
        {unlinkButtonText}
      </button>
    </div>
  );
};

export default ToggleButton;
