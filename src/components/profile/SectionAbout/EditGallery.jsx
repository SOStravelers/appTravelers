import React, { useState, useEffect } from "react";
import UserService from "@/services/UserService";
import ReactCrop from "react-image-crop";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import "react-image-crop/dist/ReactCrop.css";
import { useStore } from "@/store";
import { ThreeDots } from "react-loader-spinner";
import { random } from "@/lib/utils";

function EditGallery() {
  const [selectedImages, setSelectedImages] = useState([null]);
  const [loading, setLoading] = useState(
    new Array(selectedImages.length).fill(false)
  );
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
    setImageInput(base64Image, selectedIndex);
  };

  useEffect(() => {
    if (user?.img?.gallery?.length > 0) {
      const filledArray = Array.from(
        { length: 10 },
        (_, index) => user.img.gallery[index] || null
      );
      console.log("caso1", filledArray);
      let final = [];
      for (let image of filledArray) {
        let cacheImg = null;
        if (image != null) {
          cacheImg = image + "?hola=" + random();
        }
        final.push(cacheImg);
      }
      console.log(final);
      setSelectedImages(final);
    } else {
      const emptyArray = Array.from({ length: 10 }, () => null);
      setSelectedImages(emptyArray);
      console.log("caso2", emptyArray);
    }
  }, [user]);

  const changeImageInput = async (event, index) => {
    try {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = true;
        return newLoading;
      });

      const file = await selectFile();

      if (!file) {
        // El usuario canceló la selección
        setLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        console.log(reader.result);
        selectImage(file);
        setSelectedIndex(index);
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
  const deleteImage = async (index) => {
    const images = [...selectedImages];
    images[index] = null;
    try {
      await UserService.updateGallery(images);
      setSelectedImages(images);

      // setUser agregado por metal
      if (user.img) {
        const updatedUser = { ...user };
        updatedUser.img.gallery = images;
        setUser(updatedUser);
      }
    } catch (err) {}
  };

  const setImageInput = async (image, index) => {
    console.log("el index", index);

    try {
      const response = await UserService.updatePhotoGallery(
        image,
        index.toString()
      );

      if (response.data.img) {
        let newUser = { ...user };
        newUser.img.gallery[index] = response.data.img.gallery[index];
        setUser(newUser);
      }

      console.log("foto guardada", response.data);
      /*
        setLoading((prevLoading) => {
          const newLoading = [...prevLoading]
          newLoading[index] = false
          return newLoading
        })
        */

      setModal(false);
      setSelectedIndex(null);
      setOutput(null);
      setSrc(null);
      setCrop(null);
      setImage(null);
    } catch (err) {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = false;
        return newLoading;
      });
      console.log(err);
    }
  };

  // Make sure to call readAsDataURL after setting up the onloadend event
  //reader.readAsDataURL(file)

  const handleCancel = () => {
    setModal(false);
    setSelectedIndex(null);
    setOutput(null);
    setSrc(null);
    setCrop(null);
    setImage(null);
  };

  return (
    <div className="my-5 max-w-lg">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        {isWorker ? "Galeria" : "Gallery"}
      </h1>
      <div className="grid grid-cols-2 gap-1">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            {image && (
              <div
                className="w-full h-28 w-28 rounded-xl bg-cover bg-center relative cursor-pointer"
                style={{
                  // paddingTop: "56.25%", // 16:9 Aspect Ratio
                  paddingTop: "100%", // 1:1 Aspect Ratio
                  backgroundImage: `url(${image}) `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={(e) => changeImageInput(e, index)}
              >
                <button
                  className="absolute top-0 right-0 h-6 w-6 flex justify-center items-center m-1 rounded-full bg-white text-white text-xl"
                  style={{ backgroundColor: "#00A0D5" }}
                  onClick={(e) => {
                    e.stopPropagation(); // Detener la propagación del evento
                    deleteImage(index);
                  }}
                >
                  &times;
                </button>
                {loading[index] && (
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
            {!image && (
              <React.Fragment key={index}>
                <label
                  htmlFor={`image-upload-${index}`}
                  className="w-full relative rounded-xl cursor-pointer flex justify-center items-center"
                  style={{ paddingTop: "100%", backgroundColor: "grey" }}
                >
                  {loading[index] && (
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
                  {!loading[index] && (
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl">
                      +
                    </span>
                  )}
                </label>
                <input
                  id={`image-upload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    selectImage(e.target.files[0]);
                    setSelectedIndex(index);
                    setModal(true);
                  }}
                  className="hidden"
                />
              </React.Fragment>
            )}
          </div>
        ))}

        <center>
          <div>
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
                  <h1 className="text-sm lg:text-xl font-semibold mb-5">
                    {isWorker
                      ? "Ajuste a imagem para melhor visualização"
                      : " Adjust the image for better look"}
                  </h1>
                  <ReactCrop
                    className="w-90"
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1 / 1}
                  >
                    <img src={src} onLoad={(img) => setImage(img.target)} />
                  </ReactCrop>
                  <br />
                  <SolidButton
                    text={isWorker ? "Cortar a imagem" : "Crop the image"}
                    onClick={cropImageNow}
                  />
                  <OutlinedButton
                    margin="my-1"
                    text={isWorker ? "Cancelar" : "Cancel"}
                    onClick={handleCancel}
                  />
                  <br />
                </dialog>
              </>
            )}
          </div>
          <div>{output && <img src={output} />}</div>
        </center>
      </div>
    </div>
  );
}

export default EditGallery;
