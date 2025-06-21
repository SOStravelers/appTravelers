import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaImage, FaVideo, FaTrash, FaGripVertical } from "react-icons/fa";
import { useStore } from "@/store";
import SubserviceService from "@/services/SubserviceService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UploadAssetsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { language } = useStore();

  const [existingImgUrl, setExistingImgUrl] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [existingGalleryVideos, setExistingGalleryVideos] = useState([]);

  const [removeImg, setRemoveImg] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [removeGalleryImages, setRemoveGalleryImages] = useState(new Set());
  const [removeGalleryVideos, setRemoveGalleryVideos] = useState(new Set());

  const [imgFile, setImgFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const bytes = (mb) => mb * 1024 * 1024;

  // Trunca cadenas a `max` caracteres y añade "..."
  const truncate = (str, max = 25) =>
    !str ? "" : str.length > max ? str.slice(0, max) + "..." : str;

  useEffect(() => {
    if (!id) return;
    SubserviceService.getById(id)
      .then(({ data }) => {
        setExistingImgUrl(data.imgUrl || "");
        setExistingVideoUrl(data.videoUrl || "");
        setExistingGalleryImages(data.gallery?.images || []);
        setExistingGalleryVideos(data.gallery?.videos || []);
      })
      .catch(console.error);
  }, [id]);

  const validate = () => {
    const err = {};
    if (!existingImgUrl && !imgFile) err.img = "Imagen requerida";
    if (!existingVideoUrl && !videoFile) err.video = "Vídeo requerido";

    if (imgFile) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(imgFile.type))
        err.img = "Formato inválido";
      else if (imgFile.size > bytes(20)) err.img = "Máx 20 MB";
    }
    if (videoFile) {
      if (!videoFile.type.startsWith("video/")) err.video = "Formato inválido";
      else if (videoFile.size > bytes(20)) err.video = "Máx 20 MB";
    }

    const currImgs = existingGalleryImages.filter(
      (_, i) => !removeGalleryImages.has(i)
    );
    const totImgs = currImgs.length + galleryImages.length;
    if (totImgs < 4 || totImgs > 8)
      err.galleryImages = `Imágenes totales deben ser 4–8 (tienes ${totImgs})`;
    if (
      galleryImages.some(
        (f) => !f.type.startsWith("image/") || f.size > bytes(20)
      )
    )
      err.galleryImages = "Cada imagen ≤20 MB y formato válido";

    const currVids = existingGalleryVideos.filter(
      (_, i) => !removeGalleryVideos.has(i)
    );
    const totVids = currVids.length + galleryVideos.length;
    if (totVids < 1 || totVids > 3)
      err.galleryVideos = `Vídeos totales deben ser 1–3 (tienes ${totVids})`;
    if (
      galleryVideos.some(
        (f) => !f.type.startsWith("video/") || f.size > bytes(50)
      )
    )
      err.galleryVideos = "Cada vídeo ≤50 MB y formato válido";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const form = new FormData();
    if (imgFile) form.append("imgUrl", imgFile);
    if (videoFile) form.append("videoUrl", videoFile);
    galleryImages.forEach((f) => form.append("galleryImages", f));
    galleryVideos.forEach((f) => form.append("galleryVideos", f));
    form.append("removeImg", removeImg);
    form.append("removeVideo", removeVideo);
    form.append(
      "removeGalleryImages",
      JSON.stringify([...removeGalleryImages])
    );
    form.append(
      "removeGalleryVideos",
      JSON.stringify([...removeGalleryVideos])
    );

    try {
      await SubserviceService.updateGallery(id, form);
      toast.success("Actualizado con éxito", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    } catch (error) {
      console.error(error.response || error);
      toast.error("Ocurrió un error", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRemove = (type, idx = null) => {
    if (type === "img") return setRemoveImg((v) => !v);
    if (type === "video") return setRemoveVideo((v) => !v);
    if (type === "galleryImg") {
      const s = new Set(removeGalleryImages);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      setRemoveGalleryImages(s);
    }
    if (type === "galleryVid") {
      const s = new Set(removeGalleryVideos);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      setRemoveGalleryVideos(s);
    }
  };

  const handleRemoveNew = (type, idx) => {
    if (type === "imgNew") return setImgFile(null);
    if (type === "videoNew") return setVideoFile(null);
    if (type === "galleryImgNew")
      return setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
    if (type === "galleryVidNew")
      return setGalleryVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="relative min-h-screen my-10 bg-gradient-to-br from-indigo-50 to-pink-50 p-4 sm:p-8">
      {/* Spinner global */}
      {submitting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
              className="opacity-75"
            />
          </svg>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 relative z-10">
        <h1 className="text-2xl font-bold text-darkBlue mb-6">
          Configurar Assets
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Imagen Principal */}
          <div>
            <label className="flex items-center text-xl pb-3 font-medium ">
              <FaImage className="mr-2" /> Imagen Principal - obligatoria
            </label>
            <div className="mt-2 flex items-center space-x-4">
              {existingImgUrl && !removeImg ? (
                <div className="relative">
                  <img
                    src={existingImgUrl}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => toggleRemove("img")}
                    className="absolute top-1 right-1 text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : imgFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(imgFile)}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNew("imgNew")}
                    className="absolute top-1 right-1 text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 flex flex-col justify-center items-center bg-gray-100 rounded cursor-pointer">
                  Elegir
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImgFile(e.target.files[0] || null)}
                  />
                </label>
              )}
            </div>
            {errors.img && <p className="text-red-600 mt-1">{errors.img}</p>}
          </div>

          {/* Vídeo Principal */}
          <div>
            <label className="flex items-center pb-3 text-xl font-medium ">
              <FaVideo className="mr-2 text-3xl" /> Vídeo Principal
            </label>
            <div className="mt-2 flex items-center space-x-4">
              {existingVideoUrl && !removeVideo ? (
                <div className="flex items-center space-x-2">
                  <FaVideo className=" text-gray-700" />
                  <a
                    href={existingVideoUrl}
                    target="_blank"
                    className="truncate whitespace-nowrap max-w-xs"
                  >
                    {truncate(existingVideoUrl, 25)}
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleRemove("video")}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : videoFile ? (
                <div className="flex items-center space-x-2">
                  <FaVideo className="text-3xl text-gray-700" />
                  <span className="truncate whitespace-nowrap max-w-xs">
                    {truncate(videoFile.name, 25)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNew("videoNew")}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <label className="px-4 py-2 bg-gray-100 rounded cursor-pointer">
                  Elegir vídeo
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files[0] || null)}
                  />
                </label>
              )}
            </div>
            {errors.video && (
              <p className="text-red-600 mt-1">{errors.video}</p>
            )}
          </div>

          {/* Galería – Imágenes */}
          <div>
            <label className="block text-lg font-medium underline mb-4 ">
              Galería de img (min 4 - max 8)
            </label>

            <div className="mt-2 space-y-2">
              {galleryImages.length > 0 && (
                <ul className="divide-y border rounded overflow-hidden">
                  {galleryImages.map((file, i) => (
                    <li
                      key={i}
                      className="flex items-center px-3 py-2 bg-white hover:bg-gray-50"
                    >
                      <FaGripVertical className="text-gray-400 mr-3" />
                      <span className="flex-1 truncate whitespace-nowrap">
                        {file.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-4">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNew("galleryImgNew", i)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 grid grid-cols-4 gap-2">
                {existingGalleryImages.map(
                  (url, i) =>
                    !removeGalleryImages.has(i) && (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => toggleRemove("galleryImg", i)}
                          className="absolute top-1 right-1 text-red-600"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    )
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <label className=" flex p-3 flex-col justify-center items-center bg-gray-300 rounded cursor-pointer">
                  Sube imgs
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setGalleryImages(Array.from(e.target.files))
                    }
                  />
                </label>
              </div>
            </div>
            {errors.galleryImages && (
              <p className="text-red-600 mt-1 truncate">
                {errors.galleryImages}
              </p>
            )}
          </div>

          {/* Galería – Vídeos */}
          <div>
            <label className="block text-lg font-medium underline mb-4 ">
              Galería de vídeos (min 1 - max 3)
            </label>
            <div className="mt-2 space-y-2">
              {galleryVideos.length > 0 && (
                <ul className="divide-y border rounded overflow-hidden">
                  {galleryVideos.map((file, i) => (
                    <li
                      key={i}
                      className="flex items-center px-3 py-2 bg-white hover:bg-gray-50"
                    >
                      <FaGripVertical className="text-gray-400 mr-3" />
                      <FaVideo className="text-xl text-gray-700 mr-2" />
                      <span className="flex-1 truncate whitespace-nowrap">
                        {file.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-4">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNew("galleryVidNew", i)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 space-y-2">
                {existingGalleryVideos.map(
                  (url, i) =>
                    !removeGalleryVideos.has(i) && (
                      <div
                        key={i}
                        className="flex items-center bg-gray-50 p-2 rounded"
                      >
                        <FaVideo className="text-xl text-gray-700 mr-2" />
                        <a
                          href={url}
                          target="_blank"
                          className="truncate whitespace-nowrap flex-1"
                        >
                          {truncate(url, 25)}
                        </a>
                        <button
                          type="button"
                          onClick={() => toggleRemove("galleryVid", i)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <label className="p-3  bg-gray-300 rounded cursor-pointer">
                  Sube vídeos
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setGalleryVideos(Array.from(e.target.files))
                    }
                  />
                </label>
              </div>
            </div>
            {errors.galleryVideos && (
              <p className="text-red-600 mt-1 truncate">
                {errors.galleryVideos}
              </p>
            )}
          </div>

          {/* Submit */}

          <div className="flex w-full justify-between mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {submitting ? "Actualizando…" : "Guardar "}
            </button>
            {/* Botón derecha */}
            <button
              type="button"
              onClick={() => router.push("/config/subservice/info/" + id)}
              className="bg-blue-200 text-gray-800 px-8 py-2 rounded hover:bg-blue-300"
            >
              Ir a Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
