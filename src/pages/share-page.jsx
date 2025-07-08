// pages/share/[id].js
import Head from "next/head";

export default function SharePreview({ id, title, description, image }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://dev.sostvl.com/share/${id}`}
        />
      </Head>

      <h1>Redireccionando...</h1>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.href = "/service-preview/${id}";`,
        }}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`${process.env.API_URL}/subservices/${id}`);
    const data = await res.json();

    return {
      props: {
        id,
        title: data.name || "SOS Travelers",
        description:
          data.details?.slice(0, 150) || "Descubre experiencias únicas.",
        image: data.imgUrl || "https://sostvl.com/assets/logoRedes.png",
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
