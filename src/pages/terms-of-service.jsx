import React from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function TermsOfService() {
  const router = useRouter();
  useEffect(() => {
    document.title = "SOS Travelers - Terms of service";
  }, []);
  return (
    <section className="m-2 py-32 mb-16  xl:px-32 xl:ml-32">
      <h1 className="mb-2 font-bold text-2xl">
        SOS Travelers Terms of Service
      </h1>
      <p className="mb-5 text-sm">
        <b className="mr-1">Last update: </b> September 2023
      </p>
      <h2 className="mb-2 font-bold text-lg">1. Acceptance of Terms.</h2>
      <p className="mb-2">
        By accessing and using the SOS Travelers platform, you automatically
        agree to comply with these Terms and all policies and guidelines
        incorporated by reference. This includes the Privacy Policy, fee and
        payment policies, and any other platform-specific policies. It is
        important to note that these terms constitute a legally binding contract
        between the user and SOS Travelers, so it is essential to read them
        carefully before using our services. If you do not agree with any of the
        terms, we kindly ask you not to use our platform.
      </p>
      <h2 className="mb-2 font-bold text-lg">2. Service Description.</h2>
      <p className="mb-2">
        SOS Travelers is an online platform that serves as an intermediary
        between three main parties:
      </p>
      <h3 className="mb-2 font-bold text-sm">2.1 Establishment:</h3>
      <p className="mb-2">
        Establishments are accommodation businesses such as hostels or hotels
        that offer physical spaces for service provision. Through our platform,
        establishments can list their services and available spaces.
      </p>
      <h3 className="mb-2 font-bold text-sm">2.2 Workers:</h3>
      <p className="mb-2">
        Workers are individuals who provide specific services within the
        establishments provided by the hosts. Workers can include, for example,
        tour guides, chefs, massage therapists, or anyone offering a hospitality
        and tourism-related service. It&apos;s important to note that workers
        are independently contracted and are not employees of SOS Travelers.
      </p>
      <h3 className="mb-2 font-bold text-sm">2.3 Users:</h3>
      <p className="mb-2">
        Users are natural persons who require specific services performed by
        workers in a given establishment. Users can browse the platform, search
        for services, read reviews, and make reservations. Our platform provides
        tools to facilitate communication between users, workers, and
        establishments.
      </p>
      <h3 className="mb-2 font-bold text-lg">
        3. Responsibilities of SOS Travelers.
      </h3>
      <p className="mb-2">
        SOS Travelers assumes various responsibilities to ensure the proper
        functioning of the platform:
      </p>
      <h3 className="mb-2 font-bold text-sm">3.1. Reliable Intermediary:</h3>
      <p className="mb-2">
        Our primary function is to serve as a reliable intermediary between
        establishments, workers, and users. We facilitate the connection and
        communication between these parties so they can collaborate in the
        provision of services.
      </p>
      <h3 className="mb-2 font-bold text-sm">3.2. Secure Environment:</h3>
      <p className="mb-2">
        We are committed to providing a secure environment for users to
        interact. We implement security measures, such as identity verifications
        and user reviews, to help ensure the platform&apos;s reliability.
      </p>
      <h3 className="mb-2 font-bold text-sm">3.3. Assistance and Support:</h3>
      <p className="mb-2">
        We offer customer assistance and support to address any issues or
        inquiries related to the platform. We are available to help users
        resolve problems and clarify any doubts.
      </p>
      <h3 className="mb-2 font-bold text-sm">3.4. Payment Management:</h3>
      <p className="mb-2">
        SOS Travelers facilitates payments between the parties involved in
        transactions. We also collect a commission for the use of the platform,
        which is detailed in our fee and payment policies.
      </p>
      <h3 className="mb-2 font-bold text-lg">4. User Responsibilities.</h3>
      <p className="mb-2">
        Both establishments, workers, and users have certain responsibilities
        when using our platform:
      </p>
      <h3 className="mb-2 font-bold text-sm">4.1. Legal Compliance:</h3>
      <p className="mb-2">
        All parties must comply with all applicable laws and regulations in
        their geographic area. This includes, but is not limited to, laws
        related to hospitality, tourism services, and taxes.
      </p>
      <h3 className="mb-2 font-bold text-sm">4.2. Accurate Information:</h3>
      <p className="mb-2">
        Users must provide accurate and up-to-date information in their
        profiles. This includes personal information, contact information, and
        any other relevant information.
      </p>
      <h3 className="mb-2 font-bold text-sm">4.3. Respect for the Terms:</h3>
      <p className="mb-2">
        All parties must respect the terms of any agreements made through the
        platform. This includes reservation agreements, cancellation policies,
        and any other specific agreements between the parties involved.
      </p>
      <h3 className="mb-2 font-bold text-sm">4.4. Respectful Communication:</h3>
      <p className="mb-2">
        It is important to maintain respectful and professional communication in
        all interactions through the platform. Mutual respect is essential for
        creating a positive experience for all users.
      </p>
      <h3 className="mb-2 font-bold text-sm">
        4.5. Collaboration in Conflict Resolution:
      </h3>
      <p className="mb-2">
        In the event of a conflict or issue arising during the provision of
        services, all parties involved are expected to collaborate in its
        resolution in a friendly and fair manner. SOS Travelers is available to
        mediate in cases of disputes.
      </p>
      <h3 className="mb-2 font-bold text-lg">5. Pagos y Tarifas.</h3>
      <p className="mb-2">
        Los pagos por los servicios prestados se gestionan a través de nuestra
        plataforma. Los establecimientos y trabajadores acuerdan sus tarifas,
        que pueden variar según el tipo de servicio y la ubicación. Los usuarios
        pueden ver las tarifas antes de realizar una reserva. SOS Travelers
        retiene una comisión por el uso de la plataforma, que se calcula sobre
        la base del monto total de la transacción. Los detalles específicos de
        las tarifas y los procedimientos de pago se pueden encontrar en nuestras
        políticas de tarifas y pagos.
      </p>
      <h3 className="mb-2 font-bold text-lg">6. Cancellations and Refunds.</h3>
      <p className="mb-2">
        Cancellation and refund policies may vary depending on the establishment
        or worker. Users should review these policies before booking a service.
        SOS Travelers strives to provide clear information about cancellation
        and refund policies in each service listing. In the event of a
        cancellation, users may be subject to charges according to the policies
        established by the establishment or worker.
      </p>
      <h3 className="mb-2 font-bold text-lg">7. Privacy Policy.</h3>
      <p className="mb-2">
        Our Privacy Policy provides a detailed description of how we collect,
        use, and share personal and platform information. By using our services,
        you agree to our Privacy Policy. The security and privacy of our users
        are of utmost importance to us, and we take measures to protect the
        information you share with us. You can review our Privacy Policy at any
        time for more details.
      </p>
      <h3 className="mb-2 font-bold text-lg">8. Modifications to the Terms.</h3>
      <p className="mb-2">
        SOS Travelers reserves the right to modify these Terms at any time. The
        modifications will become effective once they are published on our
        platform. We recommend that you periodically review the Terms to stay
        informed of any changes. In the event of significant changes, we will
        inform you via email or through the platform. These modifications may
        impact the rights and responsibilities of users, so it is important to
        stay informed about updates.
      </p>
      <h3 className="mb-2 font-bold text-lg">9. Account Termination.</h3>
      <p className="mb-2">
        SOS Travelers reserves the right to suspend or close user accounts that
        violate these Terms or our policies. This may occur in situations where
        a user fails to fulfill their responsibilities, does not respect
        agreements, or causes significant issues on the platform. In the event
        of an account termination, the user may lose access to the platform and
        any pending services.
      </p>
      <h3 className="mb-2 font-bold text-lg">10. Contact.</h3>
      <p className="mb-2">
        At SOS Travelers, we value effective communication with our users and
        understand that questions, concerns, or assistance needs may arise. To
        ensure a seamless experience and provide you with the support you may
        require, our primary contact method is email support. You can reach out
        to our support team anytime by sending an email to
        sostravelbr@gmail.com. We are available to answer your questions,
        address your concerns, and provide efficient assistance. Furthermore, we
        understand that disagreements or disputes may occasionally arise between
        users, workers, and establishments on our platform. To address these
        issues, we have established that the official means of dispute
        resolution will be addressed officially through the email support.
      </p>
      <h3 className="mb-2 font-bold text-lg">11. Intellectual Property.</h3>
      <p className="mb-2">
        At SOS Travelers, we respect and value the intellectual property rights
        of third parties and expect our users to do the same. Below are more
        important aspects related to copyright:
      </p>
      <h3 className="mb-2 font-bold text-sm">11.1. Copyright:</h3>
      <p className="mb-2">
        It is crucial for users to understand that when posting content on our
        platform, they must ensure that the content is original and that they
        have the necessary rights to use it. This means you should not upload
        content to the platform that infringes on the copyrights of others
        without their express permission or that violates any other intellectual
        property rights.
      </p>
      <h3 className="mb-2 font-bold text-sm">11.2. Ownership of User Data:</h3>
      <p className="mb-2">
        Data generated or provided by users when using our platform and
        services, including personal information, user-provided content, and
        other valuable information such as location and language preferences,
        will be used exclusively for the purposes specified by SOS Travelers in
        a timely and clear manner through the platform or email support.
      </p>
      <h3 className="mb-2 font-bold text-lg">12. User Accounts.</h3>
      <p className="mb-2">
        Creating user accounts is the first step to immerse yourself in the SOS
        Travelers experience and access all the options the platform offers for
        users. Our Terms of Service clearly define the conditions and guidelines
        governing this essential process. Here, we provide insight into what it
        entails:
      </p>
      <h3 className="mb-2 font-bold text-sm">
        12.1. Simple and Secure Registration:
      </h3>
      <p className="mb-2">
        At SOS Travelers, we prioritize simplicity and security. Our
        registration process is designed to be straightforward and quick, while
        our security measures protect your personal data.
      </p>
      <h3 className="mb-2 font-bold text-sm">
        12.2. Deletion of User Account:
      </h3>
      <p className="mb-2">
        At any time, the user can terminate their user account. To do this, SOS
        Travelers must provide through its platform an option that allows the
        user to perform this action. This does not exempt the user from their
        pending payments and commitments up to the date of the deletion of the
        user account. Additionally, once the account is deleted, the user will
        lose access to their service history, user profile options, and other
        personal data stored within the platform, such as favorites and
        conversations.
      </p>
      <OutlinedButton text="Return" onClick={() => router.push("/login")} />
    </section>
  );
}
