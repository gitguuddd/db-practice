import express from 'express';
import { connectDatabase } from './config/database';
import { postsService } from './services/posts.service';
import { commentsService } from './services/comments.service';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/posts', async (req, res) => {
  const posts = await postsService.getPosts();
  res.json(posts);
});

app.get('/posts/find-by-content', async (req, res) => {
  const { content } = req.query;
  const post = await postsService.getPostByContent(content as string);
  res.json(post);
});

app.post('/posts', async (req, res) => {
  const { title, content, author, tags } = req.body;
  const post = await postsService.createPost({ title, content, author, tags });
  res.json(post);
});

app.patch('/posts/archive/:id', async (req, res) => {
  const { id } = req.params;
  const post = await postsService.archivePost(id);
  res.json(post);
});

app.get('/tags', async (req, res) => {
  const tags = await postsService.getTags();
  res.json(tags);
});

app.post('/comments', async (req, res) => {
  const { content, author, post_id } = req.body;
  const comment = await commentsService.createComment({ content, author, post_id });
  res.json(comment);
});

async function startServer() {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
