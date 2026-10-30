import Prompt from '../models/Prompt.js';
import User from '../models/User.js';
import { getMongoStatus } from '../config/db.js';
import { initialSeedPrompts } from '../config/seedPrompts.js';

// In-Memory store fallback
export let memoryPrompts = [...initialSeedPrompts];

// @desc    Seed default prompts into MongoDB if empty or outdated
export const ensureDefaultPrompts = async () => {
  if (!getMongoStatus()) return;
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    const adminId = adminUser ? adminUser._id : null;

    // Check if clean demo library is already active
    const samplePrompt = await Prompt.findOne({ title: 'React 18 & Tailwind CSS Responsive Hero Component' });
    if (!samplePrompt) {
      console.log('[PromptVerse] Loading clean standard demo community prompts library into MongoDB...');
      // Clean up previous initial prompts
      await Prompt.deleteMany({
        author: {
          $in: [
            'Staff DevOps Engineer',
            'Cloud Architect',
            'AppSec Specialist',
            'Principal Systems Architect',
            'DevOps Lead',
            'Creative AI Director',
          ],
        },
      });

      const seedsToInsert = initialSeedPrompts.map((p) => {
        const { _id, ...rest } = p;
        return {
          ...rest,
          user: adminId || '000000000000000000000000',
        };
      });

      await Prompt.insertMany(seedsToInsert);
      console.log(`[PromptVerse] Successfully loaded ${seedsToInsert.length} clean community demo prompts!`);
    }
  } catch (err) {
    console.error('[PromptVerse] Error seeding default prompts:', err.message);
  }
};

