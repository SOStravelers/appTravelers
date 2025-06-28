import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { MailIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
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
      <OutlinedButton
        text="Change Password"
        margin="my-3"
        onClick={handleVerifyMail}
      />
    </form>
  );
}

export default ForgotPassForm;
