import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { MailIcon } from "@/constants/icons";

function ForgotPassForm() {
  return (
    <form className="w-full flex flex-col max-w-lg">
      <OutlinedInput
        placeholder="Confirm Password"
        type="password"
        icon={MailIcon}
      />
      <SolidButton text="Change Password" mt={5} />
    </form>
  );
}

export default ForgotPassForm;
