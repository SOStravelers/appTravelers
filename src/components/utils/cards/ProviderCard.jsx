import { useState } from "react";
import { useStore } from "@/store";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import languageData from "@/language/bookingDetails.json";
export default function ProviderCard({ provider, subservice }) {
  const { language } = useStore();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  console.log("hola", provider, subservice);
  const openImageModal = (url) => {
    setModalImageUrl(url);
    setIsImageModalOpen(true);
  };
  const getWhatsappLink = ({ phone, phoneCode, name, subservice }) => {
    console.log("wena", phone, phoneCode, name, subservice);
    const rawPhone = String(phone || "").replace(/\D/g, "");
    const rawPhoneCode = String(phoneCode || "").replace(/\D/g, "");
    const phoneComplete = rawPhoneCode + rawPhone;

    const message =
      languageData.msgWhatsapp1[language] +
      " " +
      subservice?.name[language] +
      " " +
      languageData.msgWhatsapp2[language]; // Mensaje opcional
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${phoneComplete}?text=${encodedMessage}`;
  };
  return (
    <>
      <div className="mt-10 text-sm text-gray-800 border-t pt-6 border-gray-200">
        <h2 className="text-base font-semibold mb-4 text-textColor text-center">
          Operador responsable del servicio
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center">
          <img
            src={provider?.imgUrl}
            alt={provider?.name}
            onClick={() => openImageModal(provider?.imgUrl)}
            className="w-24 h-24 rounded-full object-cover border-2 border-textColor shadow-sm cursor-pointer hover:opacity-80 transition"
          />
          <div className="text-center md:text-left">
            <p className="font-semibold text-textColor text-lg">
              {provider?.name}
            </p>
            <p className="text-sm text-textColorGray flex items-center gap-2">
              <FaPhoneAlt className="text-base text-textColor" />
              <a
                href={`tel:${provider?.phoneCode}${provider?.phone}`}
                className="hover:underline"
              >
                +{provider?.phoneCode} {provider?.phone}
              </a>
            </p>
            <p className="text-sm text-textColorGray flex items-center gap-2 mt-1">
              <FaEnvelope className="text-base text-textColor" />
              <a href={`mailto:${provider?.email}`} className="hover:underline">
                {provider?.email}
              </a>
            </p>

            <a
              href={getWhatsappLink({
                phone: provider?.phone,
                phoneCode: provider?.phoneCode,
                name: provider?.name,
                subservice: subservice,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition"
            >
              <FaWhatsapp size={24} />
              <span>Hablar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImageUrl}
              alt="Imagen ampliada"
              className="w-60 h-60 object-cover rounded-full shadow-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
