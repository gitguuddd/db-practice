import { model } from "mongoose";
import PostSchema from "../schemas/post.schema";

const PostModel = model('Post', PostSchema);

export default PostModel;