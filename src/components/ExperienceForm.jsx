import React from "react";

const ExperienceForm = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className=" flex items-center gap-2 text-lg font-semibold text-gray-900">
            {" "}
            Professional Summary{" "}
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
          <Sparkles className="size-4" />
          AI Enhance
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
