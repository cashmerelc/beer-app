import { styled } from "styled-components";
import JoinBeerBattleForm from "../Form/JoinBeerBattle";
import Link from "next/link";

const FooterContainer = styled.footer`
  background-color: var(--color-bg-accent);
  color: var(--color-text-light);
  padding: 20px;
  text-align: center;
  width: 100%;
`;

const FooterLink = styled(Link)`
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

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
`;

const FormItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FormContainer>
        <FormItem>
          <JoinBeerBattleForm />
        </FormItem>
        <FormItem>
          <FooterLink href="/beerbattle">Create Beer Battle</FooterLink>
        </FormItem>
      </FormContainer>
      <CopyText>
        &copy; {new Date().getFullYear()} Beer Battle. All rights reserved.
      </CopyText>
    </FooterContainer>
  );
}
