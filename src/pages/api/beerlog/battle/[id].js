import dbConnect from "../../../../db/dbConnect";
import BeerLog from "../../../../db/models/BeerLog";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const beerLogs = await BeerLog.find({ beerBattle: id }).populate("user");
      res.status(200).json(beerLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch beer logs" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
