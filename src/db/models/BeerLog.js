import mongoose from "mongoose";

const { Schema } = mongoose;

const beerLogSchema = new Schema({
  beer: { type: Schema.Types.ObjectId, ref: "Beer", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  beerBattle: {
    type: Schema.Types.ObjectId,
    ref: "BeerBattle",
    required: true,
  },
  rating: { type: Number, min: 1, max: 10 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const BeerLog =
  mongoose.models.BeerLog || mongoose.model("BeerLog", beerLogSchema);

export default BeerLog;
