import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import ForgotPassForm from "@/components/utils/forms/ForgotPassForm";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import InputText from "@/components/utils/inputs/InputText";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function ChangePassword() {
  const [codeSend, setCodeSend] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(true); // <-- loading flag

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  const router = useRouter();
  useEffect(() => {
    document.title = "Recovery Pass | SOS Travelers";
  }, []);
  const handleVerifyCode = async () => {
    console.log(code);
    try {
      const response = await UserService.verifyCodeEmail(userId, code);
      console.log(response);
      if (response.status === 200) {
        const token = response.data.access_token;
        router.push({
          pathname: "/recovery-password/",
          query: { user: token },
        });
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.error);
    }
  };

  const handleVerifyMail = async (e) => {
    setErrorMsg("");
    e.preventDefault();
    try {
      const response = await UserService.findByEmail(email);
      if (response?.data?.isActive && response?.data?.isValidate) {
        console.log(response);
        const res = await UserService.sendCodeEmail(
          response.data._id,
          "forgotPass"
        );
        if (res.status === 200) {
          setCodeSend(true);
          setUserId(response.data._id);
        }
      }
    } catch (err) {
      if (err.status == 500) {
        alertToast({});
      } else {
        alertToast({ message: err?.response?.data?.error || "Error" });
      }
      setErrorMsg(err.response?.data?.error);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await UserService.sendCodeEmail(
        userId,
        "forgotPass",
        null
      );
      if (response.status === 200) {
        startCounter();
        alertToast({ message: "Code Send", type: "success" });
        setButtonDisabled(true);
        console.log(response);

        setIsDisabled(true);
        let timer = 60;
        const intervalId = setInterval(() => {
          timer--;
          setCountdown(timer);
          if (timer === 0) {
            clearInterval(intervalId);
            setIsDisabled(false);
            setButtonDisabled(false); // Add this line
          }
        }, 1000);
      }
    } catch (err) {
      if (err.status == 500) {
        alertToast({});
      } else {
        alertToast({ message: err?.response?.data?.error || "Error" });
      }
    }
  };

  const startCounter = () => {
    setTimeout(() => {
      setButtonDisabled(false);
    }, 600000);
  };

  return (
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      {codeSend ? (
        <div className="max-w-lg">
          <p className="text-center my-4 text-textColor mb-5">
            Please check your email: <span> </span>
            <span className=" mt-4 font-semibold">{email}</span>
          </p>
          <p className="text-center text-textColor mb-5 text-md">
            for the verification code so you can reset your password.
          </p>
          <InputText
            type="number"
            className="w-1/2 placeholder:text-sm"
            placeholder="Verification code"
            onChange={(e) => setCode(e.target.value)}
          />
          <p className="text-red text-center my-2">{errorMsg}</p>
          <OutlinedButton
            text="Verify"
            dark="darkLight"
            onClick={handleVerifyCode}
            textSize="text-xs"
            textColor="text-white"
            align="center"
            minWidth="200px"
            padding="px-2 py-2"
            margin="mt-6"
          />

          <OutlinedButton
            text="Resend code"
            dark="darkLight"
            disabled={buttonDisabled}
            onClick={handleResendCode}
            textColor="text-white"
            textSize="text-xs"
            align="center"
            minWidth="200px"
            padding="px-2 py-2"
            margin="mt-6"
          />
          {isDisabled && (
            <>
              <span className="text-md flex items-center mt-5 justify-center text-textColor">
                Review yor email, and set the code!
              </span>
              <span className="text-md flex items-center mt-5 justify-center text-textColor">
                Review yor email! or wait {countdown} seconds if you want to
                resend code
              </span>
            </>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-textColor text-center text-md font-semibold mb-5 max-w-lg">
            Forgot you password?
          </h1>
          <p className="text-center text-textColorGray mb-5 max-w-lg text-sm">
            Enter your email address below and we&apos;ll send you a code to
            reset your password.
          </p>
          <ForgotPassForm
            errorMsg={errorMsg}
            handleVerifyMail={handleVerifyMail}
            setEmail={setEmail}
          />
        </>
      )}
    </div>
  );
}
