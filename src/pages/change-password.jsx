import ChangePassForm from "@/components/utils/forms/ChangePassForm";
import { useEffect } from "react";
export default function ChangePassword() {
  useEffect(() => {
    document.title = "Change pass | SOS Travelers";
  }, []);
  return (
    <div className="px-5 py-28 md:pl-80">
      <ChangePassForm />
    </div>
  );
}
