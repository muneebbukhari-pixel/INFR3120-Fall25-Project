const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

async function create(username, email, password) {
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    throw new Error('Email already exists');
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password: hashed
  };

  users.push(newUser);
  writeUsers(users);

  // Return user without password
  return { id: newUser.id, username: newUser.username, email: newUser.email };
}

async function validate(email, password) {
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return { id: user.id, username: user.username, email: user.email };
}

async function findByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email) || null;
}

module.exports = {
  create,
  validate,
  findByEmail
};
