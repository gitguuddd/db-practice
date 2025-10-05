import { model } from "mongoose";
import TagSchema from "../schemas/tag.schema";

const TagModel = model('Tag', TagSchema);

export default TagModel;
