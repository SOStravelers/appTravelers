import { useState, useEffect } from "react";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

function EditGallery({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const { user, setUser } = useStore();

  useEffect(() => {
    if (user?.img?.gallery?.length > 0) {
      console.log("gallery", user.img.gallery);
      setSelectedImages(user.img.gallery);
    }
  }, [user]);

  useEffect(() => {
    if (images?.length > 0) {
      setSelectedImages(images);
    }
  }, [images]);

  const handlechangeImage = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        console.log(reader.result);
        try {
          const response = await UserService.updateGalley(
            reader.result,
            index.toString()
          );
          if (response.data.img) {
            const images = [...selectedImages];
            images.splice(index, 1, response.data.img);
            setSelectedImages(images);
          }

          console.log("foto guardada", response.data);
        } catch (err) {
          console.log(err);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length && i < 6; i++) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        console.log(reader.result);
        try {
          const response = await UserService.updateGalley(
            reader.result,
            i.toString()
          );
          if (response.data.img) {
            user.img.gallery.splice(i, 1, response.data.img);
            setUser(user);
          }

          console.log("foto guardada", response.data);
        } catch (err) {
          console.log(err);
        }
      };
      reader.readAsDataURL(files[i]);
    }
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
        <label
          htmlFor="image-upload"
          className="w-full flex justify-center items-center h-28 rounded-xl bg-grey text-white text-3xl cursor-pointer"
        >
          +
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <div
              key={index}
              className="w-full h-28 rounded-xl bg-cover bg-center relative cursor-pointer"
              style={{ backgroundImage: `url(${image})` }}
              onClick={() => handlechangeImage(index)}
            >
              <button
                className="absolute top-0 right-0 h-8 w-8 flex justify-center items-center m-1 rounded-full bg-white text-black text-2xl"
                onClick={() => {
                  const images = [...selectedImages];
                  images.splice(index, 1);
                  setSelectedImages(images);
                }}
              >
                &times;
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default EditGallery;
