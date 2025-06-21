// components/utils/LoginFormModal.jsx
import React from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/utils/forms/LoginForm";

export default function LoginFormModal({
  title,
  text,
  open,
  setOpen,
  onAccept,
  onCancel,
}) {
  const router = useRouter();
  if (!open) return null;

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
    router.push("/");
  };

  return (
    <div
      className="
        fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm
        flex items-center justify-center z-50
      "
      onClick={handleCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-2xl w-[90vw] max-w-sm p-5
          transform transition-all duration-200 ease-out
        "
      >
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-black text-2xl focus:outline-none"
        >
          &times;
        </button>

        {/* Header */}
        <h1 className="text-lg text-center mb-3">{title}</h1>
        {text && <p className="text-center text-sm mb-5">{text}</p>}

        {/* Login form */}
        <LoginForm
          onSubmit={(values) => {
            onAccept?.(values);
            setOpen(false);
          }}
          inputClassName={`
            w-full border border-gray-300 bg-gray-100 rounded-md
            px-3 py-2 text-sm focus:outline-none
            focus:ring-0 focus:border-gray-500
            transition-colors duration-150 ease-in-out
          `}
        />

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center text-sm text-center space-y-2">
          <p className="text-gray-700">
            New here?
            <a
              onClick={() => {
                setOpen(false);
                router.push("/register");
              }}
              className="ml-1 font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Register Here!
            </a>
          </p>
          <p>
            By joining, you agree to our{" "}
            <a
              onClick={() => router.push("/terms-of-service")}
              className="font-bold text-gray-800 hover:underline cursor-pointer"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              onClick={() => router.push("/user-policy")}
              className="font-bold text-gray-800 hover:underline cursor-pointer"
            >
              Use Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
