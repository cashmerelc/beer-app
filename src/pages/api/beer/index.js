import dbConnect from "../../../db/dbConnect.js";
import Beer from "../../../db/models/Beer.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const beers = await Beer.find();
      if (!beers) {
        return res.status(404).json({ status: "No beers found" });
      }
      return res.status(200).json({ beers });
    } catch (err) {
      console.log("Error: ", err);
      return res.status(500).json({ error: err });
    }
  }

  if (req.method === "POST") {
    try {
      const newBeers = req.body;
      await Beer.insertMany(
        newBeers.map((beer) => ({
          externalId: beer.id,
          name: beer.name,
        }))
      );
    } catch (err) {
      console.log("Error: ", err);
      return res.status(500).json({ error: err });
    }
  }

  return res.status(405).json({ status: "Method Not Allowed" });
}
