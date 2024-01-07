import { useState, useEffect } from "react";
import ChangeEmailForm from "@/components/utils/forms/ChangeEmailForm";
import ValidateEmailForm from "@/components/utils/forms/ValidateEmailForm";
export default function ChangeEmail() {
  const [email, setEmail] = useState(null);
  const [validatingMail, setValidatingMail] = useState(false);

  return (
    <div className="px-5 py-28 md:pl-80">
      {validatingMail ? (
        <ValidateEmailForm email={email} />
      ) : (
        <ChangeEmailForm
          setEmail={setEmail}
          setValidatingMail={setValidatingMail}
        />
      )}
    </div>
  );
}
