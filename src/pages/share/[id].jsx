// pages/share/[id].jsx
import Head from "next/head";
import { useEffect } from "react";
import SetLocalStorage from "../../utils/apis";
const env = process.env.NEXT_PUBLIC_NODE_ENV || "dev";
const api = SetLocalStorage(env).api;
// console.log("la api", api);
export default function SharePreview({ id, title, description, image }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `/service-preview/${id}`;
    }, 2000);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${NEXTAUTH_URL}/share/${id}`} />
      </Head>

      <h1>Redireccionando…</h1>
      <noscript>
        Si no eres redirigido, haz clic{" "}
        <a href={`/service-preview/${id}`}>aquí</a>
      </noscript>
    </>
  );
}

// 👉 Desactiva layout global, middleware, sidebar, etc.
SharePreview.noLayout = true;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { lang } = context.query;

  try {
    const res = await fetch(`${api}/subservices/byId/${id}`);
    const data = await res.json();

    const language = lang || "en";
    const props = {
      id,
      title: data.name?.[language] || "SOS Travelers",
      description: "Discover unique experiences at SOS Travelers.",
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
