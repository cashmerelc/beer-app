import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import dbConnect from "../../../db/dbConnect";
import BeerBattle from "../../../db/models/BeerBattle";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  console.log("Session info in join API route: ", session);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { inviteCode } = req.body;

    try {
      const beerBattle = await BeerBattle.findOne({ inviteCode });

      if (!beerBattle) {
        return res.status(404).json({ error: "Invalid code." });
      }
      if (!beerBattle.participants.includes(session.user.userId)) {
        beerBattle.participants.push(session.user.userId);
        await beerBattle.save();
      }

      res.status(200).json(beerBattle);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
