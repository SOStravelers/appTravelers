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
        <p className="text-center text-red-300 text-sm mt-2">{errorMsg}</p>
      )}

      <OutlinedButton
        text="Send email"
        dark="darkLight"
        textSize="text-xs"
        textColor="text-white"
        align="center"
        minWidth="200px"
        padding="px-2 py-2"
        margin="mt-6"
        onClick={handleVerifyMail}
      />
    </form>
  );
}

export default ForgotPassForm;
