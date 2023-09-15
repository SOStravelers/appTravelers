import SolidButton from "@/components/utils/buttons/SolidButton";
import ProfileForm from "@/components/utils/forms/ProfileForm";

export default function Profile() {
  return (
    <div className="bg-blanco h-full w-screen p-10">
      <ProfileForm />
      <SolidButton text="Settings" color="gris"/>
      <SolidButton text="Invite Friend" color="verde" />
      <SolidButton text="Log Out" color="rojo" />
    </div>
  );
}
