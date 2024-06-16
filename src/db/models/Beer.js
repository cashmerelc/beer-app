import mongoose from "mongoose";

const { Schema } = mongoose;

const beerSchema = new Schema({
  externalId: { type: String, required: true },
  name: { type: String, required: true },
});

const Beer = mongoose.models?.Beer || mongoose.model("Beer", beerSchema);

export default Beer;
