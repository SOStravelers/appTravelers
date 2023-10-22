import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function ProfileForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput placeholder="Name" />
      <OutlinedInput placeholder="Mail" />
      <OutlinedInput placeholder="Password" />
      <OutlinedInput placeholder="New Password" />
      <OutlinedInput placeholder="Confirm Password" />
      <Link href="/login">
        <SolidButton text="Save Changes" />
      </Link>
    </form>
  );
}

export default ProfileForm;
