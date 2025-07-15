import React from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UsePolicy() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Use Policy | SOS Travelers";
  }, []);

  return (
    <section className="  mb-16 px-3   md:pl-64 md:pr-5">
      <h1 className="mb-2 font-bold text-2xl text-textColorGray">
        SOS Travelers Use Policy
      </h1>
      <p className="mb-5 text-sm text-textColorGray">
        <b className="mr-1 text-textColorGray">Last update: </b> November 2023
      </p>
      <p className="text-textColorGray">
        At SOS Travelers, we acknowledge the importance of safeguarding the
        privacy and security of our users&apos; information. This Privacy Policy
        outlines how we collect, use, and protect the personal information
        provided by those who use our services.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        1. Collected Information.
      </h2>
      <p className="mb-2 text-textColorGray">
        User Data: We collect personal information during the registration
        process, such as names, email addresses, and contact details. Profile
        Information: Users can provide additional information in their profiles,
        such as travel preferences and other relevant details. Payment
        Information: To facilitate transactions, we collect financial
        information necessary for processing payments for services.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        2. Use of Information.
      </h2>
      <p className="mb-2 text-textColorGray">
        Service Provision: We use the information to facilitate the connection
        between establishments, workers, and users, enabling service provision
        and reservations. Security and Verification: We implement security
        measures to protect user information and conduct identity verifications
        when necessary. Communication: We use the information to facilitate
        communication among all involved parties and provide assistance as
        needed.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        3. Sharing Information.
      </h2>
      <p className="mb-2 text-textColorGray">
        With Third Parties: We share information with establishments and workers
        as necessary for service provision, always maintaining confidentiality.
        Legal Compliance: We may disclose information when required by law or to
        comply with legal processes.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        4. Information Security.
      </h2>
      <p className="mb-2 text-textColorGray">
        We implement technological and organizational security measures to
        protect information against unauthorized access and ensure data
        confidentiality.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        5. Cookies and Similar Technologies.
      </h2>
      <p className="mb-2 text-textColorGray">
        We use cookies and similar technologies to enhance the user experience
        and gather information about platform usage.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        6. User Rights.
      </h2>
      <p className="mb-2 text-textColorGray">
        Users have the right to access, correct, and delete their personal
        information. They can also opt out of receiving non-essential
        communications.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        7. Changes to the Privacy Policy.
      </h2>
      <p className="mb-2 text-textColorGray">
        We reserve the right to update this Privacy Policy. Changes will become
        effective after being published on the platform. Users are encouraged to
        periodically review.
      </p>
      <h2 className="mb-2 font-bold text-lg text-textColorGray">
        8. Minor Users.
      </h2>
      <p className="mb-2 text-textColorGray">
        Our services are not directed at individuals under 18 years old. We do
        not knowingly collect information from minors without verifiable
        parental consent. By using SOS Travelers&apos; services, users agree to
        this Privacy Policy. For privacy-related questions or concerns, users
        can contact our support team via the email provided in the terms of
        service.
      </p>
      <OutlinedButton
        dark="darkLight"
        buttonCenter={true}
        text="Return"
        margin="mt-10"
        textSize="text-sm"
        textColor="text-white"
        onClick={() => router.back()}
      />
    </section>
  );
}
