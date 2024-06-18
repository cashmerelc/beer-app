import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BeerBattleList() {
  const { data: session } = useSession();
  const [ongoingBattles, setOngoingBattles] = useState([]);
  const [endedBattles, setEndedBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeerBattles = async () => {
      if (session) {
        try {
          const response = await fetch("/api/beerbattle/byUser");
          if (response.ok) {
            const data = await response.json();
            setOngoingBattles(data.ongoingBattles);
            setEndedBattles(data.endedBattles);
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

  return (
    <div>
      <h2>Your Beer Battles</h2>
      <div>
        <h3>Ongoing Battles</h3>
        {ongoingBattles.length === 0 ? (
          <p>You have no ongoing beer battles.</p>
        ) : (
          <ul>
            {ongoingBattles.map((battle) => (
              <li key={battle._id}>
                <Link href={`/beerbattle/${battle._id}`}>
                  {battle.name} - Ends on{" "}
                  {new Date(battle.endDate).toLocaleDateString()}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>Ended Battles</h3>
        {endedBattles.length === 0 ? (
          <p>You have no ended beer battles.</p>
        ) : (
          <ul>
            {endedBattles.map((battle) => (
              <li key={battle._id}>
                <Link href={`/beerbattle/${battle._id}`}>
                  {battle.name} - Ended on{" "}
                  {new Date(battle.endDate).toLocaleDateString()}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
