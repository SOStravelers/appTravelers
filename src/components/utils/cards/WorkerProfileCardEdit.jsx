import { useEffect, useState } from "react";
import { useStore } from "@/store";
import Image from "next/image";
import { StarIcon } from "@/constants/icons";
import UserService from "@/services/UserService";
import { ThreeDots } from "react-loader-spinner";
import { ChangeIcon, ReturnArrowIcon } from "@/constants/icons";
import React from "react";
const random = () => {
  const randomQueryParam = Math.round(Math.random() * 100000);
  return randomQueryParam.toString();
};

function WorkerProfileCard({ name, services, score, avatar, lastName }) {
  const [newAvatar, setNewAvatar] = useState(null);

  useEffect(() => {
    if (avatar) {
      setNewAvatar(avatar + "?hola=" + random());
    }
  }, [avatar]);
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);

  const setImageInput = async (event) => {
    setLoading(true);
    console.log("holas", event.target);
    const file = event.target.files[0];

    if (!file) {
      // El usuario canceló la selección
      setLoading(false);
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      if (event.target.files.length === 0) {
        // El usuario canceló la selección
        setLoading(false);
        return;
      }
      try {
        const response = await UserService.changeProfileImg(reader.result);

        if (response.data.img) {
          let newUser = { ...user };
          newUser.img.imgUrl = response.data.img.imgUrl + "?hola=" + random();
          setUser(newUser);
          setNewAvatar(newUser.img.imgUrl);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    reader.readAsDataURL(file);
  };
  const changeImageInput = async (event) => {
    try {
      setLoading(true);

      const file = await selectFile();

      if (!file) {
        // El usuario canceló la selección
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        console.log(reader.result);
        try {
          const response = await UserService.changeProfileImg(reader.result);
          if (response.data.img) {
            let newUser = { ...user };
            newUser.img.imgUrl = response.data.img.imgUrl + "?hola=" + random();
            setUser(newUser);
            setNewAvatar(newUser.img.imgUrl);
          }

          setLoading(false);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };
  const selectFile = () => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        resolve(event.target.files[0]);
      };

      // Manejar el evento oncancel (no es soportado en todos los navegadores)
      input.addEventListener("cancel", () => {
        resolve(null);
      });

      input.click();
    });
  };
  console.log(newAvatar);
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 rounded-2xl mr-2 relative">
        {newAvatar && (
          <div
            className="w-full h-28 rounded-xl bg-cover bg-center relative cursor-pointer"
            style={{ backgroundImage: `url(${newAvatar})` }}
            onClick={(e) => changeImageInput(e)}
          >
            <button className="absolute bottom-0 right-0 h-8 w-8 flex justify-center items-center m-1 rounded-full bg-white text-white text-2xl border  border-grey">
              <ChangeIcon className="text-white ml-1" />
            </button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ThreeDots
                  height={80}
                  width={90}
                  radius={9}
                  color="#00A0D5"
                  ariaLabel="three-dots-loading"
                />
              </div>
            )}
          </div>
        )}
        {!newAvatar && (
          <React.Fragment>
            <label
              htmlFor={`image-upload`}
              className="w-full h-28 rounded-xl bg-grey text-white text-3xl cursor-pointer flex justify-center items-center relative"
            >
              {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <ThreeDots
                    height={80}
                    width={90}
                    radius={9}
                    color="#00A0D5"
                    ariaLabel="three-dots-loading"
                  />
                </div>
              )}
              {!loading && "+"}
            </label>
            <input
              id={`image-upload`}
              type="file"
              accept="image/*"
              onChange={(e) => setImageInput(e)}
              className="hidden"
            />
          </React.Fragment>
        )}
      </div>
      <div className="flex flex-col -mt-4">
        <h1 className="font-semibold">
          {name} {lastName}
        </h1>
        <p className="text-blackText my-2">
          {services?.length > 0
            ? services?.map((service) => service.id.name).join(", ")
            : "No services yet"}
        </p>
        <div className="flex items-center">
          <StarIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
