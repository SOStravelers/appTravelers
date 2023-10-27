import RecoveryPassForm from "@/components/utils/forms/RecoveryPassForm";

export default function RecoveryPassword() {
  return (
    <div className="px-5 py-28 md:pl-80">
      <h1 className="text-black text-center text-xl font-semibold mb-5 max-w-lg">
        Almost done!
      </h1>
      <p className="text-center mb-5 max-w-lg">
        Enter your new password and confirm it.
      </p>
      <RecoveryPassForm />
    </div>
  );
}
