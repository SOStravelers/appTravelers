import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function ValidateEmailForm({ email }) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Recovery Pass | SOS Travelers";
  }, []);
  const handleVerifyCode = async () => {
    try {
      const userId = router?.query?.userId;
      const response = await UserService.verifyCodeEmail(userId, code);
      if (response.status === 200) {
        updateEmail();
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message);
    }
  };

  const updateEmail = async () => {
    try {
      const data = {
        email: email,
      };

      const response = await UserService.updateDataUser(data);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message);
    }
  };

  return (
    <div>
      <div className="max-w-lg">
        <p className="text-center text-gray-500 mb-5">
          Please check your email for the verification code so you can create
          update your new email.
        </p>
        <OutlinedInput
          placeholder="Verification code"
          onChange={(e) => setCode(e.target.value)}
        />
        <p className="text-red text-center my-2">{errorMsg}</p>
        <SolidButton mt={5} text="Verify" onClick={handleVerifyCode} />
      </div>
    </div>
  );
}

export default ValidateEmailForm;
