// src/pages/_document.jsx (o /pages/_document.jsx si no usas `src/`)
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      {" "}
      {/* 👈 Aquí se aplicará la clase .dark desde App.jsx */}
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
