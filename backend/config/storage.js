import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const postsFile = path.join(dataDir, 'posts.json');

export const loadStoredUsers = (defaultUsers) => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
    fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  } catch (err) {
    console.error('[Storage] Error loading stored users:', err.message);
    return defaultUsers;
  }
};

export const persistUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('[Storage] Error saving users:', err.message);
  }
};

export const loadStoredPosts = (defaultPosts) => {
  try {
    if (fs.existsSync(postsFile)) {
      const data = fs.readFileSync(postsFile, 'utf8');
      return JSON.parse(data);
    }
    fs.writeFileSync(postsFile, JSON.stringify(defaultPosts, null, 2));
    return defaultPosts;
  } catch (err) {
    console.error('[Storage] Error loading stored posts:', err.message);
    return defaultPosts;
  }
};

export const persistPosts = (posts) => {
  try {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('[Storage] Error saving posts:', err.message);
  }
};
