import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { MailIcon } from "@/constants/icons";

function ForgotPassForm({ errorMsg, setEmail, handleVerifyMail }) {
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
