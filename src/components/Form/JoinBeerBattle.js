import { useState } from "react";
import { useSession } from "next-auth/react";

export default function JoinBeerBattleForm() {
  const { data: session } = useSession();
  const [inviteCode, setInviteCode] = useState("");

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
          body: JSON.stringify({ inviteCode }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Joined Beer Battle: ", data);
      } else {
        console.log("Failed to join Beer Battle.");
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Invite Code:</label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(event.target.value)}
          required
        />
      </div>
      <button type="submit">Join Beer Battle</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
