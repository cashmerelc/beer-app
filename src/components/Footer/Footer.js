import { styled } from "styled-components";
import JoinBeerBattleForm from "../Form/JoinBeerBattle";
import Link from "next/link";

const FooterContainer = styled.footer`
  background-color: var(--color-bg-accent);
  color: var(--color-text-light);
  padding: 20px;
  text-align: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 100px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 300px;
`;

const FooterLink = styled(Link)`
  display: block;
  background-color: var(--color-button-bg);
  color: var(--color-text-light);
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  &:hover {
    background-color: var(--color-button-hover-bg);
  }
`;

const CopyText = styled.p`
  font-size: 12px;
  margin-top: 20px;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FormContainer>
          <JoinBeerBattleForm />
        </FormContainer>
        <FooterLink href="/beerbattle">Create Beer Battle</FooterLink>
      </FooterContent>
      <CopyText>
        &copy; {new Date().getFullYear()} Beer Battle. All rights reserved.
      </CopyText>
    </FooterContainer>
  );
}
