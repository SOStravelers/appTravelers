import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { MailIcon } from "@/constants/icons";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import InputText from "@/components/utils/inputs/InputText";
function ForgotPassForm({ errorMsg, setEmail, handleVerifyMail }) {
  return (
    <form className="w-full flex  flex-col max-w-lg">
      <InputText
        type="email"
        icon={FaEnvelope}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full"
      />
      {errorMsg && (
        <p className="text-center text-red text-sm mt-2">{errorMsg}</p>
      )}

      <OutlinedButton
        text="Change Password"
        px={0}
        dark="darkLight"
        py={2}
        margin="my-4"
        textSize="text-xs"
        textColor="text-white"
        buttonCenter={true}
        onClick={handleVerifyMail}
      />
    </form>
  );
}

export default ForgotPassForm;
