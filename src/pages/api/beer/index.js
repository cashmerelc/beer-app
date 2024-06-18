import dbConnect from "../../../db/dbConnect.js";
import Beer from "../../../db/models/Beer.js";

export default async function handler(req, res) {
  await dbConnect();
  console.log("Add Beer Request Method: ", req.method);
  console.log("Add Beer Request Query: ", req.query);
  if (req.method === "GET") {
    const { search } = req.query;
    console.log("Search term: ", search);
    try {
      let beers;
      if (search) {
        beers = await Beer.find({
          name: { $regex: search, $options: "i" },
        }).limit(10);
      } else {
        beers = await Beer.find();
      }
      if (!beers || beers.length === 0) {
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
      const { newBeers, name } = req.body;
      if (newBeers) {
        await Beer.insertMany(
          newBeers.map((beer) => ({
            externalId: beer.id,
            name: beer.name,
          }))
        );
      } else if (name) {
        const newBeer = new Beer({ name });
        await newBeer.save();
        return res.status(201).json(newBeer);
      }
      return res.status(201).json({ status: "Beers added successfully" });
    } catch (err) {
      console.log("Error: ", err);
      return res.status(500).json({ error: err });
    }
  }

  return res.status(405).json({ status: "Method Not Allowed" });
}
