import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import styled from "styled-components";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Container = styled.div`
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 4px;
`;

const BeerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BeerListItem = styled.li`
  background-color: var(--color-bg-secondary);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-button-hover-bg);
  }
`;

const AddNewBeerContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 4px;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: var(--color-button-bg);
  color: var(--color-text-light);
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-button-hover-bg);
  }
`;

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
    <Container>
      <Input
        type="text"
        placeholder="Search for a beer..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <div>
        {data && data.beers && data.beers.length > 0 ? (
          <BeerList>
            {data.beers.map((beer) => (
              <BeerListItem
                key={beer._id}
                onClick={() => handleBeerClick(beer)}
              >
                {beer.name}
              </BeerListItem>
            ))}
          </BeerList>
        ) : (
          <p>No beers found</p>
        )}
      </div>
      {searchTerm && data && data.beers && data.beers.length === 0 && (
        <AddNewBeerContainer>
          <p>Beer not found</p>
          <Button onClick={() => setShowAddNewBeer(true)}>Add New Beer</Button>
          {showAddNewBeer && <AddNewBeerForm searchTerm={searchTerm} />}
        </AddNewBeerContainer>
      )}
      {selectedBeer && (
        <Form onSubmit={handleSubmit}>
          <h2>Selected Beer: {selectedBeer.name}</h2>
          <div>
            <FormLabel>Rating:</FormLabel>
            <FormInput
              type="number"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              min="1"
              max="10"
              required
            />
          </div>
          <div>
            <FormLabel>Review:</FormLabel>
            <FormTextarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Beer Log</Button>
        </Form>
      )}
    </Container>
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
    <Form onSubmit={handleSubmit}>
      <div>
        <FormLabel>Beer Name:</FormLabel>
        <FormInput
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Beer</Button>
    </Form>
  );
}
