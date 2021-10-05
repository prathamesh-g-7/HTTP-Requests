import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  mobile: Number,
  password: String,
});

export default mongoose.model("users", userSchema);
