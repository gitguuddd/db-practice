import { Schema } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

export default CommentSchema;