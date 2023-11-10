import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { LockIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

function CreatePassForm() {
  return (
    <form className="w-full flex flex-col max-w-lg">
      <OutlinedInput
        placeholder="New password"
        type="password"
        icon={LockIcon}
      />
      <OutlinedInput
        placeholder="Confirm new password"
        type="password"
        icon={LockIcon}
      />
      <OutlinedButton text="Create Password" style={{ marginTop: "25px" }} />
      {/* <SolidButton color="" text="Change Password" mt={5} /> */}
    </form>
  );
}

export default CreatePassForm;
