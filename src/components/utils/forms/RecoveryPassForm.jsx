import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { LockIcon } from "@/constants/icons";

function RecoveryPassForm() {
  return (
    <form className="w-full flex flex-col max-w-lg">
     
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
    </form>
  );
}

export default RecoveryPassForm;
