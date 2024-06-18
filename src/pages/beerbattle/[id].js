import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BeerSearch from "../../components/Form/BeerSearch";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BeerBattleDashboard() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    () => (id ? `/api/beerbattle/${id}` : null),
    fetcher
  );
  const { data: session } = useSession();
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showBeerSearch, setShowBeerSearch] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (data) {
      const endDate = new Date(data.beerBattle.endDate);
      const today = new Date();
      const diffTime = Math.abs(endDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);

      if (data.beerBattle.status === "ended") {
        calculateWinner(data.beerBattle._id);
      }
    }
  }, [data]);

  const calculateWinner = async (battleId) => {
    try {
      const response = await fetch(`/api/beerlog/battle/${battleId}`);
      const logs = await response.json();

      const participantsLogCount = logs.reduce((acc, log) => {
        acc[log.user] = (acc[log.user] || 0) + 1;
        return acc;
      }, {});

      const winnerId = Object.keys(participantsLogCount).reduce((a, b) =>
        participantsLogCount[a] > participantsLogCount[b] ? a : b
      );

      const winnerResponse = await fetch(`/api/user/${winnerId}`);
      const winnerData = await winnerResponse.json();

      setWinner(winnerData);
    } catch (error) {
      console.error("Error calculating winner:", error);
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const { beerBattle, participants } = data;

  return (
    <div>
      <h1>{beerBattle.name}</h1>
      <p>End Date: {new Date(beerBattle.endDate).toLocaleDateString()}</p>
      <p>Days Remaining: {daysRemaining}</p>

      {beerBattle.status === "ended" && winner ? (
        <div>
          <h2>Winner: {winner.username}</h2>
          <p>Beers logged: {winner.beersLogged}</p>
        </div>
      ) : (
        <>
          <h2>Participants</h2>
          <ul>
            {participants.map((participant) => (
              <li key={participant.user._id}>
                <h3>{participant.user.username}</h3>
                <p>Email: {participant.user.email}</p>
                <p>Unique Beers Logged: {participant.beerLogs.length}</p>
                <ul>
                  {participant.beerLogs.map((log) => (
                    <li key={log._id}>
                      <p>Beer: {log.beer.name}</p>
                      <p>Rating: {log.rating}</p>
                      <p>Review: {log.review}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <h2>Add a Beer</h2>
          <button onClick={() => setShowBeerSearch(!showBeerSearch)}>
            {showBeerSearch ? "Cancel" : "Add Beer"}
          </button>
          {showBeerSearch && <BeerSearch beerBattleId={id} />}
        </>
      )}
    </div>
  );
}
