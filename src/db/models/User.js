import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String },
  avatar: { type: String },
  //   comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
