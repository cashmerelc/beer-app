import dbConnect from "../../../db/dbConnect";
import BeerLog from "../../../db/models/BeerLog";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const beerLogs = await BeerLog.find({ beerBattle: id })
        .populate("beer")
        .populate("user");
      if (!beerLogs) {
        return res
          .status(404)
          .json({ error: "No beer logs found for this beer battle" });
      }
      res.status(200).json(beerLogs);
    } catch (err) {
      res.status(500).json({ err: "Failed to fetch beer logs" });
    }
  } else {
    res.status(405).json({ err: "Method not allowed" });
  }
}
