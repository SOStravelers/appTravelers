import { useState, useEffect } from "react";
import ChangeEmailForm from "@/components/utils/forms/ChangeEmailForm";
import ValidateEmailForm from "@/components/utils/forms/ValidateEmailForm";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function ChangeEmail() {
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
  const [validatingMail, setValidatingMail] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);
  return (
    <div
      className={`px-6 flex  flex-col items-center
     ${loading ? opacityAnimation : displayAnimation}
   `}
    >
      <h1 className="text-md text-textColor font-bold mb-3">Change Email</h1>
      {validatingMail ? (
        <ValidateEmailForm email={email} userId={id} change={true} />
      ) : (
        <ChangeEmailForm
          setEmail={setEmail}
          setId={setId}
          setValidatingMail={setValidatingMail}
        />
      )}
    </div>
  );
}
