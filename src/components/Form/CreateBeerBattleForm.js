import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { styled } from "styled-components";

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
`;

const Form = styled.form`
  background-color: var(--color-bg-secondary);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--color-text-main);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-main);
  color: var(--color-text-main);
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  background-color: var(--color-button-bg);
  color: var(--color-text-light);
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: var(--color-button-hover-bg);
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 10px;
`;

export default function CreateBeerBattleForm() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      console.log("Fetching session data...");
    } else {
      console.log("Session Data: ", session);
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to create a Beer Battle");
      return;
    }

    try {
      const response = await fetch("/api/beerbattle/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, duration }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Beer Battle Created:", data);
        setError(null);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create Beer Battle");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Beer Battle Name:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Duration (days):</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Create Beer Battle</Button>
        {error && <Error>{error}</Error>}
      </Form>
    </FormContainer>
  );
}
