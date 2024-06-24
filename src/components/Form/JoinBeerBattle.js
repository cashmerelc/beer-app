import { useState } from "react";
import { useSession } from "next-auth/react";
import { styled } from "styled-components";

const Form = styled.form`
  background-color: var(--color-bg-secondary);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--color-text-main);
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-main);
  color: var(--color-text-main);
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: var(--color-button-bg);
  color: var(--color-text-light);
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: var(--color-button-hover-bg);
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 5px;
  font-size: 0.9rem;
`;

export default function JoinBeerBattleForm() {
  const { data: session } = useSession();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      alert("You must be logged in to join a Beer Battle");
      return;
    }

    try {
      const response = await fetch("/api/beerbattle/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Joined Beer Battle: ", data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to join Beer Battle.");
      }
    } catch (err) {
      console.error("Error: ", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Invite Code:</Label>
        <Input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
      </FormGroup>
      <Button type="submit">Join</Button>
      {error && <Error>{error}</Error>}
    </Form>
  );
}
