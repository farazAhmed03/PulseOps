import Post from '../models/Post.js';
import User from '../models/User.js';
import { getMongoStatus } from '../config/db.js';
import { memoryUsers } from './authController.js';
import { loadStoredPosts, persistPosts } from '../config/storage.js';

const defaultSeedPosts = [
  {
    _id: 'post_1',
    title: 'Architecting Scalable Cloud Applications on AWS EC2',
    category: 'Cloud Architecture',
    content: 'Deploying high-performance web applications requires resilient infrastructure patterns. Key considerations include reverse proxy configurations using Nginx, automated process orchestration with PM2, decoupled services, and secure environment variable isolation. When preparing for cloud deployment, maintaining clear separation between frontend client bundles and backend RESTful APIs simplifies scaling and monitoring.',
    author: 'Site Administrator',
    userId: 'admin_master',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'post_2',
    title: 'Design Principles for Modern REST APIs with Node.js and Express',
    category: 'Backend Development',
    content: 'Structured MVC (Model-View-Controller) design fosters code maintainability across growing engineering teams. By segregating business logic into controllers, data schemas into models, and routing into dedicated modules, applications benefit from predictable testability, unified error handling, and robust middleware pipelines for JWT authentication.',
    author: 'Site Administrator',
    userId: 'admin_master',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Persistent posts store
let memoryPosts = loadStoredPosts(defaultSeedPosts);

export const getPosts = async (req, res) => {
  const { search } = req.query;

  try {
    if (getMongoStatus()) {
      let query = {};
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
          ],
        };
      }
      const posts = await Post.find(query).populate('user', 'name email role').sort({ createdAt: -1 });
      return res.json(posts);
    }

    // In-memory persistent mode
    let filtered = [...memoryPosts];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          p.content.toLowerCase().includes(q) ||
          (p.author && p.author.toLowerCase().includes(q))
      );
    }
    return res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    if (getMongoStatus()) {
      const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(posts);
    }

    const myPosts = memoryPosts.filter((p) => p.userId && p.userId.toString() === currentUserId);
    return res.json(myPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const post = await Post.findById(req.params.id).populate('user', 'name email role');
      if (!post) return res.status(404).json({ message: 'Article not found.' });
      return res.json(post);
    }
    const post = memoryPosts.find((p) => p._id === req.params.id);
    if (!post) return res.status(404).json({ message: 'Article not found.' });
    return res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required fields.' });
  }

  const assignedCategory = category?.trim() || 'General';

  try {
    const authorName = req.user.name || 'Anonymous Contributor';
    const currentUserId = req.user._id.toString();

    if (getMongoStatus()) {
      const newPost = await Post.create({
        title,
        category: assignedCategory,
        content,
        author: authorName,
        user: req.user._id,
      });
      return res.status(201).json(newPost);
    }

    const newPost = {
      _id: 'post_' + Date.now(),
      title,
      category: assignedCategory,
      content,
      author: authorName,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryPosts.unshift(newPost);
    persistPosts(memoryPosts); // Persist to disk

    return res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { title, content, category } = req.body;
  const currentUserId = req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  try {
    if (getMongoStatus()) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Article not found.' });

      const isOwner = post.user && post.user.toString() === currentUserId;
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own articles.' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      if (category !== undefined) post.category = category.trim() || 'General';
      const updatedPost = await post.save();
      return res.json(updatedPost);
    }

    const index = memoryPosts.findIndex((p) => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Article not found.' });

    const post = memoryPosts[index];
    const isOwner = post.userId && post.userId.toString() === currentUserId;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own articles.' });
    }

    memoryPosts[index] = {
      ...post,
      title: title !== undefined ? title : post.title,
      content: content !== undefined ? content : post.content,
      category: category !== undefined ? (category.trim() || 'General') : (post.category || 'General'),
      updatedAt: new Date().toISOString(),
    };
    persistPosts(memoryPosts); // Persist to disk

    return res.json(memoryPosts[index]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const currentUserId = req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  try {
    if (getMongoStatus()) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Article not found.' });

      const isOwner = post.user && post.user.toString() === currentUserId;
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own articles.' });
      }

      await post.deleteOne();
      return res.json({ message: 'Article deleted successfully.' });
    }

    const index = memoryPosts.findIndex((p) => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Article not found.' });

    const post = memoryPosts[index];
    const isOwner = post.userId && post.userId.toString() === currentUserId;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own articles.' });
    }

    memoryPosts.splice(index, 1);
    persistPosts(memoryPosts); // Persist to disk

    return res.json({ message: 'Article deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    let totalPosts = 0;
    let totalUsers = 0;

    if (getMongoStatus()) {
      totalPosts = await Post.countDocuments();
      totalUsers = await User.countDocuments();
    } else {
      totalPosts = memoryPosts.length;
      totalUsers = memoryUsers.length;
    }

    res.json({
      totalPosts,
      totalUsers,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
