import mongoose from "mongoose";

const { Schema } = mongoose;

const beerBattleSchema = new Schema({
  name: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  duration: { type: Number, required: true }, // duration in days
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  inviteCode: { type: String, required: true },
  status: { type: String, enum: ["ongoing", "ended"], default: "ongoing" },
});

const BeerBattle =
  mongoose.models?.BeerBattle || mongoose.model("BeerBattle", beerBattleSchema);

export default BeerBattle;
