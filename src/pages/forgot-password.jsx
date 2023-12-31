import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import ForgotPassForm from "@/components/utils/forms/ForgotPassForm";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [codeSend, setCodeSend] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        console.log("ypui");
        router.push({
          pathname: "/recovery-password",
          query: { userId: response?.data?._id },
        });
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message);
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
      console.log(err);
      setErrorMsg(err.response?.data?.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await UserService.sendCodeEmail(userId, "forgotPass");
      if (response.status === 200) {
        startCounter();
        toast.success("Code Send");
        setButtonDisabled(true);
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startCounter = () => {
    setTimeout(() => {
      setButtonDisabled(false);
    }, 300000);
  };

  return (
    <div className="px-5 py-28 md:pl-80">
      {codeSend ? (
        <div className="max-w-lg">
          <p className="text-center text-gray-500 mb-5">
            Please check your email for the verification code so you can reset
            your password.
          </p>
          <OutlinedInput
            placeholder="Verification code"
            onChange={(e) => setCode(e.target.value)}
          />
          <p className="text-red text-center my-2">{errorMsg}</p>
          <SolidButton mt={5} text="Verify" onClick={handleVerifyCode} />
          <OutlinedButton
            secondary
            text="Resend code"
            mt={5}
            onClick={handleResendCode}
            disabled={buttonDisabled}
          />
        </div>
      ) : (
        <>
          <h1 className="text-black text-center text-xl font-semibold mb-5 max-w-lg">
            Forgot you password?
          </h1>
          <p className="text-center mb-5 max-w-lg">
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
