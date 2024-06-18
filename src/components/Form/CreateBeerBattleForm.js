import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Beer Battle Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Duration (days):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Beer Battle</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
