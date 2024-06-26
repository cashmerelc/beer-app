import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { name, duration } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(duration));

    const inviteCode = uuidv4();

    const beerBattle = new BeerBattle({
      name,
      creator: session.user.userId,
      participants: [session.user.userId],
      duration: parseInt(duration),
      startDate,
      endDate,
      inviteCode,
    });

    try {
      const savedBeerBattle = await beerBattle.save();
      res.status(201).json(savedBeerBattle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create beer battle" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
