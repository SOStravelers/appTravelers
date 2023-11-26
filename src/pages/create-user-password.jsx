import { useState } from "react";
import CreatePassForm from "@/components/utils/forms/CreatePassForm";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { set } from "date-fns";

export default function CreateUserPassword() {
  const { user, setUser } = useStore();
  const [codeSend, setCodeSend] = useState(false);
  const [canCreatePass, setCanCreatePass] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  console.log(user);

  const handleSendVerificationCode = async () => {
    const response = await UserService.sendCodeEmail(user._id, "createPass");
    console.log(response);
    if (response.status === 200) {
      setCodeSend(true);
    }
  };

  const handleVerifyCode = async () => {
    console.log(code);
    try {
      const response = await UserService.verifyCodeEmail(user._id, code);
      console.log(response);
      if (response.status === 200) {
        setCanCreatePass(true);
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response.data.message);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col w-screen py-28 px-5 md:pl-80">
      {canCreatePass ? (
        <CreatePassForm />
      ) : (
        <div className="flex flex-col items-center justify-center max-w-lg my-5">
          <h1 className="text-2xl font-bold mb-5">
            You don&apos;t have a password yet
          </h1>

          {codeSend ? (
            <>
              <p className="text-center text-gray-500">
                We need to verify your account before you can set a password.
              </p>
              <p className="text-center text-gray-500 mb-5">
                Please check your email for the verification code.
              </p>
              <OutlinedInput
                placeholder="Verification code"
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="text-red text-center my-2">{errorMsg}</p>
              <SolidButton mt={5} text="Verify" onClick={handleVerifyCode} />
            </>
          ) : (
            <SolidButton
              mt={10}
              text="Create password"
              onClick={handleSendVerificationCode}
            />
          )}
        </div>
      )}
    </div>
  );
}
