import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dummyUserId: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
