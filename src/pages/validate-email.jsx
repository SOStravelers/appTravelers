import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

export default function ChangePassword() {
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
        router.push({
          pathname: "/recovery-password",
          query: { userId: userId },
        });
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message);
    }
  };

  return (
    <div className="px-5 py-28 md:pl-80">
      <div className="max-w-lg">
        <p className="text-center text-gray-500 mb-5">
          You don&apos;t have a password yet. Please check your email for the
          verification code so you can create your password.
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
