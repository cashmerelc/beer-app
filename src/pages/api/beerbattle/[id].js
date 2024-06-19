import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";
import BeerLog from "../../../db/models/BeerLog";
import User from "../../../db/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;
  console.log("ID in API Route: ", id);
  if (req.method === "GET") {
    try {
      const beerBattle = await BeerBattle.findById(id).populate("participants");
      if (!beerBattle) {
        return res.status(404).json({ error: "Beer Battle not found" });
      }

      const participants = await Promise.all(
        beerBattle.participants.map(async (participantId) => {
          const user = await User.findById(participantId);
          const beerLogs = await BeerLog.find({
            user: participantId,
            beerBattle: id,
          }).populate("beer");
          return {
            user,
            beerLogs,
          };
        })
      );

      res.status(200).json({ beerBattle, participants });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch beer battle details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
