import { Schema } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  tags: [{
    name: { type: String, required: true },
    slug: { type: String, required: true },
  }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

export default PostSchema;