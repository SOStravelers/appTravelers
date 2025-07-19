import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import languageData from "@/language/home.json";
import { useStore } from "@/store";
export default function SuccessPurchaseModal() {
  const store = useStore();
  const { language } = store;
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("la superQuery", router.query);
    if (router.query.success) {
      setVisible(true);
    }
  }, [router.query]);

  const handleClose = () => {
    setVisible(false);
    const query = { ...router.query };
    delete query.success;
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white mx-6 dark:bg-backgroundCard rounded-xl shadow-lg max-w-sm w-full p-5 relative animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <FaTimes size={16} />
        </button>
        <div className="flex flex-col items-center text-center">
          <FaCheckCircle size={50} className="text-green-500 mb-3" />
          <h2 className="text-xl font-bold text-textColor mb-2">
            {languageData.modalPurchaseSuccess.title[language]}
          </h2>
          <p className="text-sm text-textColorGray mb-4">
            {languageData.modalPurchaseSuccess.body[language]}
          </p>

          <OutlinedButton
            text={languageData.modalPurchaseSuccess.button[language]}
            px={0}
            py={2}
            dark="darkHeavy"
            textSize="text-xs"
            margin="mb-3"
            textColor="text-white"
            buttonCenter={true}
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
}
