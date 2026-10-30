import Prompt from '../models/Prompt.js';
import User from '../models/User.js';
import { getMongoStatus } from '../config/db.js';

// Pre-seeded Battle-Tested Prompts
const initialSeedPrompts = [
  {
    _id: 'seed_prompt_1',
    title: 'Production Dockerfile Architect for Node.js / Python',
    description: 'Generates secure, multi-stage, non-root production Dockerfiles with minimal image layers and optimal caching.',
    category: 'DevOps & Cloud',
    targetModel: 'Claude',
    tags: ['docker', 'devops', 'security', 'containers'],
    author: 'Staff DevOps Engineer',
    prompt: `You are a Principal Cloud & DevOps Security Engineer. Your task is to write a hardened, production-ready multi-stage Dockerfile for a [LANGUAGE/FRAMEWORK, e.g. Node.js 20 / Python 3.11] application.

Requirements:
1. Multi-Stage Build: Builder stage for installing dependencies and compiling build artifacts, runtime stage using a lightweight minimal base (Alpine or Distroless).
2. Zero-Root Privilege: Must execute as a non-privileged user (e.g. USER node / USER appuser).
3. Layer Optimization: Copy package manifests first to leverage Docker build cache.
4. Clean Signals: Handle PID 1 graceful shutdown (SIGTERM/SIGINT) with tini or node directly.
5. Provide a matching .dockerignore file and a sample docker run command with environment variables.`,
    copies: 142,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_2',
    title: 'Kubernetes Resilient Pod Deployment & Ingress Generator',
    description: 'Creates complete, production-grade Kubernetes manifests including Deployment, ClusterIP Service, Ingress, and Health Probes.',
    category: 'DevOps & Cloud',
    targetModel: 'ChatGPT',
    tags: ['kubernetes', 'k8s', 'cloud', 'devops'],
    author: 'Cloud Architect',
    prompt: `Act as a Senior Kubernetes Reliability Engineer. Generate a comprehensive Kubernetes manifest YAML for deploying a microservice named "[SERVICE_NAME]" in namespace "[NAMESPACE]".

Must include:
- Deployment with [REPLICAS, e.g. 3] replicas, rollingUpdate strategy (maxSurge: 1, maxUnavailable: 0).
- Resource requests and limits (CPU and Memory).
- Liveness and Readiness probes using HTTP GET endpoints at "/healthz" and "/ready".
- ClusterIP Service exposing port [PORT, e.g. 8080].
- Nginx Ingress resource with TLS annotations and path "/[ROUTE_PREFIX]".
- HorizontalPodAutoscaler (HPA) targeting 70% average CPU utilization.`,
    copies: 98,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_3',
    title: 'Full-Stack Code Security & Vulnerability Auditor',
    description: 'Thoroughly reviews code for OWASP Top 10 vulnerabilities, SQL injection, XSS, and memory leaks with remediation patches.',
    category: 'Software Development',
    targetModel: 'Claude',
    tags: ['security', 'code-review', 'owasp', 'audit'],
    author: 'AppSec Specialist',
    prompt: `You are a Lead Application Security (AppSec) Auditor. Review the following code snippet written in [LANGUAGE/FRAMEWORK]:

Code:
\`\`\`[LANGUAGE]
[PASTE_CODE_HERE]
\`\`\`

Perform an in-depth security audit focusing on:
1. OWASP Top 10 Vulnerabilities (SQL/NoSQL Injection, XSS, Broken Access Control, CSRF, Sensitive Data Exposure).
2. Concurrency, Race Conditions, and Memory Management risks.
3. Insecure Dependencies or outdated cryptography algorithms.
For each vulnerability found:
- Explain the exploit scenario and severity (Critical / High / Medium).
- Provide the exact corrected code snippet with defense-in-depth best practices.`,
    copies: 215,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_4',
    title: 'Distributed System Architecture & High-Availability Designer',
    description: 'Designs scalable, fault-tolerant cloud architectures with database replication, caching, and message queues.',
    category: 'System Architecture',
    targetModel: 'Claude',
    tags: ['system-design', 'architecture', 'scalability', 'microservices'],
    author: 'Principal Systems Architect',
    prompt: `Act as a Senior Distributed Systems Architect. Design a scalable, resilient system architecture for [USE_CASE, e.g. a real-time ride-sharing dispatch system handling 100k requests/sec].

Your design document must cover:
1. High-Level Architecture Diagram (described in text / Mermaid diagram).
2. Data Flow & Ingestion: API Gateway, Load Balancers, Event Streaming (Kafka / RabbitMQ).
3. Database Strategy: Primary storage (SQL vs NoSQL), Read Replicas, Partitioning / Sharding, and Cache Layer (Redis cluster).
4. Failure Scenarios & Mitigation: Circuit breakers, graceful degradation, and cross-region disaster recovery (RTO/RPO targets).
5. Observability Plan: Distributed tracing, metrics aggregation, and alert thresholds.`,
    copies: 176,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_5',
    title: 'Automated GitHub Actions CI/CD Pipeline Architect',
    description: 'Builds end-to-end GitHub Actions workflow YAML for automated linting, testing, Docker image building, and AWS EC2 deployment.',
    category: 'DevOps & Cloud',
    targetModel: 'General / Any LLM',
    tags: ['github-actions', 'ci-cd', 'automation', 'aws'],
    author: 'DevOps Lead',
    prompt: `Act as an expert CI/CD Pipeline Automation Engineer. Create a production-ready GitHub Actions workflow file (\`.github/workflows/deploy.yml\`) for a [TECH_STACK, e.g. Node.js React & Docker] application.

Pipeline Requirements:
1. Trigger on push and pull requests to "main" branch.
2. Job 1 (CI): Linting, unit tests, and build check across Matrix Node versions.
3. Job 2 (Docker Build & Scan): Multi-stage Docker build with vulnerability scanning (Trivy or Docker Scout).
4. Job 3 (CD / Deploy): Securely SSH into remote AWS EC2 Ubuntu instance using GitHub Repository Secrets (EC2_HOST, EC2_SSH_KEY), pull latest changes, and execute \`docker compose up -d --build\` with zero downtime.`,
    copies: 310,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_6',
    title: 'Photorealistic Cinematic Image Architect for Midjourney v6',
    description: 'Generates detailed, visually stunning Midjourney v6 prompt prompts with photorealistic lighting, 8k resolution, and aspect ratios.',
    category: 'AI Art & Midjourney',
    targetModel: 'Midjourney',
    tags: ['midjourney', 'ai-art', 'cinematic', 'photorealistic'],
    author: 'Creative AI Director',
    prompt: `Create a professional Midjourney v6 prompt for [SUBJECT/THEME, e.g. an autonomous cybernetic server room on Mars].

Structure the prompt following modern Midjourney syntax:
1. Core Subject & Action: Clear, evocative description of the central visual focus.
2. Art Medium & Style: [e.g. 35mm film photograph, cinematic still, hyper-detailed render].
3. Environment & Lighting: Volumetric lighting, neon cyan rim lights, foggy atmospheric dust, ray-tracing reflections.
4. Camera & Lens Specifications: Shot on Sony A7R V, 50mm f/1.2 lens, shallow depth of field, crisp focus.
5. Parameters: Include essential Midjourney flags (e.g. \`--ar 16:9 --v 6.1 --style raw --q 2 --s 250\`).`,
    copies: 87,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
];

// In-Memory store fallback
export let memoryPrompts = [...initialSeedPrompts];

// @desc    Seed default prompts into MongoDB if empty
export const ensureDefaultPrompts = async () => {
  if (!getMongoStatus()) return;
  try {
    const count = await Prompt.countDocuments();
    if (count === 0) {
      console.log('[PromptVerse] Seeding initial curated AI prompt library into MongoDB...');
      const adminUser = await User.findOne({ role: 'admin' });
      const adminId = adminUser ? adminUser._id : null;

      const seedsToInsert = initialSeedPrompts.map((p) => {
        const { _id, ...rest } = p;
        return {
          ...rest,
          user: adminId || '000000000000000000000000',
        };
      });

      await Prompt.insertMany(seedsToInsert);
      console.log(`[PromptVerse] Successfully loaded ${seedsToInsert.length} initial prompts!`);
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
