export async function getServerSideProps() {
  console.log("🔧 SSR FUNCIONA");
  return { props: {} };
}

export default function Prueba() {
  return <h1>SSR de prueba funcionando</h1>;
}
