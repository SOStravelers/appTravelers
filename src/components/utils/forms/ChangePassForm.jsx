import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { LockIcon } from "@/constants/icons";

function ChangePassForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput
        placeholder="Current Password"
        type="password"
        icon={LockIcon}
      />
      <OutlinedInput
        placeholder="New Password"
        type="password"
        icon={LockIcon}
      />
      <OutlinedInput
        placeholder="Confirm Password"
        type="password"
        icon={LockIcon}
      />
      <SolidButton text="Change Password" mt={5} />

      <p className="text-blackText mt-2 mb-5 text-right">Forgot password?</p>
    </form>
  );
}

export default ChangePassForm;
