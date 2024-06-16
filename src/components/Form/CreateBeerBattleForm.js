import { useState } from "react";

export default function CreateBeerBattleForm() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } else {
      console.error("Failed to create Beer Battle");
    }
  };

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
    </form>
  );
}
