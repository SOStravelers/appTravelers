import { useState, useEffect } from "react";
import CreatePassForm from "@/components/utils/forms/CreatePassForm";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function CreatePassword() {
  const { user, setUser } = useStore();
  const router = useRouter();
  const [codeSend, setCodeSend] = useState(false);
  const [canCreatePass, setCanCreatePass] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

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
        const token = response.data.access_token;
        console.log("erna", token);
        router.push({
          pathname: "/recovery-password/",
          query: { user: token },
        });
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response.data.message);
    }
  };

  return (
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      {canCreatePass ? (
        <CreatePassForm />
      ) : (
        <div className="flex flex-col items-center justify-center max-w-lg my-5">
          <h1 className="text-md text-textColor mb-5">
            You don&apos;t have a password yet. Create a new one
          </h1>

          {codeSend ? (
            <>
              <p className="text-center text-textColorGray">
                We need to verify your account before you can set a password.
              </p>
              <p className="text-center text-textColorGray mb-5">
                Please check your email for the verification code.
              </p>
              <OutlinedInput
                placeholder="Verification code"
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="text-red text-center my-2">{errorMsg}</p>

              <OutlinedButton
                onClick={handleVerifyCode}
                px={20}
                py={2}
                dark="darkLight"
                textSize="text-sm"
                textColor="text-white"
                text="Verify"
                buttonCenter={true}
              />
            </>
          ) : (
            <OutlinedButton
              onClick={handleSendVerificationCode}
              px={20}
              py={2}
              dark="darkLight"
              textSize="text-sm"
              text="Create password"
              textColor="text-white"
              buttonCenter={true}
            />
          )}
        </div>
      )}
    </div>
  );
}
