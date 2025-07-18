import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { useStore } from "@/store";
import { toast } from "react-toastify";
function ValidateEmailForm({ email, userId, change = false }) {
  const store = useStore();
  const { isWorker, setUser, user } = store;
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Validation code | SOS Travelers";
  }, []);
  const handleVerifyCode = async () => {
    try {
      const response = await UserService.verifyCodeEmail(userId, code, email);
      if (response.status === 200) {
        if (change) {
          setTimeout(() => {
            const updatedUser = { ...user, email: email };
            setUser(updatedUser);
            toast.success("Email changed successfully");
            router.push("/personal-details");
          }, 500);
        } else {
          router.push("/login");
        }
        // updateEmail();
      }
    } catch (err) {
      console.log(err);
      setErrorMsg("code its not valid");
    }
  };

  // const updateEmail = async () => {
  //   try {
  //     const data = {
  //       email: email,
  //     };

  //     const response = await UserService.updateDataUser(data);
  //     if (response.status === 200) {
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setErrorMsg(err?.response?.data?.error);
  //   }
  // };

  return (
    <div>
      <div className="max-w-lg">
        <p className=" text-gray-500 mb-5">
          Please check your email:
          <span className="font-semibold">{email}</span>,
        </p>
        <p className=" text-gray-500 mb-5">
          for the verification code so you can create update your new email.
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
