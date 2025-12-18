import React, { useState } from "react";

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };
  return (
    <div className=" space-y-4">
      <div>
        <h3 className=" flex items-center gap-2 text-lg font-semibold text-gray-900">
          Skills
        </h3>
        <p className=" text-sm text-gray-500">
          {" "}
          Add your technical and soft skills{" "}
        </p>
      </div>

      <div className="">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript, Project Management"
          className="flex-1 px-3 text-sm"
          onChange={(e) => setNewSkill(e.target.value)}
          value={newSkill}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default SkillsForm;
