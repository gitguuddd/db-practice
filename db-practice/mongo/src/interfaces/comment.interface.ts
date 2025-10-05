import { Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: string;
  post_id: string;
}