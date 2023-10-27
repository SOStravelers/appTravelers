import ForgotPassForm from "@/components/utils/forms/ForgotPassForm";

export default function ChangePassword() {
  return (
    <div className="px-5 py-28 md:pl-80">
      <h1 className="text-black text-center text-xl font-semibold mb-5 max-w-lg">
        Forgot you password?
      </h1>
      <p className="text-center mb-5 max-w-lg">
        Enter your email address below and we'll send you a link to reset your
        password.
      </p>
      <ForgotPassForm />
    </div>
  );
}
