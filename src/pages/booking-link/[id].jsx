// pages/share/[id].jsx
import Head from "next/head";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SetLocalStorage from "../../utils/apis";
const env = process.env.NEXT_PUBLIC_NODE_ENV || "dev";
const api = SetLocalStorage(env).api;
// console.log("la api", api);
export default function BookingLink({ id, title, image, tokenId, bookingId }) {
  const router = useRouter();
  useEffect(() => {
    console.log("wena");
    const timer = setTimeout(() => {
      // window.location.href = `/service-preview/${id}`;
      let tokenAuth = Cookies.get("auth.access_token");
      if (tokenAuth) {
        goToPage(1);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [id]);

  const goToPage = (number) => {
    if (number == 1) {
      router.push(`/my-booking/${bookingId}`);
    } else if (number == 2) {
      router.push(`/purchase/${tokenId}`);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content="My Booking" />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${process.env.NEXTAUTH_URL}/purchaseOrder/${tokenId}`}
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-backgroundP">
        <div className="w-10 h-10 border-4 border-t-transparent border-textColor rounded-full animate-spin"></div>
      </div>
      <noscript>
        Si no eres redirigido, haz clic <p onClick={goToPage}>aquí</p>
      </noscript>
    </>
  );
}

// 👉 Desactiva layout global, middleware, sidebar, etc.
BookingLink.noLayout = true;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { lang } = context.query;

  try {
    console.log("wena");
    const res = await fetch(`${api}bookings/dataLink/?token=${id}`);
    if (!res.ok) {
      console.error("Fallo al obtener datos:", res.status, await res.text());
      return { notFound: true };
    }
    const data = await res.json();

    const language = lang || "en";
    const props = {
      tokenId: id,
      bookingId: data._id,
      title: data.name?.[language] || "SOS Travelers",
      image: data.imgUrl || "https://sostvl.com/assets/logoRedes.png",
    };
    return {
      props: props,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
