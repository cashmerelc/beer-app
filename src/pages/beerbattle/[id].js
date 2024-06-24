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
`;

const ParticipantItem = styled.li`
  background-color: var(--color-bg-secondary);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

const BeerLogList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  background-color: var(--color-bg-main);
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 300px; /* Set a max-height for the list */
  overflow-y: auto; /* Add scroll for overflow content */
`;

const BeerLogItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid var(--color-text-secondary);
  &:last-child {
    border-bottom: none;
  }
  font-size: 0.9rem; /* Smaller font size for better readability */
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
  const [showBeerLogs, setShowBeerLogs] = useState(null);
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
      console.log(`Fetching logs for battleId: ${battleId}`);
      const response = await fetch(`/api/beerlog/battle/${battleId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }
      const logs = await response.json();
      console.log("Fetched logs:", JSON.stringify(logs, null, 2));

      if (!logs.length) {
        console.log("No logs found for this beer battle.");
        return;
      }

      const participantsLogCount = logs.reduce((acc, log) => {
        const userId = log.user._id.toString();
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      }, {});
      console.log(
        "Participant Log Count: ",
        JSON.stringify(participantsLogCount, null, 2)
      );

      const winnerId = Object.keys(participantsLogCount).reduce((a, b) =>
        participantsLogCount[a] > participantsLogCount[b] ? a : b
      );
      console.log("Winner ID: ", winnerId);

      console.log(`Fetching winner data for userId: ${winnerId}`);
      const winnerResponse = await fetch(`/api/user/${winnerId}`);
      if (!winnerResponse.ok) {
        throw new Error(
          `Failed to fetch winner data: ${winnerResponse.statusText}`
        );
      }
      const winnerData = await winnerResponse.json();
      console.log("Winner Data: ", JSON.stringify(winnerData, null, 2));

      setWinner({
        ...winnerData,
        beersLogged: participantsLogCount[winnerId],
      });
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

  console.log("Ended? ", beerBattle.status);
  console.log("Winner: ", winner);

  return (
    <Container>
      <Header>
        <Title>{beerBattle.name}</Title>
        {beerBattle.status === "ended" ? (
          <></>
        ) : (
          <>
            <SubTitle>
              End Date: {new Date(beerBattle.endDate).toLocaleDateString()}
            </SubTitle>
            <SubTitle>Days Remaining: {daysRemaining}</SubTitle>
            <SubTitle>Invitation Code: {beerBattle.inviteCode}</SubTitle>
          </>
        )}
      </Header>

      {beerBattle.status === "ended" && winner ? (
        <div>
          <Title>Winner: {winner.email}</Title>
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
                      setShowBeerLogs(
                        showBeerLogs === participant.user._id
                          ? null
                          : participant.user._id
                      )
                    }
                  >
                    {showBeerLogs === participant.user._id
                      ? "Hide Logs"
                      : "Show Logs"}
                  </BeerLogButton>
                  {showBeerLogs === participant.user._id && (
                    <BeerLogList>
                      {participant.beerLogs.map((log) => (
                        <BeerLogItem key={log._id}>
                          <p>
                            <strong>Beer:</strong> {log.beer.name}
                          </p>
                          <p>
                            <strong>Rating:</strong> {log.rating}
                          </p>
                          <p>
                            <strong>Review:</strong> {log.review}
                          </p>
                        </BeerLogItem>
                      ))}
                    </BeerLogList>
                  )}
                </ParticipantItem>
              ))}
            </ParticipantList>
          </ParticipantsSection>
          {beerBattle.status === "ended" ? (
            <></>
          ) : (
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
          )}
        </>
      )}
    </Container>
  );
}
