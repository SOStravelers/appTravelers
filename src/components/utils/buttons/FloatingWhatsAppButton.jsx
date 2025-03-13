import clsx from "clsx";
import { WhatsappIcon } from "@/constants/icons";
import languageBooking from "@/language/bookingDetails.json";
import { useStore } from "@/store";
function FloatingWhatsAppButton({}) {
  const { language } = useStore();
  const handleClick = () => {
    const phoneNumber = "+5521969936320";
    window.open(
      `https://wa.me/${phoneNumber}?text=${languageBooking.msgWhatsapp5[language]}`,
      "_blank"
    );
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#25D366",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WhatsappIcon width="32" height="32" fill="white" />{" "}
        {/* Usa tu ícono personalizado */}
      </button>
    </div>
  );
}

export default FloatingWhatsAppButton;
