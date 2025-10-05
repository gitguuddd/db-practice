import { model } from "mongoose";
import CommentSchema from "../schemas/comment.schema";

const CommentModel = model('Comment', CommentSchema);

export default CommentModel;