import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyPrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    category: 'Software Development',
    targetModel: 'Claude',
    tags: '',
  });

  const categories = [
    'DevOps & Cloud',
    'Software Development',
    'System Architecture',
    'AI Art & Midjourney',
    'Writing & Copywriting',
    'Data & Analytics',
    'General Productivity',
  ];

  const models = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'General / Any LLM'];

  const fetchMyPrompts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/prompts/my-prompts');
      setPrompts(res.data || []);
    } catch (err) {
      console.error('Failed to load user prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPrompts();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      prompt: '',
      category: 'Software Development',
      targetModel: 'Claude',
      tags: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      title: p.title,
      description: p.description,
      prompt: p.prompt,
      category: p.category,
      targetModel: p.targetModel,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.prompt) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        const res = await API.put(`/prompts/${editingId}`, formData);
        setPrompts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      } else {
        const res = await API.post('/prompts', formData);
        setPrompts((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving prompt: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    try {
      await API.delete(`/prompts/${id}`);
      setPrompts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete prompt: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCopy = async (promptObj) => {
    try {
      await navigator.clipboard.writeText(promptObj.prompt);
      setCopiedId(promptObj._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const totalCopies = prompts.reduce((acc, p) => acc + (p.copies || 0), 0);
  const totalLikes = prompts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  return (
    <div className="container">
      {/* Studio Header */}
      <div className="studio-header">
        <div>
          <span className="studio-tag">PERSONAL WORKSPACE</span>
          <h1>My Prompt Studio</h1>
          <p className="studio-sub">Manage, edit, and track your custom AI prompt templates.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn-primary">
          + Create New Prompt
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <span className="stat-label">My Created Prompts</span>
          <span className="stat-number">{prompts.length}</span>
          <span className="stat-hint">Active in community repository</span>
        </div>
        <div className="studio-stat-card">
          <span className="stat-label">Community Copies</span>
          <span className="stat-number">{totalCopies}</span>
          <span className="stat-hint">Times your prompts were copied</span>
        </div>
        <div className="studio-stat-card">
          <span className="stat-label">Total Upvotes</span>
          <span className="stat-number">{totalLikes}</span>
          <span className="stat-hint">Community recommendations</span>
        </div>
      </div>

      {/* Prompts List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your prompt studio...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't created any prompts yet</h3>
          <p>Share your tested prompts with the developer community and track their popularity!</p>
          <button onClick={handleOpenCreate} className="btn-primary">
            + Create Your First Prompt
          </button>
        </div>
      ) : (
        <div className="prompts-grid">
          {prompts.map((p) => {
            const isCopied = copiedId === p._id;
            return (
              <div key={p._id} className="prompt-card">
                <div className="card-top-row">
                  <div className="badges-group">
                    <span className="cat-badge">{p.category}</span>
                    <span className="model-badge">{p.targetModel}</span>
                  </div>
                  <div className="card-stat-pill">📋 {p.copies || 0} copies</div>
                </div>

                <h3 className="prompt-card-title">{p.title}</h3>
                <p className="prompt-card-desc">{p.description}</p>

                <div className="prompt-content-box">
                  <pre className="prompt-text-preview">{p.prompt}</pre>
                </div>

                <div className="card-footer">
                  <div className="card-actions-left">
                    <button onClick={() => handleOpenEdit(p)} className="btn-edit-sm">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="btn-delete-sm">
                      🗑️ Delete
                    </button>
                  </div>

                  <button
                    className={`btn-copy ${isCopied ? 'copied' : ''}`}
                    onClick={() => handleCopy(p)}
                  >
                    {isCopied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Prompt' : 'Create New AI Prompt'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Prompt Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Production Dockerfile Architect for Node.js"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target AI Model *</label>
                  <select
                    value={formData.targetModel}
                    onChange={(e) => setFormData({ ...formData, targetModel: e.target.value })}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <input
                  type="text"
                  placeholder="Brief summary of what this prompt accomplishes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. docker, devops, security, ci-cd"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Prompt Content * (Use [VARIABLES] for placeholders)</label>
                <textarea
                  rows={8}
                  placeholder="Write your detailed prompt instructions here. Example: Act as a Senior DevOps Engineer. Write a [FRAMEWORK] configuration..."
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Prompt' : 'Publish Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
