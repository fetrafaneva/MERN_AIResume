import { User } from "lucide-react";
import React from "react";

const PersonalInfoForm = ({
  data,
  onchange,
  removeBackground,
  setRemoveBackground,
}) => {
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
            <div className="">
              <User className="size-10 p-2.5 border rounded-full" />
              Upload user image
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
