import { useState, useEffect } from "react";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { ThreeDots } from "react-loader-spinner";

import React from "react";

function EditGallery({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedImages, setSelectedImages] = useState([null]);
  const random = () => {
    const randomQueryParam = Math.round(Math.random() * 100000);
    return randomQueryParam.toString();
  };

  const [loading, setLoading] = useState(
    new Array(selectedImages.length).fill(false)
  );
  const { user, setUser } = useStore();

  useEffect(() => {
    if (user?.img?.gallery?.length > 0) {
      const filledArray = Array.from(
        { length: 10 },
        (_, index) => user.img.gallery[index] || null
      );
      setSelectedImages(filledArray);
    } else {
      const emptyArray = Array.from({ length: 10 }, () => null);
      setSelectedImages(emptyArray);
      console.log("el user", user);
    }
  }, [user]);
  useEffect(() => {
    if (images?.length > 0) {
      setSelectedImages(images);
    }
  }, [images]);

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
        try {
          console.log("el index", index);
          const response = await UserService.updatePhotoGallery(
            reader.result,
            index.toString()
          );
          if (response.data.img) {
            let newUser = { ...user };
            newUser.img.gallery[index] =
              response.data.img.gallery[index] + "?hola=" + random();
            setUser(newUser);
          }
          console.log("foto guardada", response.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prevLoading) => {
            const newLoading = [...prevLoading];
            newLoading[index] = false;
            return newLoading;
          });
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
  const deleteImage = async (index) => {
    const images = [...selectedImages];
    images[index] = null;
    try {
      await UserService.updateGallery(images);
      setSelectedImages(images);
    } catch (err) {}
  };
  const setImageInput = async (event, index) => {
    console.log("el index", index);
    setLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      if (event.target.files.length === 0) {
        // El usuario canceló la selección
        setLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
        return;
      }

      console.log(reader.result);
      try {
        const response = await UserService.updatePhotoGallery(
          reader.result,
          index.toString()
        );

        if (response.data.img) {
          let newUser = { ...user };
          newUser.img.gallery[index] = response.data.img.gallery[index];
          setUser(newUser);
        }

        console.log("foto guardada", response.data);
        setLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
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
    reader.readAsDataURL(file);
  };

  return (
    <div className="my-5 max-w-lg">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        Gallery
      </h1>
      <div className="grid grid-cols-2 gap-1">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            {image && (
              <div
                className="w-full h-28 rounded-xl bg-cover bg-center relative cursor-pointer"
                style={{ backgroundImage: `url(${image})` }}
                onClick={(e) => changeImageInput(e, index)}
              >
                <button
                  className="absolute top-0 right-0 h-8 w-8 flex justify-center items-center m-1 rounded-full bg-white text-white text-2xl"
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
                  className="w-full h-28 rounded-xl bg-grey text-white text-3xl cursor-pointer flex justify-center items-center relative"
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
                  {!loading[index] && "+"}
                </label>
                <input
                  id={`image-upload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageInput(e, index)}
                  className="hidden"
                />
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditGallery;
