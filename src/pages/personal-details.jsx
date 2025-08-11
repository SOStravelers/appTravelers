import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import languageData from "@/language/personalDetails.json";
import EditNameModal from "@/components/utils/modal/EditNameModal";
import EditPhoneModal from "@/components/utils/modal/EditPhoneModal";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function PersonalDetails() {
  const router = useRouter();
  const { user, setUser, language } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalNameOpen, setModalNameOpen] = useState(false);
  const [modalPhoneOpen, setModalPhoneOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = "Personal Details | SOS Travelers";
  }, []);

  useEffect(() => {
    if (user) {
      const fullName = `${capitalize(
        user?.personalData?.name?.first || ""
      )} ${capitalize(user?.personalData?.name?.last || "")}`;
      setName(fullName.trim());
      setEmail(user.email);
      const phoneLabel = `${user.phoneCode || ""} ${user.phone || ""}`;
      setPhone(phoneLabel.trim());
    }
  }, [user]);

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function truncate(str) {
    return str?.length > 28 ? str.slice(0, 28) + "..." : str;
  }

  return (
    <>
      <div
        className={`min-h-screen bg-backgroundP pt-4 px-6  flex flex-col items-center
              transform transition-all duration-800 ease-out
              transition-opacity duration-800 ease-out
             ${loading ? opacityAnimation : displayAnimation}
            `}
      >
        <div className="w-full max-w-md flex flex-col self-center">
          {/* Nombre */}
          <OptionCard
            title={languageData.name[language]}
            subtitle={truncate(name)}
            icon={FaUser}
            onClick={() => setModalNameOpen(true)}
          />

          {/* Teléfono */}
          <OptionCard
            title={languageData.phone[language]}
            subtitle={truncate(phone)}
            icon={FaPhone}
            onClick={() => setModalPhoneOpen(true)}
          />

          {/* Email */}
          <OptionCard
            title="Email"
            subtitle={truncate(email)}
            icon={FaEnvelope}
            onClick={() => router.push("/change-email")}
          />

          {user?.security?.hasPassword ? (
            <OptionCard
              title={languageData.changePassword[language]}
              icon={FaLock}
              onClick={() => router.push("/change-password")}
            />
          ) : (
            <OptionCard
              title={languageData.createPassword[language]}
              icon={FaLock}
              onClick={() => router.push("/create-password")}
            />
          )}
        </div>
      </div>
      <EditNameModal
        isOpen={modalNameOpen}
        onClose={() => setModalNameOpen(false)}
        defaultName={name}
      />

      <EditPhoneModal
        isOpen={modalPhoneOpen}
        onClose={() => setModalPhoneOpen(false)}
      />
    </>
  );
}
