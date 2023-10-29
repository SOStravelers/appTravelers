import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

const LoginFormModal = ({
  title,
  text,
  buttonText,
  open,
  setOpen,
  onAccept,
  onCancel,
}) => {
  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative">
            <Link href="/">
              <button className="absolute top-0 right-0 m-4 text-black text-2xl">
                &times;
              </button>
            </Link>
            <div className="bg-white rounded-2xl w-[90vw] md:w-96 px-10 py-5">
              <div className="p-5">
                <h1 className="text-2xl text-center mb-5">{title}</h1>
                <p className="text-center">{text}</p>
              </div>
              <LoginForm />
              <div className="flex flex-col items-center justify-center mt-10">
                <p className="text-blackText">
                  Are you a new?
                  <Link
                    className="text-black font-semibold  ml-2"
                    href={"/register"}
                  >
                    Register Here!
                  </Link>
                </p>
                <p className="text-xs mt-5">
                  By joining, you agree to our{" "}
                  <Link
                    href={"terms-of-service"}
                    className="font-bold text-blackText"
                  >
                    Terms of Service.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginFormModal;
