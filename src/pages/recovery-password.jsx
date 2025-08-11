import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RecoveryPassForm from "@/components/utils/forms/RecoveryPassForm";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function RecoveryPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  return (
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      <h1 className="text-textColor text-center text-xl font-semibold mb-5 max-w-lg">
        Almost done!
      </h1>
      <p className="text-center text-textColorGray mb-5 max-w-lg">
        Enter your new password and confirm it.
      </p>
      <RecoveryPassForm user={router?.query?.user} />
    </div>
  );
}
