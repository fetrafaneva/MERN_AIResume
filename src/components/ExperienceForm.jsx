import { Plus } from "lucide-react";
import React from "react";

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    {
      /** index représente la position de l’élément à supprimer dans le tableau data */
    }
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

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
        <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors ">
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
