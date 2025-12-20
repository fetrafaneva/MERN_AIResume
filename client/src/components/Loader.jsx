import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" size-12 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
