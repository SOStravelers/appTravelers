import { useEffect, useState } from "react";
import { useStore } from "@/store";
import Image from "next/image";
import ReactCrop from "react-image-crop";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import "react-image-crop/dist/ReactCrop.css";
import { StarIcon } from "@/constants/icons";
import UserService from "@/services/UserService";
import { ThreeDots } from "react-loader-spinner";
import { ChangeIcon, ReturnArrowIcon } from "@/constants/icons";
import React from "react";
import { random } from "@/lib/utils";

function WorkerProfileCard({ name, services, score, avatar, lastName }) {
  const [newAvatar, setNewAvatar] = useState(null);
  const { user, setUser, isWorker } = useStore();
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modal, setModal] = useState(false);

  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };

  const cropImageNow = () => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Converting to base64
    const base64Image = canvas.toDataURL("image/jpeg");
    setOutput(base64Image);
    setImageInput(base64Image);
  };

  useEffect(() => {
    if (avatar) {
      setNewAvatar(avatar + "?hola=" + random());
    }
  }, [avatar]);

  const [loading, setLoading] = useState(false);

  const setImageInput = async (file) => {
    setLoading(true);

    if (!file) {
      // El usuario canceló la selección
      setLoading(false);
      return;
    }

    try {
      const response = await UserService.changeProfileImg(file);

      if (response.data.img) {
        let newUser = { ...user };
        newUser.img.imgUrl = response.data.img.imgUrl + "?hola=" + random();
        setUser(newUser);
        setNewAvatar(newUser.img.imgUrl);
      }

      setLoading(false);
      setModal(false);
      setSrc(null);
      setCrop(null);
      setImage(null);
      setOutput(null);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    //reader.readAsDataURL(file)
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
        selectImage(file);
        setModal(true);
        setLoading(false);
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

  const handleCancel = () => {
    setModal(false);
    setSrc(null);
    setCrop(null);
    setImage(null);
    setOutput(null);
  };

  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-32 h-32 rounded-2xl mr-2 relative">
        {newAvatar && (
          <div
            className="w-32 h-32 rounded-xl bg-cover bg-center relative cursor-pointer"
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
              onChange={(e) => {
                selectImage(e.target.files[0]);
                setModal(true);
              }}
              className="hidden"
            />
          </React.Fragment>
        )}
      </div>
      <center>
        {modal && src && (
          <>
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "999",
              }}
            ></div>
            <dialog
              open={modal}
              className="w-[90vw] h-[90vh]"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                overflowY: "auto",
                zIndex: "1000",
                border: "1px solid #ccc",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h1 className="text-2xl font-semibold mb-5">
                {isWorker
                  ? "Ajuste a imagem para melhor visualização"
                  : " Adjust the image for better look"}
              </h1>
              <ReactCrop
                className="w-60"
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
              >
                <img src={src} onLoad={(img) => setImage(img.target)} />
              </ReactCrop>
              <br />
              <SolidButton
                disabled={!crop}
                text={isWorker ? "Cortar a imagem" : "Crop the image"}
                onClick={cropImageNow}
              />
              <OutlinedButton
                text={isWorker ? "Cancelar" : "Cancel"}
                onClick={handleCancel}
              />
              <br />
            </dialog>
          </>
        )}
      </center>
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
          <p className="text-blackText">{`(+50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
