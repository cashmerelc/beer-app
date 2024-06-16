import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { beerBattleId, participantId } = req.body;

    await dbConnect();

    try {
      const beerBattle = await BeerBattle.findById(beerBattleId);

      if (!beerBattle) {
        return res.status(404).json({ error: "Beer Battle not found" });
      }

      if (beerBattle.participants.includes(participantId)) {
        return res.status(400).json({ error: "Participant already added" });
      }

      beerBattle.participants.push(participantId);
      await beerBattle.save();

      res.status(200).json({ message: "Participant added" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add participant" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