// @desc    Get all prompts (with optional search, category, model, and sort)
export const getPrompts = async (req, res) => {
  const { search, category, model, sort } = req.query;

  try {
    if (getMongoStatus()) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (model && model !== 'All') {
        query.targetModel = model;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { prompt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'popular') sortOption = { copies: -1 };
      if (sort === 'liked') sortOption = { 'likes.length': -1, createdAt: -1 };

      const prompts = await Prompt.find(query)
        .populate('user', 'name email role')
        .sort(sortOption);

      return res.json(prompts);
    }

    // In-memory fallback
    let filtered = [...memoryPrompts];

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (model && model !== 'All') {
      filtered = filtered.filter((p) => p.targetModel === model);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'popular') {
      filtered.sort((a, b) => (b.copies || 0) - (a.copies || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prompts created by logged-in user
export const getMyPrompts = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const prompts = await Prompt.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(prompts);
    }

    const userId = req.user._id.toString();
    const userPrompts = memoryPrompts.filter((p) => p.user?.toString() === userId || p.userId === userId);
    return res.json(userPrompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single prompt by ID
export const getPromptById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const prompt = await Prompt.findById(id).populate('user', 'name email role');
      if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
      return res.json(prompt);
    }

    const prompt = memoryPrompts.find((p) => p._id === id);
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    return res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new prompt
export const createPrompt = async (req, res) => {
  const { title, description, prompt, category, targetModel, tags } = req.body;

  if (!title || !description || !prompt) {
    return res.status(400).json({ message: 'Please provide title, description, and prompt content.' });
  }

  const tagsArray = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    if (getMongoStatus()) {
      const newPrompt = await Prompt.create({
        title,
        description,
        prompt,
        category: category || 'Software Development',
        targetModel: targetModel || 'General / Any LLM',
        tags: tagsArray,
        user: req.user._id,
        author: req.user.name || 'Community Member',
      });
      return res.status(201).json(newPrompt);
    }

    const newPrompt = {
      _id: 'prompt_' + Date.now(),
      title,
      description,
      prompt,
      category: category || 'Software Development',
      targetModel: targetModel || 'General / Any LLM',
      tags: tagsArray,
      user: req.user._id,
      userId: req.user._id.toString(),
      author: req.user.name || 'Community Member',
      copies: 0,
      likes: [],
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    memoryPrompts.unshift(newPrompt);
    return res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing prompt
export const updatePrompt = async (req, res) => {
  const { id } = req.params;
  const { title, description, prompt, category, targetModel, tags, isFeatured } = req.body;

  try {
    if (getMongoStatus()) {
      const existing = await Prompt.findById(id);
      if (!existing) return res.status(404).json({ message: 'Prompt not found' });

      const isOwner = existing.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own prompts.' });
      }

      if (title) existing.title = title;
      if (description) existing.description = description;
      if (prompt) existing.prompt = prompt;
      if (category) existing.category = category;
      if (targetModel) existing.targetModel = targetModel;
      if (tags) {
        existing.tags = Array.isArray(tags)
          ? tags
          : tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
      if (isAdmin && typeof isFeatured === 'boolean') {
        existing.isFeatured = isFeatured;
      }

      const updated = await existing.save();
      return res.json(updated);
    }

    const index = memoryPrompts.findIndex((p) => p._id === id);
    if (index === -1) return res.status(404).json({ message: 'Prompt not found' });

    const p = memoryPrompts[index];
    const isOwner = p.user?.toString() === req.user._id.toString() || p.userId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own prompts.' });
    }

    memoryPrompts[index] = {
      ...p,
      title: title || p.title,
      description: description || p.description,
      prompt: prompt || p.prompt,
      category: category || p.category,
      targetModel: targetModel || p.targetModel,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : p.tags,
      isFeatured: isAdmin && typeof isFeatured === 'boolean' ? isFeatured : p.isFeatured,
      updatedAt: new Date().toISOString(),
    };

    return res.json(memoryPrompts[index]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a prompt
export const deletePrompt = async (req, res) => {
  const { id } = req.params;

  try {
    if (getMongoStatus()) {
      const existing = await Prompt.findById(id);
      if (!existing) return res.status(404).json({ message: 'Prompt not found' });

      const isOwner = existing.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own prompts.' });
      }

      await existing.deleteOne();
      return res.json({ message: 'Prompt deleted successfully.' });
    }

    const index = memoryPrompts.findIndex((p) => p._id === id);
    if (index === -1) return res.status(404).json({ message: 'Prompt not found' });

    const p = memoryPrompts[index];
    const isOwner = p.user?.toString() === req.user._id.toString() || p.userId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own prompts.' });
    }

    memoryPrompts.splice(index, 1);
    return res.json({ message: 'Prompt deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment copy counter when user copies prompt to clipboard
export const copyPrompt = async (req, res) => {
  const { id } = req.params;

  try {
    if (getMongoStatus()) {
      const prompt = await Prompt.findByIdAndUpdate(
        id,
        { $inc: { copies: 1 } },
        { new: true }
      );
      if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
      return res.json({ message: 'Copy tracked', copies: prompt.copies });
    }

    const p = memoryPrompts.find((m) => m._id === id);
    if (p) {
      p.copies = (p.copies || 0) + 1;
      return res.json({ message: 'Copy tracked', copies: p.copies });
    }
    return res.status(404).json({ message: 'Prompt not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle upvote / like on a prompt
export const toggleLikePrompt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    if (getMongoStatus()) {
      const prompt = await Prompt.findById(id);
      if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

      const hasLiked = prompt.likes.includes(userId);
      if (hasLiked) {
        prompt.likes = prompt.likes.filter((uid) => uid.toString() !== userId.toString());
      } else {
        prompt.likes.push(userId);
      }

      await prompt.save();
      return res.json({ liked: !hasLiked, totalLikes: prompt.likes.length });
    }

    const p = memoryPrompts.find((m) => m._id === id);
    if (!p) return res.status(404).json({ message: 'Prompt not found' });

    if (!p.likes) p.likes = [];
    const uidStr = userId.toString();
    const hasLiked = p.likes.includes(uidStr);

    if (hasLiked) {
      p.likes = p.likes.filter((u) => u !== uidStr);
    } else {
      p.likes.push(uidStr);
    }

    return res.json({ liked: !hasLiked, totalLikes: p.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Category Statistics for navigation counters
export const getCategoriesStats = async (req, res) => {
  try {
    let allPrompts = [];
    if (getMongoStatus()) {
      allPrompts = await Prompt.find();
    } else {
      allPrompts = memoryPrompts;
    }

    const total = allPrompts.length;
    const categoriesCount = {};
    const modelsCount = {};

    allPrompts.forEach((p) => {
      categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
      modelsCount[p.targetModel] = (modelsCount[p.targetModel] || 0) + 1;
    });

    return res.json({
      totalPrompts: total,
      categories: categoriesCount,
      models: modelsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
