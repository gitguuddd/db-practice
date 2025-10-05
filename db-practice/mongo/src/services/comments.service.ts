import CommentModel from "../models/comment.model";
import PostModel from "../models/post.model";

export class CommentsService {
  constructor() {}

  async createComment(createBody: {
    content: string;
    author: string;
    post_id: string;
  }) {
    const newComment = new CommentModel(createBody);
    await newComment.save();

    await PostModel.findByIdAndUpdate(
      createBody.post_id,
      { $push: { comments: newComment._id } }
    );

    return newComment;
  }
}

export const commentsService = new CommentsService();