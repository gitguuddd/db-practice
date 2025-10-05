import PostModel from "../models/post.model";
import TagModel from "../models/tag.model";

export class PostsService {
  constructor() {}

  async createPost(createBody: {
    title: string;
    content: string;
    author: string;
    tags: { name: string; slug: string }[];
  }) {
    const newPost = new PostModel(createBody);
    await newPost.save();

    if (newPost.status === 'active') {
      await Promise.all(
        createBody.tags.map(async (tag) => {
          await TagModel.findOneAndUpdate(
            { slug: tag.slug },
            { 
              $inc: { activePostsCount: 1 },
              $setOnInsert: { name: tag.name, slug: tag.slug }
            },
            { upsert: true }
          );
        })
      );
    }

    return newPost;
  }

  async getPosts() {
    const posts = await PostModel.find().populate('comments').exec();
    return posts;
  }

  async getPostByContent(content: string) {
    const posts = await PostModel.find({ content: { $regex: content, $options: 'i' } }).populate('comments').exec();
    return posts;
  }

  async getTags() {
    const tags = await TagModel.find();
    return tags;
  }

  async archivePost(id: string) {
    const post = await PostModel.findByIdAndUpdate(id, { status: 'archived' });

    if (!post) {
      throw new Error('Post not found');
    }

    await Promise.all(
      post.tags.map(async (tag: { slug: string }) => {
        await TagModel.findOneAndUpdate(
          { slug: tag.slug },
          { $inc: { activePostsCount: -1 } }
        );
      })
    );
    return post;
  }
}

export const postsService = new PostsService();