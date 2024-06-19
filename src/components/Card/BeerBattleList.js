import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Container = styled.div`
  background-color: var(--color-bg-main);
  color: var(--text-color);
  padding: 20px;
  width: 100%;
  flex: 1;
`;

const Title = styled.h2`
  color: var(--color-text-main);
`;

const SectionTitle = styled.h3`
  color: var(--color-text-secondary);
  margin-top: 50px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
`;

const ListItem = styled.li`
  width: 30%;
  height: 150px;
  background-color: var(--color-bg-secondary);
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  color: var(--color-text-main);
  &:hover {
    background-color: var(--color-button-hover-bg);
    color: var(--color-text-light);
  }
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const HorizontalRule = styled.hr`
  border: 0;
  height: 1px;
  background: var(--color-text-main);
  margin: 20px 0;
`;

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
    <Container>
      <Title>Your Beer Battles</Title>
      <HorizontalRule />
      <div>
        <SectionTitle>Ongoing Battles</SectionTitle>
        {ongoingBattles.length === 0 ? (
          <p>You have no ongoing beer battles.</p>
        ) : (
          <List>
            {ongoingBattles.map((battle) => (
              <ListItem key={battle._id}>
                <LinkStyled href={`/beerbattle/${battle._id}`}>
                  {battle.name} - Ends on{" "}
                  {new Date(battle.endDate).toLocaleDateString()}
                  <p>Days Remaining: </p>
                  {Math.ceil(
                    Math.abs(new Date(battle.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </LinkStyled>
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <div>
        <SectionTitle>Ended Battles</SectionTitle>
        {endedBattles.length === 0 ? (
          <p>You have no ended beer battles.</p>
        ) : (
          <List>
            {endedBattles.map((battle) => (
              <ListItem key={battle._id}>
                <LinkStyled href={`/beerbattle/${battle._id}`}>
                  {battle.name} - Ended on{" "}
                  {new Date(battle.endDate).toLocaleDateString()}
                </LinkStyled>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
}
