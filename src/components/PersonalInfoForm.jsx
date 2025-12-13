import { User } from "lucide-react";
import React from "react";

const PersonalInfoForm = ({
  data,
  onchange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onchange({ ...data, [field]: value });
  };

  return (
    <div>
      <h3 className=" text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className=" text-sm text-gray-600">
        Get Started with the personal information
      </p>

      <div className="flex items-center gap-2">
        {/** si l'image de l'utilisateur est deja dans le database on l'affiche sinon on motre une icon et on demande a l'user de d'entrer son image */}
        <label htmlFor="">
          {data.image ? (
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt="user-image"
              className=" w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className=" inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer">
              <User className="size-10 p-2.5 border rounded-full" />
              Upload user image
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className=" hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>
        {/**verification du type de l'image */}
        {typeof data.image === "object" && (
          <div className=" flex flex-col gap-1 pl-4 text-sm">
            <p>Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
              <input
                type="checkbox"
                className=" sr-only peer"
                onchange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />

              <div className=" w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
