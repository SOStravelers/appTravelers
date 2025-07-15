import ChangePassForm from "@/components/utils/forms/ChangePassForm";
import { useState, useEffect } from "react";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function ChangePassword() {
  useEffect(() => {
    document.title = "Change pass | SOS Travelers";
  }, []);
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
      <h1 className="text-md text-textColor font-bold mb-3">Change Password</h1>

      <ChangePassForm />
    </div>
  );
}
