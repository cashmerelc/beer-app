import { styled } from "styled-components";
import JoinBeerBattleForm from "../Form/JoinBeerBattle";
import Link from "next/link";

const FooterContainer = styled.footer`
  background-color: var(--color-bg-accent);
  color: var(--color-text-light);
  padding: 20px;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
`;

const FooterLink = styled.a`
  color: var(--color-text-light);
  margin: 0 10px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CopyText = styled.p`
  font-size: 12px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export default function Footer({ onJoinSuccess }) {
  return (
    <FooterContainer>
      <FooterContent>
        <JoinBeerBattleForm onJoinSuccess={onJoinSuccess} />
        <FooterLink as={Link} href="/beerbattle">
          Create Beer Battle
        </FooterLink>
      </FooterContent>
      <CopyText>
        &copy; {new Date().getFullYear()} Beer Battle. All rights reserved.
      </CopyText>
    </FooterContainer>
  );
}
