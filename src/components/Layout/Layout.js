import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { styled } from "styled-components";
import Footer from "../Footer/Footer";

const Navbar = styled.nav`
  background-color: var(--color-bg-accent);
  color: var(--color-text-main);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-main);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: var(--color-bg-main);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: ${(props) => (props.show ? "block" : "none")};
  border-radius: 4px;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: var(--color-text-main);
  text-align: left;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  & + & {
    border-top: 1px solid var(--color-bg-accent);
  }
`;

const MainContent = styled.main`
  padding-bottom: 210px;
`;

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  console.log("Image: ", Image);
  return (
    <>
      <Navbar>
        <Logo>
          <Link href="/">
            <Image.default
              src="/images/bblogo.png"
              alt="Beer Battle Logo"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
          </Link>
        </Logo>
        <NavLinks>
          {session ? (
            <>
              <ProfileButton onClick={toggleDropdown}>
                <Image.default
                  src={session.user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                />
              </ProfileButton>
              <DropdownMenu show={dropdownOpen}>
                <DropdownItem>
                  <Link href="/profile">Profile</Link>
                </DropdownItem>
                <DropdownItem onClick={() => signOut()}>Sign out</DropdownItem>
              </DropdownMenu>
            </>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
          )}
        </NavLinks>
      </Navbar>
      <MainContent>{children}</MainContent>
      {session ? <Footer /> : <></>}
    </>
  );
}
