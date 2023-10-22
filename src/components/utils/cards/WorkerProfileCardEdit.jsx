import { useState } from "react";

import Image from "next/image";
import { StarIcon } from "@/constants/icons";

function WorkerProfileCard({ name, service, score, avatar }) {
  const [isInputHidden, setIsInputHidden] = useState(true);
  const [newAvatar, setNewAvatar] = useState(null);
  console.log("avatarr", name, avatar);
  const handleImageClick = () => {
    setIsInputHidden(false);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // Do something with the uploaded image
      setNewAvatar(reader.result);
    };
  };

  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 rounded-2xl mr-2 relative">
        {newAvatar && (
          <button
            className="absolute top-0 right-0 h-8 w-8 z-20 flex justify-center items-center m-1 rounded-full bg-white text-black text-2xl"
            onClick={() => {
              setIsInputHidden(true);
              setNewAvatar(null);
            }}
          >
            &times;
          </button>
        )}
        <div
          className="bg-lightBlue w-full h-full rounded-2xl relative cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={newAvatar ?? avatar ?? null}
            fill
            className="object-cover rounded-2xl hover:opacity-50 transition-opacity duration-300"
            alt="Worker avatar"
          />
          <input
            type="file"
            accept="image/*"
            className={`absolute inset-0 opacity-0 ${
              isInputHidden ? "hidden" : ""
            }`}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold">{name}</h1>
        <p className="text-blackText my-2">
          {service?.length > 0
            ? service?.map((s) => s.name).join(", ")
            : "No services yet"}
        </p>
        <div className="flex items-center">
          <StarIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
