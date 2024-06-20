import { styled } from "styled-components";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BeerSearch from "../../components/Form/BeerSearch";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Container = styled.div`
  background-color: var(--color-bg-main);
  color: var(--color-text-main);
  padding: 20px;
  min-height: calc(
    100vh - 120px
  ); /* Adjust based on your header and footer heights */
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--color-text-main);
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
`;

const ParticipantsSection = styled.div`
  margin-top: 30px;
`;

const ParticipantList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ParticipantItem = styled.li`
  background-color: var(--color-bg-secondary);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
`;

const ParticipantName = styled.h3`
  font-size: 1.5rem;
  color: var(--color-text-light);
`;

const ParticipantDetails = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
`;

const BeerLogButton = styled.button`
  background-color: var(--color-button-hover-bg);
  color: var(--color-text-light);
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: var(--color-bg-main);
  }
`;

const AddBeerSection = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const AddBeerButton = styled.button`
  background-color: var(--color-button-hover-bg);
  color: var(--color-text-light);
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-bg-main);
  }
`;

export default function BeerBattleDashboard() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, mutate } = useSWR(
    () => (id ? `/api/beerbattle/${id}` : null),
    fetcher
  );
  const { data: session } = useSession();
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showBeerSearch, setShowBeerSearch] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (data && data.beerBattle) {
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

  const handleBeerLogAdded = () => {
    setShowBeerSearch(false);
    mutate(); // Refetch the data
  };

  if (error) return <div>Failed to load</div>;
  if (!data || !data.beerBattle) return <div>Loading...</div>;

  const { beerBattle, participants } = data;

  return (
    <Container>
      <Header>
        <Title>{beerBattle.name}</Title>
        <SubTitle>
          End Date: {new Date(beerBattle.endDate).toLocaleDateString()}
        </SubTitle>
        <SubTitle>Days Remaining: {daysRemaining}</SubTitle>
      </Header>

      {beerBattle.status === "ended" && winner ? (
        <div>
          <Title>Winner: {winner.username}</Title>
          <SubTitle>Beers logged: {winner.beersLogged}</SubTitle>
        </div>
      ) : (
        <>
          <ParticipantsSection>
            <Title>Participants</Title>
            <ParticipantList>
              {participants.map((participant) => (
                <ParticipantItem key={participant.user._id}>
                  <ParticipantName>{participant.user.username}</ParticipantName>
                  <ParticipantDetails>
                    Email: {participant.user.email}
                  </ParticipantDetails>
                  <ParticipantDetails>
                    Unique Beers Logged: {participant.beerLogs.length}
                  </ParticipantDetails>
                  <BeerLogButton
                    onClick={() =>
                      setShowBeerSearch(
                        showBeerSearch === participant.user._id
                          ? false
                          : participant.user._id
                      )
                    }
                  >
                    {showBeerSearch === participant.user._id
                      ? "Hide Logs"
                      : "Show Logs"}
                  </BeerLogButton>
                  {showBeerSearch === participant.user._id && (
                    <ul>
                      {participant.beerLogs.map((log) => (
                        <li key={log._id}>
                          <p>Beer: {log.beer.name}</p>
                          <p>Rating: {log.rating}</p>
                          <p>Review: {log.review}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </ParticipantItem>
              ))}
            </ParticipantList>
          </ParticipantsSection>

          <AddBeerSection>
            <Title>Add a Beer</Title>
            <AddBeerButton onClick={() => setShowBeerSearch(!showBeerSearch)}>
              {showBeerSearch ? "Cancel" : "Add Beer"}
            </AddBeerButton>
            {showBeerSearch && (
              <BeerSearch
                beerBattleId={id}
                onBeerLogAdded={handleBeerLogAdded}
              />
            )}
          </AddBeerSection>
        </>
      )}
    </Container>
  );
}
