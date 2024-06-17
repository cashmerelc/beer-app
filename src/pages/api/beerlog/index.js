import dbConnect from "../../../db/dbConnect";
import BeerLog from "../../../db/models/BeerLog";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { beerId, beerBattleId, rating, review } = req.body;

    try {
      const beerLog = new BeerLog({
        beer: beerId,
        user: session.user.userId,
        beerBattle: beerBattleId,
        rating,
        review,
      });

      const newBeerLog = await beerLog.save();
      res.status(201).json(newBeerLog);
    } catch (err) {
      res.status(500).json({ err: "Failed to create beer log" });
    }
  } else {
    res.status(405).json({ err: "Method not allowed" });
  }
}
