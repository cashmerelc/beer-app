import mongoose from "mongoose";

const { Schema } = mongoose;

const participantSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  beerBattleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BeerBattle",
    required: true,
  },
  beersLogged: [{ type: mongoose.Schema.Types.ObjectId, ref: "Beer" }],
});

const Participant =
  mongoose.models?.Participant ||
  mongoose.model("Participant", participantSchema);

export default Participant;
