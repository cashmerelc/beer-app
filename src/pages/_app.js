// import "@/styles/globals.css";
import GlobalStyle from "../styles/GlobalStyles";
import Layout from "../components/Layout/Layout";
import React from "react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
