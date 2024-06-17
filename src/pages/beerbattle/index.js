import Head from "next/head";
import CreateBeerBattleForm from "../../components/Form/CreateBeerBattleForm";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log("Session Data on form page: ", session);

  return (
    <>
      <Head>
        <title>Create Beer Battle</title>
        <meta name="description" content="Create a new beer battle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Create a New Beer Battle</h1>
        <CreateBeerBattleForm />
      </main>
    </>
  );
}
