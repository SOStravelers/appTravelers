import { useState } from "react";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import UserService from "@/services/UserService";
import { MailIcon } from "@/constants/icons";

function ForgotPassForm({ setCodeSend, setUserId }) {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
          console.log(res);
          setCodeSend(true);
          setUserId(response.data._id);
        }
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message);
    }
  };

  return (
    <form className="w-full flex flex-col max-w-lg">
      <OutlinedInput
        placeholder="Email address"
        type="email"
        icon={MailIcon}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errorMsg && (
        <p className="text-center text-red text-sm mt-2">{errorMsg}</p>
      )}
      <SolidButton text="Change Password" mt={5} onClick={handleVerifyMail} />
    </form>
  );
}

export default ForgotPassForm;
