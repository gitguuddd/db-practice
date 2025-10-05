import { Schema } from "mongoose";

const TagSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  activePostsCount: { type: Number, default: 0 },
});

export default TagSchema;
