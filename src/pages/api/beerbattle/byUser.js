import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  const userId = session.user.userId;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const beerBattles = await BeerBattle.find({ participants: userId });
    res.status(200).json({ beerBattles });
  } catch (err) {
    res.status(500).json({ error: "Failed to get beer battles" });
  }
}
