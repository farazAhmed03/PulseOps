import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({ totalPosts: 0, totalUsers: 0 });
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const loadDashboardData = async () => {
    try {
      const [statsRes, postsRes, usersRes] = await Promise.all([
        API.get('/posts/admin/stats'),
        API.get('/posts'),
        API.get('/auth/users'),
      ]);
      setStats(statsRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const notify = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      notify('Both title and content are required.', 'error');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/posts/${editingId}`, {
          title,
          category: category.trim() || 'General',
          content,
        });
        notify('Article updated successfully.');
        setEditingId(null);
      } else {
        await API.post('/posts', {
          title,
          category: category.trim() || 'General',
          content,
        });
        notify('Article published successfully.');
      }

      setTitle('');
      setCategory('');
      setContent('');
      setActiveTab('posts');
      loadDashboardData();
    } catch (err) {
      notify(err.response?.data?.message || 'Action failed.', 'error');
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setCategory(post.category || 'General');
    setContent(post.content);
    setActiveTab('create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await API.delete(`/posts/${id}`);
      notify('Article deleted successfully.');
      loadDashboardData();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to delete article.', 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setContent('');
  };

  return (
    <div className="container admin-container">
      <div className="admin-header-row">
        <div>
          <h1>Administration Console</h1>
          <p className="admin-sub">
            Logged in as <strong>{user?.name}</strong> • Authorized as Administrator
          </p>
        </div>
      </div>

      {feedback.text && (
        <div className={`notification-banner ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* KPI Stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Published Articles</span>
            <span className="metric-pill">Active</span>
          </div>
          <div className="metric-value">{stats.totalPosts}</div>
          <span className="metric-foot">Available in public catalog</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Registered Accounts</span>
            <span className="metric-pill">Verified</span>
          </div>
          <div className="metric-value">{stats.totalUsers}</div>
          <span className="metric-foot">Platform members & contributors</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Access Level</span>
            <span className="metric-pill success">Authorized</span>
          </div>
          <div className="metric-value">Superuser</div>
          <span className="metric-foot">Full CRUD & permissions granted</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('posts'); handleCancel(); }}
        >
          Articles Directory ({posts.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          {editingId ? 'Edit Article' : 'Compose Article'}
        </button>
        <button
          className={`tab-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => { setActiveTab('users'); handleCancel(); }}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* TAB 1: ARTICLES TABLE */}
      {activeTab === 'posts' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <h3>Published Content Management</h3>
            <button className="btn-secondary-sm" onClick={() => setActiveTab('create')}>
              + New Article
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="empty-panel">No articles found in database.</div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Published On</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td className="table-title">{post.title}</td>
                      <td>
                        <span className="category-pill">{post.category || 'General'}</span>
                      </td>
                      <td>{post.author || 'Editorial Staff'}</td>
                      <td>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-action edit"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPOSE / EDIT FORM */}
      {activeTab === 'create' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <h3>{editingId ? 'Update Article' : 'Publish New Article'}</h3>
          </div>

          <form onSubmit={handleSaveArticle} className="admin-form">
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                placeholder="Enter a descriptive, engaging article headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category / Topic</label>
              <input
                type="text"
                placeholder="e.g. Cloud Architecture, AI, DevOps, General"
                list="admin-category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="admin-category-suggestions">
                <option value="Cloud Architecture" />
                <option value="Backend Development" />
                <option value="Web Development" />
                <option value="Artificial Intelligence" />
                <option value="DevOps & Infrastructure" />
                <option value="Cybersecurity" />
                <option value="General" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Article Content *</label>
              <textarea
                rows="8"
                placeholder="Compose the full body of the technical publication..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-primary">
                {editingId ? 'Save Changes' : 'Publish Article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    handleCancel();
                    setActiveTab('posts');
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <h3>Registered User Directory</h3>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Permission Role</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="table-title">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-pill ${u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
