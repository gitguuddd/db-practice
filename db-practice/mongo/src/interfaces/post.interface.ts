import { Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  tags: {
    name: string;
    slug: string;
    activePostsCount: number;
  }[];
}