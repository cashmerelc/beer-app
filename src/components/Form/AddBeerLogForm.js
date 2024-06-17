import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AddBeerLogForm({ beerBattleId }) {
  const { data: session } = useSession();
  const [beerId, setBeerId] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      setError("You must be logged in to add a beer log");
      return;
    }

    try {
      const response = await fetch("/api/beerlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ beerId, beerBattleId, rating, review }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Beer Log Created:", data);
      } else {
        const error = await response.json();
        console.log("Error adding beer log: ", error);
      }
    } catch (err) {
      console.log("Error adding beer log: ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Beer ID:</label>
        <input
          type="text"
          value={beerId}
          onChange={(event) => setBeerId(event.target.value)}
          required
        />
      </div>
      <div>
        <label>Rating (1-10):</label>
        <input
          type="number"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          min="1"
          max="10"
          required
        />
      </div>
      <div>
        <label>Review:</label>
        <textarea
          value={review}
          onChange={(event) => setReview(event.target.value)}
        ></textarea>
      </div>
      <button type="submit">Add Beer Log</button>
    </form>
  );
}
