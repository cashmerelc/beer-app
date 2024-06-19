// src/pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import BeerBattleList from "../components/Card/BeerBattleList";
import Image from "next/image";
import { styled } from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const Title = styled.h2`
  color: var(--color-text-main);
  margin-top: 20px; /* Add some margin to create space between the image and the title */
`;

const SectionTitle = styled.h3`
  color: var(--color-text-secondary);
  margin-top: 10px; /* Add some margin to create space between the title and the section title */
`;

export default function Home() {
  const { data: session } = useSession();

  console.log("Session Data: ", session);

  return (
    <Container>
      {session ? (
        <>
          <BeerBattleList />
        </>
      ) : (
        <CenteredContent>
          <Image.default
            src="/images/bblogo.png"
            alt="Beer Battle Logo"
            width={200}
            height={200}
            style={{ borderRadius: "20%" }}
          />
          <Title>Try &quot;thest&quot; unique beers</Title>
          <SectionTitle>Drink Responsibly</SectionTitle>
        </CenteredContent>
      )}
    </Container>
  );
}
