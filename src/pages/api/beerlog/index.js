import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";
import dbConnect from "../../../db/dbConnect.js";
import BeerLog from "../../../db/models/BeerLog.js";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  console.log("Add beer log request: ", req.body);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { beerId, beerBattleId, rating, review } = req.body;

    const beerLog = new BeerLog({
      beer: beerId,
      user: session.user.userId,
      beerBattle: beerBattleId,
      rating,
      review,
      createdAt: new Date(),
    });

    try {
      const savedBeerLog = await beerLog.save();
      res.status(201).json(savedBeerLog);
    } catch (error) {
      res.status(500).json({ error: "Failed to create beer log" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
