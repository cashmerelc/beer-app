import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BeerBattleList() {
  const { data: session } = useSession();
  const [beerBattles, setBeerBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeerBattles = async () => {
      if (session) {
        try {
          const response = await fetch("/api/beerbattle/byUser");
          if (response.ok) {
            const data = await response.json();
            setBeerBattles(data.beerBattles);
          } else {
            console.error("Failed to fetch beer battles");
          }
        } catch (error) {
          console.error("Error fetching beer battles:", error);
        }
      }
      setLoading(false);
    };

    fetchBeerBattles();
  }, [session]);

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return <p>Please log in to see your beer battles.</p>;
  }

  if (beerBattles.length === 0) {
    return (
      <div>
        <p>You are not a member of any beer battles.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Beer Battles</h2>
      <ul>
        {beerBattles.map((battle) => (
          <li key={battle._id}>
            <Link href={`/beerbattle/${battle._id}`}>
              {battle.name} - Ends on{" "}
              {new Date(battle.endDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
