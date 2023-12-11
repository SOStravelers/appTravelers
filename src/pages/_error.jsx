// pages/_error.jsx
import { NotFoundPicture } from "@/constants/icons";
import React from "react";

const CustomErrorPage = () => {
  return (
    <main className="flex flex-col bg-white  py-16 lg:mt-5 xl:mt-5 px-4 md:pl-80">
      <div className="w-full max-w-lg ">
        <div className="py-8">
          <NotFoundPicture />
        </div>
        <h1 className="text-center  py-2 font-bold text-xl">404 - Not Found</h1>
        <p className="mx-4">
          Seems, that the page you are looking for has gone on vacation
        </p>
      </div>
    </main>
  );
};

export default CustomErrorPage;
