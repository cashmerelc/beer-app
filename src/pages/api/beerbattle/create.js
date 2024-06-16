import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { name, duration } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    await dbConnect();

    const beerBattle = new BeerBattle({
      name,
      creator: session.user.id,
      participants: [session.user.id],
      duration,
      startDate,
      endDate,
    });

    try {
      const savedBeerBattle = await beerBattle.save();
      res.status(201).json("Beer Battle Created: ", savedBeerBattle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create beer battle" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
