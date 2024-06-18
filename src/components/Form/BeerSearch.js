import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BeerSearch({ beerBattleId, onBeerLogAdded }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [showAddNewBeer, setShowAddNewBeer] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const { data, error } = useSWR(
    searchTerm ? `/api/beer?search=${searchTerm}` : null,
    fetcher
  );

  const handleBeerClick = (beer) => {
    setSelectedBeer(beer);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      console.error("You must be logged in to add a beer log");
      return;
    }

    try {
      const response = await fetch("/api/beerlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beerId: selectedBeer._id,
          beerBattleId,
          rating,
          review,
        }),
      });

      if (response.ok) {
        console.log("Beer Log Created");
        onBeerLogAdded();
      } else {
        console.error("Failed to create beer log");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (error) return <div>Failed to load beers</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a beer..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <div>
        {data && data.beers && data.beers.length > 0 ? (
          <ul>
            {data.beers.map((beer) => (
              <li key={beer._id} onClick={() => handleBeerClick(beer)}>
                {beer.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No beers found</p>
        )}
      </div>
      {searchTerm && data && data.beers && data.beers.length === 0 && (
        <div>
          <p>Beer not found</p>
          <button onClick={() => setShowAddNewBeer(true)}>Add New Beer</button>
          {showAddNewBeer && <AddNewBeerForm searchTerm={searchTerm} />}
        </div>
      )}
      {selectedBeer && (
        <form onSubmit={handleSubmit}>
          <h2>Selected Beer: {selectedBeer.name}</h2>
          <div>
            <label>Rating:</label>
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
              required
            />
          </div>
          <button type="submit">Add Beer Log</button>
        </form>
      )}
    </div>
  );
}

function AddNewBeerForm({ searchTerm }) {
  const [name, setName] = useState(searchTerm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/beer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        console.log("Beer Added");
      } else {
        console.error("Failed to add beer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Beer Name:</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <button type="submit">Add Beer</button>
    </form>
  );
}
