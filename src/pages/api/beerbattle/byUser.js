import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.userId;

  try {
    const beerBattles = await BeerBattle.find({ participants: userId });
    const currentDate = new Date();

    const ongoingBattles = [];
    const endedBattles = [];

    // Check the status of each beer battle and separate them
    for (const battle of beerBattles) {
      if (
        new Date(battle.endDate) <= currentDate &&
        battle.status === "ongoing"
      ) {
        battle.status = "ended";
        await battle.save();
        endedBattles.push(battle);
      } else if (battle.status === "ended") {
        endedBattles.push(battle);
      } else {
        ongoingBattles.push(battle);
      }
    }

    res.status(200).json({ ongoingBattles, endedBattles });
  } catch (err) {
    res.status(500).json({ error: "Failed to get beer battles" });
  }
}
