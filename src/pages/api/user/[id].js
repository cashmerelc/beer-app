import dbConnect from "../../../db/dbConnect";
import User from "../../../db/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
