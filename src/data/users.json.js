// ==============================================
// USERS JSON DATA MODULE
// ==============================================

const STORAGE_KEY = 'users';

// Default empty JSON structure
const DEFAULT_USERS = [];

// Initialize users storage
export const initUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    console.log('✅ Users JSON initialized');
  }
};

// Get all users
export const getUsers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get user by ID
export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

// Save user
export const saveUser = (userData) => {
  const users = getUsers();
  
  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users, null, 2));
  console.log('✅ User saved:', newUser.email);
  return newUser;
};

// Update user
export const updateUser = (id, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users, null, 2));
    console.log('✅ User updated:', id);
    return users[index];
  }
  return null;
};

// Delete user
export const deleteUser = (id) => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered, null, 2));
  console.log('✅ User deleted:', id);
  return true;
};

// Find user by email
export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
};

// Find user by credentials (login)
export const findUserByCredentials = (email, password, type) => {
  const users = getUsers();
  return users.find(u => 
    u.email?.toLowerCase() === email.toLowerCase() && 
    u.password === password && 
    u.type === type
  ) || null;
};

// Get users by type
export const getUsersByType = (type) => {
  const users = getUsers();
  return users.filter(u => u.type === type);
};

export default {
  initUsers,
  getUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
  findUserByEmail,
  findUserByCredentials,
  getUsersByType
};