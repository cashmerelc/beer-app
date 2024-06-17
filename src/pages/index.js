// src/pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import JoinBeerBattleForm from "../components/Form/JoinBeerBattle";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  console.log("Session Data: ", session);

  return (
    <div>
      {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
          <JoinBeerBattleForm />
          <Link href="/beerbattle">Create Beer Battle</Link>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </div>
  );
}
