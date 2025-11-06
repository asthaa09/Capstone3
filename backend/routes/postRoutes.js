import express from 'express';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  const post = new Post({
    author: req.userId,
    content: req.body.content,
    image: req.file ? req.file.filename : null
  });
  await post.save();
  res.json(post);
});

// Get feed
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').populate('comments').sort({ createdAt: -1 });
  res.json(posts);
});

// Like post
router.put('/like/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.userId)) post.likes.push(req.userId);
  else post.likes.pull(req.userId);
  await post.save();
  res.json(post);
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
  await post.remove();
  res.json({ message: 'Post deleted' });
});

export default router;
