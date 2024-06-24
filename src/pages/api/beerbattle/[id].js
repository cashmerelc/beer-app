import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";
import BeerLog from "../../../db/models/BeerLog";
import User from "../../../db/models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();
    console.log("Database connected successfully");
  } catch (dbError) {
    console.error("Database connection error:", dbError);
    return res.status(500).json({ error: "Database connection failed" });
  }

  const { id } = req.query;
  console.log("ID in API Route: ", id);

  if (req.method === "GET") {
    try {
      const beerBattle = await BeerBattle.findById(id).populate("participants");
      console.log("Fetched BeerBattle:", beerBattle);
      if (!beerBattle) {
        return res.status(404).json({ error: "Beer Battle not found" });
      }

      const participants = await Promise.all(
        beerBattle.participants.map(async (participantId) => {
          try {
            const user = await User.findById(participantId);
            const beerLogs = await BeerLog.find({
              user: participantId,
              beerBattle: id,
            }).populate("beer");
            console.log(`Fetched data for participant ${participantId}:`, {
              user,
              beerLogs,
            });
            return {
              user,
              beerLogs,
            };
          } catch (participantError) {
            console.error(
              `Error fetching data for participant ${participantId}:`,
              participantError
            );
            throw participantError;
          }
        })
      );

      res.status(200).json({ beerBattle, participants });
    } catch (error) {
      console.error("Error fetching beer battle details:", error);
      res.status(500).json({ error: "Failed to fetch beer battle details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
